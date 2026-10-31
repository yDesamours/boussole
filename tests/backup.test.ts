import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import {
  BackupError,
  backupFileName,
  COPY_SUFFIX,
  createBackup,
  parseBackup,
  planImport,
  serializeBackup,
} from '@/lib/backup';
import { createNextIteration, createProject, currentIteration } from '@/lib/project';
import { db } from '@/db/database';
import { useProjectsStore } from '@/stores/projects';
import type { Project } from '@/types/schema';

function sampleProject(name = 'Mon projet'): Project {
  const project = createProject(name, 'Une idée vague', new Date('2026-10-01T10:00:00Z'));
  const first = currentIteration(project);
  first.phases.comprendre.answers.problemeReel = 'Un vrai problème';
  first.phases.comprendre.answers.pourquoi = ['Premier', 'Deuxième'];
  first.phases.comprendre.checklist.creuse = true;
  project.iterations.push(createNextIteration(first, 'Ce qu\'on a appris', true, new Date('2026-10-05T10:00:00Z')));
  project.updatedAt = '2026-10-05T10:00:00.000Z';
  return project;
}

const roundTrip = (projects: Project[]) => parseBackup(serializeBackup(createBackup(projects)));

describe('export puis import', () => {
  it('restitue les projets à l\'identique, itérations, réponses et checklists comprises', () => {
    const project = sampleProject();
    expect(roundTrip([project])).toEqual([project]);
  });

  it('nomme le fichier selon son contenu', () => {
    const now = new Date(2026, 9, 26);
    expect(backupFileName([sampleProject('Événements près de chez moi')], now)).toBe(
      'boussole-evenements-pres-de-chez-moi-2026-10-26.json',
    );
    expect(backupFileName([sampleProject(), sampleProject()], now)).toBe('boussole-sauvegarde-2026-10-26.json');
    // « Exporter tous mes projets » reste une sauvegarde complète, même avec un seul projet.
    expect(backupFileName([sampleProject()], now, true)).toBe('boussole-sauvegarde-2026-10-26.json');
  });
});

describe('fichiers refusés', () => {
  const file = () => JSON.parse(serializeBackup(createBackup([sampleProject()])));

  it.each([
    ['du texte qui n\'est pas du JSON', 'bonjour', 'pas lisible'],
    ['un JSON qui ne vient pas de Boussole', '{"hello": 1}', "n'est pas une sauvegarde Boussole"],
    ['une version de format plus récente', JSON.stringify({ ...file(), formatVersion: 99 }), 'plus récente'],
  ])('refuse %s', (_, text, message) => {
    expect(() => parseBackup(text)).toThrow(BackupError);
    expect(() => parseBackup(text)).toThrow(message);
  });

  it('refuse un projet abîmé en le nommant', () => {
    const data = file();
    delete data.projects[0].iterations;
    expect(() => parseBackup(JSON.stringify(data))).toThrow('projet « Mon projet »');
  });

  it('refuse une réponse de type inattendu', () => {
    const data = file();
    data.projects[0].iterations[0].phases.comprendre.answers.problemeReel = 42;
    expect(() => parseBackup(JSON.stringify(data))).toThrow(BackupError);
  });

  it('complète une phase absente au lieu de refuser le fichier', () => {
    const data = file();
    delete data.projects[0].iterations[0].phases.confronter;
    const [project] = parseBackup(JSON.stringify(data));
    expect(project?.iterations[0]?.phases.confronter).toEqual({ answers: {}, checklist: {} });
  });

  it('ignore les propriétés inconnues', () => {
    const data = file();
    data.projects[0].intrus = 'à retirer';
    expect(parseBackup(JSON.stringify(data))[0]).not.toHaveProperty('intrus');
  });
});

describe('plan d\'import', () => {
  it('ajoute un projet absent de l\'appareil', () => {
    const [item] = planImport([], [sampleProject()]);
    expect(item?.action).toBe('add');
  });

  it('ignore un projet identique', () => {
    const project = sampleProject();
    expect(planImport([project], roundTrip([project]))[0]?.action).toBe('skip');
  });

  it('remplace par la version du fichier quand elle est plus récente', () => {
    const local = sampleProject();
    const incoming = { ...structuredClone(local), updatedAt: '2026-10-20T10:00:00.000Z', name: 'Renommé' };
    const [item] = planImport([local], [incoming]);
    expect(item?.action).toBe('update');
    expect(item?.project.id).toBe(local.id);
  });

  it('n\'écrase jamais une version plus récente de l\'appareil : le fichier devient une copie', () => {
    const local = { ...sampleProject(), updatedAt: '2026-10-25T10:00:00.000Z' };
    const incoming = { ...structuredClone(local), updatedAt: '2026-10-10T10:00:00.000Z', name: 'Ancienne version' };
    const [item] = planImport([local], [incoming]);
    expect(item?.action).toBe('copy');
    expect(item?.project.id).not.toBe(local.id);
    expect(item?.project.name).toBe('Ancienne version' + COPY_SUFFIX);
    expect(item?.sourceName).toBe('Ancienne version');
  });

  it('fait une copie aussi quand les contenus diffèrent à date égale', () => {
    const local = sampleProject();
    const incoming = { ...structuredClone(local), name: 'Autre' };
    expect(planImport([local], [incoming])[0]?.action).toBe('copy');
  });
});

describe('import dans le store', () => {
  beforeEach(async () => {
    await db.projects.clear();
    setActivePinia(createPinia());
  });

  it('exporte depuis un appareil et importe dans un autre, vide', async () => {
    const source = useProjectsStore();
    await source.load();
    const id = await source.addProject('Projet voyageur', 'Une idée');
    source.setAnswer(id, 'comprendre', 'problemeReel', 'Écrit avant l\'export');
    const { content } = await source.exportBackup();

    await db.projects.clear();
    setActivePinia(createPinia());
    const target = useProjectsStore();
    await target.load();
    expect(target.projects).toHaveLength(0);

    await target.applyImport(planImport(target.projects, parseBackup(content)));
    expect(target.getProject(id)?.iterations[0]?.phases.comprendre.answers.problemeReel).toBe('Écrit avant l\'export');
    expect((await db.projects.get(id))?.name).toBe('Projet voyageur');
  });

  it('conserve le projet local et ajoute la copie en cas de conflit', async () => {
    const store = useProjectsStore();
    await store.load();
    const id = await store.addProject('Projet', 'Idée');
    const { content } = await store.exportBackup([id]);

    await new Promise((r) => setTimeout(r, 5));
    store.setAnswer(id, 'comprendre', 'problemeReel', 'Modifié après l\'export');
    await store.flush();

    await store.applyImport(planImport(store.projects, parseBackup(content)));
    expect(store.projects).toHaveLength(2);
    expect(store.getProject(id)?.iterations[0]?.phases.comprendre.answers.problemeReel).toBe('Modifié après l\'export');
    expect(store.projects.some((p) => p.name === 'Projet' + COPY_SUFFIX)).toBe(true);
  });
});

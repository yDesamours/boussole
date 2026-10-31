import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { db } from '@/db/database';
import { SAVE_DELAY_MS, useProjectsStore } from '@/stores/projects';

async function freshStore() {
  setActivePinia(createPinia());
  const store = useProjectsStore();
  await store.load();
  return store;
}

beforeEach(async () => {
  await db.projects.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('store des projets', () => {
  it('crée un projet et le retrouve après rechargement', async () => {
    const store = await freshStore();
    const id = await store.addProject('Boussole', 'Mon idée');

    const reloaded = await freshStore();
    expect(reloaded.getProject(id)?.name).toBe('Boussole');
    expect(reloaded.getProject(id)?.iterations[0]?.startingPoint).toBe('Mon idée');
  });

  it('écrit les réponses peu après la dernière frappe, puis signale « enregistré »', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const store = await freshStore();
    const id = await store.addProject('P', 'Idée');

    store.setAnswer(id, 'comprendre', 'problemeReel', 'Brouillon');
    store.setAnswer(id, 'comprendre', 'problemeReel', 'Version finale');
    expect(store.saveState).toBe('saving');

    await vi.advanceTimersByTimeAsync(SAVE_DELAY_MS + 10);
    await vi.waitFor(() => expect(store.saveState).toBe('saved'));

    const stored = await db.projects.get(id);
    expect(stored?.iterations[0]?.phases.comprendre.answers.problemeReel).toBe('Version finale');
  });

  it('flush écrit immédiatement ce qui est en attente', async () => {
    const store = await freshStore();
    const id = await store.addProject('P', 'Idée');
    store.setAnswer(id, 'comprendre', 'pourquoi', ['Premier pourquoi']);
    await store.flush();

    const stored = await db.projects.get(id);
    expect(stored?.iterations[0]?.phases.comprendre.answers.pourquoi).toEqual(['Premier pourquoi']);
  });

  it('démarre une nouvelle itération et ne modifie plus que celle-ci', async () => {
    const store = await freshStore();
    const id = await store.addProject('P', 'Idée');
    store.setAnswer(id, 'comprendre', 'problemeReel', 'Problème v1');
    store.setChecklistItem(id, 'comprendre', 'creuse', true);

    const number = await store.startIteration(id, 'Sacha ne revient pas', true);
    expect(number).toBe(2);

    store.setAnswer(id, 'comprendre', 'problemeReel', 'Problème v2');
    await store.flush();

    const stored = await db.projects.get(id);
    expect(stored?.iterations).toHaveLength(2);
    expect(stored?.iterations[0]?.phases.comprendre.answers.problemeReel).toBe('Problème v1');
    expect(stored?.iterations[0]?.phases.comprendre.checklist.creuse).toBe(true);
    expect(stored?.iterations[1]?.phases.comprendre.answers.problemeReel).toBe('Problème v2');
    expect(stored?.iterations[1]?.phases.comprendre.checklist).toEqual({});
    expect(stored?.iterations[1]?.startingPoint).toBe('Sacha ne revient pas');
  });

  it('supprime un projet, y compris une écriture en attente', async () => {
    const store = await freshStore();
    const id = await store.addProject('P', 'Idée');
    store.setAnswer(id, 'comprendre', 'problemeReel', 'En attente');
    await store.deleteProject(id);
    await store.flush();

    expect(store.getProject(id)).toBeUndefined();
    expect(await db.projects.get(id)).toBeUndefined();
  });

  it('trie les projets du plus récemment modifié au plus ancien', async () => {
    const store = await freshStore();
    const first = await store.addProject('Ancien', 'Idée');
    await new Promise((r) => setTimeout(r, 5));
    await store.addProject('Récent', 'Idée');
    expect(store.sortedProjects.map((p) => p.name)).toEqual(['Récent', 'Ancien']);

    await new Promise((r) => setTimeout(r, 5));
    store.setAnswer(first, 'comprendre', 'problemeReel', 'Modifié');
    expect(store.sortedProjects[0]?.name).toBe('Ancien');
  });
});

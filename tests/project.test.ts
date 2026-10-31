import { describe, expect, it } from 'vitest';
import {
  createNextIteration,
  createProject,
  currentIteration,
  isAnswered,
  isCurrentIteration,
  phaseStatus,
} from '@/lib/project';
import { comprendre } from '@/content/comprendre';

describe('createProject', () => {
  it('démarre avec une première itération dont le point de départ est l\'idée vague', () => {
    const project = createProject('  Boussole ', '  Un outil pour structurer mes idées  ');
    expect(project.name).toBe('Boussole');
    expect(project.iterations).toHaveLength(1);
    expect(project.iterations[0]?.number).toBe(1);
    expect(project.iterations[0]?.startingPoint).toBe('Un outil pour structurer mes idées');
    expect(Object.keys(project.iterations[0]!.phases)).toHaveLength(6);
  });
});

describe('createNextIteration', () => {
  const project = createProject('P', 'Idée');
  const first = currentIteration(project);
  first.phases.comprendre.answers.problemeReel = 'Un vrai problème';
  first.phases.comprendre.checklist.creuse = true;

  it('reprend les réponses mais remet toujours les checklists à zéro', () => {
    const next = createNextIteration(first, 'Sacha ne revient pas', true);
    expect(next.number).toBe(2);
    expect(next.startingPoint).toBe('Sacha ne revient pas');
    expect(next.phases.comprendre.answers.problemeReel).toBe('Un vrai problème');
    expect(next.phases.comprendre.checklist).toEqual({});
  });

  it('copie les réponses au lieu de les partager', () => {
    const next = createNextIteration(first, 'Appris', true);
    next.phases.comprendre.answers.problemeReel = 'Modifié dans la v2';
    expect(first.phases.comprendre.answers.problemeReel).toBe('Un vrai problème');
  });

  it('peut repartir d\'une page blanche', () => {
    const next = createNextIteration(first, 'Appris', false);
    expect(next.phases.comprendre.answers).toEqual({});
  });
});

describe('itération en cours', () => {
  it('est toujours la dernière', () => {
    const project = createProject('P', 'Idée');
    const first = currentIteration(project);
    project.iterations.push(createNextIteration(first, 'Appris', false));
    expect(currentIteration(project).number).toBe(2);
    expect(isCurrentIteration(project, first)).toBe(false);
  });
});

describe('isAnswered', () => {
  it.each([
    [undefined, false],
    ['', false],
    ['   ', false],
    ['texte', true],
    [[''], false],
    [['', 'item'], true],
    [[{ a: '', b: ' ' }], false],
    [[{ a: '', b: 'x' }], true],
  ] as const)('%j → %s', (value, expected) => {
    expect(isAnswered(value as never)).toBe(expected);
  });
});

describe('phaseStatus', () => {
  it('passe de « pas commencée » à « incomplète » puis « terminée »', () => {
    const progress = { answers: {}, checklist: {} as Record<string, boolean> };
    expect(phaseStatus(comprendre, progress)).toBe('notStarted');

    progress.answers = { problemeReel: 'Quelque chose' };
    expect(phaseStatus(comprendre, progress)).toBe('incomplete');

    for (const item of comprendre.checklist.slice(0, -1)) progress.checklist[item.id] = true;
    expect(phaseStatus(comprendre, progress)).toBe('incomplete');

    progress.checklist[comprendre.checklist.at(-1)!.id] = true;
    expect(phaseStatus(comprendre, progress)).toBe('done');
  });

  it('ne considère jamais terminée une phase dont le contenu n\'existe pas', () => {
    expect(phaseStatus(undefined, { answers: { x: 'y' }, checklist: { a: true } })).toBe('incomplete');
  });
});

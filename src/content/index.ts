import type { Framework, PhaseDefinition, PhaseId } from '../types/schema';
import { comprendre } from './comprendre';
import { explorer } from './explorer';
import { cadrer } from './cadrer';
import { planifier } from './planifier';
import { construire } from './construire';
import { confronter } from './confronter';

/** Le framework Boussole : les six phases, dans l'ordre. */
export const framework: Framework = {
  version: '1.0.0',
  phases: [comprendre, explorer, cadrer, planifier, construire, confronter],

  globalVaguenessRules: [
    {
      terms: ['etc'],
      message: 'Un « etc. » cache souvent ce qu\'on n\'a pas encore réfléchi. Peux-tu le remplacer par ce qu\'il recouvre ?',
    },
    {
      terms: ['plein de', 'beaucoup de', 'divers', 'des trucs', 'des choses', 'quelque chose'],
      message: 'Cette formulation reste floue. Peux-tu être plus précis ?',
    },
    {
      terms: ['peut-être', 'éventuellement', 'je pense que', 'je crois que'],
      message:
        'Tu exprimes une hypothèse. C\'est normal à ce stade : garde-la, mais note qu\'elle devra être vérifiée.',
    },
  ],
};

/**
 * Les six phases dans l'ordre, y compris celles dont le contenu n'est pas encore rédigé.
 * Permet d'afficher le parcours complet dès le début.
 */
export const PHASE_OUTLINE: { id: PhaseId; order: number; title: string; summary: string }[] = [
  { id: 'comprendre', order: 1, title: 'Comprendre', summary: 'Le vrai problème, pour qui, et comment savoir qu\'il est résolu.' },
  { id: 'explorer', order: 2, title: 'Explorer', summary: 'Toutes les approches possibles, confrontées au persona.' },
  { id: 'cadrer', order: 3, title: 'Cadrer', summary: 'Le MVP : ce qu\'on construit, et ce qu\'on ne construit pas.' },
  { id: 'planifier', order: 4, title: 'Planifier', summary: 'Les inconnues, les technologies, les cycles.' },
  { id: 'construire', order: 5, title: 'Construire', summary: 'Des cycles courts : développer, tester, valider.' },
  { id: 'confronter', order: 6, title: 'Confronter', summary: 'Face à de vrais utilisateurs, mesurer et apprendre.' },
];

export const PHASE_IDS: PhaseId[] = PHASE_OUTLINE.map((p) => p.id);

/** Renvoie le contenu d'une phase, ou undefined si elle n'est pas encore rédigée. */
export function getPhase(id: PhaseId): PhaseDefinition | undefined {
  return framework.phases.find((p) => p.id === id);
}

export function isPhaseId(value: unknown): value is PhaseId {
  return typeof value === 'string' && (PHASE_IDS as string[]).includes(value);
}

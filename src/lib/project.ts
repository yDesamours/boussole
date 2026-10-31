import type {
  FieldValue,
  Iteration,
  PhaseDefinition,
  PhaseId,
  PhaseProgress,
  PhaseStatus,
  Project,
} from '@/types/schema';
import { framework, PHASE_IDS } from '@/content';

function emptyProgress(): PhaseProgress {
  return { answers: {}, checklist: {} };
}

function emptyPhases(): Record<PhaseId, PhaseProgress> {
  return Object.fromEntries(PHASE_IDS.map((id) => [id, emptyProgress()])) as Record<PhaseId, PhaseProgress>;
}

function newIteration(number: number, startingPoint: string, now: Date): Iteration {
  return {
    id: crypto.randomUUID(),
    number,
    startingPoint: startingPoint.trim(),
    createdAt: now.toISOString(),
    frameworkVersion: framework.version,
    phases: emptyPhases(),
  };
}

/** Un nouveau projet démarre avec sa première itération, dont le point de départ est l'idée vague. */
export function createProject(name: string, initialIdea: string, now = new Date()): Project {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    iterations: [newIteration(1, initialIdea, now)],
  };
}

/**
 * Crée l'itération suivante.
 * Si carryOverAnswers est vrai, les réponses de l'itération précédente sont reprises pour être affinées.
 * Les checklists repartent toujours à zéro : chaque critère doit être revérifié avec les nouveaux faits.
 */
export function createNextIteration(
  previous: Iteration,
  startingPoint: string,
  carryOverAnswers: boolean,
  now = new Date(),
): Iteration {
  const next = newIteration(previous.number + 1, startingPoint, now);
  if (carryOverAnswers) {
    for (const id of PHASE_IDS) {
      // Copie JSON plutôt que structuredClone : les données peuvent être des proxys réactifs de Vue.
      next.phases[id].answers = JSON.parse(JSON.stringify(previous.phases[id].answers));
    }
  }
  return next;
}

/** L'itération en cours : la dernière. */
export function currentIteration(project: Project): Iteration {
  const last = project.iterations.at(-1);
  if (!last) throw new Error(`Le projet ${project.id} n'a aucune itération.`);
  return last;
}

export function findIteration(project: Project, number: number): Iteration | undefined {
  return project.iterations.find((it) => it.number === number);
}

export function isCurrentIteration(project: Project, iteration: Iteration): boolean {
  return currentIteration(project).id === iteration.id;
}

/** Une réponse compte si elle contient au moins un caractère non blanc, où qu'il soit. */
export function isAnswered(value: FieldValue | undefined): boolean {
  if (value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return value.some((item) =>
    typeof item === 'string' ? item.trim().length > 0 : Object.values(item).some((cell) => cell.trim().length > 0),
  );
}

/**
 * Le statut est calculé, jamais stocké.
 * - notStarted : aucune réponse, aucune case cochée
 * - done       : toute la checklist de la phase est cochée
 * - incomplete : tout le reste
 */
export function phaseStatus(definition: PhaseDefinition | undefined, progress: PhaseProgress | undefined): PhaseStatus {
  if (!progress) return 'notStarted';
  const hasAnswer = Object.values(progress.answers).some(isAnswered);
  const hasChecked = Object.values(progress.checklist).some(Boolean);
  if (!hasAnswer && !hasChecked) return 'notStarted';
  if (definition && definition.checklist.length > 0 && definition.checklist.every((item) => progress.checklist[item.id])) {
    return 'done';
  }
  return 'incomplete';
}

import type {
  DocBlock,
  ExportDocument,
  FieldDefinition,
  FieldValue,
  Iteration,
  PhaseDefinition,
  PhaseId,
  Project,
  TableRow,
} from '@/types/schema';
import { framework, getPhase } from '@/content';
import { isAnswered } from './project';
import { fileDate, formatDate, slugify } from './format';

/** Le nom du document produit par chaque phase. */
export const DOCUMENT_NAMES: Record<PhaseId, string> = {
  comprendre: 'Compréhension',
  explorer: 'Exploration',
  cadrer: 'Cadrage',
  planifier: 'Planification',
  construire: 'Construction',
  confronter: 'Confrontation',
};

type Level = 1 | 2 | 3;

function startingPointLabel(iteration: Iteration): string {
  return iteration.number === 1 ? 'Idée de départ' : `Ce que l'itération ${iteration.number - 1} a appris`;
}

/** Une réponse, convertie en blocs selon le type du champ. */
function answerBlocks(field: FieldDefinition, value: FieldValue): DocBlock[] {
  if (typeof value === 'string') {
    return value
      .trim()
      .split(/\n\s*\n/)
      .map((text) => ({ kind: 'paragraph' as const, text: text.trim() }));
  }
  if (field.type === 'table') {
    const columns = field.columns ?? [];
    const rows = (value as TableRow[])
      .map((row) => columns.map((c) => (row[c.id] ?? '').trim()))
      .filter((cells) => cells.some((cell) => cell !== ''));
    return [{ kind: 'table', headers: columns.map((c) => c.label), rows }];
  }
  const items = (value as string[]).map((item) => item.trim()).filter(Boolean);
  return [{ kind: 'list', items, ordered: field.ordered }];
}

/** Les blocs d'une phase : son titre, ses réponses, et l'état de sa checklist de sortie. */
function phaseBlocks(definition: PhaseDefinition, iteration: Iteration, level: Level): DocBlock[] {
  const progress = iteration.phases[definition.id];
  const sub = Math.min(level + 1, 3) as Level;
  const blocks: DocBlock[] = [];

  for (const field of definition.fields) {
    const value = progress.answers[field.id];
    if (isAnswered(value)) {
      blocks.push({ kind: 'heading', level: sub, text: field.label }, ...answerBlocks(field, value!));
    } else if (field.required) {
      blocks.push({ kind: 'heading', level: sub, text: field.label }, { kind: 'warning', text: 'Non rempli.' });
    }
  }

  const unchecked = definition.checklist.filter((item) => !progress.checklist[item.id]).map((item) => item.label);
  blocks.push({ kind: 'heading', level: sub, text: 'Checklist de sortie' });
  blocks.push(
    unchecked.length === 0
      ? { kind: 'paragraph', text: 'Tous les critères de sortie sont validés.' }
      : {
          kind: 'warning',
          text: `${unchecked.length} critère${unchecked.length > 1 ? 's' : ''} sur ${definition.checklist.length} non validé${unchecked.length > 1 ? 's' : ''} :`,
          items: unchecked,
        },
  );
  return blocks;
}

/** Le document d'une phase. */
export function buildPhaseDocument(
  project: Project,
  iteration: Iteration,
  phaseId: PhaseId,
  now = new Date(),
): ExportDocument {
  const definition = getPhase(phaseId);
  if (!definition) throw new Error(`Phase inconnue : ${phaseId}`);
  const title = DOCUMENT_NAMES[phaseId];

  const blocks: DocBlock[] = [
    { kind: 'heading', level: 1, text: title },
    {
      kind: 'paragraph',
      text:
        `Projet : ${project.name}. Itération ${iteration.number}, phase ${definition.order} sur 6 (${definition.title}). ` +
        `Document généré le ${formatDate(now.toISOString())}.`,
    },
  ];
  if (phaseId === 'comprendre') {
    blocks.push(
      { kind: 'heading', level: 2, text: startingPointLabel(iteration) },
      { kind: 'paragraph', text: iteration.startingPoint },
    );
  }
  blocks.push(...phaseBlocks(definition, iteration, 1));

  return { title, projectName: project.name, generatedAt: now.toISOString(), blocks };
}

/** Le document complet d'une itération : les six phases, à la suite. */
export function buildIterationDocument(project: Project, iteration: Iteration, now = new Date()): ExportDocument {
  const title = `${project.name}, itération ${iteration.number}`;
  const blocks: DocBlock[] = [
    { kind: 'heading', level: 1, text: title },
    { kind: 'paragraph', text: `Document généré le ${formatDate(now.toISOString())} avec Boussole.` },
    { kind: 'heading', level: 2, text: startingPointLabel(iteration) },
    { kind: 'paragraph', text: iteration.startingPoint },
  ];
  for (const definition of framework.phases) {
    blocks.push({ kind: 'heading', level: 1, text: `${definition.order}. ${definition.title} : ${DOCUMENT_NAMES[definition.id]}` });
    blocks.push(...phaseBlocks(definition, iteration, 1));
  }
  return { title, projectName: project.name, generatedAt: now.toISOString(), blocks };
}

/** boussole-mon-projet-v1-comprendre-2026-10-26 (sans extension). */
export function documentFileBase(project: Project, iteration: Iteration, phaseId?: PhaseId, now = new Date()): string {
  const scope = phaseId ? `-${phaseId}` : '';
  return `boussole-${slugify(project.name)}-v${iteration.number}${scope}-${fileDate(now)}`;
}

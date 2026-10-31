import type { BackupFile, FieldValue, Iteration, PhaseId, PhaseProgress, Project } from '@/types/schema';
import { PHASE_IDS } from '@/content';
import { fileDate, slugify } from '@/lib/format';

export const BACKUP_FORMAT = 'boussole-backup';
export const BACKUP_FORMAT_VERSION = 1;
export const COPY_SUFFIX = ' (copie importée)';

// ════════════════════════════════════════════════════════════════
// Export
// ════════════════════════════════════════════════════════════════

export function createBackup(projects: Project[], now = new Date()): BackupFile {
  return {
    format: BACKUP_FORMAT,
    formatVersion: BACKUP_FORMAT_VERSION,
    exportedAt: now.toISOString(),
    // Copie simple : retire les proxys réactifs de Vue.
    projects: JSON.parse(JSON.stringify(projects)) as Project[],
  };
}

export function serializeBackup(file: BackupFile): string {
  return JSON.stringify(file, null, 2);
}

/**
 * boussole-sauvegarde-2026-10-26.json pour une sauvegarde complète,
 * boussole-nom-du-projet-2026-10-26.json pour l'export d'un seul projet.
 */
export function backupFileName(projects: Project[], now = new Date(), fullBackup = false): string {
  const only = !fullBackup && projects.length === 1 ? projects[0] : undefined;
  return `boussole-${only ? slugify(only.name) : 'sauvegarde'}-${fileDate(now)}.json`;
}

// ════════════════════════════════════════════════════════════════
// Lecture et validation
// ════════════════════════════════════════════════════════════════

/** Erreur de lecture d'un fichier de sauvegarde, avec un message destiné à l'utilisateur. */
export class BackupError extends Error {}

type Raw = Record<string, unknown>;

function isObject(value: unknown): value is Raw {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function invalid(where: string): never {
  throw new BackupError(`Le fichier est incomplet ou abîmé (${where}). Rien n'a été importé.`);
}

function readFieldValue(value: unknown, where: string): FieldValue {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === 'string')) return value as string[];
    if (value.every((v) => isObject(v) && Object.values(v).every((cell) => typeof cell === 'string'))) {
      return value as Record<string, string>[];
    }
  }
  return invalid(where);
}

function readProgress(raw: unknown, where: string): PhaseProgress {
  // Une phase absente du fichier (ajoutée dans une version plus récente du contenu) repart vide.
  if (raw === undefined) return { answers: {}, checklist: {} };
  if (!isObject(raw) || !isObject(raw.answers) || !isObject(raw.checklist)) return invalid(where);

  const answers: Record<string, FieldValue> = {};
  for (const [key, value] of Object.entries(raw.answers)) answers[key] = readFieldValue(value, `${where}, ${key}`);

  const checklist: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(raw.checklist)) {
    if (typeof value !== 'boolean') return invalid(`${where}, ${key}`);
    checklist[key] = value;
  }
  return { answers, checklist };
}

function readIteration(raw: unknown, where: string): Iteration {
  if (
    !isObject(raw) ||
    typeof raw.id !== 'string' ||
    !Number.isInteger(raw.number) ||
    (raw.number as number) < 1 ||
    typeof raw.startingPoint !== 'string' ||
    !isDate(raw.createdAt) ||
    typeof raw.frameworkVersion !== 'string' ||
    !isObject(raw.phases)
  ) {
    return invalid(where);
  }
  const rawPhases = raw.phases;
  const phases = Object.fromEntries(
    PHASE_IDS.map((id) => [id, readProgress(rawPhases[id], `${where}, phase ${id}`)]),
  ) as Record<PhaseId, PhaseProgress>;

  return {
    id: raw.id,
    number: raw.number as number,
    startingPoint: raw.startingPoint,
    createdAt: raw.createdAt,
    frameworkVersion: raw.frameworkVersion,
    phases,
  };
}

function readProject(raw: unknown, index: number): Project {
  const where = isObject(raw) && typeof raw.name === 'string' ? `projet « ${raw.name} »` : `projet n° ${index + 1}`;
  if (
    !isObject(raw) ||
    typeof raw.id !== 'string' ||
    raw.id === '' ||
    typeof raw.name !== 'string' ||
    !isDate(raw.createdAt) ||
    !isDate(raw.updatedAt) ||
    !Array.isArray(raw.iterations) ||
    raw.iterations.length === 0
  ) {
    return invalid(where);
  }
  const iterations = raw.iterations.map((it, i) => readIteration(it, `${where}, itération ${i + 1}`));
  if (iterations.some((it, i) => i > 0 && it.number <= iterations[i - 1]!.number)) {
    return invalid(`${where}, ordre des itérations`);
  }
  return { id: raw.id, name: raw.name, createdAt: raw.createdAt, updatedAt: raw.updatedAt, iterations };
}

/**
 * Lit le contenu d'un fichier de sauvegarde et renvoie ses projets, nettoyés.
 * Lève une BackupError avec un message clair si le fichier ne peut pas être importé.
 */
export function parseBackup(text: string): Project[] {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new BackupError("Ce fichier n'est pas une sauvegarde Boussole : son contenu n'est pas lisible.");
  }
  if (!isObject(data) || data.format !== BACKUP_FORMAT) {
    throw new BackupError("Ce fichier n'est pas une sauvegarde Boussole.");
  }
  if (typeof data.formatVersion !== 'number' || data.formatVersion > BACKUP_FORMAT_VERSION) {
    throw new BackupError(
      'Cette sauvegarde a été créée par une version plus récente de Boussole. Mets Boussole à jour, puis réessaie.',
    );
  }
  if (!Array.isArray(data.projects)) return invalid('liste des projets');

  const projects = data.projects.map(readProject);

  // Si le fichier contient deux fois le même projet, on garde la version la plus récente.
  const byId = new Map<string, Project>();
  for (const project of projects) {
    const seen = byId.get(project.id);
    if (!seen || project.updatedAt > seen.updatedAt) byId.set(project.id, project);
  }
  return [...byId.values()];
}

// ════════════════════════════════════════════════════════════════
// Plan d'import : un import n'efface jamais un travail plus récent
// ════════════════════════════════════════════════════════════════

export type ImportAction =
  | 'add'     // absent de cet appareil : ajouté
  | 'skip'    // identique : rien à faire
  | 'update'  // la version du fichier est plus récente : elle remplace celle de l'appareil
  | 'copy';   // la version de l'appareil est plus récente (ou différente à date égale) : le fichier devient une copie

export interface ImportPlanItem {
  action: ImportAction;
  project: Project; // Le projet tel qu'il sera écrit (déjà renommé et ré-identifié pour une copie)
  sourceName: string; // Son nom dans le fichier
}

/** Comparaison indépendante de l'ordre des clés. */
function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (isObject(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function asCopy(project: Project): Project {
  return {
    ...project,
    id: crypto.randomUUID(),
    name: project.name + COPY_SUFFIX,
    iterations: project.iterations.map((it) => ({ ...it, id: crypto.randomUUID() })),
  };
}

export function planImport(existing: Project[], incoming: Project[]): ImportPlanItem[] {
  return incoming.map((project) => {
    const local = existing.find((p) => p.id === project.id);
    const item = (action: ImportAction, written = project): ImportPlanItem => ({
      action,
      project: written,
      sourceName: project.name,
    });

    if (!local) return item('add');
    if (stableStringify(local) === stableStringify(project)) return item('skip');
    if (project.updatedAt > local.updatedAt) return item('update');
    return item('copy', asCopy(project));
  });
}

export function countActions(plan: ImportPlanItem[]): Record<ImportAction, number> {
  const counts: Record<ImportAction, number> = { add: 0, skip: 0, update: 0, copy: 0 };
  for (const item of plan) counts[item.action]++;
  return counts;
}

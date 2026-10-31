import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { FieldValue, PhaseId, Project } from '@/types/schema';
import { db, requestPersistentStorage } from '@/db/database';
import { createNextIteration, createProject, currentIteration } from '@/lib/project';
import { backupFileName, createBackup, serializeBackup, type ImportPlanItem } from '@/lib/backup';

export type LoadState = 'loading' | 'ready' | 'error';
export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

/** Délai avant écriture : on n'écrit pas à chaque frappe, mais peu après la dernière. */
export const SAVE_DELAY_MS = 400;

/** Copie simple, sans les proxys réactifs de Vue, avant d'écrire dans IndexedDB. */
function plain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([]);
  const loadState = ref<LoadState>('loading');
  const saveState = ref<SaveState>('idle');
  const persistent = ref<boolean | null>(null);

  let loading: Promise<void> | null = null;
  const pendingWrites = new Map<string, ReturnType<typeof setTimeout>>();

  /** Les plus récemment modifiés en premier. */
  const sortedProjects = computed(() =>
    [...projects.value].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  );

  function load(): Promise<void> {
    loading ??= (async () => {
      try {
        projects.value = await db.projects.toArray();
        loadState.value = 'ready';
        persistent.value = await requestPersistentStorage();
      } catch {
        loadState.value = 'error';
        loading = null; // Permet de réessayer
      }
    })();
    return loading;
  }

  function getProject(id: string): Project | undefined {
    return projects.value.find((p) => p.id === id);
  }

  async function addProject(name: string, initialIdea: string): Promise<string> {
    const project = createProject(name, initialIdea);
    await db.projects.add(plain(project));
    projects.value.push(project);
    return project.id;
  }

  async function deleteProject(id: string): Promise<void> {
    const timer = pendingWrites.get(id);
    if (timer) clearTimeout(timer);
    pendingWrites.delete(id);
    await db.projects.delete(id);
    projects.value = projects.value.filter((p) => p.id !== id);
  }

  /** Démarre une nouvelle itération du projet et renvoie son numéro. */
  async function startIteration(projectId: string, startingPoint: string, carryOverAnswers: boolean): Promise<number> {
    const project = getProject(projectId);
    if (!project) throw new Error(`Projet introuvable : ${projectId}`);
    await flush();
    const next = createNextIteration(currentIteration(project), startingPoint, carryOverAnswers);
    const updated: Project = { ...plain(project), iterations: [...plain(project.iterations), next], updatedAt: next.createdAt };
    await db.projects.put(updated);
    project.iterations.push(next);
    project.updatedAt = next.createdAt;
    return next.number;
  }

  // Les modifications portent toujours sur l'itération en cours : les précédentes sont en lecture seule.

  function setAnswer(projectId: string, phaseId: PhaseId, fieldId: string, value: FieldValue): void {
    const project = getProject(projectId);
    if (!project) return;
    currentIteration(project).phases[phaseId].answers[fieldId] = value;
    scheduleWrite(project);
  }

  function setChecklistItem(projectId: string, phaseId: PhaseId, itemId: string, checked: boolean): void {
    const project = getProject(projectId);
    if (!project) return;
    currentIteration(project).phases[phaseId].checklist[itemId] = checked;
    scheduleWrite(project);
  }

  function scheduleWrite(project: Project): void {
    project.updatedAt = new Date().toISOString();
    saveState.value = 'saving';
    const existing = pendingWrites.get(project.id);
    if (existing) clearTimeout(existing);
    pendingWrites.set(project.id, setTimeout(() => void write(project.id), SAVE_DELAY_MS));
  }

  async function write(id: string): Promise<void> {
    pendingWrites.delete(id);
    const project = getProject(id);
    if (!project) return;
    try {
      await db.projects.put(plain(project));
      if (pendingWrites.size === 0) saveState.value = 'saved';
    } catch {
      saveState.value = 'error';
    }
  }

  /**
   * Prépare le fichier de sauvegarde de tous les projets, ou de ceux demandés.
   * Les modifications en attente sont écrites d'abord, pour que le fichier soit à jour.
   */
  async function exportBackup(projectIds?: string[]): Promise<{ fileName: string; content: string }> {
    await flush();
    const selected = projectIds ? projects.value.filter((p) => projectIds.includes(p.id)) : projects.value;
    return {
      fileName: backupFileName(selected, new Date(), projectIds === undefined),
      content: serializeBackup(createBackup(selected)),
    };
  }

  /** Applique un plan d'import confirmé, en une seule transaction : tout est importé, ou rien. */
  async function applyImport(plan: ImportPlanItem[]): Promise<void> {
    await flush();
    const toWrite = plan.filter((item) => item.action !== 'skip').map((item) => plain(item.project));
    if (toWrite.length === 0) return;

    await db.transaction('rw', db.projects, () => db.projects.bulkPut(toWrite));

    for (const project of toWrite) {
      const index = projects.value.findIndex((p) => p.id === project.id);
      if (index === -1) projects.value.push(project);
      else projects.value[index] = project;
    }
  }

  /** Écrit immédiatement tout ce qui est en attente (changement d'écran, fermeture de l'onglet). */
  async function flush(): Promise<void> {
    const ids = [...pendingWrites.keys()];
    for (const id of ids) {
      clearTimeout(pendingWrites.get(id));
      await write(id);
    }
  }

  return {
    projects,
    sortedProjects,
    loadState,
    saveState,
    persistent,
    load,
    getProject,
    addProject,
    deleteProject,
    startIteration,
    setAnswer,
    setChecklistItem,
    exportBackup,
    applyImport,
    flush,
  };
});

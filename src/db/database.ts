import Dexie, { type EntityTable } from 'dexie';
import type { Project } from '@/types/schema';

/**
 * Base locale de Boussole (IndexedDB).
 * Aucune donnée ne quitte la machine de l'utilisateur.
 */
export class BoussoleDB extends Dexie {
  projects!: EntityTable<Project, 'id'>;

  constructor(name = 'boussole') {
    super(name);
    this.version(1).stores({
      // Seules les colonnes indexées sont déclarées ; le reste du projet est stocké tel quel.
      projects: 'id, updatedAt',
    });
  }
}

export const db = new BoussoleDB();

/**
 * Demande au navigateur de ne pas effacer les données de lui-même en cas de manque d'espace.
 * Renvoie true si le stockage est persistant, false sinon (ou si le navigateur ne le permet pas).
 */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

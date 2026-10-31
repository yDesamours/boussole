/**
 * Boussole — Schéma des données
 *
 * Trois familles de types :
 *   1. Le contenu du framework  → statique, écrit par toi, livré avec l'application
 *   2. Les données utilisateur  → les projets, stockés dans IndexedDB
 *   3. Le modèle de document    → structure neutre, convertie en Markdown / HTML / PDF / Word
 */

// ════════════════════════════════════════════════════════════════
// 1. CONTENU DU FRAMEWORK
// ════════════════════════════════════════════════════════════════

export type PhaseId =
  | 'comprendre'
  | 'explorer'
  | 'cadrer'
  | 'planifier'
  | 'construire'
  | 'confronter';

/** Le framework complet, versionné pour pouvoir faire évoluer le contenu sans casser les projets existants. */
export interface Framework {
  version: string;
  phases: PhaseDefinition[];
  /** Termes vagues signalés dans tous les champs texte, en plus des règles propres à chaque champ. */
  globalVaguenessRules: VaguenessRule[];
}

/** La description d'une phase : la partie pédagogique + les champs à remplir + la checklist de sortie. */
export interface PhaseDefinition {
  id: PhaseId;
  order: number;
  title: string;

  // — Partie pédagogique —
  objective: string;          // Ce que la phase cherche à accomplir
  explanation: string;        // Explication détaillée (Markdown)
  whenIsItDone: string;       // Comment savoir que la phase est terminée
  pitfalls: string[];         // Pièges à éviter
  output: string;             // Ce que produit la phase (le document)

  // — Partie opérationnelle —
  fields: FieldDefinition[];
  checklist: ChecklistItem[];
}

export type FieldType =
  | 'text'       // une ligne       — ex : nom du persona
  | 'longText'   // un paragraphe   — ex : problème réel
  | 'list'       // liste d'items   — ex : fonctionnalités hors scope
  | 'table';     // tableau         — ex : approches explorées (approche / décision / raison)

export interface FieldDefinition {
  id: string;                 // Unique dans la phase
  label: string;
  help: string;               // Consigne affichée sous le champ
  type: FieldType;
  required: boolean;
  ordered?: boolean;                 // Uniquement pour type 'list' : les items forment une séquence
  columns?: ColumnDefinition[];      // Uniquement pour type 'table'
  examples?: FieldExample[];
  vaguenessRules?: VaguenessRule[];  // Règles propres à ce champ
}

export interface ColumnDefinition {
  id: string;
  label: string;
}

/** Une paire bon / mauvais exemple, avec l'explication de la différence. */
export interface FieldExample {
  good: string;
  bad: string;
  why: string;
}

/**
 * Détection simple, sans IA : si un des termes apparaît, on affiche le message. Jamais bloquant.
 *
 * Règle de correspondance :
 *  - insensible à la casse et aux accents ("Fonctionnalite" = "fonctionnalité")
 *  - le terme doit commencer au début d'un mot : "api" ne détecte pas "rapide",
 *    mais un préfixe comme "inscri" détecte "inscrit", "inscription"
 *  - avec wholeWord, le terme doit aussi finir avec le mot : utile pour les mots courts
 *    ("et" ne doit pas détecter "être", qui s'écrit "etre" une fois les accents retirés)
 */
export interface VaguenessRule {
  wholeWord?: boolean;
  terms: string[];            // ex : ["tout le monde", "les utilisateurs"]
  message: string;            // ex : "Un persona est une personne précise, pas un groupe."
}

export interface ChecklistItem {
  id: string;
  label: string;              // ex : "Mon persona a un seul besoin principal"
  hint?: string;
}

// ════════════════════════════════════════════════════════════════
// 2. DONNÉES UTILISATEUR (IndexedDB)
// ════════════════════════════════════════════════════════════════

/**
 * Un projet est une suite d'itérations : le framework se répète à chaque nouvelle version du produit.
 * La dernière itération est l'itération en cours, la seule modifiable.
 */
export interface Project {
  id: string;                 // UUID
  name: string;
  createdAt: string;          // ISO 8601
  updatedAt: string;          // ISO 8601
  iterations: Iteration[];    // Toujours au moins une, dans l'ordre (v1, v2, …)
}

export interface Iteration {
  id: string;                 // UUID
  number: number;             // 1, 2, 3…
  /**
   * Ce dont part cette boucle.
   * v1 : l'idée vague de départ, conservée telle quelle.
   * v2+ : ce que la phase Confronter de l'itération précédente a appris.
   */
  startingPoint: string;
  createdAt: string;          // ISO 8601
  frameworkVersion: string;   // Version du contenu avec laquelle l'itération a été créée
  phases: Record<PhaseId, PhaseProgress>;
}

export interface PhaseProgress {
  answers: Record<string, FieldValue>;      // Clé = FieldDefinition.id
  checklist: Record<string, boolean>;       // Clé = ChecklistItem.id
}

export type FieldValue = string | string[] | TableRow[];
export type TableRow = Record<string, string>;  // Clé = ColumnDefinition.id

/**
 * Le statut d'une phase n'est PAS stocké : il est calculé à partir des réponses et de la checklist.
 * Ainsi il ne peut jamais être incohérent avec les données.
 */
export type PhaseStatus =
  | 'notStarted'   // Aucune réponse
  | 'incomplete'   // Des réponses, mais checklist non complète
  | 'done';        // Checklist entièrement cochée

/**
 * Format du fichier de sauvegarde. Le même format sert à exporter un seul projet ou tous les projets.
 * formatVersion augmentera si la structure change ; une version de Boussole refuse les fichiers plus récents qu'elle.
 */
export interface BackupFile {
  format: 'boussole-backup';
  formatVersion: 1;
  exportedAt: string;
  projects: Project[];
}

// ════════════════════════════════════════════════════════════════
// 3. MODÈLE DE DOCUMENT COMMUN (export)
// ════════════════════════════════════════════════════════════════

/** Construit une seule fois à partir d'une phase, puis converti par chaque exporteur. */
export interface ExportDocument {
  title: string;              // ex : "Compréhension"
  projectName: string;
  generatedAt: string;
  blocks: DocBlock[];         // Le titre est le premier bloc ; les exporteurs ne l'ajoutent pas eux-mêmes
}

export type DocBlock =
  | { kind: 'heading'; level: 1 | 2 | 3; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  | { kind: 'table'; headers: string[]; rows: string[][] }
  | { kind: 'warning'; text: string; items?: string[] };  // ex : champ non rempli, points de checklist non cochés

export type ExportFormat = 'markdown' | 'html' | 'pdf' | 'docx';

/** Chaque format implémente cette interface. Ajouter un format = ajouter un exporteur. */
export interface Exporter {
  format: ExportFormat;
  label: string;              // ex : "Word (.docx)"
  fileExtension: string;      // ex : "docx"
  export(doc: ExportDocument): Promise<Blob>;
}

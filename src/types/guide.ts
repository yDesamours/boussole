import type { PhaseId } from './schema';

/**
 * Contenu pédagogique affiché hors d'un projet : le guide du framework et le projet exemple.
 *
 * Dans les textes, **double astérisque** met un passage en gras. Aucun autre formatage n'est interprété.
 */
export type GuideBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  /** Une règle à retenir, mise en évidence. */
  | { kind: 'rule'; text: string }
  /** Une paire de versions comparées. Par défaut « À éviter » / « Mieux ». */
  | { kind: 'example'; bad: string; good: string; why: string; badLabel?: string; goodLabel?: string }
  | { kind: 'table'; headers: string[]; rows: string[][] }
  /** La réponse donnée à un champ, dans le projet exemple. */
  | { kind: 'answer'; label: string; text?: string; items?: string[]; ordered?: boolean; fieldId?: string }
  /** Un commentaire pédagogique sur ce qui précède, dans le projet exemple. */
  | { kind: 'remark'; text: string };

export interface GuideSection {
  id: string;                 // Sert d'ancre : #comprendre, #explorer…
  title: string;
  blocks: GuideBlock[];
  sections?: GuideSection[];  // Un seul niveau de sous-sections
}

export interface Guide {
  title: string;
  intro: GuideBlock[];
  sections: GuideSection[];
}

export interface ExamplePhase {
  phaseId: PhaseId;
  blocks: GuideBlock[];
}

export interface ExampleIteration {
  number: number;
  startingPointLabel: string;
  startingPoint: string;
  phases: ExamplePhase[];
  /** Ce qui reste à faire dans une itération en cours. */
  status?: string;
}

/** Une entrée de sommaire : un lien vers une ancre de la page. */
export interface TocEntry {
  id: string;
  title: string;
  children?: TocEntry[];
}

export interface ExampleProject {
  name: string;
  pitch: string;
  disclaimer: string;
  iterations: ExampleIteration[];
}

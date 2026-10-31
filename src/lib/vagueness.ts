import type { FieldValue, VaguenessRule } from '../types/schema';

/** Tout le texte d'une réponse, quel que soit le type du champ, une valeur par ligne. */
export function valueToText(value: FieldValue): string {
  if (typeof value === 'string') return value;
  return value.map((item) => (typeof item === 'string' ? item : Object.values(item).join('\n'))).join('\n');
}

/** Minuscules, sans accents, apostrophes unifiées. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’`]/g, "'");
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Le terme doit commencer au début d'un mot ; avec wholeWord, il doit aussi finir avec lui. */
function containsTerm(normalizedText: string, term: string, wholeWord: boolean): boolean {
  const end = wholeWord ? '(?=$|[^\\p{L}\\p{N}])' : '';
  const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(normalize(term))}${end}`, 'u');
  return pattern.test(normalizedText);
}

/** Renvoie les messages des règles déclenchées, sans doublon. Jamais bloquant. */
export function detectVagueness(text: string, rules: VaguenessRule[]): string[] {
  const normalized = normalize(text);
  const messages = rules
    .filter((rule) => rule.terms.some((term) => containsTerm(normalized, term, rule.wholeWord ?? false)))
    .map((rule) => rule.message);
  return [...new Set(messages)];
}

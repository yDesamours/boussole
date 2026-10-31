import { describe, expect, it } from 'vitest';
import { detectVagueness } from '@/lib/vagueness';
import { comprendre } from '@/content/comprendre';
import { framework } from '@/content';

const rulesOf = (id: string) => [
  ...(comprendre.fields.find((f) => f.id === id)?.vaguenessRules ?? []),
  ...framework.globalVaguenessRules,
];

// [champ, texte, alerte attendue ?]
const cases: [string, string, boolean][] = [
  ['problemeReel', 'Il faut une application rapide', true],
  ['problemeReel', 'Les débutants ont besoin de réponses rapides de leur point de vue', false],
  ['problemeReel', 'On utilisera une API', true],
  ['problemeReel', 'Les développeurs solo commencent à coder trop tôt et se perdent', false],
  ['personaDescription', 'Tout le monde', true],
  ['personaDescription', 'Les étudiants en informatique', true],
  ['personaDescription', 'Marc, 27 ans, développeur indépendant', false],
  ['besoinPrincipal', 'Structurer son idée et choisir sa techno', true],
  ['besoinPrincipal', 'Savoir quoi construire avant de coder', false],
  ['besoinPrincipal', 'Acheter sans être surveillée', false],
  ['besoinPrincipal', 'Acheter vite, et sans être surveillée', true],
  ['metrique', 'Le site est en ligne', true],
  ['metrique', 'Il s’est inscrit', true],
  ['metrique', 'Marc termine les six phases et commence à coder sans hésiter', false],
  ['metrique', 'Marc lance son projet et revient sur ses documents', false],
  ['metrique', 'Le produit est livré', true],
  ['metrique', 'L’application a été déployée', true],
  ['pourquoi', 'Parce que c’est utile', true],
  ['pourquoi', 'Les cours en ligne sont en anglais, etc.', true],
];

describe('detectVagueness', () => {
  it.each(cases)('[%s] « %s » → alerte : %s', (field, text, expected) => {
    expect(detectVagueness(text, rulesOf(field)).length > 0).toBe(expected);
  });

  it('ne déclenche aucune alerte sur les bons exemples du contenu', () => {
    for (const field of comprendre.fields) {
      for (const example of field.examples ?? []) {
        expect(detectVagueness(example.good, field.vaguenessRules ?? []), `${field.id} : ${example.good}`).toEqual([]);
      }
    }
  });
});

import { describe, expect, it } from 'vitest';
import { guide } from '@/content/guide';
import { example } from '@/content/example';
import { comprendre } from '@/content/comprendre';
import { framework, PHASE_IDS } from '@/content';
import { detectVagueness } from '@/lib/vagueness';
import type { GuideBlock, GuideSection } from '@/types/guide';

const allSections = (sections: GuideSection[]): GuideSection[] =>
  sections.flatMap((s) => [s, ...(s.sections ?? [])]);

/** Tous les textes d'un bloc, pour vérifier qu'aucun n'est vide. */
function texts(block: GuideBlock): string[] {
  switch (block.kind) {
    case 'heading':
    case 'paragraph':
    case 'rule':
    case 'remark':
      return [block.text];
    case 'list':
      return block.items;
    case 'example':
      return [block.bad, block.good, block.why];
    case 'table':
      return [...block.headers, ...block.rows.flat()];
    case 'answer':
      return [block.label, ...(block.text ? [block.text] : []), ...(block.items ?? [])];
  }
}

describe('le guide', () => {
  const sections = allSections(guide.sections);

  it('a une section par phase, dont l\'identifiant est celui de la phase', () => {
    for (const id of PHASE_IDS) expect(sections.map((s) => s.id)).toContain(id);
  });

  it('a des identifiants d\'ancre uniques', () => {
    const ids = sections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ne contient aucun texte vide ni gras mal fermé', () => {
    for (const section of sections) {
      for (const text of section.blocks.flatMap(texts)) {
        expect(text.trim(), section.id).not.toBe('');
        expect((text.match(/\*\*/g) ?? []).length % 2, `${section.id} : ${text}`).toBe(0);
      }
    }
  });

  it('présente les fonctionnalités de Boussole', () => {
    const boussole = sections.find((s) => s.id === 'utiliser-boussole')!;
    const content = boussole.blocks.flatMap(texts).join(' ').toLowerCase();
    for (const feature of ['explication', 'exemple', 'alertes', 'persona', 'markdown', 'word', 'checklist', 'itération', 'importe']) {
      expect(content, feature).toContain(feature);
    }
  });
});

describe('le projet exemple', () => {
  const [first, second] = example.iterations;

  it('parcourt les six phases dans l\'ordre pendant la première itération', () => {
    expect(first?.phases.map((p) => p.phaseId)).toEqual(PHASE_IDS);
  });

  it('montre le début d\'une deuxième itération, qui repart de Comprendre', () => {
    expect(second?.number).toBe(2);
    expect(second?.phases[0]?.phaseId).toBe('comprendre');
  });

  it('ne contient aucun texte vide', () => {
    for (const iteration of example.iterations) {
      for (const phase of iteration.phases) {
        for (const text of phase.blocks.flatMap(texts)) expect(text.trim()).not.toBe('');
      }
    }
  });

  it('donne des réponses de Comprendre qui ne déclenchent aucune alerte de flou', () => {
    for (const iteration of example.iterations) {
      const phase = iteration.phases.find((p) => p.phaseId === 'comprendre');
      for (const block of phase?.blocks ?? []) {
        if (block.kind !== 'answer' || !block.fieldId) continue;
        const field = comprendre.fields.find((f) => f.id === block.fieldId);
        expect(field, `champ inconnu : ${block.fieldId}`).toBeDefined();
        const rules = [...(field?.vaguenessRules ?? []), ...framework.globalVaguenessRules];
        for (const text of [block.text ?? '', ...(block.items ?? [])].filter(Boolean)) {
          expect(detectVagueness(text, rules), `v${iteration.number} ${block.fieldId} : ${text}`).toEqual([]);
        }
      }
    }
  });

  it('remplit tous les champs obligatoires de Comprendre dans la première itération', () => {
    const answered = new Set(
      first?.phases[0]?.blocks.flatMap((b) => (b.kind === 'answer' && b.fieldId ? [b.fieldId] : [])),
    );
    for (const field of comprendre.fields.filter((f) => f.required)) expect(answered).toContain(field.id);
  });
});

import { describe, expect, it } from 'vitest';
import { framework, PHASE_OUTLINE } from '@/content';
import { detectVagueness } from '@/lib/vagueness';

describe('le contenu du framework', () => {
  it('contient les six phases, dans l\'ordre du parcours', () => {
    expect(framework.phases.map((p) => p.id)).toEqual(PHASE_OUTLINE.map((p) => p.id));
    framework.phases.forEach((phase, index) => expect(phase.order).toBe(index + 1));
  });

  describe.each(framework.phases.map((p) => [p.title, p] as const))('%s', (_, phase) => {
    it('a sa partie pédagogique complète', () => {
      for (const text of [phase.objective, phase.explanation, phase.whenIsItDone, phase.output]) {
        expect(text.trim().length).toBeGreaterThan(20);
      }
      expect(phase.pitfalls.length).toBeGreaterThanOrEqual(3);
    });

    it('a des identifiants de champs et de checklist uniques', () => {
      const fieldIds = phase.fields.map((f) => f.id);
      const checkIds = phase.checklist.map((c) => c.id);
      expect(new Set(fieldIds).size).toBe(fieldIds.length);
      expect(new Set(checkIds).size).toBe(checkIds.length);
    });

    it('donne au moins un exemple pour chaque champ', () => {
      for (const field of phase.fields) expect(field.examples?.length, field.id).toBeGreaterThan(0);
    });

    it('définit les colonnes de chaque tableau, et seulement des tableaux', () => {
      for (const field of phase.fields) {
        if (field.type === 'table') expect(field.columns?.length, field.id).toBeGreaterThanOrEqual(2);
        else expect(field.columns, field.id).toBeUndefined();
      }
    });

    it('a une checklist de sortie d\'au moins six points', () => {
      expect(phase.checklist.length).toBeGreaterThanOrEqual(6);
    });

    it('ne déclenche aucune alerte sur ses bons exemples', () => {
      for (const field of phase.fields) {
        const rules = [...(field.vaguenessRules ?? []), ...framework.globalVaguenessRules];
        for (const example of field.examples ?? []) {
          expect(detectVagueness(example.good, rules), `${field.id} : ${example.good}`).toEqual([]);
        }
      }
    });

    it('déclenche une alerte sur au moins un mauvais exemple quand le champ a des règles', () => {
      for (const field of phase.fields.filter((f) => f.vaguenessRules?.length)) {
        const rules = [...(field.vaguenessRules ?? []), ...framework.globalVaguenessRules];
        const caught = (field.examples ?? []).some((e) => detectVagueness(e.bad, rules).length > 0);
        expect(caught, `${phase.id}.${field.id}`).toBe(true);
      }
    });
  });
});

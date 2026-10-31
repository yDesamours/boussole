import { describe, expect, it } from 'vitest';
import { createNextIteration, createProject, currentIteration } from '@/lib/project';
import { buildIterationDocument, buildPhaseDocument, documentFileBase } from '@/lib/document';
import { toMarkdown } from '@/lib/exporters/markdown';
import { toHtml } from '@/lib/exporters/html';
import { toDocx } from '@/lib/exporters/docx';
import { toPdfDefinition } from '@/lib/exporters/pdf';
import { markdownToBlocks } from '@/lib/markdown';
import { comprendre } from '@/content/comprendre';
import { framework } from '@/content';

const NOW = new Date(2026, 9, 26, 12);

function project() {
  const p = createProject('Événements près de chez moi', 'Une application pour trouver des événements', NOW);
  const it = currentIteration(p);
  it.phases.comprendre.answers = {
    pourquoi: ['Premier pourquoi', '', 'Deuxième pourquoi'],
    problemeReel: 'Premier paragraphe.\n\nSecond paragraphe, avec <balise> & « guillemets ».',
    besoinPrincipal: 'Connaître les événements qui pourraient l\'intéresser.',
  };
  it.phases.comprendre.checklist = { creuse: true };
  it.phases.explorer.answers = {
    decisions: [
      { approche: 'Dropshipping', decision: 'Écartée', raison: 'Données | transmises' },
      { approche: '', decision: '', raison: '' },
    ],
  };
  return p;
}

describe('le document d\'une phase', () => {
  const p = project();
  const doc = buildPhaseDocument(p, currentIteration(p), 'comprendre', NOW);

  it('porte le nom du document de la phase et le point de départ', () => {
    expect(doc.title).toBe('Compréhension');
    expect(doc.blocks[0]).toEqual({ kind: 'heading', level: 1, text: 'Compréhension' });
    expect(doc.blocks).toContainEqual({ kind: 'paragraph', text: 'Une application pour trouver des événements' });
  });

  it('reprend les réponses selon le type du champ, sans les lignes vides', () => {
    expect(doc.blocks).toContainEqual({ kind: 'list', items: ['Premier pourquoi', 'Deuxième pourquoi'], ordered: true });
    expect(doc.blocks).toContainEqual({ kind: 'paragraph', text: 'Premier paragraphe.' });
  });

  it('signale les champs obligatoires non remplis, et ignore les facultatifs vides', () => {
    const labels = doc.blocks.filter((b) => b.kind === 'heading').map((b) => b.text);
    expect(labels).toContain('Le persona principal');
    expect(labels).not.toContain('Personas secondaires');
    expect(doc.blocks).toContainEqual({ kind: 'warning', text: 'Non rempli.' });
  });

  it('liste les critères de sortie non validés', () => {
    const warning = doc.blocks.find((b) => b.kind === 'warning' && b.items);
    expect(warning?.kind === 'warning' && warning.items).toHaveLength(comprendre.checklist.length - 1);
  });

  it('retire les lignes vides des tableaux', () => {
    const exploration = buildPhaseDocument(p, currentIteration(p), 'explorer', NOW);
    const table = exploration.blocks.find((b) => b.kind === 'table');
    expect(table?.kind === 'table' && table.rows).toEqual([['Dropshipping', 'Écartée', 'Données | transmises']]);
  });

  it('nomme le fichier d\'après le projet, l\'itération et la phase', () => {
    expect(documentFileBase(p, currentIteration(p), 'comprendre', NOW)).toBe(
      'boussole-evenements-pres-de-chez-moi-v1-comprendre-2026-10-26',
    );
  });
});

describe('le document d\'une itération', () => {
  it('contient les six phases, et le point de départ de l\'itération', () => {
    const p = project();
    const second = createNextIteration(currentIteration(p), 'Ce que la v1 a appris', true, NOW);
    const doc = buildIterationDocument(p, second, NOW);
    const phaseTitles = doc.blocks.filter((b) => b.kind === 'heading' && b.level === 1).slice(1);
    expect(phaseTitles).toHaveLength(framework.phases.length);
    expect(doc.blocks).toContainEqual({ kind: 'heading', level: 2, text: 'Ce que l\'itération 1 a appris' });
  });
});

describe('les exporteurs', () => {
  const p = project();
  const comprehension = buildPhaseDocument(p, currentIteration(p), 'comprendre', NOW);
  const exploration = buildPhaseDocument(p, currentIteration(p), 'explorer', NOW);

  it('Markdown : titres, listes numérotées, tableaux échappés, avertissements', () => {
    const md = toMarkdown(comprehension);
    expect(md).toMatch(/^# Compréhension\n/);
    expect(md).toContain('1. Premier pourquoi\n2. Deuxième pourquoi');
    expect(md).toContain('> **À compléter :** Non rempli.');
    expect(toMarkdown(exploration)).toContain('| Dropshipping | Écartée | Données \\| transmises |');
  });

  it('HTML : document autonome, contenu échappé', () => {
    const html = toHtml(comprehension);
    expect(html).toMatch(/^<!doctype html>/);
    expect(html).toContain('<html lang="fr">');
    expect(html).toContain('&lt;balise&gt; &amp; « guillemets »');
    expect(html).not.toContain('<balise>');
  });

  it('Word : produit un fichier .docx valide', async () => {
    const blob = await toDocx(comprehension);
    const bytes = new Uint8Array(await blob.arrayBuffer());
    expect(blob.size).toBeGreaterThan(2000);
    expect([bytes[0], bytes[1]]).toEqual([0x50, 0x4b]); // Signature ZIP « PK »
  });

  it('PDF : chaque bloc devient un élément de la mise en page', () => {
    const definition = toPdfDefinition(exploration);
    expect(Array.isArray(definition.content) && definition.content.length).toBe(exploration.blocks.length);
  });
});

describe('les explications de phase', () => {
  it('sont découpées en titres, listes et paragraphes', () => {
    const blocks = markdownToBlocks('Intro **forte**.\nSuite.\n\n### Titre\n\n1. Un\n2. Deux\n\n- A\n- B');
    expect(blocks).toEqual([
      { kind: 'paragraph', text: 'Intro **forte**. Suite.' },
      { kind: 'heading', text: 'Titre' },
      { kind: 'list', ordered: true, items: ['Un', 'Deux'] },
      { kind: 'list', ordered: false, items: ['A', 'B'] },
    ]);
  });

  it('fonctionnent pour les six phases', () => {
    for (const phase of framework.phases) expect(markdownToBlocks(phase.explanation).length).toBeGreaterThan(2);
  });
});

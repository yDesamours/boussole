import type { GuideBlock } from '@/types/guide';

/**
 * Convertit le Markdown simple des explications de phase en blocs affichables.
 * Reconnaît : titres « ### », listes « - » et « 1. », paragraphes séparés par une ligne vide.
 * Le gras et l'italique restent dans le texte et sont rendus par RichText.
 */
export function markdownToBlocks(markdown: string): GuideBlock[] {
  const blocks: GuideBlock[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ kind: 'paragraph', text: paragraph.join(' ') });
    paragraph = [];
  };
  const flushList = () => {
    if (list) blocks.push({ kind: 'list', ordered: list.ordered, items: list.items });
    list = null;
  };

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim();
    const heading = /^#{1,6}\s+(.*)$/.exec(line);
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    const numbered = /^\d+\.\s+(.*)$/.exec(line);

    if (line === '') {
      flushParagraph();
      flushList();
    } else if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ kind: 'heading', text: heading[1]! });
    } else if (bullet || numbered) {
      flushParagraph();
      const ordered = Boolean(numbered);
      if (list && list.ordered !== ordered) flushList();
      list ??= { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1]!);
    } else if (list) {
      // Une ligne qui suit un élément de liste sans marqueur le prolonge.
      list.items[list.items.length - 1] += ` ${line}`;
    } else {
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

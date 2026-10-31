import type { DocBlock, ExportDocument, Exporter } from '@/types/schema';

/** Retours à la ligne conservés : deux espaces en fin de ligne forcent le saut en Markdown. */
const lines = (text: string) => text.split('\n').join('  \n');

/** Évite qu'un texte commençant par « # », « - » ou « 1. » soit lu comme du Markdown. */
const escapeStart = (text: string) => text.replace(/^(\s*)([#>\-+*]|\d+\.)(\s)/gm, '$1\\$2$3');

const cell = (text: string) => text.replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ');

function block(b: DocBlock): string {
  switch (b.kind) {
    case 'heading':
      return `${'#'.repeat(b.level)} ${b.text}`;
    case 'paragraph':
      return lines(escapeStart(b.text));
    case 'list':
      return b.items.map((item, i) => `${b.ordered ? `${i + 1}.` : '-'} ${lines(item)}`).join('\n');
    case 'table':
      return [
        `| ${b.headers.map(cell).join(' | ')} |`,
        `| ${b.headers.map(() => '---').join(' | ')} |`,
        ...b.rows.map((row) => `| ${row.map(cell).join(' | ')} |`),
      ].join('\n');
    case 'warning':
      return [`> **À compléter :** ${b.text}`, ...(b.items ?? []).map((item) => `> - ${item}`)].join('\n');
  }
}

export function toMarkdown(doc: ExportDocument): string {
  return doc.blocks.map(block).join('\n\n') + '\n';
}

export const markdownExporter: Exporter = {
  format: 'markdown',
  label: 'Markdown (.md)',
  fileExtension: 'md',
  export: async (doc) => new Blob([toMarkdown(doc)], { type: 'text/markdown;charset=utf-8' }),
};

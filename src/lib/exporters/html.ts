import type { DocBlock, ExportDocument, Exporter } from '@/types/schema';

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const withBreaks = (text: string) => escape(text).replace(/\n/g, '<br>');

function block(b: DocBlock): string {
  switch (b.kind) {
    case 'heading':
      return `<h${b.level}>${escape(b.text)}</h${b.level}>`;
    case 'paragraph':
      return `<p>${withBreaks(b.text)}</p>`;
    case 'list': {
      const tag = b.ordered ? 'ol' : 'ul';
      return `<${tag}>${b.items.map((item) => `<li>${withBreaks(item)}</li>`).join('')}</${tag}>`;
    }
    case 'table':
      return (
        '<table><thead><tr>' +
        b.headers.map((h) => `<th scope="col">${escape(h)}</th>`).join('') +
        '</tr></thead><tbody>' +
        b.rows.map((row) => `<tr>${row.map((c) => `<td>${withBreaks(c)}</td>`).join('')}</tr>`).join('') +
        '</tbody></table>'
      );
    case 'warning':
      return (
        `<div class="warning"><p><strong>À compléter :</strong> ${withBreaks(b.text)}</p>` +
        (b.items?.length ? `<ul>${b.items.map((i) => `<li>${escape(i)}</li>`).join('')}</ul>` : '') +
        '</div>'
      );
  }
}

const STYLE = `
:root { color-scheme: light; }
body { margin: 0; background: #ffffff; color: #1e2b33; font: 17px/1.6 Georgia, 'Times New Roman', serif; }
main { max-width: 46rem; margin: 0 auto; padding: 3rem 1.25rem 4rem; }
h1, h2, h3 { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; line-height: 1.25; }
h1 { font-size: 2rem; margin: 2.5rem 0 1rem; }
main > h1:first-child { margin-top: 0; }
h2 { font-size: 1.35rem; margin: 2rem 0 0.6rem; }
h3 { font-size: 1.1rem; margin: 1.5rem 0 0.5rem; }
p, ul, ol { margin: 0 0 1rem; }
table { width: 100%; border-collapse: collapse; margin: 0 0 1.25rem; font-size: 0.95rem; }
th, td { text-align: left; vertical-align: top; padding: 0.5rem 0.75rem 0.5rem 0; border-bottom: 1px solid #c6cfc5; }
th { border-bottom: 2px solid #4d5c63; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; }
.warning { border-left: 3px solid #94650f; background: #f7efdc; padding: 0.75rem 1rem; margin: 0 0 1.25rem; }
.warning p, .warning ul { margin: 0; }
.warning ul { margin-top: 0.4rem; }
@media print { body { font-size: 11pt; } main { padding: 0; max-width: none; } h1, h2, h3 { break-after: avoid; } tr { break-inside: avoid; } }
`.trim();

export function toHtml(doc: ExportDocument): string {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(doc.title)}</title>
<style>
${STYLE}
</style>
</head>
<body>
<main>
${doc.blocks.map(block).join('\n')}
</main>
</body>
</html>
`;
}

export const htmlExporter: Exporter = {
  format: 'html',
  label: 'HTML (.html)',
  fileExtension: 'html',
  export: async (doc) => new Blob([toHtml(doc)], { type: 'text/html;charset=utf-8' }),
};

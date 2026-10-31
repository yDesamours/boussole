import pdfMake from 'pdfmake/build/pdfmake';
import vfs from 'pdfmake/build/vfs_fonts';
import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import type { DocBlock, ExportDocument, Exporter } from '@/types/schema';

// Polices intégrées (Roboto) : le PDF se génère entièrement dans le navigateur.
pdfMake.addVirtualFileSystem(vfs);

function content(b: DocBlock): Content {
  switch (b.kind) {
    case 'heading':
      return { text: b.text, style: `h${b.level}` };
    case 'paragraph':
      return { text: b.text, margin: [0, 0, 0, 8] };
    case 'list':
      return b.ordered
        ? { ol: b.items, margin: [0, 0, 0, 8] }
        : { ul: b.items, margin: [0, 0, 0, 8] };
    case 'table':
      return {
        table: {
          headerRows: 1,
          widths: b.headers.map(() => '*'),
          body: [b.headers.map((h) => ({ text: h, bold: true })), ...b.rows],
        },
        layout: 'lightHorizontalLines',
        fontSize: 9.5,
        margin: [0, 2, 0, 12],
      };
    case 'warning':
      return {
        table: {
          widths: ['*'],
          body: [
            [
              {
                stack: [
                  { text: [{ text: 'À compléter : ', bold: true }, b.text] },
                  ...(b.items?.length ? [{ ul: b.items, margin: [0, 4, 0, 0] as [number, number, number, number] }] : []),
                ],
                fillColor: '#F7EFDC',
                margin: [8, 6, 8, 6],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: (i: number) => (i === 0 ? 3 : 0),
          vLineColor: () => '#94650F',
        },
        margin: [0, 0, 0, 12],
      };
  }
}

export function toPdfDefinition(doc: ExportDocument): TDocumentDefinitions {
  return {
    info: { title: doc.title, creator: 'Boussole' },
    pageSize: 'A4',
    pageMargins: [56, 56, 56, 56],
    defaultStyle: { font: 'Roboto', fontSize: 10.5, lineHeight: 1.3, color: '#1E2B33' },
    styles: {
      h1: { fontSize: 18, bold: true, margin: [0, 14, 0, 8] },
      h2: { fontSize: 13.5, bold: true, margin: [0, 12, 0, 6] },
      h3: { fontSize: 11.5, bold: true, color: '#4D5C63', margin: [0, 10, 0, 4] },
    },
    footer: (page: number, pages: number) => ({
      text: `${doc.title}   ${page} / ${pages}`,
      alignment: 'right',
      fontSize: 8,
      color: '#4D5C63',
      margin: [56, 20, 56, 0],
    }),
    content: doc.blocks.map(content),
  };
}

export const pdfExporter: Exporter = {
  format: 'pdf',
  label: 'PDF (.pdf)',
  fileExtension: 'pdf',
  export: (doc) => pdfMake.createPdf(toPdfDefinition(doc)).getBlob(),
};

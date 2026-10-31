import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import type { DocBlock, ExportDocument, Exporter } from '@/types/schema';

// Page A4, marges de 2,5 cm. Largeur utile : 11906 − 2 × 1418 = 9070 (unités DXA).
const PAGE = { width: 11906, height: 16838, margin: 1418 };
const CONTENT_WIDTH = PAGE.width - 2 * PAGE.margin;
const FONT = 'Calibri';
const LINE = { style: BorderStyle.SINGLE, size: 4, color: 'C6CFC5' };

/** Un texte avec ses retours à la ligne. */
function runs(text: string, bold = false): TextRun[] {
  return text.split('\n').map((line, i) => new TextRun({ text: line, bold, break: i > 0 ? 1 : undefined }));
}

const HEADINGS = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3 } as const;

function blocks(doc: ExportDocument): (Paragraph | Table)[] {
  let listInstance = 0; // Chaque liste numérotée recommence à 1
  const out: (Paragraph | Table)[] = [];

  const toChildren = (b: DocBlock): (Paragraph | Table)[] => {
    switch (b.kind) {
      case 'heading':
        return [new Paragraph({ heading: HEADINGS[b.level], children: runs(b.text) })];
      case 'paragraph':
        return [new Paragraph({ children: runs(b.text), spacing: { after: 160 } })];
      case 'list': {
        const instance = ++listInstance;
        return b.items.map(
          (item) =>
            new Paragraph({
              numbering: { reference: b.ordered ? 'numbers' : 'bullets', level: 0, instance },
              children: runs(item),
              spacing: { after: 80 },
            }),
        );
      }
      case 'table': {
        const width = Math.floor(CONTENT_WIDTH / b.headers.length);
        const widths = b.headers.map((_, i) => (i === b.headers.length - 1 ? CONTENT_WIDTH - width * (b.headers.length - 1) : width));
        const row = (cells: string[], header: boolean) =>
          new TableRow({
            tableHeader: header,
            children: cells.map(
              (text, i) =>
                new TableCell({
                  width: { size: widths[i]!, type: WidthType.DXA },
                  margins: { top: 80, bottom: 80, left: 100, right: 100 },
                  borders: { top: LINE, bottom: LINE, left: LINE, right: LINE },
                  shading: header ? { fill: 'E8EDE6', type: ShadingType.CLEAR, color: 'auto' } : undefined,
                  children: [new Paragraph({ children: runs(text, header) })],
                }),
            ),
          });
        return [
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: widths,
            rows: [row(b.headers, true), ...b.rows.map((r) => row(r, false))],
          }),
          new Paragraph({ children: [], spacing: { after: 120 } }),
        ];
      }
      case 'warning': {
        const box = { fill: 'F7EFDC', type: ShadingType.CLEAR, color: 'auto' } as const;
        const left = { left: { style: BorderStyle.SINGLE, size: 18, color: '94650F', space: 6 } };
        return [
          new Paragraph({
            shading: box,
            border: left,
            children: [new TextRun({ text: 'À compléter : ', bold: true }), ...runs(b.text)],
            spacing: { after: b.items?.length ? 40 : 160 },
          }),
          ...(b.items ?? []).map(
            (item, i, all) =>
              new Paragraph({
                shading: box,
                border: left,
                indent: { left: 360 },
                children: [new TextRun({ text: `– ${item}` })],
                spacing: { after: i === all.length - 1 ? 160 : 20 },
              }),
          ),
        ];
      }
    }
  };

  for (const b of doc.blocks) out.push(...toChildren(b));
  return out;
}

export async function toDocx(doc: ExportDocument): Promise<Blob> {
  const document = new Document({
    creator: 'Boussole',
    title: doc.title,
    styles: {
      default: { document: { run: { font: FONT, size: 22 } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 36, bold: true, font: FONT, color: '1E2B33' }, paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 28, bold: true, font: FONT, color: '1E2B33' }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
        { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 24, bold: true, font: FONT, color: '4D5C63' }, paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
      ],
    },
    numbering: {
      config: [
        { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
        { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE.width, height: PAGE.height },
            margin: { top: PAGE.margin, right: PAGE.margin, bottom: PAGE.margin, left: PAGE.margin },
          },
        },
        children: blocks(doc),
      },
    ],
  });
  return Packer.toBlob(document);
}

export const docxExporter: Exporter = {
  format: 'docx',
  label: 'Word (.docx)',
  fileExtension: 'docx',
  export: toDocx,
};

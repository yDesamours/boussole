import type { ExportFormat, Exporter } from '@/types/schema';
import { markdownExporter } from './markdown';
import { htmlExporter } from './html';

/** Les formats proposés, dans l'ordre d'affichage. */
export const EXPORT_FORMATS: { format: ExportFormat; label: string }[] = [
  { format: 'markdown', label: 'Markdown (.md)' },
  { format: 'html', label: 'HTML (.html)' },
  { format: 'pdf', label: 'PDF (.pdf)' },
  { format: 'docx', label: 'Word (.docx)' },
];

/**
 * Renvoie l'exporteur d'un format. PDF et Word s'appuient sur des bibliothèques volumineuses :
 * elles ne sont chargées qu'au premier export dans ce format.
 */
export async function getExporter(format: ExportFormat): Promise<Exporter> {
  switch (format) {
    case 'markdown':
      return markdownExporter;
    case 'html':
      return htmlExporter;
    case 'pdf':
      return (await import('./pdf')).pdfExporter;
    case 'docx':
      return (await import('./docx')).docxExporter;
  }
}

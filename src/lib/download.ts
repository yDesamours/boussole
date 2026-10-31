/** Propose le téléchargement d'un fichier, sans serveur. */
export function downloadBlob(fileName: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.append(link);
  link.click();
  link.remove();
  // Laisse au navigateur le temps de lancer le téléchargement avant de libérer le fichier.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function downloadText(fileName: string, text: string, mimeType = 'application/json'): void {
  downloadBlob(fileName, new Blob([text], { type: `${mimeType};charset=utf-8` }));
}

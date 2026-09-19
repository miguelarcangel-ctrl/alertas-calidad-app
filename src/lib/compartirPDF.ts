/**
 * Wrapper de Web Share API con feature-detection obligatoria (ver PLAN.md
 * sección 6.1 y el skill alerta-calidad-schema): sin `navigator.canShare`
 * con `files`, el botón de compartir falla silenciosamente en escritorio,
 * así que el llamador debe ocultar el botón cuando esto devuelve false.
 */
export function puedeCompartirArchivo(file: File): boolean {
  if (typeof navigator === "undefined" || !navigator.share || !navigator.canShare) {
    return false;
  }
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

export async function compartirPDF(file: File, alertaNumero: string): Promise<void> {
  await navigator.share({
    files: [file],
    title: `Alerta de Calidad ${alertaNumero}`,
    text: `Alerta de Calidad ${alertaNumero} — DP World Panamá`,
  });
}

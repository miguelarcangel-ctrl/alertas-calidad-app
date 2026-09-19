import imageCompression from "browser-image-compression";

/**
 * Comprime una foto en el cliente antes de insertarla en el PDF:
 * ancho máx. ~1600px, re-encode a JPEG calidad ~80 (ver docs/pdf-layout-spec.md
 * y el skill alerta-calidad-schema). Devuelve un data URL listo para
 * <Image src={...} /> de @react-pdf/renderer.
 */
export async function compressImageToDataUrl(file: File): Promise<string> {
  const compressed = await imageCompression(file, {
    maxWidthOrHeight: 1600,
    initialQuality: 0.8,
    fileType: "image/jpeg",
    useWebWorker: true,
  });
  return imageCompression.getDataUrlFromFile(compressed);
}

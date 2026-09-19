import { Image, Text, View } from "@react-pdf/renderer";
import type { EvidenciaFoto } from "@/types/alerta";
import { pdfStyles } from "./styles";

/**
 * Cuadrícula de hasta 10 fotos (2 filas x 5 columnas) para la página
 * principal. Si hay menos de 10, el grid simplemente tiene menos celdas
 * (sin huecos vacíos con borde) — regla de paginación en
 * docs/pdf-layout-spec.md, punto 2.
 */
export function EvidenciaGridPDF({ fotos }: { fotos: EvidenciaFoto[] }) {
  const primeras10 = fotos.slice(0, 10);

  if (primeras10.length === 0) {
    return <Text style={pdfStyles.evidenciaNota}>Sin evidencia fotográfica adjunta.</Text>;
  }

  return (
    <View style={pdfStyles.evidenciaGrid}>
      {primeras10.map((foto, i) => (
        <View key={i} style={pdfStyles.evidenciaCelda}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image style={pdfStyles.evidenciaImg} src={foto.imagenBase64OrUrl} />
          {foto.caption ? <Text style={pdfStyles.evidenciaCaption}>{foto.caption}</Text> : null}
        </View>
      ))}
    </View>
  );
}

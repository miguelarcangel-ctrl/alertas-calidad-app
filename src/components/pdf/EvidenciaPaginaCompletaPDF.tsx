import { Image, Page, Text, View } from "@react-pdf/renderer";
import type { EvidenciaFoto } from "@/types/alerta";
import { pdfStyles } from "./styles";

/**
 * Una página completa por cada foto a partir de la 11ª (regla de
 * paginación en docs/pdf-layout-spec.md, punto 3). Cada <Page> es un
 * componente explícito — el motor no soporta saltos de página vía CSS
 * dentro de un mismo <Page> (ver skill react-pdf-alertas).
 */
export function EvidenciaPaginaCompletaPDF({
  foto,
  numero,
  alertaNumero,
}: {
  foto: EvidenciaFoto;
  numero: number;
  alertaNumero: string;
}) {
  return (
    <Page size="A4" orientation="landscape" style={pdfStyles.page}>
      <View style={pdfStyles.paginaEvidenciaHeader}>
        <Text style={pdfStyles.paginaEvidenciaTitulo}>ALERTA DE CALIDAD - EVIDENCIA FOTOGRÁFICA</Text>
        <Text style={pdfStyles.paginaEvidenciaSubtitulo}>
          ALERTA N° {alertaNumero} | EVIDENCIA {numero}
        </Text>
      </View>
      <View style={pdfStyles.paginaEvidenciaImgWrap}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image style={pdfStyles.paginaEvidenciaImg} src={foto.imagenBase64OrUrl} />
        {foto.caption ? <Text style={pdfStyles.paginaEvidenciaCaption}>{foto.caption}</Text> : null}
      </View>
    </Page>
  );
}

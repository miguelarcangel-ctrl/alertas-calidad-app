import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { AlertaCalidad } from "@/types/alerta";
import { CuerpoAlertaPDF, PiePDF } from "./CuerpoAlertaPDF";
import { EvidenciaGridPDF } from "./EvidenciaGridPDF";
import { EvidenciaPaginaCompletaPDF } from "./EvidenciaPaginaCompletaPDF";
import { HeaderPDF } from "./HeaderPDF";
import { pdfStyles } from "./styles";

/**
 * Documento "en caliente": el que se genera y se envía en el momento, con
 * todas las fotos incluidas. Ver AlertaCalidadDocumentHistorial para la
 * variante regenerada desde el historial (sin fotos).
 */
export function AlertaCalidadDocument({ alerta }: { alerta: AlertaCalidad }) {
  const fotosAdicionales = alerta.evidenciaFotografica.slice(10);

  return (
    <Document title={`Alerta de Calidad ${alerta.alertaNumero}`}>
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        <HeaderPDF alertaNumero={alerta.alertaNumero} fechaEmision={alerta.fechaEmision} />
        <CuerpoAlertaPDF alerta={alerta} />

        <Text style={pdfStyles.sectionTitle}>EVIDENCIA FOTOGRÁFICA</Text>
        <View style={{ marginBottom: 4 }}>
          <EvidenciaGridPDF fotos={alerta.evidenciaFotografica} />
        </View>

        <PiePDF alerta={alerta} />
      </Page>

      {fotosAdicionales.map((foto, i) => (
        <EvidenciaPaginaCompletaPDF
          key={i}
          foto={foto}
          numero={i + 11}
          alertaNumero={alerta.alertaNumero}
        />
      ))}
    </Document>
  );
}

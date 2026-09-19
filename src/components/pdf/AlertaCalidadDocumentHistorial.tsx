import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { AlertaCalidadHistorial } from "@/types/alerta";
import { CuerpoAlertaPDF, PiePDF } from "./CuerpoAlertaPDF";
import { HeaderPDF } from "./HeaderPDF";
import { pdfStyles } from "./styles";

/**
 * Documento regenerado desde el historial: NUNCA incluye fotos (nunca se
 * persistieron). La sección de evidencia se reemplaza por una nota de
 * texto con cantidadFotosOriginal + captionsFotosOriginal — ver PLAN.md
 * sección 6.2 y docs/pdf-layout-spec.md.
 */
export function AlertaCalidadDocumentHistorial({ alerta }: { alerta: AlertaCalidadHistorial }) {
  const nota =
    alerta.cantidadFotosOriginal > 0
      ? `Esta alerta se envió originalmente con ${alerta.cantidadFotosOriginal} foto(s) de evidencia: ${alerta.captionsFotosOriginal.filter(Boolean).join(", ") || "sin captions registrados"}. Las imágenes no se conservan en el historial — el PDF con fotos fue el que se envió por WhatsApp/correo en su momento.`
      : "Esta alerta no tenía evidencia fotográfica adjunta.";

  return (
    <Document title={`Alerta de Calidad ${alerta.alertaNumero} (historial)`}>
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        <HeaderPDF alertaNumero={alerta.alertaNumero} fechaEmision={alerta.fechaEmision} />
        <CuerpoAlertaPDF alerta={alerta} />

        <Text style={pdfStyles.sectionTitle}>EVIDENCIA FOTOGRÁFICA</Text>
        <View style={{ marginBottom: 4 }}>
          <Text style={pdfStyles.evidenciaNota}>{nota}</Text>
        </View>

        <PiePDF alerta={alerta} />
      </Page>
    </Document>
  );
}

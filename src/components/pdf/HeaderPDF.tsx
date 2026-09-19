import { Image, Text, View } from "@react-pdf/renderer";
import { pdfStyles } from "./styles";

interface HeaderPDFProps {
  alertaNumero: string;
  fechaEmision: string;
}

/**
 * Encabezado de página 1: logo real de DP World + franja de título +
 * metadatos de alerta N° y fecha (ver docs/pdf-layout-spec.md).
 */
export function HeaderPDF({ alertaNumero, fechaEmision }: HeaderPDFProps) {
  return (
    <View style={pdfStyles.headerRow}>
      <View style={pdfStyles.headerLogoBox}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image style={pdfStyles.headerLogoImg} src="/brand/dpworld-logo-fondo-blanco.png" />
      </View>
      <View style={pdfStyles.headerTitleBox}>
        <Text style={pdfStyles.headerTitleText}>ALERTA DE CALIDAD</Text>
      </View>
      <View style={pdfStyles.headerMetaBox}>
        <Text style={pdfStyles.headerMetaLabel}>ALERTA N°</Text>
        <Text style={pdfStyles.headerMetaValue}>{alertaNumero}</Text>
      </View>
      <View style={pdfStyles.headerMetaBox}>
        <Text style={pdfStyles.headerMetaLabel}>FECHA EMISIÓN</Text>
        <Text style={pdfStyles.headerMetaValue}>{fechaEmision}</Text>
      </View>
    </View>
  );
}

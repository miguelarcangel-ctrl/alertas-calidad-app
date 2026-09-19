import { StyleSheet } from "@react-pdf/renderer";

/**
 * Paleta y estilos compartidos por los documentos PDF de Alerta de Calidad.
 * Colores tomados del skill dpworld-panama-brand — NO usar el azul marino
 * del PDF de ejemplo original (ver docs/pdf-layout-spec.md).
 */
export const brand = {
  primary: "#3E3C90",
  green: "#00C389",
  red: "#E8003D",
  dark: "#1A1A2E",
  black: "#000000",
  white: "#FFFFFF",
  grayLight: "#F5F5F5",
  grayMid: "#E0E0E0",
  grayText: "#666666",
};

export const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8,
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
    color: brand.black,
  },

  // ----- Encabezado -----
  headerRow: {
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 6,
  },
  headerLogoBox: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 8,
  },
  headerLogoImg: {
    width: 90,
    objectFit: "contain",
  },
  headerLogoCaption: {
    marginTop: 2,
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
    color: brand.dark,
    textAlign: "center",
  },
  headerTitleBox: {
    width: "50%",
    backgroundColor: brand.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleText: {
    color: brand.white,
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  headerMetaBox: {
    width: "15%",
    borderWidth: 1,
    borderColor: brand.grayMid,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  headerMetaLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 6,
    color: brand.white,
    backgroundColor: brand.black,
    paddingVertical: 2,
    paddingHorizontal: 3,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  headerMetaValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    paddingVertical: 4,
  },

  // ----- Tablas de datos genéricas -----
  table: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: brand.grayMid,
    marginBottom: 4,
  },
  tableCol: {
    flexGrow: 1,
    flexBasis: 0,
    borderRightWidth: 1,
    borderRightColor: brand.grayMid,
  },
  tableColLast: {
    flexGrow: 1,
    flexBasis: 0,
  },
  cellLabel: {
    backgroundColor: brand.black,
    color: brand.white,
    fontFamily: "Helvetica-Bold",
    fontSize: 6.5,
    letterSpacing: 0.3,
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  cellValue: {
    fontSize: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
    minHeight: 16,
  },

  // ----- Tipo de alerta -----
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  checkbox: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: brand.black,
    marginRight: 4,
  },
  checkboxChecked: {
    backgroundColor: brand.red,
  },

  bullet: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletDot: {
    width: 8,
    fontSize: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 8,
    lineHeight: 1.3,
  },

  sectionTitle: {
    backgroundColor: brand.black,
    color: brand.white,
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    letterSpacing: 0.5,
    paddingVertical: 3,
    paddingHorizontal: 4,
    marginBottom: 4,
  },

  // ----- Evidencia fotográfica -----
  evidenciaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  evidenciaCelda: {
    width: "20%",
    padding: 3,
  },
  evidenciaImg: {
    width: "100%",
    height: 70,
    objectFit: "cover",
    borderWidth: 1,
    borderColor: brand.grayMid,
  },
  evidenciaCaption: {
    fontSize: 5.5,
    color: brand.grayText,
    marginTop: 2,
    textAlign: "center",
  },
  evidenciaNota: {
    fontSize: 8,
    lineHeight: 1.4,
    padding: 6,
  },

  // ----- Página individual de evidencia (foto 11+) -----
  paginaEvidenciaHeader: {
    marginBottom: 10,
  },
  paginaEvidenciaTitulo: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: brand.primary,
  },
  paginaEvidenciaSubtitulo: {
    fontSize: 9,
    marginTop: 2,
  },
  paginaEvidenciaImgWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  paginaEvidenciaImg: {
    maxWidth: "90%",
    maxHeight: 420,
    objectFit: "contain",
  },
  paginaEvidenciaCaption: {
    marginTop: 8,
    fontSize: 9,
    textAlign: "center",
    color: brand.grayText,
  },

  // ----- Firmas / pie -----
  firmaBloque: {
    alignItems: "center",
  },
  firmaNombre: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  firmaCargo: {
    fontSize: 7,
    color: brand.grayText,
  },
});

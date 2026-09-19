import { Text, View } from "@react-pdf/renderer";
import type { AlertaCalidadCamposComunes } from "@/types/alerta";
import { pdfStyles } from "./styles";

const NA = "N/A";

function Celda({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={last ? pdfStyles.tableColLast : pdfStyles.tableCol}>
      <Text style={pdfStyles.cellLabel}>{label}</Text>
      <Text style={pdfStyles.cellValue}>{value || NA}</Text>
    </View>
  );
}

function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <Text style={pdfStyles.cellValue}>{NA}</Text>;
  }
  return (
    <View style={{ padding: 4 }}>
      {items.map((item, i) => (
        <View key={i} style={pdfStyles.bullet}>
          <Text style={pdfStyles.bulletDot}>•</Text>
          <Text style={pdfStyles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Cuerpo del PDF (todo excepto el header y la sección de evidencia
 * fotográfica, que difiere entre la variante "en caliente" y "historial" —
 * ver docs/pdf-layout-spec.md). Compartido por AlertaCalidadDocument y
 * AlertaCalidadDocumentHistorial.
 */
export function CuerpoAlertaPDF({ alerta }: { alerta: AlertaCalidadCamposComunes }) {
  const tipo = alerta.tipoAlerta.tipo;

  return (
    <>
      {/* Fila 1: centro de emisión, cliente, SKU, descripción del producto */}
      <View style={pdfStyles.table}>
        <Celda label="CENTRO DE EMISIÓN" value={alerta.centroEmision || "DP WORLD PANAMA"} />
        <Celda label="CLIENTE" value={alerta.cliente} />
        <Celda label="SKU" value={alerta.sku || NA} />
        <Celda label="DESCRIPCIÓN DEL PRODUCTO" value={alerta.descripcionProducto} last />
      </View>

      {/* Fila 2: lote, fechas, transportista, orden de transporte */}
      <View style={pdfStyles.table}>
        <Celda label="LOTE" value={alerta.lote || NA} />
        <Celda label="FECHA PRODUCCIÓN" value={alerta.fechaProduccion || NA} />
        <Celda label="FECHA VENCIMIENTO" value={alerta.fechaVencimiento || NA} />
        <Celda label="TRANSPORTISTA" value={alerta.transportista || NA} />
        <Celda label="ORDEN DE TRANSPORTE" value={alerta.ordenTransporte || NA} last />
      </View>

      {/* Fila 3: tipo de alerta, descripción de la alerta, cantidad afectada */}
      <View style={pdfStyles.table}>
        <View style={pdfStyles.tableCol}>
          <Text style={pdfStyles.cellLabel}>TIPO DE ALERTA</Text>
          <View style={{ padding: 4 }}>
            {(["Calidad", "Seguridad", "Otro"] as const).map((opcion) => (
              <View key={opcion} style={pdfStyles.checkboxRow}>
                <View
                  style={[pdfStyles.checkbox, tipo === opcion ? pdfStyles.checkboxChecked : {}]}
                />
                <Text>
                  {opcion}
                  {opcion === "Otro" && tipo === "Otro" && alerta.tipoAlerta.otroDetalle
                    ? `: ${alerta.tipoAlerta.otroDetalle}`
                    : ""}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={pdfStyles.tableCol}>
          <Text style={pdfStyles.cellLabel}>DESCRIPCIÓN DE LA ALERTA</Text>
          <Text style={pdfStyles.cellValue}>{alerta.descripcionAlerta}</Text>
        </View>
        <View style={pdfStyles.tableColLast}>
          <Text style={pdfStyles.cellLabel}>CANTIDAD AFECTADA</Text>
          <View style={{ padding: 4 }}>
            {alerta.cantidadAfectada.length === 0 ? (
              <Text style={{ fontSize: 8 }}>{NA}</Text>
            ) : (
              alerta.cantidadAfectada.map((linea, i) => (
                <Text key={i} style={{ fontSize: 8, marginBottom: 2 }}>
                  {linea.etiqueta}: {linea.valor}
                </Text>
              ))
            )}
          </View>
        </View>
      </View>

      {/* Fila 4: hallazgos, causa raíz, acciones realizadas */}
      <View style={pdfStyles.table}>
        <View style={pdfStyles.tableCol}>
          <Text style={pdfStyles.cellLabel}>HALLAZGOS</Text>
          <Bullets items={alerta.hallazgos} />
        </View>
        <View style={pdfStyles.tableCol}>
          <Text style={pdfStyles.cellLabel}>CAUSA RAÍZ</Text>
          <Text style={pdfStyles.cellValue}>{alerta.causaRaiz || NA}</Text>
        </View>
        <View style={pdfStyles.tableColLast}>
          <Text style={pdfStyles.cellLabel}>ACCIONES REALIZADAS</Text>
          <Bullets items={alerta.accionesRealizadas} />
        </View>
      </View>
    </>
  );
}

/** Fila final: observaciones + las 3 firmas. Se renderiza después de la evidencia. */
export function PiePDF({ alerta }: { alerta: AlertaCalidadCamposComunes }) {
  return (
    <View style={pdfStyles.table}>
      <View style={pdfStyles.tableCol}>
        <Text style={pdfStyles.cellLabel}>OBSERVACIONES</Text>
        <Text style={pdfStyles.cellValue}>{alerta.observaciones || NA}</Text>
      </View>
      {(
        [
          ["ELABORADO POR", alerta.firmas.elaboradoPor],
          ["REVISADO POR", alerta.firmas.revisadoPor],
          ["APROBADO POR", alerta.firmas.aprobadoPor],
        ] as const
      ).map(([label, firma], i) => (
        <View key={label} style={i === 2 ? pdfStyles.tableColLast : pdfStyles.tableCol}>
          <Text style={pdfStyles.cellLabel}>{label}</Text>
          <View style={[pdfStyles.firmaBloque, { paddingVertical: 6 }]}>
            <Text style={pdfStyles.firmaNombre}>{firma?.nombre || "—"}</Text>
            <Text style={pdfStyles.firmaCargo}>{firma?.cargo || ""}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

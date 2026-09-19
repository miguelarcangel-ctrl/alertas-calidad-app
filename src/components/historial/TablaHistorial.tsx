import type { AlertaCalidadHistorial } from "@/types/alerta";

interface TablaHistorialProps {
  alertas: AlertaCalidadHistorial[];
  onSeleccionar: (alerta: AlertaCalidadHistorial) => void;
  generandoId: string | null;
}

export function TablaHistorial({ alertas, onSeleccionar, generandoId }: TablaHistorialProps) {
  if (alertas.length === 0) {
    return <p className="text-sm text-dpw-gray-text">No hay alertas guardadas todavía.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-dpw-gray-mid bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-black text-white">
            <th className="px-3 py-2 font-bold uppercase tracking-wide">N° Alerta</th>
            <th className="px-3 py-2 font-bold uppercase tracking-wide">Fecha</th>
            <th className="px-3 py-2 font-bold uppercase tracking-wide">Cliente</th>
            <th className="px-3 py-2 font-bold uppercase tracking-wide">Tipo</th>
            <th className="px-3 py-2 font-bold uppercase tracking-wide">SKU</th>
            <th className="px-3 py-2 font-bold uppercase tracking-wide">Fotos originales</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {alertas.map((alerta, i) => (
            <tr
              key={alerta.id}
              className={i % 2 === 0 ? "bg-white" : "bg-dpw-gray-light"}
              style={{ borderTop: "1px solid #E0E0E0" }}
            >
              <td className="px-3 py-2 font-semibold text-dpw-primary">{alerta.alertaNumero}</td>
              <td className="px-3 py-2">{alerta.fechaEmision}</td>
              <td className="px-3 py-2">{alerta.cliente}</td>
              <td className="px-3 py-2">{alerta.tipoAlerta.tipo}</td>
              <td className="px-3 py-2">{alerta.sku || "N/A"}</td>
              <td className="px-3 py-2">{alerta.cantidadFotosOriginal}</td>
              <td className="px-3 py-2 text-right">
                <button
                  type="button"
                  onClick={() => onSeleccionar(alerta)}
                  disabled={generandoId === alerta.id}
                  className="rounded border border-dpw-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-dpw-primary hover:bg-dpw-primary hover:text-white disabled:opacity-50"
                >
                  {generandoId === alerta.id ? "Generando…" : "Descargar PDF"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

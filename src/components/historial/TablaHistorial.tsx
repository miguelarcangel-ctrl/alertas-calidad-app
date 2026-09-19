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
    <div className="overflow-x-auto rounded-2xl border border-dpw-gray-mid bg-white shadow-[0_2px_12px_rgba(26,16,96,0.06)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-black text-white">
            <th className="font-condensed px-4 py-3 font-bold uppercase tracking-wide">
              N° Alerta
            </th>
            <th className="font-condensed px-4 py-3 font-bold uppercase tracking-wide">Fecha</th>
            <th className="font-condensed px-4 py-3 font-bold uppercase tracking-wide">Cliente</th>
            <th className="font-condensed px-4 py-3 font-bold uppercase tracking-wide">Tipo</th>
            <th className="font-condensed px-4 py-3 font-bold uppercase tracking-wide">SKU</th>
            <th className="font-condensed px-4 py-3 font-bold uppercase tracking-wide">
              Fotos originales
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {alertas.map((alerta, i) => (
            <tr
              key={alerta.id}
              className={i % 2 === 0 ? "bg-white" : "bg-dpw-gray-light"}
              style={{ borderTop: "1px solid #E0E0E0" }}
            >
              <td className="font-condensed px-4 py-3 font-bold text-dpw-primary">
                {alerta.alertaNumero}
              </td>
              <td className="px-4 py-3">{alerta.fechaEmision}</td>
              <td className="px-4 py-3">{alerta.cliente}</td>
              <td className="px-4 py-3">{alerta.tipoAlerta.tipo}</td>
              <td className="px-4 py-3">{alerta.sku || "N/A"}</td>
              <td className="px-4 py-3">{alerta.cantidadFotosOriginal}</td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onSeleccionar(alerta)}
                  disabled={generandoId === alerta.id}
                  className="font-condensed rounded-lg border border-dpw-primary px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-dpw-primary transition-colors hover:bg-dpw-primary hover:text-white disabled:opacity-50"
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

"use client";

import { useEffect, useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";

import { TablaHistorial } from "@/components/historial/TablaHistorial";
import { inputClass, labelClass } from "@/components/form/ui";
import { AlertaCalidadDocumentHistorial } from "@/components/pdf/AlertaCalidadDocumentHistorial";
import type { AlertaCalidadHistorial } from "@/types/alerta";

export default function HistorialPage() {
  const [alertas, setAlertas] = useState<AlertaCalidadHistorial[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generandoId, setGenerandoId] = useState<string | null>(null);

  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroDesde, setFiltroDesde] = useState("");
  const [filtroHasta, setFiltroHasta] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      try {
        const res = await fetch("/api/alertas");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No se pudo cargar el historial.");
        if (!cancelado) setAlertas(data.alertas ?? []);
      } catch (err) {
        if (!cancelado) setError(err instanceof Error ? err.message : "Error inesperado");
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  const alertasFiltradas = useMemo(() => {
    return alertas.filter((a) => {
      const coincideCliente =
        !filtroCliente || a.cliente.toLowerCase().includes(filtroCliente.toLowerCase());
      const coincideDesde = !filtroDesde || a.fechaEmision >= filtroDesde;
      const coincideHasta = !filtroHasta || a.fechaEmision <= filtroHasta;
      return coincideCliente && coincideDesde && coincideHasta;
    });
  }, [alertas, filtroCliente, filtroDesde, filtroHasta]);

  async function descargarDesdeHistorial(alerta: AlertaCalidadHistorial) {
    setGenerandoId(alerta.id);
    try {
      const blob = await pdf(<AlertaCalidadDocumentHistorial alerta={alerta} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${alerta.alertaNumero}-historial.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerandoId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-xl font-bold uppercase tracking-wide text-dpw-dark">
        Historial de alertas
      </h1>

      <div className="mb-4 grid grid-cols-1 gap-4 rounded-lg border border-dpw-gray-mid bg-white p-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Cliente</label>
          <input
            className={inputClass}
            placeholder="Buscar por cliente…"
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Desde</label>
          <input
            type="date"
            className={inputClass}
            value={filtroDesde}
            onChange={(e) => setFiltroDesde(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Hasta</label>
          <input
            type="date"
            className={inputClass}
            value={filtroHasta}
            onChange={(e) => setFiltroHasta(e.target.value)}
          />
        </div>
      </div>

      {cargando ? (
        <p className="text-sm text-dpw-gray-text">Cargando historial…</p>
      ) : error ? (
        <p className="text-sm text-dpw-red">{error}</p>
      ) : (
        <TablaHistorial
          alertas={alertasFiltradas}
          onSeleccionar={descargarDesdeHistorial}
          generandoId={generandoId}
        />
      )}
    </div>
  );
}

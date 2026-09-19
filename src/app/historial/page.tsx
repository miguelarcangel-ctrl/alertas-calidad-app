"use client";

import { useEffect, useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";

import { TablaHistorial } from "@/components/historial/TablaHistorial";
import { inputClass, labelClass, sectionClass } from "@/components/form/ui";
import { PageHeader } from "@/components/PageHeader";
import { AlertaCalidadDocumentHistorial } from "@/components/pdf/AlertaCalidadDocumentHistorial";
import type { AlertaCalidadHistorial } from "@/types/alerta";

export default function HistorialPage() {
  const [alertas, setAlertas] = useState<AlertaCalidadHistorial[]>([]);
  const [cargando, setCargando] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generandoId, setGenerandoId] = useState<string | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [vaciando, setVaciando] = useState(false);

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
        if (!cancelado) setLoadError(err instanceof Error ? err.message : "Error inesperado");
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

  async function eliminarUno(alerta: AlertaCalidadHistorial) {
    const ok = window.confirm(
      `¿Eliminar la alerta ${alerta.alertaNumero} (${alerta.cliente}) del historial? Esta acción no se puede deshacer.`
    );
    if (!ok) return;

    setEliminandoId(alerta.id);
    setError(null);
    try {
      const res = await fetch(`/api/alertas/${alerta.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo eliminar la alerta.");
      setAlertas((prev) => prev.filter((a) => a.id !== alerta.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado al eliminar.");
    } finally {
      setEliminandoId(null);
    }
  }

  async function vaciarHistorial() {
    if (alertas.length === 0) return;

    const ok = window.confirm(
      `Esto borra las ${alertas.length} alertas guardadas en el historial (no afecta ningún PDF ya descargado o compartido). Esta acción no se puede deshacer. ¿Continuar?`
    );
    if (!ok) return;

    const texto = window.prompt('Para confirmar, escribe exactamente: BORRAR');
    if (texto !== "BORRAR") {
      if (texto !== null) window.alert("Texto incorrecto — no se eliminó nada.");
      return;
    }

    setVaciando(true);
    setError(null);
    try {
      const res = await fetch("/api/alertas?confirm=BORRAR_TODO", { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo vaciar el historial.");
      setAlertas([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado al vaciar el historial.");
    } finally {
      setVaciando(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader eyebrow="Registro · DAL Colón Logistics Park" title="Historial de Alertas" />
        <button
          type="button"
          onClick={vaciarHistorial}
          disabled={vaciando || alertas.length === 0}
          className="font-condensed rounded-lg border-2 border-dpw-red px-4 py-2 text-xs font-bold uppercase tracking-wide text-dpw-red transition-colors hover:bg-dpw-red hover:text-white disabled:opacity-40"
        >
          {vaciando ? "Vaciando…" : "Vaciar historial"}
        </button>
      </div>

      <div className={`mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3 ${sectionClass}`}>
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

      {error ? <p className="mb-3 text-sm font-medium text-dpw-red">{error}</p> : null}

      {cargando ? (
        <p className="text-sm text-dpw-gray-text">Cargando historial…</p>
      ) : loadError ? (
        <p className="text-sm text-dpw-red">{loadError}</p>
      ) : (
        <TablaHistorial
          alertas={alertasFiltradas}
          onSeleccionar={descargarDesdeHistorial}
          onEliminar={eliminarUno}
          generandoId={generandoId}
          eliminandoId={eliminandoId}
        />
      )}
    </div>
  );
}

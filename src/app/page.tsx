"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { pdf } from "@react-pdf/renderer";

import { AccionesRealizadas } from "@/components/form/AccionesRealizadas";
import { CantidadAfectada } from "@/components/form/CantidadAfectada";
import { CausaRaiz } from "@/components/form/CausaRaiz";
import { EvidenciaFotografica, type FotoEvidencia } from "@/components/form/EvidenciaFotografica";
import { Firmas } from "@/components/form/Firmas";
import { Hallazgos } from "@/components/form/Hallazgos";
import { HeaderFields } from "@/components/form/HeaderFields";
import { errorClass, inputClass, sectionClass, sectionTitleClass } from "@/components/form/ui";
import { TipoAlerta } from "@/components/form/TipoAlerta";
import { AlertaCalidadDocument } from "@/components/pdf/AlertaCalidadDocument";
import { compartirPDF, puedeCompartirArchivo } from "@/lib/compartirPDF";
import { registrarAlertaNumeroUsado, sugerirSiguienteAlertaNumero } from "@/lib/numeroAlerta";
import { alertaCalidadSchema, type AlertaCalidadFormValues } from "@/lib/schema";
import type { AlertaCalidad, NuevaAlertaHistorial } from "@/types/alerta";

type Estado = "idle" | "generando" | "listo" | "enviando-correo" | "error";

export default function Page() {
  const form = useForm<AlertaCalidadFormValues>({
    resolver: zodResolver(alertaCalidadSchema),
    defaultValues: {
      alertaNumero: sugerirSiguienteAlertaNumero(),
      fechaEmision: new Date().toISOString().slice(0, 10),
      centroEmision: "DP WORLD PANAMA",
      cliente: "",
      descripcionProducto: "",
      tipoAlerta: { tipo: "Calidad" },
      descripcionAlerta: "",
      cantidadAfectada: [],
      hallazgos: [""],
      accionesRealizadas: [""],
      causaRaiz: "",
      firmas: {},
      destinatarioEmail: "",
    },
  });

  const [fotos, setFotos] = useState<FotoEvidencia[]>([]);
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  async function generarYGuardar(values: AlertaCalidadFormValues) {
    setEstado("generando");
    setMensaje(null);
    setPdfFile(null);

    if (fotos.some((f) => f.comprimiendo)) {
      setEstado("error");
      setMensaje("Espera a que terminen de comprimirse las fotos antes de generar el PDF.");
      return;
    }

    const evidenciaFotografica = fotos
      .filter((f) => f.dataUrl)
      .map((f) => ({ imagenBase64OrUrl: f.dataUrl as string, caption: f.caption || undefined }));

    const alerta: AlertaCalidad = {
      ...values,
      centroEmision: values.centroEmision || "DP WORLD PANAMA",
      evidenciaFotografica,
    };

    try {
      const blob = await pdf(<AlertaCalidadDocument alerta={alerta} />).toBlob();
      const file = new File([blob], `${alerta.alertaNumero}.pdf`, { type: "application/pdf" });
      setPdfFile(file);
      registrarAlertaNumeroUsado(alerta.alertaNumero);

      const historial: NuevaAlertaHistorial = {
        alertaNumero: alerta.alertaNumero,
        fechaEmision: alerta.fechaEmision,
        centroEmision: alerta.centroEmision,
        cliente: alerta.cliente,
        sku: alerta.sku,
        descripcionProducto: alerta.descripcionProducto,
        lote: alerta.lote,
        fechaProduccion: alerta.fechaProduccion,
        fechaVencimiento: alerta.fechaVencimiento,
        transportista: alerta.transportista,
        ordenTransporte: alerta.ordenTransporte,
        tipoAlerta: alerta.tipoAlerta,
        descripcionAlerta: alerta.descripcionAlerta,
        cantidadAfectada: alerta.cantidadAfectada,
        hallazgos: alerta.hallazgos,
        causaRaiz: alerta.causaRaiz,
        accionesRealizadas: alerta.accionesRealizadas,
        cantidadFotosOriginal: evidenciaFotografica.length,
        captionsFotosOriginal: evidenciaFotografica.map((f) => f.caption || ""),
        observaciones: alerta.observaciones,
        firmas: alerta.firmas,
      };

      const res = await fetch("/api/alertas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(historial),
      });

      if (!res.ok) {
        throw new Error("El PDF se generó, pero no se pudo guardar en el historial.");
      }

      setEstado("listo");
      setMensaje("PDF generado y guardado en el historial.");
    } catch (err) {
      setEstado("error");
      setMensaje(err instanceof Error ? err.message : "Ocurrió un error generando el PDF.");
    }
  }

  function descargar() {
    if (!pdfFile) return;
    const url = URL.createObjectURL(pdfFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = pdfFile.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function compartir() {
    if (!pdfFile) return;
    try {
      await compartirPDF(pdfFile, form.getValues("alertaNumero"));
    } catch {
      // El usuario canceló el selector nativo — no es un error a mostrar.
    }
  }

  async function enviarPorCorreo() {
    if (!pdfFile) return;
    const destinatario = form.getValues("destinatarioEmail");
    if (!destinatario) {
      setMensaje("Escribe un correo destinatario antes de enviar.");
      return;
    }

    setEstado("enviando-correo");
    setMensaje(null);

    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);
      formData.append("destinatario", destinatario);
      formData.append("alertaNumero", form.getValues("alertaNumero"));
      formData.append("cliente", form.getValues("cliente"));

      const res = await fetch("/api/enviar-correo", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo enviar el correo.");
      }

      setEstado("listo");
      setMensaje(`Correo enviado a ${destinatario}.`);
    } catch (err) {
      setEstado("error");
      setMensaje(err instanceof Error ? err.message : "Ocurrió un error enviando el correo.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-xl font-bold uppercase tracking-wide text-dpw-dark">
        Nueva alerta de calidad
      </h1>

      <form
        onSubmit={form.handleSubmit(generarYGuardar)}
        className="space-y-6"
      >
        <HeaderFields form={form} />
        <TipoAlerta form={form} />

        <section className={sectionClass}>
          <h2 className={sectionTitleClass}>Descripción de la alerta</h2>
          <textarea rows={3} className={inputClass} {...form.register("descripcionAlerta")} />
          {form.formState.errors.descripcionAlerta ? (
            <p className={errorClass}>{String(form.formState.errors.descripcionAlerta.message)}</p>
          ) : null}
        </section>

        <CantidadAfectada form={form} />
        <Hallazgos form={form} />
        <CausaRaiz form={form} />
        <AccionesRealizadas form={form} />
        <EvidenciaFotografica fotos={fotos} setFotos={setFotos} />

        <section className={sectionClass}>
          <h2 className={sectionTitleClass}>Observaciones</h2>
          <textarea rows={2} className={inputClass} {...form.register("observaciones")} />
        </section>

        <Firmas form={form} />

        <section className={sectionClass}>
          <h2 className={sectionTitleClass}>Envío</h2>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-dpw-dark">
            Correo destinatario (para el botón &quot;Enviar por correo&quot;)
          </label>
          <input
            type="email"
            className={inputClass}
            placeholder="destinatario@cliente.com"
            {...form.register("destinatarioEmail")}
          />
          {form.formState.errors.destinatarioEmail ? (
            <p className={errorClass}>{String(form.formState.errors.destinatarioEmail.message)}</p>
          ) : null}
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={estado === "generando"}
            className="rounded bg-dpw-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-dpw-primary-dark disabled:opacity-50"
          >
            {estado === "generando" ? "Generando…" : "Generar PDF"}
          </button>

          {pdfFile ? (
            <>
              <button
                type="button"
                onClick={descargar}
                className="rounded border border-dpw-primary px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-dpw-primary hover:bg-dpw-primary hover:text-white"
              >
                Descargar
              </button>
              {puedeCompartirArchivo(pdfFile) ? (
                <button
                  type="button"
                  onClick={compartir}
                  className="rounded border border-dpw-green px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-dpw-green hover:bg-dpw-green hover:text-white"
                >
                  Compartir
                </button>
              ) : null}
              <button
                type="button"
                onClick={enviarPorCorreo}
                disabled={estado === "enviando-correo"}
                className="rounded border border-dpw-dark px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-dpw-dark hover:bg-dpw-dark hover:text-white disabled:opacity-50"
              >
                {estado === "enviando-correo" ? "Enviando…" : "Enviar por correo"}
              </button>
            </>
          ) : null}
        </div>

        {mensaje ? (
          <p className={estado === "error" ? "text-sm text-dpw-red" : "text-sm text-dpw-green"}>
            {mensaje}
          </p>
        ) : null}
      </form>
    </div>
  );
}

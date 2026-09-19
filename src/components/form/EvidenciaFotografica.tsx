"use client";

import { useRef, type Dispatch, type SetStateAction } from "react";
import { compressImageToDataUrl } from "@/lib/compressImage";
import { sectionClass, sectionTitleClass } from "./ui";

export interface FotoEvidencia {
  id: string;
  archivoNombre: string;
  previewUrl: string;
  dataUrl: string | null;
  caption: string;
  comprimiendo: boolean;
}

interface EvidenciaFotograficaProps {
  fotos: FotoEvidencia[];
  setFotos: Dispatch<SetStateAction<FotoEvidencia[]>>;
}

/**
 * Carga + compresión (máx. 1600px, JPEG ~80) + preview + caption por foto.
 * El binario comprimido (dataUrl) solo vive en memoria del navegador: se usa
 * para generar el PDF "en caliente" y nunca se sube al historial (ver
 * PLAN.md sección 6.2 y el skill alerta-calidad-schema). Usa siempre el
 * setter funcional de React (prev => ...) para no perder actualizaciones si
 * varias fotos terminan de comprimirse en paralelo.
 */
export function EvidenciaFotografica({ fotos, setFotos }: EvidenciaFotograficaProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function agregarArchivos(archivos: FileList | null) {
    if (!archivos || archivos.length === 0) return;

    const nuevas: FotoEvidencia[] = Array.from(archivos).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      archivoNombre: file.name,
      previewUrl: URL.createObjectURL(file),
      dataUrl: null,
      caption: "",
      comprimiendo: true,
    }));

    setFotos((prev) => [...prev, ...nuevas]);

    await Promise.all(
      Array.from(archivos).map(async (file, i) => {
        const id = nuevas[i].id;
        try {
          const dataUrl = await compressImageToDataUrl(file);
          setFotos((prev) => prev.map((f) => (f.id === id ? { ...f, dataUrl, comprimiendo: false } : f)));
        } catch {
          setFotos((prev) => prev.map((f) => (f.id === id ? { ...f, comprimiendo: false } : f)));
        }
      })
    );
  }

  function actualizarCaption(id: string, caption: string) {
    setFotos((prev) => prev.map((f) => (f.id === id ? { ...f, caption } : f)));
  }

  function quitar(id: string) {
    setFotos((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <section className={sectionClass}>
      <h2 className={sectionTitleClass}>Evidencia fotográfica</h2>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          void agregarArchivos(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded border border-dpw-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-dpw-primary hover:bg-dpw-primary hover:text-white"
      >
        + Agregar fotos
      </button>

      {fotos.length > 0 ? (
        <>
          <p className="mt-3 text-xs text-dpw-gray-text">
            {fotos.length} foto(s). Las primeras 10 van en cuadrícula; de la 11 en adelante, una
            página completa por foto en el PDF.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {fotos.map((foto, index) => (
              <div key={foto.id} className="rounded border border-dpw-gray-mid p-2">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={foto.previewUrl}
                    alt={foto.caption || foto.archivoNombre}
                    className="h-24 w-full rounded object-cover"
                  />
                  <span className="absolute left-1 top-1 rounded bg-dpw-dark/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                <input
                  className="mt-2 w-full rounded border border-dpw-gray-mid px-2 py-1 text-xs"
                  placeholder="Caption (opcional)"
                  value={foto.caption}
                  onChange={(e) => actualizarCaption(foto.id, e.target.value)}
                />
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-dpw-gray-text">
                    {foto.comprimiendo ? "Comprimiendo…" : "Lista"}
                  </span>
                  <button
                    type="button"
                    onClick={() => quitar(foto.id)}
                    className="text-[10px] font-semibold text-dpw-red"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-3 text-xs text-dpw-gray-text">Sin fotos agregadas todavía.</p>
      )}
    </section>
  );
}

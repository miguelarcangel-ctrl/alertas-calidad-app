"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { AlertaCalidadFormValues } from "@/lib/schema";
import { errorClass, inputClass, sectionClass, sectionTitleClass } from "./ui";

/**
 * Lista dinámica de bullets (agregar/quitar líneas de texto libre).
 * Usada por Hallazgos y AccionesRealizadas — ambos son `string[]` en el
 * esquema, por lo que se maneja como estado local sincronizado con
 * react-hook-form vía setValue (useFieldArray no maneja bien arrays de
 * primitivos).
 */
export function ListaDinamica({
  form,
  name,
  titulo,
  placeholder,
}: {
  form: UseFormReturn<AlertaCalidadFormValues>;
  name: "hallazgos" | "accionesRealizadas";
  titulo: string;
  placeholder: string;
}) {
  const { getValues, setValue, formState } = form;
  const [items, setItems] = useState<string[]>(getValues(name) ?? [""]);

  const error = formState.errors[name];

  function sync(next: string[]) {
    setItems(next);
    setValue(name, next, { shouldValidate: true });
  }

  function actualizar(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    sync(next);
  }

  function agregar() {
    sync([...items, ""]);
  }

  function quitar(index: number) {
    const next = items.filter((_, i) => i !== index);
    sync(next.length > 0 ? next : [""]);
  }

  return (
    <section className={sectionClass}>
      <h2 className={sectionTitleClass}>{titulo}</h2>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-dpw-primary">•</span>
            <input
              className={inputClass}
              value={item}
              placeholder={placeholder}
              onChange={(e) => actualizar(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => quitar(index)}
              className="rounded px-2 py-1 text-xs font-semibold text-dpw-red hover:bg-dpw-gray-light"
              aria-label="Quitar línea"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>
      {error ? <p className={errorClass}>{String(error.message)}</p> : null}
      <button
        type="button"
        onClick={agregar}
        className="mt-3 rounded border border-dpw-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-dpw-primary hover:bg-dpw-primary hover:text-white"
      >
        + Agregar línea
      </button>
    </section>
  );
}

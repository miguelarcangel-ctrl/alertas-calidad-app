import { useFieldArray, type UseFormReturn } from "react-hook-form";
import type { AlertaCalidadFormValues } from "@/lib/schema";
import { inputClass, sectionClass, sectionTitleClass } from "./ui";

/**
 * Lista flexible de líneas etiqueta/valor — deliberadamente sin estructura
 * fija de paletas/cajas, porque otros tipos de carga (contenedores, bultos,
 * kg) no calzan en ese molde (ver docs/data-schema.json).
 */
export function CantidadAfectada({ form }: { form: UseFormReturn<AlertaCalidadFormValues> }) {
  const { control, register } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "cantidadAfectada" });

  return (
    <section className={sectionClass}>
      <h2 className={sectionTitleClass}>Cantidad afectada</h2>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <input
              className={inputClass}
              placeholder="Etiqueta (ej. Paletas comprometidas)"
              {...register(`cantidadAfectada.${index}.etiqueta`)}
            />
            <input
              className={inputClass}
              placeholder="Valor (ej. 17)"
              {...register(`cantidadAfectada.${index}.valor`)}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="rounded px-2 py-1 text-xs font-semibold text-dpw-red hover:bg-dpw-gray-light"
              aria-label="Quitar línea"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => append({ etiqueta: "", valor: "" })}
        className="mt-3 rounded border border-dpw-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-dpw-primary hover:bg-dpw-primary hover:text-white"
      >
        + Agregar línea
      </button>
    </section>
  );
}

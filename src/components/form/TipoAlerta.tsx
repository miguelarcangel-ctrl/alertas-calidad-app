import type { UseFormReturn } from "react-hook-form";
import type { AlertaCalidadFormValues } from "@/lib/schema";
import { inputClass, labelClass, sectionClass, sectionTitleClass } from "./ui";

const opciones = ["Calidad", "Seguridad", "Otro"] as const;

export function TipoAlerta({ form }: { form: UseFormReturn<AlertaCalidadFormValues> }) {
  const { register, watch } = form;
  const tipoActual = watch("tipoAlerta.tipo");

  return (
    <section className={sectionClass}>
      <h2 className={sectionTitleClass}>Tipo de alerta</h2>
      <div className="flex flex-wrap gap-6">
        {opciones.map((opcion) => (
          <label key={opcion} className="flex items-center gap-2 text-sm font-medium">
            <input
              type="radio"
              value={opcion}
              className="h-4 w-4 accent-dpw-primary"
              {...register("tipoAlerta.tipo")}
            />
            {opcion}
          </label>
        ))}
      </div>
      {tipoActual === "Otro" ? (
        <div className="mt-3">
          <label className={labelClass} htmlFor="otroDetalle">
            Especificar
          </label>
          <input id="otroDetalle" className={inputClass} {...register("tipoAlerta.otroDetalle")} />
        </div>
      ) : null}
    </section>
  );
}

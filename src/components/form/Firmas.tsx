import type { UseFormReturn } from "react-hook-form";
import type { AlertaCalidadFormValues } from "@/lib/schema";
import { inputClass, labelClass, sectionClass, sectionTitleClass } from "./ui";

const roles = [
  { key: "elaboradoPor", label: "Elaborado por" },
  { key: "revisadoPor", label: "Revisado por" },
  { key: "aprobadoPor", label: "Aprobado por" },
] as const;

export function Firmas({ form }: { form: UseFormReturn<AlertaCalidadFormValues> }) {
  const { register } = form;

  return (
    <section className={sectionClass}>
      <h2 className={sectionTitleClass}>Firmas</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {roles.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-dpw-dark">{label}</p>
            <div>
              <label className={labelClass} htmlFor={`${key}-nombre`}>
                Nombre
              </label>
              <input
                id={`${key}-nombre`}
                className={inputClass}
                {...register(`firmas.${key}.nombre`)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor={`${key}-cargo`}>
                Cargo
              </label>
              <input
                id={`${key}-cargo`}
                className={inputClass}
                {...register(`firmas.${key}.cargo`)}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

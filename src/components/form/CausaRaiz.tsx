import type { UseFormReturn } from "react-hook-form";
import type { AlertaCalidadFormValues } from "@/lib/schema";
import { errorClass, inputClass, sectionClass, sectionTitleClass } from "./ui";

export function CausaRaiz({ form }: { form: UseFormReturn<AlertaCalidadFormValues> }) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <section className={sectionClass}>
      <h2 className={sectionTitleClass}>Causa raíz</h2>
      <textarea rows={4} className={inputClass} {...register("causaRaiz")} />
      {errors.causaRaiz ? <p className={errorClass}>{String(errors.causaRaiz.message)}</p> : null}
    </section>
  );
}

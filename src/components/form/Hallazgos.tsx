import type { UseFormReturn } from "react-hook-form";
import type { AlertaCalidadFormValues } from "@/lib/schema";
import { ListaDinamica } from "./ListaDinamica";

export function Hallazgos({ form }: { form: UseFormReturn<AlertaCalidadFormValues> }) {
  return (
    <ListaDinamica
      form={form}
      name="hallazgos"
      titulo="Hallazgos"
      placeholder="Ej. Se encontraron 5 paletas comprometidas..."
    />
  );
}

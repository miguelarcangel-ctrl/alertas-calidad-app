import type { UseFormReturn } from "react-hook-form";
import type { AlertaCalidadFormValues } from "@/lib/schema";
import { ListaDinamica } from "./ListaDinamica";

export function AccionesRealizadas({ form }: { form: UseFormReturn<AlertaCalidadFormValues> }) {
  return (
    <ListaDinamica
      form={form}
      name="accionesRealizadas"
      titulo="Acciones realizadas"
      placeholder="Ej. Identificación y segregación inmediata..."
    />
  );
}

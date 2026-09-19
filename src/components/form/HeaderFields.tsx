import type { UseFormReturn } from "react-hook-form";
import type { AlertaCalidadFormValues } from "@/lib/schema";
import { errorClass, inputClass, labelClass, sectionClass, sectionTitleClass } from "./ui";

interface Field {
  name: keyof AlertaCalidadFormValues;
  label: string;
  type?: string;
}

const fields: Field[] = [
  { name: "alertaNumero", label: "N° de alerta (CAL-AÑO-NNN)" },
  { name: "fechaEmision", label: "Fecha de emisión", type: "date" },
  { name: "centroEmision", label: "Centro de emisión" },
  { name: "cliente", label: "Cliente" },
  { name: "sku", label: "SKU" },
  { name: "descripcionProducto", label: "Descripción del producto" },
  { name: "lote", label: "Lote" },
  { name: "fechaProduccion", label: "Fecha de producción" },
  { name: "fechaVencimiento", label: "Fecha de vencimiento" },
  { name: "transportista", label: "Transportista" },
  { name: "ordenTransporte", label: "Orden de transporte" },
];

export function HeaderFields({ form }: { form: UseFormReturn<AlertaCalidadFormValues> }) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <section className={sectionClass}>
      <h2 className={sectionTitleClass}>Encabezado</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(({ name, label, type }) => {
          const error = errors[name];
          return (
            <div key={name}>
              <label className={labelClass} htmlFor={name}>
                {label}
              </label>
              <input id={name} type={type ?? "text"} className={inputClass} {...register(name)} />
              {error ? <p className={errorClass}>{String(error.message)}</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

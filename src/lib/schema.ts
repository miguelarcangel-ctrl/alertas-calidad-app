import { z } from "zod";

/**
 * Espejo en zod de docs/data-schema.json — valida los campos de texto del
 * formulario. `evidenciaFotografica` se maneja aparte (estado local con
 * File[] + compresión en EvidenciaFotografica.tsx) porque no tiene sentido
 * validarlo con zod y nunca viaja al historial (ver historialSchema.ts).
 */

export const tipoAlertaSchema = z.object({
  tipo: z.enum(["Calidad", "Seguridad", "Otro"]),
  otroDetalle: z.string().optional(),
});

export const cantidadAfectadaLineaSchema = z.object({
  etiqueta: z.string().min(1, "Requerido"),
  valor: z.string().min(1, "Requerido"),
});

export const firmaPersonaSchema = z.object({
  nombre: z.string().optional(),
  cargo: z.string().optional(),
});

export const firmasSchema = z.object({
  elaboradoPor: firmaPersonaSchema.optional(),
  revisadoPor: firmaPersonaSchema.optional(),
  aprobadoPor: firmaPersonaSchema.optional(),
});

export const alertaCalidadSchema = z.object({
  alertaNumero: z
    .string()
    .regex(/^CAL-[0-9]{4}-[0-9]{3}$/, "Formato esperado: CAL-{AÑO}-{NNN}, ej. CAL-2026-018"),
  fechaEmision: z.string().min(1, "Requerido"),
  centroEmision: z.string(),
  cliente: z.string().min(1, "Requerido"),
  sku: z.string().optional(),
  descripcionProducto: z.string().min(1, "Requerido"),
  lote: z.string().optional(),
  fechaProduccion: z.string().optional(),
  fechaVencimiento: z.string().optional(),
  transportista: z.string().optional(),
  ordenTransporte: z.string().optional(),
  tipoAlerta: tipoAlertaSchema,
  descripcionAlerta: z.string().min(1, "Requerido"),
  cantidadAfectada: z.array(cantidadAfectadaLineaSchema),
  hallazgos: z.array(z.string().min(1, "No puede estar vacío")).min(1, "Agrega al menos un hallazgo"),
  causaRaiz: z.string().min(1, "Requerido"),
  accionesRealizadas: z
    .array(z.string().min(1, "No puede estar vacío"))
    .min(1, "Agrega al menos una acción realizada"),
  observaciones: z.string().optional(),
  firmas: firmasSchema,
  destinatarioEmail: z.string().email("Correo inválido").optional().or(z.literal("")),
});

export type AlertaCalidadFormValues = z.infer<typeof alertaCalidadSchema>;

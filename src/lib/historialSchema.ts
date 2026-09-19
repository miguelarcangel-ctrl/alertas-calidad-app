import { z } from "zod";
import { cantidadAfectadaLineaSchema, firmasSchema, tipoAlertaSchema } from "./schema";

/**
 * Espejo en zod de docs/historial-schema.json — lo que efectivamente se
 * guarda en base de datos. NUNCA incluye binarios de imagen (regla de oro
 * del skill alerta-calidad-schema), solo cantidad y captions.
 */

export const envioSchema = z.object({
  canal: z.enum(["whatsapp", "email", "otro"]),
  destinatario: z.string().optional(),
  fecha: z.string(),
});

export const nuevaAlertaHistorialSchema = z.object({
  alertaNumero: z.string().regex(/^CAL-[0-9]{4}-[0-9]{3}$/),
  fechaEmision: z.string().min(1),
  centroEmision: z.string().optional(),
  cliente: z.string().min(1),
  sku: z.string().optional(),
  descripcionProducto: z.string().min(1),
  lote: z.string().optional(),
  fechaProduccion: z.string().optional(),
  fechaVencimiento: z.string().optional(),
  transportista: z.string().optional(),
  ordenTransporte: z.string().optional(),
  tipoAlerta: tipoAlertaSchema,
  descripcionAlerta: z.string().min(1),
  cantidadAfectada: z.array(cantidadAfectadaLineaSchema),
  hallazgos: z.array(z.string()),
  causaRaiz: z.string(),
  accionesRealizadas: z.array(z.string()),
  cantidadFotosOriginal: z.number().int().min(0),
  captionsFotosOriginal: z.array(z.string()),
  observaciones: z.string().optional(),
  firmas: firmasSchema,
  envios: z.array(envioSchema).optional(),
});

export type NuevaAlertaHistorialInput = z.infer<typeof nuevaAlertaHistorialSchema>;

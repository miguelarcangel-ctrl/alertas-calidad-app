export type TipoAlertaValor = "Calidad" | "Seguridad" | "Otro";

export interface TipoAlerta {
  tipo: TipoAlertaValor;
  otroDetalle?: string;
}

export interface CantidadAfectadaLinea {
  etiqueta: string;
  valor: string;
}

export interface EvidenciaFoto {
  imagenBase64OrUrl: string;
  caption?: string;
}

export interface FirmaPersona {
  nombre?: string;
  cargo?: string;
}

export interface Firmas {
  elaboradoPor?: FirmaPersona;
  revisadoPor?: FirmaPersona;
  aprobadoPor?: FirmaPersona;
}

/**
 * Campos compartidos entre AlertaCalidad (formulario completo) y
 * AlertaCalidadHistorial (lo persistido en BD) — es el subconjunto que
 * renderiza el cuerpo del PDF (todo excepto evidencia fotográfica).
 */
export interface AlertaCalidadCamposComunes {
  alertaNumero: string;
  fechaEmision: string;
  centroEmision?: string;
  cliente: string;
  sku?: string;
  descripcionProducto: string;
  lote?: string;
  fechaProduccion?: string;
  fechaVencimiento?: string;
  transportista?: string;
  ordenTransporte?: string;
  tipoAlerta: TipoAlerta;
  descripcionAlerta: string;
  cantidadAfectada: CantidadAfectadaLinea[];
  hallazgos: string[];
  causaRaiz: string;
  accionesRealizadas: string[];
  observaciones?: string;
  firmas: Firmas;
}

/** Datos completos del formulario, usados para generar el PDF "en caliente" (con fotos). */
export interface AlertaCalidad extends AlertaCalidadCamposComunes {
  evidenciaFotografica: EvidenciaFoto[];
  /** Solo para la acción de enviar, no forma parte del PDF. */
  destinatarioEmail?: string;
}

/** Bitácora opcional de envíos (Fase 2 en espíritu, pero el campo ya existe en el esquema). */
export interface Envio {
  canal: "whatsapp" | "email" | "otro";
  destinatario?: string;
  fecha: string;
}

/** Lo que se guarda efectivamente en base de datos — nunca incluye binarios de imagen. */
export interface AlertaCalidadHistorial extends AlertaCalidadCamposComunes {
  id: string;
  cantidadFotosOriginal: number;
  captionsFotosOriginal: string[];
  envios?: Envio[];
  fechaGuardado: string;
}

/** Payload que el cliente envía a POST /api/alertas (subconjunto de AlertaCalidadHistorial). */
export type NuevaAlertaHistorial = Omit<AlertaCalidadHistorial, "id" | "fechaGuardado">;

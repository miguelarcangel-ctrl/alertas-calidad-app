const STORAGE_KEY = "alertas-calidad:ultimo-correlativo";

/**
 * Sugiere el siguiente número CAL-{AÑO}-{NNN} basado en localStorage.
 * Fase 1 (sin backend de numeración): el usuario puede editarlo a mano.
 * Fase 2: se generaría server-side de forma correlativa (ver PLAN.md sección 2).
 */
export function sugerirSiguienteAlertaNumero(): string {
  const anio = new Date().getFullYear();

  if (typeof window === "undefined") {
    return `CAL-${anio}-001`;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const registro = raw ? (JSON.parse(raw) as { anio: number; correlativo: number }) : null;

    const correlativo = registro && registro.anio === anio ? registro.correlativo + 1 : 1;
    return `CAL-${anio}-${String(correlativo).padStart(3, "0")}`;
  } catch {
    return `CAL-${anio}-001`;
  }
}

export function registrarAlertaNumeroUsado(alertaNumero: string): void {
  if (typeof window === "undefined") return;

  const match = alertaNumero.match(/^CAL-(\d{4})-(\d{3})$/);
  if (!match) return;

  const anio = Number(match[1]);
  const correlativo = Number(match[2]);

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const registro = raw ? (JSON.parse(raw) as { anio: number; correlativo: number }) : null;

    if (!registro || registro.anio !== anio || correlativo > registro.correlativo) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ anio, correlativo }));
    }
  } catch {
    // localStorage no disponible (modo privado, etc.) — no bloquea el flujo.
  }
}

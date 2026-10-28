"use client";

import Image from "next/image";
import Script from "next/script";
import { useRef } from "react";

declare global {
  interface Window {
    DPW?: { escena?: (nombre: string, root?: Element | null) => void; ESCENAS?: Record<string, unknown> };
  }
}

const CLAVE = "cal_entro";

/** Muestra u oculta la portada. La clase en <html> la pone también el script de layout.tsx antes de pintar. */
export function verPortada(on: boolean) {
  document.documentElement.classList.toggle("dpw-entro", !on);
  try {
    if (on) sessionStorage.removeItem(CLAVE);
    else sessionStorage.setItem(CLAVE, "1");
  } catch {}
  if (!on) window.scrollTo(0, 0);
}

/** Script en línea para <head>: si ya se entró en esta pestaña, la portada no parpadea al recargar. */
export const portadaInicial = `try{if(sessionStorage.getItem('${CLAVE}'))document.documentElement.classList.add('dpw-entro')}catch(e){}`;

/**
 * Portada común de las apps (molde Last Mile, skill linea-grafica) con la escena
 * «radar». Alertas de Calidad no tiene usuarios, así que la tarjeta solo lleva
 * Entrar. La escena la dibuja public/dpw/dpw-escenas.js.
 */
export function Portada() {
  const ref = useRef<HTMLDivElement>(null);
  // Los dos scripts cargan en cualquier orden: la escena arranca cuando ambos están listos (DPW.escena es idempotente)
  const arrancar = () => {
    if (window.DPW?.escena && window.DPW.ESCENAS?.radar) window.DPW.escena("radar", ref.current);
  };

  return (
    <div className="dpw-login" id="portada" ref={ref}>
      <div className="dpw-lg-art" aria-hidden="true">
        <svg data-dpw-art />
      </div>
      <div className="dpw-lg-hero">
        <div className="dpw-lg-kick">DP World · Alertas de Calidad</div>
        <h1 className="dpw-lg-h1">
          <span>Detectamos</span> <span>a tiempo</span> <em>cada desvío.</em>
        </h1>
        <p className="dpw-lg-lead">Alertas de calidad estandarizadas, con evidencia y PDF listo para compartir.</p>
      </div>
      <svg className="dpw-lg-ground" data-dpw-ground aria-hidden="true" />
      <div className="dpw-lg-card">
        <div className="dpw-lg-logo">
          <Image src="/dpw/assets/dpworld-logo-fondo-claro.png" alt="DP World" width={78} height={48} priority />
          <div className="dpw-lg-app">Alertas de Calidad</div>
          <div className="dpw-lg-ref">DAL · Colón Logistics Park · Panamá</div>
        </div>
        <button type="button" className="dpw-lg-btn" onClick={() => verPortada(false)}>
          Entrar
        </button>
        <div className="dpw-lg-foot">Uso interno exclusivo · DP World Panamá</div>
      </div>
      <Script src="/dpw/dpw-shell.js" onReady={arrancar} />
      <Script src="/dpw/dpw-escenas.js" onReady={arrancar} />
    </div>
  );
}

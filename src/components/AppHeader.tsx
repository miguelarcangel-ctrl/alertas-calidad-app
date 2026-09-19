"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Nueva Alerta" },
  { href: "/historial", label: "Historial" },
] as const;

/**
 * Header compartido por las apps de la plataforma (Cotizador 3PL, Control de
 * Horas, Inspección de Contenedores): franja blanca fija arriba, ícono +
 * "DP WORLD" / subtítulo a la izquierda, nav en píldoras a la derecha.
 * Replicado aquí para que Alertas de Calidad se vea como una app más del
 * mismo portal, no como un formulario suelto.
 */
export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-dpw-border bg-white px-4 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
      <Link href="/" className="flex items-center gap-2.5">
        <Image src="/brand/dpworld-icon-arcos.png" alt="DP World" width={34} height={34} priority />
        <div className="leading-none">
          <div className="font-condensed text-base font-extrabold tracking-wide text-dpw-navy">
            DP WORLD
          </div>
          <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-dpw-primary">
            Alertas de Calidad
          </div>
        </div>
      </Link>

      <nav className="flex gap-1.5">
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`font-condensed rounded-lg border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                active
                  ? "border-dpw-primary bg-dpw-primary text-white"
                  : "border-transparent text-dpw-gray-text hover:bg-dpw-bg hover:text-dpw-primary"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

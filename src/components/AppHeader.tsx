"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { verPortada } from "@/components/Portada";

const links = [
  { href: "/", label: "Nueva Alerta" },
  { href: "/historial", label: "Historial" },
] as const;

const Marca = () => (
  <>
    <div className="dpw-logo">
      <Image src="/dpw/assets/dpworld-logo-fondo-claro.png" alt="DP World" width={55} height={34} priority />
    </div>
    <div>
      <div className="dpw-title">DP WORLD</div>
      <div className="dpw-sub">Alertas de Calidad</div>
    </div>
  </>
);

/**
 * Cinta superior y menú desplegable comunes a todas las apps de la plataforma
 * (molde Last Mile, skill linea-grafica): botón de tres rayas, logo y título a
 * la izquierda; Salir a la derecha. Las secciones van en el menú lateral, solo
 * con texto. Las clases dpw-* vienen de src/app/dpw-shell.css.
 */
export function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    drawer.current?.querySelector<HTMLElement>(".dpw-item.active, .dpw-item")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burger.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const salir = () => {
    setOpen(false);
    verPortada(true);
  };

  return (
    <>
      <header className="dpw-hdr">
        <div className="dpw-hdr-l">
          <button
            ref={burger}
            type="button"
            className="dpw-burger"
            aria-label="Abrir menú"
            aria-expanded={open}
            aria-controls="dpwDrawer"
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
          <Marca />
        </div>
        <div className="dpw-hdr-r">
          <button type="button" className="dpw-salir" onClick={salir}>
            Salir
          </button>
        </div>
      </header>

      <div className="dpw-ov" hidden={!open} onClick={() => setOpen(false)} />
      <nav
        ref={drawer}
        id="dpwDrawer"
        className={`dpw-drawer${open ? " open" : ""}`}
        aria-label="Menú principal"
        aria-hidden={!open}
      >
        <div className="dpw-drawer-h">
          <Marca />
          <button type="button" className="dpw-close" aria-label="Cerrar menú" onClick={() => setOpen(false)}>
            ×
          </button>
        </div>
        <div className="dpw-items">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`dpw-item${active ? " active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
        <div className="dpw-drawer-f">
          <span />
          <button type="button" className="dpw-salir" onClick={salir}>
            Salir
          </button>
        </div>
      </nav>
    </>
  );
}

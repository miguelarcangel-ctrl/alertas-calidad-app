import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alertas de Calidad — DP World Panamá",
  description: "Generación, envío e historial de Alertas de Calidad — DAL Colón Logistics Park.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="bg-dpw-primary text-white">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-wide">
              <Image
                src="/brand/dpworld-icon-arcos.png"
                alt="DP World"
                width={28}
                height={28}
                priority
              />
              <span className="uppercase">
                Alertas de Calidad <span className="opacity-70">· DP World Panamá</span>
              </span>
            </Link>
            <div className="flex gap-4 text-sm font-medium uppercase tracking-wide">
              <Link href="/" className="hover:text-dpw-green">
                Nueva alerta
              </Link>
              <Link href="/historial" className="hover:text-dpw-green">
                Historial
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 bg-dpw-gray-light">{children}</main>
      </body>
    </html>
  );
}

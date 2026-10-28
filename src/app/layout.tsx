import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { AppHeader } from "@/components/AppHeader";
import { Portada, portadaInicial } from "@/components/Portada";
import "./globals.css";
import "./dpw-shell.css";

const barlow = Barlow({
  variable: "--font-barlow",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  weight: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alertas de Calidad — DP World Panamá",
  description: "Generación, envío e historial de Alertas de Calidad — DAL Colón Logistics Park.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/dpw/pwa/favicon-32.png", apple: "/dpw/pwa/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Alertas" },
};

export const viewport: Viewport = { themeColor: "#1A1060" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${barlow.variable} ${barlowCondensed.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: portadaInicial }} />
      </head>
      <body className="min-h-full flex flex-col bg-dpw-bg">
        <Portada />
        <AppHeader />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

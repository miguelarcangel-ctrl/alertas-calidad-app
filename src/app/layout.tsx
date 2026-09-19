import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { AppHeader } from "@/components/AppHeader";
import "./globals.css";

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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${barlow.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-dpw-bg">
        <AppHeader />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

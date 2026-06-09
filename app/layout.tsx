import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Vente & pose de clôtures`,
    template: `%s — ${site.name}`,
  },
  description:
    "Clôtures Morel vous accompagne pour l’achat de matériaux de clôture et la pose de vos projets extérieurs. Catalogue, devis matériaux et devis pose en ligne.",
  keywords: [
    "clôtures",
    "piquets acacia",
    "grillage",
    "barrières",
    "pose de clôture",
    "Sprimont",
    "Liège",
  ],
  openGraph: {
    type: "website",
    locale: "fr_BE",
    siteName: site.name,
    title: `${site.name} — Vente & pose de clôtures`,
    description:
      "Achat de matériaux de clôture et pose professionnelle de vos projets extérieurs.",
    url: site.url,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

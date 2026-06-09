import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
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
      "Achat de matériaux de clôture et pose professionnelle de vos projets extérieurs à Sprimont et en province de Liège.",
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Vente & pose de clôtures`,
    description:
      "Matériaux de clôture et pose professionnelle à Sprimont, Esneux et Liège.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <LocalBusinessJsonLd />
        <a
          href="#contenu-principal"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-forest focus:px-4 focus:py-2 focus:text-white"
        >
          Aller au contenu principal
        </a>
        <Header />
        <main id="contenu-principal" className="min-w-0 flex-1 overflow-x-clip">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

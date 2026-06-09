import type { Metadata } from "next";
import { PanierClient } from "@/components/cart/PanierClient";
import { TAX_NOTE } from "@/lib/catalog";
import { FaqSection } from "@/components/ui/FaqSection";
import { salesFaq } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Demande de devis matériaux",
  description:
    "Finalisez votre sélection de matériaux de clôture et demandez un devis personnalisé à Clôtures Morel.",
  robots: { index: false, follow: true },
};

export default function PanierPage() {
  return (
    <>
      <div className="border-b border-sand-300 bg-sage-soft/50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">
            Devis matériaux
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            Votre demande de devis
          </h1>
          <p className="mt-3 max-w-2xl text-bark-muted">
            Vérifiez votre sélection, renseignez vos coordonnées et envoyez votre
            demande. {TAX_NOTE}. Il s’agit d’une demande de devis, sans engagement —
            pas d’une commande en ligne. Les frais de livraison, s’ils sont nécessaires,
            seront précisés dans notre réponse selon votre adresse et les conditions
            d’accès.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <PanierClient />
        <div className="mt-14 border-t border-sand-300 pt-14">
          <FaqSection
            items={salesFaq}
            contained={false}
            title="Prix, livraison et devis"
            description="Quelques précisions utiles avant d’envoyer votre demande."
          />
        </div>
      </div>
    </>
  );
}

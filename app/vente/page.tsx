import type { Metadata } from "next";
import { Tag, PackageCheck, Truck, MapPin, Search, ShoppingCart, FileText } from "lucide-react";
import { PageContainer } from "@/components/ui/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductCategoryGrid } from "@/components/home/ProductCategoryGrid";
import { CTASection } from "@/components/ui/CTASection";
import { PrimaryButton } from "@/components/ui/Button";
import { getCategoryCount, getProductCount } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Vente de matériaux de clôture",
  description:
    "Achetez vos matériaux de clôture chez Clôtures Morel : piquets, grillages, ganivelles, barrières et accessoires. Prix HTVA, disponibilité et devis en ligne.",
};

const benefits = [
  {
    icon: Tag,
    title: "Prix clairs HTVA",
    text: "Des tarifs transparents affichés hors TVA, prix au camion complet le cas échéant.",
  },
  {
    icon: PackageCheck,
    title: "Disponibilité indiquée",
    text: "Visualisez en un coup d’œil les produits en stock ou sur commande.",
  },
  {
    icon: Truck,
    title: "Achat en gros",
    text: "Des tarifs avantageux pour les grandes quantités et les chantiers.",
  },
  {
    icon: MapPin,
    title: "Retrait local",
    text: "Matériaux disponibles dans la région de Sprimont et de Liège.",
  },
];

const steps = [
  {
    icon: Search,
    title: "1. Parcourez le catalogue",
    text: "Explorez nos familles de produits et trouvez les matériaux adaptés.",
  },
  {
    icon: ShoppingCart,
    title: "2. Composez votre sélection",
    text: "Ajoutez les produits à votre panier et ajustez les quantités.",
  },
  {
    icon: FileText,
    title: "3. Demandez un devis",
    text: "Envoyez votre sélection : vous recevez un récapitulatif et un devis.",
  },
];

export default function VentePage() {
  const productCount = getProductCount();
  const categoryCount = getCategoryCount();

  return (
    <>
      {/* Intro */}
      <section className="border-b border-sand-300 bg-sage-soft/50">
        <PageContainer>
          <SectionTitle
            as="h1"
            eyebrow="Vente de matériaux"
            title="Tous vos matériaux de clôture, au meilleur tarif"
            description={`Plus de ${productCount} références réparties en ${categoryCount} catégories : piquets, grillages, ganivelles, barrières et accessoires. Composez votre devis en quelques clics.`}
          />
          <div className="mt-8">
            <PrimaryButton href="/catalogue" size="lg">
              Voir le catalogue
            </PrimaryButton>
          </div>
        </PageContainer>
      </section>

      {/* Benefits */}
      <PageContainer>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-card border border-sand-300 bg-white p-5 shadow-card"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sage-soft text-forest">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-forest-dark">
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-bark-muted">{text}</p>
            </div>
          ))}
        </div>
      </PageContainer>

      {/* How it works */}
      <section className="bg-sand-200/50">
        <PageContainer>
          <SectionTitle
            eyebrow="Comment ça marche"
            title="Du catalogue au devis, en 3 étapes"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-card border border-sand-300 bg-white p-5 shadow-card"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-forest-dark">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm text-bark-muted">{text}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Categories preview */}
      <PageContainer>
        <SectionTitle
          eyebrow="Nos gammes"
          title="Explorez nos familles de produits"
          description="Cliquez sur une famille pour découvrir les références disponibles."
        />
        <div className="mt-8">
          <ProductCategoryGrid />
        </div>
      </PageContainer>

      <CTASection
        title="Prêt à composer votre devis matériaux ?"
        description="Parcourez le catalogue, ajoutez vos produits et demandez un devis sans engagement."
        primary={{ href: "/catalogue", label: "Voir le catalogue" }}
        secondary={{ href: "/contact", label: "Nous contacter" }}
      />
    </>
  );
}

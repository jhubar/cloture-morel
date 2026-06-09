import { HeroSection } from "@/components/home/HeroSection";
import { ActivityChoiceCards } from "@/components/home/ActivityChoiceCards";
import { ProductCategoryGrid } from "@/components/home/ProductCategoryGrid";
import { InstallationPreview } from "@/components/home/InstallationPreview";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { CTASection } from "@/components/ui/CTASection";
import { PageContainer } from "@/components/ui/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SecondaryButton } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <PageContainer>
        <SectionTitle
          eyebrow="Deux activités, un seul interlocuteur"
          title="Que souhaitez-vous faire ?"
          description="Achetez vos matériaux de clôture ou confiez-nous la pose. Choisissez votre parcours."
          align="center"
          className="mb-10"
        />
        <ActivityChoiceCards />
      </PageContainer>

      <section className="bg-sand-200/60">
        <PageContainer>
          <SectionTitle
            eyebrow="Pourquoi Clôtures Morel"
            title="Des matériaux de qualité, un conseil de proximité"
            className="mb-10"
          />
          <TrustBadges />
        </PageContainer>
      </section>

      <PageContainer>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionTitle
            eyebrow="Catalogue"
            title="Nos familles de produits"
            description="Piquets, grillages, barrières, ganivelles, accessoires et bien plus."
          />
          <SecondaryButton href="/catalogue">Voir tout le catalogue</SecondaryButton>
        </div>
        <ProductCategoryGrid limit={6} />
      </PageContainer>

      <PageContainer padded={false} className="pb-12 sm:pb-16">
        <InstallationPreview />
      </PageContainer>

      <CTASection
        title="Un projet de clôture en tête ?"
        description="Composez votre devis matériaux en ligne ou demandez une pose sur mesure."
        primary={{ href: "/catalogue", label: "Demander un devis matériaux" }}
        secondary={{ href: "/pose#devis", label: "Demander un devis pose" }}
      />
    </>
  );
}

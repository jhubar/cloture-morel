import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/ui/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalSection";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales et informations sur l’éditeur du site Clôtures Morel.",
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <PageContainer>
      <SectionTitle as="h1" eyebrow="Informations" title="Mentions légales" />

      <LegalPageLayout>
        <LegalSection title="Éditeur du site">
          <p>
            {site.legalName}
            <br />
            {site.address.street}, {site.address.city}, {site.address.country}
            <br />
            {site.email} · {site.phone}
            <br />
            N° d&apos;entreprise / TVA : {site.vatNumber}
          </p>
        </LegalSection>

        <LegalSection title="Hébergement">
          <p>
            {site.hosting.name}
            <br />
            {site.hosting.address}
            <br />
            <a
              href={site.hosting.website}
              className="text-forest hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.hosting.website}
            </a>
          </p>
        </LegalSection>

        <LegalSection title="Propriété intellectuelle">
          <p>
            L&apos;ensemble du contenu de ce site (textes, visuels, logo, structure, catalogue)
            est protégé par le droit d&apos;auteur et le droit des marques. Toute reproduction,
            représentation ou exploitation non autorisée est interdite sans accord préalable écrit
            de {site.legalName}.
          </p>
        </LegalSection>

        <LegalSection title="Prix, catalogue et devis">
          <p>
            Les prix affichés sur le catalogue sont indiqués hors TVA (HTVA) et à titre
            indicatif. Ils ne constituent pas une offre contractuelle ferme. Seul le devis
            établi par {site.name} fait foi. {site.name} s&apos;efforce de maintenir des
            informations exactes mais ne garantit pas l&apos;absence d&apos;erreurs ou
            d&apos;omissions.
          </p>
        </LegalSection>

        <LegalSection title="Responsabilité">
          <p>
            {site.legalName} ne saurait être tenue responsable des dommages indirects liés à
            l&apos;utilisation du site. Les liens vers des sites tiers (réseaux sociaux, Google
            Maps) relèvent de la responsabilité de leurs éditeurs respectifs.
          </p>
        </LegalSection>

        <LegalSection title="Données personnelles">
          <p>
            Le traitement de vos données personnelles (formulaires, devis, cookies) est décrit
            dans notre{" "}
            <Link href="/politique-de-confidentialite" className="text-forest hover:underline">
              politique de confidentialité
            </Link>
            .
          </p>
          <p>
            Responsable du traitement : {site.legalName}. Contact :{" "}
            <a href={`mailto:${site.email}`} className="text-forest hover:underline">
              {site.email}
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection title="Droit applicable">
          <p>
            Le présent site est régi par le droit belge. Tout litige relève des tribunaux
            compétents du ressort de l&apos;entreprise, sous réserve des dispositions légales
            impératives applicables aux consommateurs.
          </p>
        </LegalSection>
      </LegalPageLayout>
    </PageContainer>
  );
}

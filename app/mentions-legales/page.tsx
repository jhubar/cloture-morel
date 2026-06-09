import type { Metadata } from "next";
import { PageContainer } from "@/components/ui/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
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

      <div className="prose-clm mt-8 max-w-2xl space-y-8 text-bark">
        <section>
          <h2 className="font-display text-lg font-semibold text-forest-dark">Éditeur</h2>
          <p className="mt-2 text-bark-muted">
            {site.legalName}
            <br />
            {site.address.street}, {site.address.city}, {site.address.country}
            <br />
            {site.email} · {site.phone}
            <br />
            N° d’entreprise / TVA : {site.vatNumber}
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-forest-dark">Hébergement</h2>
          <p className="mt-2 text-bark-muted">
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
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-forest-dark">
            Données personnelles
          </h2>
          <p className="mt-2 text-bark-muted">
            Les informations transmises via les formulaires (devis matériaux, devis
            pose, contact) sont utilisées uniquement pour traiter votre demande et
            vous recontacter. Elles ne sont ni revendues ni cédées à des tiers.
          </p>
          <p className="mt-2 text-bark-muted">
            Responsable du traitement : {site.legalName}. Vous pouvez demander
            l’accès, la rectification ou la suppression de vos données en écrivant à{" "}
            {site.email}.
          </p>
          <p className="mt-2 text-bark-muted">
            La page contact intègre une carte Google Maps. En l’affichant, Google
            peut déposer des cookies selon sa propre politique de confidentialité.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-forest-dark">
            Prix et devis
          </h2>
          <p className="mt-2 text-bark-muted">
            Les prix affichés sur le catalogue sont indiqués hors TVA (HTVA) et à titre
            indicatif. Ils ne constituent pas une offre contractuelle. Seul le devis
            établi par {site.name} fait foi.
          </p>
        </section>
      </div>
    </PageContainer>
  );
}

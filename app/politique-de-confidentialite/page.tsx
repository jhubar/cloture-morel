import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/ui/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalSection";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité et protection des données personnelles du site Clôtures Morel.",
  robots: { index: false, follow: true },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <PageContainer>
      <SectionTitle
        as="h1"
        eyebrow="Informations"
        title="Politique de confidentialité"
        description="Comment nous collectons, utilisons et protégeons vos données personnelles."
      />

      <LegalPageLayout>
        <p className="text-sm text-bark-muted">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-BE")}. Pour toute question,
          contactez-nous à{" "}
          <a href={`mailto:${site.email}`} className="text-forest hover:underline">
            {site.email}
          </a>
          .
        </p>

        <LegalSection title="1. Responsable du traitement">
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

        <LegalSection title="2. Données que nous collectons">
          <p>Selon votre utilisation du site, nous pouvons traiter :</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Formulaire de contact</strong> : nom, prénom, adresse e-mail, téléphone,
              message.
            </li>
            <li>
              <strong>Demande de devis matériaux</strong> : identité, coordonnées, société et
              numéro de TVA le cas échéant, adresse, contenu du panier, message libre, référence
              de devis.
            </li>
            <li>
              <strong>Demande de devis pose</strong> : identité, coordonnées, adresse du
              chantier, description du projet, photos éventuelles, message libre.
            </li>
            <li>
              <strong>Panier catalogue</strong> : articles sélectionnés, stockés localement dans
              votre navigateur (stockage local / cookie fonctionnel).
            </li>
            <li>
              <strong>Données techniques</strong> : journaux d&apos;accès et d&apos;erreurs
              générés par l&apos;hébergeur dans le cadre de la sécurité et du bon fonctionnement
              du service.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="3. Finalités et bases légales">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Traiter votre demande</strong> (contact, devis, commande de devis) : exécution
              de mesures précontractuelles ou intérêt légitime.
            </li>
            <li>
              <strong>Vous recontacter</strong> : intérêt légitime de {site.name} à répondre aux
              sollicitations commerciales.
            </li>
            <li>
              <strong>Conserver le panier</strong> : intérêt légitime / nécessité technique pour
              le service demandé.
            </li>
            <li>
              <strong>Afficher Google Maps</strong> (page contact) : uniquement après votre
              consentement via le bandeau cookies.
            </li>
            <li>
              <strong>Obligations légales</strong> : conservation comptable ou fiscale le cas
              échéant.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="4. Destinataires et sous-traitants">
          <p>Vos données ne sont pas vendues. Elles peuvent être transmises à :</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>{site.hosting.name}</strong> — hébergement du site ({site.hosting.website}
              ).
            </li>
            <li>
              <strong>Resend</strong> — envoi des e-mails transactionnels (confirmations de
              demande, notifications internes) lorsque cette fonctionnalité est activée.
            </li>
            <li>
              <strong>Google Ireland Limited</strong> — uniquement si vous acceptez le chargement
              de la carte Google Maps.
            </li>
          </ul>
          <p>
            Ces prestataires peuvent être situés en dehors de l&apos;Espace économique européen.
            Le cas échéant, des garanties appropriées (clauses contractuelles types, etc.) sont
            mises en place par les éditeurs concernés.
          </p>
        </LegalSection>

        <LegalSection title="5. Durées de conservation">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Demandes de contact et devis</strong> : jusqu&apos;à 3 ans après le dernier
              échange, sauf obligation légale contraire ou relation commerciale en cours.
            </li>
            <li>
              <strong>Données comptables liées à un devis accepté</strong> : selon les délais
              légaux applicables (en principe 7 ans en Belgique).
            </li>
            <li>
              <strong>Panier (navigateur)</strong> : tant que vous ne videz pas le stockage local
              de votre navigateur.
            </li>
            <li>
              <strong>Consentement cookies</strong> : 13 mois maximum, renouvelable.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="6. Vos droits">
          <p>
            Conformément au Règlement (UE) 2016/679 (RGPD) et à la loi belge, vous disposez des
            droits d&apos;accès, de rectification, d&apos;effacement, de limitation, d&apos;opposition
            et de portabilité lorsque applicable.
          </p>
          <p>
            Pour exercer vos droits :{" "}
            <a href={`mailto:${site.email}`} className="text-forest hover:underline">
              {site.email}
            </a>
            . Vous pouvez également introduire une réclamation auprès de l&apos;
            <a
              href="https://www.autoriteprotectiondonnees.be/"
              className="text-forest hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Autorité de protection des données (APD)
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection title="7. Cookies et stockage local">
          <p>Le site utilise :</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Stockage local (panier)</strong> : mémorise votre sélection de produits.
              Catégorie fonctionnelle, nécessaire au service.
            </li>
            <li>
              <strong>Consentement cookies</strong> : mémorise votre choix concernant la carte
              Google Maps.
            </li>
            <li>
              <strong>Google Maps</strong> (optionnel) : cookies et traceurs Google si vous
              acceptez l&apos;affichage de la carte ou cliquez sur « Afficher la carte ». Consultez
              la{" "}
              <a
                href="https://policies.google.com/privacy"
                className="text-forest hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                politique de confidentialité de Google
              </a>
              .
            </li>
          </ul>
          <p>
            Vous pouvez retirer votre consentement à tout moment en supprimant les données du site
            dans les paramètres de votre navigateur.
          </p>
        </LegalSection>

        <LegalSection title="8. Sécurité">
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables pour
            protéger vos données (connexion sécurisée HTTPS, accès limité, prestataires
            reconnus). Aucune transmission sur Internet n&apos;est toutefois totalement exempte de
            risque.
          </p>
        </LegalSection>

        <LegalSection title="9. Modifications">
          <p>
            Cette politique peut être mise à jour. La date en tête de page sera adaptée en cas de
            changement significatif.
          </p>
        </LegalSection>

        <p className="text-sm text-bark-muted">
          Voir aussi nos{" "}
          <Link href="/mentions-legales" className="text-forest hover:underline">
            mentions légales
          </Link>
          .
        </p>
      </LegalPageLayout>
    </PageContainer>
  );
}

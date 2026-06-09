import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ShoppingCart, Hammer } from "lucide-react";
import { PageContainer } from "@/components/ui/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ContactForm } from "@/components/forms/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Clôtures Morel pour vos projets de vente de matériaux et de pose de clôtures dans la région de Sprimont et de Liège.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-sand-300 bg-sage-soft/50">
        <PageContainer>
          <SectionTitle
            as="h1"
            eyebrow="Contact"
            title="Parlons de votre projet"
            description="Une question sur nos matériaux ou un projet de pose ? Écrivez-nous, nous vous répondons rapidement."
          />
        </PageContainer>
      </section>

      <PageContainer>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          {/* Company info */}
          <div className="space-y-6">
            <div className="rounded-card border border-sand-300 bg-white p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold text-forest-dark">
                Coordonnées
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-bark">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-forest" aria-hidden="true" />
                  <span>
                    {site.address.street}
                    <br />
                    {site.address.city}
                    <br />
                    {site.address.country}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-forest" aria-hidden="true" />
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-forest">
                    {site.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-forest" aria-hidden="true" />
                  <a href={`mailto:${site.email}`} className="hover:text-forest">
                    {site.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-forest" aria-hidden="true" />
                  <span className="text-bark-muted">
                    {/* TODO(client): confirmer les horaires d’ouverture. */}
                    Horaires sur demande
                  </span>
                </li>
              </ul>
              <p className="mt-4 border-t border-sand-200 pt-4 text-sm text-bark-muted">
                <span className="font-medium text-forest-dark">Zone d’intervention :</span>{" "}
                {site.serviceArea}
              </p>
            </div>

            {/* Map placeholder */}
            <div className="flex h-56 items-center justify-center rounded-card border border-dashed border-sand-300 bg-sand-200/40 text-sm text-bark-muted">
              {/* TODO(client): intégrer une carte (Google Maps / OpenStreetMap). */}
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Carte à intégrer
              </span>
            </div>

            {/* Quick CTAs */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/catalogue"
                className="flex items-center gap-3 rounded-card border border-sand-300 bg-white p-4 shadow-card transition-colors hover:bg-sand-200/50"
              >
                <ShoppingCart className="h-5 w-5 text-forest" aria-hidden="true" />
                <span className="text-sm font-medium text-forest-dark">
                  Devis matériaux
                </span>
              </Link>
              <Link
                href="/pose#devis"
                className="flex items-center gap-3 rounded-card border border-sand-300 bg-white p-4 shadow-card transition-colors hover:bg-sand-200/50"
              >
                <Hammer className="h-5 w-5 text-forest" aria-hidden="true" />
                <span className="text-sm font-medium text-forest-dark">Devis pose</span>
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-card border border-sand-300 bg-white p-5 shadow-card sm:p-6">
            <h2 className="font-display text-lg font-semibold text-forest-dark">
              Envoyez-nous un message
            </h2>
            <p className="mt-1 mb-5 text-sm text-bark-muted">
              Les champs marqués d’un astérisque (*) sont obligatoires.
            </p>
            <ContactForm />
          </div>
        </div>
      </PageContainer>
    </>
  );
}

import type { Metadata } from "next";
import {
  Phone,
  ClipboardList,
  FileText,
  Hammer,
  Home,
  Trees,
  ShieldCheck,
  MapPin,
  Handshake,
  Ruler,
} from "lucide-react";
import { PageContainer } from "@/components/ui/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { InstallationQuoteForm } from "@/components/forms/InstallationQuoteForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pose de clôtures",
  description:
    "Clôtures Morel pose vos clôtures, portails et aménagements extérieurs dans la région de Sprimont et de Liège. Demandez un devis de pose personnalisé.",
};

const projectTypes = [
  {
    icon: Home,
    title: "Clôtures résidentielles",
    text: "Délimitez et sécurisez votre jardin avec une clôture adaptée à votre terrain.",
  },
  {
    icon: Trees,
    title: "Clôtures naturelles",
    text: "Ganivelles, piquets en robinier et bois traité pour un rendu authentique.",
  },
  {
    icon: ShieldCheck,
    title: "Clôtures rigides & portails",
    text: "Panneaux rigides, portails et portillons pour une protection durable.",
  },
  {
    icon: Ruler,
    title: "Grands périmètres",
    text: "Terrains agricoles, parcelles et clôtures de grande longueur.",
  },
];

const reasons = [
  {
    icon: Handshake,
    title: "Un interlocuteur unique",
    text: "De la fourniture des matériaux à la pose, vous traitez avec une seule équipe locale.",
  },
  {
    icon: MapPin,
    title: "Ancrage local",
    text: `Nous intervenons à ${site.serviceArea}.`,
  },
  {
    icon: ShieldCheck,
    title: "Travail soigné",
    text: "Des matériaux de qualité et une pose réalisée dans les règles de l’art.",
  },
];

const steps = [
  {
    icon: Phone,
    title: "1. Contact",
    text: "Vous décrivez votre projet via le formulaire ou par téléphone.",
  },
  {
    icon: ClipboardList,
    title: "2. Analyse du projet",
    text: "Nous évaluons vos besoins, le terrain et les contraintes.",
  },
  {
    icon: FileText,
    title: "3. Devis",
    text: "Vous recevez un devis clair et détaillé, sans engagement.",
  },
  {
    icon: Hammer,
    title: "4. Pose",
    text: "Nous réalisons l’installation dans les délais convenus.",
  },
];

export default function PosePage() {
  return (
    <>
      {/* Intro */}
      <section className="border-b border-sand-300 bg-sage-soft/50">
        <PageContainer>
          <SectionTitle
            as="h1"
            eyebrow="Pose de clôtures"
            title="La pose de vos clôtures, confiée à des professionnels locaux"
            description="Clôtures Morel vous accompagne de A à Z : conseil, fourniture des matériaux et pose soignée de vos clôtures, portails et aménagements extérieurs."
          />
          <div className="mt-8">
            <a
              href="#devis"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-terracotta px-7 text-base font-semibold text-white transition-colors hover:bg-terracotta-dark"
            >
              Demander un devis de pose
            </a>
          </div>
        </PageContainer>
      </section>

      {/* Project types */}
      <PageContainer>
        <SectionTitle
          eyebrow="Nos réalisations"
          title="Quel type de projet ?"
          description="Nous intervenons sur une large variété de projets extérieurs."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {projectTypes.map(({ icon: Icon, title, text }) => (
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

      {/* Why choose us */}
      <section className="bg-sand-200/50">
        <PageContainer>
          <SectionTitle
            eyebrow="Pourquoi nous"
            title="Pourquoi choisir Clôtures Morel ?"
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {reasons.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-forest-dark">{title}</h3>
                  <p className="mt-1 text-sm text-bark-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Steps */}
      <PageContainer>
        <SectionTitle
          eyebrow="Notre méthode"
          title="Comment se déroule un projet de pose ?"
        />
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }) => (
            <li
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
            </li>
          ))}
        </ol>
      </PageContainer>

      {/* Quote form */}
      <section id="devis" className="scroll-mt-20 bg-sand-200/50">
        <PageContainer>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div>
              <SectionTitle
                eyebrow="Devis pose"
                title="Demandez votre devis de pose"
                description="Décrivez votre projet : nous revenons vers vous rapidement pour organiser une visite ou établir un devis sur mesure."
              />
              <div className="mt-6 space-y-3 text-sm text-bark-muted">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-forest" aria-hidden="true" />
                  {site.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-forest" aria-hidden="true" />
                  {site.serviceArea}
                </p>
              </div>
            </div>
            <div className="rounded-card border border-sand-300 bg-white p-5 shadow-card sm:p-6">
              <InstallationQuoteForm />
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}

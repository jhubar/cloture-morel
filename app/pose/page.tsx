import type { Metadata } from "next";
import {
  Phone,
  ClipboardList,
  FileText,
  Hammer,
  Trees,
  ShieldCheck,
  MapPin,
  Handshake,
  Fence,
  Zap,
  Shovel,
  Wrench,
  Truck,
  Scissors,
  TreePine,
  Home,
  Wind,
} from "lucide-react";
import { PageContainer } from "@/components/ui/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { InstallationQuoteForm } from "@/components/forms/InstallationQuoteForm";
import { ProjectGallery } from "@/components/pose/ProjectGallery";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pose de clôtures",
  description:
    "Clôtures Morel pose vos clôtures agricoles, équestres, anti-gibier, portails et aménagements extérieurs dans toute la Belgique et les pays limitrophes. Devis personnalisé.",
};

const projectTypes = [
  {
    icon: Trees,
    title: "Grillage agricole & forestier",
    text: "Clôtures pour bovins, ovins, caprins, équidés, prairies, pistes avicoles. Grillage à mailles progressives ou identiques.",
  },
  {
    icon: ShieldCheck,
    title: "Anti-gibier sauvage",
    text: "Clôtures contre sangliers, cervidés, castors, blaireaux, loups. Parcs animaliers et animaux atypiques.",
  },
  {
    icon: Fence,
    title: "Clôture équestre en bois",
    text: "Post and rail en robinier, Nobifix ou bois exotique. Toutes configurations de mortaises et lisses.",
  },
  {
    icon: Zap,
    title: "Clôture électrique",
    text: "Installation de clôtures électriques adaptées à vos animaux et à votre terrain.",
  },
  {
    icon: TreePine,
    title: "Fils barbelés & ganivelles",
    text: "Pose de fils barbelés et de clôtures en ganivelles ou échalas pour délimiter vos parcelles.",
  },
  {
    icon: Home,
    title: "Barrières & portails",
    text: "Barrières anglaises, galvanisées, acier métallisé/poudré, portillons en ganivelles, passages canadiens.",
  },
  {
    icon: Shovel,
    title: "Enfoncement de pieux",
    text: "Enfoncement hydraulique pour vignobles, vergers. Création de terrasses et pontons.",
  },
  {
    icon: Trees,
    title: "Abris de prairies",
    text: "Construction d'abris ouverts pour chevaux et bétail, adaptés à vos parcelles.",
  },
];

const otherActivities = [
  { icon: Wrench, title: "Ferronnerie & soudure", text: "Atelier de ferronnerie, conception sur mesure et réparations." },
  { icon: Scissors, title: "Broyage & élagage", text: "Broyeur à branches, gyrobroyeur, broyeur forestier sur pelle, abattage et élagage." },
  { icon: Shovel, title: "Terrassement", text: "Terrassement, déneigement et nettoyage/préparation de chantiers." },
  { icon: Truck, title: "Transport & livraison", text: "Transport et livraison de matériaux et d'équipements sur vos chantiers." },
  { icon: Wind, title: "Flexibles hydrauliques", text: "Fabrication et remplacement de flexibles hydrauliques pour engins de chantier." },
];

const reasons = [
  {
    icon: Handshake,
    title: "Un interlocuteur unique",
    text: "De la fourniture des matériaux à la pose, vous traitez avec une seule équipe expérimentée.",
  },
  {
    icon: MapPin,
    title: "Zone d'intervention étendue",
    text: `Nous intervenons dans ${site.serviceArea}.`,
  },
  {
    icon: ShieldCheck,
    title: "Travail soigné",
    text: "Des matériaux de qualité et une pose réalisée dans les règles de l'art, quelle que soit la configuration du terrain.",
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
    text: "Nous réalisons l'installation dans les délais convenus.",
  },
];

export default function PosePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-sand-300 bg-terracotta/5">
        <PageContainer>
          <SectionTitle
            as="h1"
            eyebrow="Pose de clôtures"
            title="Pose professionnelle de clôtures et aménagements extérieurs"
            description="Clôtures Morel intervient sur tous types de projets : clôtures agricoles, équestres, anti-gibier, portails, terrasses et bien plus — en Belgique et dans les pays limitrophes."
          />
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href={`tel:${site.phoneTel}`}
              className="inline-flex min-h-11 items-center gap-2 text-sm text-bark-muted hover:text-terracotta"
            >
              <Phone className="h-4 w-4 text-terracotta" aria-hidden="true" />
              {site.phone}
            </a>
            <span className="text-sand-300" aria-hidden="true">|</span>
            <span className="inline-flex items-center gap-2 text-sm text-bark-muted">
              <MapPin className="h-4 w-4 text-terracotta" aria-hidden="true" />
              {site.serviceArea}
            </span>
          </div>
        </PageContainer>
      </section>

      {/* Quote form — en 2e position pour conversion immédiate */}
      <section id="devis" className="scroll-mt-20 bg-sand-200/50">
        <PageContainer>
          <div className="mb-8">
            <SectionTitle
              eyebrow="Devis pose"
              title="Demandez votre devis de pose"
              description="Décrivez votre projet : nous revenons vers vous rapidement pour organiser une visite ou établir un devis sur mesure."
            />
            <div className="mt-4 flex flex-wrap gap-5 text-sm text-bark-muted">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-terracotta" aria-hidden="true" />
                <a
                  href={`tel:${site.phoneTel}`}
                  className="inline-flex min-h-11 items-center hover:text-terracotta"
                >
                  {site.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-terracotta" aria-hidden="true" />
                {site.serviceArea}
              </p>
            </div>
          </div>
          <div className="rounded-card border border-sand-300 bg-white p-5 shadow-card sm:p-8">
            <InstallationQuoteForm />
          </div>
        </PageContainer>
      </section>

      {/* Project types */}
      <PageContainer>
        <SectionTitle
          eyebrow="Nos domaines d'intervention"
          title="Quel type de projet ?"
          description="Nous intervenons sur une large variété de projets extérieurs, des clôtures agricoles aux aménagements spécialisés."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {projectTypes.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-card border border-sand-300 bg-white p-5 shadow-card"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-forest-dark">
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-bark-muted">{text}</p>
            </div>
          ))}
        </div>
      </PageContainer>

      {/* Gallery */}
      <section className="bg-sand-200/50">
        <PageContainer>
          <SectionTitle
            eyebrow="Galerie"
            title="Quelques réalisations"
            description="Aperçu de nos chantiers — clôtures agricoles, équestres, anti-gibier et aménagements extérieurs."
          />
          <ProjectGallery />
        </PageContainer>
      </section>

      {/* Other activities */}
      <PageContainer>
        <SectionTitle
          eyebrow="Autres activités"
          title="Des services complémentaires"
          description="En plus de la pose de clôtures, nos équipes proposent un ensemble de services pour vos chantiers et aménagements extérieurs."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {otherActivities.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-card border border-sand-300 bg-white p-5 shadow-card"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-3 font-semibold text-forest-dark text-sm">{title}</h3>
              <p className="mt-1 text-xs text-bark-muted">{text}</p>
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
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta text-white">
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
    </>
  );
}

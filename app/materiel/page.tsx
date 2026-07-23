import type { Metadata } from "next";
import {
  Wrench,
  Truck,
  Hammer,
  Scissors,
  Settings,
  Snowflake,
  KeyRound,
  Factory,
  Construction,
} from "lucide-react";
import { MachineGallery } from "@/components/materiel/MachineGallery";
import type { LightboxImage } from "@/components/ui/Lightbox";
import {
  materielEnfonceusesImages,
  materielAutoporteurImages,
  materielStockadeImages,
  materielDerouleuseImages,
  materielPelleForesterieImages,
  materielEnfoncePieuxHydrauliqueImages,
  materielTransportImages,
  materielPreparationChantierImages,
  materielDeneigementImages,
  materielAtelierImages,
} from "@/lib/assets";

export const metadata: Metadata = {
  title: "Notre matériel",
  description:
    "Parc machines professionnel de Clôtures Morel : autoporteur, pelle forestière, enfonce-pieux hydraulique, dérouleuses, agrafeuse Stockade, transport, préparation de chantier, déneigement, location et atelier de soudure.",
};

const MAT = "/images/site/photos-materiaux";

function slot(src: string, alt: string): LightboxImage {
  return { src, alt };
}

function toGallery(slots: { src: string | null; alt: string }[]): LightboxImage[] {
  return slots.filter((s) => s.src !== null).map((s) => ({ src: s.src!, alt: s.alt }));
}

const stockadeImages: LightboxImage[] = [
  ...toGallery(materielStockadeImages),
  slot(`${MAT}/outils-et-accessoires/stockade/consommables/1.webp`, "Consommables Stockade — vue 1"),
  slot(`${MAT}/outils-et-accessoires/stockade/consommables/2.webp`, "Consommables Stockade — vue 2"),
];

const categories: {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  items: { name: string; detail: string }[];
  images: LightboxImage[];
}[] = [
  {
    id: "autoporteur",
    icon: Settings,
    title: "Autoporteur Protech Evo",
    description:
      "Notre autoporteur hydraulique est la machine phare pour l'enfoncement de pieux en terrain difficile. Puissant, précis et autonome, il intervient sur les grands chantiers agricoles et forestiers là où les machines classiques peinent à accéder.",
    items: [
      { name: "Autoporteur Protech Evo", detail: "Enfoncement hydraulique, tous terrains" },
      { name: "Grands chantiers", detail: "Idéal pour les longues lignes de clôture" },
    ],
    images: toGallery(materielAutoporteurImages),
  },
  {
    id: "pelle-foresterie",
    icon: Construction,
    title: "Pelle forestière",
    description:
      "Pelle mécanique professionnelle équipée pour les travaux forestiers et la préparation de chantier. Blindée et protégée pour intervenir en milieu exigeant, y compris sur terrains sensibles.",
    items: [
      { name: "Blindage de patin anti-déchaînement", detail: "Protection renforcée des chenilles" },
      { name: "Patins en caoutchouc", detail: "Préservation des sols et des revêtements" },
      { name: "Accessoires forestiers", detail: "Sillage, broyage, abattage et élagage" },
    ],
    images: toGallery(materielPelleForesterieImages),
  },
  {
    id: "enfonce-pieux-hydraulique",
    icon: Hammer,
    title: "Enfonce-pieux hydraulique",
    description:
      "Enfonce les piquets en vibrant dans le sol — une technologie qui permet d'enfoncer les pieux dans tout type de sol, y compris les terrains compacts, rocheux ou humides, là où une enfonceuse classique ne suffit pas.",
    items: [
      { name: "Enfoncement par vibration", detail: "Efficace sur sols variés et difficiles" },
      { name: "Pieux ronds, carrés et cornières", detail: "Adapté à tous types de clôtures" },
    ],
    images: toGallery(materielEnfoncePieuxHydrauliqueImages),
  },
  {
    id: "derouleuses",
    icon: Settings,
    title: "Dérouleuses de grillage",
    description:
      "Dérouleuses professionnelles pour tendre et dérouler le grillage sans effort ni pli. Grande tension, longueur de grillage de 50 à 500 mètres, hauteur de 0 à 3 m — adaptées aux chantiers de toutes envergures.",
    items: [
      { name: "Grande tension", detail: "Pose nette et durable du grillage" },
      { name: "Longueur 50 à 500 m", detail: "Pour les petites clôtures comme les grandes lignes" },
      { name: "Hauteur 0 à 3 m", detail: "Compatible avec tous les modèles de grillage" },
    ],
    images: toGallery(materielDerouleuseImages),
  },
  {
    id: "stockade",
    icon: Wrench,
    title: "Agrafeuse Stockade ST 215I",
    description:
      "Machine à agrafer le grillage Stockade ST 215I — agrafage professionnel et rapide pour grillage à mailles progressives ou identiques. Un outil indispensable pour une pose de qualité en série.",
    items: [
      { name: "Stockade ST 215I", detail: "Agrafage automatique du grillage" },
      { name: "Consommables Stockade", detail: "Agrafes et pièces de rechange disponibles" },
    ],
    images: stockadeImages,
  },
  {
    id: "transport",
    icon: Truck,
    title: "Transport & logistique",
    description:
      "Flotte de véhicules et engins de manutention pour le transport de matériaux et de machines sur vos chantiers — en Belgique et pays limitrophes.",
    items: [
      { name: "Manitou Clark", detail: "Manutention et levage sur chantier" },
      { name: "Fasttrack tracteur-camion", detail: "Transport lourd et livraison de matériaux" },
    ],
    images: toGallery(materielTransportImages),
  },
  {
    id: "preparation-chantier",
    icon: Scissors,
    title: "Travaux préparatoires de chantier",
    description:
      "Avant la pose de clôture, nous préparons votre terrain : dégagement, nivellement et création du couloir nécessaire à l'installation (5 à 6 m de largeur).",
    items: [
      { name: "Abattage & élagage", detail: "Dégagement mécanique de la végétation" },
      { name: "Sillage sur pelle", detail: "Jusqu'à 30 cm de diamètre" },
      { name: "Broyage & élagage", detail: "Nettoyage et broyage des branches et souches" },
      { name: "Terrassement", detail: "Petits terrassements, nivellement, mare d'eau" },
    ],
    images: toGallery(materielPreparationChantierImages),
  },
  {
    id: "deneigement",
    icon: Snowflake,
    title: "Déneigement & salage",
    description:
      "Service de déneigement et de salage pour entreprises, communes et particuliers. Intervention rapide pour sécuriser vos accès en période hivernale.",
    items: [
      { name: "Déneigement mécanique", detail: "Parkings, voies d'accès et cours" },
      { name: "Salage", detail: "Traitement préventif et curatif des surfaces" },
    ],
    images: toGallery(materielDeneigementImages),
  },
  {
    id: "location",
    icon: KeyRound,
    title: "Location de machines & matériel",
    description:
      "Mise à disposition de matériel professionnel avec ou sans opérateur. Idéal pour vos chantiers ponctuels ou vos projets en autonomie.",
    items: [
      { name: "Pelle avec opérateur", detail: "Location avec conducteur qualifié" },
      { name: "Pelle avec tous les accessoires", detail: "Équipement complet pour votre chantier" },
      { name: "Agrafeuse Stockade", detail: "Location à la journée ou à la semaine" },
      { name: "Enfonce-pieux thermique", detail: "Enfonceuse 50 CC, légère et maniable" },
      { name: "Tracteur avec opérateur", detail: "Tracteur équipé, prêt à l'emploi" },
    ],
    images: toGallery(materielEnfonceusesImages),
  },
  {
    id: "atelier",
    icon: Factory,
    title: "Atelier de soudure, réparation & ferronnerie",
    description:
      "Atelier équipé pour la fabrication sur mesure, la réparation d'engins et la conception en ferronnerie. Intervention en atelier ou sur place selon vos besoins.",
    items: [
      { name: "Flexibles hydrauliques", detail: "Fabrication sur mesure et remplacement rapide" },
      { name: "Plieuse industrielle", detail: "Formage de tôles et pièces métalliques" },
      { name: "Table de soudure", detail: "Soudure MIG/MAG et assemblages sur mesure" },
      { name: "Conception ferronnerie", detail: "Portails, grilles, garde-corps et ouvrages métalliques" },
    ],
    images: toGallery(materielAtelierImages),
  },
];

export default function MaterielPage() {
  return (
    <>
      <div className="border-b border-sand-300 bg-terracotta/5">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">
            Notre matériel
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            Un parc machines professionnel à votre disposition
          </h1>
          <p className="mt-3 max-w-2xl text-bark-muted">
            Clôtures Morel met à disposition un équipement lourd et spécialisé pour vos
            chantiers de clôtures et travaux extérieurs — autoporteurs, pelles forestières,
            enfonce-pieux, dérouleuses, transport, préparation de terrain, déneigement et
            atelier de soudure. Machines disponibles en location avec ou sans opérateur.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {categories.map(({ id, icon: Icon, title, description, items, images }, index) => (
            <section key={id} aria-labelledby={`materiel-${id}`}>
              <div className="grid items-center gap-8 lg:grid-cols-2">
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h2
                      id={`materiel-${id}`}
                      className="font-display text-xl font-semibold text-forest-dark"
                    >
                      {title}
                    </h2>
                  </div>
                  <p className="mt-4 text-bark-muted">{description}</p>
                  <ul className="mt-4 space-y-2">
                    {items.map(({ name, detail }) => (
                      <li key={name} className="flex items-start gap-2 text-sm">
                        <span
                          className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta"
                          aria-hidden="true"
                        />
                        <span>
                          <span className="font-medium text-forest-dark">{name}</span>
                          {detail && <span className="text-bark-muted"> — {detail}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  {images.length > 0 ? (
                    <MachineGallery
                      images={images}
                      className="aspect-[4/3] w-full rounded-card border border-sand-300 shadow-card"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] w-full items-center justify-center rounded-card border border-dashed border-sand-300 bg-sand-200/40 text-sm text-bark-muted">
                      Photos à venir
                    </div>
                  )}
                </div>
              </div>
              {index < categories.length - 1 && (
                <hr className="mt-16 border-sand-200" />
              )}
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-card border border-terracotta/20 bg-terracotta/5 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">
            Vous avez un projet ?
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-forest-dark">
            Notre matériel professionnel est à votre service
          </h2>
          <p className="mt-3 max-w-2xl text-bark-muted">
            Pose de clôture, préparation de terrain, location de machines avec opérateur
            ou dépannage en atelier — contactez-nous pour discuter de votre projet.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/pose#devis"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-terracotta px-6 text-sm font-semibold text-white transition-colors hover:bg-terracotta-dark"
            >
              Demander un devis pose
            </a>
            <a
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-sand-300 bg-white px-6 text-sm font-semibold text-forest-dark transition-colors hover:bg-sand-200"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

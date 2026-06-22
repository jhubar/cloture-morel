import type { Metadata } from "next";
import {
  Wrench,
  Zap,
  Truck,
  Hammer,
  Scissors,
  Shovel,
  Settings,
  Wind,
} from "lucide-react";
import { MachineGallery } from "@/components/materiel/MachineGallery";
import type { LightboxImage } from "@/components/ui/Lightbox";
import {
  materielEnfonceusesImages,
  materielAutoporteurImages,
  materielStockadeImages,
  materielDerouleuseImages,
} from "@/lib/assets";

export const metadata: Metadata = {
  title: "Notre matériel",
  description:
    "Découvrez le matériel professionnel de Clôtures Morel : enfonceuses à pieux, autoporteurs, machines de broyage, tracteurs et outillage spécialisé pour la pose de clôtures.",
};

const MAT = "/images/site/photos-materiaux";

function slot(src: string, alt: string): LightboxImage {
  return { src, alt };
}

// Converts our ImageSlot arrays (which have guaranteed src after optimization)
// to plain LightboxImage arrays.
function toGallery(slots: { src: string | null; alt: string }[]): LightboxImage[] {
  return slots.filter((s) => s.src !== null).map((s) => ({ src: s.src!, alt: s.alt }));
}

const grippleImages: LightboxImage[] = [
  slot(`${MAT}/outils-et-accessoires/gripple/gripple-t-clip-1/1.webp`, "Gripple T-clip — vue 1"),
  slot(`${MAT}/outils-et-accessoires/gripple/gripple-t-clip-1/2.webp`, "Gripple T-clip — vue 2"),
  slot(`${MAT}/outils-et-accessoires/gripple/gripple-t-clip-1/3.webp`, "Gripple T-clip — vue 3"),
  slot(`${MAT}/outils-et-accessoires/gripple/gripple-plus-medium/1.webp`, "Gripple Plus Medium — vue 1"),
  slot(`${MAT}/outils-et-accessoires/gripple/gripple-plus-medium/2.webp`, "Gripple Plus Medium — vue 2"),
  slot(`${MAT}/outils-et-accessoires/gripple/barbed/1.webp`, "Gripple Barbed — vue 1"),
  slot(`${MAT}/outils-et-accessoires/gripple/barbed/2.webp`, "Gripple Barbed — vue 2"),
  slot(`${MAT}/outils-et-accessoires/gripple/pince-de-tension/1.webp`, "Pince de tension Gripple"),
  slot(`${MAT}/outils-et-accessoires/gripple/pince-de-tension/2.webp`, "Pince de tension Gripple — vue 2"),
];

const terrassementImages: LightboxImage[] = [
  slot(`${MAT}/outils-et-accessoires/cloche-pour-brise-roche/1.webp`, "Cloche pour brise-roche — vue 1"),
  slot(`${MAT}/outils-et-accessoires/cloche-pour-brise-roche/2.webp`, "Cloche pour brise-roche — vue 2"),
];

const enfonceusesAdaptateur: LightboxImage[] = [
  ...toGallery(materielEnfonceusesImages),
  slot(`${MAT}/outils-et-accessoires/enfonce-pieux-thermique/adaptateur-cornieres/1.webp`, "Adaptateur cornières"),
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
    id: "enfonceuses",
    icon: Hammer,
    title: "Enfoncement de pieux",
    description:
      "Nous disposons d'enfonceuses thermiques et hydrauliques adaptées à tous types de pieux : ronds, carrés, cornières. Adaptateur cornières disponible pour les clôtures en grillage.",
    items: [
      { name: "Enfonce-pieux thermique 50 CC", detail: "Léger et maniable pour terrains dégagés" },
      { name: "Adaptateur cornières", detail: "Pour piquets et cornières métalliques" },
    ],
    images: enfonceusesAdaptateur,
  },
  {
    id: "autoporteur",
    icon: Settings,
    title: "Autoporteur Protech Evo",
    description:
      "Machine autoporteuse hydraulique pour l'enfoncement de pieux en terrain difficile. Puissance et précision pour les grands chantiers agricoles et forestiers.",
    items: [
      { name: "Autoporteur Protech Evo", detail: "Hydraulique, tous terrains" },
    ],
    images: toGallery(materielAutoporteurImages),
  },
  {
    id: "stockade",
    icon: Wrench,
    title: "Stockade ST 315I",
    description:
      "Machine à agrafer le grillage Stockade ST 315I — agrafage professionnel et rapide pour grillage à mailles progressives ou identiques. Consommables disponibles.",
    items: [
      { name: "Stockade ST 315I", detail: "Agrafage automatique du grillage" },
      { name: "Consommables Stockade", detail: "Agrafes et pièces de rechange" },
    ],
    images: [
      ...toGallery(materielStockadeImages),
      slot(`${MAT}/outils-et-accessoires/stockade/consommables/1.webp`, "Consommables Stockade — vue 1"),
      slot(`${MAT}/outils-et-accessoires/stockade/consommables/2.webp`, "Consommables Stockade — vue 2"),
    ],
  },
  {
    id: "derouleurs",
    icon: Settings,
    title: "Dérouleuses de grillage",
    description:
      "Dérouleuses professionnelles pour dérouler les bobines de grillage sans effort ni pli, même sur terrain accidenté.",
    items: [
      { name: "Dérouleuses de grillage", detail: "Plusieurs modèles selon la hauteur de grillage" },
    ],
    images: toGallery(materielDerouleuseImages),
  },
  {
    id: "broyage",
    icon: Scissors,
    title: "Broyage & débroussaillage",
    description:
      "Matériel de broyage pour la préparation et le nettoyage de chantiers. Idéal pour créer le couloir dégagé nécessaire à la pose de clôtures (5-6 m de largeur).",
    items: [
      { name: "Broyeur à branches sur tracteur", detail: "Pour branches jusqu'à Ø 15 cm" },
      { name: "Gyrobroyeur sur tracteur", detail: "Débroussaillage grande surface" },
      { name: "Broyeur forestier sur pelle", detail: "Pour végétation dense et souches" },
      { name: "Gyrobroyeur sur pelle", detail: "Pour zones à accès restreint" },
    ],
    images: [],
  },
  {
    id: "terrassement",
    icon: Shovel,
    title: "Terrassement & élagage",
    description:
      "Pelles et équipements de terrassement pour la préparation de terrain, l'abattage, l'élagage et la création de terrasses ou de pontons.",
    items: [
      { name: "Cisaille sur pelle", detail: "Abattage et élagage mécanique" },
      { name: "Cloche pour brise-roche", detail: "Travaux en terrain rocheux" },
    ],
    images: terrassementImages,
  },
  {
    id: "transport",
    icon: Truck,
    title: "Transport & livraison",
    description:
      "Flotte de véhicules pour le transport et la livraison de matériaux sur vos chantiers — camion complet ou petite quantité.",
    items: [
      { name: "Livraison camion complet", detail: "Tarifs dégressifs" },
      { name: "Transport de matériaux", detail: "Belgique et pays limitrophes" },
    ],
    images: [slot(`${MAT}/barrieres-galvanisees/camion-complet.webp`, "Livraison camion complet")],
  },
  {
    id: "accessoires",
    icon: Zap,
    title: "Outillage & accessoires",
    description:
      "Gripples, pinces de tension, quincaillerie spécialisée et consommables pour la pose de clôtures — disponibles à la vente.",
    items: [
      { name: "Gripple T-clip & Plus Medium", detail: "Connexion et tension de fils" },
      { name: "Pince de tension Gripple", detail: "Pour fils lisses et barbelés" },
      { name: "Gripple Barbed", detail: "Pour fils barbelés" },
    ],
    images: grippleImages,
  },
  {
    id: "hydraulique",
    icon: Wind,
    title: "Flexibles hydrauliques",
    description:
      "Fabrication et remplacement de flexibles hydrauliques pour engins de chantier, tracteurs et machines agricoles — en atelier ou sur place.",
    items: [
      { name: "Fabrication sur mesure", detail: "Toutes longueurs et pressions" },
      { name: "Intervention rapide", detail: "Dépannage sur chantier possible" },
    ],
    images: [],
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
            Un parc machines complet pour vos chantiers
          </h1>
          <p className="mt-3 max-w-2xl text-bark-muted">
            Clôtures Morel dispose d'un équipement professionnel varié pour intervenir
            sur tous types de terrains et de clôtures — de l'enfoncement de pieux à la
            préparation de chantier, en passant par le transport et la livraison.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {categories.map(({ id, icon: Icon, title, description, items, images }, index) => (
            <section key={id} aria-labelledby={`materiel-${id}`}>
              <div className={`grid items-center gap-8 lg:grid-cols-2`}>
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
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" aria-hidden="true" />
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
            Notre matériel est à votre service
          </h2>
          <p className="mt-3 max-w-2xl text-bark-muted">
            Que ce soit pour la pose d'une clôture, la préparation d'un terrain ou la
            location d'équipement, contactez-nous pour discuter de votre projet.
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

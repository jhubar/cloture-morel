/**
 * Image slots — paths stay null until Nicolas provides photos.
 * Drop files under public/images/ using the suggested filenames, then set src.
 *
 * Checklist for Nicolas:
 * - hero.jpg          → accueil (vue chantier / réalisation)
 * - pose-gallery/     → 4 à 8 photos de chantiers terminés
 * - families/         → une photo par famille catalogue (voir productFamilyImages)
 */

export type ImageSlot = {
  /** Public URL path, e.g. "/images/hero.jpg". Null = placeholder shown. */
  src: string | null;
  alt: string;
  /** Filename or folder hint for the client. */
  hint: string;
};

/** Homepage hero (right column). */
export const heroImage: ImageSlot = {
  src: null,
  alt: "Réalisation de clôture par Clôtures Morel",
  hint: "public/images/hero.jpg — paysage 4:3, chantier ou clôture posée",
};

/** Pose page — gallery of completed projects. */
export const poseGalleryImages: ImageSlot[] = [
  {
    src: null,
    alt: "Clôture résidentielle posée par Clôtures Morel",
    hint: "public/images/pose-gallery/01-residentiel.jpg",
  },
  {
    src: null,
    alt: "Clôture bois naturelle",
    hint: "public/images/pose-gallery/02-bois.jpg",
  },
  {
    src: null,
    alt: "Panneaux rigides et portail",
    hint: "public/images/pose-gallery/03-rigide-portail.jpg",
  },
  {
    src: null,
    alt: "Grand périmètre clôturé",
    hint: "public/images/pose-gallery/04-grand-perimetre.jpg",
  },
];

/**
 * Per-family images on the catalogue family grid and product cards (key = family id).
 * Drop JPEGs in public/images/families/ then set src.
 */
export const productFamilyImages: Record<string, ImageSlot> = {
  "piquets-en-robiniers-faux-acacia-ronds": {
    src: null,
    alt: "Piquets bois en acacia",
    hint: "public/images/families/piquets.jpg",
  },
  "morel-wire-grillages-barbeles-et-fils-galvanises": {
    src: null,
    alt: "Grillages, barbelés et fils galvanisés",
    hint: "public/images/families/grillages.jpg",
  },
  "barrieres-galvanisees": {
    src: null,
    alt: "Barrières métal galvanisées",
    hint: "public/images/families/barrieres-metal.jpg",
  },
  "barrieres-anglaises": {
    src: null,
    alt: "Barrières bois anglaises",
    hint: "public/images/families/barrieres-bois.jpg",
  },
  "brandes-de-bruyere": {
    src: null,
    alt: "Brandes de bruyère",
    hint: "public/images/families/brandes.jpg",
  },
  "outillage-et-accessoires-clotures": {
    src: null,
    alt: "Outillage et accessoires clôtures",
    hint: "public/images/families/outillage.jpg",
  },
  "ganivelles-en-robiniers-faux-acacia": {
    src: null,
    alt: "Ganivelles en acacia",
    hint: "public/images/families/ganivelles.jpg",
  },
  "cloture-equestre": {
    src: null,
    alt: "Clôture équestre post & rail",
    hint: "public/images/families/equestre.jpg",
  },
};

/** Image slot for a catalogue family (fallback placeholder if id missing). */
export function getFamilyImage(familyId: string, label: string): ImageSlot {
  return (
    productFamilyImages[familyId] ?? {
      src: null,
      alt: label,
      hint: `public/images/families/${familyId}.jpg`,
    }
  );
}

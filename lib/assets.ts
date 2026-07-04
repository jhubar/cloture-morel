/**
 * Image slots — chemins vers les photos optimisées dans public/images/site/
 * Toutes les images ont été converties en WebP via doc/scripts/optimize_images.py
 */

export type ImageSlot = {
  /** Public URL path, e.g. "/images/site/...webp". Null = placeholder shown. */
  src: string | null;
  alt: string;
  /** Filename or folder hint for the client. */
  hint: string;
};

const REAL = "/images/site/realisations-de-clotures-par-clotures-et-travaux-morel-photos-a-fournir";
const MAT  = "/images/site/photos-materiaux";

// ── Helpers internes ──────────────────────────────────────────────────────────

function slots(paths: [string, string][]): ImageSlot[] {
  return paths.map(([src, alt]) => ({ src, alt, hint: src }));
}

function seq(base: string, alt: string, ns: number[]): ImageSlot[] {
  return ns.map((n) => ({ src: `${base}/${n}.webp`, alt: `${alt} — vue ${n}`, hint: `${base}/${n}.webp` }));
}

// ── Hero & réalisations ───────────────────────────────────────────────────────

/** Homepage hero (right column) — première réalisation. */
export const heroImage: ImageSlot = {
  src: `${REAL}/1.webp`,
  alt: "Réalisation de clôture par Clôtures Morel",
  hint: `${REAL}/1.webp`,
};

/** Pose page — galerie des 42 réalisations numérotées par le client. */
export const poseGalleryImages: ImageSlot[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
].map((n) => ({
  src: `${REAL}/${n}.webp`,
  alt: `Réalisation de clôture Clôtures Morel — chantier ${n}`,
  hint: `${REAL}/${n}.webp`,
}));

// ── Galeries par catégorie du catalogue ───────────────────────────────────────
//
// Chaque clé correspond exactement à l'id de catégorie retourné par getCategoryTree().
// Toutes les photos du sous-dossier correspondant sont listées.

export const categoryImages: Record<string, ImageSlot[]> = {

  // Piquets en robinier faux acacia (9 photos, fichier 6 absent)
  "piquets-en-robiniers-faux-acacia-ronds": seq(
    `${MAT}/piquets-en-robiniers-faux-acacia`,
    "Piquet en robinier faux acacia",
    [1, 2, 3, 4, 5, 7, 8, 9],
  ),

  // Grillage à mailles progressives
  "grillage-a-mailles-progressives": seq(
    `${MAT}/grillage-et-barbele/grillage-a-mailles-progressives`,
    "Grillage à mailles progressives",
    [1, 2, 3, 4, 5],
  ),

  // Grillage à mailles identiques
  "grillage-a-mailles-identiques": seq(
    `${MAT}/grillage-et-barbele/grillage-a-mailles-identiques`,
    "Grillage à mailles identiques",
    [1, 2, 3, 4, 5, 6],
  ),

  // Barbelés Morel Barbed
  "barbeles-morel-barbed": seq(
    `${MAT}/grillage-et-barbele/barbeles`,
    "Barbelés Morel Barbed",
    [1, 2, 3, 4, 5],
  ),

  // Fil galvanisé Morel Wire (high-tensile + low-tensile)
  "fil-galvanise-morel-wire": slots([
    [`${MAT}/grillage-et-barbele/fil-lisses/high-tensile/1.webp`, "Fil galvanisé high-tensile"],
    [`${MAT}/grillage-et-barbele/fil-lisses/low-tensile/1.webp`,  "Fil galvanisé low-tensile"],
  ]),

  // Barrières galvanisées — 7 tubes fixes
  "barrieres-fixes-en-7-tubes-h-120-cm": seq(
    `${MAT}/barrieres-galvanisees/7-tubes-fixes`,
    "Barrière galvanisée 7 tubes fixe",
    [1, 2, 3, 4],
  ),

  // Barrières galvanisées — extensibles 5 tubes
  "barrieres-extensibles-en-5-tubes-h-120-cm": seq(
    `${MAT}/barrieres-galvanisees/extensibles-5-tubes`,
    "Barrière galvanisée extensible 5 tubes",
    [1, 2, 3, 4],
  ),

  // Barrières demi-grillagées
  "barrieres-demi-grillagees-h-120-cm": seq(
    `${MAT}/barrieres-galvanisees/demi-grillagees`,
    "Barrière demi-grillagée",
    [1, 2, 3, 4, 5, 6],
  ),

  // Barrières entièrement grillagées
  "barrieres-entierement-grillagees-h-150-cm-et-h-180-cm": seq(
    `${MAT}/barrieres-galvanisees/entierement-grillagees`,
    "Barrière entièrement grillagée",
    [1, 2, 3, 4, 5, 6],
  ),

  // Poteaux galvanisés (récepteurs + supports)
  "poteaux-galvanises-pour-barrieres": [
    ...seq(`${MAT}/barrieres-galvanisees/poteaux-galvanises/recepteurs`, "Poteau galvanisé récepteur", [1, 2, 3]),
    ...seq(`${MAT}/barrieres-galvanisees/poteaux-galvanises/supports`,   "Poteau galvanisé support",   [1, 2, 3]),
  ],

  // Quincailleries barrières galvanisées (toutes pièces)
  "quincailleries-pour-barrieres-galvanisees": [
    ...seq(`${MAT}/barrieres-galvanisees/quincailleries/paire-de-gonds`,      "Paire de gonds",           [1, 2]),
    ...seq(`${MAT}/barrieres-galvanisees/quincailleries/oeillet-de-fermeture`, "Œillet de fermeture",     [1, 2]),
    ...seq(`${MAT}/barrieres-galvanisees/quincailleries/levier-de-fermeture`,  "Levier de fermeture",     [1, 2]),
    ...seq(`${MAT}/barrieres-galvanisees/quincailleries/baionettes`,           "Baïonnette",               [1, 2, 3]),
  ],

  // Passage canadien
  "passage-canadien": seq(
    `${MAT}/barrieres-galvanisees/passages-canadiens`,
    "Passage canadien (cattle grid)",
    [1, 2],
  ),

  // Barrières anglaises en bois exotique + portillons ganivelles (bois)
  "barrieres-anglaises-en-bois-exotique-h-120-cm": [
    ...seq(`${MAT}/barrieres-en-bois/barrieres-anglaises`,              "Barrière anglaise en bois exotique", [1, 2, 3, 4, 5, 6, 7, 8]),
    ...seq(`${MAT}/barrieres-en-bois/portillons-en-ganivelles`,         "Portillon en ganivelles",            [1, 2, 3, 4]),
  ],

  // Poteaux en bois exotique pour barrières anglaises
  "poteaux-en-bois-exotique-pour-barrieres-anglaises": seq(
    `${MAT}/barrieres-en-bois/poteaux-en-bois-exotique-pour-barrieres-anglaises`,
    "Poteau en bois exotique pour barrière anglaise",
    [1, 2, 3],
  ),

  // Quincailleries barrières anglaises (toutes pièces)
  "quincailleries-pour-barrieres-anglaises": [
    ...seq(`${MAT}/barrieres-en-bois/quincailleries-pour-barrieres-anglaises/kit-charnieres-reglables`, "Kit charnières réglables",  [1, 2]),
    ...seq(`${MAT}/barrieres-en-bois/quincailleries-pour-barrieres-anglaises/fermeture-oscillante`,     "Fermeture oscillante",       [1, 2, 3, 4]),
    ...seq(`${MAT}/barrieres-en-bois/quincailleries-pour-barrieres-anglaises/fermeture-a-ressort`,      "Fermeture à ressort",        [1, 2]),
    ...seq(`${MAT}/barrieres-en-bois/quincailleries-pour-barrieres-anglaises/levier-de-fermeture`,      "Levier de fermeture bois",   [1, 2]),
    ...seq(`${MAT}/barrieres-en-bois/quincailleries-pour-barrieres-anglaises/verrou-lourd`,              "Verrou lourd",               [1, 2]),
    ...seq(`${MAT}/barrieres-en-bois/quincailleries-pour-barrieres-anglaises/baionettes`,               "Baïonnette",                 [1, 2]),
  ],

  // Brande de bruyère
  "brande-de-bruyere-epaisse-100-opaque": seq(
    `${MAT}/brise-vue-naturels/brandes-de-bruyeres`,
    "Brande de bruyère épaisse 100 % opaque",
    [1, 2, 3],
  ),

  // Outillage & accessoires clôtures (toutes sous-catégories)
  "outillage-et-accessoires-clotures": [
    ...seq(`${MAT}/outils-et-accessoires/stockade/st-315i`,                      "Stockade ST 315I",                      [1, 2]),
    ...seq(`${MAT}/outils-et-accessoires/stockade/consommables`,                  "Consommable Stockade",                  [1, 2]),
    ...seq(`${MAT}/outils-et-accessoires/gripple/gripple-plus-medium`,            "Gripple Plus Medium",                   [1, 2, 4, 5, 6]),
    ...seq(`${MAT}/outils-et-accessoires/gripple/gripple-t-clip-1`,               "Gripple T-Clip",                        [1, 2, 3, 4]),
    ...seq(`${MAT}/outils-et-accessoires/gripple/barbed`,                         "Gripple Barbed",                        [1, 2, 3, 4]),
    ...seq(`${MAT}/outils-et-accessoires/gripple/pince-de-tension`,               "Pince de tension Gripple",              [1, 2]),
    ...seq(`${MAT}/outils-et-accessoires/enfonce-pieux-thermique/50-cc`,          "Enfonce-pieux thermique 50 CC",         [1, 2, 3, 4]),
    slots([[`${MAT}/outils-et-accessoires/enfonce-pieux-thermique/adaptateur-cornieres/1.webp`, "Adaptateur cornières"]]),
    ...seq(`${MAT}/outils-et-accessoires/derouleuses-de-grillage`,                "Dérouleuse de grillage",                [1, 2, 3, 4, 5]),
    ...seq(`${MAT}/outils-et-accessoires/autoporteur-protech-evo`,                "Autoporteur Protech Evo",               [1, 2, 3, 4, 5, 6]),
    slots([[`${MAT}/outils-et-accessoires/cloche-pour-brise-roche/1.webp`, "Cloche pour brise-roche"]]),
    slots([[`${MAT}/outils-et-accessoires/cloche-pour-brise-roche/2.webp`, "Cloche pour brise-roche — vue 2"]]),
  ].flat(),

  // Ganivelles en robinier faux acacia + portillons ganivelles
  "ganivelles-en-robiniers-faux-acacia": [
    ...seq(`${MAT}/ganivelles/ganivelles`,             "Ganivelle en robinier faux acacia", [1, 2, 3, 4, 5, 6]),
    ...seq(`${MAT}/ganivelles/portillons-en-ganivelles`, "Portillon en ganivelles",         [1, 2, 3, 4]),
  ],

  // ── Clôture équestre — clés alignées sur les catégories feuilles ────────────
  // Chaque clé = id de catégorie feuille (cf. split dans excel_to_md.py).

  // Post & rail en robinier faux acacia
  "post-and-rail-poteaux": seq(
    `${MAT}/cloture-equestre-en-bois/post-and-rail-en-robiniers-faux-acacia/poteaux`,
    "Poteau rectangulaire acacia",
    [1, 2, 3, 4, 5],
  ),
  "post-and-rail-poteaux-ronds": seq(
    `${MAT}/cloture-equestre-en-bois/post-and-rail-en-robiniers-faux-acacia/poteaux`,
    "Poteau rond acacia",
    [1, 2, 3, 4, 5],
  ),
  "post-and-rail-lisses-fendues": seq(
    `${MAT}/cloture-equestre-en-bois/post-and-rail-en-robiniers-faux-acacia/lisses-fendues`,
    "Lisse fendue acacia",
    [1, 2, 3],
  ),

  // Pin traité Nobifix
  "nobifix-poteaux-carres": seq(
    `${MAT}/cloture-equestre-en-bois/pin-traite-nobifix/poteaux-carres/poteaux-carres-tete-diamant-avec-mortaises`,
    "Poteau carré Nobifix tête diamant avec mortaises",
    [1, 2, 3, 4, 6],
  ),
  "nobifix-lisses": seq(
    `${MAT}/cloture-equestre-en-bois/pin-traite-nobifix/poteaux-carres/lisses`,
    "Lisse rectangulaire Nobifix",
    [1, 2, 3, 4, 5],
  ),
  "nobifix-poteaux-ronds": seq(
    `${MAT}/cloture-equestre-en-bois/pin-traite-nobifix/poteaux-ronds/poteaux`,
    "Poteau rond fraisé Nobifix",
    [1, 2, 3, 4],
  ),
  "nobifix-demi-rondins": seq(
    `${MAT}/cloture-equestre-en-bois/pin-traite-nobifix/poteaux-ronds/demi-rondins`,
    "Demi-rondin Nobifix",
    [1, 2, 3, 4, 5],
  ),

  // Bois exotique (références à venir — galeries déjà disponibles)
  "bois-exotique-poteaux": seq(
    `${MAT}/cloture-equestre-en-bois/bois-exotique/poteaux`,
    "Poteau bois exotique équestre",
    [1, 2, 3, 4],
  ),
  "bois-exotique-lisses-en-bois-exotique": seq(
    `${MAT}/cloture-equestre-en-bois/bois-exotique/lisses-en-bois-exotique`,
    "Lisse en bois exotique",
    [1, 2, 3],
  ),
  "bois-exotique-lisses-en-bois-autoclavees-classe-4": seq(
    `${MAT}/cloture-equestre-en-bois/bois-exotique/lisses-en-bois-autoclavees-classe-4`,
    "Lisse autoclavée classe IV",
    [1, 2, 3],
  ),
};

/** Retourne la galerie d'images d'une catégorie (tableau vide si inconnue). */
export function getCategoryImages(categoryId: string): ImageSlot[] {
  return categoryImages[categoryId] ?? [];
}

// ── Images représentatives par famille (FamilyGrid) ───────────────────────────
//
// Une seule image soigneusement choisie par famille pour la vignette du catalogue.

export const productFamilyImages: Record<string, ImageSlot> = {
  "piquets-en-robiniers-faux-acacia-ronds": {
    src: `${MAT}/piquets-en-robiniers-faux-acacia/1.webp`,
    alt: "Piquets en robinier faux acacia",
    hint: `${MAT}/piquets-en-robiniers-faux-acacia/1.webp`,
  },
  "morel-wire-grillages-barbeles-et-fils-galvanises": {
    src: `${MAT}/grillage-et-barbele/grillage-a-mailles-progressives/1.webp`,
    alt: "Grillages & fils galvanisés Morel Wire",
    hint: `${MAT}/grillage-et-barbele/grillage-a-mailles-progressives/1.webp`,
  },
  "barrieres-galvanisees": {
    src: `${MAT}/barrieres-galvanisees/7-tubes-fixes/1.webp`,
    alt: "Barrières galvanisées 7 tubes",
    hint: `${MAT}/barrieres-galvanisees/7-tubes-fixes/1.webp`,
  },
  "barrieres-anglaises": {
    src: `${MAT}/barrieres-en-bois/barrieres-anglaises/1.webp`,
    alt: "Barrières anglaises en bois exotique",
    hint: `${MAT}/barrieres-en-bois/barrieres-anglaises/1.webp`,
  },
  "brandes-de-bruyere": {
    src: `${MAT}/brise-vue-naturels/brandes-de-bruyeres/1.webp`,
    alt: "Brandes de bruyère — brise-vue naturel",
    hint: `${MAT}/brise-vue-naturels/brandes-de-bruyeres/1.webp`,
  },
  "outillage-et-accessoires-clotures": {
    src: `${MAT}/outils-et-accessoires/autoporteur-protech-evo/1.webp`,
    alt: "Outillage & accessoires clôtures",
    hint: `${MAT}/outils-et-accessoires/autoporteur-protech-evo/1.webp`,
  },
  "ganivelles-en-robiniers-faux-acacia": {
    src: `${MAT}/ganivelles/ganivelles/1.webp`,
    alt: "Ganivelles en robinier faux acacia",
    hint: `${MAT}/ganivelles/ganivelles/1.webp`,
  },
  "cloture-equestre": {
    src: `${MAT}/cloture-equestre-en-bois/post-and-rail-en-robiniers-faux-acacia/poteaux/1.webp`,
    alt: "Clôture équestre en bois",
    hint: `${MAT}/cloture-equestre-en-bois/post-and-rail-en-robiniers-faux-acacia/poteaux/1.webp`,
  },
};

/** Image slot pour une famille du catalogue (fallback placeholder si id inconnu). */
export function getFamilyImage(familyId: string, label: string): ImageSlot {
  return (
    productFamilyImages[familyId] ?? {
      src: null,
      alt: label,
      hint: `public/images/families/${familyId}.jpg`,
    }
  );
}

// ── Helpers pour la page Notre matériel ──────────────────────────────────────

/** Galerie autoporteur Protech Evo (6 photos). */
export const materielAutoporteurImages: ImageSlot[] = seq(
  `${MAT}/outils-et-accessoires/autoporteur-protech-evo`,
  "Autoporteur Protech Evo",
  [1, 2, 3, 4, 5, 6],
);

/** Enfonceuse thermique 50 CC (4 photos). */
export const materielEnfonceusesImages: ImageSlot[] = seq(
  `${MAT}/outils-et-accessoires/enfonce-pieux-thermique/50-cc`,
  "Enfonce-pieux thermique 50 CC",
  [1, 2, 3, 4],
);

/** Stockade ST 315I (2 photos). */
export const materielStockadeImages: ImageSlot[] = seq(
  `${MAT}/outils-et-accessoires/stockade/st-315i`,
  "Stockade ST 315I",
  [1, 2],
);

/** Dérouleuses de grillage (5 photos). */
export const materielDerouleuseImages: ImageSlot[] = seq(
  `${MAT}/outils-et-accessoires/derouleuses-de-grillage`,
  "Dérouleuse de grillage",
  [1, 2, 3, 4, 5],
);

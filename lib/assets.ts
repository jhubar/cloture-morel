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

function img(src: string, alt: string): ImageSlot {
  return { src, alt, hint: src };
}

/** Galerie par modèle : photo produit, récap, dessin technique. */
function modelGallery(produit: string, recap: string, dessin: string, label: string): ImageSlot[] {
  return [
    img(produit, `${label} — photo produit`),
    img(recap, `${label} — récapitulatif`),
    img(dessin, `${label} — dessin technique`),
  ];
}

function modelGalleryRecap(produit: string, recap: string, label: string): ImageSlot[] {
  return [
    img(produit, `${label} — photo produit`),
    img(recap, `${label} — récapitulatif`),
  ];
}

const GI = `${MAT}/grillage-et-barbele/grillage-a-mailles-identiques`;
const GI_P = `${GI}/produit`;
const GP = `${MAT}/grillage-et-barbele/grillage-a-mailles-progressives`;
const GP_P = `${GP}/produit`;
const GV_P = `${MAT}/ganivelles/ganivelles/produit`;
const GV_RECAP = `${MAT}/ganivelles/ganivelles/recap.webp`;
const PG = `${MAT}/ganivelles/portillons-en-ganivelles`;
const BR = `${MAT}/brise-vue-naturels/brandes-de-bruyeres`;
const BR_RECAP = `${BR}/recap.webp`;
const BG_7T = `${MAT}/barrieres-galvanisees/7-tubes-fixes`;
const BG_EXT = `${MAT}/barrieres-galvanisees/extensibles-5-tubes`;
const BG_DEMI = `${MAT}/barrieres-galvanisees/demi-grillagees`;
const BG_ENT = `${MAT}/barrieres-galvanisees/entierement-grillagees`;
const BG_TUBES_RECAP = `${MAT}/barrieres-galvanisees/recap-tubes-demi-extensibles.webp`;
const BG_DEMI_RECAP = `${BG_DEMI}/recap.webp`;
const BG_ENT_RECAP = `${BG_ENT}/recap.webp`;

// ── Hero & réalisations ───────────────────────────────────────────────────────

/** Homepage hero (right column) — première réalisation. */
export const heroImage: ImageSlot = {
  src: `${REAL}/1.webp`,
  alt: "Réalisation de clôture par Clôtures Morel",
  hint: `${REAL}/1.webp`,
};

/** Homepage hero carousel — sélection de réalisations variées qui défilent. */
export const heroCarouselImages: ImageSlot[] = (
  [
    [1, "Clôture posée par Clôtures Morel en région liégeoise"],
    [5, "Grillage et piquets sur terrain agricole"],
    [12, "Barrière et clôture en bois exotique"],
    [18, "Clôture de grande longueur en pleine campagne"],
    [23, "Chantier de pose de clôture professionnelle"],
    [30, "Ganivelles et clôture décorative en robinier"],
    [36, "Clôture équestre et pâturage clôturé"],
    [41, "Réalisation de clôture soignée par Clôtures Morel"],
  ] as [number, string][]
).map(([n, alt]) => ({
  src: `${REAL}/${n}.webp`,
  alt,
  hint: `${REAL}/${n}.webp`,
}));

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

  // Grillage à mailles progressives — galerie par modèle via categoryImagesBySelectionKey
  "grillage-a-mailles-progressives": seq(
    `${GP_P}`,
    "Grillage à mailles progressives",
    [1, 2, 3, 4, 5],
  ),

  // Grillage à mailles identiques — galerie par modèle via categoryImagesBySelectionKey
  "grillage-a-mailles-identiques": seq(
    `${GI_P}`,
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

  // Barrières galvanisées — galerie par dimension via categoryImagesBySelectionKey
  "barrieres-fixes-en-7-tubes-h-120-cm": seq(
    BG_7T,
    "Barrière galvanisée 7 tubes fixe",
    [1, 2, 3, 4],
  ),

  // Barrières galvanisées — extensibles 5 tubes
  "barrieres-extensibles-en-5-tubes-h-120-cm": seq(
    BG_EXT,
    "Barrière galvanisée extensible 5 tubes",
    [1, 2, 3, 4],
  ),

  // Barrières demi-grillagées — photos produit (#2–6), récap séparé
  "barrieres-demi-grillagees-h-120-cm": seq(
    BG_DEMI,
    "Barrière demi-grillagée",
    [2, 3, 4, 5, 6],
  ),

  // Barrières entièrement grillagées — photos produit (#2–6), récap séparé
  "barrieres-entierement-grillagees-h-150-cm-et-h-180-cm": seq(
    BG_ENT,
    "Barrière entièrement grillagée",
    [2, 3, 4, 5, 6],
  ),

  // Poteaux galvanisés — galerie par modèle (récepteur / support), voir categoryImagesBySelectionKey
  "poteaux-galvanises-pour-barrieres": [],

  // Quincailleries barrières galvanisées — galerie par article, voir categoryImagesBySelectionKey
  "quincailleries-pour-barrieres-galvanisees": [],

  // Passage canadien
  "passage-canadien": seq(
    `${MAT}/barrieres-galvanisees/passages-canadiens`,
    "Passage canadien (cattle grid)",
    [1, 2],
  ),

  // Fabrication sur mesure — photos à fournir
  "fabrication-sur-mesure-barrieres-galvanisees": [
    {
      src: null,
      alt: "Fabrication sur mesure — barrières galvanisées",
      hint: `${MAT}/barrieres-galvanisees/fabrication-sur-mesure/`,
    },
  ],

  // Barrières anglaises en bois exotique (sans portillons ganivelles)
  "barrieres-anglaises-en-bois-exotique-h-120-cm": seq(
    `${MAT}/barrieres-en-bois/barrieres-anglaises`,
    "Barrière anglaise en bois exotique",
    [1, 2, 3, 4, 5, 6, 7, 8],
  ),

  // Poteaux en bois exotique pour barrières anglaises
  "poteaux-en-bois-exotique-pour-barrieres-anglaises": seq(
    `${MAT}/barrieres-en-bois/poteaux-en-bois-exotique-pour-barrieres-anglaises`,
    "Poteau en bois exotique pour barrière anglaise",
    [1, 2, 3],
  ),

  // Quincailleries barrières anglaises — galerie par article, voir categoryImagesBySelectionKey
  "quincailleries-pour-barrieres-anglaises": [],

  // Brande de bruyère — galerie par hauteur via categoryImagesBySelectionKey
  "brande-de-bruyere-epaisse-100-opaque": seq(
    BR,
    "Brande de bruyère épaisse 100 % opaque",
    [1, 2, 3],
  ),

  // Outillage & accessoires — galerie par référence, voir categoryImagesBySelectionKey
  "outillage-et-accessoires-clotures": [],

  // Ganivelles — galerie par modèle via categoryImagesBySelectionKey
  "ganivelles-en-robiniers-faux-acacia": [
    ...seq(`${GV_P}`, "Ganivelle en robinier faux acacia", [1, 2, 3, 4, 5, 6]),
    ...seq(`${PG}`, "Portillon en ganivelles", [1, 2, 3, 4, 5, 6, 7, 8]),
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

/** Galeries photo liées à une option de configuration (ex. modèle récepteur / support). */
const categoryImagesBySelectionKey: Record<
  string,
  {
    axisKey: string;
    lookupKeys?: string[];
    galleries: Record<string, ImageSlot[]>;
  }
> = {
  "grillage-a-mailles-identiques": {
    axisKey: "reference",
    galleries: {
      "13/122/7,5": modelGallery(`${GI_P}/1.webp`, `${GI}/2.webp`, `${GI}/7.webp`, "Grillage 13/122/7,5"),
      "13/122/5": modelGallery(`${GI_P}/2.webp`, `${GI}/1.webp`, `${GI}/6.webp`, "Grillage 13/122/5"),
      "15/140/7,5": modelGallery(`${GI_P}/3.webp`, `${GI}/3.webp`, `${GI}/8.webp`, "Grillage 15/140/7,5"),
      "16/150/5": modelGallery(`${GI_P}/4.webp`, `${GI}/4.webp`, `${GI}/9.webp`, "Grillage 16/150/5"),
      "19/180/5": modelGallery(`${GI_P}/5.webp`, `${GI}/5.webp`, `${GI}/10.webp`, "Grillage 19/180/5"),
    },
  },
  "grillage-a-mailles-progressives": {
    axisKey: "reference",
    galleries: {
      "8/80/15": modelGallery(`${GP_P}/1.webp`, `${GP}/5.webp`, `${GP}/10.webp`, "Grillage 8/80/15"),
      "10/100/15": modelGallery(`${GP_P}/2.webp`, `${GP}/1.webp`, `${GP}/6.webp`, "Grillage 10/100/15"),
      "11/122/15": modelGallery(`${GP_P}/3.webp`, `${GP}/2.webp`, `${GP}/7.webp`, "Grillage 11/122/15"),
      "13/150/15": modelGallery(`${GP_P}/4.webp`, `${GP}/3.webp`, `${GP}/8.webp`, "Grillage 13/150/15"),
      "17/200/15": modelGallery(`${GP_P}/5.webp`, `${GP}/4.webp`, `${GP}/9.webp`, "Grillage 17/200/15"),
      "20/244/15": [img(`${GP_P}/5.webp`, "Grillage 20/244/15 — photo produit")],
    },
  },
  "brande-de-bruyere-epaisse-100-opaque": {
    axisKey: "reference",
    galleries: {
      "150 cm": modelGalleryRecap(`${BR}/1.webp`, BR_RECAP, "Brande de bruyère 150 cm"),
      "180 cm": modelGalleryRecap(`${BR}/2.webp`, BR_RECAP, "Brande de bruyère 180 cm"),
      "200 cm": modelGalleryRecap(`${BR}/3.webp`, BR_RECAP, "Brande de bruyère 200 cm"),
    },
  },
  "barrieres-fixes-en-7-tubes-h-120-cm": {
    axisKey: "reference",
    galleries: {
      "365 cm": modelGalleryRecap(`${BG_7T}/1.webp`, BG_TUBES_RECAP, "7 tubes fixes 365 cm"),
      "460 cm": modelGalleryRecap(`${BG_7T}/2.webp`, BG_TUBES_RECAP, "7 tubes fixes 460 cm"),
      "600 cm": modelGalleryRecap(`${BG_7T}/3.webp`, BG_TUBES_RECAP, "7 tubes fixes 600 cm"),
    },
  },
  "barrieres-extensibles-en-5-tubes-h-120-cm": {
    axisKey: "reference",
    galleries: {
      "4 => 5 mètres": modelGalleryRecap(`${BG_EXT}/1.webp`, BG_TUBES_RECAP, "Extensible 4 => 5 m"),
      "5 => 6 mètres": modelGalleryRecap(`${BG_EXT}/2.webp`, BG_TUBES_RECAP, "Extensible 5 => 6 m"),
    },
  },
  "barrieres-demi-grillagees-h-120-cm": {
    axisKey: "reference",
    galleries: {
      "120 cm": modelGalleryRecap(`${BG_DEMI}/2.webp`, BG_DEMI_RECAP, "Demi-grillagée 120 cm"),
      "300 cm": modelGalleryRecap(`${BG_DEMI}/3.webp`, BG_DEMI_RECAP, "Demi-grillagée 300 cm"),
      "365 cm": modelGalleryRecap(`${BG_DEMI}/4.webp`, BG_DEMI_RECAP, "Demi-grillagée 365 cm"),
      "460 cm": modelGalleryRecap(`${BG_DEMI}/5.webp`, BG_DEMI_RECAP, "Demi-grillagée 460 cm"),
    },
  },
  "barrieres-entierement-grillagees-h-150-cm-et-h-180-cm": {
    axisKey: "reference",
    galleries: {
      "H.150 x 120 cm": modelGalleryRecap(`${BG_ENT}/2.webp`, BG_ENT_RECAP, "Entièrement grillagée H.150 x 120 cm"),
      "H.150 x 365 cm": modelGalleryRecap(`${BG_ENT}/3.webp`, BG_ENT_RECAP, "Entièrement grillagée H.150 x 365 cm"),
      "H.150 x 460 cm": modelGalleryRecap(`${BG_ENT}/4.webp`, BG_ENT_RECAP, "Entièrement grillagée H.150 x 460 cm"),
      "H.180 x 120 cm": modelGalleryRecap(`${BG_ENT}/5.webp`, BG_ENT_RECAP, "Entièrement grillagée H.180 x 120 cm"),
      "H.180 x 365 cm": modelGalleryRecap(`${BG_ENT}/6.webp`, BG_ENT_RECAP, "Entièrement grillagée H.180 x 365 cm"),
      "H.180 x 460 cm": modelGalleryRecap(`${BG_ENT}/4.webp`, BG_ENT_RECAP, "Entièrement grillagée H.180 x 460 cm"),
    },
  },
  "ganivelles-en-robiniers-faux-acacia": {
    axisKey: "reference",
    lookupKeys: ["taille_rouleau", "reference"],
    galleries: {
      "H.50 cm": modelGalleryRecap(`${GV_P}/1.webp`, GV_RECAP, "Ganivelle H.50 cm"),
      "H.100 cm": modelGalleryRecap(`${GV_P}/2.webp`, GV_RECAP, "Ganivelle H.100 cm"),
      "H.120 cm": modelGalleryRecap(`${GV_P}/3.webp`, GV_RECAP, "Ganivelle H.120 cm"),
      "H.150 cm": modelGalleryRecap(`${GV_P}/4.webp`, GV_RECAP, "Ganivelle H.150 cm"),
      "H.175 cm": modelGalleryRecap(`${GV_P}/5.webp`, GV_RECAP, "Ganivelle H.175 cm"),
      "H.120 cm x 100 cm": modelGalleryRecap(`${PG}/1.webp`, GV_RECAP, "Portillon H.120 x 100 cm"),
      "H.120 cm x 200 cm": modelGalleryRecap(`${PG}/3.webp`, GV_RECAP, "Portillon H.120 x 200 cm"),
    },
  },
  "poteaux-galvanises-pour-barrieres": {
    axisKey: "modele",
    galleries: {
      Récepteur: seq(
        `${MAT}/barrieres-galvanisees/poteaux-galvanises/recepteurs`,
        "Poteau galvanisé récepteur",
        [1, 2, 3],
      ),
      Support: seq(
        `${MAT}/barrieres-galvanisees/poteaux-galvanises/supports`,
        "Poteau galvanisé support",
        [1, 2, 3],
      ),
    },
  },
  "quincailleries-pour-barrieres-galvanisees": {
    axisKey: "reference",
    galleries: {
      "Paire de gonds": seq(
        `${MAT}/barrieres-galvanisees/quincailleries/paire-de-gonds`,
        "Paire de gonds",
        [1, 2],
      ),
      "Œillets fermeture": seq(
        `${MAT}/barrieres-galvanisees/quincailleries/oeillet-de-fermeture`,
        "Œillet de fermeture",
        [1, 2],
      ),
      "Levier de fermeture": seq(
        `${MAT}/barrieres-galvanisees/quincailleries/levier-de-fermeture`,
        "Levier de fermeture",
        [1, 2],
      ),
      Baionettes: seq(
        `${MAT}/barrieres-galvanisees/quincailleries/baionettes`,
        "Baïonnette",
        [1, 2, 3],
      ),
    },
  },
  "quincailleries-pour-barrieres-anglaises": {
    axisKey: "reference",
    galleries: {
      "Kit charnières réglables": seq(
        `${MAT}/barrieres-en-bois/quincailleries-pour-barrieres-anglaises/kit-charnieres-reglables`,
        "Kit charnières réglables",
        [1, 2],
      ),
      "Fermeture oscillante": seq(
        `${MAT}/barrieres-en-bois/quincailleries-pour-barrieres-anglaises/fermeture-oscillante`,
        "Fermeture oscillante",
        [1, 2, 3, 4],
      ),
      Baionnette: seq(
        `${MAT}/barrieres-en-bois/quincailleries-pour-barrieres-anglaises/baionettes`,
        "Baïonnette",
        [1, 2],
      ),
      "Serrure à ressort": seq(
        `${MAT}/barrieres-en-bois/quincailleries-pour-barrieres-anglaises/fermeture-a-ressort`,
        "Fermeture à ressort",
        [1, 2],
      ),
      "Verrou lourd": seq(
        `${MAT}/barrieres-en-bois/quincailleries-pour-barrieres-anglaises/verrou-lourd`,
        "Verrou lourd",
        [1, 2],
      ),
      "Levier de fermeture": seq(
        `${MAT}/barrieres-en-bois/quincailleries-pour-barrieres-anglaises/levier-de-fermeture`,
        "Levier de fermeture",
        [1, 2],
      ),
    },
  },
  "outillage-et-accessoires-clotures": {
    axisKey: "reference",
    galleries: {
      "Stockade ST315I": seq(
        `${MAT}/outils-et-accessoires/stockade/st-315i`,
        "Stockade ST 315I",
        [1, 2],
      ),
      "Consommable ST 315I": seq(
        `${MAT}/outils-et-accessoires/stockade/consommables`,
        "Consommable Stockade",
        [1, 2],
      ),
      "Easy Petrol Post Driver 50 CC": seq(
        `${MAT}/outils-et-accessoires/enfonce-pieux-thermique/50-cc`,
        "Enfonce-pieux thermique 50 CC",
        [1, 2, 3, 4, 5],
      ),
      "Adaptateur pour cornières métalliques": slots([
        [
          `${MAT}/outils-et-accessoires/enfonce-pieux-thermique/adaptateur-cornieres/1.webp`,
          "Adaptateur cornières",
        ],
      ]),
      "Pour mini pelles et autres": seq(
        `${MAT}/outils-et-accessoires/derouleuses-de-grillage`,
        "Dérouleuse de grillage",
        [1, 2, 3, 4, 5, 6, 7, 8],
      ),
      "Cloche de battage pour brise roche": seq(
        `${MAT}/outils-et-accessoires/cloche-pour-brise-roche`,
        "Cloche pour brise-roche",
        [1, 2],
      ),
      "Protech Evo": seq(
        `${MAT}/outils-et-accessoires/autoporteur-protech-evo`,
        "Autoporteur Protech Evo",
        [1, 2, 3, 4, 5, 6, 7, 8],
      ),
      "Gripple plus médium": seq(
        `${MAT}/outils-et-accessoires/gripple/gripple-plus-medium`,
        "Gripple Plus Medium",
        [1, 2, 4, 5, 6],
      ),
      "Gripple T-clip 1": seq(
        `${MAT}/outils-et-accessoires/gripple/gripple-t-clip-1`,
        "Gripple T-Clip",
        [1, 2, 3, 4],
      ),
      "Gripple Barbed": seq(
        `${MAT}/outils-et-accessoires/gripple/barbed`,
        "Gripple Barbed",
        [1, 2, 3, 4],
      ),
      "Pince de tension métallique": seq(
        `${MAT}/outils-et-accessoires/gripple/pince-de-tension`,
        "Pince de tension Gripple",
        [1, 2],
      ),
    },
  },
};

/** object-contain pour les photos produit petites (évite le flou au sur-étirement). */
const categoryGalleryFit: Record<string, "cover" | "contain"> = {
  "quincailleries-pour-barrieres-galvanisees": "contain",
  "quincailleries-pour-barrieres-anglaises": "contain",
};

/** Règles de vignette galerie par catégorie (index 0-based). */
const categoryGalleryPreview: Record<
  string,
  {
    /** Vignette pour la sélection par défaut (ex. demi-grillagées). */
    defaultIndex?: number;
    /** Vignette pour une référence / dimension précise. */
    byReference?: Record<string, number>;
  }
> = {};

/** Exclut récapitulatifs et dessins techniques des galeries « famille / catégorie ». */
function isCatalogRecapOrTechnicalImage(src: string | null): boolean {
  if (!src) return false;
  if (src.endsWith("/recap.webp")) return true;
  if (src.includes("/recap-tubes-demi-extensibles.webp")) return true;
  if (src.includes("/grillage-a-mailles-identiques/") && !src.includes("/produit/")) {
    return true;
  }
  if (
    src.includes("/grillage-a-mailles-progressives/") &&
    !src.includes("/produit/") &&
    !src.includes("/barbeles/") &&
    !src.includes("/fil-lisses/")
  ) {
    return true;
  }
  return false;
}

/** Retourne la galerie d'images d'une catégorie (produit uniquement, sans récap). */
export function getCategoryImages(categoryId: string): ImageSlot[] {
  return (categoryImages[categoryId] ?? []).filter(
    (slot) => !isCatalogRecapOrTechnicalImage(slot.src),
  );
}

/**
 * Galerie filtrée selon la configuration choisie (ex. récepteur vs support).
 * Retombe sur getCategoryImages si la catégorie n'a pas de sous-galeries.
 */
export function getCategoryImagesForSelection(
  categoryId: string,
  selection: Record<string, string>,
): ImageSlot[] {
  const config = categoryImagesBySelectionKey[categoryId];
  if (!config) return getCategoryImages(categoryId);

  const keysToTry = config.lookupKeys ?? [config.axisKey];
  for (const key of keysToTry) {
    const value = selection[key]?.trim();
    if (value && config.galleries[value]) return config.galleries[value];
  }

  const axisValue = selection[config.axisKey]?.trim();
  if (axisValue && config.galleries[axisValue]) return config.galleries[axisValue];

  const fallback = Object.values(config.galleries)[0];
  return fallback ?? [];
}

/** Mode d'affichage de la vignette galerie (cover par défaut). */
export function getCategoryGalleryFit(categoryId: string): "cover" | "contain" {
  return categoryGalleryFit[categoryId] ?? "cover";
}

/**
 * Index de la photo affichée en vignette.
 * Certaines catégories utilisent une autre photo que la 1re pour une dimension donnée ;
 * les autres options conservent la photo 1.
 */
export function getCategoryGalleryPreviewIndex(
  categoryId: string,
  selection: Record<string, string>,
  defaultSelection: Record<string, string>,
): number {
  const images = getCategoryImagesForSelection(categoryId, selection);
  const clamp = (index: number) =>
    images.length > 0 ? Math.min(index, images.length - 1) : 0;

  const config = categoryGalleryPreview[categoryId];

  if (config) {
    const reference = selection.reference?.trim();
    if (reference && config.byReference?.[reference] !== undefined) {
      return clamp(config.byReference[reference]);
    }

    const isDefaultSelection = Object.keys(defaultSelection).every(
      (key) => selection[key] === defaultSelection[key],
    );
    if (isDefaultSelection && config.defaultIndex !== undefined) {
      return clamp(config.defaultIndex);
    }
  }

  // Quincailleries : vignette = photo HD (2e), lightbox = toutes les photos
  if (categoryGalleryFit[categoryId] === "contain" && images.length > 1) {
    return clamp(1);
  }

  return 0;
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
    src: `${GP_P}/1.webp`,
    alt: "Grillages & fils galvanisés Morel Wire",
    hint: `${GP_P}/1.webp`,
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
    src: `${BR}/1.webp`,
    alt: "Brandes de bruyère — brise-vue naturel",
    hint: `${BR}/1.webp`,
  },
  "outillage-et-accessoires-clotures": {
    src: `${MAT}/outils-et-accessoires/autoporteur-protech-evo/1.webp`,
    alt: "Outillage & accessoires clôtures",
    hint: `${MAT}/outils-et-accessoires/autoporteur-protech-evo/1.webp`,
  },
  "ganivelles-en-robiniers-faux-acacia": {
    src: `${GV_P}/1.webp`,
    alt: "Ganivelles en robinier faux acacia",
    hint: `${GV_P}/1.webp`,
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

const OUTILS = `${MAT}/outils-et-accessoires`;

/** Galerie autoporteur Protech Evo. */
export const materielAutoporteurImages: ImageSlot[] = seq(
  `${OUTILS}/autoporteur-protech-evo`,
  "Autoporteur Protech Evo",
  [1, 2, 3, 4, 5, 6, 7, 8],
);

/** Pelle forestière et accessoires. */
export const materielPelleForesterieImages: ImageSlot[] = seq(
  `${OUTILS}/pelle-foresterie`,
  "Pelle forestière",
  [1, 2, 3, 4, 5, 6],
);

/** Enfonce-pieux hydraulique. */
export const materielEnfoncePieuxHydrauliqueImages: ImageSlot[] = seq(
  `${OUTILS}/enfonce-pieux-hydraulique`,
  "Enfonce-pieux hydraulique",
  [1, 2, 3],
);

/** Enfonceuse thermique 50 CC. */
export const materielEnfonceusesImages: ImageSlot[] = seq(
  `${OUTILS}/enfonce-pieux-thermique/50-cc`,
  "Enfonce-pieux thermique 50 CC",
  [1, 2, 3, 4, 5],
);

/** Stockade ST 315I. */
export const materielStockadeImages: ImageSlot[] = seq(
  `${OUTILS}/stockade/st-315i`,
  "Stockade ST 315I",
  [1, 2],
);

/** Dérouleuses de grillage. */
export const materielDerouleuseImages: ImageSlot[] = seq(
  `${OUTILS}/derouleuses-de-grillage`,
  "Dérouleuse de grillage",
  [1, 2, 3, 4, 5, 6, 7, 8],
);

/** Transport & logistique (Manitou, camions). */
export const materielTransportImages: ImageSlot[] = seq(
  `${OUTILS}/transport-logistique`,
  "Transport et logistique",
  [1, 2, 3, 4, 5, 6, 7, 8],
);

/** Travaux préparatoires de chantier. */
export const materielPreparationChantierImages: ImageSlot[] = seq(
  `${OUTILS}/preparation-chantier`,
  "Préparation de chantier",
  [1, 2, 3, 4, 5, 6, 7, 8],
);

/** Déneigement & salage. */
export const materielDeneigementImages: ImageSlot[] = seq(
  `${OUTILS}/deneigement`,
  "Déneigement",
  [1, 2, 3],
);

/** Atelier soudure & ferronnerie. */
export const materielAtelierImages: ImageSlot[] = seq(
  `${OUTILS}/atelier-soudure`,
  "Atelier de soudure",
  [1, 2, 3, 4, 5, 6, 7, 8],
);

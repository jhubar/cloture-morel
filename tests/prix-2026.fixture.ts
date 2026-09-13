/**
 * Tarifs 2026 (PDF Nicolas) — source unique côté code.
 *
 * Reprend exactement les montants de doc/prix-2026.md. Les tests
 * (tests/prix-2026.test.ts) vérifient que data/catalog.json est aligné dessus.
 * Tous les prix sont HTVA (EUR).
 */

const PIQUET_PREFIX = "piquets-en-robiniers-faux-acacia-ronds-";

export interface PiquetTarif {
  id: string;
  hauteur: number;
  diametre: string;
  /** Prix par pièce (stocké dans prixUnitaireHTVA). */
  prixPiece: number;
  nombreParPalette: number;
  /** Prix palette attendu = prixPiece × nombreParPalette. */
  prixPalette: number;
  /** Prix camion complet par pièce (prixCamionCompletHTVA). */
  prixPieceCamion: number;
}

/** Piquets acacia mis à jour au tarif 2026 (10 dimensions du PDF). */
export const PIQUETS_2026: PiquetTarif[] = [
  { id: `${PIQUET_PREFIX}160-cm-diametre-8-10-cm-0`, hauteur: 160, diametre: "8/10 cm", prixPiece: 5.29, nombreParPalette: 100, prixPalette: 529.0, prixPieceCamion: 4.9 },
  { id: `${PIQUET_PREFIX}160-cm-diametre-10-12-cm-1`, hauteur: 160, diametre: "10/12 cm", prixPiece: 7.9, nombreParPalette: 100, prixPalette: 790.0, prixPieceCamion: 7.32 },
  { id: `${PIQUET_PREFIX}180-cm-diametre-8-10-cm-2`, hauteur: 180, diametre: "8/10 cm", prixPiece: 5.95, nombreParPalette: 100, prixPalette: 595.0, prixPieceCamion: 5.51 },
  { id: `${PIQUET_PREFIX}180-cm-diametre-10-12-cm-3`, hauteur: 180, diametre: "10/12 cm", prixPiece: 8.89, nombreParPalette: 70, prixPalette: 622.3, prixPieceCamion: 8.23 },
  { id: `${PIQUET_PREFIX}200-cm-diametre-8-10-cm-4`, hauteur: 200, diametre: "8/10 cm", prixPiece: 6.61, nombreParPalette: 100, prixPalette: 661.0, prixPieceCamion: 6.12 },
  { id: `${PIQUET_PREFIX}200-cm-diametre-10-12-cm-5`, hauteur: 200, diametre: "10/12 cm", prixPiece: 9.88, nombreParPalette: 70, prixPalette: 691.6, prixPieceCamion: 9.15 },
  { id: `${PIQUET_PREFIX}250-cm-diametre-8-10-cm-6`, hauteur: 250, diametre: "8/10 cm", prixPiece: 8.27, nombreParPalette: 100, prixPalette: 827.0, prixPieceCamion: 7.65 },
  { id: `${PIQUET_PREFIX}250-cm-diametre-10-12-cm-7`, hauteur: 250, diametre: "10/12 cm", prixPiece: 12.35, nombreParPalette: 70, prixPalette: 864.5, prixPieceCamion: 11.43 },
  { id: `${PIQUET_PREFIX}300-cm-diametre-10-12-cm-8`, hauteur: 300, diametre: "10/12 cm", prixPiece: 14.82, nombreParPalette: 70, prixPalette: 1037.4, prixPieceCamion: 13.72 },
  { id: `${PIQUET_PREFIX}350-cm-diametre-10-12-cm-9`, hauteur: 350, diametre: "10/12 cm", prixPiece: 17.29, nombreParPalette: 70, prixPalette: 1210.3, prixPieceCamion: 16.0 },
];

/** Piquets 12/14 cm hors PDF 2026 : prix actuels conservés (question Nicolas). */
export const PIQUETS_HORS_PDF: PiquetTarif[] = [
  { id: `${PIQUET_PREFIX}350-cm-diametre-12-14-cm-10`, hauteur: 350, diametre: "12/14 cm", prixPiece: 26.34, nombreParPalette: 50, prixPalette: 1317.0, prixPieceCamion: 24.39 },
  { id: `${PIQUET_PREFIX}450-cm-diametre-12-14-cm-11`, hauteur: 450, diametre: "12/14 cm", prixPiece: 33.87, nombreParPalette: 50, prixPalette: 1693.5, prixPieceCamion: 31.36 },
];

export interface UnitTarif {
  id: string;
  prix: number;
}

/** Barrières galvanisées Bateman LM + poteaux + quincaillerie (inchangés en 2026). */
export const BATEMAN_2026: UnitTarif[] = [
  // Barrières fixes 7 tubes H.120 cm
  { id: "barrieres-fixes-en-7-tubes-h-120-cm-365-cm-0", prix: 133.53 },
  { id: "barrieres-fixes-en-7-tubes-h-120-cm-460-cm-1", prix: 163.5 },
  { id: "barrieres-fixes-en-7-tubes-h-120-cm-600-cm-2", prix: 220.0 },
  // Barrières extensibles 5 tubes H.120 cm
  { id: "barrieres-extensibles-en-5-tubes-h-120-cm-4-5-metres-0", prix: 265.0 },
  { id: "barrieres-extensibles-en-5-tubes-h-120-cm-5-6-metres-1", prix: 300.0 },
  // Barrières demi grillagées H.120 cm
  { id: "barrieres-demi-grillagees-h-120-cm-120-cm-0", prix: 113.62 },
  { id: "barrieres-demi-grillagees-h-120-cm-300-cm-1", prix: 161.24 },
  { id: "barrieres-demi-grillagees-h-120-cm-365-cm-2", prix: 181.2 },
  { id: "barrieres-demi-grillagees-h-120-cm-460-cm-3", prix: 221.09 },
  // Barrières entièrement grillagées H.150 / H.180 cm
  { id: "barrieres-entierement-grillagees-h-150-cm-et-h-180-cm-h-150-x-120-cm-0", prix: 266.02 },
  { id: "barrieres-entierement-grillagees-h-150-cm-et-h-180-cm-h-150-x-365-cm-1", prix: 453.83 },
  { id: "barrieres-entierement-grillagees-h-150-cm-et-h-180-cm-h-150-x-460-cm-2", prix: 563.8 },
  { id: "barrieres-entierement-grillagees-h-150-cm-et-h-180-cm-h-180-x-120-cm-3", prix: 266.02 },
  { id: "barrieres-entierement-grillagees-h-150-cm-et-h-180-cm-h-180-x-365-cm-4", prix: 453.83 },
  { id: "barrieres-entierement-grillagees-h-150-cm-et-h-180-cm-h-180-x-460-cm-5", prix: 563.8 },
  // Poteaux galvanisés ronds Ø114 mm (Support = suspend, Récepteur = fermeture)
  { id: "poteaux-galvanises-pour-barrieres-barrieres-h120-cm-0", prix: 80.0 },
  { id: "poteaux-galvanises-pour-barrieres-barrieres-h120-cm-1", prix: 64.7 },
  { id: "poteaux-galvanises-pour-barrieres-barrieres-h150-cm-2", prix: 148.38 },
  { id: "poteaux-galvanises-pour-barrieres-barrieres-h150-cm-3", prix: 138.7 },
  { id: "poteaux-galvanises-pour-barrieres-barrieres-h180-cm-4", prix: 148.38 },
  { id: "poteaux-galvanises-pour-barrieres-barrieres-h180-cm-5", prix: 138.7 },
  // Quincaillerie galvanisée
  { id: "quincailleries-pour-barrieres-galvanisees-paire-de-gonds-0", prix: 24.32 },
  { id: "quincailleries-pour-barrieres-galvanisees-illets-fermeture-1", prix: 11.13 },
  { id: "quincailleries-pour-barrieres-galvanisees-levier-de-fermeture-2", prix: 23.84 },
  { id: "quincailleries-pour-barrieres-galvanisees-baionettes-3", prix: 23.0 },
  // Passage canadien
  { id: "passage-canadien-3-65-m-x-2-8-m-0", prix: 2150.0 },
];

const OUTILLAGE_PREFIX = "outillage-et-accessoires-clotures-";

/** Clameuse Stockade ST315I + pack consommables existants (inchangés). */
export const STOCKADE_EXISTANT_2026: UnitTarif[] = [
  { id: `${OUTILLAGE_PREFIX}stockade-st315i-0`, prix: 1090.0 },
  { id: `${OUTILLAGE_PREFIX}consommable-st-315i-1`, prix: 150.0 },
];

export interface NouveauConsommable {
  id: string;
  reference: string;
  prix: number;
}

/** Nouveaux SKU consommables clameuse à ajouter (article "Clameuse"). */
export const STOCKADE_NOUVEAUX_2026: NouveauConsommable[] = [
  { id: `${OUTILLAGE_PREFIX}clames-33-mm-11`, reference: "Clames 33 mm", prix: 147.0 },
  { id: `${OUTILLAGE_PREFIX}clames-40-mm-12`, reference: "Clames 40 mm", prix: 128.0 },
  { id: `${OUTILLAGE_PREFIX}cartouche-de-gaz-13`, reference: "Cartouche de gaz", prix: 12.0 },
  { id: `${OUTILLAGE_PREFIX}carton-cartouches-de-gaz-14`, reference: "Carton de cartouches de gaz", prix: 120.0 },
];

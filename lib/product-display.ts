import type { Product } from "@/lib/types";

/** Human-readable title (prefer catalog label over bare reference code). */
export function getProductDisplayTitle(product: Product): string {
  const label = product.label?.trim();
  const reference = product.reference?.trim();
  if (label) return label;
  if (reference) return reference;
  return product.article?.trim() || "Produit";
}

const DETAIL_LABELS: Record<string, string> = {
  dimension: "Hauteur",
  taille: "Dimensions",
  longueur: "Longueur",
  conditionnement: "Conditionnement",
  nombre_par_palette: "Pièces par palette",
  nombre_par_palette_camion: "Pièces par palette (camion)",
  note_camion: "Dispo camion complet",
  metres_par_rlx: "Longueur du rouleau",
  taille_rlx: "Longueur du rouleau",
  taille_rouleau: "Longueur du rouleau",
  modele: "Modèle",
  section: "Section",
  tete: "Tête",
  mortaises: "Mortaises",
  info: "Info",
};

const DETAIL_ORDER = [
  "section",
  "dimension",
  "taille",
  "metres_par_rlx",
  "taille_rlx",
  "taille_rouleau",
  "nombre_par_palette",
  "nombre_par_palette_camion",
  "note_camion",
  "modele",
  "tete",
  "mortaises",
  "info",
  "longueur",
  "conditionnement",
];

function humanizeDetailKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeDetailValue(key: string, value: string): string {
  if (key === "metres_par_rlx" || key === "taille_rlx") {
    return value.replace(/\s*mètres?/i, " m").trim();
  }
  return value.trim();
}

/**
 * Dans l'Excel Morel, la colonne « Référence » est souvent une dimension
 * (150 cm, 365 cm…) ; d'autres lignes ont un vrai code (8/80/15, Stockade ST315I).
 */
export function isDimensionLike(value: string): boolean {
  const v = value.trim();
  if (/^\d+([,.]\d+)?\s*(cm|m|mm)\b/i.test(v)) return true;
  if (/\d\s*[x×]\s*\d/i.test(v)) return true;
  if (/^H\.\d/i.test(v)) return true;
  if (/\d+\s*cm\s+diamètre/i.test(v)) return true;
  if (/\d+\s*=>\s*\d+/i.test(v)) return true;
  return false;
}

/** Valeur colonne Excel « Référence » (ou section équestre). Vide si pas de référence. */
export function getProductCommercialReference(product: Product): string | null {
  const ref = product.reference?.trim();
  if (ref) return ref;
  const section = product.details?.section?.trim();
  if (section) return section;
  return null;
}

/** Sous-titre : « Réf. » ou « Dimension » selon la nature du champ Excel. */
export function getProductDisplaySubtitle(product: Product): string | null {
  const ref = getProductCommercialReference(product);
  if (!ref) return null;
  const title = getProductDisplayTitle(product);
  if (title.includes(ref)) return null;
  const label = isDimensionLike(ref) ? "Dimension" : "Réf.";
  return `${label} ${ref}`;
}

/** Caractéristiques complémentaires (taille passage canadien, rouleau, palette…). */
export function getProductDetailRows(
  product: Product,
): { label: string; value: string }[] {
  const details = product.details;
  if (!details) return [];

  const title = getProductDisplayTitle(product);
  const commercialRef = getProductCommercialReference(product);

  const rows = Object.entries(details)
    .filter((entry): entry is [string, string] => {
      const value = entry[1];
      return typeof value === "string" && value.trim().length > 0;
    })
    .filter(([key, value]) => {
      const normalized = normalizeDetailValue(key, value);
      if (normalized === commercialRef) return false;
      if (title.includes(normalized)) return false;
      return true;
    })
    .map(([key, value]) => ({
      key,
      label: DETAIL_LABELS[key] ?? humanizeDetailKey(key),
      value: normalizeDetailValue(key, value),
    }));

  const ordered: { label: string; value: string }[] = [];
  const rest = new Map(rows.map((row) => [row.key, row]));

  for (const key of DETAIL_ORDER) {
    const row = rest.get(key);
    if (row) {
      ordered.push({ label: row.label, value: row.value });
      rest.delete(key);
    }
  }

  for (const row of rest.values()) {
    ordered.push({ label: row.label, value: row.value });
  }

  return ordered;
}

import type { Product } from "@/lib/types";

/**
 * Longueur × diamètre valides pour les piquets bois (robiniers faux acacia).
 * Repris tel quel pour les poteaux ronds du configurateur clôture équestre.
 */
export const PIQUET_ROUND_COMBINATIONS: ReadonlyArray<{
  dimension: string;
  section: string;
}> = [
  { dimension: "160 cm", section: "8/10 cm" },
  { dimension: "160 cm", section: "10/12 cm" },
  { dimension: "180 cm", section: "8/10 cm" },
  { dimension: "180 cm", section: "10/12 cm" },
  { dimension: "200 cm", section: "8/10 cm" },
  { dimension: "200 cm", section: "10/12 cm" },
  { dimension: "250 cm", section: "8/10 cm" },
  { dimension: "250 cm", section: "10/12 cm" },
  { dimension: "300 cm", section: "10/12 cm" },
  { dimension: "350 cm", section: "10/12 cm" },
  { dimension: "350 cm", section: "12/14 cm" },
  { dimension: "450 cm", section: "12/14 cm" },
] as const;

const PIQUET_COMBO_KEYS = new Set(
  PIQUET_ROUND_COMBINATIONS.map(({ dimension, section }) => `${section}|${dimension}`),
);

/** True when the variant uses a piquet longueur × diamètre pair. */
export function isPiquetRoundVariant(product: Product): boolean {
  const section = product.details?.section?.trim();
  const dimension = product.details?.dimension?.trim();
  if (!section || !dimension) return false;
  return PIQUET_COMBO_KEYS.has(`${section}|${dimension}`);
}

export interface RoundPostVariantOptions {
  article: string;
  tete?: string;
  mortaises?: string;
  info?: string;
}

/** Build equestre-format variants for round posts (sans mortaise). */
export function buildPiquetRoundSansMortaiseVariants({
  article,
  tete = "Plate",
  info = "Avec pointes",
}: RoundPostVariantOptions): Product[] {
  return PIQUET_ROUND_COMBINATIONS.map(({ dimension, section }) => ({
    id: `validation-${article}-${section}-${dimension}-Sans-${info}`,
    label: `${article} — ${section} — ${dimension}`,
    article,
    reference: section,
    prixUnitaireHTVA: 0,
    disponibilite: "Sur commande" as const,
    details: { section, dimension, tete, mortaises: "Sans", info },
  }));
}

/** Mortised round posts: diamètre 12/14 cm, hauteur selon le nombre de mortaises. */
export function buildPiquetRoundMortisedVariants({
  article,
  tete = "Plate",
  info = "Avec pointes",
}: RoundPostVariantOptions): Product[] {
  return [
    { dimension: "200 cm", mortaises: "2" },
    { dimension: "225 cm", mortaises: "3" },
  ].map(({ dimension, mortaises }) => ({
    id: `validation-${article}-12/14 cm-${dimension}-${mortaises}-${info}`,
    label: `${article} — 12/14 cm — ${dimension}`,
    article,
    reference: "12/14 cm",
    prixUnitaireHTVA: 0,
    disponibilite: "Sur commande" as const,
    details: {
      section: "12/14 cm",
      dimension,
      tete,
      mortaises,
      info,
    },
  }));
}

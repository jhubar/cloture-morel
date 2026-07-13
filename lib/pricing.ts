import type { Product } from "@/lib/types";
import { isNumericPrice } from "@/lib/format";

/**
 * Selling model derived from a catalog product.
 *
 * Some categories (e.g. piquets, format "palette") express `prixUnitaireHTVA`
 * as a price PER PIECE while being sold by full palette of N pieces
 * (`details.nombre_par_palette`). For these, the sellable unit is the palette
 * and its price is `piecePrice × piecesPerPalette`. All quote/cart maths must
 * go through this helper so the price the customer sees matches what is sold.
 */
export interface ProductPricing {
  /** Pieces contained in one palette, when sold by palette; otherwise null. */
  piecesPerPalette: number | null;
  /** True when the product is sold by full palette (catalog price is per piece). */
  isPalette: boolean;
  /** Pieces per sachet when sold by pack (e.g. Gripple ×20). */
  piecesPerPack: number | null;
  /** True when the catalog price is per sachet/pack of N pieces. */
  isPack: boolean;
  /** Pieces per carton when a bulk carton option exists, otherwise null. */
  piecesPerCarton: number | null;
  /** Price for one full carton (same unit piece price), or null. */
  cartonPrice: number | null;
  /** Catalog price per piece (numeric), or null when "sur demande". */
  piecePrice: number | null;
  /**
   * Price of one sellable unit: palette, sachet, or single unit.
   * null when the price is non-numeric ("sur demande").
   */
  unitPrice: number | null;
  /** Singular label of the sellable unit, e.g. "palette", "sachet" or "unité". */
  unitLabel: string;
  /** Optional caveat shown under palette pricing (e.g. piece count variability). */
  paletteNote: string | null;
  /** Optional note for pack products (carton availability, etc.). */
  packNote: string | null;
}

export type PackUnit = "sachet" | "carton";

/** Applique le conditionnement choisi (sachet ou carton) pour les produits vendus par lot. */
export function resolveSellablePricing(
  pricing: ProductPricing,
  packUnit?: PackUnit,
): ProductPricing {
  if (
    !pricing.isPack ||
    packUnit !== "carton" ||
    pricing.cartonPrice === null ||
    pricing.piecesPerCarton === null
  ) {
    return pricing;
  }

  return {
    ...pricing,
    unitPrice: pricing.cartonPrice,
    unitLabel: "carton",
    piecesPerPack: pricing.piecesPerCarton,
  };
}

function parseCount(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 1 ? n : null;
}

/** Resolve the selling model (palette / sachet / unit) and effective unit price. */
export function getProductPricing(product: Product): ProductPricing {
  const catalogPrice = isNumericPrice(product.prixUnitaireHTVA)
    ? product.prixUnitaireHTVA
    : null;
  const piecesPerPalette = parseCount(product.details?.nombre_par_palette);
  const piecesPerPack = parseCount(product.details?.quantite_pack);
  const piecesPerCarton = parseCount(product.details?.quantite_carton);
  const isPalette = piecesPerPalette !== null;
  const isPack = !isPalette && piecesPerPack !== null;

  let piecePrice: number | null = catalogPrice;
  let unitPrice: number | null = catalogPrice;

  if (catalogPrice !== null) {
    if (isPalette) {
      unitPrice = catalogPrice * (piecesPerPalette as number);
    } else if (isPack) {
      unitPrice = catalogPrice;
      piecePrice = catalogPrice / (piecesPerPack as number);
    }
  } else {
    piecePrice = null;
    unitPrice = null;
  }

  const cartonPrice =
    isPack &&
    unitPrice !== null &&
    piecesPerPack !== null &&
    piecesPerCarton !== null
      ? unitPrice * (piecesPerCarton / piecesPerPack)
      : null;

  const unitLabel = isPalette ? "palette" : isPack ? "sachet" : "unité";

  return {
    piecesPerPalette,
    isPalette,
    piecesPerPack,
    isPack,
    piecesPerCarton,
    cartonPrice,
    piecePrice,
    unitPrice,
    unitLabel,
    paletteNote: product.details?.note_palette?.trim() || null,
    packNote: product.details?.note_pack?.trim() || null,
  };
}

/** Plural label for quantity stepper under product cards (palette / sachet / unité). */
export function getSellableUnitPlural(pricing: ProductPricing, quantity: number): string {
  if (quantity <= 1) return pricing.unitLabel;
  if (pricing.unitLabel === "palette") return "palettes";
  if (pricing.unitLabel === "sachet") return "sachets";
  return "unités";
}

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
  /** Catalog price per piece (numeric), or null when "sur demande". */
  piecePrice: number | null;
  /**
   * Price of one sellable unit: a full palette for palette products
   * (piecePrice × piecesPerPalette), otherwise the piece price.
   * null when the price is non-numeric ("sur demande").
   */
  unitPrice: number | null;
  /** Singular label of the sellable unit, e.g. "palette" or "unité". */
  unitLabel: string;
}

function parsePalette(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 1 ? n : null;
}

/** Resolve the selling model (palette vs unit) and effective unit price. */
export function getProductPricing(product: Product): ProductPricing {
  const piecePrice = isNumericPrice(product.prixUnitaireHTVA)
    ? product.prixUnitaireHTVA
    : null;
  const piecesPerPalette = parsePalette(product.details?.nombre_par_palette);
  const isPalette = piecesPerPalette !== null;
  const unitPrice =
    piecePrice === null
      ? null
      : isPalette
        ? piecePrice * (piecesPerPalette as number)
        : piecePrice;

  return {
    piecesPerPalette,
    isPalette,
    piecePrice,
    unitPrice,
    unitLabel: isPalette ? "palette" : "unité",
  };
}

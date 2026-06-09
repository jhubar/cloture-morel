import { findProduct, TAX_NOTE } from "@/lib/catalog";
import { getProductCommercialReference } from "@/lib/product-display";
import { getProductPricing } from "@/lib/pricing";
import type { MaterialsQuoteCustomer } from "@/lib/types";
import type { MaterialsQuoteInput } from "@/lib/validation";

export interface QuoteLine {
  reference: string;
  label: string;
  category: string;
  /** Quantity of sellable units (palettes for palette products, else pieces). */
  quantity: number;
  /** Singular label of the sellable unit ("palette" | "unité"). */
  unitLabel: string;
  /** Pieces per palette when sold by palette, otherwise null. */
  piecesPerPalette: number | null;
  /** Catalog price per piece, or null when "sur demande". */
  piecePrice: number | null;
  /** Price per sellable unit (palette price when sold by palette), or null. */
  unitPrice: number | null;
  lineTotal: number | null;
  onRequest: boolean;
}

export interface MaterialsQuote {
  reference: string;
  date: string;
  customer: MaterialsQuoteCustomer;
  lines: QuoteLine[];
  totalHTVA: number;
  hasOnRequest: boolean;
  taxNote: string;
}

/** Short, human-readable quote reference, e.g. "DM-20260602-4821". */
function buildReference(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DM-${y}${m}${d}-${rand}`;
}

/**
 * Build an authoritative materials quote from validated input. Prices are always
 * re-derived from the catalog server-side — client-supplied prices are never trusted.
 * Items whose product no longer exists are silently dropped.
 */
export function buildMaterialsQuote(input: MaterialsQuoteInput): MaterialsQuote {
  const now = new Date();
  const lines: QuoteLine[] = [];

  for (const item of input.items) {
    const found = findProduct(item.productId);
    if (!found) continue;
    const { product, category } = found;
    const pricing = getProductPricing(product);
    lines.push({
      reference: getProductCommercialReference(product) || product.label,
      label: product.label,
      category: category.title,
      quantity: item.quantity,
      unitLabel: pricing.unitLabel,
      piecesPerPalette: pricing.piecesPerPalette,
      piecePrice: pricing.piecePrice,
      unitPrice: pricing.unitPrice,
      lineTotal:
        pricing.unitPrice !== null ? pricing.unitPrice * item.quantity : null,
      onRequest: pricing.unitPrice === null,
    });
  }

  const totalHTVA = lines.reduce((sum, l) => sum + (l.lineTotal ?? 0), 0);
  const hasOnRequest = lines.some((l) => l.onRequest);

  return {
    reference: buildReference(now),
    date: now.toLocaleDateString("fr-BE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    customer: input.customer,
    lines,
    totalHTVA,
    hasOnRequest,
    taxNote: TAX_NOTE,
  };
}

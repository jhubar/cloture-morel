/**
 * Domain types for the Clôtures Morel catalog and quote flows.
 *
 * The catalog is the single source of truth (data/catalog.json), produced by
 * doc/scripts/excel_to_md.py from the client's Excel export. Prices may be a
 * number (EUR HTVA) or a string label such as "Sur demande", so consumers must
 * always guard against non-numeric prices when computing totals.
 */

/** A price is either a numeric amount (EUR HTVA) or a textual label. */
export type Price = number | string;

export interface ProductDetails {
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  label: string;
  article: string;
  reference: string;
  prixUnitaireHTVA: Price;
  /** Stock state ("En stock", "Sur commande", ...) or null when unspecified. */
  disponibilite: string | null;
  details?: ProductDetails;
  /** Present only on products eligible for full-truck pricing (12 products). */
  prixCamionCompletHTVA?: number;
}

export interface Category {
  id: string;
  title: string;
  /** Parent group id (e.g. "barrieres-galvanisees") or null for top-level. */
  parent: string | null;
  parentTitle: string | null;
  format: string;
  dualPricing: boolean;
  notes: string[];
  products: Product[];
}

export interface Catalog {
  generatedAt: string;
  source: string;
  currency: string;
  taxNote: string;
  categories: Category[];
}

/** A node in the navigation tree: either a parent group or a standalone category. */
export interface CategoryNode {
  /** Stable id (parent id, or category id when standalone). */
  id: string;
  title: string;
  categories: Category[];
}

/** Persisted cart line. We store ids + quantity only; price/label are re-derived. */
export interface CartItem {
  productId: string;
  quantity: number;
}

/** A cart line resolved against the current catalog, ready for display. */
export interface ResolvedCartItem {
  product: Product;
  category: Category;
  /** Quantity of sellable units (palettes for palette products, else pieces). */
  quantity: number;
  /** Price per sellable unit (palette price when sold by palette), or null. */
  unitPrice: number | null;
  /** quantity * unitPrice, or null when price is non-numeric. */
  lineTotal: number | null;
  /** True when the product is sold by full palette. */
  isPalette: boolean;
  /** Pieces per palette when isPalette, otherwise null. */
  piecesPerPalette: number | null;
  /** Catalog price per piece, or null when "sur demande". */
  piecePrice: number | null;
  /** Singular label of the sellable unit ("palette" | "unité"). */
  unitLabel: string;
}

/** Customer payload sent with a materials quote request. */
export interface MaterialsQuoteCustomer {
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone: string;
  address: string;
  message?: string;
}

/** Installation (pose) quote request payload. */
export interface InstallationQuoteRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectAddress: string;
  fenceType: string;
  approximateLength?: string;
  terrain?: string;
  timing?: string;
  message?: string;
}

/** Generic contact form payload. */
export interface ContactRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
}

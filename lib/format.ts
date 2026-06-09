import type { Price } from "@/lib/types";

const currencyFormatter = new Intl.NumberFormat("fr-BE", {
  style: "currency",
  currency: "EUR",
});

/** True when a catalog price is a usable numeric value. */
export function isNumericPrice(price: Price | null | undefined): price is number {
  return typeof price === "number" && Number.isFinite(price);
}

/** Format a numeric amount as EUR (fr-BE), e.g. "5,02 €". */
export function formatEUR(amount: number): string {
  return currencyFormatter.format(amount);
}

/**
 * Display a catalog price. Numeric prices are formatted as EUR HTVA; non-numeric
 * prices (e.g. "Sur demande") are passed through as-is.
 */
export function formatPrice(price: Price | null | undefined): string {
  if (isNumericPrice(price)) return formatEUR(price);
  if (typeof price === "string" && price.trim()) return price;
  return "Sur demande";
}

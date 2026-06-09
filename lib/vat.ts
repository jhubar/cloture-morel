/**
 * Belgian VAT number validation (format only — no VIES lookup).
 * Accepts BE 0707.588.769, BE0707588769, etc.
 */
export function normalizeBelgianVat(value: string): string {
  return value.replace(/[\s.]/g, "").toUpperCase();
}

export function isValidBelgianVat(value: string): boolean {
  const normalized = normalizeBelgianVat(value);
  return /^BE\d{10}$/.test(normalized);
}

export function formatBelgianVat(value: string): string {
  const digits = normalizeBelgianVat(value).replace(/^BE/, "");
  if (digits.length !== 10) return value.trim();
  return `BE ${digits.slice(0, 4)}.${digits.slice(4, 7)}.${digits.slice(7)}`;
}

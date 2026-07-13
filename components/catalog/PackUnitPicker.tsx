"use client";

import { formatEUR } from "@/lib/format";
import type { PackUnit, ProductPricing } from "@/lib/pricing";
import { cn } from "@/lib/utils";

interface PackUnitPickerProps {
  pricing: ProductPricing;
  value: PackUnit;
  onChange: (value: PackUnit) => void;
  className?: string;
}

/** Choix sachet / carton pour les produits Gripple et similaires. */
export function PackUnitPicker({
  pricing,
  value,
  onChange,
  className,
}: PackUnitPickerProps) {
  if (
    !pricing.isPack ||
    pricing.piecesPerPack === null ||
    pricing.unitPrice === null
  ) {
    return null;
  }

  const hasCarton =
    pricing.cartonPrice !== null && pricing.piecesPerCarton !== null;

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-bark-muted">
        Conditionnement
      </p>
      <div
        className={cn(
          "grid gap-2",
          hasCarton ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
        )}
        role="group"
        aria-label="Choisir le conditionnement"
      >
        <button
          type="button"
          onClick={() => onChange("sachet")}
          className={cn(
            "rounded-lg border px-3 py-2.5 text-left text-sm transition-colors cursor-pointer",
            value === "sachet"
              ? "border-forest bg-sage-soft/60 text-forest-dark"
              : "border-sand-300 bg-white text-bark-muted hover:border-sand-400",
          )}
        >
          <span className="block font-semibold text-forest-dark">Sachet</span>
          <span className="mt-0.5 block text-xs">
            {pricing.piecesPerPack} pièces — {formatEUR(pricing.unitPrice)} HTVA
          </span>
          {pricing.piecePrice !== null && (
            <span className="mt-0.5 block text-xs">
              {formatEUR(pricing.piecePrice)} / pièce
            </span>
          )}
        </button>

        {hasCarton && pricing.cartonPrice !== null && pricing.piecesPerCarton !== null && (
          <button
            type="button"
            onClick={() => onChange("carton")}
            className={cn(
              "rounded-lg border px-3 py-2.5 text-left text-sm transition-colors cursor-pointer",
              value === "carton"
                ? "border-forest bg-sage-soft/60 text-forest-dark"
                : "border-sand-300 bg-white text-bark-muted hover:border-sand-400",
            )}
          >
            <span className="block font-semibold text-forest-dark">Carton</span>
            <span className="mt-0.5 block text-xs">
              {pricing.piecesPerCarton} pièces — {formatEUR(pricing.cartonPrice)} HTVA
            </span>
            {pricing.piecePrice !== null && (
              <span className="mt-0.5 block text-xs">
                {formatEUR(pricing.piecePrice)} / pièce (même prix unitaire)
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

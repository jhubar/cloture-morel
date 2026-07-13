import { formatEUR } from "@/lib/format";
import type { ProductPricing } from "@/lib/pricing";

interface SellableUnitPricingProps {
  pricing: ProductPricing;
  className?: string;
  detailClassName?: string;
}

/** Sous-texte prix : palette, sachet Gripple, ou unité simple. */
export function SellableUnitPricing({
  pricing,
  className = "mt-1 text-sm text-bark-muted",
  detailClassName = "mt-2 text-sm leading-relaxed text-bark-muted",
}: SellableUnitPricingProps) {
  if (pricing.isPalette && pricing.piecesPerPalette !== null) {
    return (
      <p className={detailClassName}>
        Pour <span className="font-medium text-forest-dark">1 palette</span> de{" "}
        {pricing.piecesPerPalette} pièces
        {pricing.piecePrice !== null && (
          <> ({formatEUR(pricing.piecePrice)} / pièce HTVA)</>
        )}
        {pricing.paletteNote && (
          <span className="mt-1 block text-xs italic">{pricing.paletteNote}</span>
        )}
      </p>
    );
  }

  if (pricing.isPack && pricing.piecesPerPack !== null) {
    return (
      <div className={cnSpace(detailClassName)}>
        <p>
          Vendu par <span className="font-medium text-forest-dark">sachet de {pricing.piecesPerPack} pièces</span>
          {pricing.piecePrice !== null && (
            <> — {formatEUR(pricing.piecePrice)} / pièce HTVA</>
          )}
        </p>
        {pricing.cartonPrice !== null && pricing.piecesPerCarton !== null && (
          <div className="rounded-lg border border-forest/20 bg-sage-soft/50 px-3 py-2.5 text-sm text-bark">
            <p className="font-semibold text-forest-dark">
              Également en carton de {pricing.piecesPerCarton} pièces
            </p>
            <p className="mt-1">
              {formatEUR(pricing.cartonPrice)} HTVA — même prix unitaire
              {pricing.piecePrice !== null && (
                <> ({formatEUR(pricing.piecePrice)} / pièce)</>
              )}
            </p>
          </div>
        )}
        {pricing.packNote && (
          <p className="text-xs italic text-bark-muted">{pricing.packNote}</p>
        )}
      </div>
    );
  }

  return <p className={className}>Prix unitaire HTVA</p>;
}

function cnSpace(detailClassName: string) {
  return `${detailClassName} space-y-2`;
}

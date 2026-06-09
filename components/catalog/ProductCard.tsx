"use client";

import { useState } from "react";
import { Check, Plus, Truck } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { formatEUR, formatPrice, isNumericPrice } from "@/lib/format";
import { getProductPricing } from "@/lib/pricing";
import { useCartStore } from "@/lib/cart-store";
import { AvailabilityBadge } from "@/components/catalog/AvailabilityBadge";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  category: Category;
}

/** Build a short, human-readable line from the product details map. */
function detailSummary(product: Product): string | null {
  const d = product.details;
  if (!d) return null;
  if (d.longueur) return `Longueur : ${d.longueur}`;
  if (d.conditionnement) return d.conditionnement;
  const first = Object.values(d).find((v) => v && v.trim());
  return first ?? null;
}

export function ProductCard({ product, category }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const pricing = getProductPricing(product);
  // Palette products surface their own price/piece context, so skip the
  // generic details line for them to avoid duplicate information.
  const summary = pricing.isPalette ? null : detailSummary(product);
  const hasTruckPrice = isNumericPrice(product.prixCamionCompletHTVA);
  const unitNoun = pricing.isPalette
    ? quantity > 1
      ? "palettes"
      : "palette"
    : quantity > 1
      ? "unités"
      : "unité";

  const handleAdd = () => {
    addItem(product.id, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="flex h-full flex-col rounded-card border border-sand-300 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-forest-dark">
          {product.reference || product.label}
        </h3>
        <AvailabilityBadge availability={product.disponibilite} />
      </div>

      <p className="mt-1 text-sm text-bark-muted">{category.title}</p>
      {summary && <p className="mt-2 text-sm text-bark-muted">{summary}</p>}

      <div className="mt-4">
        <p className="font-display text-2xl font-semibold text-forest-dark">
          {pricing.unitPrice !== null
            ? formatEUR(pricing.unitPrice)
            : formatPrice(product.prixUnitaireHTVA)}
        </p>
        {pricing.isPalette && pricing.piecePrice !== null ? (
          <p className="text-xs text-bark-muted">
            La palette de {pricing.piecesPerPalette} pièces ·{" "}
            {formatEUR(pricing.piecePrice)}/pièce HTVA
          </p>
        ) : (
          <p className="text-xs text-bark-muted">Prix unitaire HTVA</p>
        )}
        {hasTruckPrice && (
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-2.5 py-1 text-xs font-medium text-forest">
            <Truck className="h-3.5 w-3.5" aria-hidden="true" />
            Camion complet : {formatEUR(product.prixCamionCompletHTVA as number)}
            /pièce
          </span>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-sand-200 pt-4">
        <div className="flex flex-col items-center gap-1">
          <QuantityStepper value={quantity} onChange={setQuantity} size="sm" />
          <span className="text-[11px] leading-none text-bark-muted">
            {unitNoun}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            "inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors duration-200 cursor-pointer",
            added
              ? "bg-instock text-white"
              : "bg-terracotta text-white hover:bg-terracotta-dark",
          )}
          aria-label={`Ajouter ${product.label} au panier`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Ajouté
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Ajouter
            </>
          )}
        </button>
      </div>
    </article>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Plus, Truck } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { formatEUR, formatPrice, isNumericPrice } from "@/lib/format";
import { getProductPricing } from "@/lib/pricing";
import {
  getProductDetailRows,
  getProductDisplayTitle,
  getProductDisplaySubtitle,
} from "@/lib/product-display";
import { productFamilyImages } from "@/lib/assets";
import { useCartStore } from "@/lib/cart-store";
import { AvailabilityBadge } from "@/components/catalog/AvailabilityBadge";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  category: Category;
  familyId?: string;
  familyLabel?: string;
}

export function ProductCard({
  product,
  category,
  familyId,
  familyLabel,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const pricing = getProductPricing(product);
  const title = getProductDisplayTitle(product);
  const subtitle = getProductDisplaySubtitle(product);
  const detailRows = getProductDetailRows(product);
  const hasTruckPrice = isNumericPrice(product.prixCamionCompletHTVA);
  const familyImage = familyId ? productFamilyImages[familyId] : undefined;
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
    window.setTimeout(() => setAdded(false), 4000);
  };

  const metaParts = [category.title];
  if (familyLabel) metaParts.unshift(familyLabel);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-sand-300 bg-white shadow-card">
      {familyImage && (
        <ImageSlot
          slot={familyImage}
          className="relative aspect-[16/10] border-b border-sand-200"
          sizes="(max-width: 640px) 100vw, 400px"
        />
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-forest-dark">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-bark-muted">{subtitle}</p>}
        </div>
        <AvailabilityBadge availability={product.disponibilite} />
      </div>

      <p className="mt-1 text-sm text-bark-muted">{metaParts.join(" · ")}</p>

      {detailRows.length > 0 && (
        <details className="mt-3 rounded-lg border border-sand-200 bg-sand/40 text-sm">
          <summary className="cursor-pointer px-3 py-2 font-medium text-forest-dark">
            Caractéristiques ({detailRows.length})
          </summary>
          <dl className="divide-y divide-sand-200 px-3 pb-2">
            {detailRows.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-start justify-between gap-3 py-2 text-bark-muted"
              >
                <dt className="shrink-0">{label}</dt>
                <dd className="text-right font-medium text-bark">{value}</dd>
              </div>
            ))}
          </dl>
        </details>
      )}

      <div className="mt-4">
        <p className="font-display text-2xl font-semibold text-forest-dark">
          {pricing.unitPrice !== null
            ? formatEUR(pricing.unitPrice)
            : formatPrice(product.prixUnitaireHTVA)}
        </p>
        {pricing.isPalette && pricing.piecesPerPalette !== null ? (
          <p className="mt-1 text-xs text-bark-muted">
            Prix pour <span className="font-medium text-forest-dark">1 palette</span> de{" "}
            {pricing.piecesPerPalette} pièces
            {pricing.piecePrice !== null && (
              <> ({formatEUR(pricing.piecePrice)} par pièce HTVA)</>
            )}
          </p>
        ) : (
          <p className="text-xs text-bark-muted">Prix unitaire HTVA</p>
        )}
        {hasTruckPrice && (
          <p className="mt-2 text-xs text-bark-muted">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-2.5 py-1 font-medium text-forest">
              <Truck className="h-3.5 w-3.5" aria-hidden="true" />
              Camion complet
            </span>{" "}
            — tarif dégressif à partir d&apos;un camion :{" "}
            {formatEUR(product.prixCamionCompletHTVA as number)}/pièce HTVA
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-sand-200 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <QuantityStepper value={quantity} onChange={setQuantity} size="sm" />
            <span className="text-[11px] leading-none text-bark-muted">{unitNoun}</span>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2",
              added
                ? "bg-instock text-white"
                : "bg-terracotta text-white hover:bg-terracotta-dark",
            )}
            aria-label={`Ajouter ${title} au panier`}
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
        {added && (
          <Link
            href="/panier"
            className="text-center text-sm font-medium text-forest transition-colors hover:text-forest-dark"
          >
            Voir ma sélection →
          </Link>
        )}
      </div>
      </div>
    </article>
  );
}

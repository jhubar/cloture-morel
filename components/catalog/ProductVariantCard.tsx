"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Plus, Truck } from "lucide-react";
import type { Category } from "@/lib/types";
import { formatEUR, formatPrice, isNumericPrice } from "@/lib/format";
import { getProductPricing } from "@/lib/pricing";
import { productFamilyImages } from "@/lib/assets";
import { useCartStore } from "@/lib/cart-store";
import { ImageSlot } from "@/components/ui/ImageSlot";
import {
  buildDefaultSelection,
  findMatchingVariant,
  getAvailableValues,
  getVariantAxesForGroup,
  type ProductGroup,
} from "@/lib/product-variants";
import { AvailabilityBadge } from "@/components/catalog/AvailabilityBadge";
import { OptionPicker } from "@/components/catalog/OptionPicker";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { cn } from "@/lib/utils";

interface ProductVariantCardProps {
  group: ProductGroup;
  category: Category;
  familyId?: string;
  familyLabel?: string;
}

/** Une colonne pour ≤2 axes (lisible sur mobile/tablette) ; grille seulement si 3+ axes. */
function optionGridClass(axisCount: number): string {
  if (axisCount <= 2) return "grid grid-cols-1 gap-5";
  return "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3";
}

export function ProductVariantCard({
  group,
  category,
  familyId,
  familyLabel,
}: ProductVariantCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const axes = useMemo(
    () => getVariantAxesForGroup(group.variants, category.format),
    [group.variants, category.format],
  );
  const defaultSelection = useMemo(
    () => buildDefaultSelection(group.variants, category.format),
    [group.variants, category.format],
  );
  const [selection, setSelection] = useState(defaultSelection);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product =
    findMatchingVariant(group.variants, selection, category.format) ??
    group.variants[0];

  const pricing = getProductPricing(product);
  const hasTruckPrice = isNumericPrice(product.prixCamionCompletHTVA);
  const familyImage = familyId ? productFamilyImages[familyId] : undefined;
  const unitNoun = pricing.isPalette
    ? quantity > 1
      ? "palettes"
      : "palette"
    : quantity > 1
      ? "unités"
      : "unité";

  const metaParts = [category.title];
  if (familyLabel) metaParts.unshift(familyLabel);

  const handleAxisChange = (key: string, value: string) => {
    const next = { ...selection, [key]: value };
    const axisIndex = axes.findIndex((axis) => axis.key === key);

    for (let i = axisIndex + 1; i < axes.length; i += 1) {
      const axis = axes[i];
      const available = getAvailableValues(
        group.variants,
        axis.key,
        next,
        category.format,
      );
      if (!available.includes(next[axis.key] ?? "")) {
        next[axis.key] = available[0] ?? "";
      }
    }

    setSelection(next);
  };

  const handleAdd = () => {
    addItem(product.id, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 4000);
  };

  return (
    <article className="min-w-0 overflow-hidden rounded-card border border-sand-300 bg-white shadow-card">
      {familyImage && (
        <ImageSlot
          slot={familyImage}
          className="relative aspect-[16/9] w-full max-w-full min-h-[200px] border-b border-sand-200 sm:min-h-[260px] lg:min-h-[300px]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 960px"
        />
      )}

      <div className="border-b border-sand-200 px-4 py-4 sm:px-8 sm:py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold text-forest-dark sm:text-2xl">
              {group.article}
            </h3>
            <p className="mt-1 text-sm text-bark-muted">{metaParts.join(" · ")}</p>
            <p className="mt-1 text-xs text-bark-muted">
              {group.variants.length} déclinaisons — choisissez vos options puis ajoutez au
              panier
            </p>
          </div>
          <AvailabilityBadge availability={product.disponibilite} />
        </div>
      </div>

      <div className="flex flex-col xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] xl:items-stretch">
        <div className="min-w-0 border-b border-sand-200 px-4 py-5 sm:px-8 sm:py-6 xl:border-b-0 xl:border-r">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-bark-muted">
            Configuration
          </p>
          <div className={optionGridClass(axes.length)}>
            {axes.map((axis) => (
              <OptionPicker
                key={axis.key}
                label={axis.label}
                name={`${group.article}-${axis.key}`}
                value={selection[axis.key] ?? null}
                options={getAvailableValues(
                  group.variants,
                  axis.key,
                  selection,
                  category.format,
                )}
                onChange={(value) => handleAxisChange(axis.key, value)}
                className="min-w-0"
              />
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-between gap-6 bg-sand/25 px-4 py-5 sm:px-8 sm:py-6">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-bark-muted">
              Prix sélectionné
            </p>
            <p className="mt-1 break-words font-display text-3xl font-semibold tabular-nums text-forest-dark sm:text-4xl">
              {pricing.unitPrice !== null
                ? formatEUR(pricing.unitPrice)
                : formatPrice(product.prixUnitaireHTVA)}
            </p>
            {pricing.isPalette && pricing.piecesPerPalette !== null ? (
              <p className="mt-2 text-sm leading-relaxed text-bark-muted">
                Pour <span className="font-medium text-forest-dark">1 palette</span> de{" "}
                {pricing.piecesPerPalette} pièces
                {pricing.piecePrice !== null && (
                  <> ({formatEUR(pricing.piecePrice)} / pièce HTVA)</>
                )}
              </p>
            ) : (
              <p className="mt-1 text-sm text-bark-muted">Prix unitaire HTVA</p>
            )}
            {hasTruckPrice && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-bark-muted">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-2.5 py-1 font-medium text-forest">
                  <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                  Camion complet
                </span>
                <span>
                  {formatEUR(product.prixCamionCompletHTVA as number)}/pièce HTVA
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 border-t border-sand-200 pt-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-col items-center gap-1 self-start">
                <QuantityStepper value={quantity} onChange={setQuantity} size="sm" />
                <span className="text-[11px] leading-none text-bark-muted">{unitNoun}</span>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className={cn(
                  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 sm:w-auto sm:flex-1",
                  added
                    ? "bg-instock text-white"
                    : "bg-terracotta text-white hover:bg-terracotta-dark",
                )}
                aria-label={`Ajouter ${group.article} au panier`}
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
      </div>
    </article>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { getCategoryById } from "@/lib/catalog";
import { OptionPicker } from "@/components/catalog/OptionPicker";
import {
  buildDefaultSelection,
  findMatchingVariant,
  getAvailableValues,
  getVariantAxesForGroup,
  groupCategoryProducts,
} from "@/lib/product-variants";
import { getProductDisplayTitle } from "@/lib/product-display";
import {
  buildVariantSummary,
  type ResolvedProduct,
} from "@/lib/installation-project";
import { cn } from "@/lib/utils";

interface ProjectProductPickerProps {
  categoryId: string;
  onResolved: (resolved: ResolvedProduct | null) => void;
  error?: string;
}

function optionGridClass(axisCount: number): string {
  if (axisCount <= 2) return "grid grid-cols-1 gap-4";
  return "grid grid-cols-1 gap-4 sm:grid-cols-2";
}

export function ProjectProductPicker({
  categoryId,
  onResolved,
  error,
}: ProjectProductPickerProps) {
  const category = getCategoryById(categoryId);
  const groups = useMemo(
    () => (category ? groupCategoryProducts(category) : []),
    [category],
  );

  const [groupIndex, setGroupIndex] = useState(0);
  const activeGroup = groups[groupIndex] ?? groups[0];

  const axes = useMemo(() => {
    if (!category || !activeGroup) return [];
    return getVariantAxesForGroup(activeGroup.variants, category.format);
  }, [category, activeGroup]);

  const [selection, setSelection] = useState<Record<string, string>>({});

  useEffect(() => {
    setGroupIndex(0);
  }, [categoryId]);

  useEffect(() => {
    if (!category || !activeGroup) {
      setSelection({});
      return;
    }
    setSelection(buildDefaultSelection(activeGroup.variants, category.format));
  }, [category, activeGroup, categoryId]);

  const product = useMemo(() => {
    if (!category || !activeGroup) return null;
    return (
      findMatchingVariant(activeGroup.variants, selection, category.format) ??
      activeGroup.variants[0] ??
      null
    );
  }, [category, activeGroup, selection]);

  useEffect(() => {
    if (!category || !activeGroup || !product) {
      onResolved(null);
      return;
    }
    const variantSummary = buildVariantSummary(category, activeGroup, selection);
    onResolved({
      productId: product.id,
      productLabel: getProductDisplayTitle(product),
      article: activeGroup.article,
      variantSummary: variantSummary || undefined,
    });
  }, [category, activeGroup, product, selection, onResolved]);

  const handleAxisChange = (key: string, value: string) => {
    if (!category || !activeGroup) return;
    const next = { ...selection, [key]: value };
    const axisIndex = axes.findIndex((axis) => axis.key === key);

    for (let i = axisIndex + 1; i < axes.length; i += 1) {
      const axis = axes[i];
      const available = getAvailableValues(
        activeGroup.variants,
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

  if (!category || groups.length === 0) {
    return (
      <p className="text-sm text-bark-muted">Aucun produit disponible pour cette catégorie.</p>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-sand-300 bg-white p-4">
      <p className="text-sm font-medium text-forest-dark">Modèle &amp; options</p>

      {groups.length > 1 && (
        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-wider text-bark-muted">
            Article
          </legend>
          <div className="flex flex-wrap gap-2">
            {groups.map((group, index) => {
              const active = groupIndex === index;
              return (
                <button
                  key={group.article}
                  type="button"
                  onClick={() => setGroupIndex(index)}
                  className={cn(
                    "inline-flex min-h-9 max-w-full items-center rounded-full border px-3 py-1.5 text-sm transition-colors cursor-pointer",
                    active
                      ? "border-terracotta bg-terracotta text-white"
                      : "border-sand-300 bg-sand/30 text-bark hover:border-terracotta/40",
                  )}
                >
                  <span className="truncate">{group.article}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {groups.length === 1 && (
        <p className="text-sm text-bark-muted">
          <span className="font-medium text-forest-dark">{activeGroup.article}</span>
          {activeGroup.variants.length > 1 && (
            <span className="ml-1">
              — {activeGroup.variants.length} déclinaisons
            </span>
          )}
        </p>
      )}

      {axes.length > 0 && (
        <div className={optionGridClass(axes.length)}>
          {axes.map((axis) => (
            <OptionPicker
              key={`${activeGroup.article}-${axis.key}`}
              label={axis.label}
              name={`pose-${categoryId}-${axis.key}`}
              value={selection[axis.key] ?? null}
              options={getAvailableValues(
                activeGroup.variants,
                axis.key,
                selection,
                category.format,
              )}
              onChange={(value) => handleAxisChange(axis.key, value)}
              className="min-w-0"
            />
          ))}
        </div>
      )}

      {product && (
        <p className="rounded-md bg-sage-soft/50 px-3 py-2 text-sm text-bark">
          <span className="font-medium text-forest-dark">Sélection : </span>
          {getProductDisplayTitle(product)}
          {buildVariantSummary(category, activeGroup, selection) && (
            <span className="text-bark-muted">
              {" "}
              ({buildVariantSummary(category, activeGroup, selection)})
            </span>
          )}
        </p>
      )}

      {error && <p className="text-xs text-terracotta-dark">{error}</p>}
    </div>
  );
}

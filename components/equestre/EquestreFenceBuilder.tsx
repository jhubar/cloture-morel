"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check, Info, Lock, Plus } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { getCategoryById } from "@/lib/catalog";
import {
  buildDefaultSelection,
  findMatchingVariant,
  getAvailableValues,
  getVariantAxesForGroup,
  groupCategoryProducts,
  type ProductGroup,
} from "@/lib/product-variants";
import {
  EQUESTRE_ESSENCES,
  RAIL_COUNT_CHOICES,
  estimateFence,
  getEssence,
  getMortiseCount,
  getPostOptions,
  getRailOptions,
  isEssenceAvailable,
  type EquestreBuildResult,
  type EssenceConfig,
  type PartOption,
} from "@/lib/equestre-builder";
import {
  buildVariantSummary,
} from "@/lib/installation-project";
import { OptionPicker } from "@/components/catalog/OptionPicker";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

/** Self-contained variant option picker reporting its resolved product upward. */
function VariantPicker({
  category,
  group,
  onResolve,
  labelOverrides,
}: {
  category: Category;
  group: ProductGroup;
  onResolve: (product: Product | null, summary: string) => void;
  /** Override axis labels by key (e.g. rail "dimension" → "Longueur"). */
  labelOverrides?: Record<string, string>;
}) {
  const format = category.format;
  const axes = useMemo(
    () => getVariantAxesForGroup(group.variants, format),
    [group, format],
  );
  const [selection, setSelection] = useState<Record<string, string>>(() =>
    buildDefaultSelection(group.variants, format),
  );

  useEffect(() => {
    setSelection(buildDefaultSelection(group.variants, format));
  }, [group, format]);

  const product = useMemo(
    () =>
      findMatchingVariant(group.variants, selection, format) ??
      group.variants[0] ??
      null,
    [group, selection, format],
  );

  useEffect(() => {
    onResolve(product, buildVariantSummary(category, group, selection));
  }, [product, selection, category, group, onResolve]);

  const handleChange = (key: string, value: string) => {
    const next = { ...selection, [key]: value };
    const axisIndex = axes.findIndex((a) => a.key === key);
    for (let i = axisIndex + 1; i < axes.length; i += 1) {
      const axis = axes[i];
      const available = getAvailableValues(group.variants, axis.key, next, format);
      if (!available.includes(next[axis.key] ?? "")) {
        next[axis.key] = available[0] ?? "";
      }
    }
    setSelection(next);
  };

  if (axes.length === 0) return null;

  return (
    <div className={cn("grid gap-4", axes.length > 2 ? "sm:grid-cols-2" : "grid-cols-1")}>
      {axes.map((axis) => (
        <OptionPicker
          key={`${group.article}-${axis.key}`}
          label={labelOverrides?.[axis.key] ?? axis.label}
          name={`equestre-${category.id}-${axis.key}`}
          value={selection[axis.key] ?? null}
          options={getAvailableValues(group.variants, axis.key, selection, format)}
          onChange={(value) => handleChange(axis.key, value)}
        />
      ))}
    </div>
  );
}

interface EquestreFenceBuilderProps {
  /** "cart" adds posts+rails to the cart; "quote" reports project lines. */
  mode: "cart" | "quote";
  onQuoteAdd?: (result: EquestreBuildResult) => void;
  className?: string;
}

export function EquestreFenceBuilder({
  mode,
  onQuoteAdd,
  className,
}: EquestreFenceBuilderProps) {
  const addItem = useCartStore((s) => s.addItem);

  // All essences are shown; those without references yet display a notice
  // instead of the post/rail steps.
  const essences = EQUESTRE_ESSENCES;
  const firstAvailable = useMemo(
    () => EQUESTRE_ESSENCES.find((e) => isEssenceAvailable(e)),
    [],
  );

  const [essenceKey, setEssenceKey] = useState<string>(
    firstAvailable?.key ?? EQUESTRE_ESSENCES[0]?.key ?? "",
  );
  const essence: EssenceConfig | undefined = getEssence(essenceKey);
  const essenceAvailable = essence ? isEssenceAvailable(essence) : false;

  const postOptions = useMemo(
    () => (essence ? getPostOptions(essence) : []),
    [essence],
  );
  const railOptions = useMemo(
    () => (essence ? getRailOptions(essence) : []),
    [essence],
  );

  const [postIndex, setPostIndex] = useState(0);
  const [railIndex, setRailIndex] = useState(0);
  const [railCountManual, setRailCountManual] = useState(3);
  const [lengthStr, setLengthStr] = useState("");
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const [postProduct, setPostProduct] = useState<Product | null>(null);
  const [postSummary, setPostSummary] = useState("");
  const [railProduct, setRailProduct] = useState<Product | null>(null);
  const [railSummary, setRailSummary] = useState("");

  // Reset dependent selections when essence changes.
  useEffect(() => {
    setPostIndex(0);
    setRailIndex(0);
    setConfirmation(null);
  }, [essenceKey]);

  const postOption = postOptions[postIndex] ?? postOptions[0];
  const postCategory = postOption ? getCategoryById(postOption.categoryId) : undefined;

  const mortiseCount = getMortiseCount(postProduct);
  const isMortise = mortiseCount !== null;

  // Rail option: imposed for mortise posts, chosen otherwise.
  const effectiveRailOption = useMemo(() => {
    if (!essence) return undefined;
    if (isMortise) {
      return (
        railOptions.find((o) => o.categoryId === essence.mortiseRailCategoryId) ??
        railOptions[0]
      );
    }
    return railOptions[railIndex] ?? railOptions[0];
  }, [essence, isMortise, railOptions, railIndex]);

  const railCategory = effectiveRailOption
    ? getCategoryById(effectiveRailOption.categoryId)
    : undefined;

  const railCount = isMortise ? mortiseCount! : railCountManual;

  const lengthM = Number(lengthStr.replace(",", "."));
  const validLength = !Number.isNaN(lengthM) && lengthM > 0;

  const estimate = useMemo(
    () => estimateFence(validLength ? lengthM : 0, railProduct, railCount),
    [validLength, lengthM, railProduct, railCount],
  );

  const canSubmit =
    Boolean(essence && postProduct && railProduct) &&
    validLength &&
    estimate.postCount !== null &&
    estimate.railPieces !== null;

  const handlePostResolve = useCallback((product: Product | null, summary: string) => {
    setPostProduct(product);
    setPostSummary(summary);
  }, []);

  const handleRailResolve = useCallback((product: Product | null, summary: string) => {
    setRailProduct(product);
    setRailSummary(summary);
  }, []);

  const buildResult = (): EquestreBuildResult | null => {
    if (
      !essence ||
      !postOption ||
      !postProduct ||
      !effectiveRailOption ||
      !railProduct ||
      estimate.postCount === null ||
      estimate.railPieces === null
    ) {
      return null;
    }
    return {
      essence,
      post: {
        product: postProduct,
        categoryId: postOption.categoryId,
        categoryTitle: postOption.categoryTitle,
        article: postOption.group.article,
        summary: postSummary,
      },
      rail: {
        product: railProduct,
        categoryId: effectiveRailOption.categoryId,
        categoryTitle: effectiveRailOption.categoryTitle,
        article: effectiveRailOption.group.article,
        summary: railSummary,
      },
      railCount,
      lengthM,
      estimate,
    };
  };

  const handleSubmit = () => {
    const result = buildResult();
    if (!result) return;

    if (mode === "cart") {
      addItem(result.post.product.id, result.estimate.postCount!);
      addItem(result.rail.product.id, result.estimate.railPieces!);
      setConfirmation(
        `Ajouté : ${result.estimate.postCount} poteaux + ${result.estimate.railPieces} lisses`,
      );
      setLengthStr("");
    } else {
      onQuoteAdd?.(result);
      setConfirmation("Clôture ajoutée à votre projet.");
      setLengthStr("");
    }
  };

  if (!essence || essences.length === 0) {
    return (
      <p className={cn("text-sm text-bark-muted", className)}>
        Le configurateur équestre sera disponible dès l&apos;ajout des références.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "space-y-6 rounded-card border border-sand-300 bg-white p-5 shadow-card sm:p-6",
        className,
      )}
    >
      <div>
        <h3 className="text-lg font-semibold text-forest-dark">
          Composez votre clôture équestre
        </h3>
        <p className="mt-1 text-sm text-bark-muted">
          Choisissez le poteau, puis les lisses. Les quantités sont estimées à
          partir de la longueur (espacement = longueur de la lisse).
        </p>
      </div>

      {/* Step 1 — Essence */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-forest-dark">
          1. Essence du bois
        </legend>
        <div className="flex flex-wrap gap-2">
          {essences.map((e) => {
            const soon = !isEssenceAvailable(e);
            return (
              <button
                key={e.key}
                type="button"
                onClick={() => setEssenceKey(e.key)}
                className={cn(
                  "inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                  essenceKey === e.key
                    ? "border-terracotta bg-terracotta text-white"
                    : "border-sand-300 bg-white text-bark hover:border-terracotta/40",
                )}
              >
                {e.label}
                {soon && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide",
                      essenceKey === e.key
                        ? "bg-white/25 text-white"
                        : "bg-sand-200 text-bark-muted",
                    )}
                  >
                    Bientôt
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      {!essenceAvailable ? (
        <div className="rounded-lg border border-onorder/30 bg-onorder/10 px-4 py-3 text-sm text-bark">
          Les références <strong>{essence.label}</strong> sont en cours
          d&apos;intégration.{" "}
          {mode === "cart"
            ? "Demandez un devis pour cette gamme, ou choisissez une autre essence."
            : "Décrivez votre besoin dans le message ci-dessous, ou choisissez une autre essence."}
        </div>
      ) : (
      <>
      {/* Step 2 — Post */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-forest-dark">
          2. Type de poteau
        </legend>
        {postOptions.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {postOptions.map((option, index) => (
              <button
                key={`${option.categoryId}-${option.group.article}`}
                type="button"
                onClick={() => setPostIndex(index)}
                className={cn(
                  "inline-flex min-h-9 items-center rounded-full border px-3 py-1.5 text-sm transition-colors cursor-pointer",
                  postIndex === index
                    ? "border-forest bg-forest text-white"
                    : "border-sand-300 bg-white text-bark hover:border-forest/50",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        {postOption?.image?.src && (
          <figure className="overflow-hidden rounded-card border border-sand-300 bg-sand-50">
            <div className="relative aspect-[4/3] w-full max-w-sm">
              <Image
                src={postOption.image.src}
                alt={postOption.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 384px"
              />
            </div>
          </figure>
        )}
        {postCategory && postOption && (
          <VariantPicker
            key={`post-${postOption.categoryId}-${postOption.group.article}`}
            category={postCategory}
            group={postOption.group}
            onResolve={handlePostResolve}
          />
        )}
      </fieldset>

      {/* Step 3 — Rails */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-forest-dark">
          3. Lisses
        </legend>

        {isMortise ? (
          <div className="flex items-start gap-2 rounded-lg border border-terracotta/30 bg-terracotta/5 px-3 py-2 text-sm text-bark">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" aria-hidden="true" />
            <span>
              Poteau à <strong>{mortiseCount} mortaises</strong> : la lisse{" "}
              <strong>{effectiveRailOption?.group.article}</strong> est imposée
              (elle s&apos;emboîte dans les mortaises), soit{" "}
              <strong>{mortiseCount} rangs</strong>.
            </span>
          </div>
        ) : (
          <>
            {railOptions.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {railOptions.map((option, index) => (
                  <button
                    key={`${option.categoryId}-${option.group.article}`}
                    type="button"
                    onClick={() => setRailIndex(index)}
                    className={cn(
                      "inline-flex min-h-9 items-center rounded-full border px-3 py-1.5 text-sm transition-colors cursor-pointer",
                      railIndex === index
                        ? "border-forest bg-forest text-white"
                        : "border-sand-300 bg-white text-bark hover:border-forest/50",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
            <OptionPicker
              label="Nombre de rangs de lisses"
              name="equestre-rail-count"
              value={String(railCountManual)}
              options={RAIL_COUNT_CHOICES.map(String)}
              onChange={(value) => setRailCountManual(Number(value))}
            />
          </>
        )}

        {railCategory && effectiveRailOption && (
          <VariantPicker
            key={`rail-${effectiveRailOption.categoryId}-${effectiveRailOption.group.article}`}
            category={railCategory}
            group={effectiveRailOption.group}
            onResolve={handleRailResolve}
            labelOverrides={{ dimension: "Longueur" }}
          />
        )}
      </fieldset>

      {/* Step 4 — Length */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-forest-dark">
          4. Longueur de la clôture (m)
        </legend>
        <input
          type="number"
          min={0}
          step="any"
          inputMode="decimal"
          placeholder="Ex. 120"
          value={lengthStr}
          onChange={(e) => {
            setLengthStr(e.target.value);
            setConfirmation(null);
          }}
          className="w-full max-w-[12rem] rounded-lg border border-sand-300 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
        />
      </fieldset>

      {/* Estimate */}
      {canSubmit && (
        <div className="rounded-lg bg-sage-soft/50 px-4 py-3 text-sm text-bark">
          <p className="flex items-center gap-1.5 font-medium text-forest-dark">
            <Info className="h-4 w-4" aria-hidden="true" />
            Estimation
          </p>
          <ul className="mt-2 space-y-1">
            <li>
              <strong>{estimate.postCount}</strong> poteaux — {postOption?.label}
              {postSummary && <span className="text-bark-muted"> ({postSummary})</span>}
            </li>
            <li>
              <strong>{estimate.railPieces}</strong> lisses — {effectiveRailOption?.group.article}
              {railSummary && <span className="text-bark-muted"> ({railSummary})</span>}
              {" · "}
              {railCount} rang{railCount > 1 ? "s" : ""}
            </li>
            <li className="text-xs text-bark-muted">
              Espacement des poteaux ≈ {estimate.railLengthM} m (longueur de la lisse) ·{" "}
              {estimate.spans} travées
            </li>
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className={cn(
            "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors",
            canSubmit
              ? "bg-terracotta text-white hover:bg-terracotta-dark cursor-pointer"
              : "cursor-not-allowed bg-sand-300 text-bark-muted",
          )}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {mode === "cart" ? "Ajouter au panier" : "Ajouter à mon projet"}
        </button>
        {confirmation && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-forest">
            <Check className="h-4 w-4" aria-hidden="true" />
            {confirmation}
          </span>
        )}
      </div>

      <p className="text-xs text-bark-muted">
        Estimation indicative, hors quincaillerie et découpes. Le devis final est
        établi après étude.
      </p>
      </>
      )}
    </div>
  );
}

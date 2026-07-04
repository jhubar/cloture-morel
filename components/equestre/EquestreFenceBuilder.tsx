"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check, Info, Lock, Plus } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { getCategoryById } from "@/lib/catalog";
import {
  findMatchingVariant,
  getAvailableValues,
  getVariantAxesForGroup,
  groupCategoryProducts,
  type ProductGroup,
} from "@/lib/product-variants";
import {
  EQUESTRE_ESSENCES,
  RAIL_COUNT_CHOICES,
  RAIL_MAX_LENGTH_CM_FREE,
  RAIL_MAX_LENGTH_CM_MORTISE,
  estimateFence,
  getEssence,
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

function parseDimensionCm(value: string): number {
  const match = value.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

function filterDimensionOptions(options: string[], maxCm?: number): string[] {
  if (maxCm == null) return options;
  return options.filter((opt) => parseDimensionCm(opt) <= maxCm);
}

/** Self-contained variant option picker reporting its resolved product upward. */
function VariantPicker({
  category,
  group,
  onResolve,
  labelOverrides,
  maxDimensionCm,
}: {
  category: Category;
  group: ProductGroup;
  onResolve: (product: Product | null, summary: string) => void;
  /** Override axis labels by key (e.g. rail "dimension" → "Longueur"). */
  labelOverrides?: Record<string, string>;
  /** Cap rail length options (sans mortaise → 600 cm, avec mortaises → 500 cm). */
  maxDimensionCm?: number;
}) {
  const format = category.format;
  const axes = useMemo(
    () => getVariantAxesForGroup(group.variants, format),
    [group, format],
  );

  const axisOptions = useCallback(
    (axisKey: string, sel: Partial<Record<string, string>>) => {
      const raw = getAvailableValues(group.variants, axisKey, sel, format);
      return axisKey === "dimension"
        ? filterDimensionOptions(raw, maxDimensionCm)
        : raw;
    },
    [group, format, maxDimensionCm],
  );

  const buildSelection = useCallback(() => {
    const sel: Record<string, string> = {};
    for (const axis of axes) {
      const av = axisOptions(axis.key, sel);
      if (av[0]) sel[axis.key] = av[0];
    }
    return sel;
  }, [axes, axisOptions]);

  const [selection, setSelection] = useState<Record<string, string>>(buildSelection);

  useEffect(() => {
    setSelection(buildSelection());
  }, [buildSelection]);

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
      const available = axisOptions(axis.key, next);
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
          options={axisOptions(axis.key, selection)}
          onChange={(value) => handleChange(axis.key, value)}
        />
      ))}
    </div>
  );
}

const POINTE_OPTIONS = ["Avec pointes", "Sans pointes"];
const MORTAISE_COUNT_OPTIONS = ["2", "3", "4"];
const MORTAISE_MODE_OPTIONS = ["Sans mortaise", "Avec mortaises"];
// Core (price-defining) post axes resolved from real references, in order.
const POST_CORE_AXES = ["tete", "section", "dimension"] as const;

export interface PostResolve {
  product: Product | null;
  summary: string;
  mortiseCount: number | null;
  /** True when the chosen tête × pointe × mortaises combo has no priced SKU yet. */
  priceTBD: boolean;
}

/**
 * Dedicated post configurator: tête, section, longueur come from real
 * references (cascaded), while "mortaises" and "pointe" are offered as
 * independent choices (the client validated they are orderable in any
 * combination). Combos without a priced reference resolve to the nearest
 * base variant and flag `priceTBD` so the UI can show "tarif à confirmer".
 */
function PostConfigurator({
  category,
  group,
  onResolve,
}: {
  category: Category;
  group: ProductGroup;
  onResolve: (payload: PostResolve) => void;
}) {
  const format = category.format;
  const variants = group.variants;

  const buildCore = useCallback(() => {
    const s: Record<string, string> = {};
    for (const key of POST_CORE_AXES) {
      const av = getAvailableValues(variants, key, s, format);
      if (av[0]) s[key] = av[0];
    }
    return s;
  }, [variants, format]);

  const [core, setCore] = useState<Record<string, string>>(buildCore);
  const [mortaiseMode, setMortaiseMode] = useState("Sans mortaise");
  const [mortaiseCount, setMortaiseCount] = useState("2");
  const [pointe, setPointe] = useState("Avec pointes");

  const mortaise = mortaiseMode === "Sans mortaise" ? "Sans" : mortaiseCount;

  useEffect(() => {
    setCore(buildCore());
    setMortaiseMode("Sans mortaise");
    setMortaiseCount("2");
    setPointe("Avec pointes");
  }, [buildCore]);

  const handleCore = (key: string, value: string) => {
    const next = { ...core, [key]: value };
    const idx = POST_CORE_AXES.indexOf(key as (typeof POST_CORE_AXES)[number]);
    for (let i = idx + 1; i < POST_CORE_AXES.length; i += 1) {
      const axis = POST_CORE_AXES[i];
      const av = getAvailableValues(variants, axis, next, format);
      if (!av.includes(next[axis] ?? "")) next[axis] = av[0] ?? "";
    }
    setCore(next);
  };

  const base = useMemo(
    () => findMatchingVariant(variants, core, format) ?? variants[0] ?? null,
    [variants, core, format],
  );
  const exact = useMemo(
    () =>
      findMatchingVariant(
        variants,
        { ...core, mortaises: mortaise, info: pointe },
        format,
      ),
    [variants, core, mortaise, pointe, format],
  );

  const product = exact ?? base;
  const priceTBD = !exact;
  const mortiseCount = mortaise === "Sans" ? null : Number(mortaise);

  const summary = useMemo(
    () =>
      [
        core.tete,
        core.section,
        core.dimension,
        mortaise === "Sans" ? null : `${mortaise} mortaises`,
        pointe,
      ]
        .filter(Boolean)
        .join(" · "),
    [core, mortaise, pointe],
  );

  useEffect(() => {
    onResolve({ product, summary, mortiseCount, priceTBD });
  }, [product, summary, mortiseCount, priceTBD, onResolve]);

  const teteOptions = getAvailableValues(variants, "tete", {}, format);

  return (
    <div className="space-y-4">
      <OptionPicker
        label="Mortaises"
        name={`equestre-${category.id}-mortaise-mode`}
        value={mortaiseMode}
        options={MORTAISE_MODE_OPTIONS}
        onChange={setMortaiseMode}
      />
      {mortaiseMode === "Avec mortaises" && (
        <OptionPicker
          label="Nombre de mortaises"
          name={`equestre-${category.id}-mortaise-count`}
          value={mortaiseCount}
          options={MORTAISE_COUNT_OPTIONS}
          onChange={setMortaiseCount}
        />
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {teteOptions.length > 1 && (
          <OptionPicker
            label="Tête"
            name={`equestre-${category.id}-tete`}
            value={core.tete ?? null}
            options={teteOptions}
            onChange={(v) => handleCore("tete", v)}
          />
        )}
        <OptionPicker
          label="Section"
          name={`equestre-${category.id}-section`}
          value={core.section ?? null}
          options={getAvailableValues(variants, "section", { tete: core.tete }, format)}
          onChange={(v) => handleCore("section", v)}
        />
        <OptionPicker
          label="Hauteur"
          name={`equestre-${category.id}-dimension`}
          value={core.dimension ?? null}
          options={getAvailableValues(
            variants,
            "dimension",
            { tete: core.tete, section: core.section },
            format,
          )}
          onChange={(v) => handleCore("dimension", v)}
        />
        <OptionPicker
          label="Pointe du pied"
          name={`equestre-${category.id}-pointe`}
          value={pointe}
          options={POINTE_OPTIONS}
          onChange={setPointe}
        />
      </div>
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
  const [postMortiseCount, setPostMortiseCount] = useState<number | null>(null);
  const [postPriceTBD, setPostPriceTBD] = useState(false);
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

  const mortiseCount = postMortiseCount;
  const isMortise = mortiseCount !== null;

  const postPreviewImage = useMemo(() => {
    if (!postOption) return undefined;
    if (isMortise && postOption.imageMortise?.src) return postOption.imageMortise;
    return postOption.image;
  }, [postOption, isMortise]);

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

  const handlePostResolve = useCallback((payload: PostResolve) => {
    setPostProduct(payload.product);
    setPostSummary(payload.summary);
    setPostMortiseCount(payload.mortiseCount);
    setPostPriceTBD(payload.priceTBD);
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
        {postCategory && postOption && (
          <PostConfigurator
            key={`post-${postOption.categoryId}-${postOption.group.article}`}
            category={postCategory}
            group={postOption.group}
            onResolve={handlePostResolve}
          />
        )}
        {postPreviewImage?.src && (
          <figure className="overflow-hidden rounded-card border border-sand-300 bg-sand-50">
            <div className="relative aspect-[4/3] w-full max-w-sm">
              <Image
                src={postPreviewImage.src}
                alt={postPreviewImage.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 384px"
              />
            </div>
          </figure>
        )}
        {postPriceTBD && (
          <p className="flex items-start gap-2 rounded-lg border border-onorder/30 bg-onorder/10 px-3 py-2 text-sm text-bark">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-onorder" aria-hidden="true" />
            <span>
              Cette combinaison est réalisable mais son tarif n&apos;est pas
              encore renseigné : <strong>prix à confirmer</strong> lors de l&apos;étude.
            </span>
          </p>
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
              <strong>{effectiveRailOption?.label}</strong> est imposée
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
            key={`rail-${effectiveRailOption.categoryId}-${effectiveRailOption.group.article}-${isMortise ? "m" : "f"}`}
            category={railCategory}
            group={effectiveRailOption.group}
            onResolve={handleRailResolve}
            labelOverrides={{ dimension: "Longueur" }}
            maxDimensionCm={
              isMortise ? RAIL_MAX_LENGTH_CM_MORTISE : RAIL_MAX_LENGTH_CM_FREE
            }
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
              <strong>{estimate.railPieces}</strong> lisses — {effectiveRailOption?.label}
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

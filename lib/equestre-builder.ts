import { getCategoryById } from "@/lib/catalog";
import { getCategoryImages, type ImageSlot } from "@/lib/assets";
import { groupCategoryProducts, type ProductGroup } from "@/lib/product-variants";
import type { Product } from "@/lib/types";

/**
 * Domain logic for the guided equestrian fence builder.
 *
 * Business rule (validated with the client):
 * - A MORTISE post (details.mortaises = "2" or "3") imposes the rail — the rail
 *   must slot into the mortise — and the number of rails equals the number of
 *   mortises.
 * - A ROUND / flat post (mortaises = "Sans") lets the client surface-fix any
 *   compatible rail of the same wood essence, choosing the number of rails.
 * - Post spacing equals the rail length (rail's `details.dimension`).
 *
 * Products live in photo-aligned leaf categories (see split in
 * doc/scripts/excel_to_md.py); this module partitions them into posts vs rails
 * per wood essence.
 */

export type EssenceKey = "acacia" | "nobifix" | "bois-exotique";

/** An explicit post choice: a specific article within a leaf category. */
export interface PostOptionDef {
  categoryId: string;
  article: string;
  /** Display label (defaults to the article name). */
  label?: string;
  /**
   * When true, only keep mortise variants (drops the "Sans" / flat-head ones).
   * Used for the "tête diamant avec mortaises" post which is mortise-only.
   */
  mortiseOnly?: boolean;
  /**
   * Photo number (matching the file in the category gallery) shown as a preview
   * to help the buyer identify the post type.
   */
  previewImage?: number;
}

export interface EssenceConfig {
  key: EssenceKey;
  label: string;
  /** subParent id used in the catalogue tree. */
  subParent: string;
  /** Explicit list of post choices offered for this essence. */
  postOptions: PostOptionDef[];
  railCategoryIds: string[];
  /** Rail category imposed when a mortise post is selected. */
  mortiseRailCategoryId: string;
}

export const EQUESTRE_ESSENCES: EssenceConfig[] = [
  {
    key: "acacia",
    label: "Robinier faux acacia",
    subParent: "post-and-rail-en-robiniers-faux-acacia",
    postOptions: [
      {
        categoryId: "post-and-rail-poteaux",
        article: "Poteaux rectangulaires",
        previewImage: 5,
      },
    ],
    railCategoryIds: ["post-and-rail-lisses-fendues"],
    mortiseRailCategoryId: "post-and-rail-lisses-fendues",
  },
  {
    key: "nobifix",
    label: "Pin traité Nobifix",
    subParent: "pin-traite-nobifix",
    postOptions: [
      {
        categoryId: "nobifix-poteaux-carres",
        article: "Poteaux carrés",
        label: "Poteaux carrés tête diamant avec mortaises",
        mortiseOnly: true,
        previewImage: 1,
      },
      {
        categoryId: "nobifix-poteaux-ronds",
        article: "Poteaux ronds fraisés",
        label: "Poteaux",
        previewImage: 1,
      },
    ],
    railCategoryIds: ["nobifix-lisses", "nobifix-demi-rondins", "nobifix-autres"],
    mortiseRailCategoryId: "nobifix-lisses",
  },
  {
    key: "bois-exotique",
    label: "Bois exotique",
    subParent: "bois-exotique",
    postOptions: [{ categoryId: "bois-exotique-poteaux", article: "Poteaux" }],
    railCategoryIds: [
      "bois-exotique-lisses-en-bois-exotique",
      "bois-exotique-lisses-en-bois-autoclavees-classe-4",
    ],
    mortiseRailCategoryId: "bois-exotique-lisses-en-bois-exotique",
  },
];

export function getEssence(key: string): EssenceConfig | undefined {
  return EQUESTRE_ESSENCES.find((e) => e.key === key);
}

/** A selectable post or rail: one article group within a leaf category. */
export interface PartOption {
  categoryId: string;
  categoryTitle: string;
  /** Display label (post label override, or the article name). */
  label: string;
  group: ProductGroup;
  /** Optional preview photo to help identify the option. */
  image?: ImageSlot;
}

/** Post choices for an essence, resolved to real product groups (skips empties). */
export function getPostOptions(essence: EssenceConfig): PartOption[] {
  const result: PartOption[] = [];
  for (const def of essence.postOptions) {
    const category = getCategoryById(def.categoryId);
    if (!category || category.products.length === 0) continue;
    const found = groupCategoryProducts(category).find(
      (g) => g.article === def.article,
    );
    if (!found) continue;
    const variants = def.mortiseOnly
      ? found.variants.filter((v) => getMortiseCount(v) !== null)
      : found.variants;
    if (variants.length === 0) continue;
    const image =
      def.previewImage != null
        ? getCategoryImages(def.categoryId).find((s) =>
            s.src?.endsWith(`/${def.previewImage}.webp`),
          )
        : undefined;
    result.push({
      categoryId: def.categoryId,
      categoryTitle: category.title,
      label: def.label ?? found.article,
      group: { ...found, variants },
      image,
    });
  }
  return result;
}

/** Rail choices for an essence: every article group in its rail categories. */
export function getRailOptions(essence: EssenceConfig): PartOption[] {
  const result: PartOption[] = [];
  for (const id of essence.railCategoryIds) {
    const category = getCategoryById(id);
    if (!category || category.products.length === 0) continue;
    for (const group of groupCategoryProducts(category)) {
      result.push({
        categoryId: id,
        categoryTitle: category.title,
        label: group.article,
        group,
      });
    }
  }
  return result;
}

/** True when the essence has at least one post and one rail with products. */
export function isEssenceAvailable(essence: EssenceConfig): boolean {
  return getPostOptions(essence).length > 0 && getRailOptions(essence).length > 0;
}

/** Number of mortises on a post variant, or null for round/flat posts. */
export function getMortiseCount(post: Product | null | undefined): number | null {
  const raw = post?.details?.mortaises;
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isNaN(n) ? null : n;
}

export function postHasMortise(post: Product | null | undefined): boolean {
  return getMortiseCount(post) !== null;
}

/** Parse a "300 cm" dimension into metres (3). Null when unparseable. */
export function parseDimensionMetres(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = value.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return null;
  const cm = Number.parseFloat(match[1].replace(",", "."));
  return Number.isFinite(cm) ? cm / 100 : null;
}

export interface FenceEstimate {
  /** Rail length in metres (= post spacing). */
  railLengthM: number | null;
  /** Number of bays between posts. */
  spans: number | null;
  /** Estimated number of posts (spans + 1). */
  postCount: number | null;
  /** Estimated number of rail pieces (spans × railCount). */
  railPieces: number | null;
}

/** Estimate posts and rails for a fence length. Spacing = rail length. */
export function estimateFence(
  lengthM: number,
  rail: Product | null,
  railCount: number,
): FenceEstimate {
  const railLengthM = parseDimensionMetres(rail?.details?.dimension);
  if (!lengthM || lengthM <= 0 || !railLengthM || railLengthM <= 0) {
    return { railLengthM, spans: null, postCount: null, railPieces: null };
  }
  const spans = Math.ceil(lengthM / railLengthM);
  return {
    railLengthM,
    spans,
    postCount: spans + 1,
    railPieces: spans * Math.max(1, railCount),
  };
}

/** Allowed rail-count choices for a round/flat post. */
export const RAIL_COUNT_CHOICES = [2, 3, 4, 5];

/** Resolved selection produced by the builder. */
export interface EquestreSelectionPart {
  product: Product;
  categoryId: string;
  categoryTitle: string;
  article: string;
  summary: string;
}

export interface EquestreBuildResult {
  essence: EssenceConfig;
  post: EquestreSelectionPart;
  rail: EquestreSelectionPart;
  railCount: number;
  lengthM: number;
  estimate: FenceEstimate;
}

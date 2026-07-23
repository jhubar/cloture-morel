import { getCategoryById } from "@/lib/catalog";
import { getCategoryImages, type ImageSlot } from "@/lib/assets";
import {
  buildPiquetRoundMortisedVariants,
  buildPiquetRoundSansMortaiseVariants,
  isPiquetRoundVariant,
} from "@/lib/piquet-dimensions";
import { groupCategoryProducts, type ProductGroup } from "@/lib/product-variants";
import type { Category, Product } from "@/lib/types";

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
   * Photo number (matching the file in the category gallery) shown as a preview
   * to help the buyer identify the post type.
   */
  previewImage?: number;
  /** Preview when mortaises are selected (public /images/... path). */
  mortisePreviewSrc?: string;
  /** Fixed tête / section when the post has mortaises (Nobifix carrés: Diamant, 12×12). */
  mortisedConstraints?: { tete?: string; section?: string };
  /** Mortise count choices for this post type (defaults to 2/3/4). Acacia ronds: 2/3 only. */
  mortaiseCountOptions?: string[];
  /** Fixed post height per mortise count when mortaises are selected. */
  dimensionByMortiseCount?: Record<string, string>;
  /** Supplements catalogue variants with validation stubs (price TBD combos). */
  validationStub?: "round" | "square" | "exotic";
  /** Head style choice driving mortise rules (acacia: biseautée → mortaises 10×15). */
  headStyleRules?: { options: HeadStyleRule[] };
}

export interface HeadStyleRule {
  id: string;
  label: string;
  /** Catalogue axis value (e.g. "30°" = biseautée, "Plate" = plate). */
  tete: string;
  /** Hides « Sans mortaise » and forces mortaises. */
  requiresMortises?: boolean;
  /** Hides « Avec mortaises » and forces sans mortaise. */
  sansMortaiseOnly?: boolean;
  mortaiseCountOptions?: string[];
  mortisedConstraints?: { tete?: string; section?: string };
  /** Fixed post height per mortise count (acacia biseautée: 2 → 200 cm, 3 → 225 cm). */
  dimensionByMortiseCount?: Record<string, string>;
}

/** Validation-only rail line before Excel references exist. */
export interface ValidationRailDef {
  categoryId: string;
  categoryTitle: string;
  article: string;
  label: string;
  dimensions: string[];
  sections?: string[];
}

export interface EssenceConfig {
  key: EssenceKey;
  label: string;
  /** subParent id used in the catalogue tree. */
  subParent: string;
  /** Explicit list of post choices offered for this essence. */
  postOptions: PostOptionDef[];
  railCategoryIds: string[];
  /** Rail category imposed when a mortise post is selected (fallback). */
  mortiseRailCategoryId: string;
  /** Rail categories compatible with mortised posts (subset of railCategoryIds). */
  mortiseRailCategoryIds?: string[];
  /** Mortaise count choices (defaults to 2/3). */
  mortaiseCountOptions?: string[];
  /** When true, only mortised posts are offered (no "Sans mortaise" path). */
  mortisePostsOnly?: boolean;
  /** Rail articles hidden when the post has no mortaises (e.g. Nobifix sans mortaise). */
  nonMortiseExcludedRailArticles?: string[];
  /** Rail categories offered only when the post has no mortaises (whitelist). */
  nonMortiseRailCategoryIds?: string[];
  /** Per-article rail length filter in cm (e.g. lisses 250/300 for bois exotique). */
  railLengthFilterByArticle?: Record<string, number[]>;
  /** Per-article display labels for rails in this essence. */
  railLabelOverrides?: Record<string, string>;
  /** Rails synthesized when the catalogue leaf is still empty. */
  validationRails?: ValidationRailDef[];
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
        label: "Poteaux carrés",
        previewImage: 5,
        validationStub: "square",
        headStyleRules: {
          options: [
            {
              id: "biseautee",
              label: "Tête biseautée",
              tete: "30°",
              requiresMortises: true,
              mortaiseCountOptions: ["2", "3"],
              mortisedConstraints: { tete: "30°", section: "10 x 15 cm" },
              dimensionByMortiseCount: { "2": "200 cm", "3": "225 cm" },
            },
            {
              id: "plate",
              label: "Tête plate",
              tete: "Plate",
              sansMortaiseOnly: true,
            },
          ],
        },
      },
      {
        categoryId: "post-and-rail-poteaux-ronds",
        article: "Poteaux ronds",
        label: "Poteaux ronds",
        previewImage: 1,
        validationStub: "round",
        mortisePreviewSrc:
          "/images/site/realisations-de-clotures-par-clotures-et-travaux-morel-photos-a-fournir/19.webp",
        mortaiseCountOptions: ["2", "3"],
        mortisedConstraints: { section: "12/14 cm" },
        dimensionByMortiseCount: { "2": "200 cm", "3": "225 cm" },
      },
    ],
    railCategoryIds: [
      "post-and-rail-lisses-fendues",
      "nobifix-lisses",
      "nobifix-demi-rondins",
      "acacia-equestre-planches",
    ],
    mortiseRailCategoryId: "post-and-rail-lisses-fendues",
    mortiseRailCategoryIds: ["post-and-rail-lisses-fendues", "nobifix-lisses"],
    nonMortiseRailCategoryIds: [
      "nobifix-lisses",
      "nobifix-demi-rondins",
      "acacia-equestre-planches",
    ],
    railLabelOverrides: {
      "Lisses rectangulaires": "Rails Nobifix",
      "Demi rondins": "Demi-rondins Nobifix",
      "Planches acacia": "Planches acacia",
    },
    railLengthFilterByArticle: {
      "Planches acacia": [250, 300],
    },
    validationRails: [
      {
        categoryId: "acacia-equestre-planches",
        categoryTitle: "Planches acacia",
        article: "Planches acacia",
        label: "Planches acacia",
        dimensions: ["250 cm", "300 cm"],
        sections: ["4 x 25 cm"],
      },
      {
        categoryId: "nobifix-lisses",
        categoryTitle: "Rails Nobifix",
        article: "Lisses rectangulaires",
        label: "Rails Nobifix",
        dimensions: ["250 cm", "300 cm", "500 cm", "600 cm"],
        sections: ["4 x 12 cm"],
      },
      {
        categoryId: "nobifix-demi-rondins",
        categoryTitle: "Demi-rondins Nobifix",
        article: "Demi rondins",
        label: "Demi-rondins Nobifix",
        dimensions: ["250 cm", "300 cm", "500 cm", "600 cm"],
        sections: ["10 cm", "12 cm"],
      },
    ],
  },
  {
    key: "nobifix",
    label: "Pin traité Nobifix",
    subParent: "pin-traite-nobifix",
    postOptions: [
      {
        categoryId: "nobifix-poteaux-carres",
        article: "Poteaux carrés",
        label: "Poteaux carrés",
        previewImage: 1,
        mortisedConstraints: { tete: "Diamant", section: "12 x 12 cm" },
        mortaiseCountOptions: ["2", "3"],
      },
      {
        categoryId: "nobifix-poteaux-ronds",
        article: "Poteaux ronds fraisés",
        label: "Poteaux ronds",
        previewImage: 1,
        validationStub: "round",
        mortisePreviewSrc:
          "/images/site/realisations-de-clotures-par-clotures-et-travaux-morel-photos-a-fournir/19.webp",
      },
    ],
    railCategoryIds: ["nobifix-lisses", "nobifix-demi-rondins", "nobifix-autres"],
    mortiseRailCategoryId: "nobifix-lisses",
    mortiseRailCategoryIds: ["nobifix-lisses"],
    mortaiseCountOptions: ["2", "3"],
    nonMortiseRailCategoryIds: ["nobifix-lisses", "nobifix-demi-rondins"],
    railLabelOverrides: {
      "Lisses rectangulaires": "Rails Nobifix",
      "Demi rondins": "Demi-rondins Nobifix",
    },
    nonMortiseExcludedRailArticles: ["Rondins fraisés"],
  },
  {
    key: "bois-exotique",
    label: "Bois exotique",
    subParent: "bois-exotique",
    postOptions: [
      {
        categoryId: "bois-exotique-poteaux",
        article: "Poteaux carrés",
        label: "Poteaux carrés",
        validationStub: "exotic",
        previewImage: 1,
      },
    ],
    mortisePostsOnly: true,
    mortiseRailCategoryIds: [
      "bois-exotique-lisses-en-bois-exotique",
      "bois-exotique-lisses-en-bois-autoclavees-classe-4",
    ],
    mortiseRailCategoryId: "bois-exotique-lisses-en-bois-exotique",
    mortaiseCountOptions: ["2", "3"],
    railCategoryIds: [
      "bois-exotique-lisses-en-bois-exotique",
      "bois-exotique-lisses-en-bois-autoclavees-classe-4",
    ],
    railLengthFilterByArticle: {
      "Lisses en bois exotique": [250, 300],
      "Lisses autoclavées classe IV": [250, 300],
    },
    validationRails: [
      {
        categoryId: "bois-exotique-lisses-en-bois-exotique",
        categoryTitle: "Lisses en bois exotique",
        article: "Lisses en bois exotique",
        label: "Lisses en bois exotique",
        dimensions: ["250 cm", "300 cm"],
        sections: ["4 x 12 cm"],
      },
      {
        categoryId: "bois-exotique-lisses-en-bois-autoclavees-classe-4",
        categoryTitle: "Lisses autoclavées classe IV",
        article: "Lisses autoclavées classe IV",
        label: "Lisses autoclavées classe IV",
        dimensions: ["250 cm", "300 cm"],
        sections: ["4 x 12 cm"],
      },
    ],
  },
];

export function getEssence(key: string): EssenceConfig | undefined {
  return EQUESTRE_ESSENCES.find((e) => e.key === key);
}

/** Rail categories offered when the post has mortaises. */
export function getMortiseRailCategoryIds(essence: EssenceConfig): string[] {
  return essence.mortiseRailCategoryIds ?? [essence.mortiseRailCategoryId];
}

/** Rails offered in the builder for the current post mortise state. */
export function getSelectableRailOptions(
  essence: EssenceConfig,
  railOptions: PartOption[],
  { isMortise, forcesMortisePosts = false }: { isMortise: boolean; forcesMortisePosts?: boolean },
): PartOption[] {
  if (isMortise || forcesMortisePosts) {
    const mortiseIds = getMortiseRailCategoryIds(essence);
    return railOptions.filter((o) => mortiseIds.includes(o.categoryId));
  }
  if (essence.nonMortiseRailCategoryIds?.length) {
    const ids = essence.nonMortiseRailCategoryIds;
    return railOptions.filter((o) => ids.includes(o.categoryId));
  }
  const excluded = essence.nonMortiseExcludedRailArticles ?? [];
  if (excluded.length === 0) return railOptions;
  return railOptions.filter((o) => !excluded.includes(o.group.article));
}

function parseDimensionCm(value: string): number {
  const match = value.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

/** Articles excluded from the guided builder rail picker (still in catalogue). */
const BUILDER_EXCLUDED_RAIL_ARTICLES = new Set(["Planches"]);

/** Default display labels for rail articles in the guided builder. */
const RAIL_LABEL_OVERRIDES: Record<string, string> = {
  "Lisses rectangulaires": "Rails",
  "Rondins fraisés": "Lisses rondes fraisées",
};

function filterGroupByRailLength(
  group: ProductGroup,
  allowedCm: number[] | undefined,
): ProductGroup {
  if (!allowedCm?.length) return group;
  const variants = group.variants.filter((v) => {
    const cm = parseDimensionCm(v.details?.dimension ?? "");
    return cm === 0 || allowedCm.includes(cm);
  });
  return variants.length > 0 ? { ...group, variants } : { ...group, variants: [] };
}

function railLabelFor(
  essence: EssenceConfig,
  article: string,
  fallback: string,
): string {
  return (
    essence.railLabelOverrides?.[article] ??
    RAIL_LABEL_OVERRIDES[article] ??
    fallback
  );
}

function createRailValidationOption(
  def: ValidationRailDef,
  essence: EssenceConfig,
): PartOption {
  const sections = def.sections ?? ["—"];
  const variants: Product[] = sections.flatMap((section) =>
    def.dimensions.map((dimension) => ({
      id: `validation-rail-${def.categoryId}-${section}-${dimension}`,
      label: `${def.label} — ${section} — ${dimension}`,
      article: def.article,
      reference: section !== "—" ? section : dimension,
      prixUnitaireHTVA: 0,
      disponibilite: "Sur commande",
      details: {
        ...(section !== "—" ? { section } : {}),
        dimension,
      },
    })),
  );
  return {
    categoryId: def.categoryId,
    categoryTitle: def.categoryTitle,
    label: def.label,
    group: { article: def.article, variants },
  };
}

/** Category for a rail option (real leaf or synthetic validation stub). */
export function resolveRailCategory(
  option: PartOption,
  essence: EssenceConfig,
): Category {
  const existing = getCategoryById(option.categoryId);
  if (existing && existing.products.length > 0) return existing;
  return {
    id: option.categoryId,
    title: option.categoryTitle,
    parent: "cloture-equestre",
    parentTitle: "Clôture équestre",
    subParent: essence.subParent,
    subParentTitle: essence.label,
    format: "equestre",
    dualPricing: false,
    notes: [],
    products: option.group.variants,
  };
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
  /** Preview when the post is configured with mortaises. */
  imageMortise?: ImageSlot;
  /** Fixed tête / section when the post has mortaises. */
  mortisedConstraints?: { tete?: string; section?: string };
  headStyleRules?: { options: HeadStyleRule[] };
  mortaiseCountOptions?: string[];
  dimensionByMortiseCount?: Record<string, string>;
  /** Round posts use piquet bois longueur × diamètre schema in the configurator. */
  usesPiquetDimensions?: boolean;
}

/** Stub variants for client validation before Excel references exist. */
function createPostValidationStub(
  article: string,
  profile: "round" | "square" | "exotic",
): ProductGroup {
  const variants: Product[] = [];
  const add = (
    section: string,
    dimension: string,
    tete: string,
    mortaises: string,
    info: string,
  ) => {
    variants.push({
      id: `validation-${article}-${section}-${dimension}-${mortaises}-${info}`,
      label: `${article} — ${section} — ${dimension}`,
      article,
      reference: section,
      prixUnitaireHTVA: 0,
      disponibilite: "Sur commande",
      details: { section, dimension, tete, mortaises, info },
    });
  };

  if (profile === "exotic") {
    const sections = ["10 x 10 cm", "11.5 x 11.5 cm"];
    for (const section of sections) {
      for (const dimension of ["200 cm", "220 cm"]) {
        for (const mort of ["2", "3"]) {
          add(section, dimension, "Diamant", mort, "Avec pointes");
        }
      }
    }
    return { article, variants };
  }

  if (profile === "square") {
    const sectionsSans = ["10 x 10 cm", "10 x 15 cm", "12 x 12 cm"];
    const dimensionsSans = ["180 cm", "200 cm", "225 cm", "250 cm"];
    for (const section of sectionsSans) {
      for (const dimension of dimensionsSans) {
        add(section, dimension, "Plate", "Sans", "Avec pointes");
      }
    }
    add("10 x 15 cm", "200 cm", "30°", "2", "Avec pointes");
    add("10 x 15 cm", "225 cm", "30°", "3", "Avec pointes");
    return { article, variants };
  }

  return createRoundPostValidationStub(article);
}

function createRoundPostValidationStub(article: string): ProductGroup {
  return {
    article,
    variants: [
      ...buildPiquetRoundSansMortaiseVariants({ article }),
      ...buildPiquetRoundMortisedVariants({ article }),
    ],
  };
}

/** Category for a post option (real leaf or synthetic for validation stubs). */
export function resolvePostCategory(
  option: PartOption,
  essence: EssenceConfig,
): Category {
  const existing = getCategoryById(option.categoryId);
  if (existing && existing.products.length > 0) return existing;
  return {
    id: option.categoryId,
    title: option.categoryTitle,
    parent: "cloture-equestre",
    parentTitle: "Clôture équestre",
    subParent: essence.subParent,
    subParentTitle: essence.label,
    format: "equestre",
    dualPricing: false,
    notes: [],
    products: option.group.variants,
  };
}

/** Merge catalogue variants with validation stubs (catalogue SKUs win on duplicate details). */
function mergeValidationVariants(group: ProductGroup, stub: ProductGroup): ProductGroup {
  const key = (v: Product) => JSON.stringify(v.details ?? {});
  const seen = new Set(group.variants.map(key));
  const extra = stub.variants.filter((v) => !seen.has(key(v)));
  return { ...group, variants: [...group.variants, ...extra] };
}

function filterGroupByMortiseCount(
  group: ProductGroup,
  allowedCounts: string[] | undefined,
): ProductGroup {
  if (!allowedCounts?.length) return group;
  const allowed = new Set(allowedCounts);
  const variants = group.variants.filter((v) => {
    const mortaises = v.details?.mortaises;
    if (!mortaises || mortaises === "Sans") return true;
    return allowed.has(mortaises);
  });
  return variants.length > 0 ? { ...group, variants } : group;
}

/** Post choices for an essence, resolved to real product groups (skips empties). */
export function getPostOptions(essence: EssenceConfig): PartOption[] {
  const result: PartOption[] = [];
  for (const def of essence.postOptions) {
    const category = getCategoryById(def.categoryId);
    let group = category
      ? groupCategoryProducts(category).find((g) => g.article === def.article)
      : undefined;

    if (!group && def.validationStub) {
      group = createPostValidationStub(
        def.label ?? def.article,
        def.validationStub,
      );
    } else if (group && def.validationStub === "round") {
      const stub = createPostValidationStub(def.label ?? def.article, "round");
      const catalogMatches = {
        ...group,
        variants: group.variants.filter(isPiquetRoundVariant),
      };
      group = mergeValidationVariants(catalogMatches, stub);
    } else if (group && def.validationStub) {
      const stub = createPostValidationStub(def.label ?? def.article, def.validationStub);
      group = mergeValidationVariants(group, stub);
    }

    if (!group) continue;

    const allowedMortises = def.mortaiseCountOptions ?? essence.mortaiseCountOptions;
    group = filterGroupByMortiseCount(group, allowedMortises);

    const categoryTitle =
      category?.title ?? def.label ?? group.article;
    const image =
      def.previewImage != null
        ? getCategoryImages(def.categoryId).find((s) =>
            s.src?.endsWith(`/${def.previewImage}.webp`),
          ) ??
          getCategoryImages("post-and-rail-poteaux").find((s) =>
            s.src?.endsWith(`/${def.previewImage}.webp`),
          )
        : undefined;
    const imageMortise = def.mortisePreviewSrc
      ? {
          src: def.mortisePreviewSrc,
          alt: `${def.label ?? group.article} avec mortaises`,
          hint: def.mortisePreviewSrc,
        }
      : undefined;
    result.push({
      categoryId: def.categoryId,
      categoryTitle,
      label: def.label ?? group.article,
      group,
      image,
      imageMortise,
      mortisedConstraints: def.mortisedConstraints,
      headStyleRules: def.headStyleRules,
      mortaiseCountOptions: def.mortaiseCountOptions,
      dimensionByMortiseCount: def.dimensionByMortiseCount,
      usesPiquetDimensions: def.validationStub === "round",
    });
  }
  return result;
}

/** Rail choices for an essence: every article group in its rail categories. */
export function getRailOptions(essence: EssenceConfig): PartOption[] {
  const result: PartOption[] = [];
  const seen = new Set<string>();

  const push = (option: PartOption) => {
    const key = `${option.categoryId}-${option.group.article}`;
    if (seen.has(key)) return;
    seen.add(key);
    result.push(option);
  };

  for (const id of essence.railCategoryIds) {
    const category = getCategoryById(id);
    let addedFromCatalog = false;

    if (category?.products.length) {
      for (const group of groupCategoryProducts(category)) {
        if (BUILDER_EXCLUDED_RAIL_ARTICLES.has(group.article)) continue;
        const filtered = filterGroupByRailLength(
          group,
          essence.railLengthFilterByArticle?.[group.article],
        );
        if (filtered.variants.length === 0) continue;
        push({
          categoryId: id,
          categoryTitle: category.title,
          label: railLabelFor(essence, group.article, group.article),
          group: filtered,
        });
        addedFromCatalog = true;
      }
    }

    if (!addedFromCatalog && essence.validationRails) {
      for (const def of essence.validationRails) {
        if (def.categoryId !== id) continue;
        push(createRailValidationOption(def, essence));
      }
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

/** Max rail length (cm) when the post has mortaises (rectangular rails only). */
export const RAIL_MAX_LENGTH_CM_MORTISE = 500;
/** Max rail length (cm) when the post has no mortaises. */
export const RAIL_MAX_LENGTH_CM_FREE = 600;

/** Mortised posts: longer rails allowed for specific articles (Rails Nobifix 4×12). */
const RAIL_MORTISE_MAX_LENGTH_CM_BY_ARTICLE: Record<string, number> = {
  "Lisses rectangulaires": 600,
};

export function getRailMaxLengthCm(
  isMortise: boolean,
  railArticle: string | undefined,
): number {
  if (!isMortise) return RAIL_MAX_LENGTH_CM_FREE;
  return RAIL_MORTISE_MAX_LENGTH_CM_BY_ARTICLE[railArticle ?? ""] ?? RAIL_MAX_LENGTH_CM_MORTISE;
}


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

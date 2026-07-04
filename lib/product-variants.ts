import type { Category, Product } from "@/lib/types";

export interface VariantAxis {
  key: string;
  label: string;
}

export interface ProductGroup {
  article: string;
  variants: Product[];
}

const EQUESTRE_AXES: VariantAxis[] = [
  { key: "section", label: "Section" },
  { key: "dimension", label: "Hauteur" },
  { key: "tete", label: "Tête" },
  { key: "mortaises", label: "Mortaises" },
  { key: "info", label: "Pointes" },
];

const POTEAUX_BARRIERE_AXES: VariantAxis[] = [
  { key: "reference", label: "Hauteur barrière" },
  { key: "modele", label: "Modèle" },
];

const PALETTE_AXES: VariantAxis[] = [
  { key: "longueur", label: "Longueur" },
  { key: "diametre", label: "Diamètre" },
];

const FORMAT_CANDIDATE_AXES: Record<string, VariantAxis[]> = {
  equestre: EQUESTRE_AXES,
  poteaux_barriere: POTEAUX_BARRIERE_AXES,
  palette: PALETTE_AXES,
  grillage: [{ key: "reference", label: "Modèle" }],
  brandes: [{ key: "reference", label: "Hauteur" }],
  ganivelles: [
    { key: "reference", label: "Hauteur / type" },
    { key: "taille_rouleau", label: "Format" },
  ],
  standard_note: [{ key: "reference", label: "Dimension" }],
  quincaillerie_simple: [{ key: "reference", label: "Article" }],
  outillage: [{ key: "reference", label: "Modèle" }],
};

const FALLBACK_REFERENCE_LABELS: Record<string, string> = {
  grillage: "Modèle",
  brandes: "Hauteur",
  standard_note: "Dimension",
  quincaillerie_simple: "Article",
  outillage: "Modèle",
  palette: "Référence",
  ganivelles: "Option",
};

const GROUPABLE_FORMATS = new Set([
  "equestre",
  "poteaux_barriere",
  "palette",
  "grillage",
  "brandes",
  "ganivelles",
  "standard_note",
  "quincaillerie_simple",
  "outillage",
]);

export function supportsVariantGrouping(format: string): boolean {
  return GROUPABLE_FORMATS.has(format);
}

/** @deprecated Prefer getVariantAxesForGroup — kept for tests / legacy callers */
export function getVariantAxes(format: string): VariantAxis[] {
  return FORMAT_CANDIDATE_AXES[format] ?? [];
}

function parsePiquetReference(reference: string): { longueur: string; diametre: string } | null {
  const match = reference.trim().match(/^(\d+\s*cm)\s+diamètre\s+(.+)$/i);
  if (!match) return null;
  return { longueur: match[1], diametre: match[2] };
}

/** Only axes that actually differ within this product group. */
export function getVariantAxesForGroup(
  variants: Product[],
  format: string,
): VariantAxis[] {
  const candidates = FORMAT_CANDIDATE_AXES[format] ?? [
    { key: "reference", label: FALLBACK_REFERENCE_LABELS[format] ?? "Référence" },
  ];

  const axes = candidates.filter((axis) => {
    const values = new Set(
      variants
        .map((variant) => getVariantAttribute(variant, axis.key, format))
        .filter((value): value is string => Boolean(value)),
    );
    return values.size > 1;
  });

  if (axes.length === 0 && variants.length > 1) {
    return [
      {
        key: "reference",
        label: FALLBACK_REFERENCE_LABELS[format] ?? "Référence",
      },
    ];
  }

  return axes;
}

export function groupCategoryProducts(category: Category): ProductGroup[] {
  if (!supportsVariantGrouping(category.format)) {
    return category.products.map((product) => ({
      article: product.article,
      variants: [product],
    }));
  }

  const byArticle = new Map<string, Product[]>();
  for (const product of category.products) {
    const key = product.article?.trim() || product.label;
    const list = byArticle.get(key) ?? [];
    list.push(product);
    byArticle.set(key, list);
  }

  return [...byArticle.entries()].map(([article, variants]) => ({
    article,
    variants,
  }));
}

export function getVariantAttribute(
  product: Product,
  key: string,
  format: string,
): string | null {
  if (format === "palette" && (key === "longueur" || key === "diametre")) {
    const parsed = parsePiquetReference(product.reference ?? "");
    if (!parsed) return null;
    return key === "longueur" ? parsed.longueur : parsed.diametre;
  }

  if (key === "reference") {
    return product.reference?.trim() || null;
  }

  const value = product.details?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function parseCmValue(value: string): number | null {
  const match = value.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : null;
}

function sortValues(key: string, values: string[]): string[] {
  const unique = [...new Set(values)];

  if (key === "dimension" || key === "longueur" || key === "diametre") {
    return unique.sort((a, b) => {
      const na = parseCmValue(a);
      const nb = parseCmValue(b);
      if (na !== null && nb !== null) return na - nb;
      return a.localeCompare(b, "fr");
    });
  }

  if (key === "reference" && unique.some((value) => /^H\./i.test(value))) {
    return unique.sort((a, b) => {
      const na = parseCmValue(a);
      const nb = parseCmValue(b);
      if (na !== null && nb !== null) return na - nb;
      return a.localeCompare(b, "fr");
    });
  }

  if (key === "mortaises") {
    const order = ["Sans", "2", "3", "4"];
    return unique.sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia >= 0 && ib >= 0) return ia - ib;
      if (ia >= 0) return -1;
      if (ib >= 0) return 1;
      return a.localeCompare(b, "fr");
    });
  }

  return unique.sort((a, b) => a.localeCompare(b, "fr"));
}

export function getAvailableValues(
  variants: Product[],
  axisKey: string,
  selection: Partial<Record<string, string>>,
  format: string,
): string[] {
  const filtered = variants.filter((variant) =>
    Object.entries(selection).every(([key, value]) => {
      if (!value || key === axisKey) return true;
      return getVariantAttribute(variant, key, format) === value;
    }),
  );

  const values = filtered
    .map((variant) => getVariantAttribute(variant, axisKey, format))
    .filter((value): value is string => Boolean(value));

  return sortValues(axisKey, values);
}

export function findMatchingVariant(
  variants: Product[],
  selection: Record<string, string>,
  format: string,
): Product | null {
  const activeKeys = Object.keys(selection).filter((key) => selection[key]);

  return (
    variants.find((variant) =>
      activeKeys.every(
        (key) => getVariantAttribute(variant, key, format) === selection[key],
      ),
    ) ?? null
  );
}

export function buildDefaultSelection(
  variants: Product[],
  format: string,
): Record<string, string> {
  const axes = getVariantAxesForGroup(variants, format);
  const selection: Record<string, string> = {};

  for (const axis of axes) {
    const available = getAvailableValues(variants, axis.key, selection, format);
    if (available[0]) selection[axis.key] = available[0];
  }

  return selection;
}

export function buildVariantLabel(
  article: string,
  selection: Record<string, string>,
  format: string,
  variants: Product[],
): string {
  const axes = getVariantAxesForGroup(variants, format);
  const parts = [article];
  for (const axis of axes) {
    const value = selection[axis.key];
    if (value) parts.push(value);
  }
  return parts.join(" — ");
}

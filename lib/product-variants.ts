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

function parseNumericSegment(segment: string): number | null {
  const normalized = segment.trim().replace(",", ".");
  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) ? n : null;
}

/** Grillage model codes like 8/80/15 or 13/122/7,5 — sort by each segment numerically. */
function parseSlashModel(value: string): number[] | null {
  const parts = value.trim().split("/").map(parseNumericSegment);
  if (parts.length < 2 || parts.some((n) => n === null)) return null;
  return parts as number[];
}

function compareSlashModels(a: string, b: string): number {
  const pa = parseSlashModel(a);
  const pb = parseSlashModel(b);
  if (!pa || !pb) return a.localeCompare(b, "fr");

  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** Low tensile before high tensile (e.g. fil galvanisé Morel Wire). */
function compareTensileReferences(a: string, b: string): number {
  const aIsLow = /low\s*tensile/i.test(a);
  const bIsLow = /low\s*tensile/i.test(b);
  if (aIsLow !== bIsLow) return aIsLow ? -1 : 1;
  return a.localeCompare(b, "fr", { sensitivity: "base" });
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

  if (key === "reference" && unique.some((value) => /^\d+\/\d+/.test(value))) {
    return unique.sort(compareSlashModels);
  }

  if (key === "reference" && unique.some((value) => /tensile/i.test(value))) {
    return unique.sort(compareTensileReferences);
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

  // Clameuse Stockade : machine avant consommables
  if (
    key === "reference" &&
    unique.some((v) => /stockade st315i/i.test(v)) &&
    unique.some((v) => /consommable st 315i/i.test(v))
  ) {
    const order = (value: string): number => {
      if (/stockade st315i/i.test(value)) return 0;
      if (/consommable st 315i/i.test(value)) return 1;
      return 2;
    };
    return unique.sort((a, b) => {
      const diff = order(a) - order(b);
      if (diff !== 0) return diff;
      return a.localeCompare(b, "fr");
    });
  }

  // Gripple : medium → T-clip → Barbed → pince de tension
  if (
    key === "reference" &&
    unique.some((v) => /gripple plus m/i.test(v) || /gripple t-clip/i.test(v))
  ) {
    const order = [
      "Gripple plus médium",
      "Gripple T-clip 1",
      "Gripple Barbed",
      "Pince de tension métallique",
    ];
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

import { getCategoryById } from "@/lib/catalog";
import { getFamilyById } from "@/lib/families";
import {
  getVariantAxesForGroup,
  type ProductGroup,
} from "@/lib/product-variants";
import type { EquestreBuildResult } from "@/lib/equestre-builder";
import type { Category } from "@/lib/types";

export const EQUESTRE_FAMILY_ID = "cloture-equestre";

/** Resolved catalogue product for one installation line. */
export interface ResolvedProduct {
  productId: string;
  productLabel: string;
  article?: string;
  variantSummary?: string;
}

/** One line in an installation quote project. */
export interface ProjectLine {
  familyId: string;
  familyLabel: string;
  categoryId: string;
  categoryTitle: string;
  productId: string;
  productLabel: string;
  article?: string;
  variantSummary?: string;
  /** Linear metres or unit count, depending on category format. */
  lengthMeters: number;
  /**
   * When set, `lengthMeters` is a piece count displayed with this unit noun
   * (e.g. "poteaux", "lisses") instead of linear metres. Used by the guided
   * equestrian builder, which yields estimated quantities. Such lines are
   * excluded from the linear-metre total.
   */
  unit?: string;
  notes?: string;
}

export type MeasureKind = "linear" | "quantity";

const LINEAR_FORMATS = new Set(["grillage", "brandes", "ganivelles", "equestre"]);

export function getMeasureKind(format: string): MeasureKind {
  return LINEAR_FORMATS.has(format) ? "linear" : "quantity";
}

export function getMeasureLabel(format: string): string {
  return getMeasureKind(format) === "linear" ? "Longueur (m)" : "Quantité";
}

export function getMeasurePlaceholder(format: string): string {
  return getMeasureKind(format) === "linear" ? "Ex. 150" : "Ex. 2";
}

export function getCategoryFormat(categoryId: string): string {
  return getCategoryById(categoryId)?.format ?? "standard_note";
}

/** Categories belonging to a catalogue family node. */
export function getCategoriesForFamily(familyId: string): Category[] {
  return getFamilyById(familyId)?.categories ?? [];
}

export function buildVariantSummary(
  category: Category,
  group: ProductGroup,
  selection: Record<string, string>,
): string {
  const axes = getVariantAxesForGroup(group.variants, category.format);
  const parts = axes
    .map((axis) => selection[axis.key])
    .filter((value): value is string => Boolean(value));
  return parts.join(" · ");
}

export function formatLineAmount(line: ProjectLine): string {
  if (line.unit) {
    return `${line.lengthMeters} ${line.unit}`;
  }
  const format = getCategoryFormat(line.categoryId);
  const kind = getMeasureKind(format);
  if (kind === "linear") {
    return `${line.lengthMeters} m`;
  }
  return `${line.lengthMeters} unité${line.lengthMeters > 1 ? "s" : ""}`;
}

/** Human-readable one-line summary for recaps and emails. */
export function formatLineSummary(line: ProjectLine): string {
  const parts = [line.categoryTitle];
  if (line.variantSummary) {
    parts.push(line.variantSummary);
  } else if (line.productLabel) {
    parts.push(line.productLabel);
  } else if (line.article) {
    parts.push(line.article);
  }
  parts.push(formatLineAmount(line));
  return parts.join(" · ");
}

/** Sum of linear-metre lines only (excludes barriers, quincaillerie, etc.). */
export function computeTotalLinearMeters(lines: ProjectLine[]): number {
  return lines.reduce((sum, line) => {
    if (line.unit) return sum;
    const format = getCategoryFormat(line.categoryId);
    if (getMeasureKind(format) === "linear") {
      return sum + line.lengthMeters;
    }
    return sum;
  }, 0);
}

export function validateProjectLineDraft(
  familyId: string,
  categoryId: string,
  amount: string,
  resolved: ResolvedProduct | null,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!familyId) errors.familyId = "Choisissez une famille.";
  if (!categoryId) errors.categoryId = "Choisissez un type précis.";
  if (!resolved?.productId) {
    errors.productId = "Choisissez un modèle ou configurez les options.";
  }
  const parsed = Number(amount.replace(",", "."));
  if (!amount.trim() || Number.isNaN(parsed) || parsed <= 0) {
    errors.amount = "Indiquez une valeur supérieure à 0.";
  } else if (parsed > 100_000) {
    errors.amount = "Valeur trop élevée.";
  }
  return errors;
}

export function buildProjectLine(
  familyId: string,
  categoryId: string,
  amount: string,
  resolved: ResolvedProduct,
  notes?: string,
): ProjectLine | null {
  const family = getFamilyById(familyId);
  const category = getCategoryById(categoryId);
  if (!family || !category || !resolved.productId) return null;

  const parsed = Number(amount.replace(",", "."));
  if (Number.isNaN(parsed) || parsed <= 0) return null;

  return {
    familyId,
    familyLabel: family.label,
    categoryId,
    categoryTitle: category.title,
    productId: resolved.productId,
    productLabel: resolved.productLabel,
    article: resolved.article,
    variantSummary: resolved.variantSummary,
    lengthMeters: parsed,
    notes: notes?.trim() || undefined,
  };
}

/**
 * Turn a guided equestrian builder result into two project lines (post + rail)
 * carrying the estimated quantities. The fence length is recorded in the notes
 * so the installer keeps the context behind the estimate.
 */
export function buildEquestreProjectLines(
  result: EquestreBuildResult,
  extraNotes?: string,
): ProjectLine[] {
  const family = getFamilyById(EQUESTRE_FAMILY_ID);
  const familyLabel = family?.label ?? "Clôture équestre";
  const contextNote = `Clôture ≈ ${result.lengthM} m`;
  const notes = extraNotes?.trim()
    ? `${contextNote} — ${extraNotes.trim()}`
    : contextNote;

  const postCount = result.estimate.postCount ?? 0;
  const railPieces = result.estimate.railPieces ?? 0;

  const lines: ProjectLine[] = [
    {
      familyId: EQUESTRE_FAMILY_ID,
      familyLabel,
      categoryId: result.post.categoryId,
      categoryTitle: result.post.categoryTitle,
      productId: result.post.product.id,
      productLabel: result.post.product.label,
      article: result.post.article,
      variantSummary: result.post.summary || undefined,
      lengthMeters: postCount,
      unit: postCount > 1 ? "poteaux" : "poteau",
      notes,
    },
    {
      familyId: EQUESTRE_FAMILY_ID,
      familyLabel,
      categoryId: result.rail.categoryId,
      categoryTitle: result.rail.categoryTitle,
      productId: result.rail.product.id,
      productLabel: result.rail.product.label,
      article: result.rail.article,
      variantSummary: result.rail.summary || undefined,
      lengthMeters: railPieces,
      unit: railPieces > 1 ? "lisses" : "lisse",
      notes: `${result.railCount} rang${result.railCount > 1 ? "s" : ""}`,
    },
  ];

  return lines;
}

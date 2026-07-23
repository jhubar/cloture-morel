import {
  getVariantAxesForGroup,
  type ProductGroup,
} from "@/lib/product-variants";
import {
  getFenceType,
  getMeasureLabel,
  getMeasurePlaceholder,
  type MeasureKind,
} from "@/lib/fence-types";
import type { Category } from "@/lib/types";

export type { MeasureKind } from "@/lib/fence-types";
export { getMeasureLabel, getMeasurePlaceholder } from "@/lib/fence-types";

/** Catalogue family id for the equestrian fence (used by the materials shop). */
export const EQUESTRE_FAMILY_ID = "cloture-equestre";

/**
 * One line in an installation quote project.
 *
 * The pose flow is macro-oriented: the customer picks a fence TYPE (not a
 * precise catalogue product) and gives a linear length or a unit count.
 */
export interface ProjectLine {
  fenceTypeId: string;
  typeLabel: string;
  measureKind: MeasureKind;
  /** Linear metres (measureKind "linear") or unit count ("quantity"). */
  amount: number;
  notes?: string;
}

export function getMeasureLabelForLine(line: ProjectLine): string {
  return getMeasureLabel(line.measureKind);
}

/**
 * Variant summary helper — still used by the materials-side product pickers
 * and the equestrian builder (cart mode). Kept here for backwards compat.
 */
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
  if (line.measureKind === "linear") {
    return `${line.amount} m`;
  }
  return `${line.amount} unité${line.amount > 1 ? "s" : ""}`;
}

/** Human-readable one-line summary for recaps and emails. */
export function formatLineSummary(line: ProjectLine): string {
  return [line.typeLabel, formatLineAmount(line)].join(" · ");
}

/** Sum of linear-metre lines only (excludes barriers, quantities, etc.). */
export function computeTotalLinearMeters(lines: ProjectLine[]): number {
  return lines.reduce((sum, line) => {
    if (line.measureKind === "linear") return sum + line.amount;
    return sum;
  }, 0);
}

/** True when every line has a valid positive amount. */
export function areProjectLinesComplete(lines: ProjectLine[]): boolean {
  return (
    lines.length > 0 &&
    lines.every((line) => Number.isFinite(line.amount) && line.amount > 0)
  );
}

/** Create a blank line for a chosen fence type (amount filled by the user). */
export function createProjectLine(fenceTypeId: string): ProjectLine | null {
  const type = getFenceType(fenceTypeId);
  if (!type) return null;
  return {
    fenceTypeId: type.id,
    typeLabel: type.label,
    measureKind: type.measureKind,
    amount: 0,
    notes: undefined,
  };
}

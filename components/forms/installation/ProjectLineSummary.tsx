"use client";

import { X } from "lucide-react";
import {
  computeTotalLinearMeters,
  formatLineAmount,
  type ProjectLine,
} from "@/lib/installation-project";
import { cn } from "@/lib/utils";

interface ProjectLineSummaryProps {
  lines: ProjectLine[];
  onRemove?: (index: number) => void;
  className?: string;
}

export function ProjectLineSummary({ lines, onRemove, className }: ProjectLineSummaryProps) {
  if (lines.length === 0) return null;

  const totalLinear = computeTotalLinearMeters(lines);

  return (
    <div className={cn("rounded-lg border border-sand-300 bg-sand/40 p-4", className)}>
      <p className="text-sm font-semibold text-forest-dark">
        Votre projet ({lines.length} ligne{lines.length > 1 ? "s" : ""})
      </p>
      <ul className="mt-3 space-y-2">
        {lines.map((line, index) => (
          <li
            key={`${line.productId}-${index}`}
            className="flex items-start justify-between gap-3 rounded-md bg-white px-3 py-2 text-sm ring-1 ring-inset ring-sand-200"
          >
            <div className="min-w-0">
              <p className="font-medium text-forest-dark">
                {line.familyLabel}
                <span className="mx-1.5 text-bark-muted" aria-hidden="true">
                  —
                </span>
                {line.categoryTitle}
              </p>
              <p className="mt-0.5 text-sm text-forest-dark">
                {line.article && line.article !== line.productLabel && (
                  <span>{line.article}</span>
                )}
                {line.variantSummary && (
                  <span className={line.article ? " text-bark-muted" : ""}>
                    {line.article ? " · " : ""}
                    {line.variantSummary}
                  </span>
                )}
                {!line.variantSummary && line.productLabel && (
                  <span>{line.productLabel}</span>
                )}
              </p>
              <p className="mt-0.5 text-bark-muted">
                {formatLineAmount(line)}
                {line.notes && (
                  <span className="block text-xs italic">{line.notes}</span>
                )}
              </p>
            </div>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-bark-muted transition-colors hover:bg-terracotta/10 hover:text-terracotta"
                aria-label={`Retirer ${line.categoryTitle}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </li>
        ))}
      </ul>
      {totalLinear > 0 && (
        <p className="mt-3 text-xs font-medium text-bark-muted">
          Total linéaire : {totalLinear} m
        </p>
      )}
    </div>
  );
}

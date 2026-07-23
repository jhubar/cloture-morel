"use client";

import { useState } from "react";
import { Info, Plus, Wand2, X } from "lucide-react";
import {
  FENCE_TYPES,
  getFenceType,
  getMeasureLabel,
  getMeasurePlaceholder,
} from "@/lib/fence-types";
import {
  createProjectLine,
  type ProjectLine,
} from "@/lib/installation-project";
import { TextField } from "@/components/forms/FormField";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { FenceGuide } from "@/components/forms/installation/FenceGuide";

interface ProjectLineBuilderProps {
  lines: ProjectLine[];
  onChange: (lines: ProjectLine[]) => void;
  /** Pre-fill the "usage" field from the guided quiz (only if empty). */
  onUsageHint?: (text: string) => void;
  error?: string;
}

const NON_ADVISORY = FENCE_TYPES.filter((t) => !t.advisory);
const ADVISORY = FENCE_TYPES.filter((t) => t.advisory);

export function ProjectLineBuilder({
  lines,
  onChange,
  onUsageHint,
  error,
}: ProjectLineBuilderProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);

  const addLine = (fenceTypeId: string) => {
    const line = createProjectLine(fenceTypeId);
    if (!line) return;
    onChange([...lines, line]);
    setPickerOpen(false);
  };

  const updateLine = (index: number, patch: Partial<ProjectLine>) => {
    onChange(lines.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  };

  const removeLine = (index: number) => {
    const next = lines.filter((_, i) => i !== index);
    onChange(next);
    if (next.length === 0) {
      setPickerOpen(false);
      setRecommendedIds([]);
    }
  };

  const openPickerAll = () => {
    setRecommendedIds([]);
    setPickerOpen(true);
  };

  const openGuide = () => {
    setRecommendedIds([]);
    setPickerOpen(false);
  };

  // Recommended-first ordering for the picker grid.
  const safeRecommendedIds = Array.isArray(recommendedIds) ? recommendedIds : [];
  const recSet = new Set(safeRecommendedIds);
  const orderedTypes = [
    ...safeRecommendedIds
      .map((id) => NON_ADVISORY.find((t) => t.id === id))
      .filter((t): t is (typeof NON_ADVISORY)[number] => Boolean(t)),
    ...NON_ADVISORY.filter((t) => !recSet.has(t.id)),
  ];

  const showGuide = lines.length === 0 && !pickerOpen;
  const showPicker = pickerOpen;

  return (
    <div className="space-y-5">
      {/* Selected lines — editable inline, with a thumbnail */}
      {lines.length > 0 && (
        <ul className="space-y-3">
          {lines.map((line, index) => {
            const type = getFenceType(line.fenceTypeId);
            const Icon = type?.icon;
            return (
              <li
                key={`${line.fenceTypeId}-${index}`}
                className="rounded-lg border border-sand-300 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-sand-200">
                      {type?.image ? (
                        <ImageSlot
                          slot={{
                            src: type.image,
                            alt: type.imageAlt || line.typeLabel,
                            hint: type.image,
                          }}
                          className="h-full w-full"
                          sizes="48px"
                        />
                      ) : Icon ? (
                        <Icon className="h-5 w-5 text-terracotta" aria-hidden="true" />
                      ) : null}
                    </span>
                    <p className="min-w-0 font-medium text-forest-dark">
                      {line.typeLabel}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLine(index)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-bark-muted transition-colors hover:bg-terracotta/10 hover:text-terracotta cursor-pointer"
                    aria-label={`Retirer ${line.typeLabel}`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <TextField
                    label={getMeasureLabel(line.measureKind)}
                    name={`line-amount-${index}`}
                    type="number"
                    min={0}
                    step="any"
                    required
                    placeholder={getMeasurePlaceholder(line.measureKind)}
                    value={line.amount > 0 ? String(line.amount) : ""}
                    onChange={(e) => {
                      const parsed = Number(e.target.value.replace(",", "."));
                      updateLine(index, {
                        amount: Number.isFinite(parsed) && parsed > 0 ? parsed : 0,
                      });
                    }}
                    error={
                      line.amount <= 0 ? "Indiquez une valeur supérieure à 0." : undefined
                    }
                  />
                  <TextField
                    label="Précisions (optionnel)"
                    name={`line-notes-${index}`}
                    placeholder="Ex. 2 portails inclus, accès difficile…"
                    value={line.notes ?? ""}
                    onChange={(e) =>
                      updateLine(index, { notes: e.target.value || undefined })
                    }
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Guided quiz (empty state) */}
      {showGuide && (
        <FenceGuide
          onPick={addLine}
          onUsageHint={(text) => onUsageHint?.(text)}
          onBrowseAll={(ids) => {
            setRecommendedIds(Array.isArray(ids) ? ids : []);
            setPickerOpen(true);
          }}
        />
      )}

      {/* Fence-type picker */}
      {showPicker && (
        <div>
          <div className="mb-1 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-forest-dark">
              {lines.length === 0
                ? "Choisissez votre type de projet"
                : "Ajouter un autre type de clôture"}
            </p>
            {lines.length === 0 && (
              <button
                type="button"
                onClick={openGuide}
                className="inline-flex items-center gap-1 text-xs font-medium text-terracotta underline underline-offset-2 hover:text-terracotta-dark cursor-pointer"
              >
                <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
                Être guidé
              </button>
            )}
          </div>

          <div className="mb-3 flex items-start gap-2 rounded-lg border border-sage/40 bg-sage-soft/30 px-3 py-2.5 text-xs leading-relaxed text-forest">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              Choisissez le projet qui ressemble le plus au vôtre. Pas besoin de
              connaître les poteaux, hauteurs ou barrières :{" "}
              <strong className="font-semibold">Nicolas affine tout avec vous</strong>{" "}
              ensuite. Une idée de la longueur suffit pour démarrer.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {orderedTypes.map((type) => {
              const Icon = type.icon;
              const recommended = recSet.has(type.id);
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => addLine(type.id)}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-sand-300 bg-white text-left shadow-sm transition-all hover:border-terracotta/50 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 cursor-pointer"
                >
                  {recommended && (
                    <span className="absolute right-2 top-2 z-10 inline-flex items-center rounded-full bg-terracotta px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                      Recommandé
                    </span>
                  )}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <ImageSlot
                      slot={{
                        src: type.image,
                        alt: type.imageAlt || type.label,
                        hint: type.image ?? "",
                      }}
                      className="h-full w-full transition-transform duration-300 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <span className="pointer-events-none absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-forest shadow-sm backdrop-blur-sm">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <span className="block text-sm font-semibold text-forest-dark">
                      {type.label}
                    </span>
                    <span className="mt-1 block flex-1 text-xs text-bark-muted">
                      {type.forWhom}
                    </span>
                    <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-terracotta transition-colors group-hover:text-terracotta-dark">
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      Choisir ce projet
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Guided fallback */}
          {ADVISORY.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => addLine(type.id)}
                className="group mt-3 flex w-full items-center gap-3 rounded-xl border border-dashed border-forest/30 bg-sage-soft/40 p-4 text-left transition-colors hover:border-forest/50 hover:bg-sage-soft/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 cursor-pointer"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-forest shadow-sm">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-forest-dark">
                    {type.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-bark-muted">
                    {type.helper}
                  </span>
                </span>
              </button>
            );
          })}

          {lines.length > 0 && (
            <button
              type="button"
              onClick={() => setPickerOpen(false)}
              className="mt-3 text-sm text-bark-muted underline underline-offset-2 hover:text-forest-dark cursor-pointer"
            >
              Annuler
            </button>
          )}
        </div>
      )}

      {/* Add-another entry point */}
      {lines.length > 0 && !showPicker && (
        <button
          type="button"
          onClick={openPickerAll}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-dashed border-terracotta/40 bg-terracotta/5 px-4 text-sm font-semibold text-terracotta transition-colors hover:bg-terracotta/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Ajouter une autre clôture
        </button>
      )}

      {error && <p className="text-sm text-terracotta-dark">{error}</p>}
    </div>
  );
}

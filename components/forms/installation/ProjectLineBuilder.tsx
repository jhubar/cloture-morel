"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getFamilies } from "@/lib/families";
import {
  buildProjectLine,
  getCategoriesForFamily,
  getCategoryFormat,
  getMeasureLabel,
  getMeasurePlaceholder,
  validateProjectLineDraft,
  type ProjectLine,
  type ResolvedProduct,
} from "@/lib/installation-project";
import { TextField } from "@/components/forms/FormField";
import { ProjectLineSummary } from "@/components/forms/installation/ProjectLineSummary";
import { ProjectProductPicker } from "@/components/forms/installation/ProjectProductPicker";
import { cn } from "@/lib/utils";

interface ProjectLineBuilderProps {
  lines: ProjectLine[];
  onChange: (lines: ProjectLine[]) => void;
  error?: string;
}

export function ProjectLineBuilder({ lines, onChange, error }: ProjectLineBuilderProps) {
  const families = getFamilies();
  const [familyId, setFamilyId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [resolved, setResolved] = useState<ResolvedProduct | null>(null);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [draftErrors, setDraftErrors] = useState<Record<string, string>>({});

  const categories = familyId ? getCategoriesForFamily(familyId) : [];
  const selectedFormat = categoryId ? getCategoryFormat(categoryId) : "";
  const showProductPicker = Boolean(categoryId);

  useEffect(() => {
    if (categories.length === 1) {
      setCategoryId(categories[0].id);
    } else if (categoryId && !categories.some((c) => c.id === categoryId)) {
      setCategoryId("");
    }
  }, [familyId, categories, categoryId]);

  useEffect(() => {
    setResolved(null);
  }, [categoryId]);

  const handleAddLine = () => {
    const errors = validateProjectLineDraft(familyId, categoryId, amount, resolved);
    if (Object.keys(errors).length > 0) {
      setDraftErrors(errors);
      return;
    }
    if (!resolved) return;

    const line = buildProjectLine(familyId, categoryId, amount, resolved, notes);
    if (!line) return;

    onChange([...lines, line]);
    setDraftErrors({});
    setAmount("");
    setNotes("");
    setResolved(null);
  };

  return (
    <div className="space-y-5">
      {/* Family picker */}
      <div>
        <p className="mb-2 text-sm font-medium text-forest-dark">Famille de produits</p>
        <div className="flex flex-wrap gap-2">
          {families.map((family) => {
            const active = familyId === family.id;
            const Icon = family.icon;
            return (
              <button
                key={family.id}
                type="button"
                onClick={() => {
                  setFamilyId(family.id);
                  setCategoryId("");
                  setResolved(null);
                  setDraftErrors({});
                }}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors cursor-pointer",
                  active
                    ? "border-terracotta bg-terracotta text-white"
                    : "border-sand-300 bg-white text-bark hover:border-terracotta/40",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {family.label}
              </button>
            );
          })}
        </div>
        {draftErrors.familyId && (
          <p className="mt-1 text-xs text-terracotta-dark">{draftErrors.familyId}</p>
        )}
      </div>

      {/* Category picker */}
      {familyId && categories.length > 1 && (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-forest-dark">Type précis</legend>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                  categoryId === category.id
                    ? "border-terracotta bg-terracotta/5"
                    : "border-sand-300 bg-white hover:border-terracotta/30",
                )}
              >
                <input
                  type="radio"
                  name="projectCategory"
                  value={category.id}
                  checked={categoryId === category.id}
                  onChange={() => {
                    setCategoryId(category.id);
                    setDraftErrors((e) => ({ ...e, categoryId: "", productId: "" }));
                  }}
                  className="mt-0.5 h-4 w-4 accent-terracotta"
                />
                <span>
                  <span className="font-medium text-forest-dark">{category.title}</span>
                  <span className="mt-0.5 block text-xs text-bark-muted">
                    {category.products.length} référence
                    {category.products.length > 1 ? "s" : ""}
                  </span>
                </span>
              </label>
            ))}
          </div>
          {draftErrors.categoryId && (
            <p className="text-xs text-terracotta-dark">{draftErrors.categoryId}</p>
          )}
        </fieldset>
      )}

      {/* Product / variant picker */}
      {showProductPicker && categoryId && (
        <ProjectProductPicker
          categoryId={categoryId}
          onResolved={setResolved}
          error={draftErrors.productId}
        />
      )}

      {/* Amount + notes */}
      {familyId && showProductPicker && resolved && (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label={selectedFormat ? getMeasureLabel(selectedFormat) : "Longueur ou quantité"}
            name="lineAmount"
            type="number"
            min={0}
            step="any"
            required
            placeholder={selectedFormat ? getMeasurePlaceholder(selectedFormat) : "Ex. 150"}
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setDraftErrors((prev) => ({ ...prev, amount: "" }));
            }}
            error={draftErrors.amount}
          />
          <TextField
            label="Notes (optionnel)"
            name="lineNotes"
            placeholder="Ex. 2 portails inclus, accès difficile…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      )}

      {familyId && showProductPicker && resolved && (
        <button
          type="button"
          onClick={handleAddLine}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-terracotta/40 bg-terracotta/5 px-4 text-sm font-semibold text-terracotta transition-colors hover:bg-terracotta/10 cursor-pointer sm:w-auto"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Ajouter cette clôture
        </button>
      )}

      <ProjectLineSummary
        lines={lines}
        onRemove={(index) => onChange(lines.filter((_, i) => i !== index))}
      />

      {error && <p className="text-sm text-terracotta-dark">{error}</p>}
    </div>
  );
}

"use client";

import { TextAreaField, TextField } from "@/components/forms/FormField";
import type { InstallationFormState } from "@/components/forms/installation/types";

interface StepTerrainProps {
  state: InstallationFormState;
  errors: Record<string, string>;
  onChange: (patch: Partial<InstallationFormState>) => void;
}

export function StepTerrain({ state, errors, onChange }: StepTerrainProps) {
  const set = (key: keyof InstallationFormState, value: string) =>
    onChange({ [key]: value });

  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">État du terrain</legend>

      <div>
        <p className="mb-2 text-sm font-medium text-forest-dark">
          Y a-t-il des barrières à intégrer dans la nouvelle clôture ?
        </p>
        <div className="flex flex-wrap gap-3">
          {(["oui", "non"] as const).map((v) => (
            <label key={v} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="hasBarriers"
                value={v}
                checked={state.hasBarriers === v}
                onChange={() => set("hasBarriers", v)}
                className="h-4 w-4 accent-terracotta"
              />
              {v === "oui" ? "Oui" : "Non"}
            </label>
          ))}
        </div>
        {state.hasBarriers === "oui" && (
          <TextField
            label="Précisions sur les barrières"
            name="barriersDetails"
            placeholder="Ex. 2 barrières de 3 m — galvanisées, 1 portail bois de 4 m…"
            value={state.barriersDetails}
            onChange={(e) => set("barriersDetails", e.target.value)}
            error={errors.barriersDetails}
            className="mt-3"
          />
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-forest-dark">
          Le chantier est-il facilement accessible ?
        </p>
        <div className="flex flex-wrap gap-3">
          {(
            [
              { value: "facile", label: "Oui, accès facile" },
              { value: "difficile", label: "Non, accès difficile" },
              { value: "inconnu", label: "Je ne sais pas" },
            ] as const
          ).map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="siteAccess"
                value={value}
                checked={state.siteAccess === value}
                onChange={() => set("siteAccess", value)}
                className="h-4 w-4 accent-terracotta"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-forest-dark">
          Un couloir dégagé de 5 à 6 m est-il disponible le long de la future clôture ?
        </p>
        <p className="mb-2 text-xs text-bark-muted">
          Nécessaire pour nos machines et véhicules.
        </p>
        <div className="flex flex-wrap gap-3">
          {(
            [
              { value: "oui", label: "Oui" },
              { value: "non", label: "Non, à préparer" },
              { value: "partiel", label: "Partiellement" },
            ] as const
          ).map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="terrainCleared"
                value={value}
                checked={state.terrainCleared === value}
                onChange={() => set("terrainCleared", value)}
                className="h-4 w-4 accent-terracotta"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-forest-dark">
          Y a-t-il un dénivelé important ?
        </p>
        <div className="flex flex-wrap gap-3">
          {(
            [
              { value: "plat", label: "Terrain plat" },
              { value: "leger", label: "Légère pente" },
              { value: "important", label: "Dénivelé important" },
            ] as const
          ).map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="slope"
                value={value}
                checked={state.slope === value}
                onChange={() => set("slope", value)}
                className="h-4 w-4 accent-terracotta"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <TextAreaField
        label="Présence d'objets sensibles dans le sol (optionnel)"
        name="undergroundHazards"
        placeholder="Ex. tuyaux d'eau, câbles électriques, drains… Indiquez leur emplacement approximatif."
        rows={2}
        value={state.undergroundHazards}
        onChange={(e) => set("undergroundHazards", e.target.value)}
        error={errors.undergroundHazards}
      />
    </fieldset>
  );
}

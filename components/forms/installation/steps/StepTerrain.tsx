"use client";

import {
  CircleDashed,
  DoorOpen,
  HelpCircle,
  Minus,
  Mountain,
  Ban,
  Shovel,
  TrendingUp,
  Truck,
  TriangleAlert,
} from "lucide-react";
import { TextAreaField, TextField } from "@/components/forms/FormField";
import { OptionCardGroup } from "@/components/forms/installation/OptionCardGroup";
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
    <fieldset className="space-y-7">
      <legend className="sr-only">État du terrain</legend>

      <p className="text-sm text-bark-muted">
        Ces quelques précisions nous aident à préparer un devis juste et à
        organiser le chantier. Répondez au mieux — en cas de doute, choisissez
        « Je ne sais pas ».
      </p>

      <OptionCardGroup
        name="hasBarriers"
        legend="Y a-t-il des barrières ou portails à intégrer ?"
        options={[
          { value: "oui", label: "Oui", icon: DoorOpen },
          { value: "non", label: "Non", icon: Ban },
        ]}
        columnsClassName="sm:grid-cols-2"
        value={state.hasBarriers}
        onChange={(v) => set("hasBarriers", v)}
      />
      {state.hasBarriers === "oui" && (
        <TextField
          label="Précisions sur les barrières"
          name="barriersDetails"
          placeholder="Ex. 2 barrières de 3 m — galvanisées, 1 portail bois de 4 m…"
          value={state.barriersDetails}
          onChange={(e) => set("barriersDetails", e.target.value)}
          error={errors.barriersDetails}
        />
      )}

      <OptionCardGroup
        name="siteAccess"
        legend="Le chantier est-il facilement accessible ?"
        options={[
          { value: "facile", label: "Accès facile", icon: Truck },
          { value: "difficile", label: "Accès difficile", icon: TriangleAlert },
          { value: "inconnu", label: "Je ne sais pas", icon: HelpCircle },
        ]}
        value={state.siteAccess}
        onChange={(v) => set("siteAccess", v)}
      />

      <OptionCardGroup
        name="terrainCleared"
        legend="Un couloir dégagé de 5 à 6 m est-il disponible ?"
        helper="Nécessaire pour le passage de nos machines et véhicules."
        options={[
          { value: "oui", label: "Oui", icon: Truck },
          { value: "non", label: "Non, à préparer", icon: Shovel },
          { value: "partiel", label: "Partiellement", icon: CircleDashed },
        ]}
        value={state.terrainCleared}
        onChange={(v) => set("terrainCleared", v)}
      />

      <OptionCardGroup
        name="slope"
        legend="Y a-t-il un dénivelé important ?"
        options={[
          { value: "plat", label: "Terrain plat", icon: Minus },
          { value: "leger", label: "Légère pente", icon: TrendingUp },
          { value: "important", label: "Dénivelé important", icon: Mountain },
        ]}
        value={state.slope}
        onChange={(v) => set("slope", v)}
      />

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

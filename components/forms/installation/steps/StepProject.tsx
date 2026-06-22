"use client";

import { TextAreaField, TextField } from "@/components/forms/FormField";
import { ProjectLineBuilder } from "@/components/forms/installation/ProjectLineBuilder";
import type { InstallationFormState } from "@/components/forms/installation/types";

interface StepProjectProps {
  state: InstallationFormState;
  errors: Record<string, string>;
  onChange: (patch: Partial<InstallationFormState>) => void;
}

export function StepProject({ state, errors, onChange }: StepProjectProps) {
  const update =
    (key: keyof InstallationFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ [key]: e.target.value });

  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Votre clôture</legend>

      <TextField
        label="Adresse du chantier"
        name="projectAddress"
        required
        autoComplete="street-address"
        placeholder="Rue, numéro, code postal, localité, pays"
        value={state.projectAddress}
        onChange={update("projectAddress")}
        error={errors.projectAddress}
      />

      <ProjectLineBuilder
        lines={state.projectLines}
        onChange={(projectLines) => onChange({ projectLines })}
        error={errors.projectLines}
      />

      <TextAreaField
        label="Rôle / usage de la clôture (optionnel)"
        name="fenceRole"
        placeholder="Ex. protection contre les sangliers, contenir des équidés, délimiter une prairie…"
        rows={2}
        value={state.fenceRole}
        onChange={update("fenceRole")}
        error={errors.fenceRole}
      />
    </fieldset>
  );
}

"use client";

import { TextField } from "@/components/forms/FormField";
import { ReviewSummary } from "@/components/forms/installation/ReviewSummary";
import type { InstallationFormState } from "@/components/forms/installation/types";

interface StepContactProps {
  state: InstallationFormState;
  errors: Record<string, string>;
  onChange: (patch: Partial<InstallationFormState>) => void;
}

export function StepContact({ state, errors, onChange }: StepContactProps) {
  const update =
    (key: keyof InstallationFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ [key]: e.target.value });

  return (
    <div className="space-y-6">
      {state.projectLines.length > 0 && <ReviewSummary state={state} />}

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wider text-bark-muted">
          Vos coordonnées
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Prénom"
            name="firstName"
            required
            autoComplete="given-name"
            value={state.firstName}
            onChange={update("firstName")}
            error={errors.firstName}
          />
          <TextField
            label="Nom"
            name="lastName"
            required
            autoComplete="family-name"
            value={state.lastName}
            onChange={update("lastName")}
            error={errors.lastName}
          />
        </div>
        <TextField
          label="Société (optionnel)"
          name="company"
          autoComplete="organization"
          value={state.company}
          onChange={update("company")}
          error={errors.company}
        />
        <TextField
          label="N° de TVA (professionnels)"
          name="vatNumber"
          hint="Format belge : BE 0123.456.789 — laissez vide si particulier."
          value={state.vatNumber}
          onChange={update("vatNumber")}
          error={errors.vatNumber}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="E-mail"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={state.email}
            onChange={update("email")}
            error={errors.email}
          />
          <TextField
            label="Téléphone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            value={state.phone}
            onChange={update("phone")}
            error={errors.phone}
          />
        </div>
      </fieldset>

      <div className="rounded-lg border border-terracotta/20 bg-terracotta/5 p-4 text-sm text-bark-muted">
        <p className="font-medium text-forest-dark">
          Responsabilité — objets sensibles dans le sol
        </p>
        <p className="mt-1 text-xs leading-relaxed">
          Les sociétés <strong>Clôtures et travaux Morel SRL</strong> et{" "}
          <strong>Morel Espaces verts SRL</strong> déclinent toute responsabilité en cas
          de dommage causé à des objets sensibles présents dans le sol (tuyaux, câbles,
          drains…) sur la trajectoire de la clôture à réaliser, si ceux-ci ne nous ont
          pas été signalés préalablement.
        </p>
        <label className="mt-3 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="disclaimerAccepted"
            checked={state.disclaimerAccepted}
            onChange={(e) => onChange({ disclaimerAccepted: e.target.checked })}
            className="mt-0.5 h-4 w-4 shrink-0 accent-terracotta"
          />
          <span className={errors.disclaimerAccepted ? "text-terracotta-dark" : ""}>
            Je reconnais avoir lu et accepté les conditions de responsabilité
            ci-dessus. <span className="text-terracotta">*</span>
          </span>
        </label>
        {errors.disclaimerAccepted && (
          <p className="mt-1 text-xs text-terracotta-dark">{errors.disclaimerAccepted}</p>
        )}
      </div>
    </div>
  );
}

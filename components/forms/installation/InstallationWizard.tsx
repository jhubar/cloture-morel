"use client";

import { useRef, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { installationQuoteSchema } from "@/lib/validation";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { readHoneypot, scrollToFirstFormError } from "@/lib/form-utils";
import { FormSuccessPanel } from "@/components/ui/FormSuccessPanel";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { StepProject } from "@/components/forms/installation/steps/StepProject";
import { StepTerrain } from "@/components/forms/installation/steps/StepTerrain";
import { StepPhotos } from "@/components/forms/installation/steps/StepPhotos";
import { StepContact } from "@/components/forms/installation/steps/StepContact";
import {
  emptyInstallationForm,
  WIZARD_STEPS,
  type InstallationFormState,
} from "@/components/forms/installation/types";
import { cn } from "@/lib/utils";

function validateStep(step: number, state: InstallationFormState): Record<string, string> {
  const errors: Record<string, string> = {};

  if (step === 1) {
    if (!state.projectAddress.trim()) {
      errors.projectAddress = "L'adresse du chantier est requise.";
    }
    if (state.projectLines.length === 0) {
      errors.projectLines = "Ajoutez au moins une clôture.";
    } else if (state.projectLines.some((line) => !(line.amount > 0))) {
      errors.projectLines =
        "Indiquez une longueur ou une quantité pour chaque clôture.";
    }
  }

  if (step === 3) {
    if (!state.photos.some((p) => p.kind === "aerienne")) {
      errors.photosAerienne = "Ajoutez au moins une vue aérienne.";
    }
    if (!state.photos.some((p) => p.kind === "terrain")) {
      errors.photosTerrain = "Ajoutez au moins une photo du terrain.";
    }
  }

  if (step === 4) {
    if (!state.firstName.trim()) errors.firstName = "Le prénom est requis.";
    if (!state.lastName.trim()) errors.lastName = "Le nom est requis.";
    if (!state.email.trim()) errors.email = "L'e-mail est requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      errors.email = "Adresse e-mail invalide.";
    }
    if (!state.phone.trim()) errors.phone = "Le téléphone est requis.";
    if (!state.disclaimerAccepted) {
      errors.disclaimerAccepted =
        "Vous devez accepter les conditions de responsabilité.";
    }
  }

  return errors;
}

function buildPayload(state: InstallationFormState, honeypot: string) {
  return {
    firstName: state.firstName,
    lastName: state.lastName,
    company: state.company || undefined,
    vatNumber: state.vatNumber || undefined,
    email: state.email,
    phone: state.phone,
    projectAddress: state.projectAddress,
    projectLines: state.projectLines,
    fenceRole: state.fenceRole || undefined,
    hasBarriers: state.hasBarriers || undefined,
    barriersDetails: state.barriersDetails || undefined,
    siteAccess: state.siteAccess || undefined,
    terrainCleared: state.terrainCleared || undefined,
    slope: state.slope || undefined,
    undergroundHazards: state.undergroundHazards || undefined,
    timing: state.timing || undefined,
    message: state.message || undefined,
    photos: state.photos.map(({ name, data, type, kind }) => ({
      name,
      data,
      type,
      kind,
    })),
    disclaimerAccepted: state.disclaimerAccepted as true,
    _hp: honeypot,
  };
}

export function InstallationWizard() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<InstallationFormState>(emptyInstallationForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const patch = (partial: Partial<InstallationFormState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  };

  const goNext = () => {
    const stepErrors = validateStep(step, state);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      if (formRef.current) scrollToFirstFormError(formRef.current, stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, WIZARD_STEPS.length));
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < WIZARD_STEPS.length) {
      goNext();
      return;
    }

    setServerError(null);
    setEmailWarning(null);

    const stepErrors = validateStep(4, state);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      scrollToFirstFormError(e.currentTarget, stepErrors);
      return;
    }

    const payload = buildPayload(state, readHoneypot(e.currentTarget));
    const parsed = installationQuoteSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[issue.path.length - 1];
        if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      scrollToFirstFormError(e.currentTarget, fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/devis-pose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error ?? "Une erreur est survenue. Veuillez réessayer.");
      }
      if (data?.emailWarning) setEmailWarning(data.emailWarning);
      setSuccess(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <FormSuccessPanel
        title="Demande envoyée, merci !"
        message="Votre demande de pose a bien été transmise. Nous étudions votre projet et revenons vers vous rapidement pour organiser une visite ou un devis."
        emailWarning={emailWarning}
      >
        <PrimaryButton href="/catalogue" size="lg">
          Voir les matériaux
        </PrimaryButton>
        <SecondaryButton href="/" size="lg">
          Retour à l&apos;accueil
        </SecondaryButton>
      </FormSuccessPanel>
    );
  }

  const currentStep = WIZARD_STEPS[step - 1];

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="relative space-y-6">
      <HoneypotField />

      {/* Progress bar */}
      <nav aria-label="Étapes du formulaire">
        <ol className="flex flex-wrap gap-2">
          {WIZARD_STEPS.map(({ id, label }) => {
            const active = id === step;
            const done = id < step;
            return (
              <li key={id}>
                <span
                  className={cn(
                    "inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-xs font-medium sm:text-sm",
                    active && "bg-terracotta text-white",
                    done && !active && "bg-terracotta/15 text-terracotta-dark",
                    !active && !done && "bg-sand-200 text-bark-muted",
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-black/10 text-[11px] font-bold">
                    {id}
                  </span>
                  {label}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Thin progress track */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sand-200">
          <div
            className="h-full rounded-full bg-terracotta transition-all duration-500"
            style={{ width: `${(step / WIZARD_STEPS.length) * 100}%` }}
          />
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="text-xs text-bark-muted">
            Étape {step} sur {WIZARD_STEPS.length} — {currentStep.label}
          </p>
          <p className="text-xs text-bark-muted">
            ≈ 2 min · sans engagement · réponse rapide
          </p>
        </div>
      </nav>

      {step === 1 && <StepProject state={state} errors={errors} onChange={patch} />}
      {step === 2 && <StepTerrain state={state} errors={errors} onChange={patch} />}
      {step === 3 && <StepPhotos state={state} errors={errors} onChange={patch} />}
      {step === 4 && <StepContact state={state} errors={errors} onChange={patch} />}

      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-terracotta/10 p-3 text-sm text-terracotta-dark"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {serverError}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-sand-300 bg-white px-6 text-sm font-semibold text-bark transition-colors hover:bg-sand-200 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Retour
          </button>
        ) : (
          <span />
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-terracotta px-6 text-base font-semibold text-white transition-colors hover:bg-terracotta-dark disabled:opacity-60 cursor-pointer sm:min-w-[200px]"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Envoi en cours…
            </>
          ) : step < WIZARD_STEPS.length ? (
            <>
              Suivant
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </>
          ) : (
            "Envoyer ma demande de pose"
          )}
        </button>
      </div>
    </form>
  );
}

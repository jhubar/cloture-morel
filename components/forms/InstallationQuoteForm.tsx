"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { installationQuoteSchema } from "@/lib/validation";
import { TextField, TextAreaField, SelectField } from "@/components/forms/FormField";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { readHoneypot, scrollToFirstFormError } from "@/lib/form-utils";
import { FormSuccessPanel } from "@/components/ui/FormSuccessPanel";
import { PhotoUploadSlot } from "@/components/forms/PhotoUploadSlot";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";

type Fields = {
  firstName: string;
  lastName: string;
  company: string;
  vatNumber: string;
  email: string;
  phone: string;
  projectAddress: string;
  fenceType: string;
  approximateLength: string;
  terrain: string;
  timing: string;
  message: string;
};

const empty: Fields = {
  firstName: "",
  lastName: "",
  company: "",
  vatNumber: "",
  email: "",
  phone: "",
  projectAddress: "",
  fenceType: "",
  approximateLength: "",
  terrain: "",
  timing: "",
  message: "",
};

const fenceTypeOptions = [
  { value: "Clôture rigide / panneaux", label: "Clôture rigide / panneaux" },
  { value: "Grillage souple", label: "Grillage souple" },
  { value: "Clôture bois (piquets, ganivelles)", label: "Clôture bois (piquets, ganivelles)" },
  { value: "Clôture en robinier / acacia", label: "Clôture en robinier / acacia" },
  { value: "Portail / portillon", label: "Portail / portillon" },
  { value: "Autre / je ne sais pas encore", label: "Autre / je ne sais pas encore" },
];

const timingOptions = [
  { value: "Dès que possible", label: "Dès que possible" },
  { value: "Dans les 3 mois", label: "Dans les 3 mois" },
  { value: "Dans les 6 mois", label: "Dans les 6 mois" },
  { value: "Pas de date précise", label: "Pas de date précise" },
];

export function InstallationQuoteForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update =
    (key: keyof Fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setEmailWarning(null);

    const payload = {
      ...fields,
      company: fields.company || undefined,
      vatNumber: fields.vatNumber || undefined,
      approximateLength: fields.approximateLength || undefined,
      terrain: fields.terrain || undefined,
      timing: fields.timing || undefined,
      message: fields.message || undefined,
      _hp: readHoneypot(e.currentTarget),
    };

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

  return (
    <form onSubmit={handleSubmit} noValidate className="relative space-y-4">
      <HoneypotField />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Prénom"
          name="firstName"
          required
          autoComplete="given-name"
          value={fields.firstName}
          onChange={update("firstName")}
          error={errors.firstName}
        />
        <TextField
          label="Nom"
          name="lastName"
          required
          autoComplete="family-name"
          value={fields.lastName}
          onChange={update("lastName")}
          error={errors.lastName}
        />
      </div>
      <TextField
        label="Société (optionnel)"
        name="company"
        autoComplete="organization"
        value={fields.company}
        onChange={update("company")}
        error={errors.company}
      />
      <TextField
        label="N° de TVA (professionnels)"
        name="vatNumber"
        hint="Format belge : BE 0123.456.789 — laissez vide si particulier."
        value={fields.vatNumber}
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
          value={fields.email}
          onChange={update("email")}
          error={errors.email}
        />
        <TextField
          label="Téléphone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          value={fields.phone}
          onChange={update("phone")}
          error={errors.phone}
        />
      </div>
      <TextField
        label="Adresse du chantier"
        name="projectAddress"
        required
        autoComplete="street-address"
        value={fields.projectAddress}
        onChange={update("projectAddress")}
        error={errors.projectAddress}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Type de clôture"
          name="fenceType"
          required
          placeholder="Sélectionnez…"
          options={fenceTypeOptions}
          value={fields.fenceType}
          onChange={update("fenceType")}
          error={errors.fenceType}
        />
        <TextField
          label="Longueur approximative"
          name="approximateLength"
          placeholder="Ex. 40 mètres"
          value={fields.approximateLength}
          onChange={update("approximateLength")}
          error={errors.approximateLength}
        />
      </div>
      <TextField
        label="Nature du terrain (optionnel)"
        name="terrain"
        placeholder="Ex. terrain plat, en pente, rocailleux…"
        value={fields.terrain}
        onChange={update("terrain")}
        error={errors.terrain}
      />
      <SelectField
        label="Délai souhaité (optionnel)"
        name="timing"
        placeholder="Sélectionnez…"
        options={timingOptions}
        value={fields.timing}
        onChange={update("timing")}
        error={errors.timing}
      />
      <TextAreaField
        label="Votre projet (optionnel)"
        name="message"
        placeholder="Décrivez votre projet, vos contraintes, vos attentes…"
        value={fields.message}
        onChange={update("message")}
        error={errors.message}
      />

      <PhotoUploadSlot />

      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-terracotta/10 p-3 text-sm text-terracotta-dark"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-terracotta px-6 text-base font-semibold text-white transition-colors hover:bg-terracotta-dark disabled:opacity-60 cursor-pointer"
      >
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Envoi en cours…
          </>
        ) : (
          "Envoyer ma demande de pose"
        )}
      </button>
    </form>
  );
}

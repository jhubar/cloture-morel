"use client";

import { useState } from "react";
import { Loader2, AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { installationQuoteSchema } from "@/lib/validation";
import { TextField, TextAreaField, SelectField } from "@/components/forms/FormField";

type Fields = {
  firstName: string;
  lastName: string;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setEmailWarning(null);

    const payload = {
      ...fields,
      approximateLength: fields.approximateLength || undefined,
      terrain: fields.terrain || undefined,
      timing: fields.timing || undefined,
      message: fields.message || undefined,
    };

    const parsed = installationQuoteSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[issue.path.length - 1];
        if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
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
      <div className="rounded-card border border-sand-300 bg-white px-6 py-12 text-center shadow-card">
        <CheckCircle2 className="mx-auto h-12 w-12 text-instock" aria-hidden="true" />
        <h3 className="mt-4 font-display text-xl font-semibold text-forest-dark">
          Demande envoyée, merci !
        </h3>
        <p className="mx-auto mt-2 max-w-md text-bark-muted">
          Votre demande de pose a bien été transmise. Nous étudions votre projet et
          revenons vers vous rapidement pour organiser une visite ou un devis.
        </p>
        {emailWarning && (
          <p className="mx-auto mt-4 max-w-md rounded-lg bg-onorder/10 p-3 text-sm text-onorder">
            {emailWarning}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Prénom"
          required
          autoComplete="given-name"
          value={fields.firstName}
          onChange={update("firstName")}
          error={errors.firstName}
        />
        <TextField
          label="Nom"
          required
          autoComplete="family-name"
          value={fields.lastName}
          onChange={update("lastName")}
          error={errors.lastName}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="E-mail"
          type="email"
          required
          autoComplete="email"
          value={fields.email}
          onChange={update("email")}
          error={errors.email}
        />
        <TextField
          label="Téléphone"
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
        required
        autoComplete="street-address"
        value={fields.projectAddress}
        onChange={update("projectAddress")}
        error={errors.projectAddress}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Type de clôture"
          required
          placeholder="Sélectionnez…"
          options={fenceTypeOptions}
          value={fields.fenceType}
          onChange={update("fenceType")}
          error={errors.fenceType}
        />
        <TextField
          label="Longueur approximative"
          placeholder="Ex. 40 mètres"
          value={fields.approximateLength}
          onChange={update("approximateLength")}
          error={errors.approximateLength}
        />
      </div>
      <TextField
        label="Nature du terrain (optionnel)"
        placeholder="Ex. terrain plat, en pente, rocailleux…"
        value={fields.terrain}
        onChange={update("terrain")}
        error={errors.terrain}
      />
      <SelectField
        label="Délai souhaité (optionnel)"
        placeholder="Sélectionnez…"
        options={timingOptions}
        value={fields.timing}
        onChange={update("timing")}
        error={errors.timing}
      />
      <TextAreaField
        label="Votre projet (optionnel)"
        placeholder="Décrivez votre projet, vos contraintes, vos attentes…"
        value={fields.message}
        onChange={update("message")}
        error={errors.message}
      />

      {/* Photo upload placeholder — kept simple for v1 (no storage backend yet). */}
      <div className="rounded-lg border border-dashed border-sand-300 bg-sand-200/40 px-4 py-5 text-center text-sm text-bark-muted">
        <Upload className="mx-auto mb-1.5 h-5 w-5 text-sage" aria-hidden="true" />
        Vous pourrez joindre des photos par e-mail après votre demande.
        {/* TODO: brancher un upload de fichiers (ex. UploadThing / S3) si besoin. */}
      </div>

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

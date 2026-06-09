"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import type { CartItem } from "@/lib/types";
import { materialsQuoteSchema } from "@/lib/validation";
import { TextField, TextAreaField } from "@/components/forms/FormField";

export interface QuoteSubmitResult {
  pdfBase64?: string;
  pdfFilename?: string;
  emailWarning?: string;
}

interface QuoteRequestFormProps {
  items: CartItem[];
  onSubmitted: (result: QuoteSubmitResult) => void;
}

type Fields = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  message: string;
};

const empty: Fields = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  address: "",
  message: "",
};

export function QuoteRequestForm({ items, onSubmitted }: QuoteRequestFormProps) {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const update = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const payload = {
      customer: {
        firstName: fields.firstName,
        lastName: fields.lastName,
        company: fields.company || undefined,
        email: fields.email,
        phone: fields.phone,
        address: fields.address,
        message: fields.message || undefined,
      },
      items,
    };

    const parsed = materialsQuoteSchema.safeParse(payload);
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
      const res = await fetch("/api/devis-materiaux", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Une erreur est survenue. Veuillez réessayer.");
      }
      const result = (await res.json()) as QuoteSubmitResult;
      onSubmitted(result);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

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
      <TextField
        label="Société (optionnel)"
        autoComplete="organization"
        value={fields.company}
        onChange={update("company")}
        error={errors.company}
      />
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
        label="Adresse"
        required
        autoComplete="street-address"
        value={fields.address}
        onChange={update("address")}
        error={errors.address}
      />
      <TextAreaField
        label="Message (optionnel)"
        placeholder="Précisez votre projet, vos délais, vos questions…"
        value={fields.message}
        onChange={update("message")}
        error={errors.message}
      />

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
          "Valider ma demande de devis"
        )}
      </button>
      <p className="text-center text-xs text-bark-muted">
        En validant, vous transmettez votre sélection à Clôtures Morel. Un
        récapitulatif PDF est généré et vous est envoyé par e-mail.
      </p>
    </form>
  );
}

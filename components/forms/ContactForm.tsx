"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { contactSchema } from "@/lib/validation";
import { TextField, TextAreaField } from "@/components/forms/FormField";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { readHoneypot, scrollToFirstFormError } from "@/lib/form-utils";
import { FormSuccessPanel } from "@/components/ui/FormSuccessPanel";

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

const empty: Fields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

export function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update =
    (key: keyof Fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setEmailWarning(null);

    const payload = {
      ...fields,
      phone: fields.phone || undefined,
      _hp: readHoneypot(e.currentTarget),
    };
    const parsed = contactSchema.safeParse(payload);
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
      const res = await fetch("/api/contact", {
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
        title="Message envoyé, merci !"
        message="Nous avons bien reçu votre message et vous répondrons dans les meilleurs délais."
        emailWarning={emailWarning}
      />
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
          label="Téléphone (optionnel)"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={fields.phone}
          onChange={update("phone")}
          error={errors.phone}
        />
      </div>
      <TextAreaField
        label="Message"
        name="message"
        required
        rows={5}
        placeholder="Comment pouvons-nous vous aider ?"
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
          "Envoyer le message"
        )}
      </button>
    </form>
  );
}

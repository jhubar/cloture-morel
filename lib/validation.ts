import { z } from "zod";
import { isValidBelgianVat } from "@/lib/vat";

/**
 * Shared validation schemas (used by API route handlers as the authoritative
 * check, and re-used client-side for lightweight inline validation).
 */

const requiredString = (label: string) =>
  z.string().trim().min(1, `${label} est requis.`);

const optionalVatNumber = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || isValidBelgianVat(v), {
    message: "Numéro de TVA belge invalide (ex. BE 0123.456.789).",
  });

export const materialsQuoteSchema = z.object({
  customer: z.object({
    firstName: requiredString("Le prénom"),
    lastName: requiredString("Le nom"),
    company: z.string().trim().optional(),
    vatNumber: optionalVatNumber,
    email: z.string().trim().email("Adresse e-mail invalide."),
    phone: requiredString("Le téléphone"),
    address: requiredString("L’adresse"),
    message: z.string().trim().max(2000).optional(),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive().max(100000),
      }),
    )
    .min(1, "Votre sélection est vide."),
  _hp: z.string().optional(),
});

export type MaterialsQuoteInput = z.infer<typeof materialsQuoteSchema>;

export const installationQuoteSchema = z.object({
  firstName: requiredString("Le prénom"),
  lastName: requiredString("Le nom"),
  company: z.string().trim().optional(),
  vatNumber: optionalVatNumber,
  email: z.string().trim().email("Adresse e-mail invalide."),
  phone: requiredString("Le téléphone"),
  projectAddress: requiredString("L’adresse du chantier"),
  fenceType: requiredString("Le type de clôture"),
  approximateLength: z.string().trim().optional(),
  terrain: z.string().trim().optional(),
  timing: z.string().trim().optional(),
  message: z.string().trim().max(2000).optional(),
  _hp: z.string().optional(),
});

export type InstallationQuoteInput = z.infer<typeof installationQuoteSchema>;

export const contactSchema = z.object({
  firstName: requiredString("Le prénom"),
  lastName: requiredString("Le nom"),
  email: z.string().trim().email("Adresse e-mail invalide."),
  phone: z.string().trim().optional(),
  message: requiredString("Le message"),
  _hp: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

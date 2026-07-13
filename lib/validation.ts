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
    address: requiredString("L'adresse"),
    message: z.string().trim().max(2000).optional(),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive().max(100000),
        packUnit: z.enum(["sachet", "carton"]).optional(),
      }),
    )
    .min(1, "Votre sélection est vide."),
  _hp: z.string().optional(),
});

export type MaterialsQuoteInput = z.infer<typeof materialsQuoteSchema>;

export const projectLineSchema = z.object({
  familyId: z.string().min(1),
  familyLabel: z.string().min(1),
  categoryId: z.string().min(1),
  categoryTitle: z.string().min(1),
  productId: z.string().min(1),
  productLabel: z.string().min(1),
  article: z.string().trim().optional(),
  variantSummary: z.string().trim().optional(),
  lengthMeters: z.number().positive().max(100_000),
  notes: z.string().trim().max(500).optional(),
});

export type ProjectLineInput = z.infer<typeof projectLineSchema>;

export const installationQuoteSchema = z.object({
  // Contact
  firstName: requiredString("Le prénom"),
  lastName: requiredString("Le nom"),
  company: z.string().trim().optional(),
  vatNumber: optionalVatNumber,
  email: z.string().trim().email("Adresse e-mail invalide."),
  phone: requiredString("Le téléphone"),
  // Project
  projectAddress: requiredString("L'adresse du chantier"),
  projectLines: z
    .array(projectLineSchema)
    .min(1, "Ajoutez au moins une ligne de clôture."),
  fenceRole: z.string().trim().optional(),
  // Site conditions
  hasBarriers: z.enum(["oui", "non", ""]).optional(),
  barriersDetails: z.string().trim().optional(),
  siteAccess: z.enum(["facile", "difficile", "inconnu", ""]).optional(),
  terrainCleared: z.enum(["oui", "non", "partiel", ""]).optional(),
  slope: z.enum(["plat", "leger", "important", ""]).optional(),
  undergroundHazards: z.string().trim().max(1000).optional(),
  // Photos (base64 data, max 5)
  photos: z
    .array(z.object({ name: z.string(), data: z.string(), type: z.string() }))
    .max(5, "Maximum 5 photos.")
    .optional(),
  // Scheduling & notes
  timing: z.string().trim().optional(),
  message: z.string().trim().max(2000).optional(),
  // Legal
  disclaimerAccepted: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions de responsabilité." }),
  }),
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

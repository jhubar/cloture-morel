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
  fenceTypeId: z.string().min(1),
  typeLabel: z.string().min(1),
  measureKind: z.enum(["linear", "quantity"]),
  amount: z.number().positive().max(100_000),
  notes: z.string().trim().max(500).optional(),
});

export type ProjectLineInput = z.infer<typeof projectLineSchema>;

const photoSchema = z.object({
  name: z.string(),
  data: z.string(),
  type: z.string(),
  kind: z.enum(["aerienne", "terrain"]),
});

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
    .min(1, "Ajoutez au moins une clôture."),
  fenceRole: z.string().trim().optional(),
  // Site conditions
  hasBarriers: z.enum(["oui", "non", ""]).optional(),
  barriersDetails: z.string().trim().optional(),
  siteAccess: z.enum(["facile", "difficile", "inconnu", ""]).optional(),
  terrainCleared: z.enum(["oui", "non", "partiel", ""]).optional(),
  slope: z.enum(["plat", "leger", "important", ""]).optional(),
  undergroundHazards: z.string().trim().max(1000).optional(),
  // Photos (base64 data) — at least one aerial view and one terrain photo
  photos: z
    .array(photoSchema)
    .max(6, "Maximum 6 photos.")
    .refine((photos) => photos.some((p) => p.kind === "aerienne"), {
      message: "Ajoutez au moins une vue aérienne.",
    })
    .refine((photos) => photos.some((p) => p.kind === "terrain"), {
      message: "Ajoutez au moins une photo du terrain.",
    }),
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

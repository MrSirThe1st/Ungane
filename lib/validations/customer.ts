import { z } from "zod";

const optionalName = z
  .string()
  .trim()
  .max(80)
  .optional()
  .nullable()
  .transform((v) => (v && v.length > 0 ? v : null));

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => (v && v.length > 0 ? v : null))
  .pipe(z.union([z.string().email("Email invalide"), z.null()]));

const phoneSchema = z
  .string()
  .trim()
  .min(8, "Numéro de téléphone invalide")
  .max(20)
  .regex(/^\+?[0-9\s-]+$/, "Numéro de téléphone invalide");

const tagsSchema = z
  .array(z.string().trim().min(1).max(40))
  .max(20)
  .default([]);

/** Form payload — businessId injected server-side. */
export const createCustomerFormSchema = z.object({
  phoneNumber: phoneSchema,
  firstName: optionalName,
  lastName: optionalName,
  email: optionalEmail,
  tags: tagsSchema,
});

export type CreateCustomerFormInput = z.infer<typeof createCustomerFormSchema>;

export const createCustomerSchema = createCustomerFormSchema.extend({
  businessId: z.string().uuid(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export const updateCustomerFormSchema = z.object({
  id: z.string().uuid(),
  phoneNumber: phoneSchema.optional(),
  firstName: optionalName,
  lastName: optionalName,
  email: optionalEmail,
  tags: tagsSchema.optional(),
});

export type UpdateCustomerFormInput = z.infer<typeof updateCustomerFormSchema>;

export const updateCustomerSchema = updateCustomerFormSchema.extend({
  businessId: z.string().uuid(),
});

export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

export const SUGGESTED_CUSTOMER_TAGS = [
  "Nouveau",
  "VIP",
  "Inactif",
] as const;

export const CUSTOMER_STATUSES = ["Nouveau", "Actif", "VIP", "Inactif"] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export const updateCustomerStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(CUSTOMER_STATUSES),
});

export const addNoteSchema = z.object({
  customerId: z.string().uuid(),
  content: z.string().trim().min(1, "La note ne peut pas être vide.").max(2000),
});

export const deleteNoteSchema = z.object({
  noteId: z.string().uuid(),
  customerId: z.string().uuid(),
});

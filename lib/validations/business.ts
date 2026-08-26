import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => (value && value.length > 0 ? value : null));

export const updateBusinessFormSchema = z.object({
  name: z.string().trim().min(2, "Nom de l’entreprise trop court").max(120),
  industry: optionalText.pipe(z.union([z.string().max(80), z.null()])),
  city: optionalText.pipe(z.union([z.string().max(80), z.null()])),
  phone: optionalText.pipe(z.union([z.string().max(20), z.null()])),
});

export type UpdateBusinessFormInput = z.infer<typeof updateBusinessFormSchema>;

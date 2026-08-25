import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(80),
  email: z.string().trim().email("Email invalide"),
  password: z.string().min(8, "Mot de passe : 8 caractères minimum").max(72),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().trim().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const createBusinessSchema = z.object({
  name: z.string().trim().min(2, "Nom de l’entreprise trop court").max(120),
  industry: z.string().trim().max(80).optional().nullable(),
  city: z.string().trim().max(80).optional().nullable(),
  phone: z.string().trim().max(20).optional().nullable(),
  country: z.string().trim().length(2).default("CD"),
});

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;

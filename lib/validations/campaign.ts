import { z } from "zod";

const tagsSchema = z
  .array(z.string().trim().min(1).max(40))
  .max(50)
  .default([]);

export const createCampaignFormSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(120),
  templateId: z.string().uuid("Modèle requis"),
  audienceTags: tagsSchema,
  scheduledAt: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
});

export type CreateCampaignFormInput = z.infer<typeof createCampaignFormSchema>;

export const createCampaignSchema = createCampaignFormSchema.extend({
  businessId: z.string().uuid(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;

export const sendCampaignSchema = z.object({
  campaignId: z.string().uuid(),
});

export type SendCampaignInput = z.infer<typeof sendCampaignSchema>;

export const createTemplateFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(
      /^[a-z0-9_]+$/,
      "Nom technique : minuscules, chiffres et _ uniquement",
    ),
  displayName: z.string().trim().min(2).max(120),
  body: z.string().trim().min(2).max(1024),
  language: z.string().trim().min(2).max(10).default("fr"),
  category: z.enum(["UTILITY", "MARKETING", "AUTHENTICATION"]).default("MARKETING"),
});

export type CreateTemplateFormInput = z.infer<typeof createTemplateFormSchema>;

export const DEFAULT_MESSAGE_TEMPLATES = [
  {
    name: "bienvenue",
    displayName: "Bienvenue",
    body: "Bonjour {{1}}, bienvenue chez nous ! Comment pouvons-nous vous aider ?",
    category: "UTILITY" as const,
  },
  {
    name: "promo_retour",
    displayName: "Promo retour",
    body: "Bonjour {{1}}, cela fait un moment ! Profitez de notre offre spéciale cette semaine.",
    category: "MARKETING" as const,
  },
  {
    name: "rappel_rdv",
    displayName: "Rappel rendez-vous",
    body: "Bonjour {{1}}, rappel : votre rendez-vous est prévu demain. Répondez OUI pour confirmer.",
    category: "UTILITY" as const,
  },
] as const;

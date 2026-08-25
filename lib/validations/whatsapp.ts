import { z } from "zod";

export const connectWhatsAppSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(8, "Numéro WhatsApp invalide")
    .max(20)
    .regex(/^\+?[0-9\s-]+$/, "Numéro WhatsApp invalide"),
});

export type ConnectWhatsAppInput = z.infer<typeof connectWhatsAppSchema>;

export const stubInboundSchema = z.object({
  businessId: z.string().uuid(),
  fromPhone: z.string().trim().min(8).max(20),
  text: z.string().trim().min(1).max(4096),
  contactName: z.string().trim().max(80).optional().nullable(),
});

export type StubInboundInput = z.infer<typeof stubInboundSchema>;

export const replyMessageSchema = z.object({
  conversationId: z.string().uuid(),
  text: z.string().trim().min(1, "Message vide").max(4096),
});

export type ReplyMessageInput = z.infer<typeof replyMessageSchema>;

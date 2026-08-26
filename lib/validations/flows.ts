import { z } from "zod";

export const FLOW_TYPES = ["booking", "feedback", "reminder"] as const;
export type FlowType = (typeof FLOW_TYPES)[number];

export const setFlowEnabledSchema = z.object({
  flowType: z.enum(FLOW_TYPES),
  enabled: z.boolean(),
});

export type SetFlowEnabledInput = z.infer<typeof setFlowEnabledSchema>;

export const appointmentIdSchema = z.object({
  appointmentId: z.string().uuid(),
});

export type AppointmentIdInput = z.infer<typeof appointmentIdSchema>;

export const BOOKING_KEYWORDS = [
  "rdv",
  "rendez-vous",
  "rendez vous",
  "réserver",
  "reserver",
  "booking",
  "book",
  "prendre rendez",
] as const;

export function matchesBookingKeyword(text: string): boolean {
  const normalized = text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  return BOOKING_KEYWORDS.some((keyword) => {
    const needle = keyword.normalize("NFD").replace(/\p{M}/gu, "");
    return normalized.includes(needle);
  });
}

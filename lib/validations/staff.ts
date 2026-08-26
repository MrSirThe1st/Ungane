import { z } from "zod";

export const inviteStaffSchema = z.object({
  email: z.string().trim().email("Email invalide"),
});

export type InviteStaffInput = z.infer<typeof inviteStaffSchema>;

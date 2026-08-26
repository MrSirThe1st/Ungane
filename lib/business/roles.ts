import { getCurrentMembership } from "@/lib/business/current";
import { SafeError } from "@/lib/errors";
import type { BusinessRole } from "@/types/api";

export async function requireBusinessOwner(): Promise<void> {
  const membership = await getCurrentMembership();
  if (!membership || membership.role !== "business_owner") {
    throw new SafeError("Action réservée au propriétaire de l’entreprise.");
  }
}

export async function isBusinessOwner(): Promise<boolean> {
  const membership = await getCurrentMembership();
  return membership?.role === "business_owner";
}

export async function getCurrentRole(): Promise<BusinessRole | null> {
  const membership = await getCurrentMembership();
  return membership?.role ?? null;
}

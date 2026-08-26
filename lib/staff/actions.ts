"use server";

import { revalidatePath } from "next/cache";

import { requireBusinessOwner } from "@/lib/business/roles";
import { SafeError, withSafeResult } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { inviteStaffSchema } from "@/lib/validations/staff";
import type { ApiResult } from "@/types/api";

export type StaffMemberView = {
  id: string;
  userId: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

function mapRpcError(error: { message?: string }): never {
  const message = error.message ?? "";
  if (message.includes("USER_NOT_FOUND")) {
    throw new SafeError(
      "Aucun compte UNGANE avec cet email. La personne doit d’abord s’inscrire.",
    );
  }
  if (message.includes("ALREADY_MEMBER")) {
    throw new SafeError("Cette personne fait déjà partie de votre équipe.");
  }
  if (message.includes("CANNOT_INVITE_SELF")) {
    throw new SafeError("Vous ne pouvez pas vous inviter vous-même.");
  }
  if (message.includes("Owner access required")) {
    throw new SafeError("Action réservée au propriétaire de l’entreprise.");
  }
  throw new SafeError("Invitation impossible. Réessayez.");
}

export async function listStaffMembers(): Promise<StaffMemberView[]> {
  await requireBusinessOwner();
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("list_business_staff");
  if (error || !data) return [];

  return (data as Array<{
    membership_id: string;
    user_id: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
  }>).map((row) => ({
    id: row.membership_id,
    userId: row.user_id,
    email: row.email,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export async function inviteStaffAction(
  raw: unknown,
): Promise<ApiResult<StaffMemberView>> {
  return withSafeResult(
    async () => {
      await requireBusinessOwner();
      const input = inviteStaffSchema.parse(raw);
      const supabase = await createClient();

      const { data, error } = await supabase.rpc("invite_staff_member", {
        p_email: input.email,
      });

      if (error) {
        mapRpcError(error);
      }

      const row = data as {
        id: string;
        user_id: string;
        role: string;
        status: string;
        created_at: string;
      };

      revalidatePath("/settings");

      return {
        id: row.id,
        userId: row.user_id,
        email: input.email,
        role: row.role,
        status: row.status,
        createdAt: row.created_at,
      };
    },
    {
      context: "inviteStaff",
      fallback: "Invitation impossible. Réessayez.",
    },
  );
}

"use server";

import { revalidatePath } from "next/cache";

import {
  getCurrentBusiness,
  getCurrentMembership,
  requireCurrentBusiness,
} from "@/lib/business/current";
import { SafeError, withSafeResult } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { updateBusinessFormSchema } from "@/lib/validations/business";
import type { ApiResult } from "@/types/api";
import type { Business } from "@/types/domain";

function mapBusiness(row: {
  id: string;
  name: string;
  industry: string | null;
  country: string;
  city: string | null;
  phone: string | null;
  created_at: string;
}): Business {
  return {
    id: row.id,
    name: row.name,
    industry: row.industry,
    country: row.country,
    city: row.city,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

export async function updateBusinessAction(
  raw: unknown,
): Promise<ApiResult<Business>> {
  return withSafeResult(
    async () => {
      const input = updateBusinessFormSchema.parse(raw);
      const membership = await getCurrentMembership();
      if (!membership || membership.role !== "business_owner") {
        throw new SafeError(
          "Seul le propriétaire peut modifier le profil entreprise.",
        );
      }

      const business = await requireCurrentBusiness();
      const supabase = await createClient();
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from("businesses")
        .update({
          name: input.name,
          industry: input.industry,
          city: input.city,
          phone: input.phone,
          updated_at: now,
        })
        .eq("id", business.id)
        .select("id, name, industry, country, city, phone, created_at")
        .single();

      if (error) {
        throw new SafeError("Mise à jour du profil impossible. Réessayez.");
      }

      revalidatePath("/settings");
      revalidatePath("/dashboard");
      return mapBusiness(data);
    },
    {
      context: "updateBusiness",
      fallback: "Mise à jour du profil impossible. Réessayez.",
    },
  );
}

export async function getBusinessProfileForSettings(): Promise<{
  business: Business | null;
  canEdit: boolean;
}> {
  const [business, membership] = await Promise.all([
    getCurrentBusiness(),
    getCurrentMembership(),
  ]);

  return {
    business,
    canEdit: membership?.role === "business_owner",
  };
}

import { cache } from "react";

import { getCachedUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { SafeError } from "@/lib/errors";
import type { Business } from "@/types/domain";

type BusinessRow = {
  id: string;
  name: string;
  industry: string | null;
  country: string;
  city: string | null;
  phone: string | null;
  created_at: string;
};

function mapBusiness(row: BusinessRow): Business {
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

/** Primary active business for the current user (first membership). */
export const getCurrentBusiness = cache(
  async (): Promise<Business | null> => {
    const user = await getCachedUser();
    if (!user) return null;

    const supabase = await createClient();

    const { data: membership, error: membershipError } = await supabase
      .from("business_memberships")
      .select("business_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (membershipError || !membership) return null;

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id, name, industry, country, city, phone, created_at")
      .eq("id", membership.business_id)
      .single();

    if (businessError || !business) return null;
    return mapBusiness(business as BusinessRow);
  },
);

export async function requireCurrentBusiness(): Promise<Business> {
  const business = await getCurrentBusiness();
  if (!business) {
    throw new SafeError("Aucune entreprise active.");
  }
  return business;
}

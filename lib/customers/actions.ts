"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentBusiness } from "@/lib/business/current";
import { SafeError, withSafeResult } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import {
  createCustomerFormSchema,
  updateCustomerFormSchema,
} from "@/lib/validations/customer";
import type { ApiResult } from "@/types/api";

export type CustomerView = {
  id: string;
  phoneNumber: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  tags: string[];
  lastInteractionAt: string | null;
  createdAt: string;
};

function mapCustomer(row: {
  id: string;
  phone_number: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  tags: string[] | null;
  last_interaction_at: string | null;
  created_at: string;
}): CustomerView {
  return {
    id: row.id,
    phoneNumber: row.phone_number,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    tags: row.tags ?? [],
    lastInteractionAt: row.last_interaction_at,
    createdAt: row.created_at,
  };
}

export async function listCustomers(options?: {
  query?: string;
  tag?: string;
}): Promise<CustomerView[]> {
  const business = await requireCurrentBusiness();
  const supabase = await createClient();

  let request = supabase
    .from("customers")
    .select(
      "id, phone_number, first_name, last_name, email, tags, last_interaction_at, created_at",
    )
    .eq("business_id", business.id)
    .order("last_interaction_at", { ascending: false, nullsFirst: false });

  if (options?.tag) {
    request = request.contains("tags", [options.tag]);
  }

  const { data, error } = await request;
  if (error || !data) return [];

  let customers = data.map(mapCustomer);
  const q = options?.query?.trim().toLowerCase();
  if (q) {
    customers = customers.filter((c) => {
      const haystack = [
        c.phoneNumber,
        c.firstName ?? "",
        c.lastName ?? "",
        c.email ?? "",
        ...c.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  return customers;
}

export async function listCustomerTags(): Promise<string[]> {
  const customers = await listCustomers();
  const tags = new Set<string>();
  for (const c of customers) {
    for (const tag of c.tags) tags.add(tag);
  }
  return [...tags].sort((a, b) => a.localeCompare(b, "fr"));
}

export async function getCustomer(
  customerId: string,
): Promise<CustomerView | null> {
  const business = await requireCurrentBusiness();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select(
      "id, phone_number, first_name, last_name, email, tags, last_interaction_at, created_at",
    )
    .eq("business_id", business.id)
    .eq("id", customerId)
    .maybeSingle();

  if (error || !data) return null;
  return mapCustomer(data);
}

export async function getCustomerConversationId(
  customerId: string,
): Promise<string | null> {
  const business = await requireCurrentBusiness();
  const supabase = await createClient();

  const { data } = await supabase
    .from("conversations")
    .select("id")
    .eq("business_id", business.id)
    .eq("customer_id", customerId)
    .maybeSingle();

  return data?.id ?? null;
}

export async function createCustomerAction(
  raw: unknown,
): Promise<ApiResult<CustomerView>> {
  return withSafeResult(
    async () => {
      const input = createCustomerFormSchema.parse(raw);
      const business = await requireCurrentBusiness();
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("customers")
        .insert({
          business_id: business.id,
          phone_number: input.phoneNumber.trim(),
          first_name: input.firstName,
          last_name: input.lastName,
          email: input.email,
          tags: input.tags,
        })
        .select(
          "id, phone_number, first_name, last_name, email, tags, last_interaction_at, created_at",
        )
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new SafeError("Ce numéro existe déjà pour votre entreprise.");
        }
        throw new SafeError("Création du client impossible. Réessayez.");
      }

      revalidatePath("/customers");
      return mapCustomer(data);
    },
    {
      context: "createCustomer",
      fallback: "Création du client impossible. Réessayez.",
    },
  );
}

export async function updateCustomerAction(
  raw: unknown,
): Promise<ApiResult<CustomerView>> {
  return withSafeResult(
    async () => {
      const input = updateCustomerFormSchema.parse(raw);
      const business = await requireCurrentBusiness();
      const supabase = await createClient();
      const now = new Date().toISOString();

      const patch: Record<string, unknown> = { updated_at: now };
      if (input.phoneNumber !== undefined) {
        patch.phone_number = input.phoneNumber.trim();
      }
      if (input.firstName !== undefined) patch.first_name = input.firstName;
      if (input.lastName !== undefined) patch.last_name = input.lastName;
      if (input.email !== undefined) patch.email = input.email;
      if (input.tags !== undefined) patch.tags = input.tags;

      const { data, error } = await supabase
        .from("customers")
        .update(patch)
        .eq("id", input.id)
        .eq("business_id", business.id)
        .select(
          "id, phone_number, first_name, last_name, email, tags, last_interaction_at, created_at",
        )
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new SafeError("Ce numéro existe déjà pour votre entreprise.");
        }
        throw new SafeError("Mise à jour impossible. Réessayez.");
      }

      revalidatePath("/customers");
      revalidatePath(`/customers/${input.id}`);
      return mapCustomer(data);
    },
    {
      context: "updateCustomer",
      fallback: "Mise à jour impossible. Réessayez.",
    },
  );
}

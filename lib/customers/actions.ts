"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentBusiness } from "@/lib/business/current";
import { SafeError, withSafeResult } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import {
  addNoteSchema,
  createCustomerFormSchema,
  deleteNoteSchema,
  updateCustomerFormSchema,
  updateCustomerStatusSchema,
  type CustomerStatus,
} from "@/lib/validations/customer";
import type { ApiResult } from "@/types/api";

export type CustomerView = {
  id: string;
  phoneNumber: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  tags: string[];
  status: CustomerStatus;
  marketingOptIn: boolean;
  lastInteractionAt: string | null;
  createdAt: string;
};

export type CustomerNote = {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
};

export type ConversationSummary = {
  id: string;
  status: string;
  lastMessageAt: string | null;
  messageCount: number;
};

export type AppointmentSummary = {
  id: string;
  serviceName: string;
  scheduledAt: string | null;
  scheduledLabel: string | null;
  status: string;
  feedbackRating: number | null;
};

export type CampaignTouchSummary = {
  id: string;
  campaignName: string;
  status: string;
  sentAt: string | null;
};

export type Customer360 = CustomerView & {
  notes: CustomerNote[];
  conversations: ConversationSummary[];
  appointments: AppointmentSummary[];
  campaignTouches: CampaignTouchSummary[];
};

function mapCustomer(row: {
  id: string;
  phone_number: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  tags: string[] | null;
  status: string | null;
  marketing_opt_in: boolean | null;
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
    status: (row.status ?? "Nouveau") as CustomerStatus,
    marketingOptIn: row.marketing_opt_in ?? true,
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
      "id, phone_number, first_name, last_name, email, tags, status, marketing_opt_in, last_interaction_at, created_at",
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
      "id, phone_number, first_name, last_name, email, tags, status, marketing_opt_in, last_interaction_at, created_at",
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
          "id, phone_number, first_name, last_name, email, tags, status, marketing_opt_in, last_interaction_at, created_at",
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
          "id, phone_number, first_name, last_name, email, tags, status, marketing_opt_in, last_interaction_at, created_at",
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

// ─── Customer 360 ────────────────────────────────────────────────────────────

export async function getCustomer360(
  customerId: string,
): Promise<Customer360 | null> {
  const business = await requireCurrentBusiness();
  const supabase = await createClient();

  // customer
  const { data: c } = await supabase
    .from("customers")
    .select(
      "id, phone_number, first_name, last_name, email, tags, status, marketing_opt_in, last_interaction_at, created_at",
    )
    .eq("business_id", business.id)
    .eq("id", customerId)
    .maybeSingle();

  if (!c) return null;

  // notes
  const { data: notesRaw } = await supabase
    .from("customer_notes")
    .select("id, content, author_id, created_at")
    .eq("business_id", business.id)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  // conversations + message count
  const { data: convsRaw } = await supabase
    .from("conversations")
    .select("id, status, last_message_at")
    .eq("business_id", business.id)
    .eq("customer_id", customerId)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  const convIds = (convsRaw ?? []).map((cv) => cv.id);
  const msgCounts: Record<string, number> = {};
  if (convIds.length > 0) {
    const { data: msgRaw } = await supabase
      .from("messages")
      .select("conversation_id")
      .in("conversation_id", convIds);
    for (const m of msgRaw ?? []) {
      msgCounts[m.conversation_id] = (msgCounts[m.conversation_id] ?? 0) + 1;
    }
  }

  // appointments
  const { data: apptRaw } = await supabase
    .from("appointments")
    .select(
      "id, service_name, scheduled_at, scheduled_label, status, feedback_rating",
    )
    .eq("business_id", business.id)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  // campaign touches
  const { data: touchRaw } = await supabase
    .from("campaign_recipients")
    .select("id, status, sent_at, campaigns(name)")
    .eq("business_id", business.id)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  return {
    ...mapCustomer(c),
    notes: (notesRaw ?? []).map((n) => ({
      id: n.id,
      content: n.content,
      authorId: n.author_id,
      createdAt: n.created_at,
    })),
    conversations: (convsRaw ?? []).map((cv) => ({
      id: cv.id,
      status: cv.status,
      lastMessageAt: cv.last_message_at,
      messageCount: msgCounts[cv.id] ?? 0,
    })),
    appointments: (apptRaw ?? []).map((a) => ({
      id: a.id,
      serviceName: a.service_name,
      scheduledAt: a.scheduled_at,
      scheduledLabel: a.scheduled_label,
      status: a.status,
      feedbackRating: a.feedback_rating,
    })),
    campaignTouches: (touchRaw ?? []).map((t) => ({
      id: t.id,
      campaignName:
        (t.campaigns as unknown as { name: string } | null)?.name ??
        "Campagne",
      status: t.status,
      sentAt: t.sent_at,
    })),
  };
}

export async function updateCustomerStatusAction(
  raw: unknown,
): Promise<ApiResult<CustomerView>> {
  return withSafeResult(
    async () => {
      const input = updateCustomerStatusSchema.parse(raw);
      const business = await requireCurrentBusiness();
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("customers")
        .update({ status: input.status, updated_at: new Date().toISOString() })
        .eq("id", input.id)
        .eq("business_id", business.id)
        .select(
          "id, phone_number, first_name, last_name, email, tags, status, marketing_opt_in, last_interaction_at, created_at",
        )
        .single();

      if (error) throw new SafeError("Mise à jour du statut impossible.");

      revalidatePath(`/customers/${input.id}`);
      return mapCustomer(data);
    },
    {
      context: "updateCustomerStatus",
      fallback: "Mise à jour du statut impossible.",
    },
  );
}

export async function addNoteAction(
  raw: unknown,
): Promise<ApiResult<CustomerNote>> {
  return withSafeResult(
    async () => {
      const input = addNoteSchema.parse(raw);
      const business = await requireCurrentBusiness();
      const supabase = await createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new SafeError("Non authentifié.");

      const { data, error } = await supabase
        .from("customer_notes")
        .insert({
          business_id: business.id,
          customer_id: input.customerId,
          author_id: user.id,
          content: input.content,
        })
        .select("id, content, author_id, created_at")
        .single();

      if (error) throw new SafeError("Impossible d'ajouter la note.");

      revalidatePath(`/customers/${input.customerId}`);
      return {
        id: data.id,
        content: data.content,
        authorId: data.author_id,
        createdAt: data.created_at,
      };
    },
    {
      context: "addNote",
      fallback: "Impossible d'ajouter la note.",
    },
  );
}

export async function deleteNoteAction(
  raw: unknown,
): Promise<ApiResult<{ id: string }>> {
  return withSafeResult(
    async () => {
      const input = deleteNoteSchema.parse(raw);
      const business = await requireCurrentBusiness();
      const supabase = await createClient();

      const { error } = await supabase
        .from("customer_notes")
        .delete()
        .eq("id", input.noteId)
        .eq("business_id", business.id);

      if (error) throw new SafeError("Impossible de supprimer la note.");

      revalidatePath(`/customers/${input.customerId}`);
      return { id: input.noteId };
    },
    {
      context: "deleteNote",
      fallback: "Impossible de supprimer la note.",
    },
  );
}

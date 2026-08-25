"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentBusiness } from "@/lib/business/current";
import { SafeError, withSafeResult } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { getEnv } from "@/config/env";
import {
  sendOutboundMessage,
  getMessagingService,
} from "@/lib/whatsapp";
import {
  connectWhatsAppSchema,
  replyMessageSchema,
} from "@/lib/validations/whatsapp";
import type { ApiResult } from "@/types/api";

export type WhatsAppAccountView = {
  id: string;
  phoneNumber: string;
  provider: "stub" | "meta";
  status: string;
};

export async function getWhatsAppAccount(): Promise<WhatsAppAccountView | null> {
  const business = await requireCurrentBusiness();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("whatsapp_accounts")
    .select("id, phone_number, provider, status")
    .eq("business_id", business.id)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    phoneNumber: data.phone_number,
    provider: data.provider as "stub" | "meta",
    status: data.status,
  };
}

export async function connectWhatsAppAction(
  raw: unknown,
): Promise<ApiResult<WhatsAppAccountView>> {
  return withSafeResult(
    async () => {
      const input = connectWhatsAppSchema.parse(raw);
      const business = await requireCurrentBusiness();
      const supabase = await createClient();
      const provider = getEnv().WHATSAPP_PROVIDER;
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from("whatsapp_accounts")
        .upsert(
          {
            business_id: business.id,
            phone_number: input.phoneNumber.trim(),
            provider,
            status: "connected",
            updated_at: now,
          },
          { onConflict: "business_id" },
        )
        .select("id, phone_number, provider, status")
        .single();

      if (error) {
        throw new SafeError("Connexion WhatsApp impossible. Réessayez.");
      }

      revalidatePath("/settings");
      revalidatePath("/conversations");

      return {
        id: data.id,
        phoneNumber: data.phone_number,
        provider: data.provider as "stub" | "meta",
        status: data.status,
      };
    },
    {
      context: "connectWhatsApp",
      fallback: "Connexion WhatsApp impossible. Réessayez.",
    },
  );
}

export type ConversationListItem = {
  id: string;
  status: string;
  lastMessageAt: string | null;
  customer: {
    id: string;
    phoneNumber: string;
    firstName: string | null;
    lastName: string | null;
  };
  lastMessagePreview: string | null;
};

export async function listConversations(): Promise<ConversationListItem[]> {
  const business = await requireCurrentBusiness();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("conversations")
    .select(
      `
      id,
      status,
      last_message_at,
      customer:customers (
        id,
        phone_number,
        first_name,
        last_name
      )
    `,
    )
    .eq("business_id", business.id)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error || !data) return [];

  const items: ConversationListItem[] = [];

  for (const row of data) {
    const customerRaw = row.customer as
      | {
          id: string;
          phone_number: string;
          first_name: string | null;
          last_name: string | null;
        }
      | {
          id: string;
          phone_number: string;
          first_name: string | null;
          last_name: string | null;
        }[]
      | null;

    const customer = Array.isArray(customerRaw)
      ? customerRaw[0]
      : customerRaw;

    if (!customer) continue;

    const { data: lastMsg } = await supabase
      .from("messages")
      .select("content")
      .eq("conversation_id", row.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    items.push({
      id: row.id,
      status: row.status,
      lastMessageAt: row.last_message_at,
      customer: {
        id: customer.id,
        phoneNumber: customer.phone_number,
        firstName: customer.first_name,
        lastName: customer.last_name,
      },
      lastMessagePreview: lastMsg?.content ?? null,
    });
  }

  return items;
}

export type MessageView = {
  id: string;
  direction: "INBOUND" | "OUTBOUND";
  content: string;
  status: string;
  createdAt: string;
};

export async function getConversationThread(conversationId: string): Promise<{
  conversation: ConversationListItem | null;
  messages: MessageView[];
}> {
  const business = await requireCurrentBusiness();
  const supabase = await createClient();

  const { data: conv, error } = await supabase
    .from("conversations")
    .select(
      `
      id,
      status,
      last_message_at,
      customer:customers (
        id,
        phone_number,
        first_name,
        last_name
      )
    `,
    )
    .eq("id", conversationId)
    .eq("business_id", business.id)
    .maybeSingle();

  if (error || !conv) {
    return { conversation: null, messages: [] };
  }

  const customerRaw = conv.customer as
    | {
        id: string;
        phone_number: string;
        first_name: string | null;
        last_name: string | null;
      }
    | {
        id: string;
        phone_number: string;
        first_name: string | null;
        last_name: string | null;
      }[]
    | null;

  const customer = Array.isArray(customerRaw) ? customerRaw[0] : customerRaw;
  if (!customer) {
    return { conversation: null, messages: [] };
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("id, direction, content, status, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return {
    conversation: {
      id: conv.id,
      status: conv.status,
      lastMessageAt: conv.last_message_at,
      customer: {
        id: customer.id,
        phoneNumber: customer.phone_number,
        firstName: customer.first_name,
        lastName: customer.last_name,
      },
      lastMessagePreview: null,
    },
    messages: (messages ?? []).map((m) => ({
      id: m.id,
      direction: m.direction as "INBOUND" | "OUTBOUND",
      content: m.content,
      status: m.status,
      createdAt: m.created_at,
    })),
  };
}

export async function replyToConversationAction(
  raw: unknown,
): Promise<ApiResult<{ messageId: string }>> {
  return withSafeResult(
    async () => {
      const input = replyMessageSchema.parse(raw);
      const business = await requireCurrentBusiness();
      const supabase = await createClient();

      const { data: conv, error } = await supabase
        .from("conversations")
        .select("id, customer:customers(phone_number)")
        .eq("id", input.conversationId)
        .eq("business_id", business.id)
        .maybeSingle();

      if (error || !conv) {
        throw new SafeError("Conversation introuvable.");
      }

      const customerRaw = conv.customer as
        | { phone_number: string }
        | { phone_number: string }[]
        | null;
      const customer = Array.isArray(customerRaw)
        ? customerRaw[0]
        : customerRaw;

      if (!customer) {
        throw new SafeError("Client introuvable.");
      }

      const messaging = getMessagingService();
      const sendResult = await messaging.sendMessage({
        to: customer.phone_number,
        body: input.text,
        businessId: business.id,
      });

      if (!sendResult.success) {
        throw new SafeError(sendResult.error);
      }

      const persist = await sendOutboundMessage({
        businessId: business.id,
        conversationId: input.conversationId,
        text: input.text,
      });

      if (!persist.success) {
        throw new SafeError(persist.error);
      }

      revalidatePath("/conversations");
      revalidatePath(`/conversations/${input.conversationId}`);

      return persist.data;
    },
    {
      context: "replyToConversation",
      fallback: "Envoi impossible. Réessayez.",
    },
  );
}

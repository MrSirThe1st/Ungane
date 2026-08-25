import { createAdminClient } from "@/lib/supabase/admin";
import { failureResult, withSafeResult } from "@/lib/errors";
import type { ApiResult } from "@/types/api";

export type InboundMessageInput = {
  businessId: string;
  fromPhone: string;
  text: string;
  contactName?: string | null;
  whatsappMessageId?: string | null;
};

export type InboundMessageResult = {
  customerId: string;
  conversationId: string;
  messageId: string;
};

/**
 * Persist an inbound WhatsApp message:
 * upsert customer → upsert conversation → insert message.
 * Uses admin client (webhook has no user session).
 */
export async function ingestInboundMessage(
  input: InboundMessageInput,
): Promise<ApiResult<InboundMessageResult>> {
  const result = await withSafeResult(
    async () => {
      const supabase = createAdminClient();
      const phone = input.fromPhone.trim();
      const now = new Date().toISOString();

      const { data: existingCustomer, error: findCustomerError } = await supabase
        .from("customers")
        .select("id")
        .eq("business_id", input.businessId)
        .eq("phone_number", phone)
        .maybeSingle();

      if (findCustomerError) {
        throw findCustomerError;
      }

      let customerId = existingCustomer?.id as string | undefined;

      if (!customerId) {
        const firstName =
          input.contactName?.trim().split(/\s+/)[0] ?? null;
        const { data: created, error: createCustomerError } = await supabase
          .from("customers")
          .insert({
            business_id: input.businessId,
            phone_number: phone,
            first_name: firstName,
            last_interaction_at: now,
          })
          .select("id")
          .single();

        if (createCustomerError) {
          throw createCustomerError;
        }
        customerId = created.id;
      } else {
        await supabase
          .from("customers")
          .update({ last_interaction_at: now, updated_at: now })
          .eq("id", customerId);
      }

      if (!customerId) {
        throw new Error("Customer id missing after upsert");
      }

      const { data: existingConversation, error: findConvError } =
        await supabase
          .from("conversations")
          .select("id")
          .eq("business_id", input.businessId)
          .eq("customer_id", customerId)
          .maybeSingle();

      if (findConvError) {
        throw findConvError;
      }

      let conversationId = existingConversation?.id as string | undefined;

      if (!conversationId) {
        const { data: createdConv, error: createConvError } = await supabase
          .from("conversations")
          .insert({
            business_id: input.businessId,
            customer_id: customerId,
            status: "open",
            last_message_at: now,
          })
          .select("id")
          .single();

        if (createConvError) {
          throw createConvError;
        }
        conversationId = createdConv.id;
      } else {
        await supabase
          .from("conversations")
          .update({
            status: "open",
            last_message_at: now,
          })
          .eq("id", conversationId);
      }

      if (!conversationId) {
        throw new Error("Conversation id missing after upsert");
      }

      const { data: message, error: messageError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          business_id: input.businessId,
          direction: "INBOUND",
          type: "text",
          content: input.text,
          whatsapp_message_id: input.whatsappMessageId ?? null,
          status: "RECEIVED",
        })
        .select("id")
        .single();

      if (messageError) {
        throw messageError;
      }

      return {
        customerId,
        conversationId,
        messageId: message.id,
      };
    },
    {
      context: "ingestInboundMessage",
      fallback: "Impossible d’enregistrer le message entrant.",
    },
  );

  if (result.success) {
    const { processInboundFlows } = await import("@/lib/flows/engine");
    await processInboundFlows({
      businessId: input.businessId,
      customerId: result.data.customerId,
      conversationId: result.data.conversationId,
      fromPhone: input.fromPhone,
      text: input.text,
    });
  }

  return result;
}

export async function sendOutboundMessage(input: {
  businessId: string;
  conversationId: string;
  text: string;
}): Promise<ApiResult<{ messageId: string }>> {
  return withSafeResult(
    async () => {
      const supabase = createAdminClient();
      const now = new Date().toISOString();

      const { data: message, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: input.conversationId,
          business_id: input.businessId,
          direction: "OUTBOUND",
          type: "text",
          content: input.text,
          status: "SENT",
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      await supabase
        .from("conversations")
        .update({ last_message_at: now })
        .eq("id", input.conversationId);

      return { messageId: message.id };
    },
    {
      context: "sendOutboundMessage",
      fallback: "Impossible d’envoyer le message.",
    },
  );
}

/** Swallow unused import warning if tree-shaken oddly in some bundlers. */
void failureResult;

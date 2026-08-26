"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireCurrentBusiness } from "@/lib/business/current";
import { requireBusinessOwner } from "@/lib/business/roles";
import { SafeError, withSafeResult } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { getMessagingService } from "@/lib/whatsapp";
import {
  createCampaignFormSchema,
  createTemplateFormSchema,
  DEFAULT_MESSAGE_TEMPLATES,
  sendCampaignSchema,
} from "@/lib/validations/campaign";
import type { ApiResult } from "@/types/api";

export type MessageTemplateView = {
  id: string;
  name: string;
  displayName: string;
  body: string;
  language: string;
  category: "UTILITY" | "MARKETING" | "AUTHENTICATION";
  status: string;
};

export type CampaignView = {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  templateDisplayName: string;
  audienceTags: string[];
  status: "draft" | "scheduled" | "sending" | "sent" | "failed";
  scheduledAt: string | null;
  sentAt: string | null;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
};

export type CampaignRecipientView = {
  id: string;
  customerId: string;
  customerName: string;
  phoneNumber: string;
  status: string;
  errorMessage: string | null;
  sentAt: string | null;
};

function mapTemplate(row: {
  id: string;
  name: string;
  display_name: string;
  body: string;
  language: string;
  category: string;
  status: string;
}): MessageTemplateView {
  return {
    id: row.id,
    name: row.name,
    displayName: row.display_name,
    body: row.body,
    language: row.language,
    category: row.category as MessageTemplateView["category"],
    status: row.status,
  };
}

function mapCampaign(row: {
  id: string;
  name: string;
  template_id: string;
  audience_tags: string[] | null;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
  template?:
    | { name: string; display_name: string }
    | { name: string; display_name: string }[]
    | null;
}): CampaignView {
  const templateRaw = row.template;
  const template = Array.isArray(templateRaw) ? templateRaw[0] : templateRaw;

  return {
    id: row.id,
    name: row.name,
    templateId: row.template_id,
    templateName: template?.name ?? "",
    templateDisplayName: template?.display_name ?? "",
    audienceTags: row.audience_tags ?? [],
    status: row.status as CampaignView["status"],
    scheduledAt: row.scheduled_at,
    sentAt: row.sent_at,
    recipientCount: row.recipient_count,
    sentCount: row.sent_count,
    failedCount: row.failed_count,
    createdAt: row.created_at,
  };
}

/** Ensure business has starter stub templates (idempotent). */
export async function ensureDefaultTemplates(): Promise<MessageTemplateView[]> {
  const business = await requireCurrentBusiness();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("message_templates")
    .select(
      "id, name, display_name, body, language, category, status",
    )
    .eq("business_id", business.id);

  if (existing && existing.length > 0) {
    return existing.map(mapTemplate);
  }

  const rows = DEFAULT_MESSAGE_TEMPLATES.map((t) => ({
    business_id: business.id,
    name: t.name,
    display_name: t.displayName,
    body: t.body,
    language: "fr",
    category: t.category,
    status: "approved",
  }));

  const { data, error } = await supabase
    .from("message_templates")
    .insert(rows)
    .select("id, name, display_name, body, language, category, status");

  if (error || !data) {
    return [];
  }

  return data.map(mapTemplate);
}

export async function listTemplates(): Promise<MessageTemplateView[]> {
  return ensureDefaultTemplates();
}

export async function createTemplateAction(
  raw: unknown,
): Promise<ApiResult<MessageTemplateView>> {
  return withSafeResult(
    async () => {
      await requireBusinessOwner();
      const input = createTemplateFormSchema.parse(raw);
      const business = await requireCurrentBusiness();
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("message_templates")
        .insert({
          business_id: business.id,
          name: input.name,
          display_name: input.displayName,
          body: input.body,
          language: input.language,
          category: input.category,
          status: "approved",
        })
        .select("id, name, display_name, body, language, category, status")
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new SafeError("Ce nom de modèle existe déjà.");
        }
        throw new SafeError("Création du modèle impossible. Réessayez.");
      }

      revalidatePath("/campaigns");
      return mapTemplate(data);
    },
    {
      context: "createTemplate",
      fallback: "Création du modèle impossible. Réessayez.",
    },
  );
}

export async function listCampaigns(): Promise<CampaignView[]> {
  const business = await requireCurrentBusiness();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .select(
      `
      id, name, template_id, audience_tags, status, scheduled_at, sent_at,
      recipient_count, sent_count, failed_count, created_at,
      template:message_templates ( name, display_name )
    `,
    )
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapCampaign);
}

export async function getCampaign(
  campaignId: string,
): Promise<CampaignView | null> {
  const business = await requireCurrentBusiness();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .select(
      `
      id, name, template_id, audience_tags, status, scheduled_at, sent_at,
      recipient_count, sent_count, failed_count, created_at,
      template:message_templates ( name, display_name )
    `,
    )
    .eq("business_id", business.id)
    .eq("id", campaignId)
    .maybeSingle();

  if (error || !data) return null;
  return mapCampaign(data);
}

export async function listCampaignRecipients(
  campaignId: string,
): Promise<CampaignRecipientView[]> {
  const business = await requireCurrentBusiness();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaign_recipients")
    .select(
      `
      id, customer_id, status, error_message, sent_at,
      customer:customers ( first_name, last_name, phone_number )
    `,
    )
    .eq("business_id", business.id)
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => {
    const customerRaw = row.customer as
      | {
          first_name: string | null;
          last_name: string | null;
          phone_number: string;
        }
      | {
          first_name: string | null;
          last_name: string | null;
          phone_number: string;
        }[]
      | null;
    const customer = Array.isArray(customerRaw) ? customerRaw[0] : customerRaw;
    const name = customer
      ? [customer.first_name, customer.last_name].filter(Boolean).join(" ")
      : "";

    return {
      id: row.id,
      customerId: row.customer_id,
      customerName: name || customer?.phone_number || "—",
      phoneNumber: customer?.phone_number ?? "—",
      status: row.status,
      errorMessage: row.error_message,
      sentAt: row.sent_at,
    };
  });
}

async function countAudience(
  businessId: string,
  audienceTags: string[],
): Promise<number> {
  const supabase = await createClient();
  let request = supabase
    .from("customers")
    .select("id", { count: "exact", head: true })
    .eq("business_id", businessId)
    .eq("marketing_opt_in", true);

  if (audienceTags.length > 0) {
    request = request.overlaps("tags", audienceTags);
  }

  const { count } = await request;
  return count ?? 0;
}

export async function createCampaignAction(
  raw: unknown,
): Promise<ApiResult<CampaignView>> {
  const result = await withSafeResult(
    async () => {
      await requireBusinessOwner();
      const input = createCampaignFormSchema.parse(raw);
      const business = await requireCurrentBusiness();
      const supabase = await createClient();

      const { data: template, error: templateError } = await supabase
        .from("message_templates")
        .select("id")
        .eq("business_id", business.id)
        .eq("id", input.templateId)
        .maybeSingle();

      if (templateError || !template) {
        throw new SafeError("Modèle introuvable.");
      }

      const scheduledAt = input.scheduledAt || null;
      const status = scheduledAt ? "scheduled" : "draft";
      const audienceTags = input.audienceTags;
      const recipientCount = await countAudience(business.id, audienceTags);

      const { data, error } = await supabase
        .from("campaigns")
        .insert({
          business_id: business.id,
          name: input.name,
          template_id: input.templateId,
          audience_tags: audienceTags,
          status,
          scheduled_at: scheduledAt,
          recipient_count: recipientCount,
        })
        .select(
          `
          id, name, template_id, audience_tags, status, scheduled_at, sent_at,
          recipient_count, sent_count, failed_count, created_at,
          template:message_templates ( name, display_name )
        `,
        )
        .single();

      if (error || !data) {
        throw new SafeError("Création de la campagne impossible. Réessayez.");
      }

      return mapCampaign(data);
    },
    {
      context: "createCampaign",
      fallback: "Création de la campagne impossible. Réessayez.",
    },
  );

  if (result.success) {
    revalidatePath("/campaigns");
    redirect(`/campaigns/${result.data.id}`);
  }

  return result;
}

export async function sendCampaignAction(
  raw: unknown,
): Promise<ApiResult<CampaignView>> {
  return withSafeResult(
    async () => {
      await requireBusinessOwner();
      const input = sendCampaignSchema.parse(raw);
      const business = await requireCurrentBusiness();
      const supabase = await createClient();
      const now = new Date().toISOString();

      const { data: account } = await supabase
        .from("whatsapp_accounts")
        .select("id, status")
        .eq("business_id", business.id)
        .maybeSingle();

      if (!account || account.status !== "connected") {
        throw new SafeError(
          "Connectez WhatsApp dans Paramètres avant d’envoyer.",
        );
      }

      const { data: campaign, error: campaignError } = await supabase
        .from("campaigns")
        .select(
          `
          id, name, template_id, audience_tags, status, scheduled_at, sent_at,
          recipient_count, sent_count, failed_count, created_at,
          template:message_templates ( name, display_name, language )
        `,
        )
        .eq("business_id", business.id)
        .eq("id", input.campaignId)
        .maybeSingle();

      if (campaignError || !campaign) {
        throw new SafeError("Campagne introuvable.");
      }

      if (campaign.status === "sent" || campaign.status === "sending") {
        throw new SafeError("Cette campagne a déjà été envoyée.");
      }

      const templateRaw = campaign.template as
        | { name: string; display_name: string; language: string }
        | { name: string; display_name: string; language: string }[]
        | null;
      const template = Array.isArray(templateRaw)
        ? templateRaw[0]
        : templateRaw;

      if (!template) {
        throw new SafeError("Modèle introuvable.");
      }

      await supabase
        .from("campaigns")
        .update({ status: "sending", updated_at: now })
        .eq("id", campaign.id);

      const audienceTags = (campaign.audience_tags as string[]) ?? [];
      let customersQuery = supabase
        .from("customers")
        .select("id, phone_number, first_name, marketing_opt_in, tags")
        .eq("business_id", business.id)
        .eq("marketing_opt_in", true);

      if (audienceTags.length > 0) {
        customersQuery = customersQuery.overlaps("tags", audienceTags);
      }

      const { data: customers, error: customersError } = await customersQuery;
      if (customersError) {
        throw new SafeError("Impossible de charger l’audience.");
      }

      const messaging = getMessagingService();
      let sentCount = 0;
      let failedCount = 0;
      const recipients = customers ?? [];

      for (const customer of recipients) {
        const firstName = customer.first_name?.trim() || "client";
        const sendResult = await messaging.sendTemplate({
          to: customer.phone_number,
          templateName: template.name,
          language: template.language,
          businessId: business.id,
          variables: { "1": firstName },
        });

        if (sendResult.success) {
          sentCount += 1;
          await supabase.from("campaign_recipients").upsert(
            {
              campaign_id: campaign.id,
              business_id: business.id,
              customer_id: customer.id,
              status: "sent",
              provider_message_id: sendResult.data.id,
              sent_at: now,
              error_message: null,
            },
            { onConflict: "campaign_id,customer_id" },
          );
        } else {
          failedCount += 1;
          await supabase.from("campaign_recipients").upsert(
            {
              campaign_id: campaign.id,
              business_id: business.id,
              customer_id: customer.id,
              status: "failed",
              error_message: sendResult.error,
              sent_at: null,
            },
            { onConflict: "campaign_id,customer_id" },
          );
        }
      }

      const finalStatus =
        recipients.length === 0
          ? "failed"
          : failedCount === recipients.length
            ? "failed"
            : "sent";

      const { data: updated, error: updateError } = await supabase
        .from("campaigns")
        .update({
          status: finalStatus,
          sent_at: now,
          recipient_count: recipients.length,
          sent_count: sentCount,
          failed_count: failedCount,
          updated_at: now,
        })
        .eq("id", campaign.id)
        .select(
          `
          id, name, template_id, audience_tags, status, scheduled_at, sent_at,
          recipient_count, sent_count, failed_count, created_at,
          template:message_templates ( name, display_name )
        `,
        )
        .single();

      if (updateError || !updated) {
        throw new SafeError("Envoi terminé mais mise à jour impossible.");
      }

      if (recipients.length === 0) {
        throw new SafeError(
          "Aucun destinataire (opt-in marketing + tags). Ajoutez des clients.",
        );
      }

      revalidatePath("/campaigns");
      revalidatePath(`/campaigns/${campaign.id}`);
      return mapCampaign(updated);
    },
    {
      context: "sendCampaign",
      fallback: "Envoi de la campagne impossible. Réessayez.",
    },
  );
}

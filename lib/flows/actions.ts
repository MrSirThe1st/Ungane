"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentBusiness } from "@/lib/business/current";
import { SafeError, withSafeResult } from "@/lib/errors";
import {
  sendUpcomingReminders,
  startFeedbackFlow,
} from "@/lib/flows/engine";
import { createClient } from "@/lib/supabase/server";
import {
  appointmentIdSchema,
  FLOW_TYPES,
  setFlowEnabledSchema,
  type FlowType,
} from "@/lib/validations/flows";
import type { ApiResult } from "@/types/api";

export type FlowSettingView = {
  flowType: FlowType;
  enabled: boolean;
  title: string;
  description: string;
};

export type AppointmentView = {
  id: string;
  serviceName: string;
  scheduledLabel: string | null;
  scheduledAt: string | null;
  status: string;
  feedbackRating: number | null;
  reminderSentAt: string | null;
  feedbackSentAt: string | null;
  createdAt: string;
  customer: {
    id: string;
    phoneNumber: string;
    firstName: string | null;
    lastName: string | null;
  };
};

const FLOW_META: Record<
  FlowType,
  { title: string; description: string }
> = {
  booking: {
    title: "Réservation",
    description:
      "Détecte RDV / réserver dans WhatsApp et guide service → date → confirmation.",
  },
  feedback: {
    title: "Avis client",
    description: "Envoie une demande de note 1–5 après un rendez-vous.",
  },
  reminder: {
    title: "Rappel",
    description: "Envoie un rappel WhatsApp pour les RDV confirmés.",
  },
};

export async function listFlowSettings(): Promise<FlowSettingView[]> {
  const business = await requireCurrentBusiness();
  const supabase = await createClient();

  const { data } = await supabase
    .from("flow_settings")
    .select("flow_type, enabled")
    .eq("business_id", business.id);

  const byType = new Map(
    (data ?? []).map((row) => [row.flow_type as FlowType, row.enabled]),
  );

  return FLOW_TYPES.map((flowType) => ({
    flowType,
    enabled: byType.get(flowType) ?? false,
    title: FLOW_META[flowType].title,
    description: FLOW_META[flowType].description,
  }));
}

export async function setFlowEnabledAction(
  raw: unknown,
): Promise<ApiResult<FlowSettingView>> {
  return withSafeResult(
    async () => {
      const input = setFlowEnabledSchema.parse(raw);
      const business = await requireCurrentBusiness();
      const supabase = await createClient();
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from("flow_settings")
        .upsert(
          {
            business_id: business.id,
            flow_type: input.flowType,
            enabled: input.enabled,
            updated_at: now,
          },
          { onConflict: "business_id,flow_type" },
        )
        .select("flow_type, enabled")
        .single();

      if (error || !data) {
        throw new SafeError("Impossible de mettre à jour le flux.");
      }

      revalidatePath("/flows");
      return {
        flowType: data.flow_type as FlowType,
        enabled: data.enabled,
        title: FLOW_META[data.flow_type as FlowType].title,
        description: FLOW_META[data.flow_type as FlowType].description,
      };
    },
    {
      context: "setFlowEnabled",
      fallback: "Impossible de mettre à jour le flux.",
    },
  );
}

export async function listAppointments(): Promise<AppointmentView[]> {
  const business = await requireCurrentBusiness();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id, service_name, scheduled_label, scheduled_at, status,
      feedback_rating, reminder_sent_at, feedback_sent_at, created_at,
      customer:customers ( id, phone_number, first_name, last_name )
    `,
    )
    .eq("business_id", business.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data) return [];

  return data.flatMap((row) => {
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
    const customer = Array.isArray(customerRaw) ? customerRaw[0] : customerRaw;
    if (!customer) return [];

    return [
      {
        id: row.id,
        serviceName: row.service_name,
        scheduledLabel: row.scheduled_label,
        scheduledAt: row.scheduled_at,
        status: row.status,
        feedbackRating: row.feedback_rating,
        reminderSentAt: row.reminder_sent_at,
        feedbackSentAt: row.feedback_sent_at,
        createdAt: row.created_at,
        customer: {
          id: customer.id,
          phoneNumber: customer.phone_number,
          firstName: customer.first_name,
          lastName: customer.last_name,
        },
      },
    ];
  });
}

export async function sendRemindersAction(): Promise<
  ApiResult<{ sent: number; skipped: number }>
> {
  return withSafeResult(
    async () => {
      const business = await requireCurrentBusiness();
      const result = await sendUpcomingReminders({ businessId: business.id });
      revalidatePath("/flows");
      revalidatePath("/conversations");
      return result;
    },
    {
      context: "sendReminders",
      fallback: "Envoi des rappels impossible.",
    },
  );
}

export async function requestFeedbackAction(
  raw: unknown,
): Promise<ApiResult<{ ok: true }>> {
  return withSafeResult(
    async () => {
      const input = appointmentIdSchema.parse(raw);
      const business = await requireCurrentBusiness();
      const result = await startFeedbackFlow({
        businessId: business.id,
        appointmentId: input.appointmentId,
      });
      if (!result.ok) {
        throw new SafeError(result.error);
      }
      revalidatePath("/flows");
      revalidatePath("/conversations");
      return { ok: true as const };
    },
    {
      context: "requestFeedback",
      fallback: "Demande d’avis impossible.",
    },
  );
}

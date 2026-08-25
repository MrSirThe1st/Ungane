import { createAdminClient } from "@/lib/supabase/admin";
import { getMessagingService } from "@/lib/whatsapp";
import { sendOutboundMessage } from "@/lib/whatsapp/inbound";
import { BOOKING_KEYWORDS } from "@/lib/validations/flows";

type FlowContext = {
  service?: string;
  dateLabel?: string;
  appointmentId?: string;
};

async function isFlowEnabled(
  businessId: string,
  flowType: "booking" | "feedback" | "reminder",
): Promise<boolean> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("flow_settings")
    .select("enabled")
    .eq("business_id", businessId)
    .eq("flow_type", flowType)
    .maybeSingle();
  return Boolean(data?.enabled);
}

async function replyAndPersist(input: {
  businessId: string;
  conversationId: string;
  toPhone: string;
  text: string;
}) {
  const messaging = getMessagingService();
  await messaging.sendMessage({
    to: input.toPhone,
    body: input.text,
    businessId: input.businessId,
  });
  await sendOutboundMessage({
    businessId: input.businessId,
    conversationId: input.conversationId,
    text: input.text,
  });
}

function looksLikeBookingIntent(text: string): boolean {
  const normalized = text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  return BOOKING_KEYWORDS.some((kw) => {
    const needle = kw.normalize("NFD").replace(/\p{M}/gu, "");
    return normalized.includes(needle);
  });
}

/**
 * Advance or start stub flow templates after an inbound message is stored.
 * Failures are logged; inbound ingest must not fail because of flows.
 */
export async function processInboundFlows(input: {
  businessId: string;
  customerId: string;
  conversationId: string;
  fromPhone: string;
  text: string;
}): Promise<void> {
  try {
    const supabase = createAdminClient();
    const now = new Date().toISOString();
    const text = input.text.trim();

    const { data: activeRun } = await supabase
      .from("flow_runs")
      .select("id, flow_type, current_step, context")
      .eq("business_id", input.businessId)
      .eq("customer_id", input.customerId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (activeRun?.flow_type === "booking") {
      await advanceBookingRun({
        runId: activeRun.id,
        step: activeRun.current_step,
        context: (activeRun.context ?? {}) as FlowContext,
        businessId: input.businessId,
        customerId: input.customerId,
        conversationId: input.conversationId,
        fromPhone: input.fromPhone,
        text,
        now,
      });
      return;
    }

    if (activeRun?.flow_type === "feedback") {
      await advanceFeedbackRun({
        runId: activeRun.id,
        context: (activeRun.context ?? {}) as FlowContext,
        businessId: input.businessId,
        conversationId: input.conversationId,
        fromPhone: input.fromPhone,
        text,
        now,
      });
      return;
    }

    if (
      (await isFlowEnabled(input.businessId, "booking")) &&
      looksLikeBookingIntent(text)
    ) {
      const { data: run, error } = await supabase
        .from("flow_runs")
        .insert({
          business_id: input.businessId,
          customer_id: input.customerId,
          conversation_id: input.conversationId,
          flow_type: "booking",
          status: "active",
          current_step: "ask_service",
          context: {},
        })
        .select("id")
        .single();

      if (error || !run) {
        console.error("[flows] start booking failed", error);
        return;
      }

      await replyAndPersist({
        businessId: input.businessId,
        conversationId: input.conversationId,
        toPhone: input.fromPhone,
        text: "Parfait ! Quel service souhaitez-vous réserver ?",
      });
    }
  } catch (error) {
    console.error("[flows] processInboundFlows", error);
  }
}

async function advanceBookingRun(input: {
  runId: string;
  step: string;
  context: FlowContext;
  businessId: string;
  customerId: string;
  conversationId: string;
  fromPhone: string;
  text: string;
  now: string;
}) {
  const supabase = createAdminClient();

  if (input.step === "ask_service") {
    const service = input.text.slice(0, 120);
    await supabase
      .from("flow_runs")
      .update({
        current_step: "ask_date",
        context: { ...input.context, service },
        updated_at: input.now,
      })
      .eq("id", input.runId);

    await replyAndPersist({
      businessId: input.businessId,
      conversationId: input.conversationId,
      toPhone: input.fromPhone,
      text: `Noté : ${service}. Quelle date / heure ? (ex. demain 15h)`,
    });
    return;
  }

  if (input.step === "ask_date") {
    const dateLabel = input.text.slice(0, 120);
    await supabase
      .from("flow_runs")
      .update({
        current_step: "confirm",
        context: { ...input.context, dateLabel },
        updated_at: input.now,
      })
      .eq("id", input.runId);

    await replyAndPersist({
      businessId: input.businessId,
      conversationId: input.conversationId,
      toPhone: input.fromPhone,
      text: `Confirmez : ${input.context.service} — ${dateLabel}. Répondez OUI pour valider.`,
    });
    return;
  }

  if (input.step === "confirm") {
    if (/^annul/i.test(input.text.trim())) {
      await supabase
        .from("flow_runs")
        .update({ status: "cancelled", updated_at: input.now })
        .eq("id", input.runId);
      await replyAndPersist({
        businessId: input.businessId,
        conversationId: input.conversationId,
        toPhone: input.fromPhone,
        text: "Rendez-vous annulé. Écrivez RDV quand vous voudrez recommencer.",
      });
      return;
    }

    const yes = /^(oui|ok|yes|confirm|valide|d['’]?accord)\b/i.test(
      input.text.trim(),
    );
    if (!yes) {
      await replyAndPersist({
        businessId: input.businessId,
        conversationId: input.conversationId,
        toPhone: input.fromPhone,
        text: "Répondez OUI pour confirmer, ou écrivez ANNULER.",
      });
      return;
    }

    const service = input.context.service ?? "Service";
    const dateLabel = input.context.dateLabel ?? "à confirmer";

    const { data: appointment } = await supabase
      .from("appointments")
      .insert({
        business_id: input.businessId,
        customer_id: input.customerId,
        flow_run_id: input.runId,
        service_name: service,
        scheduled_label: dateLabel,
        status: "confirmed",
      })
      .select("id")
      .single();

    await supabase
      .from("flow_runs")
      .update({
        status: "completed",
        current_step: "done",
        context: {
          ...input.context,
          appointmentId: appointment?.id,
        },
        updated_at: input.now,
      })
      .eq("id", input.runId);

    await replyAndPersist({
      businessId: input.businessId,
      conversationId: input.conversationId,
      toPhone: input.fromPhone,
      text: `Confirmé ✅ ${service} — ${dateLabel}. À bientôt !`,
    });
  }
}

async function advanceFeedbackRun(input: {
  runId: string;
  context: FlowContext;
  businessId: string;
  conversationId: string;
  fromPhone: string;
  text: string;
  now: string;
}) {
  const supabase = createAdminClient();
  const ratingMatch = input.text.trim().match(/^[1-5]\b/);
  const rating = ratingMatch ? Number(ratingMatch[0]) : null;

  if (!rating) {
    await replyAndPersist({
      businessId: input.businessId,
      conversationId: input.conversationId,
      toPhone: input.fromPhone,
      text: "Merci de répondre avec une note de 1 à 5.",
    });
    return;
  }

  if (input.context.appointmentId) {
    await supabase
      .from("appointments")
      .update({
        feedback_rating: rating,
        feedback_comment: input.text.slice(0, 500),
        updated_at: input.now,
      })
      .eq("id", input.context.appointmentId);
  }

  await supabase
    .from("flow_runs")
    .update({
      status: "completed",
      current_step: "done",
      updated_at: input.now,
    })
    .eq("id", input.runId);

  await replyAndPersist({
    businessId: input.businessId,
    conversationId: input.conversationId,
    toPhone: input.fromPhone,
    text: `Merci pour votre note ${rating}/5 !`,
  });
}

/** Start feedback flow for an appointment (staff-triggered). */
export async function startFeedbackFlow(input: {
  businessId: string;
  appointmentId: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  if (!(await isFlowEnabled(input.businessId, "feedback"))) {
    return { ok: false, error: "Flux feedback désactivé." };
  }

  const { data: appointment } = await supabase
    .from("appointments")
    .select(
      `
      id, customer_id, status, feedback_sent_at,
      customer:customers ( phone_number )
    `,
    )
    .eq("business_id", input.businessId)
    .eq("id", input.appointmentId)
    .maybeSingle();

  if (!appointment) {
    return { ok: false, error: "Rendez-vous introuvable." };
  }

  const customerRaw = appointment.customer as
    | { phone_number: string }
    | { phone_number: string }[]
    | null;
  const customer = Array.isArray(customerRaw) ? customerRaw[0] : customerRaw;
  if (!customer) {
    return { ok: false, error: "Client introuvable." };
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("business_id", input.businessId)
    .eq("customer_id", appointment.customer_id)
    .maybeSingle();

  if (!conversation) {
    return { ok: false, error: "Aucune conversation pour ce client." };
  }

  const { data: run, error } = await supabase
    .from("flow_runs")
    .insert({
      business_id: input.businessId,
      customer_id: appointment.customer_id,
      conversation_id: conversation.id,
      flow_type: "feedback",
      status: "active",
      current_step: "ask_rating",
      context: { appointmentId: appointment.id },
    })
    .select("id")
    .single();

  if (error || !run) {
    return { ok: false, error: "Impossible de démarrer le feedback." };
  }

  await replyAndPersist({
    businessId: input.businessId,
    conversationId: conversation.id,
    toPhone: customer.phone_number,
    text: "Comment s’est passé votre rendez-vous ? Répondez avec une note de 1 à 5.",
  });

  await supabase
    .from("appointments")
    .update({
      status: "completed",
      feedback_sent_at: now,
      updated_at: now,
    })
    .eq("id", appointment.id);

  return { ok: true };
}

/** Send reminder messages for upcoming confirmed appointments (next 48h or unlabeled). */
export async function sendUpcomingReminders(input: {
  businessId: string;
}): Promise<{ sent: number; skipped: number }> {
  const supabase = createAdminClient();
  const now = new Date();
  const nowIso = now.toISOString();

  if (!(await isFlowEnabled(input.businessId, "reminder"))) {
    return { sent: 0, skipped: 0 };
  }

  const { data: appointments } = await supabase
    .from("appointments")
    .select(
      `
      id, customer_id, service_name, scheduled_label, scheduled_at, reminder_sent_at,
      customer:customers ( phone_number )
    `,
    )
    .eq("business_id", input.businessId)
    .eq("status", "confirmed")
    .is("reminder_sent_at", null)
    .order("created_at", { ascending: false })
    .limit(50);

  let sent = 0;
  let skipped = 0;

  for (const appt of appointments ?? []) {
    const customerRaw = appt.customer as
      | { phone_number: string }
      | { phone_number: string }[]
      | null;
    const customer = Array.isArray(customerRaw) ? customerRaw[0] : customerRaw;
    if (!customer) {
      skipped += 1;
      continue;
    }

    const { data: conversation } = await supabase
      .from("conversations")
      .select("id")
      .eq("business_id", input.businessId)
      .eq("customer_id", appt.customer_id)
      .maybeSingle();

    if (!conversation) {
      skipped += 1;
      continue;
    }

    const when = appt.scheduled_label ?? "bientôt";
    const text = `Rappel : ${appt.service_name} — ${when}. Répondez OUI si toujours OK.`;

    await replyAndPersist({
      businessId: input.businessId,
      conversationId: conversation.id,
      toPhone: customer.phone_number,
      text,
    });

    await supabase
      .from("appointments")
      .update({ reminder_sent_at: nowIso, updated_at: nowIso })
      .eq("id", appt.id);

    sent += 1;
  }

  return { sent, skipped };
}

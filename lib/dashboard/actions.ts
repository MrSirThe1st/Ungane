"use server";

import { requireCurrentBusiness } from "@/lib/business/current";
import { customerDisplayName } from "@/lib/customers/display";
import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  totalCustomers: number;
  newCustomersLast30Days: number;
  openConversations: number;
  messagesSent: number;
  messagesReceived: number;
  upcomingAppointments: number;
};

export type DashboardAppointmentPreview = {
  id: string;
  serviceName: string;
  scheduledLabel: string | null;
  scheduledAt: string | null;
  customerName: string;
};

function thirtyDaysAgoIso(): string {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString();
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const business = await requireCurrentBusiness();
  const supabase = await createClient();
  const since = thirtyDaysAgoIso();
  const now = new Date().toISOString();

  const [
    totalCustomers,
    newCustomers,
    openConversations,
    messagesSent,
    messagesReceived,
    upcomingAppointments,
  ] = await Promise.all([
    supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("business_id", business.id),
    supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("business_id", business.id)
      .gte("created_at", since),
    supabase
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .eq("business_id", business.id)
      .eq("status", "open"),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("business_id", business.id)
      .eq("direction", "OUTBOUND"),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("business_id", business.id)
      .eq("direction", "INBOUND"),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("business_id", business.id)
      .in("status", ["pending", "confirmed"])
      .or(`scheduled_at.is.null,scheduled_at.gte.${now}`),
  ]);

  return {
    totalCustomers: totalCustomers.count ?? 0,
    newCustomersLast30Days: newCustomers.count ?? 0,
    openConversations: openConversations.count ?? 0,
    messagesSent: messagesSent.count ?? 0,
    messagesReceived: messagesReceived.count ?? 0,
    upcomingAppointments: upcomingAppointments.count ?? 0,
  };
}

export async function listUpcomingAppointments(
  limit = 5,
): Promise<DashboardAppointmentPreview[]> {
  const business = await requireCurrentBusiness();
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      service_name,
      scheduled_label,
      scheduled_at,
      customer:customers ( phone_number, first_name, last_name )
    `,
    )
    .eq("business_id", business.id)
    .in("status", ["pending", "confirmed"])
    .or(`scheduled_at.is.null,scheduled_at.gte.${now}`)
    .order("scheduled_at", { ascending: true, nullsFirst: false })
    .limit(limit);

  if (error || !data) return [];

  return data.flatMap((row) => {
    const customerRaw = row.customer as
      | {
          phone_number: string;
          first_name: string | null;
          last_name: string | null;
        }
      | {
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
        customerName: customerDisplayName({
          phoneNumber: customer.phone_number,
          firstName: customer.first_name,
          lastName: customer.last_name,
        }),
      },
    ];
  });
}

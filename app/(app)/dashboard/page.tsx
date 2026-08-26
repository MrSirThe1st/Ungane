import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appConfig } from "@/config/app";
import { isBusinessOwner } from "@/lib/business/roles";
import { getCurrentBusiness } from "@/lib/business/current";
import {
  getDashboardStats,
  listUpcomingAppointments,
} from "@/lib/dashboard/actions";
import { formatDateTime } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";

export const revalidate = 60;

function formatAppointmentWhen(
  scheduledAt: string | null,
  scheduledLabel: string | null,
): string {
  if (scheduledAt) {
    return formatDateTime(scheduledAt);
  }
  return scheduledLabel ?? "Date à préciser";
}

export default async function DashboardPage() {
  const business = await getCurrentBusiness();
  if (!business) redirect("/onboarding");

  const [stats, upcomingAppointments, canManageCampaigns] = await Promise.all([
    getDashboardStats(),
    listUpcomingAppointments(5),
    isBusinessOwner(),
  ]);

  const statCards = [
    {
      title: "Clients",
      value: stats.totalCustomers,
      description: `${stats.newCustomersLast30Days} nouveau${stats.newCustomersLast30Days > 1 ? "x" : ""} (30 j)`,
    },
    {
      title: "Conversations ouvertes",
      value: stats.openConversations,
      description: "Threads actifs dans l’inbox",
    },
    {
      title: "Messages envoyés",
      value: stats.messagesSent,
      description: `${stats.messagesReceived} reçus`,
    },
    {
      title: "Rendez-vous à venir",
      value: stats.upcomingAppointments,
      description: "Confirmés ou en attente",
    },
  ] as const;

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description={`Vue d’ensemble — ${business.name}`}
      />
      <div className="flex-1 space-y-8 px-4 py-6 md:px-8">
        <section className="bg-brand-mint border-brand-lime/30 rounded-2xl border px-5 py-5 md:px-6">
          <p className="text-brand text-xs font-semibold tracking-wide uppercase">
            Bienvenue
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight md:text-2xl">
            {business.name}
          </h2>
          <p className="text-muted-foreground mt-1 max-w-xl text-sm">
            Gérez vos clients, conversations et campagnes WhatsApp depuis un
            seul espace.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold">Indicateurs</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <Card key={card.title}>
                <CardHeader>
                  <CardDescription>{card.title}</CardDescription>
                  <CardTitle className="text-3xl tabular-nums">
                    {card.value}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold">Actions rapides</h2>
          <DashboardQuickActions canManageCampaigns={canManageCampaigns} />
        </section>

        <section>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-semibold">Prochains rendez-vous</h2>
            <Link
              href={appConfig.routes.flows}
              className="text-muted-foreground text-xs underline underline-offset-4"
            >
              Voir les flux
            </Link>
          </div>
          {upcomingAppointments.length === 0 ? (
            <EmptyState
              title="Aucun rendez-vous à venir"
              description="Activez la réservation dans Flux pour collecter des RDV via WhatsApp."
              actionHref={appConfig.routes.flows}
              actionLabel="Configurer les flux"
            />
          ) : (
            <ul className="divide-border border-border bg-card max-w-2xl divide-y rounded-xl border shadow-sm">
              {upcomingAppointments.map((appointment) => (
                <li key={appointment.id} className="px-4 py-3">
                  <p className="font-medium">{appointment.customerName}</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {appointment.serviceName} ·{" "}
                    {formatAppointmentWhen(
                      appointment.scheduledAt,
                      appointment.scheduledLabel,
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

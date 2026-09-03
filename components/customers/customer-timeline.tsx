import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate, formatDateTime } from "@/lib/utils";
import type {
  AppointmentSummary,
  CampaignTouchSummary,
  ConversationSummary,
} from "@/lib/customers/actions";

type Props = {
  conversations: ConversationSummary[];
  appointments: AppointmentSummary[];
  campaignTouches: CampaignTouchSummary[];
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wide">
      {children}
    </h3>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-border bg-card rounded-xl border px-4 py-3 text-sm shadow-sm">
      {children}
    </div>
  );
}

function apptStatusTone(status: string): "success" | "warning" | "info" | "muted" {
  switch (status) {
    case "confirmed": return "success";
    case "completed": return "info";
    case "cancelled": return "warning";
    default: return "muted";
  }
}

function apptStatusLabel(status: string) {
  switch (status) {
    case "confirmed": return "Confirmé";
    case "completed": return "Terminé";
    case "cancelled": return "Annulé";
    default: return status;
  }
}

function campaignStatusTone(status: string): "success" | "warning" | "info" | "muted" {
  switch (status) {
    case "sent": return "success";
    case "failed": return "warning";
    case "pending": return "info";
    default: return "muted";
  }
}

function campaignStatusLabel(status: string) {
  switch (status) {
    case "sent": return "Envoyé";
    case "failed": return "Échoué";
    case "pending": return "En attente";
    case "skipped": return "Ignoré";
    default: return status;
  }
}

export function CustomerTimeline({
  conversations,
  appointments,
  campaignTouches,
}: Props) {
  const empty =
    conversations.length === 0 &&
    appointments.length === 0 &&
    campaignTouches.length === 0;

  if (empty) {
    return (
      <p className="text-muted-foreground text-sm">
        Aucune activité enregistrée pour ce client.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {conversations.length > 0 && (
        <div>
          <SectionTitle>Conversations</SectionTitle>
          <div className="flex flex-col gap-2">
            {conversations.map((cv) => (
              <Card key={cv.id}>
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/conversations/${cv.id}`}
                    className="text-primary font-medium underline-offset-2 hover:underline"
                  >
                    Voir la conversation →
                  </Link>
                  <StatusBadge
                    label={cv.status === "open" ? "Ouverte" : "Fermée"}
                    tone={cv.status === "open" ? "success" : "muted"}
                  />
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {cv.messageCount} message{cv.messageCount !== 1 ? "s" : ""}
                  {cv.lastMessageAt
                    ? ` · Dernier message le ${formatDate(cv.lastMessageAt)}`
                    : ""}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {appointments.length > 0 && (
        <div>
          <SectionTitle>Rendez-vous</SectionTitle>
          <div className="flex flex-col gap-2">
            {appointments.map((a) => (
              <Card key={a.id}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{a.serviceName}</span>
                  <StatusBadge
                    label={apptStatusLabel(a.status)}
                    tone={apptStatusTone(a.status)}
                  />
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {a.scheduledLabel ??
                    (a.scheduledAt ? formatDateTime(a.scheduledAt) : "Date non définie")}
                  {a.feedbackRating != null
                    ? ` · Note : ${a.feedbackRating}/5`
                    : ""}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {campaignTouches.length > 0 && (
        <div>
          <SectionTitle>Campagnes</SectionTitle>
          <div className="flex flex-col gap-2">
            {campaignTouches.map((t) => (
              <Card key={t.id}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{t.campaignName}</span>
                  <StatusBadge
                    label={campaignStatusLabel(t.status)}
                    tone={campaignStatusTone(t.status)}
                  />
                </div>
                {t.sentAt ? (
                  <p className="text-muted-foreground mt-1 text-xs">
                    Envoyé le {formatDate(t.sentAt)}
                  </p>
                ) : null}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

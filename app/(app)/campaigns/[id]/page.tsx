import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { SendCampaignButton } from "@/components/campaigns/send-campaign-button";
import { PageHeader } from "@/components/shared/page-header";
import {
  StatusBadge,
  campaignStatusTone,
} from "@/components/shared/status-badge";
import { getCurrentBusiness } from "@/lib/business/current";
import { isBusinessOwner } from "@/lib/business/roles";
import {
  getCampaign,
  listCampaignRecipients,
} from "@/lib/campaigns/actions";
import { formatDateTime } from "@/lib/utils";

export const revalidate = 60;

type Props = {
  params: Promise<{ id: string }>;
};

const statusLabel: Record<string, string> = {
  draft: "Brouillon",
  scheduled: "Planifiée",
  sending: "Envoi…",
  sent: "Envoyée",
  failed: "Échouée",
};

const recipientStatusLabel: Record<string, string> = {
  pending: "En attente",
  sent: "Envoyé",
  failed: "Échec",
  delivered: "Distribué",
  read: "Lu",
};

export default async function CampaignDetailPage({ params }: Props) {
  const business = await getCurrentBusiness();
  if (!business) redirect("/onboarding");

  const { id } = await params;
  const [campaign, canManageCampaigns] = await Promise.all([
    getCampaign(id),
    isBusinessOwner(),
  ]);
  if (!campaign) notFound();

  const recipients = await listCampaignRecipients(id);
  const canSend =
    canManageCampaigns &&
    (campaign.status === "draft" || campaign.status === "scheduled");

  return (
    <>
      <PageHeader
        title={campaign.name}
        description={campaign.templateDisplayName}
      />
      <div className="flex-1 px-4 py-6 md:px-8">
        <Link
          href="/campaigns"
          className="text-muted-foreground mb-4 inline-block text-sm underline-offset-4 hover:underline"
        >
          ← Campagnes
        </Link>

        <div className="mb-4">
          <StatusBadge
            label={statusLabel[campaign.status] ?? campaign.status}
            tone={campaignStatusTone(campaign.status)}
          />
        </div>

        <div className="text-muted-foreground mb-6 max-w-lg space-y-1 text-sm">
          <p>
            Modèle : {campaign.templateDisplayName} ({campaign.templateName})
          </p>
          <p>
            Audience :{" "}
            {campaign.audienceTags.length > 0
              ? campaign.audienceTags.join(", ")
              : "tous les clients opt-in"}
          </p>
          <p>
            Destinataires : {campaign.sentCount}/{campaign.recipientCount}
            {campaign.failedCount > 0
              ? ` · ${campaign.failedCount} échecs`
              : ""}
          </p>
          {campaign.scheduledAt ? (
            <p>Planifiée : {formatDateTime(campaign.scheduledAt)}</p>
          ) : null}
          {campaign.sentAt ? (
            <p>Envoyée : {formatDateTime(campaign.sentAt)}</p>
          ) : null}
        </div>

        {canSend ? (
          <div className="mb-8">
            <SendCampaignButton campaignId={campaign.id} />
          </div>
        ) : null}

        {recipients.length > 0 ? (
          <>
            <h2 className="mb-3 text-base font-semibold">Destinataires</h2>
            <ul className="divide-border border-border bg-card max-w-2xl divide-y rounded-xl border shadow-sm">
              {recipients.map((r) => (
                <li key={r.id} className="px-4 py-3 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <Link
                      href={`/customers/${r.customerId}`}
                      className="text-brand font-medium underline-offset-4 hover:underline"
                    >
                      {r.customerName}
                    </Link>
                    <span className="text-muted-foreground text-xs">
                      {recipientStatusLabel[r.status] ?? r.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1">{r.phoneNumber}</p>
                  {r.errorMessage ? (
                    <p className="text-destructive mt-1 text-xs">
                      {r.errorMessage}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </>
  );
}

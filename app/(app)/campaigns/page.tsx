import Link from "next/link";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { getCurrentBusiness } from "@/lib/business/current";
import { isBusinessOwner } from "@/lib/business/roles";
import { listCampaigns, listTemplates } from "@/lib/campaigns/actions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  draft: "Brouillon",
  scheduled: "Planifiée",
  sending: "Envoi…",
  sent: "Envoyée",
  failed: "Échouée",
};

export default async function CampaignsPage() {
  const business = await getCurrentBusiness();
  if (!business) redirect("/onboarding");

  const [campaigns, templates, canManageCampaigns] = await Promise.all([
    listCampaigns(),
    listTemplates(),
    isBusinessOwner(),
  ]);

  return (
    <>
      <PageHeader
        title="Campagnes"
        description="Envois ciblés via modèles WhatsApp"
      />
      <div className="flex-1 px-4 py-6 md:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            {templates.length} modèle{templates.length > 1 ? "s" : ""} · stub
            Meta plus tard
          </p>
          {canManageCampaigns ? (
            <Link href="/campaigns/new" className={cn(buttonVariants())}>
              Nouvelle campagne
            </Link>
          ) : (
            <p className="text-muted-foreground text-xs">
              Réservé au propriétaire
            </p>
          )}
        </div>

        {campaigns.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Aucune campagne. Créez-en une avec un modèle et des tags clients.
          </p>
        ) : (
          <ul className="divide-border border-border max-w-3xl divide-y rounded-lg border">
            {campaigns.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/campaigns/${c.id}`}
                  className="hover:bg-muted/50 block px-4 py-3 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-medium">{c.name}</p>
                    <span className="text-muted-foreground text-xs">
                      {statusLabel[c.status] ?? c.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {c.templateDisplayName || c.templateName}
                    {c.audienceTags.length > 0
                      ? ` · tags : ${c.audienceTags.join(", ")}`
                      : " · toute l’audience opt-in"}
                  </p>
                  {c.status === "sent" || c.sentCount > 0 ? (
                    <p className="text-muted-foreground mt-1 text-xs">
                      {c.sentCount}/{c.recipientCount} envoyés
                      {c.failedCount > 0 ? ` · ${c.failedCount} échecs` : ""}
                    </p>
                  ) : (
                    <p className="text-muted-foreground mt-1 text-xs">
                      ~{c.recipientCount} destinataire
                      {c.recipientCount !== 1 ? "s" : ""} estimés
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

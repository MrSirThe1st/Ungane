import Link from "next/link";
import { redirect } from "next/navigation";

import { CampaignForm } from "@/components/campaigns/campaign-form";
import { PageHeader } from "@/components/shared/page-header";
import { getCurrentBusiness } from "@/lib/business/current";
import { isBusinessOwner } from "@/lib/business/roles";
import { listTemplates } from "@/lib/campaigns/actions";
import { listCustomerTags } from "@/lib/customers/actions";

export const dynamic = "force-dynamic";

export default async function NewCampaignPage() {
  const business = await getCurrentBusiness();
  if (!business) redirect("/onboarding");

  const canManageCampaigns = await isBusinessOwner();
  if (!canManageCampaigns) redirect("/campaigns");

  const [templates, knownTags] = await Promise.all([
    listTemplates(),
    listCustomerTags(),
  ]);

  return (
    <>
      <PageHeader
        title="Nouvelle campagne"
        description="Choisissez un modèle et une audience"
      />
      <div className="flex-1 px-4 py-6 md:px-8">
        <Link
          href="/campaigns"
          className="text-muted-foreground mb-4 inline-block text-sm underline-offset-4 hover:underline"
        >
          ← Campagnes
        </Link>
        <CampaignForm templates={templates} knownTags={knownTags} />
      </div>
    </>
  );
}

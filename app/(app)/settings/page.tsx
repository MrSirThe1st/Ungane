import { redirect } from "next/navigation";

import { BusinessProfileForm } from "@/components/settings/business-profile-form";
import { StaffPanel } from "@/components/settings/staff-panel";
import { WhatsAppConnectForm } from "@/components/settings/whatsapp-connect-form";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { getEnv } from "@/config/env";
import { getBusinessProfileForSettings } from "@/lib/business/actions";
import { isBusinessOwner } from "@/lib/business/roles";
import { listStaffMembers } from "@/lib/staff/actions";
import { getWhatsAppAccount } from "@/lib/whatsapp/actions";

export const revalidate = 60;

export default async function SettingsPage() {
  const { business, canEdit } = await getBusinessProfileForSettings();
  if (!business) redirect("/onboarding");

  const [account, provider, isOwner] = await Promise.all([
    getWhatsAppAccount(),
    Promise.resolve(getEnv().WHATSAPP_PROVIDER),
    isBusinessOwner(),
  ]);
  const staff = isOwner ? await listStaffMembers() : [];

  const providerLabel =
    provider === "stub" ? "mode test" : "Meta Cloud API";

  return (
    <>
      <PageHeader
        title="Paramètres"
        description={`${business.name} · WhatsApp (${providerLabel})`}
      />
      <div className="flex-1 space-y-10 px-4 py-6 md:px-8">
        <section>
          <BusinessProfileForm business={business} canEdit={canEdit} />
        </section>

        {isOwner ? (
          <section>
            <StaffPanel staff={staff} />
          </section>
        ) : null}

        {isOwner ? (
          <section>
            <h2 className="mb-3 text-base font-semibold">Connexion WhatsApp</h2>
            <WhatsAppConnectForm
              key={account?.phoneNumber ?? "new"}
              account={account}
            />
          </section>
        ) : (
          <section>
            <h2 className="mb-3 text-base font-semibold">Connexion WhatsApp</h2>
            <EmptyState
              title="Accès propriétaire requis"
              description="Seul le propriétaire peut connecter ou modifier le numéro WhatsApp Business."
            />
          </section>
        )}
      </div>
    </>
  );
}

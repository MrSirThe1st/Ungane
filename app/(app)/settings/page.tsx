import { redirect } from "next/navigation";

import { BusinessProfileForm } from "@/components/settings/business-profile-form";
import { WhatsAppConnectForm } from "@/components/settings/whatsapp-connect-form";
import { PageHeader } from "@/components/shared/page-header";
import { getEnv } from "@/config/env";
import { getBusinessProfileForSettings } from "@/lib/business/actions";
import { getWhatsAppAccount } from "@/lib/whatsapp/actions";

export const revalidate = 60;

export default async function SettingsPage() {
  const { business, canEdit } = await getBusinessProfileForSettings();
  if (!business) redirect("/onboarding");

  const [account, provider] = await Promise.all([
    getWhatsAppAccount(),
    Promise.resolve(getEnv().WHATSAPP_PROVIDER),
  ]);

  return (
    <>
      <PageHeader
        title="Paramètres"
        description={`${business.name} · WhatsApp (${provider})`}
      />
      <div className="flex-1 space-y-10 px-4 py-6 md:px-8">
        <section>
          <BusinessProfileForm business={business} canEdit={canEdit} />
        </section>

        <section>
          <h2 className="mb-3 text-base font-medium">Connexion WhatsApp</h2>
          <WhatsAppConnectForm
            key={account?.phoneNumber ?? "new"}
            account={account}
          />
        </section>
      </div>
    </>
  );
}

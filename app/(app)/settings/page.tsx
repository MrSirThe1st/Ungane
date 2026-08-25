import { redirect } from "next/navigation";

import { WhatsAppConnectForm } from "@/components/settings/whatsapp-connect-form";
import { PageHeader } from "@/components/shared/page-header";
import { getEnv } from "@/config/env";
import { getCurrentBusiness } from "@/lib/business/current";
import { getWhatsAppAccount } from "@/lib/whatsapp/actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const business = await getCurrentBusiness();
  if (!business) redirect("/onboarding");

  const account = await getWhatsAppAccount();
  const provider = getEnv().WHATSAPP_PROVIDER;

  return (
    <>
      <PageHeader
        title="Paramètres"
        description={`${business.name} · WhatsApp (${provider})`}
      />
      <div className="flex-1 px-4 py-6 md:px-8">
        <h2 className="mb-3 text-base font-medium">Connexion WhatsApp</h2>
        <WhatsAppConnectForm
          key={account?.phoneNumber ?? "new"}
          account={account}
        />
      </div>
    </>
  );
}

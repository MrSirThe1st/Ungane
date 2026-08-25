import { redirect } from "next/navigation";

import { OnboardingForm } from "@/components/auth/onboarding-form";
import { appConfig } from "@/config/app";
import { getActiveMembershipCount, requireAuthOnly } from "@/lib/auth/actions";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  await requireAuthOnly();
  const memberships = await getActiveMembershipCount();
  if (memberships > 0) {
    redirect(appConfig.routes.dashboard);
  }

  return (
    <div className="bg-background flex min-h-full flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <p className="text-2xl font-semibold tracking-tight">
          {appConfig.name}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          Dernière étape : votre entreprise
        </p>
      </div>
      <OnboardingForm />
    </div>
  );
}

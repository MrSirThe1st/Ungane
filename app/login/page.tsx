import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { appConfig } from "@/config/app";
import { getActiveMembershipCount, getAuthSession } from "@/lib/auth/actions";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getAuthSession();
  if (session) {
    const memberships = await getActiveMembershipCount();
    redirect(
      memberships < 1
        ? appConfig.routes.onboarding
        : appConfig.routes.dashboard,
    );
  }

  return (
    <div className="bg-background flex min-h-full flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <p className="text-2xl font-semibold tracking-tight">
          {appConfig.name}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          Relations clients via WhatsApp
        </p>
      </div>
      <LoginForm />
    </div>
  );
}

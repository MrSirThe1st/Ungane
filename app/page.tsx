import { redirect } from "next/navigation";

import { appConfig } from "@/config/app";
import { getActiveMembershipCount, getAuthSession } from "@/lib/auth/actions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getAuthSession();
  if (!session) {
    redirect(appConfig.routes.login);
  }

  const memberships = await getActiveMembershipCount();
  redirect(
    memberships < 1 ? appConfig.routes.onboarding : appConfig.routes.dashboard,
  );
}

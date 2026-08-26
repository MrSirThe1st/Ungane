import { AppShell } from "@/components/layout/app-shell";
import { QueryProvider } from "@/components/providers/query-provider";
import { requireAppAccess } from "@/lib/auth/actions";
import { getCurrentBusiness } from "@/lib/business/current";

/**
 * Persistent shell for flat app routes.
 * Requires auth + at least one business membership.
 */
export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAppAccess();
  const business = await getCurrentBusiness();

  return (
    <QueryProvider>
      <AppShell
        businessName={business?.name ?? null}
        businessId={business?.id ?? null}
      >
        {children}
      </AppShell>
    </QueryProvider>
  );
}

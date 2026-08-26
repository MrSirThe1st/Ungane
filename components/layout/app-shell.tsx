import { AppSidebar } from "@/components/layout/app-sidebar";
import { BrandProvider } from "@/components/providers/brand-provider";

type AppShellProps = {
  children: React.ReactNode;
  businessName?: string | null;
  businessId?: string | null;
};

/** Persistent authenticated-app chrome. Used from `app/(app)/layout.tsx`. */
export function AppShell({
  children,
  businessName,
  businessId,
}: AppShellProps) {
  return (
    <BrandProvider businessName={businessName} businessId={businessId}>
      <div className="bg-background flex min-h-full flex-1 flex-col md:flex-row">
        <AppSidebar />
        <main className="flex flex-1 flex-col md:min-w-0">{children}</main>
      </div>
    </BrandProvider>
  );
}

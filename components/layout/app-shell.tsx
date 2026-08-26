import { AppSidebar } from "@/components/layout/app-sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

/** Persistent authenticated-app chrome. Used from `app/(app)/layout.tsx`. */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="bg-background flex min-h-full flex-1 flex-col md:flex-row">
      <AppSidebar />
      <main className="flex flex-1 flex-col md:min-w-0">{children}</main>
    </div>
  );
}

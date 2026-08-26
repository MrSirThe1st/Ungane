"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { useAppName, useProductName } from "@/hooks/use-app-name";
import { appConfig } from "@/config/app";
import { signOutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

const navItems = [
  { href: appConfig.routes.dashboard, label: "Tableau de bord" },
  { href: appConfig.routes.customers, label: "Clients" },
  { href: appConfig.routes.conversations, label: "Conversations" },
  { href: appConfig.routes.campaigns, label: "Campagnes" },
  { href: appConfig.routes.flows, label: "Flux" },
  { href: appConfig.routes.settings, label: "Paramètres" },
] as const;

function SignOutButton({ className }: { className?: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        "text-muted-foreground hover:text-foreground justify-start",
        className,
      )}
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await signOutAction();
        });
      }}
    >
      {pending ? "Déconnexion…" : "Se déconnecter"}
    </Button>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const productName = useProductName();
  const businessLabel = useAppName();
  const showBusiness =
    businessLabel.trim().toLowerCase() !== productName.trim().toLowerCase();

  return (
    <aside className="border-sidebar-border bg-sidebar text-sidebar-foreground flex w-full flex-col border-b shadow-sm md:w-60 md:border-r md:border-b-0 md:shadow-none">
      <div className="flex items-start justify-between gap-2 px-4 py-5">
        <div className="min-w-0">
          <Link
            href="/dashboard"
            className="text-brand text-lg font-bold tracking-tight"
          >
            {productName}
          </Link>
          <p className="text-muted-foreground mt-1 truncate text-xs">
            {showBusiness ? businessLabel : "Relations clients WhatsApp"}
          </p>
        </div>
        <SignOutButton className="h-8 shrink-0 px-2 text-xs md:hidden" />
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-1 md:flex-col md:gap-1 md:pb-6">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm"
                  : "text-sidebar-foreground hover:bg-muted",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-sidebar-border mt-auto hidden border-t p-3 md:block">
        <SignOutButton className="w-full" />
      </div>
    </aside>
  );
}

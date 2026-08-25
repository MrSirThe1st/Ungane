"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
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

export function AppSidebar() {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <aside className="border-border bg-sidebar text-sidebar-foreground flex w-full flex-col border-b md:w-56 md:border-r md:border-b-0">
      <div className="px-4 py-5">
        <Link
          href="/dashboard"
          className="text-lg font-semibold tracking-tight"
        >
          {appConfig.name}
        </Link>
        <p className="text-muted-foreground mt-1 text-xs">
          Relations clients WhatsApp
        </p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-1 md:flex-col md:pb-6">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm whitespace-nowrap transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "hover:bg-sidebar-accent/70",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-border mt-auto hidden border-t p-3 md:block">
        <Button
          type="button"
          variant="ghost"
          className="text-sidebar-foreground w-full justify-start"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              await signOutAction();
            });
          }}
        >
          {pending ? "Déconnexion…" : "Se déconnecter"}
        </Button>
      </div>
    </aside>
  );
}

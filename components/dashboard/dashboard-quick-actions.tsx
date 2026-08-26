import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { appConfig } from "@/config/app";
import { cn } from "@/lib/utils";

const actions = [
  {
    href: appConfig.routes.conversations,
    label: "Ouvrir l’inbox",
    description: "Répondre aux messages WhatsApp",
  },
  {
    href: `${appConfig.routes.customers}/new`,
    label: "Ajouter un client",
    description: "Créer une fiche manuellement",
  },
  {
    href: `${appConfig.routes.campaigns}/new`,
    label: "Lancer une campagne",
    description: "Envoyer un message groupé",
  },
] as const;

export function DashboardQuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-auto flex-col items-start gap-1 px-4 py-3 text-left whitespace-normal",
          )}
        >
          <span className="font-medium">{action.label}</span>
          <span className="text-muted-foreground text-xs font-normal">
            {action.description}
          </span>
        </Link>
      ))}
    </div>
  );
}

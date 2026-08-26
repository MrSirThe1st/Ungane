import Link from "next/link";
import { redirect } from "next/navigation";

import { StubInboundSimulator } from "@/components/conversations/stub-inbound-simulator";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  StatusBadge,
  conversationStatusTone,
} from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getEnv } from "@/config/env";
import { getCurrentBusiness } from "@/lib/business/current";
import { customerDisplayName } from "@/lib/customers/display";
import { formatDateTime } from "@/lib/utils";
import {
  getWhatsAppAccount,
  listConversations,
} from "@/lib/whatsapp/actions";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ConversationsPage({ searchParams }: Props) {
  const business = await getCurrentBusiness();
  if (!business) redirect("/onboarding");

  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const [conversations, account] = await Promise.all([
    listConversations({ query: query || undefined }),
    getWhatsAppAccount(),
  ]);
  const isStub = getEnv().WHATSAPP_PROVIDER === "stub";

  return (
    <>
      <PageHeader
        title="Conversations"
        description="Boîte de réception WhatsApp"
      />
      <div className="flex-1 px-4 py-6 md:px-8">
        {!account ? (
          <EmptyState
            title="WhatsApp non connecté"
            description="Connectez votre numéro WhatsApp Business pour recevoir et répondre aux messages."
            actionHref="/settings"
            actionLabel="Ouvrir les paramètres"
          />
        ) : (
          <form className="mb-4 flex flex-wrap gap-2" method="get">
            <Input
              name="q"
              defaultValue={query}
              placeholder="Rechercher nom ou téléphone…"
              className="max-w-sm"
            />
            <Button type="submit" variant="secondary">
              Rechercher
            </Button>
          </form>
        )}

        {account && conversations.length === 0 ? (
          <EmptyState
            className="mt-2"
            title={
              query
                ? "Aucune conversation trouvée"
                : "Boîte de réception vide"
            }
            description={
              query
                ? "Aucun client ne correspond à votre recherche."
                : isStub
                  ? "Simulez un message entrant ci-dessous pour démarrer une conversation de test."
                  : "Les nouveaux messages WhatsApp apparaîtront ici."
            }
          />
        ) : null}

        {conversations.length > 0 ? (
          <ul className="divide-border border-border bg-card mt-2 max-w-2xl divide-y rounded-xl border shadow-sm">
            {conversations.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/conversations/${c.id}`}
                  className="hover:bg-muted/50 block px-4 py-3 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-medium">
                      {customerDisplayName(c.customer)}
                    </p>
                    {c.lastMessageAt ? (
                      <time className="text-muted-foreground text-xs">
                        {formatDateTime(c.lastMessageAt)}
                      </time>
                    ) : null}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusBadge
                      label={c.status === "open" ? "Ouverte" : "Fermée"}
                      tone={conversationStatusTone(c.status)}
                    />
                    <p className="text-muted-foreground truncate text-sm">
                      {c.lastMessagePreview ?? "—"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {isStub && account ? (
          <StubInboundSimulator businessId={business.id} />
        ) : null}
      </div>
    </>
  );
}

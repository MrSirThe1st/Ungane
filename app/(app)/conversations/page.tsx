import Link from "next/link";
import { redirect } from "next/navigation";

import { StubInboundSimulator } from "@/components/conversations/stub-inbound-simulator";
import { PageHeader } from "@/components/shared/page-header";
import { getEnv } from "@/config/env";
import { getCurrentBusiness } from "@/lib/business/current";
import { listConversations } from "@/lib/whatsapp/actions";
import { getWhatsAppAccount } from "@/lib/whatsapp/actions";

export const dynamic = "force-dynamic";

function displayName(item: {
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string;
}) {
  const name = [item.firstName, item.lastName].filter(Boolean).join(" ");
  return name || item.phoneNumber;
}

export default async function ConversationsPage() {
  const business = await getCurrentBusiness();
  if (!business) redirect("/onboarding");

  const [conversations, account] = await Promise.all([
    listConversations(),
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
          <p className="text-muted-foreground text-sm">
            Connectez d’abord WhatsApp dans{" "}
            <Link href="/settings" className="underline underline-offset-4">
              Paramètres
            </Link>
            .
          </p>
        ) : null}

        {conversations.length === 0 ? (
          <p className="text-muted-foreground mt-4 text-sm">
            Aucune conversation pour le moment.
          </p>
        ) : (
          <ul className="divide-border border-border mt-2 max-w-2xl divide-y rounded-lg border">
            {conversations.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/conversations/${c.id}`}
                  className="hover:bg-muted/50 block px-4 py-3 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-medium">
                      {displayName(c.customer)}
                    </p>
                    {c.lastMessageAt ? (
                      <time className="text-muted-foreground text-xs">
                        {new Date(c.lastMessageAt).toLocaleString("fr-CD")}
                      </time>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground mt-1 truncate text-sm">
                    {c.lastMessagePreview ?? "—"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {isStub && account ? (
          <StubInboundSimulator businessId={business.id} />
        ) : null}
      </div>
    </>
  );
}

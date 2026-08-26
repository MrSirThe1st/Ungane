import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ReplyForm } from "@/components/conversations/reply-form";
import { PageHeader } from "@/components/shared/page-header";
import { getCurrentBusiness } from "@/lib/business/current";
import { cn, formatTime } from "@/lib/utils";
import { getConversationThread } from "@/lib/whatsapp/actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ConversationDetailPage({ params }: Props) {
  const business = await getCurrentBusiness();
  if (!business) redirect("/onboarding");

  const { id } = await params;
  const { conversation, messages } = await getConversationThread(id);
  if (!conversation) notFound();

  const title =
    [conversation.customer.firstName, conversation.customer.lastName]
      .filter(Boolean)
      .join(" ") || conversation.customer.phoneNumber;

  return (
    <>
      <PageHeader
        title={title}
        description={conversation.customer.phoneNumber}
      />
      <div className="flex flex-1 flex-col px-4 py-6 md:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <Link
            href="/conversations"
            className="text-muted-foreground text-sm underline-offset-4 hover:underline"
          >
            ← Conversations
          </Link>
          <Link
            href={`/customers/${conversation.customer.id}`}
            className="text-brand text-sm font-medium underline-offset-4 hover:underline"
          >
            Voir la fiche client
          </Link>
        </div>

        <div className="border-border bg-card flex max-w-2xl flex-1 flex-col gap-3 rounded-2xl border p-4 shadow-sm">
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Aucun message dans cette conversation.
            </p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                  m.direction === "INBOUND"
                    ? "bg-brand-mint text-foreground self-start"
                    : "bg-primary text-primary-foreground self-end",
                )}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
                <p
                  className={cn(
                    "mt-1 text-[10px] opacity-70",
                    m.direction === "OUTBOUND" && "text-right",
                  )}
                >
                  {formatTime(m.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="mt-auto max-w-2xl pt-4">
          <ReplyForm conversationId={conversation.id} />
        </div>
      </div>
    </>
  );
}

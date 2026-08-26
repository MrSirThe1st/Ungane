import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CustomerForm } from "@/components/customers/customer-form";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { getCurrentBusiness } from "@/lib/business/current";
import {
  getCustomer,
  getCustomerConversationId,
  listCustomerTags,
} from "@/lib/customers/actions";
import { customerDisplayName } from "@/lib/customers/display";
import { cn, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDetailPage({ params }: Props) {
  const business = await getCurrentBusiness();
  if (!business) redirect("/onboarding");

  const { id } = await params;
  const [customer, knownTags, conversationId] = await Promise.all([
    getCustomer(id),
    listCustomerTags(),
    getCustomerConversationId(id),
  ]);

  if (!customer) notFound();

  return (
    <>
      <PageHeader
        title={customerDisplayName(customer)}
        description={customer.phoneNumber}
      />
      <div className="flex-1 px-4 py-6 md:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href="/customers"
            className="text-muted-foreground text-sm underline-offset-4 hover:underline"
          >
            ← Clients
          </Link>
          {conversationId ? (
            <Link
              href={`/conversations/${conversationId}`}
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
              )}
            >
              Voir la conversation
            </Link>
          ) : null}
        </div>

        <div className="text-muted-foreground mb-6 max-w-lg text-sm">
          {customer.email ? <p>Email : {customer.email}</p> : null}
          {customer.lastInteractionAt ? (
            <p>
              Dernière interaction : {formatDateTime(customer.lastInteractionAt)}
            </p>
          ) : (
            <p>Aucune interaction WhatsApp encore.</p>
          )}
        </div>

        <h2 className="mb-3 text-base font-medium">Modifier</h2>
        <CustomerForm
          mode="edit"
          customer={customer}
          knownTags={knownTags}
        />
      </div>
    </>
  );
}

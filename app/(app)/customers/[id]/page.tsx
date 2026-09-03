import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CustomerNotes } from "@/components/customers/customer-notes";
import { CustomerStatusSelect } from "@/components/customers/customer-status-select";
import { CustomerTimeline } from "@/components/customers/customer-timeline";
import { CustomerForm } from "@/components/customers/customer-form";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { getCurrentBusiness } from "@/lib/business/current";
import {
  getCustomer360,
  listCustomerTags,
} from "@/lib/customers/actions";
import { customerDisplayName } from "@/lib/customers/display";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDetailPage({ params }: Props) {
  const business = await getCurrentBusiness();
  if (!business) redirect("/onboarding");

  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [customer, knownTags] = await Promise.all([
    getCustomer360(id),
    listCustomerTags(),
  ]);

  if (!customer) notFound();

  const displayName = customerDisplayName(customer);

  return (
    <>
      <PageHeader title={displayName} description={customer.phoneNumber} />

      <div className="flex-1 px-4 py-6 md:px-8">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/customers"
            className="text-muted-foreground text-sm underline-offset-4 hover:underline"
          >
            ← Clients
          </Link>
        </div>

        {/* ── Identity card ── */}
        <section className="border-border bg-card mb-6 rounded-2xl border p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">{displayName}</h2>
              <p className="text-muted-foreground text-sm">{customer.phoneNumber}</p>
              {customer.email ? (
                <p className="text-muted-foreground text-sm">{customer.email}</p>
              ) : null}
            </div>

            {/* Status selector */}
            <CustomerStatusSelect
              customerId={customer.id}
              current={customer.status}
            />
          </div>

          {/* Tags */}
          {customer.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {customer.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-accent text-accent-foreground rounded-full px-2.5 py-0.5 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* Key dates */}
          <div className="text-muted-foreground mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs">
            <span>
              Client depuis le{" "}
              <span className="text-foreground font-medium">
                {formatDate(customer.createdAt)}
              </span>
            </span>
            {customer.lastInteractionAt ? (
              <span>
                Dernière interaction le{" "}
                <span className="text-foreground font-medium">
                  {formatDateTime(customer.lastInteractionAt)}
                </span>
              </span>
            ) : (
              <span>Aucune interaction WhatsApp encore.</span>
            )}
            <span>
              Marketing :{" "}
              <StatusBadge
                label={customer.marketingOptIn ? "Opt-in ✓" : "Opt-out"}
                tone={customer.marketingOptIn ? "success" : "muted"}
              />
            </span>
          </div>
        </section>

        {/* ── Main 360 grid ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Activity timeline — 2 cols */}
          <div className="lg:col-span-2">
            <h2 className="mb-3 text-base font-semibold">Activité</h2>
            <CustomerTimeline
              conversations={customer.conversations}
              appointments={customer.appointments}
              campaignTouches={customer.campaignTouches}
            />
          </div>

          {/* Notes — 1 col */}
          <div>
            <h2 className="mb-3 text-base font-semibold">Notes</h2>
            <CustomerNotes
              customerId={customer.id}
              notes={customer.notes}
              currentUserId={user?.id ?? ""}
            />
          </div>
        </div>

        {/* ── Edit form ── */}
        <div className="mt-8">
          <h2 className="mb-3 text-base font-semibold">Modifier le client</h2>
          <CustomerForm
            mode="edit"
            customer={customer}
            knownTags={knownTags}
          />
        </div>
      </div>
    </>
  );
}

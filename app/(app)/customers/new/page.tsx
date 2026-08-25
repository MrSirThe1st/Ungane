import Link from "next/link";
import { redirect } from "next/navigation";

import { CustomerForm } from "@/components/customers/customer-form";
import { PageHeader } from "@/components/shared/page-header";
import { getCurrentBusiness } from "@/lib/business/current";
import { listCustomerTags } from "@/lib/customers/actions";

export const dynamic = "force-dynamic";

export default async function NewCustomerPage() {
  const business = await getCurrentBusiness();
  if (!business) redirect("/onboarding");

  const knownTags = await listCustomerTags();

  return (
    <>
      <PageHeader title="Nouveau client" description="Créer un profil CRM" />
      <div className="flex-1 px-4 py-6 md:px-8">
        <Link
          href="/customers"
          className="text-muted-foreground mb-4 inline-block text-sm underline-offset-4 hover:underline"
        >
          ← Clients
        </Link>
        <CustomerForm mode="create" knownTags={knownTags} />
      </div>
    </>
  );
}

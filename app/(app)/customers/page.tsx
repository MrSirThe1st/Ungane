import Link from "next/link";
import { redirect } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentBusiness } from "@/lib/business/current";
import {
  listCustomerTags,
  listCustomers,
} from "@/lib/customers/actions";
import { customerDisplayName } from "@/lib/customers/display";
import { SUGGESTED_CUSTOMER_TAGS } from "@/lib/validations/customer";
import { cn, formatDateTime } from "@/lib/utils";

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ q?: string; tag?: string }>;
};

export default async function CustomersPage({ searchParams }: Props) {
  const business = await getCurrentBusiness();
  if (!business) redirect("/onboarding");

  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const tag = params.tag?.trim() ?? "";

  const [customers, knownTags] = await Promise.all([
    listCustomers({ query, tag: tag || undefined }),
    listCustomerTags(),
  ]);

  const filterTags = [
    ...new Set([...SUGGESTED_CUSTOMER_TAGS, ...knownTags]),
  ].sort((a, b) => a.localeCompare(b, "fr"));

  return (
    <>
      <PageHeader
        title="Clients"
        description="Base clients WhatsApp — profils et tags"
      />
      <div className="flex-1 px-4 py-6 md:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <form className="flex flex-1 flex-wrap gap-2" method="get">
            {tag ? <input type="hidden" name="tag" value={tag} /> : null}
            <Input
              name="q"
              defaultValue={query}
              placeholder="Rechercher nom, téléphone, tag…"
              className="max-w-sm"
            />
            <Button type="submit" variant="secondary">
              Rechercher
            </Button>
          </form>
          <Link href="/customers/new" className={cn(buttonVariants())}>
            Ajouter un client
          </Link>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <Link
            href={
              query ? `/customers?q=${encodeURIComponent(query)}` : "/customers"
            }
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              !tag
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            Tous
          </Link>
          {filterTags.map((t) => {
            const href = query
              ? `/customers?tag=${encodeURIComponent(t)}&q=${encodeURIComponent(query)}`
              : `/customers?tag=${encodeURIComponent(t)}`;
            return (
              <Link
                key={t}
                href={href}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  tag === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {t}
              </Link>
            );
          })}
        </div>

        {customers.length === 0 ? (
          <EmptyState
            title={query || tag ? "Aucun résultat" : "Aucun client pour l’instant"}
            description={
              query || tag
                ? "Essayez un autre nom, téléphone ou tag."
                : "Ajoutez un client manuellement ou attendez le premier message WhatsApp."
            }
            actionHref="/customers/new"
            actionLabel="Ajouter un client"
          />
        ) : (
          <ul className="divide-border border-border bg-card max-w-3xl divide-y rounded-xl border shadow-sm">
            {customers.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/customers/${c.id}`}
                  className="hover:bg-muted/50 block px-4 py-3 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-medium">{customerDisplayName(c)}</p>
                    {c.lastInteractionAt ? (
                      <time className="text-muted-foreground text-xs">
                        {formatDateTime(c.lastInteractionAt)}
                      </time>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {c.phoneNumber}
                  </p>
                  {c.tags.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {c.tags.map((t) => (
                        <span key={t} className="badge-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

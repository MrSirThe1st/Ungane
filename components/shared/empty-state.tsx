import Link from "next/link";
import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  children?: ReactNode;
  className?: string;
};

/** Branded empty-state block for list / detail pages. */
export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border bg-card max-w-lg rounded-2xl border px-5 py-8 shadow-sm",
        className,
      )}
    >
      <div className="bg-brand-mint text-brand mb-4 inline-flex size-10 items-center justify-center rounded-xl text-lg font-bold">
        ··
      </div>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className={cn(buttonVariants(), "mt-5 inline-flex")}
        >
          {actionLabel}
        </Link>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

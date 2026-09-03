"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { updateCustomerStatusAction } from "@/lib/customers/actions";
import {
  CUSTOMER_STATUSES,
  type CustomerStatus,
} from "@/lib/validations/customer";

const statusColors: Record<CustomerStatus, string> = {
  Nouveau: "bg-info text-info-foreground",
  Actif: "bg-success text-success-foreground",
  VIP: "bg-warning text-warning-foreground",
  Inactif: "bg-muted text-muted-foreground",
};

type Props = {
  customerId: string;
  current: CustomerStatus;
};

export function CustomerStatusSelect({ customerId, current }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onChange(status: string) {
    startTransition(async () => {
      await updateCustomerStatusAction({ id: customerId, status });
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[current]}`}
      >
        {current}
      </span>
      <select
        disabled={pending}
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="border-border bg-background text-foreground rounded-md border px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--ring)] disabled:opacity-50"
        aria-label="Changer le statut du client"
      >
        {CUSTOMER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  setFlowEnabledAction,
  type FlowSettingView,
} from "@/lib/flows/actions";
import { cn } from "@/lib/utils";

type Props = {
  settings: FlowSettingView[];
  canManage: boolean;
};

export function FlowToggles({ settings, canManage }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pendingType, setPendingType] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex max-w-2xl flex-col gap-3">
      {!canManage ? (
        <p className="text-muted-foreground text-sm">
          Seul le propriétaire peut activer ou désactiver les flux.
        </p>
      ) : null}
      {settings.map((flow) => (
        <div
          key={flow.flowType}
          className="border-border bg-card flex flex-col gap-2 rounded-xl border px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium">{flow.title}</p>
            <p className="text-muted-foreground text-sm">{flow.description}</p>
          </div>
          <button
            type="button"
            disabled={!canManage || (pending && pendingType === flow.flowType)}
            onClick={() => {
              if (!canManage) return;
              setError(null);
              setPendingType(flow.flowType);
              startTransition(async () => {
                const result = await setFlowEnabledAction({
                  flowType: flow.flowType,
                  enabled: !flow.enabled,
                });
                setPendingType(null);
                if (!result.success) {
                  setError(result.error);
                  return;
                }
                router.refresh();
              });
            }}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
              flow.enabled
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
              !canManage && "cursor-not-allowed opacity-60",
            )}
          >
            {flow.enabled ? "Activé" : "Désactivé"}
          </button>
        </div>
      ))}
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

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
};

export function FlowToggles({ settings }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pendingType, setPendingType] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex max-w-2xl flex-col gap-3">
      {settings.map((flow) => (
        <div
          key={flow.flowType}
          className="border-border flex flex-col gap-2 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium">{flow.title}</p>
            <p className="text-muted-foreground text-sm">{flow.description}</p>
          </div>
          <button
            type="button"
            disabled={pending && pendingType === flow.flowType}
            onClick={() => {
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

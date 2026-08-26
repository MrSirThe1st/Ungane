"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  businessId: string;
};

export function StubInboundSimulator({ businessId }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/dev/whatsapp-inbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          fromPhone: String(formData.get("fromPhone") ?? ""),
          text: String(formData.get("text") ?? ""),
          contactName: String(formData.get("contactName") ?? "") || null,
        }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Échec de la simulation");
        return;
      }
      router.refresh();
    });
  }

  return (
    <form
      action={onSubmit}
      className="border-border bg-card mt-6 flex max-w-md flex-col gap-3 rounded-xl border p-4 shadow-sm"
    >
      <p className="text-sm font-medium">Simuler un message entrant (stub)</p>
      <Input
        name="contactName"
        placeholder="Nom client (ex. Marie)"
        defaultValue="Marie"
      />
      <Input
        name="fromPhone"
        placeholder="+243800000001"
        defaultValue="+243800000001"
        required
      />
      <Input
        name="text"
        placeholder="Bonjour"
        defaultValue="Bonjour"
        required
      />
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Envoi…" : "Simuler “Bonjour”"}
      </Button>
    </form>
  );
}

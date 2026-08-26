"use client";

import { useState, useTransition } from "react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { connectWhatsAppAction } from "@/lib/whatsapp/actions";
import type { WhatsAppAccountView } from "@/lib/whatsapp/actions";

type Props = {
  account: WhatsAppAccountView | null;
};

const providerLabel: Record<string, string> = {
  stub: "Mode test",
  meta: "Meta Cloud API",
};

const statusLabel: Record<string, string> = {
  connected: "Connecté",
  pending: "En attente",
  disconnected: "Déconnecté",
  error: "Erreur",
};

export function WhatsAppConnectForm({ account }: Props) {
  const [phoneNumber, setPhoneNumber] = useState(account?.phoneNumber ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await connectWhatsAppAction({
        phoneNumber: String(formData.get("phoneNumber") ?? phoneNumber),
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setPhoneNumber(result.data.phoneNumber);
      setSuccess(`WhatsApp connecté : ${result.data.phoneNumber}`);
    });
  }

  return (
    <form action={onSubmit} className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="phoneNumber">Numéro WhatsApp Business</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          required
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          placeholder="+243…"
        />
        <p className="text-muted-foreground text-xs">
          En mode test, enregistrez un numéro pour activer la boîte de réception
          locale. La connexion Meta Cloud API arrivera ensuite.
        </p>
      </div>
      {account ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <StatusBadge
            label={statusLabel[account.status] ?? account.status}
            tone={account.status === "connected" ? "success" : "muted"}
          />
          <span className="text-muted-foreground">
            {providerLabel[account.provider] ?? account.provider}
          </span>
        </div>
      ) : null}
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p
          className="text-success-foreground bg-success rounded-md px-3 py-2 text-sm"
          role="status"
        >
          {success}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Enregistrement…" : account ? "Mettre à jour" : "Connecter"}
      </Button>
    </form>
  );
}

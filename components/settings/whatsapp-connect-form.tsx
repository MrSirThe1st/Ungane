"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { connectWhatsAppAction } from "@/lib/whatsapp/actions";
import type { WhatsAppAccountView } from "@/lib/whatsapp/actions";

type Props = {
  account: WhatsAppAccountView | null;
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
          Mode actuel : stub (Meta Cloud API plus tard). Enregistrez le numéro
          pour activer l’inbox de test.
        </p>
      </div>
      {account ? (
        <p className="text-sm">
          Statut : <span className="font-medium">{account.status}</span> ·
          provider <span className="font-medium">{account.provider}</span>
        </p>
      ) : null}
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-success-foreground bg-success rounded-md px-3 py-2 text-sm" role="status">
          {success}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Enregistrement…" : account ? "Mettre à jour" : "Connecter"}
      </Button>
    </form>
  );
}

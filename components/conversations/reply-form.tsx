"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { replyToConversationAction } from "@/lib/whatsapp/actions";

type Props = {
  conversationId: string;
};

export function ReplyForm({ conversationId }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await replyToConversationAction({
        conversationId,
        text: String(formData.get("text") ?? ""),
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <form action={onSubmit} className="border-border flex gap-2 border-t pt-4">
      <Input
        name="text"
        placeholder="Répondre…"
        required
        className="flex-1"
        autoComplete="off"
      />
      <Button type="submit" disabled={pending}>
        {pending ? "…" : "Envoyer"}
      </Button>
      {error ? (
        <p className="text-destructive w-full text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}

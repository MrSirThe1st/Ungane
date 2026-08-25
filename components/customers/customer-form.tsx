"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createCustomerAction,
  updateCustomerAction,
  type CustomerView,
} from "@/lib/customers/actions";
import { SUGGESTED_CUSTOMER_TAGS } from "@/lib/validations/customer";

type Props = {
  mode: "create" | "edit";
  customer?: CustomerView;
  knownTags?: string[];
};

function parseTags(raw: string): string[] {
  return [
    ...new Set(
      raw
        .split(/[,;\n]/)
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ].slice(0, 20);
}

export function CustomerForm({ mode, customer, knownTags = [] }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [tagsText, setTagsText] = useState((customer?.tags ?? []).join(", "));
  const [phoneNumber, setPhoneNumber] = useState(customer?.phoneNumber ?? "");
  const [firstName, setFirstName] = useState(customer?.firstName ?? "");
  const [lastName, setLastName] = useState(customer?.lastName ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");

  const suggestions = useMemo(() => {
    const set = new Set<string>([
      ...SUGGESTED_CUSTOMER_TAGS,
      ...knownTags,
      ...(customer?.tags ?? []),
    ]);
    return [...set].sort((a, b) => a.localeCompare(b, "fr"));
  }, [knownTags, customer?.tags]);

  function toggleTag(tag: string) {
    const current = parseTags(tagsText);
    const next = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    setTagsText(next.join(", "));
  }

  function onSubmit() {
    setError(null);
    startTransition(async () => {
      const tags = parseTags(tagsText);
      const payload = {
        phoneNumber,
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
        tags,
      };

      const result =
        mode === "create"
          ? await createCustomerAction(payload)
          : await updateCustomerAction({
              id: customer!.id,
              ...payload,
            });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/customers/${result.data.id}`);
      router.refresh();
    });
  }

  return (
    <form
      className="flex max-w-lg flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="phoneNumber">Téléphone WhatsApp</Label>
        <Input
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          placeholder="+243…"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email (optionnel)</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          placeholder="VIP, Nouveau…"
        />
        <div className="flex flex-wrap gap-2">
          {suggestions.map((tag) => {
            const active = parseTags(tagsText).includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={
                  active
                    ? "bg-primary text-primary-foreground rounded-md px-2 py-1 text-xs"
                    : "bg-muted rounded-md px-2 py-1 text-xs"
                }
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending
          ? "Enregistrement…"
          : mode === "create"
            ? "Créer le client"
            : "Enregistrer"}
      </Button>
    </form>
  );
}

"use client";

import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createCampaignAction,
  type MessageTemplateView,
} from "@/lib/campaigns/actions";
import { SUGGESTED_CUSTOMER_TAGS } from "@/lib/validations/customer";

type Props = {
  templates: MessageTemplateView[];
  knownTags: string[];
};

export function CampaignForm({ templates, knownTags }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState("");

  const tagOptions = useMemo(() => {
    return [...new Set([...SUGGESTED_CUSTOMER_TAGS, ...knownTags])].sort((a, b) =>
      a.localeCompare(b, "fr"),
    );
  }, [knownTags]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function onSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await createCampaignAction({
        name,
        templateId,
        audienceTags: selectedTags,
        scheduledAt: scheduledAt
          ? new Date(scheduledAt).toISOString()
          : null,
      });

      // Success redirects from the server action.
      if (result && !result.success) {
        setError(result.error);
      }
    });
  }

  if (templates.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Aucun modèle disponible. Réessayez plus tard.
      </p>
    );
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
        <Label htmlFor="name">Nom de la campagne</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Promo août"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="templateId">Modèle WhatsApp</Label>
        <select
          id="templateId"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className="border-input bg-background h-9 rounded-md border px-3 text-sm"
          required
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.displayName} ({t.name})
            </option>
          ))}
        </select>
        {templateId ? (
          <p className="text-muted-foreground text-xs whitespace-pre-wrap">
            {templates.find((t) => t.id === templateId)?.body}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Audience (tags)</Label>
        <p className="text-muted-foreground text-xs">
          Aucun tag = tous les clients avec opt-in marketing.
        </p>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag) => {
            const active = selectedTags.includes(tag);
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="scheduledAt">Planifier (optionnel)</Label>
        <Input
          id="scheduledAt"
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />
        <p className="text-muted-foreground text-xs">
          La planification est enregistrée ; l’envoi auto viendra plus tard.
          Vous pouvez toujours envoyer maintenant depuis la fiche.
        </p>
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending || !templateId} className="w-fit">
        {pending ? "Création…" : "Créer la campagne"}
      </Button>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  addNoteAction,
  deleteNoteAction,
  type CustomerNote,
} from "@/lib/customers/actions";
import { formatDateTime } from "@/lib/utils";

type Props = {
  customerId: string;
  notes: CustomerNote[];
  currentUserId: string;
};

export function CustomerNotes({ customerId, notes, currentUserId }: Props) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onAdd() {
    if (!content.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await addNoteAction({ customerId, content: content.trim() });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setContent("");
      router.refresh();
    });
  }

  function onDelete(noteId: string) {
    startTransition(async () => {
      await deleteNoteAction({ noteId, customerId });
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {notes.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucune note pour ce client.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="bg-muted/50 border-border group flex items-start justify-between gap-2 rounded-xl border px-4 py-3 text-sm"
            >
              <div className="flex flex-col gap-0.5">
                <p className="whitespace-pre-wrap">{note.content}</p>
                <p className="text-muted-foreground text-xs">
                  {formatDateTime(note.createdAt)}
                </p>
              </div>
              {note.authorId === currentUserId ? (
                <button
                  disabled={pending}
                  onClick={() => onDelete(note.id)}
                  className="text-muted-foreground hover:text-destructive mt-0.5 shrink-0 text-xs opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                  aria-label="Supprimer la note"
                >
                  ✕
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAdd();
        }}
        className="flex flex-col gap-2"
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ajouter une note…"
          rows={3}
          maxLength={2000}
          className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 disabled:opacity-50"
        />
        {error ? (
          <p className="text-destructive text-xs">{error}</p>
        ) : null}
        <Button
          type="submit"
          size="sm"
          disabled={pending || !content.trim()}
          className="w-fit"
        >
          {pending ? "Enregistrement…" : "Ajouter la note"}
        </Button>
      </form>
    </div>
  );
}

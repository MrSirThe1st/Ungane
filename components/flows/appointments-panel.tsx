"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  requestFeedbackAction,
  sendRemindersAction,
  type AppointmentView,
} from "@/lib/flows/actions";
import { customerDisplayName } from "@/lib/customers/display";

type Props = {
  appointments: AppointmentView[];
  reminderEnabled: boolean;
  feedbackEnabled: boolean;
};

export function AppointmentsPanel({
  appointments,
  reminderEnabled,
  feedbackEnabled,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="max-w-3xl">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={!reminderEnabled || pending}
          onClick={() => {
            setError(null);
            setInfo(null);
            startTransition(async () => {
              const result = await sendRemindersAction();
              if (!result.success) {
                setError(result.error);
                return;
              }
              setInfo(
                `${result.data.sent} rappel(s) envoyé(s)` +
                  (result.data.skipped
                    ? ` · ${result.data.skipped} ignoré(s)`
                    : ""),
              );
              router.refresh();
            });
          }}
        >
          Envoyer les rappels
        </Button>
      </div>

      {error ? (
        <p className="text-destructive mb-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="text-muted-foreground mb-3 text-sm" role="status">
          {info}
        </p>
      ) : null}

      {appointments.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Aucun rendez-vous. Activez Réservation et simulez « RDV » dans
          Conversations.
        </p>
      ) : (
        <ul className="divide-border border-border bg-card divide-y rounded-xl border shadow-sm">
          {appointments.map((a) => (
            <li
              key={a.id}
              className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">
                  {a.serviceName}
                  <span className="text-muted-foreground ml-2 text-xs">
                    {a.status}
                  </span>
                </p>
                <p className="text-muted-foreground text-sm">
                  {customerDisplayName(a.customer)} ·{" "}
                  {a.scheduledLabel ?? "date à préciser"}
                </p>
                {a.feedbackRating ? (
                  <p className="text-muted-foreground text-xs">
                    Note : {a.feedbackRating}/5
                  </p>
                ) : null}
                {a.reminderSentAt ? (
                  <p className="text-muted-foreground text-xs">Rappel envoyé</p>
                ) : null}
              </div>
              {feedbackEnabled && !a.feedbackRating ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={pending}
                  onClick={() => {
                    setError(null);
                    startTransition(async () => {
                      const result = await requestFeedbackAction({
                        appointmentId: a.id,
                      });
                      if (!result.success) {
                        setError(result.error);
                        return;
                      }
                      router.refresh();
                    });
                  }}
                >
                  Demander avis
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

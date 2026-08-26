"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteStaffAction, type StaffMemberView } from "@/lib/staff/actions";

type Props = {
  staff: StaffMemberView[];
};

export function StaffPanel({ staff }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await inviteStaffAction({
        email: String(formData.get("email") ?? ""),
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(`${result.data.email} a été ajouté(e) à l’équipe.`);
      router.refresh();
    });
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Équipe</CardTitle>
        <CardDescription>
          Invitez des collaborateurs par email. Ils doivent déjà avoir un
          compte UNGANE.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {staff.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Aucun collaborateur pour le moment.
          </p>
        ) : (
          <ul className="divide-border border-border divide-y rounded-lg border">
            {staff.map((member) => (
              <li key={member.id} className="px-4 py-3 text-sm">
                <p className="font-medium">{member.email}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {member.status === "active" ? "Actif" : member.status} ·{" "}
                  {new Date(member.createdAt).toLocaleDateString("fr-CD")}
                </p>
              </li>
            ))}
          </ul>
        )}

        <form action={onSubmit} className="space-y-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="staff-email">Email du collaborateur</Label>
            <Input
              id="staff-email"
              name="email"
              type="email"
              required
              placeholder="collaborateur@entreprise.com"
            />
          </div>
          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="text-sm text-emerald-700" role="status">
              {success}
            </p>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Invitation…" : "Ajouter un collaborateur"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground text-xs">
          Les collaborateurs peuvent gérer clients, conversations et
          rendez-vous. Seul le propriétaire gère WhatsApp, campagnes et
          l’équipe.
        </p>
      </CardFooter>
    </Card>
  );
}

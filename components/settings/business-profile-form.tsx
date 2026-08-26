"use client";

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
import { updateBusinessAction } from "@/lib/business/actions";
import type { Business } from "@/types/domain";

type Props = {
  business: Business;
  canEdit: boolean;
};

export function BusinessProfileForm({ business, canEdit }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await updateBusinessAction({
        name: String(formData.get("name") ?? ""),
        industry: String(formData.get("industry") ?? "") || null,
        city: String(formData.get("city") ?? "") || null,
        phone: String(formData.get("phone") ?? "") || null,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess("Profil entreprise mis à jour.");
    });
  }

  if (!canEdit) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Profil entreprise</CardTitle>
          <CardDescription>
            Seul le propriétaire peut modifier ces informations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Nom :</span> {business.name}
          </p>
          {business.industry ? (
            <p>
              <span className="text-muted-foreground">Secteur :</span>{" "}
              {business.industry}
            </p>
          ) : null}
          {business.city ? (
            <p>
              <span className="text-muted-foreground">Ville :</span>{" "}
              {business.city}
            </p>
          ) : null}
          {business.phone ? (
            <p>
              <span className="text-muted-foreground">Téléphone :</span>{" "}
              {business.phone}
            </p>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Profil entreprise</CardTitle>
        <CardDescription>
          Nom, secteur et coordonnées affichés dans votre espace.
        </CardDescription>
      </CardHeader>
      <form action={onSubmit}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="business-name">Nom de l’entreprise</Label>
            <Input
              id="business-name"
              name="name"
              required
              defaultValue={business.name}
              placeholder="Spa Lumière"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="business-industry">Secteur</Label>
            <Input
              id="business-industry"
              name="industry"
              defaultValue={business.industry ?? ""}
              placeholder="Beauté, restaurant, clinique…"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="business-city">Ville</Label>
            <Input
              id="business-city"
              name="city"
              defaultValue={business.city ?? ""}
              placeholder="Kinshasa"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="business-phone">Téléphone</Label>
            <Input
              id="business-phone"
              name="phone"
              type="tel"
              defaultValue={business.phone ?? ""}
              placeholder="+243…"
            />
          </div>
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
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={pending}>
            {pending ? "Enregistrement…" : "Enregistrer le profil"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

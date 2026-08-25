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
import { appConfig } from "@/config/app";
import { createBusinessAction } from "@/lib/auth/actions";

export function OnboardingForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createBusinessAction({
        name: String(formData.get("name") ?? ""),
        industry: String(formData.get("industry") ?? "") || null,
        city: String(formData.get("city") ?? "") || null,
        phone: String(formData.get("phone") ?? "") || null,
        country: "CD",
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.replace(appConfig.routes.dashboard);
      router.refresh();
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Votre entreprise</CardTitle>
        <CardDescription>
          Créez le profil de votre business pour accéder au tableau de bord.
        </CardDescription>
      </CardHeader>
      <form action={onSubmit}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nom de l’entreprise</Label>
            <Input id="name" name="name" required placeholder="Spa Lumière" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="industry">Secteur</Label>
            <Input
              id="industry"
              name="industry"
              placeholder="Beauté, restaurant, clinique…"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="city">Ville</Label>
            <Input id="city" name="city" placeholder="Kinshasa" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Téléphone WhatsApp (optionnel)</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+243…" />
          </div>
          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Création…" : "Continuer"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

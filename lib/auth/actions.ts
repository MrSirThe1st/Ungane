"use server";

import { redirect } from "next/navigation";
import { cache } from "react";

import { appConfig } from "@/config/app";
import { failureResult, SafeError, withSafeResult } from "@/lib/errors";
import { mapAuthUser } from "@/lib/auth/map-user";
import { createClient } from "@/lib/supabase/server";
import { getCachedUser } from "@/lib/supabase/user";
import {
  createBusinessSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validations/auth";
import type { ApiResult } from "@/types/api";
import type { AuthSession } from "@/lib/auth/types";
import type { Business } from "@/types/domain";

function toAuthSession(
  user: NonNullable<
    Awaited<
      ReturnType<Awaited<ReturnType<typeof createClient>>["auth"]["getUser"]>
    >["data"]["user"]
  >,
): AuthSession {
  return { user: mapAuthUser(user) };
}

export async function signUpWithEmailAction(
  raw: unknown,
): Promise<ApiResult<AuthSession>> {
  return withSafeResult(
    async () => {
      const input = signUpSchema.parse(raw);
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: { name: input.name },
        },
      });

      if (error) {
        throw new SafeError("Inscription impossible. Réessayez.");
      }
      if (!data.user) {
        throw new SafeError("Inscription impossible. Réessayez.");
      }

      return toAuthSession(data.user);
    },
    {
      context: "signUpWithEmail",
      fallback: "Inscription impossible. Réessayez.",
    },
  );
}

export async function signInWithEmailAction(
  raw: unknown,
): Promise<ApiResult<AuthSession>> {
  return withSafeResult(
    async () => {
      const input = signInSchema.parse(raw);
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        throw new SafeError("Email ou mot de passe incorrect.");
      }
      if (!data.user) {
        throw new SafeError("Connexion impossible. Réessayez.");
      }

      return toAuthSession(data.user);
    },
    {
      context: "signInWithEmail",
      fallback: "Connexion impossible. Réessayez.",
    },
  );
}

export async function signOutAction(): Promise<ApiResult<{ signedOut: true }>> {
  const result = await withSafeResult(
    async () => {
      const supabase = await createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new SafeError("Déconnexion impossible.");
      }
      return { signedOut: true as const };
    },
    { context: "signOut", fallback: "Déconnexion impossible." },
  );

  if (result.success) {
    redirect("/login");
  }
  return result;
}

export const getAuthSession = cache(async (): Promise<AuthSession | null> => {
  const user = await getCachedUser();
  if (!user) return null;
  return toAuthSession(user);
});

export const getActiveMembershipCount = cache(async (): Promise<number> => {
  const user = await getCachedUser();
  if (!user) return 0;

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("business_memberships")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "active");

  if (error) {
    failureResult(error, { context: "getActiveMembershipCount" });
    return 0;
  }

  return count ?? 0;
});

export async function createBusinessAction(
  raw: unknown,
): Promise<ApiResult<Business>> {
  return withSafeResult(
    async () => {
      const input = createBusinessSchema.parse(raw);
      const supabase = await createClient();
      const user = await getCachedUser();

      if (!user) {
        throw new SafeError("Vous devez être connecté.");
      }

      const { data, error } = await supabase.rpc("create_business_for_owner", {
        p_name: input.name,
        p_industry: input.industry ?? null,
        p_country: input.country,
        p_city: input.city ?? null,
        p_phone: input.phone ?? null,
        p_email: user.email ?? null,
      });

      if (error) {
        throw new SafeError("Création de l’entreprise impossible. Réessayez.");
      }

      const row = data as {
        id: string;
        name: string;
        industry: string | null;
        country: string;
        city: string | null;
        phone: string | null;
        created_at: string;
      };

      return {
        id: row.id,
        name: row.name,
        industry: row.industry,
        country: row.country,
        city: row.city,
        phone: row.phone,
        createdAt: row.created_at,
      };
    },
    {
      context: "createBusiness",
      fallback: "Création de l’entreprise impossible. Réessayez.",
    },
  );
}

export async function requireAppAccess(): Promise<AuthSession> {
  const session = await getAuthSession();
  if (!session) {
    redirect("/login");
  }

  const memberships = await getActiveMembershipCount();
  if (memberships < 1) {
    redirect("/onboarding");
  }

  return session;
}

export async function requireAuthOnly(): Promise<AuthSession> {
  const session = await getAuthSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

/** After login/signup — send user to onboarding or dashboard. */
export async function redirectAfterAuth(): Promise<never> {
  const memberships = await getActiveMembershipCount();
  if (memberships < 1) {
    redirect("/onboarding");
  }
  redirect(appConfig.routes.dashboard);
}

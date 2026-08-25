import { z } from "zod";

/**
 * Environment variables (local: `.env`, gitignored).
 * Documented in `docs/context/tech.md`. Never hardcode secrets or URLs.
 *
 * Required for real Supabase / WhatsApp:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  (sb_publishable_...)
 * - SUPABASE_SECRET_KEY                  (sb_secret_... — server only)
 * - WHATSAPP_API_KEY                     (Meta access token when provider=meta)
 * - WHATSAPP_WEBHOOK_SECRET              (Meta webhook verify token)
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  SUPABASE_SECRET_KEY: z.string().min(1).optional(),
  WHATSAPP_PROVIDER: z.enum(["stub", "meta"]).default("stub"),
  WHATSAPP_API_KEY: z.string().min(1).optional(),
  WHATSAPP_WEBHOOK_SECRET: z.string().min(1).optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

/** `.env` empty values come through as "" — treat as unset. */
function emptyToUndefined(value: string | undefined): string | undefined {
  if (value === undefined || value.trim() === "") return undefined;
  return value;
}

export function getEnv(): AppEnv {
  return envSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: emptyToUndefined(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: emptyToUndefined(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
    SUPABASE_SECRET_KEY: emptyToUndefined(process.env.SUPABASE_SECRET_KEY),
    WHATSAPP_PROVIDER:
      emptyToUndefined(process.env.WHATSAPP_PROVIDER) ?? "stub",
    WHATSAPP_API_KEY: emptyToUndefined(process.env.WHATSAPP_API_KEY),
    WHATSAPP_WEBHOOK_SECRET: emptyToUndefined(
      process.env.WHATSAPP_WEBHOOK_SECRET,
    ),
  });
}

export function requirePublicSupabaseEnv(): {
  url: string;
  publishableKey: string;
} {
  const env = getEnv();
  if (
    !env.NEXT_PUBLIC_SUPABASE_URL ||
    !env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env",
    );
  }
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}

export function requireSecretSupabaseEnv(): {
  url: string;
  secretKey: string;
} {
  const env = getEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env",
    );
  }
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    secretKey: env.SUPABASE_SECRET_KEY,
  };
}

import { createClient } from "@supabase/supabase-js";

import { requireSecretSupabaseEnv } from "@/config/env";

/**
 * Server-only Supabase client with the secret key (bypasses RLS).
 * Never import this from client components or expose to the browser.
 */
export function createAdminClient() {
  const { url, secretKey } = requireSecretSupabaseEnv();
  return createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

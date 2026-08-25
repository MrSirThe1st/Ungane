import { createBrowserClient } from "@supabase/ssr";

import { requirePublicSupabaseEnv } from "@/config/env";

export function createClient() {
  const { url, publishableKey } = requirePublicSupabaseEnv();
  return createBrowserClient(url, publishableKey, {
    auth: {
      // Avoid orphaned navigator.locks hangs (Strict Mode / aborted refreshes).
      lock: async (_name, _acquireTimeout, fn) => fn(),
    },
  });
}

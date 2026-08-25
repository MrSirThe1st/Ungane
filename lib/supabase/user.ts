import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

/** One auth lookup per React request (layout + pages + actions share it). */
export const getCachedUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
});

import type { User } from "@supabase/supabase-js";

import type { AppUser } from "@/types/domain";

export function mapAuthUser(user: User): AppUser {
  const metadata = user.user_metadata ?? {};
  const name =
    typeof metadata.name === "string"
      ? metadata.name
      : typeof metadata.full_name === "string"
        ? metadata.full_name
        : null;

  return {
    id: user.id,
    email: user.email ?? null,
    phone: user.phone ?? null,
    name,
  };
}

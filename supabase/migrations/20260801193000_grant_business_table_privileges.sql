-- Fix missing table privileges (migration created tables without GRANTs).
-- RLS policies alone are not enough — roles need table-level privileges.

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update on table public.businesses to authenticated;
grant select, insert, update on table public.business_memberships to authenticated;

grant all on table public.businesses to service_role;
grant all on table public.business_memberships to service_role;

-- Read-only for anon is intentionally omitted (auth required).

grant execute on function public.create_business_for_owner(
  text, text, text, text, text, text
) to authenticated, service_role;

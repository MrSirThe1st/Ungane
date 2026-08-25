-- UNGANE Phase 1: businesses + memberships
-- Automatic RLS is enabled on this project — policies ship with tables.

create extension if not exists "pgcrypto";

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  country text not null default 'CD',
  city text,
  phone text,
  email text,
  status text not null default 'active'
    check (status in ('active', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  business_id uuid not null references businesses (id) on delete cascade,
  role text not null
    check (role in ('business_owner', 'business_staff')),
  status text not null default 'active'
    check (status in ('invited', 'active', 'inactive')),
  invited_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  unique (user_id, business_id)
);

create index if not exists business_memberships_user_id_idx
  on public.business_memberships (user_id);

create index if not exists business_memberships_business_id_idx
  on public.business_memberships (business_id);

alter table public.businesses enable row level security;
alter table public.business_memberships enable row level security;

-- Members can read businesses they belong to
create policy "members_select_businesses"
  on public.businesses
  for select
  to authenticated
  using (
    id in (
      select business_id
      from public.business_memberships
      where user_id = auth.uid()
        and status = 'active'
    )
  );

-- Owners can update their businesses
create policy "owners_update_businesses"
  on public.businesses
  for update
  to authenticated
  using (
    id in (
      select business_id
      from public.business_memberships
      where user_id = auth.uid()
        and role = 'business_owner'
        and status = 'active'
    )
  )
  with check (
    id in (
      select business_id
      from public.business_memberships
      where user_id = auth.uid()
        and role = 'business_owner'
        and status = 'active'
    )
  );

-- Users can read their own memberships
create policy "users_select_own_memberships"
  on public.business_memberships
  for select
  to authenticated
  using (user_id = auth.uid());

-- Atomic onboarding: create business + owner membership
create or replace function public.create_business_for_owner(
  p_name text,
  p_industry text default null,
  p_country text default 'CD',
  p_city text default null,
  p_phone text default null,
  p_email text default null
)
returns public.businesses
language plpgsql
security definer
set search_path = public
as $$
declare
  v_business public.businesses;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if length(trim(p_name)) < 2 then
    raise exception 'Business name is required';
  end if;

  insert into public.businesses (
    name,
    industry,
    country,
    city,
    phone,
    email
  )
  values (
    trim(p_name),
    nullif(trim(p_industry), ''),
    coalesce(nullif(trim(p_country), ''), 'CD'),
    nullif(trim(p_city), ''),
    nullif(trim(p_phone), ''),
    nullif(trim(p_email), '')
  )
  returning * into v_business;

  insert into public.business_memberships (
    user_id,
    business_id,
    role,
    status
  )
  values (
    auth.uid(),
    v_business.id,
    'business_owner',
    'active'
  );

  return v_business;
end;
$$;

revoke all on function public.create_business_for_owner(
  text, text, text, text, text, text
) from public;

grant execute on function public.create_business_for_owner(
  text, text, text, text, text, text
) to authenticated;

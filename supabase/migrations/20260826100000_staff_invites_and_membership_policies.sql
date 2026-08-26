-- Staff invites: owner-only RPCs + membership policies

create policy "owners_select_business_memberships"
  on public.business_memberships
  for select
  to authenticated
  using (
    business_id in (
      select business_id
      from public.business_memberships
      where user_id = auth.uid()
        and role = 'business_owner'
        and status = 'active'
    )
  );

create or replace function public.list_business_staff()
returns table (
  membership_id uuid,
  user_id uuid,
  email text,
  role text,
  status text,
  created_at timestamptz
)
language sql
security definer
set search_path = public, auth
stable
as $$
  select
    bm.id,
    bm.user_id,
    u.email::text,
    bm.role,
    bm.status,
    bm.created_at
  from public.business_memberships bm
  join auth.users u on u.id = bm.user_id
  where bm.business_id = (
    select business_id
    from public.business_memberships
    where user_id = auth.uid()
      and role = 'business_owner'
      and status = 'active'
    order by created_at
    limit 1
  )
    and bm.role = 'business_staff'
  order by bm.created_at;
$$;

create or replace function public.invite_staff_member(p_email text)
returns public.business_memberships
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
  v_business_id uuid;
  v_membership public.business_memberships;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select bm.business_id
  into v_business_id
  from public.business_memberships bm
  where bm.user_id = auth.uid()
    and bm.role = 'business_owner'
    and bm.status = 'active'
  order by bm.created_at
  limit 1;

  if v_business_id is null then
    raise exception 'Owner access required';
  end if;

  select u.id
  into v_user_id
  from auth.users u
  where lower(u.email) = lower(trim(p_email))
  limit 1;

  if v_user_id is null then
    raise exception 'USER_NOT_FOUND';
  end if;

  if v_user_id = auth.uid() then
    raise exception 'CANNOT_INVITE_SELF';
  end if;

  if exists (
    select 1
    from public.business_memberships bm
    where bm.user_id = v_user_id
      and bm.business_id = v_business_id
  ) then
    raise exception 'ALREADY_MEMBER';
  end if;

  insert into public.business_memberships (
    user_id,
    business_id,
    role,
    status,
    invited_by
  )
  values (
    v_user_id,
    v_business_id,
    'business_staff',
    'active',
    auth.uid()
  )
  returning * into v_membership;

  return v_membership;
end;
$$;

revoke all on function public.list_business_staff() from public;
grant execute on function public.list_business_staff() to authenticated;

revoke all on function public.invite_staff_member(text) from public;
grant execute on function public.invite_staff_member(text) to authenticated;

-- Messaging inbox foundation (Meta WhatsApp Cloud API later; stub now)

create table if not exists public.whatsapp_accounts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  phone_number text not null,
  provider text not null default 'stub'
    check (provider in ('stub', 'meta')),
  provider_account_id text,
  status text not null default 'pending'
    check (status in ('pending', 'connected', 'disconnected', 'error')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  phone_number text not null,
  first_name text,
  last_name text,
  email text,
  tags text[] not null default '{}',
  last_interaction_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, phone_number)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  status text not null default 'open'
    check (status in ('open', 'closed')),
  started_at timestamptz not null default now(),
  last_message_at timestamptz,
  unique (business_id, customer_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  business_id uuid not null references public.businesses (id) on delete cascade,
  direction text not null check (direction in ('INBOUND', 'OUTBOUND')),
  type text not null default 'text',
  content text not null,
  whatsapp_message_id text,
  status text not null default 'SENT'
    check (status in ('SENT', 'DELIVERED', 'READ', 'FAILED', 'RECEIVED')),
  created_at timestamptz not null default now()
);

create index if not exists customers_business_id_idx on public.customers (business_id);
create index if not exists conversations_business_id_idx on public.conversations (business_id);
create index if not exists conversations_last_message_at_idx
  on public.conversations (business_id, last_message_at desc nulls last);
create index if not exists messages_conversation_id_idx on public.messages (conversation_id);
create index if not exists messages_business_id_idx on public.messages (business_id);

alter table public.whatsapp_accounts enable row level security;
alter table public.customers enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Privileges (required even with RLS)
grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update on table public.whatsapp_accounts to authenticated;
grant select, insert, update on table public.customers to authenticated;
grant select, insert, update on table public.conversations to authenticated;
grant select, insert, update on table public.messages to authenticated;

grant all on table public.whatsapp_accounts to service_role;
grant all on table public.customers to service_role;
grant all on table public.conversations to service_role;
grant all on table public.messages to service_role;

-- Helper: membership check
create or replace function public.is_business_member(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.business_memberships m
    where m.business_id = p_business_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  );
$$;

revoke all on function public.is_business_member(uuid) from public;
grant execute on function public.is_business_member(uuid) to authenticated, service_role;

create policy "members_select_whatsapp_accounts"
  on public.whatsapp_accounts for select to authenticated
  using (public.is_business_member(business_id));

create policy "owners_insert_whatsapp_accounts"
  on public.whatsapp_accounts for insert to authenticated
  with check (
    exists (
      select 1 from public.business_memberships m
      where m.business_id = whatsapp_accounts.business_id
        and m.user_id = auth.uid()
        and m.role = 'business_owner'
        and m.status = 'active'
    )
  );

create policy "owners_update_whatsapp_accounts"
  on public.whatsapp_accounts for update to authenticated
  using (
    exists (
      select 1 from public.business_memberships m
      where m.business_id = whatsapp_accounts.business_id
        and m.user_id = auth.uid()
        and m.role = 'business_owner'
        and m.status = 'active'
    )
  );

create policy "members_select_customers"
  on public.customers for select to authenticated
  using (public.is_business_member(business_id));

create policy "members_insert_customers"
  on public.customers for insert to authenticated
  with check (public.is_business_member(business_id));

create policy "members_update_customers"
  on public.customers for update to authenticated
  using (public.is_business_member(business_id));

create policy "members_select_conversations"
  on public.conversations for select to authenticated
  using (public.is_business_member(business_id));

create policy "members_insert_conversations"
  on public.conversations for insert to authenticated
  with check (public.is_business_member(business_id));

create policy "members_update_conversations"
  on public.conversations for update to authenticated
  using (public.is_business_member(business_id));

create policy "members_select_messages"
  on public.messages for select to authenticated
  using (public.is_business_member(business_id));

create policy "members_insert_messages"
  on public.messages for insert to authenticated
  with check (public.is_business_member(business_id));

create policy "members_update_messages"
  on public.messages for update to authenticated
  using (public.is_business_member(business_id));

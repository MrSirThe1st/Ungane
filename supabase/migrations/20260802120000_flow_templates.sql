-- Flow templates: booking / feedback / reminder (stub-first, no queue yet)

create table if not exists public.flow_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  flow_type text not null
    check (flow_type in ('booking', 'feedback', 'reminder')),
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, flow_type)
);

create table if not exists public.flow_runs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  flow_type text not null
    check (flow_type in ('booking', 'feedback', 'reminder')),
  status text not null default 'active'
    check (status in ('active', 'completed', 'cancelled')),
  current_step text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  flow_run_id uuid references public.flow_runs (id) on delete set null,
  service_name text not null,
  scheduled_at timestamptz,
  scheduled_label text,
  status text not null default 'confirmed'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  feedback_rating integer check (feedback_rating is null or (feedback_rating between 1 and 5)),
  feedback_comment text,
  reminder_sent_at timestamptz,
  feedback_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists flow_settings_business_id_idx
  on public.flow_settings (business_id);
create index if not exists flow_runs_active_idx
  on public.flow_runs (business_id, customer_id, status);
create index if not exists appointments_business_id_idx
  on public.appointments (business_id);
create index if not exists appointments_scheduled_at_idx
  on public.appointments (business_id, scheduled_at);

alter table public.flow_settings enable row level security;
alter table public.flow_runs enable row level security;
alter table public.appointments enable row level security;

grant select, insert, update on table public.flow_settings to authenticated;
grant select, insert, update on table public.flow_runs to authenticated;
grant select, insert, update on table public.appointments to authenticated;

grant all on table public.flow_settings to service_role;
grant all on table public.flow_runs to service_role;
grant all on table public.appointments to service_role;

create policy "members_select_flow_settings"
  on public.flow_settings for select
  using (public.is_business_member(business_id));

create policy "members_insert_flow_settings"
  on public.flow_settings for insert
  with check (public.is_business_member(business_id));

create policy "members_update_flow_settings"
  on public.flow_settings for update
  using (public.is_business_member(business_id));

create policy "members_select_flow_runs"
  on public.flow_runs for select
  using (public.is_business_member(business_id));

create policy "members_insert_flow_runs"
  on public.flow_runs for insert
  with check (public.is_business_member(business_id));

create policy "members_update_flow_runs"
  on public.flow_runs for update
  using (public.is_business_member(business_id));

create policy "members_select_appointments"
  on public.appointments for select
  using (public.is_business_member(business_id));

create policy "members_insert_appointments"
  on public.appointments for insert
  with check (public.is_business_member(business_id));

create policy "members_update_appointments"
  on public.appointments for update
  using (public.is_business_member(business_id));

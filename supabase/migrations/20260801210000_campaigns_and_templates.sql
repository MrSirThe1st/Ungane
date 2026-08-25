-- Campaigns + local message templates (Meta-approved templates later)

alter table public.customers
  add column if not exists marketing_opt_in boolean not null default true;

create table if not exists public.message_templates (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text not null,
  display_name text not null,
  body text not null,
  language text not null default 'fr',
  category text not null default 'MARKETING'
    check (category in ('UTILITY', 'MARKETING', 'AUTHENTICATION')),
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, name)
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text not null,
  template_id uuid not null references public.message_templates (id) on delete restrict,
  audience_tags text[] not null default '{}',
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  recipient_count integer not null default 0,
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  business_id uuid not null references public.businesses (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'failed', 'skipped')),
  provider_message_id text,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique (campaign_id, customer_id)
);

create index if not exists message_templates_business_id_idx
  on public.message_templates (business_id);
create index if not exists campaigns_business_id_idx
  on public.campaigns (business_id);
create index if not exists campaigns_status_idx
  on public.campaigns (business_id, status);
create index if not exists campaign_recipients_campaign_id_idx
  on public.campaign_recipients (campaign_id);

alter table public.message_templates enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_recipients enable row level security;

grant select, insert, update on table public.message_templates to authenticated;
grant select, insert, update on table public.campaigns to authenticated;
grant select, insert, update on table public.campaign_recipients to authenticated;

grant all on table public.message_templates to service_role;
grant all on table public.campaigns to service_role;
grant all on table public.campaign_recipients to service_role;

create policy "members_select_message_templates"
  on public.message_templates for select
  using (public.is_business_member(business_id));

create policy "members_insert_message_templates"
  on public.message_templates for insert
  with check (public.is_business_member(business_id));

create policy "members_update_message_templates"
  on public.message_templates for update
  using (public.is_business_member(business_id));

create policy "members_select_campaigns"
  on public.campaigns for select
  using (public.is_business_member(business_id));

create policy "members_insert_campaigns"
  on public.campaigns for insert
  with check (public.is_business_member(business_id));

create policy "members_update_campaigns"
  on public.campaigns for update
  using (public.is_business_member(business_id));

create policy "members_select_campaign_recipients"
  on public.campaign_recipients for select
  using (public.is_business_member(business_id));

create policy "members_insert_campaign_recipients"
  on public.campaign_recipients for insert
  with check (public.is_business_member(business_id));

create policy "members_update_campaign_recipients"
  on public.campaign_recipients for update
  using (public.is_business_member(business_id));

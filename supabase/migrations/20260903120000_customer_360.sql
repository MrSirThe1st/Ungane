-- Customer 360: status field + notes table

-- Status column on customers (Nouveau / Actif / VIP / Inactif)
alter table public.customers
  add column if not exists status text not null default 'Nouveau'
    check (status in ('Nouveau', 'Actif', 'VIP', 'Inactif'));

-- Free-text notes per customer, authored by staff
create table if not exists public.customer_notes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete set null,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customer_notes_customer_id_idx
  on public.customer_notes (customer_id, created_at desc);

alter table public.customer_notes enable row level security;

grant select, insert, update, delete on table public.customer_notes to authenticated;
grant all on table public.customer_notes to service_role;

create policy "members_select_customer_notes"
  on public.customer_notes for select to authenticated
  using (public.is_business_member(business_id));

create policy "members_insert_customer_notes"
  on public.customer_notes for insert to authenticated
  with check (public.is_business_member(business_id));

create policy "members_update_own_customer_notes"
  on public.customer_notes for update to authenticated
  using (
    public.is_business_member(business_id)
    and author_id = auth.uid()
  );

create policy "members_delete_own_customer_notes"
  on public.customer_notes for delete to authenticated
  using (
    public.is_business_member(business_id)
    and author_id = auth.uid()
  );

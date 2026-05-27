-- Local Retail Ops Dashboard MVP schema for Supabase/Postgres
-- Apply with: supabase db push, or paste into Supabase SQL editor after reviewing.

create extension if not exists pgcrypto;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_type text not null default 'hardware_store',
  currency text not null default 'EUR',
  timezone text not null default 'Europe/Helsinki',
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete set null,
  full_name text,
  role text not null default 'owner' check (role in ('owner','manager','staff')),
  created_at timestamptz not null default now()
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  address text,
  timezone text not null default 'Europe/Helsinki',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  location_id uuid references public.locations(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  role text not null default 'staff' check (role in ('owner','manager','staff')),
  hourly_rate numeric(10,2),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  location_id uuid references public.locations(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled','completed','missed','cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  location_id uuid references public.locations(id) on delete set null,
  shift_id uuid references public.shifts(id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  source text not null default 'mobile_web' check (source in ('mobile_web','desktop','manager_adjustment')),
  note text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check (ended_at is null or ended_at > started_at)
);

create index if not exists shifts_business_starts_idx on public.shifts (business_id, starts_at);
create index if not exists time_entries_business_started_idx on public.time_entries (business_id, started_at);
create index if not exists time_entries_open_idx on public.time_entries (business_id, employee_id) where ended_at is null;

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  contact_name text,
  email text,
  phone text,
  min_order_value numeric(12,2) default 0,
  lead_time_days integer default 3,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete set null,
  sku text not null,
  name text not null,
  category text,
  unit text default 'each',
  stock_on_hand numeric(12,2) not null default 0,
  reorder_point numeric(12,2) not null default 0,
  reorder_qty numeric(12,2),
  cost numeric(12,2) not null default 0,
  price numeric(12,2) not null default 0,
  avg_daily_sales numeric(12,3) default 0,
  last_sold_at date,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, sku)
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  movement_type text not null check (movement_type in ('sale','purchase','adjustment','return')),
  quantity numeric(12,2) not null,
  unit_cost numeric(12,2),
  note text,
  occurred_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create table if not exists public.sales_daily (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  sale_date date not null,
  revenue numeric(12,2) not null default 0,
  gross_margin numeric(12,2) not null default 0,
  transactions integer not null default 0,
  new_customers integer not null default 0,
  unique (business_id, sale_date)
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_name text not null,
  customer_contact text,
  status text not null default 'open' check (status in ('open','won','lost','follow_up')),
  value numeric(12,2) not null default 0,
  due_at date,
  next_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.review_snapshots (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  source text not null default 'google',
  rating numeric(2,1) not null,
  review_count integer not null default 0,
  unreplied_count integer not null default 0,
  captured_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title text not null,
  area text not null default 'operations' check (area in ('inventory','sales','reviews','supplier','operations')),
  status text not null default 'open' check (status in ('open','done','snoozed')),
  due_at date,
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace view public.dashboard_product_health as
select
  p.business_id,
  p.id as product_id,
  p.sku,
  p.name,
  p.category,
  p.stock_on_hand,
  p.reorder_point,
  coalesce(p.reorder_qty, greatest((p.reorder_point * 2) - p.stock_on_hand, 0)) as suggested_reorder_qty,
  p.cost,
  p.price,
  case when p.price > 0 then round(((p.price - p.cost) / p.price) * 100, 1) else null end as margin_pct,
  p.stock_on_hand * p.cost as stock_value,
  p.avg_daily_sales,
  case when p.avg_daily_sales > 0 then floor(p.stock_on_hand / p.avg_daily_sales)::int else null end as estimated_days_left,
  p.last_sold_at,
  case
    when p.stock_on_hand <= p.reorder_point then 'low_stock'
    when p.last_sold_at is not null and p.last_sold_at < current_date - interval '45 days' and p.stock_on_hand * p.cost > 100 then 'slow_moving'
    when p.price > 0 and ((p.price - p.cost) / p.price) < 0.35 then 'low_margin'
    else 'ok'
  end as health_status,
  s.name as supplier_name
from public.products p
left join public.suppliers s on s.id = p.supplier_id;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at before update on public.products
for each row execute function public.touch_updated_at();

drop trigger if exists quotes_touch_updated_at on public.quotes;
create trigger quotes_touch_updated_at before update on public.quotes
for each row execute function public.touch_updated_at();

alter table public.businesses enable row level security;
alter table public.profiles enable row level security;
alter table public.locations enable row level security;
alter table public.employees enable row level security;
alter table public.shifts enable row level security;
alter table public.time_entries enable row level security;
alter table public.suppliers enable row level security;
alter table public.products enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.sales_daily enable row level security;
alter table public.quotes enable row level security;
alter table public.review_snapshots enable row level security;
alter table public.tasks enable row level security;

create or replace function public.user_business_id()
returns uuid language sql stable security definer set search_path = public as $$
  select business_id from public.profiles where id = auth.uid()
$$;

create policy "profiles can read own profile" on public.profiles for select using (id = auth.uid());
create policy "profiles can update own profile" on public.profiles for update using (id = auth.uid());

create policy "business members can read business" on public.businesses for select using (id = public.user_business_id());
create policy "business owners can update business" on public.businesses for update using (
  id = public.user_business_id() and exists (select 1 from public.profiles where id = auth.uid() and role in ('owner','manager'))
);

create policy "members read locations" on public.locations for select using (business_id = public.user_business_id());
create policy "managers write locations" on public.locations for all using (business_id = public.user_business_id() and exists (select 1 from public.profiles where id = auth.uid() and role in ('owner','manager'))) with check (business_id = public.user_business_id());

create policy "members read employees" on public.employees for select using (business_id = public.user_business_id());
create policy "managers write employees" on public.employees for all using (business_id = public.user_business_id() and exists (select 1 from public.profiles where id = auth.uid() and role in ('owner','manager'))) with check (business_id = public.user_business_id());

create policy "members read shifts" on public.shifts for select using (business_id = public.user_business_id());
create policy "managers write shifts" on public.shifts for all using (business_id = public.user_business_id() and exists (select 1 from public.profiles where id = auth.uid() and role in ('owner','manager'))) with check (business_id = public.user_business_id());

create policy "members read time entries" on public.time_entries for select using (business_id = public.user_business_id());
create policy "members insert own time entries" on public.time_entries for insert with check (business_id = public.user_business_id());
create policy "members update own open time entries" on public.time_entries for update using (business_id = public.user_business_id()) with check (business_id = public.user_business_id());

create policy "members read suppliers" on public.suppliers for select using (business_id = public.user_business_id());
create policy "managers write suppliers" on public.suppliers for all using (business_id = public.user_business_id() and exists (select 1 from public.profiles where id = auth.uid() and role in ('owner','manager'))) with check (business_id = public.user_business_id());

create policy "members read products" on public.products for select using (business_id = public.user_business_id());
create policy "members write products" on public.products for all using (business_id = public.user_business_id()) with check (business_id = public.user_business_id());

create policy "members read movements" on public.inventory_movements for select using (business_id = public.user_business_id());
create policy "members insert movements" on public.inventory_movements for insert with check (business_id = public.user_business_id());

create policy "members read sales" on public.sales_daily for select using (business_id = public.user_business_id());
create policy "managers write sales" on public.sales_daily for all using (business_id = public.user_business_id() and exists (select 1 from public.profiles where id = auth.uid() and role in ('owner','manager'))) with check (business_id = public.user_business_id());

create policy "members read quotes" on public.quotes for select using (business_id = public.user_business_id());
create policy "members write quotes" on public.quotes for all using (business_id = public.user_business_id()) with check (business_id = public.user_business_id());

create policy "members read review snapshots" on public.review_snapshots for select using (business_id = public.user_business_id());
create policy "members write review snapshots" on public.review_snapshots for all using (business_id = public.user_business_id()) with check (business_id = public.user_business_id());

create policy "members read tasks" on public.tasks for select using (business_id = public.user_business_id());
create policy "members write tasks" on public.tasks for all using (business_id = public.user_business_id()) with check (business_id = public.user_business_id());

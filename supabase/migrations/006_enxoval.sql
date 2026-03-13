-- Lista de enxoval interativa
-- Categorias
create table if not exists public.enxoval_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null default 0,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_enxoval_categories_sort
  on public.enxoval_categories (sort_order asc);

-- Itens
create table if not exists public.enxoval_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.enxoval_categories(id) on delete restrict,
  name text not null,
  quantity_total int not null default 1 check (quantity_total >= 0),
  quantity_reserved int not null default 0 check (quantity_reserved >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quantity_reserved_lte_total check (quantity_reserved <= quantity_total)
);

create index if not exists idx_enxoval_items_category
  on public.enxoval_items (category_id);
create index if not exists idx_enxoval_items_active
  on public.enxoval_items (active) where active = true;

-- Reservas
create table if not exists public.enxoval_reservations (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.enxoval_items(id) on delete restrict,
  name text not null,
  phone text not null,
  quantity int not null check (quantity > 0),
  message text,
  status text not null default 'active' check (status in ('active', 'cancelled', 'delivered')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_enxoval_reservations_item
  on public.enxoval_reservations (item_id);
create index if not exists idx_enxoval_reservations_status
  on public.enxoval_reservations (status);
create index if not exists idx_enxoval_reservations_created
  on public.enxoval_reservations (created_at desc);

-- RLS
alter table public.enxoval_categories enable row level security;
alter table public.enxoval_items enable row level security;
alter table public.enxoval_reservations enable row level security;

drop policy if exists "Acesso apenas via service role" on public.enxoval_categories;
create policy "Acesso apenas via service role" on public.enxoval_categories
  for all using (false) with check (false);

drop policy if exists "Acesso apenas via service role" on public.enxoval_items;
create policy "Acesso apenas via service role" on public.enxoval_items
  for all using (false) with check (false);

drop policy if exists "Acesso apenas via service role" on public.enxoval_reservations;
create policy "Acesso apenas via service role" on public.enxoval_reservations
  for all using (false) with check (false);

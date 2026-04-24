-- Investimentos de tráfego cadastrados manualmente no admin (/admin/trafego)
create table if not exists public.traffic_admin_investments (
  id uuid primary key default gen_random_uuid(),
  client_slug text not null default '',
  person_name text not null,
  investment_text text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_traffic_admin_investments_client_created
  on public.traffic_admin_investments (client_slug, created_at desc);

alter table public.traffic_admin_investments enable row level security;

drop policy if exists "Acesso apenas via service role" on public.traffic_admin_investments;
create policy "Acesso apenas via service role"
  on public.traffic_admin_investments for all using (false) with check (false);

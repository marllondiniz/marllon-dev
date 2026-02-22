-- Briefings do formulário de gestão de tráfego (/briefing-trafego)
create table if not exists public.traffic_briefings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp text not null,
  email text not null,
  current_situation text not null,
  goals text not null,
  budget text,
  attended boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_traffic_briefings_created_at
  on public.traffic_briefings (created_at desc);

alter table public.traffic_briefings enable row level security;

drop policy if exists "Acesso apenas via service role" on public.traffic_briefings;
create policy "Acesso apenas via service role"
  on public.traffic_briefings for all using (false) with check (false);

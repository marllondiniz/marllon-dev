-- Briefings do formulário /briefing (site 72h)
create table if not exists public.briefing_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp text not null,
  product text not null,
  audience text not null,
  benefit text not null,
  cta text not null,
  pricing text not null,
  objections text,
  materials text,
  brand_links text,
  page_location text not null,
  deadline text not null,
  traffic text not null,
  integration text,
  refs text,
  restrictions text,
  created_at timestamptz not null default now()
);

create index if not exists idx_briefing_submissions_created_at
  on public.briefing_submissions (created_at desc);

alter table public.briefing_submissions enable row level security;

drop policy if exists "Acesso apenas via service role" on public.briefing_submissions;
create policy "Acesso apenas via service role"
  on public.briefing_submissions for all using (false) with check (false);

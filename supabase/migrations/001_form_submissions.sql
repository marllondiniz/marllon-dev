-- Tabela de leads do formulário (demo alta conversão e outros)
create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp text not null,
  email text not null,
  goal text not null,
  source text not null default 'demo-alta-conversao',
  created_at timestamptz not null default now()
);

-- Índice para listar por data
create index if not exists idx_form_submissions_created_at
  on public.form_submissions (created_at desc);

-- RLS: apenas o backend (service_role) acessa; anon não tem permissão direta na tabela.
-- As inserções/leituras são feitas via API Next.js com service role.
alter table public.form_submissions enable row level security;

-- Política que nega tudo para anon e para authenticated (acesso só via service role na API)
drop policy if exists "Acesso apenas via service role" on public.form_submissions;
create policy "Acesso apenas via service role"
  on public.form_submissions
  for all
  using (false)
  with check (false);

comment on table public.form_submissions is 'Leads do formulário da demo e outras páginas; inserção/leitura via API Next.js.';

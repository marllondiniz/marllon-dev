# Leads no Supabase

Os dados do formulário (demo alta conversão) são salvos no Supabase e visualizados na **página admin**.

## 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto.
2. Em **Settings → API** anote:
   - **Project URL** → use em `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** (secret) → use em `SUPABASE_SERVICE_ROLE_KEY`

## 2. Criar as tabelas

No Supabase, abra **SQL Editor** e execute, na ordem:

1. `supabase/migrations/001_form_submissions.sql` — leads do formulário da demo  
2. `supabase/migrations/002_briefing_submissions.sql` — briefings do formulário /briefing (site 72h)

**Tabela de leads** — ou copie e execute:

```sql
create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp text not null,
  email text not null,
  goal text not null,
  source text not null default 'demo-alta-conversao',
  created_at timestamptz not null default now()
);

create index if not exists idx_form_submissions_created_at
  on public.form_submissions (created_at desc);

alter table public.form_submissions enable row level security;

create policy "Acesso apenas via service role"
  on public.form_submissions for all using (false) with check (false);
```

**Tabela de briefings** — execute também o conteúdo de `supabase/migrations/002_briefing_submissions.sql`.

## 3. Variáveis de ambiente

Crie `.env.local` na raiz do projeto (copie de `.env.local.example`):

- `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto
- `SUPABASE_SERVICE_ROLE_KEY` — chave **service_role** (nunca exponha no client)
- `ADMIN_SECRET` — senha para acessar `/admin`

## 4. Uso

- **Leads (demo):** ao enviar o formulário da página demo alta conversão, os dados vão para `form_submissions`.
- **Briefings (site 72h):** ao enviar o formulário em `/briefing`, os dados vão para `briefing_submissions`.
- **Admin:** acesse `/admin`, digite a senha definida em `ADMIN_SECRET` e veja leads e briefings em tabelas (com link para WhatsApp e e-mail).

-- Marcar cliente como atendido no admin
alter table public.briefing_submissions
  add column if not exists attended boolean not null default false;

comment on column public.briefing_submissions.attended is 'Marcado pelo admin quando o cliente foi atendido.';

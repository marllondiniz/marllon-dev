-- Plano escolhido pelo cliente (Site Express 72h, Site Start, Empresa Pro)
alter table public.briefing_submissions
  add column if not exists plan text;

comment on column public.briefing_submissions.plan is 'Plano escolhido na página de planos: Site Express 72h, Site Start ou Empresa Pro.';

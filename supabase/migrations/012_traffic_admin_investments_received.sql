-- Valor que você recebeu, além do que o cliente colocou na Meta (mídia)
alter table public.traffic_admin_investments
  add column if not exists received_text text;

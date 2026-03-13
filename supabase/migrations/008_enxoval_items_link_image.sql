-- Adiciona link do produto e URL da imagem nos itens
alter table public.enxoval_items
  add column if not exists link text,
  add column if not exists image_url text;

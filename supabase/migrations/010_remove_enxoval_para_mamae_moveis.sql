-- Remove categorias "Para Mamãe" e "Móveis" e seus itens

-- 1. Remove reservas dos itens dessas categorias
delete from public.enxoval_reservations
where item_id in (
  select ei.id from public.enxoval_items ei
  join public.enxoval_categories ec on ec.id = ei.category_id
  where ec.name in ('Para Mamãe', 'Móveis')
);

-- 2. Remove os itens
delete from public.enxoval_items
where category_id in (
  select id from public.enxoval_categories where name in ('Para Mamãe', 'Móveis')
);

-- 3. Remove as categorias
delete from public.enxoval_categories
where name in ('Para Mamãe', 'Móveis');

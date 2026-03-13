-- Seed: categorias e itens da lista de enxoval
-- Ordem: Roupinhas, Diversos, Quarto, Para Mamãe, Banho e Toalete, Passeio, Móveis

insert into public.enxoval_categories (name, sort_order) values
  ('Roupinhas', 1),
  ('Diversos', 2),
  ('Quarto', 3),
  ('Para Mamãe', 4),
  ('Banho e Toalete', 5),
  ('Passeio', 6),
  ('Móveis', 7);

-- Roupinhas
insert into public.enxoval_items (category_id, name, quantity_total)
select c.id, t.name, t.qty from (values
  ('6 Babadores', 6),
  ('6 Bodies manga curta RN', 6),
  ('6 Bodies manga longa RN', 6),
  ('6 Bodies manga curta P', 6),
  ('6 Bodies manga longa P', 6),
  ('2 Casaquinhos de linha', 2),
  ('3 Cueiros', 3),
  ('6 Culotes (mijão) RN', 6),
  ('6 Culotes (mijão) P', 6),
  ('5 Fraldas de tecido', 5),
  ('6 Macacões tamanho RN', 6),
  ('6 Macacões tamanho P', 6),
  ('2 Mantas para passeio', 2),
  ('2 Mantas simples', 2),
  ('3 Pares de luvas', 3),
  ('6 Pares de meias', 6),
  ('1 Saída de maternidade', 1),
  ('4 Sapatinhos', 4),
  ('2 Toucas', 2),
  ('6 Faixas para umbigo', 6),
  ('1 Conjunto de lã ou linha', 1)
) as t(name, qty)
cross join (select id from public.enxoval_categories where name = 'Roupinhas') c(id);

-- Diversos
insert into public.enxoval_items (category_id, name, quantity_total)
select c.id, t.name, t.qty from (values
  ('1 Aspirador nasal', 1),
  ('4 Bicos de mamadeira', 4),
  ('1 Canguru', 1),
  ('1 Sling', 1),
  ('2 Chupetas', 2),
  ('1 Escova de mamadeira', 1),
  ('1 Esterilizador', 1),
  ('3 Mamadeiras grandes', 3),
  ('2 Mamadeiras médias', 2),
  ('1 Mamadeira pequena', 1),
  ('1 Mordedor', 1),
  ('1 Pinça higiênica', 1),
  ('2 Prendedores de chupeta', 2),
  ('1 Termômetro clínico', 1),
  ('1 Umidificador', 1),
  ('1 Babá eletrônica', 1)
) as t(name, qty)
cross join (select id from public.enxoval_categories where name = 'Diversos') c(id);

-- Quarto
insert into public.enxoval_items (category_id, name, quantity_total)
select c.id, t.name, t.qty from (values
  ('2 Cobertores de berço', 2),
  ('2 Mantas', 2),
  ('3 Fronhas avulsas', 3),
  ('4 Jogos de lençol para berço', 4),
  ('2 Kits para berço', 2),
  ('1 Kit sofá cama', 1),
  ('1 Móbile', 1),
  ('1 Cortina', 1)
) as t(name, qty)
cross join (select id from public.enxoval_categories where name = 'Quarto') c(id);

-- Para Mamãe
insert into public.enxoval_items (category_id, name, quantity_total)
select c.id, t.name, t.qty from (values
  ('1 Almofada para amamentar', 1),
  ('1 Almofada para barriga', 1),
  ('1 Concha para seios', 1),
  ('30 Absorventes para seios', 30),
  ('1 Tira-leite', 1),
  ('1 Mala maternidade', 1)
) as t(name, qty)
cross join (select id from public.enxoval_categories where name = 'Para Mamãe') c(id);

-- Banho e Toalete
insert into public.enxoval_items (category_id, name, quantity_total)
select c.id, t.name, t.qty from (values
  ('1 Banheira', 1),
  ('1 Esponja para banheira', 1),
  ('1 Suporte para banho', 1),
  ('1 Termômetro para banho', 1),
  ('3 Toalhas fralda', 3),
  ('1 Trocador', 1),
  ('6 Pacotes de algodão', 6),
  ('1 Massageador p/ manicure', 1),
  ('1 Escova de cabelo', 1),
  ('1 Saboneteira', 1)
) as t(name, qty)
cross join (select id from public.enxoval_categories where name = 'Banho e Toalete') c(id);

-- Passeio
insert into public.enxoval_items (category_id, name, quantity_total)
select c.id, t.name, t.qty from (values
  ('1 Bebê conforto', 1),
  ('2 Capas p/ carrinho', 2),
  ('1 Carrinho de passeio', 1),
  ('1 Encosto para cabeça', 1),
  ('3 Jogos de lençol p/ carrinho', 3),
  ('1 Bolsa grande', 1),
  ('1 Bolsa média', 1),
  ('1 Bolsa pequena', 1),
  ('2 Pacotes de lenço umedecido', 2)
) as t(name, qty)
cross join (select id from public.enxoval_categories where name = 'Passeio') c(id);

-- Móveis
insert into public.enxoval_items (category_id, name, quantity_total)
select c.id, t.name, t.qty from (values
  ('Berço', 1),
  ('Cômoda', 1),
  ('Roupeiro', 1),
  ('Cama babá', 1),
  ('Cadeira para amamentação', 1),
  ('Cabideiro', 1)
) as t(name, qty)
cross join (select id from public.enxoval_categories where name = 'Móveis') c(id);

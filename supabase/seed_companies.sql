-- Vale Mais São José — seed de categorias e empresas parceiras
-- Rode DEPOIS do schema.sql, também no SQL Editor do Supabase.
-- Percentuais marcados como "placeholder" nos comentários podem ser editados
-- diretamente nesta tabela (UPDATE public.partner_companies SET discount_value = ...)
-- assim que os valores reais forem definidos com cada parceiro.

-- ========== CATEGORIAS (ramos) ==========
insert into public.categories (slug, name, sort_order) values
  ('mercado',        'Mercados',                        1),
  ('farmacia',       'Farmácias',                        2),
  ('posto',          'Postos de Combustível',            3),
  ('restaurante',    'Restaurantes e Pizzarias',         4),
  ('salao_barbearia','Salões de Beleza e Barbearias',    5),
  ('clinica',        'Clínicas Médicas e Odontológicas', 6),
  ('otica',          'Óticas',                           7),
  ('academia',       'Academias',                        8),
  ('petshop',        'Pet Shops',                        9),
  ('oficina',        'Oficinas Mecânicas',               10),
  ('lavacao',        'Lava-Rápidos',                     11),
  ('loja_roupa',     'Lojas de Roupas e Calçados',       12),
  ('acougue',        'Açougues',                         13),
  ('padaria',        'Padarias',                         14),
  ('manicure',       'Manicures',                        15),
  ('bar',            'Bares',                            16)
on conflict (slug) do nothing;

-- ========== EMPRESAS PARCEIRAS (31) ==========
-- Nota: dentro de UNION ALL o Postgres perde o tipo do enum na literal de texto,
-- por isso 'percentage'/'fixed_per_liter' recebem cast explícito ::discount_type_enum.

-- Mercados: 5% acima de R$250
insert into public.partner_companies (name, category_id, discount_type, discount_value, min_purchase_value, description, neighborhood)
select 'Mercado DeD', id, 'percentage'::discount_type_enum, 5, 250, '5% de desconto em compras acima de R$ 250', null from public.categories where slug = 'mercado'
union all
select 'Mercado Compre Mais', id, 'percentage'::discount_type_enum, 5, 250, '5% de desconto em compras acima de R$ 250', null from public.categories where slug = 'mercado';

-- Farmácias: 5% em medicamentos e perfumaria
insert into public.partner_companies (name, category_id, discount_type, discount_value, min_purchase_value, description, neighborhood)
select 'Farmácia Fonte da Saúde', id, 'percentage'::discount_type_enum, 5, null::numeric, '5% de desconto em medicamentos e perfumaria', null from public.categories where slug = 'farmacia'
union all
select 'Farmácia do Bruno', id, 'percentage'::discount_type_enum, 5, null::numeric, '5% de desconto em medicamentos e perfumaria', 'Contendas' from public.categories where slug = 'farmacia';

-- Postos: valor fixo por litro
insert into public.partner_companies (name, category_id, discount_type, discount_value, min_purchase_value, description, neighborhood)
select 'Posto de Jaguara', id, 'fixed_per_liter'::discount_type_enum, 0.05, null::numeric, 'R$ 0,05 de desconto por litro abastecido', 'Jaguara' from public.categories where slug = 'posto'
union all
select 'Posto do Valverde', id, 'fixed_per_liter'::discount_type_enum, 0.10, null::numeric, 'R$ 0,10 de desconto por litro abastecido', 'Valverde' from public.categories where slug = 'posto';

-- Restaurantes e pizzarias: 5%
insert into public.partner_companies (name, category_id, discount_type, discount_value, min_purchase_value, description, neighborhood)
select 'Restaurante do Valdoir', id, 'percentage'::discount_type_enum, 5, null::numeric, '5% de desconto no consumo', null from public.categories where slug = 'restaurante'
union all
select 'Churrasco Americano', id, 'percentage'::discount_type_enum, 5, null::numeric, '5% de desconto no consumo', null from public.categories where slug = 'restaurante'
union all
select 'Millas Massas', id, 'percentage'::discount_type_enum, 5, null::numeric, '5% de desconto no consumo', null from public.categories where slug = 'restaurante';

-- Salões de beleza e barbearias (placeholder 10%, ajustar depois)
insert into public.partner_companies (name, category_id, discount_type, discount_value, min_purchase_value, description, neighborhood)
select 'Salão de Beleza Estúdio JR', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto nos serviços (valor a confirmar com o parceiro)', null from public.categories where slug = 'salao_barbearia'
union all
select 'Salão de Beleza Isabela Portilho', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto nos serviços (valor a confirmar com o parceiro)', null from public.categories where slug = 'salao_barbearia'
union all
select 'Barbearia do Elton', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto nos serviços (valor a confirmar com o parceiro)', null from public.categories where slug = 'salao_barbearia'
union all
select 'Barbearia Jaguara/Contendas', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto nos serviços (valor a confirmar com o parceiro)', 'Entre Jaguara e Contendas' from public.categories where slug = 'salao_barbearia';

-- Clínicas médicas e odontológicas (placeholder 10%)
insert into public.partner_companies (name, category_id, discount_type, discount_value, min_purchase_value, description, neighborhood)
select 'Clínica da Raquel', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto em consultas/procedimentos (valor a confirmar com o parceiro)', null from public.categories where slug = 'clinica';

-- Óticas (placeholder 10%)
insert into public.partner_companies (name, category_id, discount_type, discount_value, min_purchase_value, description, neighborhood)
select 'Óticas Carol', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto em óculos e lentes (valor a confirmar com o parceiro)', null from public.categories where slug = 'otica';

-- Academias (placeholder 10%)
insert into public.partner_companies (name, category_id, discount_type, discount_value, min_purchase_value, description, neighborhood)
select 'Academia Black Tiger', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto na mensalidade (valor a confirmar com o parceiro)', null from public.categories where slug = 'academia'
union all
select 'Estúdio Fênix', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto na mensalidade (valor a confirmar com o parceiro)', null from public.categories where slug = 'academia';

-- Pet shops / veterinária (placeholder 10%)
insert into public.partner_companies (name, category_id, discount_type, discount_value, min_purchase_value, description, neighborhood)
select 'Veterinária Amanda', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto em consultas e produtos (valor a confirmar com o parceiro)', null from public.categories where slug = 'petshop'
union all
select 'Loja de Ração JOHA', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto em ração e produtos (valor a confirmar com o parceiro)', null from public.categories where slug = 'petshop';

-- Oficinas mecânicas (placeholder 10%)
insert into public.partner_companies (name, category_id, discount_type, discount_value, min_purchase_value, description, neighborhood)
select 'Oficina do Glauco', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto em serviços (valor a confirmar com o parceiro)', null from public.categories where slug = 'oficina'
union all
select 'Oficina São José', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto em serviços — parceiro a definir', null from public.categories where slug = 'oficina';

-- Lava-rápidos (placeholder 10%)
insert into public.partner_companies (name, category_id, discount_type, discount_value, min_purchase_value, description, neighborhood)
select 'Lavador do Michel', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto na lavagem (valor a confirmar com o parceiro)', null from public.categories where slug = 'lavacao'
union all
select 'Lavador do Valmir', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto na lavagem (valor a confirmar com o parceiro)', null from public.categories where slug = 'lavacao';

-- Lojas de roupas e calçados (placeholder 10%)
insert into public.partner_companies (name, category_id, discount_type, discount_value, min_purchase_value, description, neighborhood)
select 'Loja de Roupas Diniz', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto nas compras (valor a confirmar com o parceiro)', null from public.categories where slug = 'loja_roupa'
union all
select 'Loja de Roupas Nilmar', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto nas compras (valor a confirmar com o parceiro)', null from public.categories where slug = 'loja_roupa';

-- Açougue (parceiro a definir, placeholder 10%)
insert into public.partner_companies (name, category_id, discount_type, discount_value, min_purchase_value, description, neighborhood)
select 'Açougue São José', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto nas compras — parceiro a definir', null from public.categories where slug = 'acougue';

-- Padaria (parceiro a definir, placeholder 10%)
insert into public.partner_companies (name, category_id, discount_type, discount_value, min_purchase_value, description, neighborhood)
select 'Padaria São José', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto nas compras — parceiro a definir', null from public.categories where slug = 'padaria';

-- Manicures (parceiros a definir, placeholder 10%)
insert into public.partner_companies (name, category_id, discount_type, discount_value, min_purchase_value, description, neighborhood)
select 'Manicure São José Centro', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto nos serviços — parceiro a definir', 'São José Centro' from public.categories where slug = 'manicure'
union all
select 'Manicure Camboatá', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto nos serviços — parceiro a definir', 'Camboatá' from public.categories where slug = 'manicure'
union all
select 'Manicure Barrinha', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto nos serviços — parceiro a definir', 'Barrinha' from public.categories where slug = 'manicure';

-- Bar (placeholder 10%)
insert into public.partner_companies (name, category_id, discount_type, discount_value, min_purchase_value, description, neighborhood)
select 'Bar do Zé Patrício', id, 'percentage'::discount_type_enum, 10, null::numeric, '10% de desconto no consumo (valor a confirmar com o parceiro)', null from public.categories where slug = 'bar';

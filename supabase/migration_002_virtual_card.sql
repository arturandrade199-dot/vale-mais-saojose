-- Vale Mais São José — migration: campos para o cartão Vale Mais virtual
-- Rode isso no SQL Editor do Supabase (só precisa rodar uma vez).
-- Se você já aplicou supabase/schema.sql antes desta data, essas colunas
-- ainda não existem na sua tabela profiles — este script adiciona sem
-- apagar nenhum dado.

alter table public.profiles add column if not exists cpf text;
alter table public.profiles add column if not exists birth_date date;

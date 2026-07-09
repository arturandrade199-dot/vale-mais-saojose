-- Vale Mais São José — schema do banco
-- Cole este arquivo inteiro no SQL Editor do Supabase (Project > SQL Editor > New query) e rode.

-- ========== EXTENSIONS ==========
create extension if not exists "pgcrypto";

-- ========== ENUMS ==========
do $$ begin
  create type sexo_enum as enum ('masculino', 'feminino', 'outro', 'prefiro_nao_dizer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type discount_type_enum as enum ('percentage', 'fixed_per_liter', 'fixed_value');
exception when duplicate_object then null; end $$;

do $$ begin
  create type subscription_status_enum as enum ('active', 'inactive', 'past_due', 'canceled');
exception when duplicate_object then null; end $$;

-- ========== TABLES ==========

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  age int,
  sex sexo_enum,
  neighborhood text,
  city text,
  street text,
  cpf text,
  birth_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order int not null default 0
);

create table if not exists public.partner_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  logo_url text,
  discount_type discount_type_enum not null,
  discount_value numeric(10,2) not null,
  min_purchase_value numeric(10,2),
  description text not null,
  neighborhood text,
  city text default 'São José',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status subscription_status_enum not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_partner_companies_category on public.partner_companies(category_id);
create index if not exists idx_partner_companies_active on public.partner_companies(active);
create index if not exists idx_subscriptions_status on public.subscriptions(status);

-- ========== ROW LEVEL SECURITY ==========

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.partner_companies enable row level security;
alter table public.subscriptions enable row level security;

-- profiles: usuário só vê/edita a própria linha
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- categories: leitura pública para qualquer usuário autenticado
drop policy if exists "categories_select_authenticated" on public.categories;
create policy "categories_select_authenticated" on public.categories
  for select using (auth.role() = 'authenticated');

-- partner_companies: leitura para qualquer usuário autenticado (gate real de assinatura é feito no backend)
drop policy if exists "companies_select_authenticated" on public.partner_companies;
create policy "companies_select_authenticated" on public.partner_companies
  for select using (auth.role() = 'authenticated');

-- subscriptions: usuário só lê a própria; sem insert/update via client (só backend com service role, que ignora RLS)
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- ========== TRIGGER: updated_at ==========
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- VION · Schema base
-- Cola este SQL no Supabase: Project → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────

-- 1. Profiles (1:1 com auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  email text,
  criado_em timestamptz default now()
);

-- 2. Testes vibracionais
create table if not exists public.testes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  hz int not null,
  nivel_hz int not null,
  respostas jsonb,
  criado_em timestamptz default now()
);

-- 3. Libertações emocionais
create table if not exists public.libertacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  alvo text,
  intensidade_antes int,
  intensidade_depois int,
  sensacao text,
  criado_em timestamptz default now()
);

-- 4. Estado do protocolo 21 dias
create table if not exists public.protocolo (
  user_id uuid primary key references auth.users(id) on delete cascade,
  inicio timestamptz default now(),
  dias_feitos jsonb default '[]'::jsonb,
  actualizado_em timestamptz default now()
);

-- 5. Compras (premium, etc)
create table if not exists public.compras (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  produto text,
  valor_cents int,
  fonte text, -- 'stripe' | 'revenuecat' | 'dev'
  criado_em timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────
alter table public.profiles    enable row level security;
alter table public.testes      enable row level security;
alter table public.libertacoes enable row level security;
alter table public.protocolo   enable row level security;
alter table public.compras     enable row level security;

-- profiles: o utilizador lê/escreve apenas o seu
create policy "profiles_self" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- testes
create policy "testes_self" on public.testes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- libertações
create policy "libertacoes_self" on public.libertacoes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- protocolo
create policy "protocolo_self" on public.protocolo
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- compras (só leitura ao próprio; escrita via service role)
create policy "compras_self_read" on public.compras
  for select using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────
-- Trigger: criar profile automaticamente no signup
-- ─────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome, email)
  values (new.id, new.raw_user_meta_data->>'nome', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

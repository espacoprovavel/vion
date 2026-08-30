-- ============================================================================
-- ÂMAGO — esquema da base de dados (Supabase / Postgres, região UE)
-- Executar no SQL Editor do Supabase, de uma vez, num projeto novo.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Tipos ───────────────────────────────────────────────────────────────────
do $$ begin
  create type papel_utilizador as enum ('user', 'master');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tipo_pergunta as enum ('arquetipo', 'camada', 'somatica', 'autodeclaracao');
exception when duplicate_object then null; end $$;

do $$ begin
  create type camada_mergulho as enum
    ('comportamento', 'historia', 'funcao', 'terreno', 'comando', 'gatilho');
exception when duplicate_object then null; end $$;

do $$ begin
  create type grau_fonte as enum ('ciencia', 'modelo');   -- 🟢 / 🟡
exception when duplicate_object then null; end $$;

do $$ begin
  create type estado_item as enum ('rascunho', 'publicado', 'arquivado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type porta_entrada as enum ('duvida', 'curiosidade', 'dificuldade');
exception when duplicate_object then null; end $$;

-- ── users ───────────────────────────────────────────────────────────────────
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role papel_utilizador not null default 'user',
  -- Consentimento RGPD explícito (art. 9.º — categorias especiais de dados).
  consentimento_em timestamptz,
  consentimento_versao text,
  criado_em timestamptz not null default now()
);

-- Perfil criado automaticamente no registo.
create or replace function public.trata_novo_utilizador()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.trata_novo_utilizador();

-- ── archetypes ──────────────────────────────────────────────────────────────
create table if not exists public.archetypes (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  nome_sombra text not null,
  nome_integrado text not null,
  medo text not null,
  caminho text not null,
  descricao text not null default '',
  -- O Toque, em três tempos.
  toque_reconhece text not null default '',
  toque_agradece text not null default '',
  toque_liberta text not null default '',
  proximo_passo text not null default '',
  ativo boolean not null default true,
  ordem int not null default 0,
  atualizado_em timestamptz not null default now()
);

-- ── questions / answer_options ──────────────────────────────────────────────
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  chave text not null unique,               -- 'q1'… — estável para o motor
  texto text not null,
  nota text,
  ronda smallint not null check (ronda between 1 and 5),
  tipo tipo_pergunta not null,
  peso numeric not null default 1,          -- peso do sinal de arquétipo
  peso_camada numeric not null default 0,   -- peso, por omissão, para o Véu
  ativo boolean not null default true,
  ordem int not null default 0,
  atualizado_em timestamptz not null default now()
);

create table if not exists public.answer_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  chave text not null,                      -- 'q1a'…
  texto text not null,
  arquetipo text references public.archetypes(codigo) on update cascade,
  camada camada_mergulho,
  peso_camada numeric,                      -- sobrepõe-se ao da pergunta
  ordem int not null default 0,
  unique (question_id, chave)
);

create index if not exists idx_opcoes_pergunta on public.answer_options(question_id);

-- ── knowledge_items — UM só corpo de conhecimento ───────────────────────────
create table if not exists public.knowledge_items (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  corpo text not null,
  tema text,                                -- etiqueta opcional
  grau_fonte grau_fonte not null default 'modelo',
  estado estado_item not null default 'rascunho',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists idx_conhecimento_estado on public.knowledge_items(estado);

-- ── assessments / respostas / resultados ────────────────────────────────────
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  porta porta_entrada not null,
  -- Texto livre da entrada: dado sensível, guardado só com consentimento.
  descricao text,
  rede_seguranca_acionada boolean not null default false,
  criado_em timestamptz not null default now()
);

create index if not exists idx_assessments_user on public.assessments(user_id, criado_em desc);

create table if not exists public.assessment_answers (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  question_id uuid references public.questions(id) on delete set null,
  answer_option_id uuid references public.answer_options(id) on delete set null,
  -- Cópia estável das chaves: o Master pode reescrever perguntas sem
  -- corromper o histórico já produzido nem o painel agregado.
  question_chave text not null,
  option_chave text not null,
  option_texto text not null
);

create index if not exists idx_respostas_assessment on public.assessment_answers(assessment_id);
create index if not exists idx_respostas_chaves on public.assessment_answers(question_chave, option_chave);

create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null unique references public.assessments(id) on delete cascade,
  arquetipo_sombra text not null,
  arquetipo_integrado text not null,
  camada_veu camada_mergulho not null,
  fosso_detetado boolean not null default false,
  fosso_o_que_dizes text,
  fosso_o_que_mostras text,
  proximo_passo text not null default '',
  lentes_usadas text not null default '',
  -- Leitura já composta, para o histórico não depender da versão do motor.
  leitura jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);

create index if not exists idx_results_arquetipo on public.results(arquetipo_sombra);

-- ============================================================================
-- RLS — por omissão, ninguém vê nada de ninguém.
-- ============================================================================
alter table public.users             enable row level security;
alter table public.archetypes        enable row level security;
alter table public.questions         enable row level security;
alter table public.answer_options    enable row level security;
alter table public.knowledge_items   enable row level security;
alter table public.assessments       enable row level security;
alter table public.assessment_answers enable row level security;
alter table public.results           enable row level security;

-- Evita recursão nas políticas que consultam public.users.
create or replace function public.e_master()
returns boolean
language sql
stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'master'
  );
$$;

-- users
drop policy if exists users_le_proprio on public.users;
create policy users_le_proprio on public.users
  for select using (id = auth.uid() or public.e_master());

drop policy if exists users_atualiza_proprio on public.users;
create policy users_atualiza_proprio on public.users
  for update using (id = auth.uid()) with check (id = auth.uid() and role = 'user');

drop policy if exists users_master_gere on public.users;
create policy users_master_gere on public.users
  for all using (public.e_master()) with check (public.e_master());

-- Conteúdo do Mergulho: leitura para quem tem sessão, escrita só para o Master.
do $$
declare t text;
begin
  foreach t in array array['archetypes', 'questions', 'answer_options'] loop
    execute format('drop policy if exists %I_le on public.%I', t, t);
    execute format('create policy %I_le on public.%I for select to authenticated using (true)', t, t);
    execute format('drop policy if exists %I_master on public.%I', t, t);
    execute format('create policy %I_master on public.%I for all using (public.e_master()) with check (public.e_master())', t, t);
  end loop;
end $$;

-- Conhecimento: publicado é legível; o resto é só do Master.
drop policy if exists conhecimento_le on public.knowledge_items;
create policy conhecimento_le on public.knowledge_items
  for select to authenticated using (estado = 'publicado' or public.e_master());

drop policy if exists conhecimento_master on public.knowledge_items;
create policy conhecimento_master on public.knowledge_items
  for all using (public.e_master()) with check (public.e_master());

-- Assessments: cada pessoa vê só os seus. O Master NÃO lê o texto de ninguém —
-- o painel agregado vive de vistas anónimas (abaixo).
drop policy if exists assessments_proprio on public.assessments;
create policy assessments_proprio on public.assessments
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists respostas_proprio on public.assessment_answers;
create policy respostas_proprio on public.assessment_answers
  for all using (
    exists (select 1 from public.assessments a
            where a.id = assessment_id and a.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.assessments a
            where a.id = assessment_id and a.user_id = auth.uid())
  );

drop policy if exists results_proprio on public.results;
create policy results_proprio on public.results
  for all using (
    exists (select 1 from public.assessments a
            where a.id = assessment_id and a.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.assessments a
            where a.id = assessment_id and a.user_id = auth.uid())
  );

-- ============================================================================
-- Painel Master: agregados ANÓNIMOS. Sem user_id, sem texto livre.
-- ============================================================================
create or replace function public.agregado_arquetipos()
returns table (arquetipo text, total bigint)
language sql stable security definer set search_path = public
as $$
  select r.arquetipo_sombra, count(*)
  from public.results r
  where public.e_master()
  group by 1 order by 2 desc;
$$;

create or replace function public.agregado_camadas_veu()
returns table (camada text, total bigint)
language sql stable security definer set search_path = public
as $$
  select r.camada_veu::text, count(*)
  from public.results r
  where public.e_master()
  group by 1 order by 2 desc;
$$;

create or replace function public.agregado_respostas()
returns table (question_chave text, option_chave text, option_texto text, total bigint)
language sql stable security definer set search_path = public
as $$
  select aa.question_chave, aa.option_chave, aa.option_texto, count(*)
  from public.assessment_answers aa
  where public.e_master()
  group by 1, 2, 3 order by 1, 4 desc;
$$;

create or replace function public.agregado_resumo()
returns table (
  total_mergulhos bigint,
  total_pessoas bigint,
  com_fosso bigint,
  rede_seguranca bigint
)
language sql stable security definer set search_path = public
as $$
  select
    (select count(*) from public.assessments where public.e_master()),
    (select count(distinct user_id) from public.assessments where public.e_master()),
    (select count(*) from public.results where fosso_detetado and public.e_master()),
    (select count(*) from public.assessments where rede_seguranca_acionada and public.e_master());
$$;

revoke all on function public.agregado_arquetipos()   from public;
revoke all on function public.agregado_camadas_veu()  from public;
revoke all on function public.agregado_respostas()    from public;
revoke all on function public.agregado_resumo()       from public;
grant execute on function public.agregado_arquetipos()  to authenticated;
grant execute on function public.agregado_camadas_veu() to authenticated;
grant execute on function public.agregado_respostas()   to authenticated;
grant execute on function public.agregado_resumo()      to authenticated;

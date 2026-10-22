-- ============================================================
-- MIGRATION: create_ministry_functions
-- DOMÍNIO:   ministry (funções) e member (habilitações)
-- FEATURE:   FOUNDATION-002 — Fundação de Persistência
--            (Data Task D5 "ministry_functions" e
--            "ministry_member_functions", D4 trigger)
--
-- OBJETIVO:
-- Criar, no mesmo objetivo (D9, item 7: funções + habilitações):
--   1. mescala.ministry_functions: as funções de cada ministério
--      (ex.: vocal, câmera), configuráveis pela igreja;
--   2. mescala.ministry_member_functions: as habilitações, isto é,
--      as funções que um vínculo com o ministério pode exercer.
--
-- REGRAS:
-- - modulos/FUNCOES e 05-REGRAS-DE-NEGOCIO#ESC-002 (parte
--   estrutural): a habilitação liga um vínculo e uma função do MESMO
--   ministério (relatório de dados, E3) — FKs compostas por
--   ministry_id para ministry_memberships e ministry_functions.
-- - fluxos/FLUXO-MEMBROS (passo 4): as funções ficam no vínculo com
--   o ministério.
-- - 05-REGRAS-DE-NEGOCIO#SEC-001 e relatório de dados, E1: church_id
--   ligado até a raiz pela FK composta (church_id, ministry_id) →
--   ministries (church_id, id), nas duas tabelas.
-- - decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-013: nome da função
--   único no ministério sem diferenciar maiúsculas, valendo para
--   todos os status —
--   ministry_functions_church_id_ministry_id_lower_name_key (com
--   church_id pela ARQ-F002-14).
--   "Nome válido": NOT NULL, não vazio e sem espaço em branco nas
--   pontas.
-- - 05-REGRAS-DE-NEGOCIO#HIS-001 e DATA-DEC-012: função com status
--   ATIVO, INATIVO (dados/STATUS#Vínculos, ministérios e funções) e
--   ended_at; FKs com RESTRICT. Sem DEFAULT no status; nenhum CHECK
--   acopla status e ended_at (ARQ-F002-09).
-- - Habilitação: PK composta (church_id, ministry_membership_id,
--   ministry_function_id), com church_id pela ARQ-F002-14, e só
--   created_at (não tem atributo mutável; contrato, 5.5). Sem UPDATE
--   nem DELETE para o backend nesta fundação: revogar habilitação é
--   decisão da feature de funções do membro.
-- - ARQ-F002-12: colunas ministry_membership_id e
--   ministry_function_id (nomes explícitos, sem ambiguidade com o
--   vínculo da igreja).
-- - ARQ-F002-14 (05-REGRAS-DE-NEGOCIO#SEC-001; F002-QA-01): as duas
--   unicidades alcançáveis por INSERT levam church_id. O RLS só fixa
--   church_id, e o índice único é checado antes da FK composta, que
--   roda no fim do comando. Sem church_id na chave, um INSERT com
--   ministério ou vínculo de outra igreja responderia 23505 (e não
--   23503) e revelaria o nome da função ou a habilitação dessa
--   igreja. Com church_id, a chave nunca colide com linha de outra
--   igreja, e as FKs compostas respondem 23503. Equivalência pelas
--   FKs: o vínculo determina o ministério (E3) e o ministério
--   determina a igreja (E1). Logo (church_id, ministry_id,
--   lower(name)) equivale a (ministry_id, lower(name)), e (church_id,
--   ministry_membership_id, ministry_function_id) equivale a
--   (ministry_membership_id, ministry_function_id).
-- - Função não é enum: é dado configurável do ministério.
--
-- NOMES (D10, limite de 63 caracteres):
-- - A FK (ministry_id, ministry_membership_id) teria, pelo padrão
--   literal, o nome
--   ministry_member_functions_ministry_id_ministry_membership_id_fkey
--   (65 caracteres). Abreviação: retirado o "_id" final da segunda
--   coluna →
--   ministry_member_functions_ministry_id_ministry_membership_fkey
--   (62 caracteres).
-- - ministry_member_functions_ministry_id_ministry_function_id_fkey
--   tem exatamente 63 caracteres (no limite, sem truncamento): segue
--   o padrão literal.
--
-- ÍNDICES:
-- - ministry_functions_ministry_id_id_key (UNIQUE): alvo da FK E3.
-- - ministry_functions_church_id_ministry_id_lower_name_key (UNIQUE
--   de expressão).
-- - ministry_member_functions_pkey (church_id,
--   ministry_membership_id, ministry_function_id): funções de um
--   vínculo, com o church_id do contexto (RLS; contrato, seção 10).
--   Sem índice próprio para o lado referenciador da FK por vínculo:
--   não há DELETE em ministry_memberships (ARQ-F002-14).
-- - ministry_member_functions_ministry_function_id_idx: "quem pode
--   exercer a função F" (escalação).
--
-- DEPENDÊNCIAS:
-- - 20261022150000_create_official_schema: mescala.set_updated_at().
-- - 20261022150400_create_ministries: ministries_church_id_id_key.
-- - 20261022150500_create_ministry_memberships:
--   ministry_memberships_ministry_id_id_key.
--
-- COMO DESFAZER (só com orientação do Arquiteto; nesta ordem):
--   drop table mescala.ministry_member_functions;
--   drop table mescala.ministry_functions;   -- remove índices e trigger
-- ============================================================


-- 1. Funções do ministério --------------------------------------

create table mescala.ministry_functions (
  id           uuid        not null default pg_catalog.gen_random_uuid(),
  church_id    uuid        not null,
  ministry_id  uuid        not null,
  name         text        not null,
  status       text        not null,
  ended_at     timestamptz,
  created_at   timestamptz not null default pg_catalog.now(),
  updated_at   timestamptz not null default pg_catalog.now(),

  constraint ministry_functions_pkey
    primary key (id),
  constraint ministry_functions_ministry_id_id_key
    unique (ministry_id, id),
  constraint ministry_functions_church_id_ministry_id_fkey
    foreign key (church_id, ministry_id)
    references mescala.ministries (church_id, id)
    on delete restrict
    on update no action,
  constraint ministry_functions_name_check
    check (name <> '' and name !~ '^[[:space:]]|[[:space:]]$'),
  constraint ministry_functions_status_check
    check (status in ('ATIVO', 'INATIVO'))
);

create unique index ministry_functions_church_id_ministry_id_lower_name_key
  on mescala.ministry_functions (church_id, ministry_id, pg_catalog.lower(name));

alter table mescala.ministry_functions enable row level security;

create trigger ministry_functions_set_updated_at
  before update on mescala.ministry_functions
  for each row
  execute function mescala.set_updated_at();


-- 2. Habilitações (funções que o vínculo pode exercer) ----------

create table mescala.ministry_member_functions (
  church_id               uuid        not null,
  ministry_id             uuid        not null,
  ministry_membership_id  uuid        not null,
  ministry_function_id    uuid        not null,
  created_at              timestamptz not null default pg_catalog.now(),

  constraint ministry_member_functions_pkey
    primary key (church_id, ministry_membership_id, ministry_function_id),
  constraint ministry_member_functions_church_id_ministry_id_fkey
    foreign key (church_id, ministry_id)
    references mescala.ministries (church_id, id)
    on delete restrict
    on update no action,
  constraint ministry_member_functions_ministry_id_ministry_membership_fkey
    foreign key (ministry_id, ministry_membership_id)
    references mescala.ministry_memberships (ministry_id, id)
    on delete restrict
    on update no action,
  constraint ministry_member_functions_ministry_id_ministry_function_id_fkey
    foreign key (ministry_id, ministry_function_id)
    references mescala.ministry_functions (ministry_id, id)
    on delete restrict
    on update no action
);

create index ministry_member_functions_ministry_function_id_idx
  on mescala.ministry_member_functions (ministry_function_id);

alter table mescala.ministry_member_functions enable row level security;

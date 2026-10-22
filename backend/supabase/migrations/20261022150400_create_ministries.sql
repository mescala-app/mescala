-- ============================================================
-- MIGRATION: create_ministries
-- DOMÍNIO:   ministry
-- FEATURE:   FOUNDATION-002 — Fundação de Persistência
--            (Data Task D5 "ministries", D4 trigger)
--
-- OBJETIVO:
-- Criar mescala.ministries, os ministérios configuráveis de cada
-- igreja (nome canônico "Ministério"; antes "Equipe").
--
-- REGRAS:
-- - decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-001: Equipe e
--   Ministério são o mesmo conceito; tabela ministries.
-- - 05-REGRAS-DE-NEGOCIO#SEC-001: church_id obrigatório, com FK
--   para a raiz do tenant.
-- - DATA-DEC-013: nome único na igreja sem diferenciar maiúsculas,
--   valendo para todos os status — índice único de expressão
--   ministries_church_id_lower_name_key. "Nome válido": NOT NULL,
--   não vazio e sem espaço em branco nas pontas.
-- - 05-REGRAS-DE-NEGOCIO#HIS-001 e DATA-DEC-012: status ATIVO,
--   INATIVO (dados/STATUS#Vínculos, ministérios e funções) e
--   ended_at; FKs com RESTRICT. Sem DEFAULT no status; nenhum CHECK
--   acopla status e ended_at (ARQ-F002-09).
-- - Isolamento estrutural (relatório de dados, E1):
--   ministries_church_id_id_key é o alvo das FKs compostas
--   (church_id, ministry_id) de ministry_memberships,
--   ministry_functions e ministry_member_functions, que impedem
--   ligar dados de uma igreja a ministério de outra.
-- - Ministério não é enum: é dado configurável da igreja.
--
-- ÍNDICES:
-- - ministries_church_id_id_key (UNIQUE): alvo das FKs compostas;
--   começa por church_id, então serve também à FK para churches e
--   ao predicado de RLS.
-- - ministries_church_id_lower_name_key (UNIQUE de expressão).
--
-- DEPENDÊNCIAS:
-- - 20261022150000_create_official_schema: mescala.set_updated_at().
-- - 20261022150200_create_churches: mescala.churches(id).
--
-- COMO DESFAZER (só com orientação do Arquiteto, depois de desfazer
-- as migrations seguintes que referenciam ministries):
--   drop table mescala.ministries;   -- remove índices e trigger
-- ============================================================

create table mescala.ministries (
  id          uuid        not null default pg_catalog.gen_random_uuid(),
  church_id   uuid        not null,
  name        text        not null,
  status      text        not null,
  ended_at    timestamptz,
  created_at  timestamptz not null default pg_catalog.now(),
  updated_at  timestamptz not null default pg_catalog.now(),

  constraint ministries_pkey
    primary key (id),
  constraint ministries_church_id_id_key
    unique (church_id, id),
  constraint ministries_church_id_fkey
    foreign key (church_id)
    references mescala.churches (id)
    on delete restrict
    on update no action,
  constraint ministries_name_check
    check (name <> '' and name !~ '^[[:space:]]|[[:space:]]$'),
  constraint ministries_status_check
    check (status in ('ATIVO', 'INATIVO'))
);

create unique index ministries_church_id_lower_name_key
  on mescala.ministries (church_id, pg_catalog.lower(name));

alter table mescala.ministries enable row level security;

create trigger ministries_set_updated_at
  before update on mescala.ministries
  for each row
  execute function mescala.set_updated_at();

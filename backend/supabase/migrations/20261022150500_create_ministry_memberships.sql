-- ============================================================
-- MIGRATION: create_ministry_memberships
-- DOMÍNIO:   member
-- FEATURE:   FOUNDATION-002 — Fundação de Persistência
--            (Data Task D5 "ministry_memberships", D4 trigger)
--
-- OBJETIVO:
-- Criar mescala.ministry_memberships, o vínculo do usuário com um
-- ministério, com o papel dele naquele ministério.
--
-- REGRAS:
-- - 05-REGRAS-DE-NEGOCIO#MEM-002, DATA-DEC-008 e DATA-DEC-009: um
--   vínculo por (ministério, usuário), com um único papel (LEADER ou
--   MEMBER); vários LEADER por ministério (sem índice de líder) —
--   ministry_memberships_church_id_ministry_id_user_id_key.
-- - ARQ-F002-14 (05-REGRAS-DE-NEGOCIO#SEC-001; F002-QA-01): a
--   unicidade leva church_id. O RLS só fixa church_id, e o índice
--   único é checado antes da FK composta, que roda no fim do
--   comando. Sem church_id na chave, um INSERT com ministry_id de
--   outra igreja responderia 23505 (e não 23503) e revelaria o
--   vínculo dessa igreja. Com church_id, a chave nunca colide com
--   linha de outra igreja, e a FK E1 responde 23503. Pela FK E1,
--   ministry_id determina church_id: UNIQUE(church_id, ministry_id,
--   user_id) equivale a UNIQUE(ministry_id, user_id).
-- - decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 e
--   04-USUARIOS-E-PERMISSOES: papéis do ministério LEADER, MEMBER.
-- - fluxos/FLUXO-MEMBROS (passos 1 a 3) e relatório de dados, E2:
--   o vínculo com o ministério exige vínculo com a MESMA igreja —
--   FK composta (church_id, user_id) → church_memberships
--   (church_id, user_id).
-- - 05-REGRAS-DE-NEGOCIO#SEC-001 e relatório de dados, E1: o
--   ministério é da mesma igreja — FK composta (church_id,
--   ministry_id) → ministries (church_id, id). Assim church_id fica
--   ligado até a raiz, sem FK "solta" para churches.
-- - 05-REGRAS-DE-NEGOCIO#HIS-001 e DATA-DEC-012: status ATIVO,
--   INATIVO e ended_at; FKs com RESTRICT. Sem DEFAULT no status;
--   nenhum CHECK acopla status e ended_at (ARQ-F002-09).
-- - ministry_memberships_ministry_id_id_key é o alvo da FK composta
--   (ministry_id, ministry_membership_id) de
--   ministry_member_functions (relatório de dados, E3).
--
-- ÍNDICES:
-- - ministry_memberships_church_id_ministry_id_user_id_key (UNIQUE):
--   consultas por igreja e ministério; lado referenciador da FK E1.
-- - ministry_memberships_ministry_id_id_key (UNIQUE): alvo de FK.
-- - ministry_memberships_church_id_user_id_idx: FK E2, predicado de
--   RLS (começa por church_id) e "meus ministérios".
--
-- DEPENDÊNCIAS:
-- - 20261022150000_create_official_schema: mescala.set_updated_at().
-- - 20261022150300_create_church_memberships:
--   church_memberships_church_id_user_id_key.
-- - 20261022150400_create_ministries: ministries_church_id_id_key.
--
-- COMO DESFAZER (só com orientação do Arquiteto, depois de desfazer
-- as migrations seguintes que referenciam ministry_memberships):
--   drop table mescala.ministry_memberships;   -- remove índices e trigger
-- ============================================================

create table mescala.ministry_memberships (
  id           uuid        not null default pg_catalog.gen_random_uuid(),
  church_id    uuid        not null,
  ministry_id  uuid        not null,
  user_id      uuid        not null,
  role         text        not null,
  status       text        not null,
  ended_at     timestamptz,
  created_at   timestamptz not null default pg_catalog.now(),
  updated_at   timestamptz not null default pg_catalog.now(),

  constraint ministry_memberships_pkey
    primary key (id),
  constraint ministry_memberships_church_id_ministry_id_user_id_key
    unique (church_id, ministry_id, user_id),
  constraint ministry_memberships_ministry_id_id_key
    unique (ministry_id, id),
  constraint ministry_memberships_church_id_ministry_id_fkey
    foreign key (church_id, ministry_id)
    references mescala.ministries (church_id, id)
    on delete restrict
    on update no action,
  constraint ministry_memberships_church_id_user_id_fkey
    foreign key (church_id, user_id)
    references mescala.church_memberships (church_id, user_id)
    on delete restrict
    on update no action,
  constraint ministry_memberships_role_check
    check (role in ('LEADER', 'MEMBER')),
  constraint ministry_memberships_status_check
    check (status in ('ATIVO', 'INATIVO'))
);

create index ministry_memberships_church_id_user_id_idx
  on mescala.ministry_memberships (church_id, user_id);

alter table mescala.ministry_memberships enable row level security;

create trigger ministry_memberships_set_updated_at
  before update on mescala.ministry_memberships
  for each row
  execute function mescala.set_updated_at();

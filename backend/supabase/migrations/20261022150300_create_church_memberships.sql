-- ============================================================
-- MIGRATION: create_church_memberships
-- DOMÍNIO:   church
-- FEATURE:   FOUNDATION-002 — Fundação de Persistência
--            (Data Task D5 "church_memberships", D4 trigger)
--
-- OBJETIVO:
-- Criar mescala.church_memberships, o vínculo entre usuário e
-- igreja, com o papel do usuário naquela igreja.
--
-- REGRAS:
-- - decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 e
--   04-USUARIOS-E-PERMISSOES: papéis da igreja OWNER, ADMIN, MEMBER.
--   Cargo (ANCIÃO) não é papel. Nada vem do token.
-- - DATA-DEC-006: um usuário pode estar em N igrejas; um vínculo
--   por (igreja, usuário) — church_memberships_church_id_user_id_key,
--   que também é alvo da FK composta E2 de ministry_memberships.
-- - 05-REGRAS-DE-NEGOCIO#IGR-001 e DATA-DEC-007: no máximo um
--   OWNER por igreja, em qualquer status — índice único parcial
--   church_memberships_church_id_owner_key. "Pelo menos um" fica
--   com o backend (a CHURCH-001 cria igreja e OWNER na mesma
--   transação).
-- - 05-REGRAS-DE-NEGOCIO#MEM-001 e DATA-DEC-010: todo vínculo
--   aponta para users, que aponta para auth.users.
-- - 05-REGRAS-DE-NEGOCIO#HIS-001 e DATA-DEC-012: status ATIVO,
--   INATIVO (dados/STATUS#Vínculos, ministérios e funções) e
--   ended_at; FKs com RESTRICT; nada é apagado.
-- - DATA-DEC-016 (A): text + CHECK; transições no backend. Sem
--   DEFAULT no status; nenhum CHECK acopla status e ended_at
--   (ARQ-F002-09).
-- - Sem UNIQUE(church_id, id): nenhuma FK o usa (contrato, 5.5).
--
-- NOMES (D10):
-- - church_memberships_church_id_owner_key: índice único parcial
--   (church_id) WHERE role = 'OWNER'. O padrão <tabela>_<colunas>_key
--   ganhou o sufixo da regra ("owner") para não ser confundido com
--   uma unicidade simples de church_id.
--
-- ÍNDICES:
-- - church_memberships_church_id_user_id_key (UNIQUE): começa por
--   church_id; serve à FK para churches, ao predicado de RLS e à
--   FK composta E2.
-- - church_memberships_user_id_idx: "minhas igrejas" (CHURCH-002) e
--   FK para users.
--
-- DEPENDÊNCIAS:
-- - 20261022150000_create_official_schema: mescala.set_updated_at().
-- - 20261022150100_create_users: mescala.users(id).
-- - 20261022150200_create_churches: mescala.churches(id).
--
-- COMO DESFAZER (só com orientação do Arquiteto, depois de desfazer
-- as migrations seguintes que referenciam church_memberships):
--   drop table mescala.church_memberships;   -- remove índices e trigger
-- ============================================================

create table mescala.church_memberships (
  id          uuid        not null default pg_catalog.gen_random_uuid(),
  church_id   uuid        not null,
  user_id     uuid        not null,
  role        text        not null,
  status      text        not null,
  ended_at    timestamptz,
  created_at  timestamptz not null default pg_catalog.now(),
  updated_at  timestamptz not null default pg_catalog.now(),

  constraint church_memberships_pkey
    primary key (id),
  constraint church_memberships_church_id_user_id_key
    unique (church_id, user_id),
  constraint church_memberships_church_id_fkey
    foreign key (church_id)
    references mescala.churches (id)
    on delete restrict
    on update no action,
  constraint church_memberships_user_id_fkey
    foreign key (user_id)
    references mescala.users (id)
    on delete restrict
    on update no action,
  constraint church_memberships_role_check
    check (role in ('OWNER', 'ADMIN', 'MEMBER')),
  constraint church_memberships_status_check
    check (status in ('ATIVO', 'INATIVO'))
);

create unique index church_memberships_church_id_owner_key
  on mescala.church_memberships (church_id)
  where role = 'OWNER';

create index church_memberships_user_id_idx
  on mescala.church_memberships (user_id);

alter table mescala.church_memberships enable row level security;

create trigger church_memberships_set_updated_at
  before update on mescala.church_memberships
  for each row
  execute function mescala.set_updated_at();

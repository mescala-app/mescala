-- ============================================================
-- MIGRATION: create_users
-- DOMÍNIO:   auth (identidade do Mescala)
-- FEATURE:   FOUNDATION-002 — Fundação de Persistência
--            (Data Task D5 "users", D4 trigger)
--
-- OBJETIVO:
-- Criar mescala.users, a âncora global de identidade do Mescala:
-- uma linha por conta do Supabase Auth do projeto oficial. Todas as
-- FKs de pessoa do modelo apontam para users.id; nenhuma outra
-- tabela aponta para auth.users.
--
-- REGRAS:
-- - decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-019: tabela própria
--   users ligada ao provedor por auth_user_id (UNIQUE, FK para
--   auth.users do projeto vitqnyzuvrvkmnvshcpb).
-- - decisoes/ADR-003-AUTENTICACAO (item 6 e Consequências): o sub
--   do token é identificador externo; o usuário do Mescala é
--   entidade própria.
-- - 05-REGRAS-DE-NEGOCIO#HIS-001 e DATA-DEC-012: FK com RESTRICT;
--   excluir a conta no Supabase Auth falha enquanto existir o
--   usuário do Mescala (risco R-07 aceito; LGPD exige feature de
--   anonimização).
-- - Global, sem church_id: uma pessoa pode estar em N igrejas
--   (DATA-DEC-006).
-- - Só id, auth_user_id e timestamps (ARQ-F002-02): os atributos da
--   DATA-DEC-013 entram na AUTH-002 (com a obrigatoriedade da
--   DEC-06); status de usuário, se existir, na AUTH-003.
-- - RLS habilitado, não forçado, e SEM policy (D8: users nega tudo).
--   Nenhum privilégio para mescala_app (D7). Policies e grants de
--   users vêm da AUTH-002/003.
--
-- DEPENDÊNCIAS:
-- - 20261022150000_create_official_schema: schema mescala e função
--   mescala.set_updated_at().
-- - auth.users(id) do Supabase Auth (única referência externa).
--
-- COMO DESFAZER (só com orientação do Arquiteto, depois de desfazer
-- as migrations seguintes que referenciam users):
--   drop table mescala.users;   -- remove também o trigger e a FK
-- ============================================================

create table mescala.users (
  id            uuid        not null default pg_catalog.gen_random_uuid(),
  auth_user_id  uuid        not null,
  created_at    timestamptz not null default pg_catalog.now(),
  updated_at    timestamptz not null default pg_catalog.now(),

  constraint users_pkey
    primary key (id),
  constraint users_auth_user_id_key
    unique (auth_user_id),
  constraint users_auth_user_id_fkey
    foreign key (auth_user_id)
    references auth.users (id)
    on delete restrict
    on update no action
);

alter table mescala.users enable row level security;

create trigger users_set_updated_at
  before update on mescala.users
  for each row
  execute function mescala.set_updated_at();

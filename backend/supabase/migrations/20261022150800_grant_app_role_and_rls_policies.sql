-- ============================================================
-- MIGRATION: grant_app_role_and_rls_policies
-- DOMÍNIO:   foundation (secundários: church, ministry, member, audit)
-- FEATURE:   FOUNDATION-002 — Fundação de Persistência
--            (Data Task D7 e D8, mais a retirada de privilégios das
--            tabelas e funções)
--
-- OBJETIVO:
--   1. Retirar todo privilégio de PUBLIC, anon, authenticated,
--      service_role e authenticator em todas as tabelas e funções do
--      schema mescala (D7, última linha; Feature Contract, seção 9,
--      "Quem não acessa"; critério 13).
--   2. Conceder a mescala_app exatamente a matriz D7.
--   3. Criar as policies de isolamento por igreja da matriz D8.
--
-- REGRAS:
-- - decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-020: as policies usam o
--   contexto da transação (mescala.context_church_id() e
--   mescala.context_user_id()).
-- - 05-REGRAS-DE-NEGOCIO#SEC-001 e seguranca/ISOLAMENTO-DE-DADOS:
--   nada é lido ou gravado fora do contexto da igreja.
-- - 05-REGRAS-DE-NEGOCIO#HIS-001 (ARQ-F002-06): nenhum DELETE nem
--   TRUNCATE para o backend; nem REFERENCES nem TRIGGER.
-- - ARQ-F002-07 (mass assignment): UPDATE só nas colunas de atributo
--   e estado. id, church_id, user_id, ministry_id, created_at e
--   updated_at ficam imutáveis para o backend (updated_at é mantido
--   pelo trigger, que não depende de privilégio de coluna).
-- - ARQ-F002-15 (seguranca/AUDITORIA; DATA-DEC-021): INSERT em
--   audit_log só nas colunas church_id, actor_user_id, action,
--   entity_type, entity_id, before_data e after_data. id e
--   occurred_at vêm sempre do default do banco: o "quando" e a
--   identidade do registro de auditoria não dependem do backend, que
--   não precisa desses valores (não tem SELECT na tabela).
-- - ARQ-F002-03 e 04-USUARIOS-E-PERMISSOES / seguranca/AUTORIZACAO:
--   o RLS faz só isolamento de tenant; papel + escopo (OWNER, ADMIN,
--   LEADER, MEMBER) ficam no backend. Nenhuma policy usa cargo,
--   claim de token, app_metadata ou user_metadata.
-- - Nenhuma policy em users (nega tudo) e nenhuma policy para outro
--   papel além de mescala_app. Policies por usuário ("minhas
--   igrejas", os próprios vínculos, o próprio users) ficam para
--   AUTH-002/003 e CHURCH-002.
-- - Otimização permitida pelo D8: a função de contexto é avaliada
--   uma vez por comando, como subconsulta escalar (select ...).
--
-- MATRIZ D7 (mescala_app):
--   tabela                      SELECT INSERT UPDATE (colunas)
--   users                       não    não    não
--   churches                    sim    sim    name, status, ended_at
--   church_memberships          sim    sim    role, status, ended_at
--   ministries                  sim    sim    name, status, ended_at
--   ministry_memberships        sim    sim    role, status, ended_at
--   ministry_functions          sim    sim    name, status, ended_at
--   ministry_member_functions   sim    sim    não
--   audit_log                   não    sim*   não
--   DELETE, TRUNCATE, REFERENCES e TRIGGER: não, em todas.
--   * INSERT por coluna (ARQ-F002-15): church_id, actor_user_id,
--     action, entity_type, entity_id, before_data e after_data; sem
--     id e occurred_at, que vêm sempre do default do banco.
--
-- MATRIZ D8 → POLICY → ITEM DO FEATURE CONTRACT:
--   (todas AS PERMISSIVE, TO mescala_app, uma por comando)
--   D8.1 churches SELECT
--        → churches_select_tenant          (seção 9 (a); seção 10 (2))
--   D8.2 churches INSERT
--        → churches_insert_tenant          (seção 9 (a); seção 10 (2))
--   D8.3 churches UPDATE
--        → churches_update_tenant          (seção 9 (a); seção 10 (2))
--   D8.4 SELECT em church_memberships, ministries,
--        ministry_memberships, ministry_functions
--        → <tabela>_select_tenant          (seção 9 (a); seção 10 (2))
--   D8.5 INSERT nas mesmas 4
--        → <tabela>_insert_tenant          (seção 9 (a); seção 10 (2))
--   D8.6 UPDATE nas mesmas 4
--        → <tabela>_update_tenant          (seção 9 (a); seção 10 (2))
--   D8.7 ministry_member_functions SELECT; INSERT
--        → ministry_member_functions_select_tenant,
--          ministry_member_functions_insert_tenant
--                                          (seção 9 (a); seção 10 (2))
--   D8.8 audit_log INSERT (igreja E ator do contexto)
--        → audit_log_insert_tenant_actor   (seção 9 (a) e (b);
--                                           seção 10 (2))
--   D8.9 users: nenhuma policy             (seção 9, "Operações sem
--                                           permissão": qualquer acesso
--                                           a users)
--   Predicado de tenant: church_id = contexto de igreja (em churches,
--   id = contexto de igreja). Sem contexto, a função devolve NULL e
--   nada passa (falha fechada): SELECT e UPDATE veem 0 linhas; INSERT
--   falha com 42501.
--
-- CONSEQUÊNCIAS PARA O BACKEND:
-- - CHURCH-001: gerar o id da igreja, definir o contexto com ele e só
--   então inserir a igreja, o OWNER e a auditoria, na mesma transação.
-- - audit_log: só INSERT, sem RETURNING (mescala_app não tem SELECT),
--   e sem informar id nem occurred_at: informar qualquer um dos dois
--   dá 42501 (ARQ-F002-15).
-- - O RLS não valida se o usuário tem vínculo com a igreja do contexto
--   (R-01): a CHURCH-002 valida o vínculo ATIVO antes de definir o
--   contexto.
--
-- DEPENDÊNCIAS:
-- - 20261022150000_create_official_schema: papel mescala_app; funções
--   mescala.context_church_id() e mescala.context_user_id().
-- - 20261022150100 a 20261022150700: as 8 tabelas do schema.
-- - Nenhuma policy anterior existe em nenhuma dessas tabelas.
--
-- COMO DESFAZER (só com orientação do Arquiteto):
--   drop policy <nome> on mescala.<tabela>;   -- para cada policy abaixo
--   revoke all on all tables in schema mescala from mescala_app;
-- As tabelas voltam ao estado "RLS sem policy", que nega tudo. A
-- retirada de privilégios de PUBLIC e dos papéis da Data API não deve
-- ser desfeita.
-- ============================================================


-- 1. Higiene: nenhum privilégio para PUBLIC e papéis da Data API --

revoke all on all tables in schema mescala
  from public, anon, authenticated, service_role, authenticator;

revoke all on all functions in schema mescala
  from public, anon, authenticated, service_role, authenticator;


-- 2. Matriz D7 ----------------------------------------------------

-- Ponto de partida exato: mescala_app sem nenhum privilégio de tabela
-- (inclusive de coluna) antes das concessões abaixo.
revoke all on all tables in schema mescala from mescala_app;

-- users: nenhum privilégio (D7).

grant select, insert on table mescala.churches to mescala_app;
grant update (name, status, ended_at) on table mescala.churches to mescala_app;

grant select, insert on table mescala.church_memberships to mescala_app;
grant update (role, status, ended_at) on table mescala.church_memberships to mescala_app;

grant select, insert on table mescala.ministries to mescala_app;
grant update (name, status, ended_at) on table mescala.ministries to mescala_app;

grant select, insert on table mescala.ministry_memberships to mescala_app;
grant update (role, status, ended_at) on table mescala.ministry_memberships to mescala_app;

grant select, insert on table mescala.ministry_functions to mescala_app;
grant update (name, status, ended_at) on table mescala.ministry_functions to mescala_app;

grant select, insert on table mescala.ministry_member_functions to mescala_app;

grant insert (church_id, actor_user_id, action, entity_type, entity_id, before_data, after_data)
  on table mescala.audit_log to mescala_app;


-- 3. Matriz D8 ----------------------------------------------------

-- D8.1 a D8.3 — churches (o tenant é o próprio id)

create policy churches_select_tenant
  on mescala.churches
  as permissive
  for select
  to mescala_app
  using (id = (select mescala.context_church_id()));

create policy churches_insert_tenant
  on mescala.churches
  as permissive
  for insert
  to mescala_app
  with check (id = (select mescala.context_church_id()));

create policy churches_update_tenant
  on mescala.churches
  as permissive
  for update
  to mescala_app
  using (id = (select mescala.context_church_id()))
  with check (id = (select mescala.context_church_id()));

-- D8.4 a D8.6 — church_memberships

create policy church_memberships_select_tenant
  on mescala.church_memberships
  as permissive
  for select
  to mescala_app
  using (church_id = (select mescala.context_church_id()));

create policy church_memberships_insert_tenant
  on mescala.church_memberships
  as permissive
  for insert
  to mescala_app
  with check (church_id = (select mescala.context_church_id()));

create policy church_memberships_update_tenant
  on mescala.church_memberships
  as permissive
  for update
  to mescala_app
  using (church_id = (select mescala.context_church_id()))
  with check (church_id = (select mescala.context_church_id()));

-- D8.4 a D8.6 — ministries

create policy ministries_select_tenant
  on mescala.ministries
  as permissive
  for select
  to mescala_app
  using (church_id = (select mescala.context_church_id()));

create policy ministries_insert_tenant
  on mescala.ministries
  as permissive
  for insert
  to mescala_app
  with check (church_id = (select mescala.context_church_id()));

create policy ministries_update_tenant
  on mescala.ministries
  as permissive
  for update
  to mescala_app
  using (church_id = (select mescala.context_church_id()))
  with check (church_id = (select mescala.context_church_id()));

-- D8.4 a D8.6 — ministry_memberships

create policy ministry_memberships_select_tenant
  on mescala.ministry_memberships
  as permissive
  for select
  to mescala_app
  using (church_id = (select mescala.context_church_id()));

create policy ministry_memberships_insert_tenant
  on mescala.ministry_memberships
  as permissive
  for insert
  to mescala_app
  with check (church_id = (select mescala.context_church_id()));

create policy ministry_memberships_update_tenant
  on mescala.ministry_memberships
  as permissive
  for update
  to mescala_app
  using (church_id = (select mescala.context_church_id()))
  with check (church_id = (select mescala.context_church_id()));

-- D8.4 a D8.6 — ministry_functions

create policy ministry_functions_select_tenant
  on mescala.ministry_functions
  as permissive
  for select
  to mescala_app
  using (church_id = (select mescala.context_church_id()));

create policy ministry_functions_insert_tenant
  on mescala.ministry_functions
  as permissive
  for insert
  to mescala_app
  with check (church_id = (select mescala.context_church_id()));

create policy ministry_functions_update_tenant
  on mescala.ministry_functions
  as permissive
  for update
  to mescala_app
  using (church_id = (select mescala.context_church_id()))
  with check (church_id = (select mescala.context_church_id()));

-- D8.7 — ministry_member_functions (sem UPDATE)

create policy ministry_member_functions_select_tenant
  on mescala.ministry_member_functions
  as permissive
  for select
  to mescala_app
  using (church_id = (select mescala.context_church_id()));

create policy ministry_member_functions_insert_tenant
  on mescala.ministry_member_functions
  as permissive
  for insert
  to mescala_app
  with check (church_id = (select mescala.context_church_id()));

-- D8.8 — audit_log (só INSERT; igreja e ator do contexto)

create policy audit_log_insert_tenant_actor
  on mescala.audit_log
  as permissive
  for insert
  to mescala_app
  with check (
    church_id = (select mescala.context_church_id())
    and actor_user_id = (select mescala.context_user_id())
  );

-- D8.9 — users: nenhuma policy (RLS habilitado sem policy nega tudo).

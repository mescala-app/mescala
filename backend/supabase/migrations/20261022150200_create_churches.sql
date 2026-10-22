-- ============================================================
-- MIGRATION: create_churches
-- DOMÍNIO:   church
-- FEATURE:   FOUNDATION-002 — Fundação de Persistência
--            (Data Task D5 "churches", D4 trigger)
--
-- OBJETIVO:
-- Criar mescala.churches, a raiz do tenant: churches.id é o
-- church_id de todas as tabelas de tenant.
--
-- REGRAS:
-- - 05-REGRAS-DE-NEGOCIO#SEC-001: isolamento por igreja.
-- - 05-REGRAS-DE-NEGOCIO#HIS-001 e
--   decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-012: a igreja não é
--   apagada; ganha status e data de término (ended_at).
-- - Status da Igreja: ATIVO, INATIVO (resposta do PO a B-02 em
--   2026-10-22; docs/features/FOUNDATION-002.md, VERSÃO 2, Data
--   Task D5 "churches").
-- - dados/STATUS#Representação e validação e DATA-DEC-016 (A):
--   text + CHECK em MAIÚSCULAS; as transições ficam no backend.
--   Sem DEFAULT no status e nenhum CHECK que acople status e
--   ended_at (ARQ-F002-09).
-- - DATA-DEC-013: nome da igreja. "Nome válido": NOT NULL, não
--   vazio e sem espaço em branco nas pontas (o CHECK usa a classe
--   [[:space:]], que cobre espaço, tabulação e quebra de linha).
-- - churches.address fica para a CHURCH-001 (ARQ-F002-02).
-- - O id tem default, mas o backend pode informá-lo: a CHURCH-001
--   gera o id, define o contexto de igreja com ele e só então
--   insere a igreja, o OWNER e a auditoria (D8).
-- - RLS habilitado, não forçado (ARQ-F002-13). Policies na
--   migration grant_app_role_and_rls_policies.
--
-- DEPENDÊNCIAS:
-- - 20261022150000_create_official_schema: schema mescala e função
--   mescala.set_updated_at().
--
-- COMO DESFAZER (só com orientação do Arquiteto, depois de desfazer
-- as migrations seguintes que referenciam churches):
--   drop table mescala.churches;   -- remove também o trigger
-- ============================================================

create table mescala.churches (
  id          uuid        not null default pg_catalog.gen_random_uuid(),
  name        text        not null,
  status      text        not null,
  ended_at    timestamptz,
  created_at  timestamptz not null default pg_catalog.now(),
  updated_at  timestamptz not null default pg_catalog.now(),

  constraint churches_pkey
    primary key (id),
  constraint churches_name_check
    check (name <> '' and name !~ '^[[:space:]]|[[:space:]]$'),
  constraint churches_status_check
    check (status in ('ATIVO', 'INATIVO'))
);

alter table mescala.churches enable row level security;

create trigger churches_set_updated_at
  before update on mescala.churches
  for each row
  execute function mescala.set_updated_at();

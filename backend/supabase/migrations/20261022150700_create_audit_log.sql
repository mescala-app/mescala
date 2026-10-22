-- ============================================================
-- MIGRATION: create_audit_log
-- DOMÍNIO:   audit
-- FEATURE:   FOUNDATION-002 — Fundação de Persistência
--            (Data Task D5 "audit_log" e D6)
--
-- OBJETIVO:
-- Criar mescala.audit_log, a tabela de auditoria só de inserção,
-- gravada pelo backend na mesma transação da operação auditada, e
-- torná-la imutável para qualquer papel (D6; ARQ-F002-08).
--
-- REGRAS:
-- - decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 e
--   seguranca/AUDITORIA: igreja, ator, ação, entidade, id, antes,
--   depois e quando; só inserção; índice (church_id, occurred_at).
-- - 05-REGRAS-DE-NEGOCIO#HIS-001: FKs com RESTRICT.
-- - church_id NOT NULL: toda mudança auditada prevista na Brain é de
--   igreja (contrato, 5.5).
-- - action e entity_type: texto livre (sem lista de valores), não
--   vazio — o CHECK recusa texto vazio ou só com espaço em branco.
-- - Ao menos um entre before_data e after_data preenchido
--   (audit_log_data_present_check; "preenchido" = não NULL em SQL).
-- - Sem created_at nem updated_at: occurred_at é o "quando".
-- - Imutabilidade (D6): a função mescala.prevent_audit_log_change()
--   lança exceção (SQLSTATE P0001) citando a DATA-DEC-021, em
--   trigger BEFORE UPDATE OR DELETE por linha e em trigger BEFORE
--   TRUNCATE por comando. Vale para qualquer papel, inclusive
--   postgres e service_role, porque não depende de grant.
--   Consequência registrada (R-08): correção ou anonimização de
--   registros exigirá migration própria (feature de anonimização).
-- - Função: SECURITY INVOKER, search_path fixo e vazio, EXECUTE
--   retirado de PUBLIC (trigger não exige EXECUTE de quem dispara o
--   comando).
-- - RLS habilitado, não forçado. Policy de INSERT (igreja e ator do
--   contexto) na migration grant_app_role_and_rls_policies.
--   mescala_app não terá SELECT: o backend não deve usar
--   INSERT ... RETURNING nesta tabela.
--
-- ÍNDICES:
-- - audit_log_church_id_occurred_at_idx: consulta por igreja e
--   período; começa por church_id e serve à FK para churches.
--
-- DEPENDÊNCIAS:
-- - 20261022150000_create_official_schema: schema mescala.
-- - 20261022150100_create_users: mescala.users(id).
-- - 20261022150200_create_churches: mescala.churches(id).
--
-- COMO DESFAZER (só com orientação do Arquiteto; destrói a
-- auditoria, então só em banco sem dados reais):
--   drop table mescala.audit_log;   -- DROP não dispara os triggers;
--                                   -- remove índice e triggers
--   drop function mescala.prevent_audit_log_change();
-- ============================================================


-- 1. Tabela ------------------------------------------------------

create table mescala.audit_log (
  id             uuid        not null default pg_catalog.gen_random_uuid(),
  church_id      uuid        not null,
  actor_user_id  uuid        not null,
  action         text        not null,
  entity_type    text        not null,
  entity_id      uuid        not null,
  before_data    jsonb,
  after_data     jsonb,
  occurred_at    timestamptz not null default pg_catalog.now(),

  constraint audit_log_pkey
    primary key (id),
  constraint audit_log_church_id_fkey
    foreign key (church_id)
    references mescala.churches (id)
    on delete restrict
    on update no action,
  constraint audit_log_actor_user_id_fkey
    foreign key (actor_user_id)
    references mescala.users (id)
    on delete restrict
    on update no action,
  constraint audit_log_action_check
    check (action !~ '^[[:space:]]*$'),
  constraint audit_log_entity_type_check
    check (entity_type !~ '^[[:space:]]*$'),
  constraint audit_log_data_present_check
    check (before_data is not null or after_data is not null)
);

create index audit_log_church_id_occurred_at_idx
  on mescala.audit_log (church_id, occurred_at);

alter table mescala.audit_log enable row level security;


-- 2. Imutabilidade (D6) -------------------------------------------

create function mescala.prevent_audit_log_change()
  returns trigger
  language plpgsql
  security invoker
  set search_path = ''
as $$
begin
  raise exception
    'mescala.audit_log aceita somente inserção (DATA-DEC-021): % não é permitido', tg_op
    using errcode = 'raise_exception';
end;
$$;

revoke all on function mescala.prevent_audit_log_change() from public;

create trigger audit_log_prevent_update_delete
  before update or delete on mescala.audit_log
  for each row
  execute function mescala.prevent_audit_log_change();

create trigger audit_log_prevent_truncate
  before truncate on mescala.audit_log
  for each statement
  execute function mescala.prevent_audit_log_change();

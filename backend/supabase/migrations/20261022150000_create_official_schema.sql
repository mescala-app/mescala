-- ============================================================
-- MIGRATION: create_official_schema
-- DOMÍNIO:   foundation
-- FEATURE:   FOUNDATION-002 — Fundação de Persistência
--            (Data Task D1, D2, D3 e D4 — só a função)
--
-- OBJETIVO:
-- Criar a base técnica do schema oficial do Mescala no projeto
-- Supabase vitqnyzuvrvkmnvshcpb:
--   1. o papel de grupo mescala_app (D2; ARQ-F002-05);
--   2. o schema dedicado mescala, fora da Data API, com higiene
--      de privilégios (D1; resposta do PO a B-01: "mescala");
--   3. o mecanismo de contexto por transação (D3; ARQ-F002-04):
--      mescala.context_user_id() e mescala.context_church_id();
--   4. a função de trigger mescala.set_updated_at() (D4). Os
--      triggers são criados na migration de cada tabela.
--
-- REGRAS:
-- - decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-020: schema dedicado
--   fora da Data API; backend com papel sem BYPASSRLS; contexto
--   (usuário, igreja) definido em cada transação; as policies
--   usam esse contexto.
-- - decisoes/ADR-003-AUTENTICACAO (itens 7 e 9): autorização nunca
--   vem do token; nenhum segredo no repositório.
-- - decisoes/ADR-002-BACKEND-OFICIAL#Persistência: schema oficial
--   reproduzível pelas migrations.
-- - 05-REGRAS-DE-NEGOCIO#SEC-001 e seguranca/ISOLAMENTO-DE-DADOS:
--   isolamento por igreja.
-- - mescala_app (D2): NOLOGIN, NOSUPERUSER, NOCREATEDB,
--   NOCREATEROLE, NOREPLICATION, NOBYPASSRLS; membro de nenhum
--   papel; dono de nenhum objeto; só USAGE no schema (sem CREATE).
--   Nenhuma credencial é criada aqui: o papel de login (que será
--   membro de mescala_app) é criado pelo PO fora do repositório,
--   na FOUNDATION-003.
-- - Se mescala_app já existir no cluster (por exemplo, banco local
--   resetado), os atributos são reafirmados, nunca afrouxados.
--   O ALTER ROLE só é emitido para o atributo que estiver fora do
--   esperado, porque no Supabase o postgres não é superusuário e o
--   PostgreSQL recusa ALTER ROLE ... NOSUPERUSER vindo de quem não
--   é superusuário (mesmo sem mudar nada). Papel existente com
--   SUPERUSER ou membro de algum papel: a migration falha (falha
--   fechada) e a correção é feita fora dela.
-- - Contexto (D3): parâmetros customizados
--     mescala.current_user_id   = users.id do Mescala (nunca o sub
--                                 do provedor de autenticação);
--     mescala.current_church_id = churches.id da igreja atual.
--   O backend os define só com set_config(..., true), dentro de
--   transação explícita (FOUNDATION-003). As funções devolvem NULL
--   quando o parâmetro não existe ou está vazio (depois de uma
--   transação ele volta como texto vazio): falha fechada. Valor que
--   não é UUID gera erro 22P02.
-- - Funções: SECURITY INVOKER; search_path fixo e vazio; chamadas
--   qualificadas (pg_catalog.*). Tipos nativos (uuid, trigger) são
--   resolvidos em pg_catalog, que o PostgreSQL sempre consulta
--   primeiro; com search_path vazio, nenhum outro schema entra.
-- - EXECUTE: context_user_id() e context_church_id() só para
--   mescala_app; set_updated_at() para nenhum papel além do dono
--   (trigger não exige EXECUTE de quem dispara o comando).
--
-- PRIVILÉGIOS PADRÃO DO SCHEMA (D1) — LIMITE DO POSTGRESQL:
-- ALTER DEFAULT PRIVILEGES ... IN SCHEMA só ACRESCENTA privilégios
-- aos padrões globais; não retira o que vem do padrão global. O
-- padrão global embutido do PostgreSQL dá EXECUTE a PUBLIC em toda
-- função nova (e USAGE a PUBLIC em todo tipo novo). Por isso, os
-- REVOKE de privilégios padrão abaixo garantem que o schema não
-- acrescenta nada a ninguém (nenhuma entrada em pg_default_acl para
-- o schema), mas, sozinhos, não impedem o EXECUTE de PUBLIC em
-- funções futuras. Compensação adotada:
--   (a) PUBLIC, anon, authenticated, service_role e authenticator
--       não têm USAGE no schema, então não alcançam função dele;
--   (b) toda migration que cria função retira EXECUTE de PUBLIC
--       explicitamente (aqui, na create_audit_log e, para todas as
--       funções do schema, na grant_app_role_and_rls_policies).
-- Retirar o padrão global exigiria ALTER DEFAULT PRIVILEGES FOR
-- ROLE postgres sem IN SCHEMA, que vale para o banco inteiro (fora
-- do schema e do escopo). Decisão da DIV-01 (Arquiteto, revisão
-- pré-aplicação de 2026-10-22): opção A, ARQ-F002-16. O padrão
-- global não é alterado e ALTER DEFAULT PRIVILEGES sem IN SCHEMA é
-- proibido; a compensação (b) é convenção obrigatória de toda
-- migration que cria função em mescala.
--
-- DEPENDÊNCIAS:
-- - Nenhuma migration anterior (primeira migration oficial).
-- - Papéis da plataforma Supabase: postgres (dono do schema e de
--   todos os objetos), anon, authenticated, service_role e
--   authenticator (só aparecem em retirada de privilégio).
-- - Projeto vazio: não existe o schema mescala (pré-condição
--   confirmada pelo PO antes de aplicar).
--
-- COMO DESFAZER (a CLI não executa "down"; só com orientação do
-- Arquiteto e depois de desfazer as migrations seguintes, na ordem
-- inversa):
--   drop function mescala.set_updated_at();
--   drop function mescala.context_church_id();
--   drop function mescala.context_user_id();
--   drop schema mescala;          -- sem CASCADE: só se estiver vazio
--   drop role mescala_app;        -- falha se algum papel de login
--                                 -- ainda for membro dele; nesse
--                                 -- caso, remover a participação antes
-- Os REVOKE de privilégios padrão não criam entrada em
-- pg_default_acl e não precisam ser desfeitos. Se a migration foi
-- aplicada pela CLI, ajustar o histórico supabase_migrations só com
-- orientação do Arquiteto.
-- ============================================================


-- 1. Papel de grupo mescala_app (D2) ---------------------------

do $$
declare
  v_role record;
begin
  select r.rolsuper,
         r.rolcanlogin,
         r.rolcreatedb,
         r.rolcreaterole,
         r.rolreplication,
         r.rolbypassrls
    into v_role
    from pg_catalog.pg_roles as r
   where r.rolname = 'mescala_app';

  if not found then
    create role mescala_app
      nologin
      nosuperuser
      nocreatedb
      nocreaterole
      noreplication
      nobypassrls;
  else
    if v_role.rolsuper then
      raise exception
        'mescala_app já existe com SUPERUSER; corrija fora da migration (FOUNDATION-002, D2)';
    end if;
    if v_role.rolcanlogin then
      alter role mescala_app nologin;
    end if;
    if v_role.rolcreatedb then
      alter role mescala_app nocreatedb;
    end if;
    if v_role.rolcreaterole then
      alter role mescala_app nocreaterole;
    end if;
    if v_role.rolreplication then
      alter role mescala_app noreplication;
    end if;
    if v_role.rolbypassrls then
      alter role mescala_app nobypassrls;
    end if;
  end if;

  if exists (
    select 1
      from pg_catalog.pg_auth_members as m
     where m.member = 'mescala_app'::pg_catalog.regrole
  ) then
    raise exception
      'mescala_app não pode ser membro de nenhum papel (FOUNDATION-002, D2)';
  end if;
end
$$;


-- 2. Schema dedicado e higiene de privilégios (D1) -------------

create schema mescala authorization postgres;

revoke all on schema mescala
  from public, anon, authenticated, service_role, authenticator;

grant usage on schema mescala to mescala_app;

alter default privileges for role postgres in schema mescala
  revoke all on tables
  from public, anon, authenticated, service_role, authenticator;

alter default privileges for role postgres in schema mescala
  revoke all on sequences
  from public, anon, authenticated, service_role, authenticator;

alter default privileges for role postgres in schema mescala
  revoke all on functions
  from public, anon, authenticated, service_role, authenticator;

alter default privileges for role postgres in schema mescala
  revoke all on types
  from public, anon, authenticated, service_role, authenticator;


-- 3. Mecanismo de contexto por transação (D3) ------------------

create function mescala.context_user_id()
  returns uuid
  language sql
  stable
  security invoker
  set search_path = ''
as $$
  select nullif(pg_catalog.current_setting('mescala.current_user_id', true), '')::uuid;
$$;

create function mescala.context_church_id()
  returns uuid
  language sql
  stable
  security invoker
  set search_path = ''
as $$
  select nullif(pg_catalog.current_setting('mescala.current_church_id', true), '')::uuid;
$$;

revoke all on function mescala.context_user_id() from public;
revoke all on function mescala.context_church_id() from public;

grant execute on function mescala.context_user_id() to mescala_app;
grant execute on function mescala.context_church_id() to mescala_app;


-- 4. Função de trigger de updated_at (D4) ----------------------

create function mescala.set_updated_at()
  returns trigger
  language plpgsql
  security invoker
  set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

revoke all on function mescala.set_updated_at() from public;

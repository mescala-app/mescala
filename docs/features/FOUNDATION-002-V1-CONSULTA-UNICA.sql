-- ============================================================
-- FOUNDATION-002 — V1 em consulta única (somente leitura)
--
-- O QUE É
-- As consultas do V1 (docs/features/FOUNDATION-002-DATA-TASK-RESULT.md)
-- juntas numa consulta só. Ela apenas lê o catálogo do banco. Não cria,
-- não altera e não apaga nada.
-- O resultado é uma tabela com uma linha por consulta do V1:
--   item       qual consulta do V1 (V1.1, V1.2, ...)
--   esperado   o que deveria aparecer (resumo)
--   linhas     quantas linhas a consulta devolveu (vazio = não se aplica)
--   resultado  o que a consulta devolveu
--
-- ESTE ARQUIVO TEM DUAS CONSULTAS. Rode cada uma sozinha, na hora certa:
--   CONSULTA 1 (V1 completo): agora, depois de aplicar as migrations
--              e ANTES do V2. Mostra 36 linhas.
--   CONSULTA 2 (depois do V2): só no fim do A7, depois do V2 e do
--              bloco B. Mostra 4 linhas.
--
-- COMO RODAR
--   1. No SQL Editor do projeto vitqnyzuvrvkmnvshcpb, abra uma aba
--      nova e vazia.
--   2. Copie só a consulta da vez, do marcador "INÍCIO DA CONSULTA"
--      até o marcador "FIM DA CONSULTA", e cole na aba.
--   3. Clique em Run uma vez.
--
-- COMO DEVOLVER O RESULTADO
--   - No painel de resultados, use o botão de exportar ou copiar e
--     escolha, nesta ordem de preferência:
--       "Download CSV" (e informe onde o arquivo foi salvo), ou
--       "Copy as JSON" ou "Copy as markdown" (e cole o texto copiado).
--     Se não achar esse botão, selecione a tabela inteira e copie.
--   - Se aparecer uma mensagem de erro em vez da tabela, copie a
--     mensagem inteira e envie.
--   - A consulta 1 tem de mostrar 36 linhas. Se mostrar só 4, a
--     consulta 2 foi junto na cópia: rode de novo só a consulta 1.
-- ============================================================


-- ===================== INÍCIO DA CONSULTA 1 =====================
-- V1 completo: depois de aplicar as migrations e antes do V2.
select v.item, v.esperado, v.linhas, v.resultado
  from (
-- V1.1
select 1 as ordem, 'V1.1'::text as item,
       'Registrar a saída (versão do servidor, current_user e session_user).'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select pg_catalog.version(), pg_catalog.current_setting('server_version_num') as versao_num, current_user, session_user
       ) q
union all
-- V1.2
select 2 as ordem, 'V1.2'::text as item,
       'Só se aplicou pela CLI: 9 linhas, de 20261022150000 a 20261022150800. Aplicação pelo SQL Editor: tabela inexistente (linhas vazio) ou 0 linhas.'::text as esperado,
       case when pg_catalog.to_regclass('supabase_migrations.schema_migrations') is null then null::bigint
            when not pg_catalog.has_table_privilege(pg_catalog.to_regclass('supabase_migrations.schema_migrations'), 'SELECT') then null::bigint
            else pg_catalog.count(*) end as linhas,
       case when pg_catalog.to_regclass('supabase_migrations.schema_migrations') is null
            then pg_catalog.to_jsonb('tabela inexistente: aplicação pelo SQL Editor'::text)
            when not pg_catalog.has_table_privilege(pg_catalog.to_regclass('supabase_migrations.schema_migrations'), 'SELECT')
            then pg_catalog.to_jsonb('tabela existe, mas sem permissão de leitura: registrar'::text)
            else coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) end as resultado
  from (
select x."version", x."name"
  from xmltable('/*/row'
         passing pg_catalog.query_to_xml(
           case when pg_catalog.to_regclass('supabase_migrations.schema_migrations') is not null
                 and pg_catalog.has_table_privilege(pg_catalog.to_regclass('supabase_migrations.schema_migrations'), 'SELECT')
                then $q$select version, name from supabase_migrations.schema_migrations order by version$q$
                else $q$select null::text as version, null::text as name where false$q$ end,
           false, false, '')
         columns "version" text path 'version', "name" text path 'name') x
       ) q
union all
-- V1.3
select 3 as ordem, 'V1.3'::text as item,
       '1 linha, dono postgres, nspacl = {postgres=UC/postgres,mescala_app=U/postgres}, sem entrada de PUBLIC.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select n.nspname, pg_catalog.pg_get_userbyid(n.nspowner) as dono, n.nspacl
  from pg_catalog.pg_namespace n where n.nspname = 'mescala'
       ) q
union all
-- V1.4
select 4 as ordem, 'V1.4'::text as item,
       '8 linhas, relkind r, dono postgres: audit_log, church_memberships, churches, ministries, ministry_functions, ministry_member_functions, ministry_memberships, users.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select c.relname, c.relkind, pg_catalog.pg_get_userbyid(c.relowner) as dono
  from pg_catalog.pg_class c
 where c.relnamespace = 'mescala'::regnamespace and c.relkind not in ('i', 'I')
 order by 1
       ) q
union all
-- V1.4b
select 5 as ordem, 'V1.4b'::text as item,
       '0 linhas.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select t.typname, t.typtype
  from pg_catalog.pg_type t
 where t.typnamespace = 'mescala'::regnamespace
   and not exists (select 1 from pg_catalog.pg_class c where c.oid = t.typrelid)
   and not exists (select 1 from pg_catalog.pg_type e join pg_catalog.pg_class c on c.oid = e.typrelid where e.oid = t.typelem)
       ) q
union all
-- V1.5
select 6 as ordem, 'V1.5'::text as item,
       '56 linhas. Tipos uuid, text, jsonb e timestamp with time zone. NOT NULL e defaults conforme o V1.5 original.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select c.relname as tabela, a.attnum, a.attname, pg_catalog.format_type(a.atttypid, a.atttypmod) as tipo,
       a.attnotnull, pg_catalog.pg_get_expr(d.adbin, d.adrelid) as default_
  from pg_catalog.pg_attribute a
  join pg_catalog.pg_class c on c.oid = a.attrelid
  left join pg_catalog.pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
 where c.relnamespace = 'mescala'::regnamespace and c.relkind = 'r' and a.attnum > 0 and not a.attisdropped
 order by 1, 2
       ) q
union all
-- V1.6
select 7 as ordem, 'V1.6'::text as item,
       '8 linhas, todas com relrowsecurity = t e relforcerowsecurity = f.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select relname, relrowsecurity, relforcerowsecurity
  from pg_catalog.pg_class where relnamespace = 'mescala'::regnamespace and relkind = 'r' order by 1
       ) q
union all
-- V1.7
select 8 as ordem, 'V1.7'::text as item,
       '39 linhas: 8 p, 6 u, 13 c, 12 f.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select c.conrelid::regclass as tabela, c.conname, c.contype, pg_catalog.pg_get_constraintdef(c.oid) as definicao
  from pg_catalog.pg_constraint c
 where c.connamespace = 'mescala'::regnamespace and c.contype <> 'n'
 order by 1, 2
       ) q
union all
-- V1.7b
select 9 as ordem, 'V1.7b'::text as item,
       '0 linhas.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select conname, confdeltype, confupdtype from pg_catalog.pg_constraint
 where connamespace = 'mescala'::regnamespace and contype = 'f' and (confdeltype <> 'r' or confupdtype <> 'a')
       ) q
union all
-- V1.8
select 10 as ordem, 'V1.8'::text as item,
       '21 linhas. Nomes e definições conforme o V1.8 original (ARQ-F002-14).'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select tablename, indexname, indexdef from pg_catalog.pg_indexes where schemaname = 'mescala' order by 1, 2
       ) q
union all
-- V1.9
select 11 as ordem, 'V1.9'::text as item,
       '1 linha: users_auth_user_id_fkey, mescala.users, auth.users, r, a, mescala.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select c.conname, c.conrelid::regclass as tabela, c.confrelid::regclass as referencia,
       c.confdeltype, c.confupdtype, c.connamespace::regnamespace as schema
  from pg_catalog.pg_constraint c
 where c.contype = 'f' and c.confrelid = 'auth.users'::regclass and c.connamespace <> 'auth'::regnamespace
       ) q
union all
-- V1.10
select 12 as ordem, 'V1.10'::text as item,
       '98 linhas (39 constraint, 21 index, 8 trigger, 18 policy, 4 function, 8 table). Maior tamanho 63.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select tipo, nome, pg_catalog.length(nome) as tamanho from (
  select 'constraint' as tipo, conname::text as nome from pg_catalog.pg_constraint
   where connamespace = 'mescala'::regnamespace and contype <> 'n'
  union all select 'index', indexname::text from pg_catalog.pg_indexes where schemaname = 'mescala'
  union all select 'trigger', t.tgname::text from pg_catalog.pg_trigger t join pg_catalog.pg_class c on c.oid = t.tgrelid
   where c.relnamespace = 'mescala'::regnamespace and not t.tgisinternal
  union all select 'policy', policyname::text from pg_catalog.pg_policies where schemaname = 'mescala'
  union all select 'function', proname::text from pg_catalog.pg_proc where pronamespace = 'mescala'::regnamespace
  union all select 'table', relname::text from pg_catalog.pg_class where relnamespace = 'mescala'::regnamespace and relkind = 'r'
) x order by 3 desc, 1, 2
       ) q
union all
-- V1.11
select 13 as ordem, 'V1.11'::text as item,
       '8 linhas, todas com tgenabled = O: 6 <tabela>_set_updated_at, audit_log_prevent_update_delete e audit_log_prevent_truncate. Nenhum em ministry_member_functions.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select c.relname as tabela, t.tgname, t.tgenabled, pg_catalog.pg_get_triggerdef(t.oid) as definicao
  from pg_catalog.pg_trigger t join pg_catalog.pg_class c on c.oid = t.tgrelid
 where c.relnamespace = 'mescala'::regnamespace and not t.tgisinternal
 order by 1, 2
       ) q
union all
-- V1.12
select 14 as ordem, 'V1.12'::text as item,
       '4 linhas, prosecdef = f, proconfig = {"search_path=\"\""}, dono postgres. context_church_id e context_user_id: uuid, s, EXECUTE de mescala_app. prevent_audit_log_change e set_updated_at: trigger, v, só postgres.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select p.proname, pg_catalog.pg_get_function_result(p.oid) as retorno, p.prosecdef, p.provolatile, p.proconfig,
       pg_catalog.pg_get_userbyid(p.proowner) as dono, p.proacl
  from pg_catalog.pg_proc p where p.pronamespace = 'mescala'::regnamespace order by 1
       ) q
union all
-- V1.12b
select 15 as ordem, 'V1.12b'::text as item,
       '20 linhas. execute = t só em (context_church_id, mescala_app) e (context_user_id, mescala_app).'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select p.proname, r.rolname, pg_catalog.has_function_privilege(r.oid, p.oid, 'EXECUTE') as execute
  from pg_catalog.pg_proc p cross join pg_catalog.pg_roles r
 where p.pronamespace = 'mescala'::regnamespace
   and r.rolname in ('mescala_app', 'anon', 'authenticated', 'service_role', 'authenticator')
 order by 1, 2
       ) q
union all
-- V1.13
select 16 as ordem, 'V1.13'::text as item,
       '1 linha. rolsuper, rolcreaterole, rolcreatedb, rolcanlogin, rolreplication e rolbypassrls todos f.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, rolcanlogin, rolreplication, rolbypassrls, rolconfig
  from pg_catalog.pg_roles where rolname = 'mescala_app'
       ) q
union all
-- V1.13b
select 17 as ordem, 'V1.13b'::text as item,
       '0 linhas.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select m.roleid::regrole as papel from pg_catalog.pg_auth_members m where m.member = 'mescala_app'::regrole
       ) q
union all
-- V1.13c
select 18 as ordem, 'V1.13c'::text as item,
       '1 linha: membro postgres, concedente supabase_admin, admin_option t, inherit_option f, set_option f. Segunda linha com concedente postgres: registrar.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select m.member::regrole as membro, m.grantor::regrole as concedente, m.admin_option, m.inherit_option, m.set_option
  from pg_catalog.pg_auth_members m where m.roleid = 'mescala_app'::regrole
       ) q
union all
-- V1.13d
select 19 as ordem, 'V1.13d'::text as item,
       '1 linha com objetos = 0.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select (select count(*) from pg_catalog.pg_class where relowner = 'mescala_app'::regrole)
     + (select count(*) from pg_catalog.pg_proc where proowner = 'mescala_app'::regrole)
     + (select count(*) from pg_catalog.pg_namespace where nspowner = 'mescala_app'::regrole) as objetos
       ) q
union all
-- V1.14a
select 20 as ordem, 'V1.14a'::text as item,
       '5 linhas. usage = t só em mescala_app. create_ = f nos 5.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select r.rolname, pg_catalog.has_schema_privilege(r.oid, 'mescala', 'USAGE') as usage,
       pg_catalog.has_schema_privilege(r.oid, 'mescala', 'CREATE') as create_
  from pg_catalog.pg_roles r
 where r.rolname in ('mescala_app', 'anon', 'authenticated', 'service_role', 'authenticator') order by 1
       ) q
union all
-- V1.14b
select 21 as ordem, 'V1.14b'::text as item,
       '12 linhas, todas de mescala_app: SELECT e INSERT em churches, church_memberships, ministries, ministry_memberships, ministry_functions e ministry_member_functions. Nada em audit_log e users. Nenhum PUBLIC.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select c.relname as tabela, case when a.grantee = 0 then 'PUBLIC' else a.grantee::regrole::text end as grantee, a.privilege_type
  from pg_catalog.pg_class c cross join lateral pg_catalog.aclexplode(c.relacl) a
 where c.relnamespace = 'mescala'::regnamespace and c.relkind = 'r' and a.grantee <> c.relowner
 order by 1, 2, 3
       ) q
union all
-- V1.14c
select 22 as ordem, 'V1.14c'::text as item,
       '22 linhas, todas de mescala_app: 15 de UPDATE (ended_at, name ou role, status nas 5 tabelas) e 7 de INSERT em audit_log. Nada em audit_log.id e audit_log.occurred_at.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select c.relname as tabela, att.attname as coluna,
       case when a.grantee = 0 then 'PUBLIC' else a.grantee::regrole::text end as grantee, a.privilege_type
  from pg_catalog.pg_attribute att
  join pg_catalog.pg_class c on c.oid = att.attrelid
 cross join lateral pg_catalog.aclexplode(att.attacl) a
 where c.relnamespace = 'mescala'::regnamespace and att.attacl is not null
 order by 1, 2, 3, 4
       ) q
union all
-- V1.14d
select 23 as ordem, 'V1.14d'::text as item,
       '0 linhas.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select r.rolname, c.relname, p.priv
  from pg_catalog.pg_roles r
 cross join pg_catalog.pg_class c
 cross join (values ('SELECT'), ('INSERT'), ('UPDATE'), ('DELETE'), ('TRUNCATE'), ('REFERENCES'), ('TRIGGER')) p(priv)
 where r.rolname in ('anon', 'authenticated', 'service_role', 'authenticator')
   and c.relnamespace = 'mescala'::regnamespace and c.relkind = 'r'
   and pg_catalog.has_table_privilege(r.oid, c.oid, p.priv)
       ) q
union all
-- V1.15
select 24 as ordem, 'V1.15'::text as item,
       '18 linhas, PERMISSIVE, roles = {mescala_app}. Policies por tabela conforme o V1.15 original. Nenhuma em users.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select tablename, policyname, permissive, roles, cmd, qual, with_check
  from pg_catalog.pg_policies where schemaname = 'mescala' order by 1, 2
       ) q
union all
-- V1.16a
select 25 as ordem, 'V1.16a'::text as item,
       '0 linhas.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select pg_catalog.pg_get_userbyid(d.defaclrole) as papel, d.defaclobjtype, d.defaclacl
  from pg_catalog.pg_default_acl d where d.defaclnamespace = 'mescala'::regnamespace
       ) q
union all
-- V1.16b
select 26 as ordem, 'V1.16b'::text as item,
       'Informativo (DIV-01): registrar a saída.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select pg_catalog.pg_get_userbyid(d.defaclrole) as papel, d.defaclobjtype, d.defaclacl
  from pg_catalog.pg_default_acl d where d.defaclnamespace = 0
       ) q
union all
-- V1.17 (1/3)
select 27 as ordem, 'V1.17 (1/3)'::text as item,
       '0 linhas (V0.3 deu 0 linhas).'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select c.relname, c.relkind from pg_catalog.pg_class c where c.relnamespace = 'public'::regnamespace
       ) q
union all
-- V1.17 (2/3)
select 28 as ordem, 'V1.17 (2/3)'::text as item,
       '0 linhas ou idêntico ao V0.3b (1 linha: rls_auto_enable).'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select p.proname from pg_catalog.pg_proc p where p.pronamespace = 'public'::regnamespace
       ) q
union all
-- V1.17 (3/3)
select 29 as ordem, 'V1.17 (3/3)'::text as item,
       '0 linhas (V0.3c deu 0 linhas).'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select t.typname from pg_catalog.pg_type t where t.typnamespace = 'public'::regnamespace
       ) q
union all
-- V1.18
select 30 as ordem, 'V1.18'::text as item,
       'Manual (A6): o PO confirma no painel, em Data API, Exposed schemas, que mescala não aparece.'::text as esperado,
       null::bigint as linhas,
       pg_catalog.to_jsonb('manual: sem consulta (o PO confirma no painel)'::text) as resultado
union all
-- V1.20
select 31 as ordem, 'V1.20'::text as item,
       '9 linhas, todas com count = 0.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select 'users' as tabela, count(*) from mescala.users
union all select 'churches', count(*) from mescala.churches
union all select 'church_memberships', count(*) from mescala.church_memberships
union all select 'ministries', count(*) from mescala.ministries
union all select 'ministry_memberships', count(*) from mescala.ministry_memberships
union all select 'ministry_functions', count(*) from mescala.ministry_functions
union all select 'ministry_member_functions', count(*) from mescala.ministry_member_functions
union all select 'audit_log', count(*) from mescala.audit_log
union all select 'auth.users sinteticos do V2', count(*) from auth.users
 where id::text like '00000000-0000-4000-8000-0000000000%'
       ) q
union all
-- V1.21
select 32 as ordem, 'V1.21'::text as item,
       '0 linhas.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select pt.pubname, pt.schemaname, pt.tablename
  from pg_catalog.pg_publication_tables pt where pt.schemaname = 'mescala'
       ) q
union all
-- V1.21b
select 33 as ordem, 'V1.21b'::text as item,
       '0 linhas (registrar se houver).'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select p.pubname from pg_catalog.pg_publication p where p.puballtables
       ) q
union all
-- V1.22
select 34 as ordem, 'V1.22'::text as item,
       '1 linha igual ao V0.4a: 170011, UTF8, i, en_US.UTF-8, en_US.UTF-8, en-US.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select pg_catalog.current_setting('server_version_num')::int as versao_num,
       pg_catalog.pg_encoding_to_char(d.encoding) as codificacao,
       pg_catalog.to_jsonb(d) ->> 'datlocprovider' as provedor,
       d.datcollate, d.datctype,
       coalesce(pg_catalog.to_jsonb(d) ->> 'datlocale', pg_catalog.to_jsonb(d) ->> 'daticulocale') as locale_icu_ou_builtin
  from pg_catalog.pg_database d
 where d.datname = pg_catalog.current_database()
       ) q
union all
-- V1.23
select 35 as ordem, 'V1.23'::text as item,
       'Nenhuma entrada que dê session_replication_role ou row_security a PUBLIC (=s/), mescala_app, anon, authenticated, service_role ou authenticator. Entrada de postgres: registrar.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select a.parname, a.paracl from pg_catalog.pg_parameter_acl a order by 1
       ) q
union all
-- V1.24
select 36 as ordem, 'V1.24'::text as item,
       'Informativo: registrar e cruzar com o V1.14.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select e.evtname, e.evtevent, e.evtowner::regrole as dono, e.evtfoid::regproc as funcao, e.evtenabled
  from pg_catalog.pg_event_trigger e order by 1
       ) q
       ) v
 order by v.ordem;
-- ======================= FIM DA CONSULTA 1 =======================


-- ===================== INÍCIO DA CONSULTA 2 =====================
-- Depois do V2 e do bloco B (A7, último passo): V1.20, V1.13b, V1.13c
-- e V1.11 de novo.
select v.item, v.esperado, v.linhas, v.resultado
  from (
-- V1.20
select 1 as ordem, 'V1.20'::text as item,
       '9 linhas, todas com count = 0 (sem resíduo do V2 e do bloco B).'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select 'users' as tabela, count(*) from mescala.users
union all select 'churches', count(*) from mescala.churches
union all select 'church_memberships', count(*) from mescala.church_memberships
union all select 'ministries', count(*) from mescala.ministries
union all select 'ministry_memberships', count(*) from mescala.ministry_memberships
union all select 'ministry_functions', count(*) from mescala.ministry_functions
union all select 'ministry_member_functions', count(*) from mescala.ministry_member_functions
union all select 'audit_log', count(*) from mescala.audit_log
union all select 'auth.users sinteticos do V2', count(*) from auth.users
 where id::text like '00000000-0000-4000-8000-0000000000%'
       ) q
union all
-- V1.13b
select 2 as ordem, 'V1.13b'::text as item,
       '0 linhas, idêntico ao de antes do V2.'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select m.roleid::regrole as papel from pg_catalog.pg_auth_members m where m.member = 'mescala_app'::regrole
       ) q
union all
-- V1.13c
select 3 as ordem, 'V1.13c'::text as item,
       'Idêntico ao de antes do V2 (1 linha: postgres, supabase_admin, t, f, f).'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select m.member::regrole as membro, m.grantor::regrole as concedente, m.admin_option, m.inherit_option, m.set_option
  from pg_catalog.pg_auth_members m where m.roleid = 'mescala_app'::regrole
       ) q
union all
-- V1.11
select 4 as ordem, 'V1.11'::text as item,
       '8 linhas, todas com tgenabled = O (o I2 do bloco B foi desfeito).'::text as esperado,
       pg_catalog.count(*) as linhas, coalesce(pg_catalog.jsonb_agg(q), '[]'::jsonb) as resultado
  from (
select c.relname as tabela, t.tgname, t.tgenabled, pg_catalog.pg_get_triggerdef(t.oid) as definicao
  from pg_catalog.pg_trigger t join pg_catalog.pg_class c on c.oid = t.tgrelid
 where c.relnamespace = 'mescala'::regnamespace and not t.tgisinternal
 order by 1, 2
       ) q
       ) v
 order by v.ordem;
-- ======================= FIM DA CONSULTA 2 =======================


-- ============================================================
-- NOTA TÉCNICA (para o QA. Não é preciso ler para rodar.)
-- - Cada ramo do union all traz, como subconsulta, o texto literal
--   da instrução do V1 (sem o ponto e vírgula final) e devolve
--   count(*) e jsonb_agg dessa subconsulta. Os itens e os critérios
--   de avaliação são os do V1 original.
-- - resultado é jsonb (sem quebras de linha, para copiar sem quebrar
--   a tabela): as chaves de cada linha saem ordenadas pelo tamanho
--   do nome, não na ordem das colunas. Booleanos saem true/false.
-- - Ajustes em relação ao V1 original:
--   1. V1.2: avaliada por texto dinâmico (query_to_xml + xmltable),
--      só quando supabase_migrations.schema_migrations existe e pode
--      ser lida. Senão, linhas fica vazio e resultado traz o motivo.
--   2. V1.17: as 3 instruções viram 3 linhas: V1.17 (1/3), (2/3), (3/3).
--   3. V1.18: sem consulta (confirmação manual do PO no painel).
-- - Arrays (aclitem[], text[], name[]) aparecem como listas JSON.
-- - Requer PG16+ (colunas do V1.13c), PG15+ (V1.23) e suporte a XML
--   no servidor (query_to_xml e xmltable do V1.2). O V0.4a deu 170011.
-- - Se qualquer item der erro, a consulta inteira para e o editor mostra
--   só a mensagem de erro. Nesse caso, devolver a mensagem inteira.
-- ============================================================

---
tipo: tecnico
camada: dados
status: ativo
atualizado: 2026-10-24
relacionado:
  - "[[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]]"
  - "[[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]"
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
  - "[[features/FOUNDATION-002]]"
  - "[[seguranca/ISOLAMENTO-DE-DADOS]]"
  - "[[seguranca/AUDITORIA]]"
---
# Banco de Dados
O modelo físico deve derivar do domínio, não o contrário.

Banco oficial: PostgreSQL, podendo usar o Supabase como infraestrutura gerenciada. O schema oficial deve ser reproduzível pelas migrations versionadas ([[decisoes/ADR-002-BACKEND-OFICIAL]]).

Referências obrigatórias:
- [[dados/ENTIDADES]]
- [[dados/RELACIONAMENTOS]]
- [[04-USUARIOS-E-PERMISSOES]]
- [[seguranca/ISOLAMENTO-DE-DADOS]]

Evitar colunas fixas como `vocalista_id` ou `baterista_id`; posições pertencem à entidade [[dados/ENTIDADES#Alocação|Alocação]].

## Decisões
- **Projeto:** o banco oficial fica no projeto Supabase novo `vitqnyzuvrvkmnvshcpb` e **começa vazio** ([[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]; app legado sem uso real, sem migração de dados: [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-022 — Convivência com o legado e migração de dados|DATA-DEC-022]], 2026-10-22).
- **Migrations:** em `backend/supabase/migrations/`, na estrutura da Supabase CLI, com `backend/supabase/config.toml` ligado ao projeto oficial. As 9 migrations legadas da `supabase/` da raiz nunca são aplicadas no banco novo. Aplicação manual pelo PO; **no projeto oficial, só pelo SQL Editor** (ARQ-F002-17, desde 2026-10-23; [[#Aplicação no projeto oficial (ARQ-F002-17)|abaixo]]). Integração GitHub ↔ Supabase não conectada por enquanto ([[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04, parte 1]]).
- **Nomes:** identificadores em inglês, tabelas no plural em snake_case, status e papéis em `text` + CHECK com os valores da Brain em MAIÚSCULAS, migrations `<YYYYMMDDHHMMSS>_<objetivo>.sql`, uma por objetivo ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-018 — Nomenclatura e idioma|DATA-DEC-018]]).
- **Schema e RLS:** schema dedicado, fora da Data API; o backend conecta direto ao Postgres com um papel sem BYPASSRLS e define o contexto (usuário, igreja) em cada transação; as policies usam esse contexto. Toda tabela nasce com RLS habilitado ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]]). **Nome do schema: `mescala`** (resposta do PO ao B-01 da FOUNDATION-002, 2026-10-22). Mecanismo: [[#Mecanismo do schema oficial (FOUNDATION-002)|abaixo]].
- **Usuários:** tabela própria `users`, com uma coluna de ligação ao `auth.users` do projeto oficial ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-019 — Identidade × provedor de autenticação|DATA-DEC-019]]).
- **Histórico:** nada com histórico é apagado; status e data de término em vez de exclusão ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]]).
- **Auditoria:** tabela só de inserção, gravada pelo backend na mesma transação ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 — Auditoria|DATA-DEC-021]]).
- **Status e transições:** o banco guarda os valores; o backend valida as transições ([[dados/STATUS]]).

## Estado atual
- **Oficial** (2026-10-23): [[features/FOUNDATION-002]] — Fundação de Persistência **aplicada em 2026-10-23 e encerrada** (ARCHITECT REVIEW final APPROVED_WITH_NOTES).
  - `backend/supabase/` tem `config.toml` (configuração própria da CLI; único conteúdo funcional: `project_id = "vitqnyzuvrvkmnvshcpb"`) e `migrations/`, com as 9 migrations, commitadas em `028f9ff` e **aplicadas pelo PO pelo SQL Editor em 2026-10-23** ([[#Registro de migrations aplicadas|registro]]). O delta da VERSÃO 2 (ARQ-F002-14 e 15) foi feito antes do commit.
  - `backend/.gitignore` cobre `supabase/.temp/` e `supabase/.branches/`. `backend/supabase/.temp` não existe: a CLI não foi vinculada ao projeto.
  - Estado do banco depois da aplicação: [[#Estado do banco oficial em 2026-10-23|abaixo]]. Situação da feature: [[features/FOUNDATION-002#Situação em 2026-10-24|situação]].
  - Até 2026-10-21, nenhuma migration oficial existia e `backend/supabase/` não existia. Em 2026-10-22, as 9 migrations estavam escritas e não aplicadas.
- **Legado:** 11 tabelas em `public` e 9 migrations em `supabase/migrations/`, nos projetos antigos ([[tecnico/LEGADO-ATUAL]]). O app legado não tem uso real; a consulta de inventário foi dispensada (2026-10-22).
- Divergências com a Brain: [[tecnico/DIVERGENCIAS-LEGADO]]. Riscos de RLS do legado: [[seguranca/RISCOS-DO-LEGADO]].

## Mecanismo do schema oficial (FOUNDATION-002)
Decidido no contrato [[features/FOUNDATION-002]] (VERSÃO 2, READY em 2026-10-22; Data Task D1 a D8). **Escrito nas migrations e aplicado no projeto oficial em 2026-10-23** (conferido pelo V1 e pelo V2 da feature).
- **Schema `mescala`**, fora da Data API, com dono `postgres` (o papel que aplica as migrations). `PUBLIC`, `anon`, `authenticated`, `service_role` e `authenticator` não têm USAGE no schema nem privilégio em tabelas e funções. Nenhum objeto oficial em `public` ou `auth`; a única exceção é a FK `users.auth_user_id` → `auth.users`.
- **Papel `mescala_app`:** papel de grupo NOLOGIN, NOBYPASSRLS, NOSUPERUSER, NOCREATEDB, NOCREATEROLE e NOREPLICATION; não é membro de nenhum papel, não é dono de nenhum objeto e não tem CREATE no schema. É o único papel com USAGE em `mescala`. **O papel de login** (com senha, membro de `mescala_app`) **vem na FOUNDATION-003**, criado pelo PO **fora do repositório** (ARQ-F002-05): nenhuma senha nem papel de login em migration.
- **Contexto por transação** (ARQ-F002-04): o backend define `mescala.current_user_id` (= `users.id` do Mescala, nunca o `sub` do provedor) e `mescala.current_church_id` **só com `set_config(..., true)`**, dentro de uma transação explícita, nunca na sessão. As funções `mescala.context_user_id()` e `mescala.context_church_id()` devolvem `uuid`, devolvem NULL quando o parâmetro falta (falha fechada) e dão erro quando o valor não é UUID. São STABLE, SECURITY INVOKER, com `search_path` fixo e vazio, executáveis só por `mescala_app`.
- **RLS faz só isolamento por igreja** (ARQ-F002-03): as policies de tenant usam `church_id` (ou `id`, em `churches`) = contexto de igreja; em `audit_log`, também `actor_user_id` = usuário do contexto. **Papel + escopo** (OWNER, ADMIN, LEADER, MEMBER) ficam **no backend**, em cada feature. Nenhuma policy usa cargo, claim de token ou metadata. `users` fica sem policy (nega tudo) até a AUTH-002. RLS habilitado e não forçado (ARQ-F002-13).
- **R-01:** o RLS não pega contexto de igreja errado. A **CHURCH-002 valida o vínculo ATIVO antes de definir o contexto**; um endurecimento (policy que também exige vínculo) será avaliado nela.
- **Privilégios de `mescala_app`** (matriz D7): SELECT e INSERT nas tabelas de tenant; UPDATE só nas colunas de atributo e estado (`name`, `role`, `status`, `ended_at`; ARQ-F002-07); nenhum DELETE nem TRUNCATE (ARQ-F002-06, HIS-001); nenhum acesso a `users`; em `audit_log`, só INSERT por coluna, sem `id` nem `occurred_at` (ARQ-F002-15) ([[seguranca/AUDITORIA]]).
- **Integridade multi-tenant:** `church_id NOT NULL` em toda tabela de tenant; FKs compostas que levam `church_id` até a raiz; toda FK ON DELETE RESTRICT; unicidades com `church_id` (ARQ-F002-14). Detalhes: [[seguranca/ISOLAMENTO-DE-DADOS]].
- **Status:** `text` + CHECK, sem DEFAULT; nenhum CHECK acopla `status` e `ended_at` (ARQ-F002-09). As transições ficam com o backend.

## Ordem vinculante das migrations (FOUNDATION-002, D9)
Ordem obrigatória do contrato da [[features/FOUNDATION-002]] (ARQ-F002-01 decompôs o modelo em quatro entregas). **As 9 estão em `backend/supabase/migrations/` e foram aplicadas em 2026-10-23, nesta ordem** ([[#Registro de migrations aplicadas|registro]]).

| # | Arquivo | Conteúdo |
|---|---|---|
| 1 | `20261022150000_create_official_schema.sql` | Schema `mescala`, higiene de privilégios, papel `mescala_app`, funções de contexto e a função de `updated_at` |
| 2 | `20261022150100_create_users.sql` | `users` (só `id`, `auth_user_id` e timestamps), trigger, RLS |
| 3 | `20261022150200_create_churches.sql` | `churches` (status ATIVO, INATIVO), trigger, RLS |
| 4 | `20261022150300_create_church_memberships.sql` | Vínculo com a igreja, índices (um OWNER por igreja), trigger, RLS |
| 5 | `20261022150400_create_ministries.sql` | Ministérios, índices, trigger, RLS |
| 6 | `20261022150500_create_ministry_memberships.sql` | Vínculo com o ministério, índices, trigger, RLS |
| 7 | `20261022150600_create_ministry_functions.sql` | Funções e habilitações (`ministry_member_functions`), índices, trigger, RLS |
| 8 | `20261022150700_create_audit_log.sql` | `audit_log`, índice, imutabilidade, RLS |
| 9 | `20261022150800_grant_app_role_and_rls_policies.sql` | Privilégios de `mescala_app` (D7), policies (D8) e retirada de privilégios das tabelas e funções |

Cada arquivo tem cabeçalho com MIGRATION, DOMÍNIO, FEATURE, OBJETIVO, REGRAS, DEPENDÊNCIAS e **COMO DESFAZER** (a CLI não executa "down").

**Fora da FOUNDATION-002:** programação, participação, escala, alocação e impedimentos vão para a **FOUNDATION-004** (proposta; ID a confirmar); `invitations` vai para a **feature de convites** (B-04); o cliente de banco do backend, para a **FOUNDATION-003** (proposta; ID a confirmar).

## Aplicação no projeto oficial (ARQ-F002-17)
Decisão técnica do [[agents/arquiteto|Arquiteto]] na ARCHITECT REVIEW final da [[features/FOUNDATION-002]] (2026-10-23), **aceita pelo PO sem veto em 2026-10-24**. Fica dentro da [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04]], parte 1, item 3 (aplicação manual pelo PO), que não muda: o PO escolheu o SQL Editor, e a ARQ-F002-17 fixa as consequências técnicas.

**Método único: SQL Editor.** O PO aplica, como `postgres`:
- só arquivos já commitados (o SHA do commit é o único vínculo entre o banco e o repositório);
- um por vez, inteiro, sem texto selecionado, em aba nova, na ordem dos timestamps.

Se um arquivo falhar:
1. parar e devolver a mensagem literal;
2. rodar o V1 da feature para confirmar que nada do arquivo persistiu (sem BEGIN/COMMIT, o arquivo roda como uma transação implícita);
3. o arquivo não foi aplicado e pode ser corrigido, com nova revisão do QA e do Arquiteto.

**Proibido no projeto oficial:**
- `supabase db push`, inclusive `--dry-run`;
- `supabase migration up`;
- `supabase migration repair`, exceto dentro de um plano escrito do Arquiteto para adotar a CLI.

O `supabase link` não faz mais parte do procedimento, e as demais proibições do Anexo A do contrato (A9) continuam: entre elas, `supabase db reset --linked`, `supabase config push`, qualquer comando da CLI na raiz do repositório e conectar a integração GitHub ↔ Supabase. Motivo: o projeto não tem `supabase_migrations`, e a CLI veria as 9 migrations como pendentes e pararia com 42P06 em `create schema mescala`. Adotar a CLI depois exige `supabase migration repair` das versões já aplicadas, por plano escrito do Arquiteto (R-05).

**Registro:** substitui o histórico `supabase_migrations`, que não existe. É a tabela [[#Registro de migrations aplicadas|abaixo]], mantida pelo [[agents/vault-brain]] depois de cada ARCHITECT REVIEW final.

**Evidência mínima de cada aplicação**, versionada em `docs/features/`:
- **E1 — V0 da feature em consulta única, com saída literal** (nada só declarado): mostra que os objetos novos não existem e que a [[#Linha de base da plataforma|linha de base da plataforma]] continua igual à registrada (funções e tipos em `public`, event triggers).
- **E2 — declaração da aplicação:** data, commit, arquivos na ordem e o resultado de cada um.
- **E3 — V1 em consulta única:** uma linha por checagem, com as colunas `item`, `esperado`, `linhas` e `resultado`.
  - Arquivos: `<ID>-V1-CONSULTA-UNICA.sql` e o resultado exportado por "Download CSV", versionado sem alteração como `<ID>-V1-RESULTADO.csv`, com SHA-256.
  - Cobre os objetos da feature e a regressão fixa do schema inteiro: V1.6, V1.12b, V1.14a a V1.14d, V1.15 a V1.17 e V1.24.
- **E4 — quando o contrato pedir:** o V2 num só bloco, com a mensagem literal, mais a consulta de resíduo em consulta única.
- **E5 — `<ID>-SAIDAS-PO.md`:** junta E1, E2 e E4 literais, referencia o CSV e marca como "declarado" o que não tiver saída.
- **Quem escreve:** o [[agents/analista-de-dados|Analista de Dados]] entrega o V0 e o V1 já em consulta única (`<ID>-V0-CONSULTA-UNICA.sql` e `<ID>-V1-CONSULTA-UNICA.sql`), e o [[agents/qa|QA]] os revisa na fase 1. A consulta única existe porque o SQL Editor mostra só o resultado da última instrução.

Na FOUNDATION-002, o V0.1 a V0.3 ficaram só declarados (nota N-2 da revisão final, aceita). Daqui em diante, o V0 exige saída literal.

## Registro de migrations aplicadas
Substitui o histórico `supabase_migrations`, que não existe no projeto oficial `vitqnyzuvrvkmnvshcpb` (V1.2; ARQ-F002-17). Uma linha por migration aplicada, mantida pelo [[agents/vault-brain]] depois de cada ARCHITECT REVIEW final. Toda migration nova tem versão maior que a última desta tabela e da pasta (R-19).

| Versão | Arquivo | Feature | Data | Método | Commit | Evidência |
|---|---|---|---|---|---|---|
| 20261022150000 | `20261022150000_create_official_schema.sql` | [[features/FOUNDATION-002\|FOUNDATION-002]] | 2026-10-23 | SQL Editor | `028f9ff` | `docs/features/FOUNDATION-002-SAIDAS-PO.md` |
| 20261022150100 | `20261022150100_create_users.sql` | [[features/FOUNDATION-002\|FOUNDATION-002]] | 2026-10-23 | SQL Editor | `028f9ff` | `docs/features/FOUNDATION-002-SAIDAS-PO.md` |
| 20261022150200 | `20261022150200_create_churches.sql` | [[features/FOUNDATION-002\|FOUNDATION-002]] | 2026-10-23 | SQL Editor | `028f9ff` | `docs/features/FOUNDATION-002-SAIDAS-PO.md` |
| 20261022150300 | `20261022150300_create_church_memberships.sql` | [[features/FOUNDATION-002\|FOUNDATION-002]] | 2026-10-23 | SQL Editor | `028f9ff` | `docs/features/FOUNDATION-002-SAIDAS-PO.md` |
| 20261022150400 | `20261022150400_create_ministries.sql` | [[features/FOUNDATION-002\|FOUNDATION-002]] | 2026-10-23 | SQL Editor | `028f9ff` | `docs/features/FOUNDATION-002-SAIDAS-PO.md` |
| 20261022150500 | `20261022150500_create_ministry_memberships.sql` | [[features/FOUNDATION-002\|FOUNDATION-002]] | 2026-10-23 | SQL Editor | `028f9ff` | `docs/features/FOUNDATION-002-SAIDAS-PO.md` |
| 20261022150600 | `20261022150600_create_ministry_functions.sql` | [[features/FOUNDATION-002\|FOUNDATION-002]] | 2026-10-23 | SQL Editor | `028f9ff` | `docs/features/FOUNDATION-002-SAIDAS-PO.md` |
| 20261022150700 | `20261022150700_create_audit_log.sql` | [[features/FOUNDATION-002\|FOUNDATION-002]] | 2026-10-23 | SQL Editor | `028f9ff` | `docs/features/FOUNDATION-002-SAIDAS-PO.md` |
| 20261022150800 | `20261022150800_grant_app_role_and_rls_policies.sql` | [[features/FOUNDATION-002\|FOUNDATION-002]] | 2026-10-23 | SQL Editor | `028f9ff` | `docs/features/FOUNDATION-002-SAIDAS-PO.md` |

Aplicadas pelo PO, como `postgres`, arquivo por arquivo, na ordem; resultado declarado: "todas as migrations subiram limpas". A verificação está na mesma evidência e em `docs/features/FOUNDATION-002-V1-RESULTADO.csv` (V1), todas no commit de fechamento `8ee70a6`.

## Estado do banco oficial em 2026-10-23
Projeto `vitqnyzuvrvkmnvshcpb`, depois da aplicação da [[features/FOUNDATION-002]] e da verificação (V1, consulta de resíduo e A6):
- **Schema `mescala`** (dono `postgres`; USAGE só para `mescala_app`) com **8 tabelas, todas vazias**: `users`, `churches`, `church_memberships`, `ministries`, `ministry_memberships`, `ministry_functions`, `ministry_member_functions` e `audit_log` (V1.3, V1.4 e V1.20).
- **`mescala_app`** NOLOGIN, sem BYPASSRLS, dono de nada; **ainda não existe papel de login** (vem na FOUNDATION-003). O `postgres` é membro de `mescala_app` com ADMIN OPTION, concedida por `supabase_admin` (V1.13 a V1.13d).
- **4 funções, 39 constraints** (8 PK, 6 UNIQUE, 13 CHECK, 12 FK), **21 índices, 18 policies e 8 triggers** (V1.7 a V1.12 e V1.15). RLS habilitado e não forçado nas 8 tabelas (V1.6); `users` sem policy (nega tudo) até a AUTH-002.
- **Fora da Data API:** os schemas expostos são só `public` e `graphql_public`; `mescala` não está exposto, e nada foi alterado no painel (A6/V1.18, confirmado pelo PO).
- **Sem `supabase_migrations`** (V1.2): o histórico é o [[#Registro de migrations aplicadas|registro acima]].
- Os dados sintéticos da verificação não ficaram: o V2 e o bloco B terminam num erro proposital que desfaz tudo, e a consulta de resíduo deu contagem 0 em todas as tabelas.

## Linha de base da plataforma
Objetos e configuração do projeto oficial que não são do Mescala, registrados na aplicação da FOUNDATION-002 (V0 de 2026-10-22 e V1 de 2026-10-23). Toda feature que muda o banco oficial confere de novo (E1 e a regressão fixa V1.6, V1.17 e V1.24); uma mudança é registrada pelo QA na fase 2 e levada ao Arquiteto (R-20).
- **PostgreSQL 17.11** (170011).
- Banco em **UTF8**, com provedor **ICU** (`en-US`) e `datcollate`/`datctype` **`en_US.UTF-8`** (V0.4a, V1.22). Collations **`pg_c_utf8`** e **`und-x-icu`** disponíveis (V0.4c). O `lower()` com acentos funcionou (V0.4b): sem contingência de collation (R-17).
- Em `public`: uma única função, **`public.rls_auto_enable()`**, e nenhum tipo nem relação (V0.3b, V0.3c e V1.17).
- **Event triggers** (V1.24), todos habilitados: **`ensure_rls`** (dono `postgres`, evento `ddl_command_end`, função `public.rls_auto_enable()`) e **6 de `supabase_admin`** (`issue_graphql_placeholder`, `issue_pg_cron_access`, `issue_pg_graphql_access`, `issue_pg_net_access`, `pgrst_ddl_watch` e `pgrst_drop_watch`).
- **`pg_parameter_acl`:** só `log_min_messages` (V1.23). O SET de `session_replication_role` pelo `postgres` não vem dele: é um mecanismo da plataforma (R-16, [[seguranca/AUDITORIA]]).
- **R-20 (`ensure_rls`):** objeto da plataforma, fora do modelo (R-15). Já existia antes da aplicação (V0.3b) e roda em todo DDL, inclusive nas migrations do Mescala.
  - Nenhuma migration o altera, desabilita ou remove, nem depende dele. O RLS continua explícito em todo `create_*`, porque o [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] exige reprodução num banco sem esse trigger (por exemplo, o de teste da FOUNDATION-003) ([[#Convenções do schema oficial (FOUNDATION-002, 2026-10-22)|convenção 6]]).
  - Efeito observado em `mescala` em 2026-10-23: nenhum (RLS não forçado, V1.6; EXECUTE só pela matriz, V1.12b).
  - O corpo de `public.rls_auto_enable()` não foi lido, e o escopo dela não é conhecido. A primeira feature com V0 o registra, só por leitura.

## Ordem proposta das migrations
**Histórico.** Seção 15 do relatório `docs/data/DATA-ARCHITECTURE-REPORT.md`, proposta do Analista de Dados. A ordem vinculante é a do D9 da FOUNDATION-002 ([[#Ordem vinculante das migrations (FOUNDATION-002, D9)|acima]]); a coluna "Destino" mostra onde cada item ficou.

| Ordem | Migration | Observação | Destino (contrato FOUNDATION-002) |
|---|---|---|---|
| 0 | `security_hotfix_legacy_rls` | Trilha separada, sobre o legado | **Não se aplica**: app legado sem uso real (2026-10-22) |
| 1 | `create_official_schema` | Schema, papel de acesso e função de `updated_at` (DATA-DEC-020 A) | FOUNDATION-002, migration 1 |
| 2 | `create_users` | — | FOUNDATION-002, migration 2 |
| 3 | `create_churches` | — | FOUNDATION-002, migration 3 |
| 4 | `create_church_memberships` | — | FOUNDATION-002, migration 4 |
| 5 | `create_ministries` | — | FOUNDATION-002, migration 5 |
| 6 | `create_ministry_memberships` | — | FOUNDATION-002, migration 6 |
| 7 | `create_ministry_functions` | Funções + habilitações | FOUNDATION-002, migration 7 |
| 8 | `create_programs` | Programações + participação | FOUNDATION-004 |
| 9 | `create_schedules` | — | FOUNDATION-004 |
| 10 | `create_allocations` | — | FOUNDATION-004 |
| 11 | `create_availability` | — | FOUNDATION-004 |
| 12 | `create_invitations` | — | Feature de convites (B-04) |
| 13 | `create_audit_log` | — | FOUNDATION-002, migration 8 |
| 14 | `rls_policies_official_schema` | Conforme DATA-DEC-020 | Incorporada em `grant_app_role_and_rls_policies` (FOUNDATION-002, migration 9) |
| 15+ | `migrate_legacy_<entidade>` | — | **Sem objeto**: não há migração de dados do legado (2026-10-22) |
| Futuro | Depreciação do legado | Com autorização própria | — |

## Convenções do schema oficial (FOUNDATION-002, 2026-10-22)
Valem para toda migration em `backend/supabase/migrations/`. O QA confere em toda feature com migration.

Itens 1 a 4: texto da revisão pré-aplicação do Arquiteto (decisão da DIV-01). Itens 5 e 6: ARCHITECT REVIEW final da FOUNDATION-002 (2026-10-23). ARQ-F002-14 a 16 são decisões técnicas do Arquiteto, sem veto; em vigor desde a aplicação de 2026-10-23. A ARQ-F002-17 foi aceita pelo PO sem veto em 2026-10-24. São **convenções técnicas**, não regras de negócio `<ÁREA>-<NNN>`.

1. **Privilégios explícitos** (ARQ-F002-16; decisão da DIV-01). O PostgreSQL dá EXECUTE a PUBLIC em toda função nova, e um privilégio padrão por schema não retira isso. O Mescala não altera o padrão global do banco: ALTER DEFAULT PRIVILEGES sem IN SCHEMA é proibido. Por isso, toda migration que cria:
   - função em `mescala`: retira EXECUTE de PUBLIC na mesma migration e concede EXECUTE só aos papéis que o Data Task listar (função de trigger: a ninguém);
   - tabela em `mescala`: retira todo privilégio de PUBLIC, anon, authenticated, service_role e authenticator e concede a `mescala_app` só o que o Data Task listar, por coluna quando houver restrição.

   Função SECURITY DEFINER só com decisão explícita do Arquiteto no contrato da feature, sempre com search_path fixo e vazio.

   Regressão fixa no QA: EXECUTE por papel em todas as funções do schema (V1.12b) e privilégios de tabela, de coluna e dos papéis da Data API (V1.14b a V1.14d).
2. **Unicidade com church_id** (ARQ-F002-14). Em tabela de tenant, toda unicidade que um INSERT do backend pode atingir inclui church_id. Motivo: o RLS só fixa church_id, e o índice único é checado antes da FK composta; sem church_id na chave, um INSERT com ID de outra igreja responde 23505 em vez de 23503 e revela dados dela (SEC-001). Exceção: a PK id e os UNIQUE(x, id) alvo de FK, porque o backend nunca grava id vindo do cliente.
3. **Ordem.** Toda migration nova tem timestamp maior que o da última da pasta. As da FOUNDATION-002 vão até 20261022150800, que é também a última do [[#Registro de migrations aplicadas|registro de migrations aplicadas]].
4. **Migration aplicada não é editada;** correção vira migration nova. Antes da aplicação: revisão estática do QA e revisão pré-aplicação do Arquiteto.
5. **Método e evidência** (ARQ-F002-17). No projeto oficial, toda migration é aplicada pelo PO pelo SQL Editor, só a partir de arquivo já commitado, com a evidência mínima E1 a E5 versionada em `docs/features/` e uma linha por migration no [[#Registro de migrations aplicadas|registro de migrations aplicadas]]. `supabase db push` (inclusive `--dry-run`) e `supabase migration up` são proibidos lá; `supabase migration repair`, só por plano escrito do Arquiteto. Detalhe: [[#Aplicação no projeto oficial (ARQ-F002-17)|aplicação no projeto oficial]].
6. **RLS explícito** (R-20). Toda migration `create_*` habilita o RLS explicitamente e não depende do event trigger `ensure_rls` da plataforma, para o schema se reproduzir num banco sem ele. Regressão fixa no QA: V1.6 (RLS habilitado e não forçado), V1.17 (`public` igual à [[#Linha de base da plataforma|linha de base]]) e V1.24 (event triggers).

Riscos ligados: R-18 (função criada sem retirar EXECUTE de PUBLIC fica executável por `mescala_app`, porque o padrão global não é retirado por schema), R-19 (os timestamps das 9 migrations estão à frente do horário em que foram escritas; se a CLI gerar um timestamp menor, renomear antes da revisão) e R-20 (event trigger `ensure_rls` da plataforma, em todo DDL). Exemplo de aplicação da convenção 2 na FOUNDATION-004: o UNIQUE(programação, ministério) de `schedules` já nasce com `church_id`.

## Pendências
- Ferramenta de acesso do backend ao banco (driver, query builder ou ORM): [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]], na FOUNDATION-003 (proposta), com o papel de login, a conexão, a transação com contexto e o banco de teste.
- **Decididos em 2026-10-22** (respostas do PO aos bloqueios da FOUNDATION-002): nome do schema (`mescala`), status da Igreja (ATIVO, INATIVO), status "ativa" da alocação (AGUARDANDO_CONFIRMACAO e CONFIRMADA) e escopo do convite ([[decisoes/DEC-09-MODELO-DE-DADOS#Respostas do PO aos bloqueios da FOUNDATION-002|DEC-09]]).
- Continuam **A DEFINIR**: o fluxo, as transições e o papel pretendido do convite (feature de convites); o efeito de uma igreja INATIVO (feature que inativar a igreja) ([[decisoes/PENDENCIAS#Lacunas observadas no registro de 2026-10-21|PENDENCIAS]]).
- Corpo de `public.rls_auto_enable()`: registrar, só por leitura, no V0 da próxima feature que mudar o banco oficial (R-20; [[#Linha de base da plataforma|linha de base]]).
- Data para pausar ou excluir os projetos antigos (decisão operacional do PO): **A DEFINIR**.

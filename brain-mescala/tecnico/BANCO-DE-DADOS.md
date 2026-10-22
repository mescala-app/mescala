---
tipo: tecnico
camada: dados
status: ativo
atualizado: 2026-10-22
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
- **Migrations:** em `backend/supabase/migrations/`, pelo Supabase CLI, com `backend/supabase/config.toml` ligado ao projeto oficial. As 9 migrations legadas da `supabase/` da raiz nunca são aplicadas no banco novo. Aplicação manual pelo PO (SQL Editor ou CLI). Integração GitHub ↔ Supabase não conectada por enquanto ([[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04, parte 1]]).
- **Nomes:** identificadores em inglês, tabelas no plural em snake_case, status e papéis em `text` + CHECK com os valores da Brain em MAIÚSCULAS, migrations `<YYYYMMDDHHMMSS>_<objetivo>.sql`, uma por objetivo ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-018 — Nomenclatura e idioma|DATA-DEC-018]]).
- **Schema e RLS:** schema dedicado, fora da Data API; o backend conecta direto ao Postgres com um papel sem BYPASSRLS e define o contexto (usuário, igreja) em cada transação; as policies usam esse contexto. Toda tabela nasce com RLS habilitado ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]]). **Nome do schema: `mescala`** (resposta do PO ao B-01 da FOUNDATION-002, 2026-10-22). Mecanismo: [[#Mecanismo do schema oficial (FOUNDATION-002)|abaixo]].
- **Usuários:** tabela própria `users`, com uma coluna de ligação ao `auth.users` do projeto oficial ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-019 — Identidade × provedor de autenticação|DATA-DEC-019]]).
- **Histórico:** nada com histórico é apagado; status e data de término em vez de exclusão ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]]).
- **Auditoria:** tabela só de inserção, gravada pelo backend na mesma transação ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 — Auditoria|DATA-DEC-021]]).
- **Status e transições:** o banco guarda os valores; o backend valida as transições ([[dados/STATUS]]).

## Estado atual
- **Oficial** (2026-10-22): contrato [[features/FOUNDATION-002]] — Fundação de Persistência na **VERSÃO 2, READY**; **Fase 4 autorizada** pelo PO em 2026-10-22.
  - `backend/supabase/` existe, com `config.toml` (configuração própria da CLI; único conteúdo funcional: `project_id = "vitqnyzuvrvkmnvshcpb"`) e `migrations/`, com as **9 migrations escritas e não aplicadas**. O Analista está aplicando nelas o delta da VERSÃO 2 (ARQ-F002-14 e 15).
  - `backend/.gitignore` cobre `supabase/.temp/` e `supabase/.branches/`.
  - Nada foi commitado nem aplicado no projeto oficial. A aplicação pelo PO segue o Anexo A do contrato, depois das revisões pendentes ([[features/FOUNDATION-002#Situação em 2026-10-22|situação]]).
  - Até 2026-10-21, nenhuma migration oficial existia e `backend/supabase/` não existia.
- **Legado:** 11 tabelas em `public` e 9 migrations em `supabase/migrations/`, nos projetos antigos ([[tecnico/LEGADO-ATUAL]]). O app legado não tem uso real; a consulta de inventário foi dispensada (2026-10-22).
- Divergências com a Brain: [[tecnico/DIVERGENCIAS-LEGADO]]. Riscos de RLS do legado: [[seguranca/RISCOS-DO-LEGADO]].

## Mecanismo do schema oficial (FOUNDATION-002)
Decidido no contrato [[features/FOUNDATION-002]] (VERSÃO 2, READY em 2026-10-22; Data Task D1 a D8). **Escrito nas migrations e ainda não aplicado.**
- **Schema `mescala`**, fora da Data API, com dono `postgres` (o papel que aplica as migrations). `PUBLIC`, `anon`, `authenticated`, `service_role` e `authenticator` não têm USAGE no schema nem privilégio em tabelas e funções. Nenhum objeto oficial em `public` ou `auth`; a única exceção é a FK `users.auth_user_id` → `auth.users`.
- **Papel `mescala_app`:** papel de grupo NOLOGIN, NOBYPASSRLS, NOSUPERUSER, NOCREATEDB, NOCREATEROLE e NOREPLICATION; não é membro de nenhum papel, não é dono de nenhum objeto e não tem CREATE no schema. É o único papel com USAGE em `mescala`. **O papel de login** (com senha, membro de `mescala_app`) **vem na FOUNDATION-003**, criado pelo PO **fora do repositório** (ARQ-F002-05): nenhuma senha nem papel de login em migration.
- **Contexto por transação** (ARQ-F002-04): o backend define `mescala.current_user_id` (= `users.id` do Mescala, nunca o `sub` do provedor) e `mescala.current_church_id` **só com `set_config(..., true)`**, dentro de uma transação explícita, nunca na sessão. As funções `mescala.context_user_id()` e `mescala.context_church_id()` devolvem `uuid`, devolvem NULL quando o parâmetro falta (falha fechada) e dão erro quando o valor não é UUID. São STABLE, SECURITY INVOKER, com `search_path` fixo e vazio, executáveis só por `mescala_app`.
- **RLS faz só isolamento por igreja** (ARQ-F002-03): as policies de tenant usam `church_id` (ou `id`, em `churches`) = contexto de igreja; em `audit_log`, também `actor_user_id` = usuário do contexto. **Papel + escopo** (OWNER, ADMIN, LEADER, MEMBER) ficam **no backend**, em cada feature. Nenhuma policy usa cargo, claim de token ou metadata. `users` fica sem policy (nega tudo) até a AUTH-002. RLS habilitado e não forçado (ARQ-F002-13).
- **R-01:** o RLS não pega contexto de igreja errado. A **CHURCH-002 valida o vínculo ATIVO antes de definir o contexto**; um endurecimento (policy que também exige vínculo) será avaliado nela.
- **Privilégios de `mescala_app`** (matriz D7): SELECT e INSERT nas tabelas de tenant; UPDATE só nas colunas de atributo e estado (`name`, `role`, `status`, `ended_at`; ARQ-F002-07); nenhum DELETE nem TRUNCATE (ARQ-F002-06, HIS-001); nenhum acesso a `users`; em `audit_log`, só INSERT por coluna, sem `id` nem `occurred_at` (ARQ-F002-15) ([[seguranca/AUDITORIA]]).
- **Integridade multi-tenant:** `church_id NOT NULL` em toda tabela de tenant; FKs compostas que levam `church_id` até a raiz; toda FK ON DELETE RESTRICT; unicidades com `church_id` (ARQ-F002-14). Detalhes: [[seguranca/ISOLAMENTO-DE-DADOS]].
- **Status:** `text` + CHECK, sem DEFAULT; nenhum CHECK acopla `status` e `ended_at` (ARQ-F002-09). As transições ficam com o backend.

## Ordem vinculante das migrations (FOUNDATION-002, D9)
Ordem obrigatória do contrato da [[features/FOUNDATION-002]] (ARQ-F002-01 decompôs o modelo em quatro entregas). **As 9 estão escritas em `backend/supabase/migrations/` e não foram aplicadas.**

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

Texto da revisão pré-aplicação do Arquiteto (decisão da DIV-01). ARQ-F002-14 a 16 são decisões técnicas do Arquiteto, que o PO pode vetar até o A3 da FOUNDATION-002; são **convenções técnicas**, não regras de negócio `<ÁREA>-<NNN>`.

1. **Privilégios explícitos** (ARQ-F002-16; decisão da DIV-01). O PostgreSQL dá EXECUTE a PUBLIC em toda função nova, e um privilégio padrão por schema não retira isso. O Mescala não altera o padrão global do banco: ALTER DEFAULT PRIVILEGES sem IN SCHEMA é proibido. Por isso, toda migration que cria:
   - função em `mescala`: retira EXECUTE de PUBLIC na mesma migration e concede EXECUTE só aos papéis que o Data Task listar (função de trigger: a ninguém);
   - tabela em `mescala`: retira todo privilégio de PUBLIC, anon, authenticated, service_role e authenticator e concede a `mescala_app` só o que o Data Task listar, por coluna quando houver restrição.

   Função SECURITY DEFINER só com decisão explícita do Arquiteto no contrato da feature, sempre com search_path fixo e vazio.

   Regressão fixa no QA: EXECUTE por papel em todas as funções do schema (V1.12b) e privilégios de tabela, de coluna e dos papéis da Data API (V1.14b a V1.14d).
2. **Unicidade com church_id** (ARQ-F002-14). Em tabela de tenant, toda unicidade que um INSERT do backend pode atingir inclui church_id. Motivo: o RLS só fixa church_id, e o índice único é checado antes da FK composta; sem church_id na chave, um INSERT com ID de outra igreja responde 23505 em vez de 23503 e revela dados dela (SEC-001). Exceção: a PK id e os UNIQUE(x, id) alvo de FK, porque o backend nunca grava id vindo do cliente.
3. **Ordem.** Toda migration nova tem timestamp maior que o da última da pasta. As da FOUNDATION-002 vão até 20261022150800.
4. **Migration aplicada não é editada;** correção vira migration nova. Antes da aplicação: revisão estática do QA e revisão pré-aplicação do Arquiteto.

Riscos ligados: R-18 (função criada sem retirar EXECUTE de PUBLIC fica executável por `mescala_app`, porque o padrão global não é retirado por schema) e R-19 (os timestamps das 9 migrations estão à frente do horário em que foram escritas; se a CLI gerar um timestamp menor, renomear antes da revisão). Exemplo de aplicação da convenção 2 na FOUNDATION-004: o UNIQUE(programação, ministério) de `schedules` já nasce com `church_id`.

## Pendências
- Ferramenta de acesso do backend ao banco (driver, query builder ou ORM): [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]], na FOUNDATION-003 (proposta), com o papel de login, a conexão, a transação com contexto e o banco de teste.
- **Decididos em 2026-10-22** (respostas do PO aos bloqueios da FOUNDATION-002): nome do schema (`mescala`), status da Igreja (ATIVO, INATIVO), status "ativa" da alocação (AGUARDANDO_CONFIRMACAO e CONFIRMADA) e escopo do convite ([[decisoes/DEC-09-MODELO-DE-DADOS#Respostas do PO aos bloqueios da FOUNDATION-002|DEC-09]]).
- Continuam **A DEFINIR**: o fluxo, as transições e o papel pretendido do convite (feature de convites); o efeito de uma igreja INATIVO (feature que inativar a igreja) ([[decisoes/PENDENCIAS#Lacunas observadas no registro de 2026-10-21|PENDENCIAS]]).
- Aplicação da FOUNDATION-002 pelo PO (Anexo A do contrato): **pendente**. O registro da aplicação (data, método, commit) e do estado do banco oficial vem depois da ARCHITECT REVIEW final.
- Data para pausar ou excluir os projetos antigos (decisão operacional do PO): **A DEFINIR**.

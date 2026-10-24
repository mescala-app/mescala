# FOUNDATION-002, Fase 4: relatório do Analista de Dados

As 9 migrations estão escritas em `C:\projetos\mescala\backend\supabase\migrations\` e **nada foi aplicado**. Não rodei nenhum comando `supabase`, nenhum SQL contra banco e nenhuma ferramenta MCP de banco. Também não fiz commit. Nenhum arquivo fora dessa pasta foi criado ou alterado.

**Não houve DATA MODEL BLOCKED.** Há uma divergência técnica (DIV-01), que não bloqueia e precisa de decisão do Arquiteto, e quatro observações. *(Texto da primeira entrega, mantido como histórico. A DIV-01 foi decidida na Revisão 2, logo abaixo; a situação das OBS-01 e OBS-02 está nas Pendências do DATA TASK RESULT.)*

> **Revisão 2 (2026-10-22): delta da VERSÃO 2 do contrato, pedido na revisão pré-aplicação do Arquiteto (ARQ-F002-11, veredito RETURN_TO_DATA_ANALYST).** Nada foi aplicado: editei os próprios arquivos, que continuam não aplicados. Nenhum arquivo foi criado ou renomeado e nenhum timestamp mudou. 150100, 150300, 150400 e 150700 estão intactos.
> - **ARQ-F002-14 (F002-QA-01; SEC-001):** toda unicidade que um INSERT do backend alcança inclui `church_id`. Em `ministry_memberships`: UNIQUE(church_id, ministry_id, user_id), `ministry_memberships_church_id_ministry_id_user_id_key` (54 caracteres). Em `ministry_functions`: índice único (church_id, ministry_id, lower(name)), `ministry_functions_church_id_ministry_id_lower_name_key` (55). Em `ministry_member_functions`: PK (church_id, ministry_membership_id, ministry_function_id), com o mesmo nome `ministry_member_functions_pkey`. Um INSERT com ministério, vínculo ou função de outra igreja responde 23503, nunca 23505. Pelas FKs compostas, cada chave nova equivale à antiga.
> - **ARQ-F002-15:** `mescala_app` tem INSERT em `audit_log` só nas colunas `church_id`, `actor_user_id`, `action`, `entity_type`, `entity_id`, `before_data` e `after_data`. `id` e `occurred_at` vêm sempre do default do banco.
> - **DIV-01 decidida pelo Arquiteto: opção A (ARQ-F002-16).** O padrão global de privilégios não é alterado, e ALTER DEFAULT PRIVILEGES sem IN SCHEMA é proibido. Detalhes no bloco DIV-01.
> - Só comentário: `create_churches` cita a resposta do PO a B-02 e a VERSÃO 2; `create_official_schema` registra a decisão da DIV-01.
> - Contagens inalteradas: 39 constraints (8 PK, 6 UNIQUE, 13 CHECK, 12 FK), 21 índices (trocas 1:1), 18 policies, 4 funções e 8 triggers. O maior identificador continua com 63 caracteres.
> - O V2 e o total dele são atualizados pelo QA (complementos v2), não por mim.

---

# DATA ANALYSIS

## 1. Feature analisada
- **Feature:** FOUNDATION-002, Fundação de Persistência. O contrato está READY desde 2026-10-22 e a Fase 4 foi autorizada pelo PO.
- **O que segui:** o Data Task da seção 7 (D1 a D11), o Feature Contract (seção 6), o QA Contract (seção 10) e as decisões ARQ-F002-01 a 13.
- **Respostas do PO aplicadas:**
  - B-01: schema `mescala`;
  - B-02: status da Igreja ATIVO, INATIVO;
  - B-04, opção A: `invitations` fica fora;
  - B-03 é da FOUNDATION-004, não desta feature.

## 2. Requisitos de persistência
O que é criado:
- o schema `mescala`, fora da Data API;
- o papel de grupo `mescala_app`;
- o contexto por transação, com 2 funções;
- a função de `updated_at`;
- 8 tabelas com RLS;
- 12 FKs, todas RESTRICT, 3 delas compostas por tenant;
- 6 UNIQUE, 2 índices únicos de nome sem diferenciar maiúsculas e 1 índice único parcial de OWNER;
- 13 CHECKs;
- os grants por coluna da matriz D7;
- as 18 policies da matriz D8;
- a imutabilidade de `audit_log` (1 função e 2 triggers).

O que não é criado, conforme o D10 e o critério 25:
- atributos de `users`, `address` e status de usuário;
- policies de `users` ou policies por usuário;
- DELETE, SECURITY DEFINER, extensões e seeds;
- tabelas da FOUNDATION-004 e `invitations`;
- qualquer objeto em `public`.

## 3. Schema atual relevante
- `backend/supabase/` não existia e não havia nenhuma migration oficial anterior. Logo, não há histórico nem drift do lado do repositório.
- O banco oficial `vitqnyzuvrvkmnvshcpb` começa vazio (DEC-05; complemento da DATA-DEC-022). Não consultei o banco remoto: a consulta V0, mais abaixo, confirma a pré-condição.
- O legado (a `supabase/` da raiz e `src/integrations/supabase/types.ts`) não foi usado nem tocado.
- Convenções seguidas (DATA-DEC-018, padrão 13.4):
  - nomes em inglês; tabelas no plural, em snake_case;
  - `id uuid` com `pg_catalog.gen_random_uuid()`, nativo, sem extensão;
  - timestamps em `timestamptz`;
  - status e papéis em `text` + CHECK, em MAIÚSCULAS.

## 4. Entidades afetadas
Todas são criadas:
- `users`;
- `churches`;
- `church_memberships`;
- `ministries`;
- `ministry_memberships`;
- `ministry_functions`;
- `ministry_member_functions`;
- `audit_log`.

`auth.users` é só referenciada, por uma única FK.

## 5. Relacionamentos (12 FKs, todas ON DELETE RESTRICT e ON UPDATE NO ACTION)
- `users.auth_user_id` → `auth.users(id)`
- `church_memberships.church_id` → `churches(id)`; `church_memberships.user_id` → `users(id)`
- `ministries.church_id` → `churches(id)`
- `ministry_memberships(church_id, ministry_id)` → `ministries(church_id, id)` (E1)
- `ministry_memberships(church_id, user_id)` → `church_memberships(church_id, user_id)` (E2)
- `ministry_functions(church_id, ministry_id)` → `ministries(church_id, id)` (E1)
- `ministry_member_functions(church_id, ministry_id)` → `ministries(church_id, id)`
- `ministry_member_functions(ministry_id, ministry_membership_id)` → `ministry_memberships(ministry_id, id)` (E3)
- `ministry_member_functions(ministry_id, ministry_function_id)` → `ministry_functions(ministry_id, id)` (E3)
- `audit_log.church_id` → `churches(id)`; `audit_log.actor_user_id` → `users(id)`

## 6. Cardinalidades
São as da seção 8 do Feature Contract:
- `auth.users` → `users`: 1:0..1 (UNIQUE e NOT NULL do lado de `users`).
- `users` → `church_memberships`: 1:N.
- `churches` → `church_memberships`: 1:N, com UNIQUE(church_id, user_id).
- `churches` → `ministries`: 1:N.
- `ministries` → `ministry_memberships`: 1:N, com UNIQUE(church_id, ministry_id, user_id). Pela FK E1, isso equivale a um vínculo por (ministério, usuário); `church_id` entra pela ARQ-F002-14.
- `church_memberships` → `ministry_memberships`: 1:N, pela chave (igreja, usuário).
- `ministries` → `ministry_functions`: 1:N.
- `ministry_memberships` ↔ `ministry_functions`: N:N, por `ministry_member_functions`, sempre dentro do mesmo ministério.
- `churches` e `users` (ator) → `audit_log`: 1:N cada.

## 7. Constraints
- **PK:** `id` em 7 tabelas; PK composta (church_id, ministry_membership_id, ministry_function_id) nas habilitações (`church_id` pela ARQ-F002-14).
- **UNIQUE:**
  - `users(auth_user_id)`;
  - `church_memberships(church_id, user_id)`;
  - `ministries(church_id, id)`;
  - `ministry_memberships(church_id, ministry_id, user_id)` (ARQ-F002-14) e `(ministry_id, id)`;
  - `ministry_functions(ministry_id, id)`.
- **Índices únicos:**
  - parcial `church_memberships(church_id) WHERE role = 'OWNER'`, valendo para qualquer status (IGR-001);
  - de expressão `ministries(church_id, lower(name))` e `ministry_functions(church_id, ministry_id, lower(name))` (DATA-DEC-013; `church_id` em `ministry_functions` pela ARQ-F002-14).
- **CHECK:**
  - papéis: OWNER/ADMIN/MEMBER na igreja; LEADER/MEMBER no ministério;
  - status: ATIVO/INATIVO nas 5 tabelas que têm status;
  - "nome válido": `name <> '' and name !~ '^[[:space:]]|[[:space:]]$'`;
  - `action` e `entity_type` não vazios (`!~ '^[[:space:]]*$'`);
  - `audit_log`: `before_data is not null or after_data is not null`.
- **Colunas de status:** sem DEFAULT; nenhum CHECK acopla `status` e `ended_at` (ARQ-F002-09).
- **Triggers:**
  - `<tabela>_set_updated_at` nas 6 tabelas que têm `updated_at`;
  - `audit_log_prevent_update_delete` (por linha) e `audit_log_prevent_truncate` (por comando), que lançam P0001 para qualquer papel.

## 8. Estratégia multi-tenant
- `churches` é a raiz do tenant e `users` é global.
- As 6 tabelas de tenant têm `church_id NOT NULL`, ligado até a raiz por FK simples ou composta. Não há `church_id` "solto".
- **Camada estrutural:** FKs compostas E1, E2 e E3. Um UUID de outra igreja falha com 23503.
- **Unicidade com `church_id` (ARQ-F002-14; F002-QA-01; SEC-001):** toda unicidade que um INSERT do backend alcança inclui `church_id`. O RLS só fixa `church_id`, e o índice único é checado antes da FK composta, que roda no fim do comando. Sem `church_id` na chave, um INSERT no contexto da igreja A com ministério, vínculo ou função da igreja B responderia 23505 e revelaria o vínculo, o nome ou a habilitação da igreja B. Com `church_id`, a chave nunca colide com linha de outra igreja, e a FK composta responde 23503. O 23505 só aparece para duplicidade dentro da própria igreja. Exceção: a PK `id` e os UNIQUE(x, id) alvo de FK.
- **Camada de acesso:** policies `church_id = (select mescala.context_church_id())` (em `churches`, `id = ...`).
- **Falha fechada:** sem contexto, a função devolve NULL. SELECT e UPDATE veem 0 linhas e INSERT falha com 42501.
- **Escopo do RLS:** faz só isolamento de tenant. Papel + escopo ficam no backend (ARQ-F002-03).

## 9. Índices (21 no total; nenhum extra)
- Vindos das PKs e UNIQUEs do D5.
- Os 3 índices únicos especiais da seção 7.
- `church_memberships_user_id_idx`: "minhas igrejas".
- `ministry_memberships_church_id_user_id_idx`: FK E2 e "meus ministérios".
- `ministry_member_functions_ministry_function_id_idx`: "quem pode exercer a função F".
- `audit_log_church_id_occurred_at_idx`.

Os índices UNIQUE que começam por `church_id` já servem às FKs para `churches` e aos predicados de RLS.

## 10. Estratégia de migration
- 9 arquivos, na ordem e com os nomes do D9 e da seção 9, com timestamps estritamente crescentes. Cada um tem objetivo único e é atômico.
- Sem BEGIN/COMMIT e sem comando não transacional. Os únicos `begin` são delimitadores de bloco plpgsql: o DO do papel e os corpos de 2 funções.
- Todo objeto é qualificado com `mescala.` e as funções chamam `pg_catalog.*`.
- Cada cabeçalho traz MIGRATION, DOMÍNIO, FEATURE, OBJETIVO, REGRAS (`arquivo#ID` da Brain), DEPENDÊNCIAS e COMO DESFAZER.
- **Criação de `mescala_app` pode rodar de novo (D2):** se o papel já existe, cada atributo errado é corrigido individualmente. Papel SUPERUSER ou membro de algum papel faz a migration falhar.
  - Motivo técnico: no Supabase, o `postgres` não é superusuário, e o PostgreSQL recusa `ALTER ROLE ... NOSUPERUSER` vindo de quem não é superusuário, mesmo sem mudar nada. Por isso não há ALTER incondicional.

## 11. Impacto em dados existentes
Nenhum: o banco está vazio, não há migração de dados e o legado fica intocado. Não há consulta prévia a rodar além do V0 (pré-condição).

## 12. Riscos
- **RA:** se a aplicação rodar com um papel diferente de `postgres` (por exemplo, um papel temporário da CLI sem `SET ROLE postgres`), os donos dos objetos e a concessão implícita mudam.
  - Detecção: V1.3, V1.4, V1.12 e V1.13c.
  - Correção: nova migration.
  - Recomendação: `supabase link` com a senha do banco no prompt, o que conecta como `postgres`.
- **RB:** `lower()` de nomes acentuados depende do LC_CTYPE do banco. Nomes ASCII são sempre cobertos. Revisão 2: o V0.4 mede isso antes da aplicação (R-17); se der falso, nada é aplicado e vale a contingência de collation decidida pelo Arquiteto.
- **RC:** a FK cria triggers internos de RI em `auth.users` (comportamento padrão do PostgreSQL; não há DDL explícito em `auth`). Excluir a conta no Supabase Auth falha (R-07, aceito).
- **RD:** um `jsonb` com o valor JSON `null` conta como "preenchido" no CHECK de `audit_log`. O backend deve mandar SQL NULL.
- **RE:** `ministry_member_functions_ministry_id_ministry_function_id_fkey` tem exatamente 63 caracteres: está no limite, sem truncamento.
- **RF:** o script V2 nunca foi executado (R-11). Erro nele se corrige no script, não na migration.
- **Do contrato:** R-02 a R-10, R-12 e R-14 continuam valendo; a VERSÃO 2 acrescenta R-16 a R-19.

## 13. Bloqueios
Não há DATA MODEL BLOCKED. A divergência DIV-01 e as observações estão mais abaixo.

## 14. Implementação da migration
Os 9 arquivos estão listados na próxima seção.

---

# MIGRATIONS CRIADAS (ordem de aplicação)

1. `C:\projetos\mescala\backend\supabase\migrations\20261022150000_create_official_schema.sql`: cria o papel `mescala_app` (NOLOGIN, sem BYPASSRLS), o schema `mescala` com a higiene de privilégios, `context_user_id()`/`context_church_id()` e `set_updated_at()`.
2. `C:\projetos\mescala\backend\supabase\migrations\20261022150100_create_users.sql`: cria `users` (id, `auth_user_id` UNIQUE com FK RESTRICT para `auth.users`), com RLS sem policy e trigger de `updated_at`.
3. `C:\projetos\mescala\backend\supabase\migrations\20261022150200_create_churches.sql`: cria `churches` (name válido; status ATIVO/INATIVO; `ended_at`), com RLS e trigger.
4. `C:\projetos\mescala\backend\supabase\migrations\20261022150300_create_church_memberships.sql`: cria o vínculo igreja-usuário (OWNER/ADMIN/MEMBER), com UNIQUE(church_id, user_id), OWNER único parcial, índice em `user_id`, RLS e trigger.
5. `C:\projetos\mescala\backend\supabase\migrations\20261022150400_create_ministries.sql`: cria `ministries`, com UNIQUE(church_id, id) e nome único por igreja sem diferenciar maiúsculas, RLS e trigger.
6. `C:\projetos\mescala\backend\supabase\migrations\20261022150500_create_ministry_memberships.sql`: cria o vínculo ministério-usuário (LEADER/MEMBER), com as FKs compostas E1 e E2, as unicidades, o índice (church_id, user_id), RLS e trigger.
7. `C:\projetos\mescala\backend\supabase\migrations\20261022150600_create_ministry_functions.sql`: cria `ministry_functions` (nome único por ministério) e `ministry_member_functions` (habilitações, com as FKs compostas E3 e o índice por função), com RLS e trigger.
8. `C:\projetos\mescala\backend\supabase\migrations\20261022150700_create_audit_log.sql`: cria `audit_log` (só inserção), com o índice (church_id, occurred_at), o CHECK antes/depois, `prevent_audit_log_change()` e os 2 triggers de imutabilidade.
9. `C:\projetos\mescala\backend\supabase\migrations\20261022150800_grant_app_role_and_rls_policies.sql`: retira privilégios de PUBLIC e dos papéis da Data API, concede a matriz D7 (com UPDATE por coluna e, em `audit_log`, INSERT por coluna sem `id` e `occurred_at`) e cria as 18 policies da matriz D8.

---

# DATA MODEL SUMMARY

```text
Feature:   FOUNDATION-002 — Fundação de Persistência
Migration: 20261022150000 … 20261022150800 (9 arquivos acima)

Tabelas criadas (schema mescala):
- users (4 col.), churches (6), church_memberships (8), ministries (7),
  ministry_memberships (9), ministry_functions (8),
  ministry_member_functions (5), audit_log (9)

Tabelas alteradas: nenhuma.
Colunas adicionadas: só as das tabelas novas (56 colunas, exatamente o D5).

Outros objetos:
- papel de grupo mescala_app (cluster)
- 4 funções: context_user_id(), context_church_id() (STABLE),
  set_updated_at(), prevent_audit_log_change(); todas SECURITY INVOKER,
  com search_path = ''
- 8 triggers; 18 policies

Relacionamentos: 12 FKs (seção 5), todas RESTRICT/NO ACTION.

Constraints (pg_constraint, sem as de NOT NULL): 39
- 8 PK
- 6 UNIQUE
- 13 CHECK
- 12 FK

Índices: 21 (seção 9). Nenhum extra além do Data Task.

Unicidades com church_id (ARQ-F002-14, Revisão 2; trocas 1:1, mesmas
contagens):
- ministry_memberships_church_id_ministry_id_user_id_key (54):
  UNIQUE (church_id, ministry_id, user_id)
- ministry_functions_church_id_ministry_id_lower_name_key (55):
  índice único de expressão (church_id, ministry_id, lower(name))
- ministry_member_functions_pkey:
  PK (church_id, ministry_membership_id, ministry_function_id)
Privilégio por coluna (ARQ-F002-15, Revisão 2): INSERT de mescala_app
em audit_log só em church_id, actor_user_id, action, entity_type,
entity_id, before_data e after_data.

Nomes fora do padrão literal (D10, documentados nos cabeçalhos):
- ministry_member_functions_ministry_id_ministry_membership_fkey (62):
  o literal teria 65 caracteres; foi retirado o "_id" final
- church_memberships_church_id_owner_key: índice único parcial; o
  sufixo da regra ("owner") foi acrescentado para não parecer
  UNIQUE(church_id)

Tenant isolation: church_id NOT NULL e ligado até a raiz nas 6 tabelas
de tenant; FKs compostas E1, E2 e E3; toda unicidade alcançável por
INSERT inclui church_id (ARQ-F002-14: ID de outra igreja → 23503, nunca
23505); RLS por contexto de igreja com falha fechada; audit_log exige
igreja e ator do contexto.

Transações relevantes (para FOUNDATION-003, CHURCH-001 e demais):
- Contexto só com set_config('mescala.current_user_id', <users.id>, true)
  e set_config('mescala.current_church_id', <churches.id>, true), dentro
  de BEGIN…COMMIT explícito. Nunca na sessão: com o pooler em modo
  transação, isso é obrigatório.
- CHURCH-001, em uma transação: gerar o id da igreja → definir o
  contexto (igreja = esse id, usuário = users.id) → INSERT churches →
  INSERT church_memberships (OWNER) → INSERT audit_log.
- audit_log: só INSERT, sem RETURNING (mescala_app não tem SELECT), e
  sempre com lista de colunas: só church_id, actor_user_id, action,
  entity_type, entity_id, before_data e after_data (ARQ-F002-15). id e
  occurred_at vêm do default do banco. Listar id ou occurred_at, mesmo
  com DEFAULT, ou omitir a lista de colunas dá 42501. A ferramenta da
  DEC-04 parte 2 precisa gerar o INSERT só com as colunas informadas.
- UPDATE só nas colunas concedidas. Incluir church_id, user_id,
  ministry_id, id, created_at ou updated_at no SET, mesmo com o mesmo
  valor, dá 42501. A ferramenta da DEC-04 parte 2 precisa permitir
  UPDATE só das colunas alteradas (nada de "update de todas as colunas")
  e não pode depender de DELETE.
- SQLSTATEs da seção 17 do contrato.

Riscos: RA a RF (seção 12) mais os do contrato (R-02 a R-10, R-12, R-14 e, na VERSÃO 2, R-16 a R-19).

Compatibilidade: primeira versão do schema; nada anterior a preservar;
legado intocado; FOUNDATION-001 sem nenhuma mudança.
```

---

# DATA MODEL DIVERGENCE (DIV-01, técnica, não bloqueante; DECIDIDA na Revisão 2: opção A, ARQ-F002-16)

```text
DATA MODEL DIVERGENCE

Feature Contract (Data Task D1):
"Ajustar os privilégios padrão do schema para objetos futuros criados
por postgres: nada é concedido automaticamente a ninguém; EXECUTE de
funções futuras não fica com PUBLIC."

PostgreSQL (o "Schema atual" do formato não se aplica: é limite do PostgreSQL):
ALTER DEFAULT PRIVILEGES … IN SCHEMA só ACRESCENTA privilégios aos
padrões globais; não retira o que vem do padrão global. O padrão global
embutido dá EXECUTE a PUBLIC em toda função nova (e USAGE a PUBLIC em
todo tipo novo). Os REVOKE por schema da migration 1 garantem que o
schema não acrescenta nada (V1.16a: 0 linhas), mas não retiram o
EXECUTE de PUBLIC em funções futuras.

Impacto:
Nenhum nesta feature: as 4 funções retiram EXECUTE de PUBLIC
explicitamente (migrations 1 e 8, reforçado na 9). Para o futuro, há
duas compensações:
(a) PUBLIC, anon, authenticated, service_role e authenticator não têm
    USAGE no schema, então não alcançam função dele;
(b) toda migration futura que criar função deve retirar EXECUTE de
    PUBLIC (convenção minha).
Resíduo: se uma migration futura esquecer o REVOKE, mescala_app (que é
membro de PUBLIC e tem USAGE) ganha EXECUTE nessa função. O V1.12b
detecta.

Decisão necessária (Arquiteto):
A) aceitar a compensação (recomendado);
B) autorizar, em migration própria, ALTER DEFAULT PRIVILEGES FOR ROLE
   postgres REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, sem IN SCHEMA. Isso
   vale para o banco inteiro (inclusive para funções que o painel ou
   extensões criem como postgres em outros schemas) e fica fora do
   critério 2 ("objeto fora do schema").
O V1.16b mostra os padrões globais reais do projeto, para embasar a
decisão.

Decisão (Arquiteto, revisão pré-aplicação de 2026-10-22): opção A,
registrada como ARQ-F002-16.
- O padrão global de privilégios do banco não é alterado. ALTER DEFAULT
  PRIVILEGES sem IN SCHEMA é proibido.
- Toda migration que cria função em mescala retira EXECUTE de PUBLIC
  na mesma migration e concede EXECUTE só aos papéis que o Data Task
  listar (função de trigger: a ninguém). Toda tabela nova nasce sem
  privilégio para PUBLIC e para os papéis da Data API. A compensação
  (b) deixa de ser convenção minha e passa a ser convenção do schema
  oficial.
- Os 4 REVOKE por schema da migration 1 ficam como estão: são inócuos
  e estão documentados.
- Risco residual R-18: uma função futura sem o REVOKE fica executável
  só por mescala_app, o único papel com USAGE no schema. Regressão fixa
  no QA: V1.12b e V1.14b a V1.14d.
- Comentário da migration 1 atualizado (20261022150000, linhas 74-80).
```

**Observações (sem bloqueio):**
- **OBS-01:** o bloco da seção 6 do contrato ainda diz "VERSÃO 1, STATUS BLOCKED" e tem os marcadores `<schema>` e `[B-02]`. O cabeçalho registra READY e as respostas do PO, e foi isso que apliquei. Falta a sessão principal ou o Arquiteto registrarem a VERSÃO 2, como a própria seção 6 prevê. *(Histórico. Resolvida na Revisão 2: o contrato está na VERSÃO 2, sem marcadores.)*
- **OBS-02:** a Brain ainda não registra B-01 e B-02 (`dados/STATUS` diz "Igreja: A DEFINIR"; a DEC-09 diz "nome do schema: A DEFINIR"). Não é conflito, mas falta pedir a sincronização ao vault-brain. *(Histórico. Encaminhada ao vault-brain no pedido 1 da revisão pré-aplicação.)*
- **OBS-03:** interpretações técnicas que fiz (QA e Arquiteto, confiram):
  - "sem espaço nas pontas" usa a classe `[[:space:]]`, que também recusa tabulação e quebra de linha;
  - "não vazio" em `action`/`entity_type` também recusa texto só com espaço em branco;
  - "preenchido" em `audit_log` significa "não NULL" em SQL.
- **OBS-04:** incluí `authenticator` nas retiradas de privilégio. O D1 e o D7 listam 4 papéis; a seção 9 e o critério 13 listam 5. Também incluí `revoke all on all tables in schema mescala from mescala_app` antes dos grants, para a matriz D7 ficar exata. Não tem efeito colateral.

---

# DATA TASK RESULT

```text
Feature: FOUNDATION-002 — Fundação de Persistência
Status:  MIGRATIONS ESCRITAS, NÃO APLICADAS

Migration criada (ordem de aplicação):
1. C:\projetos\mescala\backend\supabase\migrations\20261022150000_create_official_schema.sql
2. C:\projetos\mescala\backend\supabase\migrations\20261022150100_create_users.sql
3. C:\projetos\mescala\backend\supabase\migrations\20261022150200_create_churches.sql
4. C:\projetos\mescala\backend\supabase\migrations\20261022150300_create_church_memberships.sql
5. C:\projetos\mescala\backend\supabase\migrations\20261022150400_create_ministries.sql
6. C:\projetos\mescala\backend\supabase\migrations\20261022150500_create_ministry_memberships.sql
7. C:\projetos\mescala\backend\supabase\migrations\20261022150600_create_ministry_functions.sql
8. C:\projetos\mescala\backend\supabase\migrations\20261022150700_create_audit_log.sql
9. C:\projetos\mescala\backend\supabase\migrations\20261022150800_grant_app_role_and_rls_policies.sql

Schema impactado: novo schema mescala (8 tabelas, 4 funções, 8 triggers,
18 policies); papel mescala_app; 1 FK para auth.users. Nada em public.

Tenant isolation:          OK
Integridade referencial:   OK
Compatibilidade:           OK (primeira versão; o legado e a
                           FOUNDATION-001 ficam intocados)

Riscos: RA a RF e os do contrato (seção 12 do DATA ANALYSIS); DIV-01 decidida (ARQ-F002-16), com risco residual R-18.

Pendências:
- aplicar manualmente as migrations listadas e confirmar execução sem erro;
- antes de aplicar (pré-condições do A3, Anexo A da VERSÃO 2): QA fase
  1b APPROVED (delta da Revisão 2) e confirmação do delta pelo Arquiteto
  (revisão pré-aplicação APPROVED). Até lá, se algum ajuste for pedido,
  eu edito os próprios arquivos (ainda não aplicados);
- se o V0.4 der falso (lower() não iguala maiúsculas acentuadas; R-17),
  nada é aplicado. Eu faço a contingência de collation decidida pelo
  Arquiteto na expressão lower(name) de 20261022150400 (linha 71) e de
  20261022150600 (linha 123 depois da Revisão 2), com nova fase 1b e
  nova confirmação antes do A3;
- DIV-01: decidida (opção A, ARQ-F002-16). VERSÃO 2 do contrato:
  registrada pelo orquestrador (C-1 da revisão; resolve a OBS-01);
- vault-brain: pedido 1 da revisão pré-aplicação (B-01 a B-04,
  convenções ARQ-F002-14 e 16, ARQ-F002-15 em seguranca/AUDITORIA)
  (OBS-02);
- Desenvolvedor: backend/supabase/config.toml e backend/.gitignore,
  depois do encerramento da AUTH-001 (não criados por mim);
- PO: rodar o V0 antes, uma consulta por vez (com o V0.4); aplicar
  (Anexo A, de A3 a A6); rodar o V1 uma consulta por vez, o V2
  integrado, o bloco B do QA e de novo V1.20, V1.13b, V1.13c e V1.11;
  devolver as saídas para a QA fase 2.

Resultado: READY_FOR_BACKEND
(Revisão 2: o próximo passo é a QA fase 1b, seguida da confirmação do delta pelo Arquiteto)
```

Verificação estática que fiz no repositório:
- 9 nomes no formato `<14 dígitos>_<objetivo>.sql`, com timestamps crescentes.
- As 8 tabelas habilitam RLS no próprio arquivo; nenhum FORCE.
- 12 de 12 FKs com RESTRICT e NO ACTION; nenhum CASCADE, SET NULL ou SET DEFAULT.
- Toda referência de tabela é qualificada (`mescala.` ou `auth.users`).
- 4 funções SECURITY INVOKER com `search_path = ''`.
- Nenhum identificador passa de 63 caracteres: o maior tem 63, o seguinte 62.
- Fora de comentários, não aparece COMMIT, ROLLBACK, CONCURRENTLY, password, `postgres://`, `sb_`, `eyJ`, cascade, SECURITY DEFINER nem `public.`.
- "LOGIN" só aparece como NOLOGIN e `rolcanlogin`.
- `git status`: além dos arquivos do Desenvolvedor (AUTH-001), só os 9 arquivos novos. `supabase/` da raiz, `src/`, `brain-mescala/`, `.claude/` e `docs/` estão intactos.
- **Revisão 2:**
  - Só mudaram 20261022150000 (comentário), 20261022150200 (comentário), 20261022150500, 20261022150600 e 20261022150800. 150100, 150300, 150400 e 150700 têm o mesmo conteúdo de antes.
  - Fora de comentários: 8 `primary key`, 6 `unique (`, 13 `check (`, 12 `foreign key`, 39 `constraint`, 3 `create unique index` e 4 `create index` (21 índices com as PKs e os UNIQUE).
  - Os nomes novos têm 54 e 55 caracteres; o maior continua com 63.
  - As migrations não contêm mais `ministry_memberships_ministry_id_user_id_key`, `ministry_functions_ministry_id_lower_name_key` nem `grant insert on table mescala.audit_log`.
  - Terminação LF.

## O que o PO faz fora do repositório
- **Nenhuma senha nem papel de login nesta feature.** O papel de login, a senha e a string de conexão vêm com a FOUNDATION-003 (A8).
- A senha do banco só no prompt do `supabase link` (A3), nunca em arquivo.
- Confirmar em Data API → "Exposed schemas" que `mescala` **não** aparece (A6, V1.18).
- Comandos só dentro de `/backend`. Os comandos proibidos são os do A9.
- Rodar o V0 antes de aplicar, uma consulta por vez (com o V0.4). Depois da aplicação: o V1 uma consulta por vez (V1.1 a V1.24), o V2 integrado sozinho, o bloco B do QA sozinho (informativo) e de novo V1.20, V1.13b, V1.13c e V1.11. Devolver todas as saídas.

---

# SCRIPT DE VERIFICAÇÃO (D11, rodar no SQL Editor do projeto vitqnyzuvrvkmnvshcpb)

## V0: pré-aplicação (somente leitura)
```sql
-- V0.1 Esperado: 0 linhas em cada uma.
select nspname from pg_catalog.pg_namespace where nspname = 'mescala';
select rolname from pg_catalog.pg_roles where rolname = 'mescala_app';
-- V0.2 Esperado: erro "relation ... does not exist" OU 0 linhas.
select version, name from supabase_migrations.schema_migrations order by version;
-- V0.3 Esperado: 0 linhas (public vazio; guarde a saída para comparar com o V1.17).
select c.relname, c.relkind from pg_catalog.pg_class c where c.relnamespace = 'public'::regnamespace;
-- V0.3b Linha de base das funções de public. Registrar (comparar com a 2ª consulta do V1.17).
select p.proname from pg_catalog.pg_proc p where p.pronamespace = 'public'::regnamespace order by 1;
-- V0.3c Linha de base dos tipos de public. Registrar (comparar com a 3ª consulta do V1.17).
select t.typname from pg_catalog.pg_type t where t.typnamespace = 'public'::regnamespace order by 1;

-- V0.4 (R-17; DATA-DEC-013) Locale e lower() com letras acentuadas, ANTES do A3.
--      Se o V0.4b não der o esperado: PARAR e devolver V0.4a a V0.4d, sem aplicar nada.
--      Contingência já decidida (revisão pré-aplicação, 3c): as migrations 20261022150400 e 20261022150600
--      passam a usar lower(name collate pg_catalog."pg_c_utf8") se versao_num >= 170000 e a collation
--      existir (V0.4c); senão, "und-x-icu"; se nenhuma existir, BLOCKED. Esse delta passa pela fase 1b
--      do QA e pela confirmação do Arquiteto.
-- V0.4a Versão, codificação e locale. Esperado: 1 linha; codificacao = UTF8. Registrar o resto.
--       provedor: c = libc, i = ICU, b = builtin (PG17+); locale_icu_ou_builtin só vem preenchido com i ou b.
--       As colunas que mudam de nome entre versões são lidas por to_jsonb: a consulta não dá erro em PG15, 16 ou 17.
select pg_catalog.current_setting('server_version_num')::int as versao_num,
       pg_catalog.pg_encoding_to_char(d.encoding) as codificacao,
       pg_catalog.to_jsonb(d) ->> 'datlocprovider' as provedor,
       d.datcollate, d.datctype,
       coalesce(pg_catalog.to_jsonb(d) ->> 'datlocale', pg_catalog.to_jsonb(d) ->> 'daticulocale') as locale_icu_ou_builtin
  from pg_catalog.pg_database d
 where d.datname = pg_catalog.current_database();
-- V0.4b lower() com a collation padrão do banco, a mesma dos índices de nome. Esperado: 1 linha com
--       qtd_letras = 13, resultado = áàâãéêíóôõúüç, minusculas_ok = t e recepcao_ok = t.
--       qtd_letras diferente de 13: o texto chegou corrompido pelo editor; corrigir e repetir antes de concluir.
--       minusculas_ok = f ou recepcao_ok = f: PARAR (R-17).
select pg_catalog.length('ÁÀÂÃÉÊÍÓÔÕÚÜÇ') as qtd_letras,
       pg_catalog.lower('ÁÀÂÃÉÊÍÓÔÕÚÜÇ') as resultado,
       pg_catalog.lower('ÁÀÂÃÉÊÍÓÔÕÚÜÇ') = 'áàâãéêíóôõúüç' as minusculas_ok,
       pg_catalog.lower('RECEPÇÃO') = pg_catalog.lower('Recepção') as recepcao_ok;
-- V0.4c Collations da contingência. Registrar: 0, 1 ou 2 linhas (pg_c_utf8 só existe a partir do PG17;
--       und-x-icu só com ICU).
select c.collname, c.collprovider, c.collencoding
  from pg_catalog.pg_collation c
 where c.collnamespace = 'pg_catalog'::regnamespace and c.collname in ('pg_c_utf8', 'und-x-icu')
 order by 1;
-- V0.4d Só se o V0.4b der f, e só para as collations listadas no V0.4c (a outra dá erro de collation
--       inexistente): prova da contingência antes do delta. Esperado: t na collation escolhida pela regra.
select pg_catalog.lower('ÁÀÂÃÉÊÍÓÔÕÚÜÇ' collate pg_catalog."pg_c_utf8") = 'áàâãéêíóôõúüç' as pg_c_utf8_ok;
select pg_catalog.lower('ÁÀÂÃÉÊÍÓÔÕÚÜÇ' collate pg_catalog."und-x-icu") = 'áàâãéêíóôõúüç' as und_x_icu_ok;
```

## V1: catálogo, somente leitura (depois de aplicar)
```sql
-- V1.1 Registrar a saída.
select pg_catalog.version(), pg_catalog.current_setting('server_version_num') as versao_num, current_user, session_user;

-- V1.2 (só se aplicou pela CLI) Esperado: 9 linhas, de 20261022150000 a 20261022150800, com os nomes
--      create_official_schema, create_users, create_churches, create_church_memberships, create_ministries,
--      create_ministry_memberships, create_ministry_functions, create_audit_log, grant_app_role_and_rls_policies.
select version, name from supabase_migrations.schema_migrations order by version;

-- V1.3 Esperado: 1 linha; dono postgres; nspacl = {postgres=UC/postgres,mescala_app=U/postgres}
--      (nenhuma entrada de PUBLIC, "=U/..." ou "=UC/...").
select n.nspname, pg_catalog.pg_get_userbyid(n.nspowner) as dono, n.nspacl
  from pg_catalog.pg_namespace n where n.nspname = 'mescala';

-- V1.4 Esperado: exatamente 8 linhas, relkind r, dono postgres: audit_log, church_memberships, churches,
--      ministries, ministry_functions, ministry_member_functions, ministry_memberships, users.
select c.relname, c.relkind, pg_catalog.pg_get_userbyid(c.relowner) as dono
  from pg_catalog.pg_class c
 where c.relnamespace = 'mescala'::regnamespace and c.relkind not in ('i', 'I')
 order by 1;
-- V1.4b Tipos além dos implícitos das tabelas. Esperado: 0 linhas.
select t.typname, t.typtype
  from pg_catalog.pg_type t
 where t.typnamespace = 'mescala'::regnamespace
   and not exists (select 1 from pg_catalog.pg_class c where c.oid = t.typrelid)
   and not exists (select 1 from pg_catalog.pg_type e join pg_catalog.pg_class c on c.oid = e.typrelid where e.oid = t.typelem);

-- V1.5 Esperado: 56 linhas. Tipos: uuid, text, jsonb, timestamp with time zone.
--   users: id(uuid, NN, gen_random_uuid()), auth_user_id(uuid, NN), created_at(NN, now()), updated_at(NN, now())
--   churches: id(NN, gen_random_uuid()), name(text, NN), status(text, NN, sem default), ended_at(timestamptz, nulo),
--             created_at(NN, now()), updated_at(NN, now())
--   church_memberships: id, church_id(NN), user_id(NN), role(text, NN), status(text, NN), ended_at(nulo), created_at, updated_at
--   ministries: id, church_id, name, status, ended_at(nulo), created_at, updated_at
--   ministry_memberships: id, church_id, ministry_id, user_id, role, status, ended_at(nulo), created_at, updated_at
--   ministry_functions: id, church_id, ministry_id, name, status, ended_at(nulo), created_at, updated_at
--   ministry_member_functions: church_id, ministry_id, ministry_membership_id, ministry_function_id (uuid, NN, sem default),
--             created_at(NN, now())
--   audit_log: id(NN, gen_random_uuid()), church_id, actor_user_id, action(text), entity_type(text), entity_id(uuid) — todos NN;
--             before_data(jsonb, nulo), after_data(jsonb, nulo), occurred_at(NN, now())
--   Em todas: id com default gen_random_uuid(); created_at/updated_at com now(); status e role sem default.
select c.relname as tabela, a.attnum, a.attname, pg_catalog.format_type(a.atttypid, a.atttypmod) as tipo,
       a.attnotnull, pg_catalog.pg_get_expr(d.adbin, d.adrelid) as default_
  from pg_catalog.pg_attribute a
  join pg_catalog.pg_class c on c.oid = a.attrelid
  left join pg_catalog.pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
 where c.relnamespace = 'mescala'::regnamespace and c.relkind = 'r' and a.attnum > 0 and not a.attisdropped
 order by 1, 2;

-- V1.6 Esperado: 8 linhas, todas relrowsecurity = t e relforcerowsecurity = f.
select relname, relrowsecurity, relforcerowsecurity
  from pg_catalog.pg_class where relnamespace = 'mescala'::regnamespace and relkind = 'r' order by 1;

-- V1.7 Esperado: 39 linhas — 8 p, 6 u, 13 c, 12 f (nomes no DATA MODEL SUMMARY e nos arquivos).
select c.conrelid::regclass as tabela, c.conname, c.contype, pg_catalog.pg_get_constraintdef(c.oid) as definicao
  from pg_catalog.pg_constraint c
 where c.connamespace = 'mescala'::regnamespace and c.contype <> 'n'
 order by 1, 2;
-- V1.7b FKs fora da regra. Esperado: 0 linhas.
select conname, confdeltype, confupdtype from pg_catalog.pg_constraint
 where connamespace = 'mescala'::regnamespace and contype = 'f' and (confdeltype <> 'r' or confupdtype <> 'a');

-- V1.8 Esperado: 21 linhas (nomes com o prefixo da tabela):
--   audit_log: pkey, church_id_occurred_at_idx
--   church_memberships: pkey, church_id_user_id_key, church_id_owner_key, user_id_idx
--   churches: pkey
--   ministries: pkey, church_id_id_key, church_id_lower_name_key
--   ministry_memberships: pkey, church_id_ministry_id_user_id_key, ministry_id_id_key, church_id_user_id_idx
--   ministry_functions: pkey, ministry_id_id_key, church_id_ministry_id_lower_name_key
--   ministry_member_functions: pkey, ministry_function_id_idx
--   users: pkey, auth_user_id_key
--   Definições a conferir:
--   church_memberships_church_id_owner_key ... (church_id) WHERE (role = 'OWNER'::text)
--   ministries_church_id_lower_name_key ... (church_id, lower(name))
--   ministry_functions_church_id_ministry_id_lower_name_key ... (church_id, ministry_id, lower(name))
--   ministry_memberships_church_id_ministry_id_user_id_key ... (church_id, ministry_id, user_id)
--   ministry_member_functions_pkey ... (church_id, ministry_membership_id, ministry_function_id)
--   (ARQ-F002-14). Não existem ministry_memberships_ministry_id_user_id_key nem
--   ministry_functions_ministry_id_lower_name_key.
select tablename, indexname, indexdef from pg_catalog.pg_indexes where schemaname = 'mescala' order by 1, 2;

-- V1.9 Esperado: exatamente 1 linha: users_auth_user_id_fkey | mescala.users | auth.users | r | a | mescala
--      (FKs do próprio schema auth são excluídas; se aparecer alguma de storage, é da plataforma: registrar).
select c.conname, c.conrelid::regclass as tabela, c.confrelid::regclass as referencia,
       c.confdeltype, c.confupdtype, c.connamespace::regnamespace as schema
  from pg_catalog.pg_constraint c
 where c.contype = 'f' and c.confrelid = 'auth.users'::regclass and c.connamespace <> 'auth'::regnamespace;

-- V1.10 Esperado: 98 linhas (39 constraint, 21 index, 8 trigger, 18 policy, 4 function, 8 table);
--       maior tamanho 63; nomes idênticos aos dos arquivos (nenhum truncado).
select tipo, nome, pg_catalog.length(nome) as tamanho from (
  select 'constraint' as tipo, conname::text as nome from pg_catalog.pg_constraint
   where connamespace = 'mescala'::regnamespace and contype <> 'n'
  union all select 'index', indexname::text from pg_catalog.pg_indexes where schemaname = 'mescala'
  union all select 'trigger', t.tgname::text from pg_catalog.pg_trigger t join pg_catalog.pg_class c on c.oid = t.tgrelid
   where c.relnamespace = 'mescala'::regnamespace and not t.tgisinternal
  union all select 'policy', policyname::text from pg_catalog.pg_policies where schemaname = 'mescala'
  union all select 'function', proname::text from pg_catalog.pg_proc where pronamespace = 'mescala'::regnamespace
  union all select 'table', relname::text from pg_catalog.pg_class where relnamespace = 'mescala'::regnamespace and relkind = 'r'
) x order by 3 desc, 1, 2;

-- V1.11 Esperado: 8 linhas, tgenabled = O: <tabela>_set_updated_at (BEFORE UPDATE, FOR EACH ROW) em users, churches,
--   church_memberships, ministries, ministry_memberships, ministry_functions; audit_log_prevent_update_delete
--   (BEFORE UPDATE OR DELETE, FOR EACH ROW); audit_log_prevent_truncate (BEFORE TRUNCATE, FOR EACH STATEMENT).
--   Nenhum trigger em ministry_member_functions.
select c.relname as tabela, t.tgname, t.tgenabled, pg_catalog.pg_get_triggerdef(t.oid) as definicao
  from pg_catalog.pg_trigger t join pg_catalog.pg_class c on c.oid = t.tgrelid
 where c.relnamespace = 'mescala'::regnamespace and not t.tgisinternal
 order by 1, 2;

-- V1.12 Esperado: 4 linhas, todas prosecdef = f, proconfig = {"search_path=\"\""}, dono postgres.
--   context_church_id / context_user_id: retorno uuid, provolatile s, proacl {postgres=X/postgres,mescala_app=X/postgres}
--   prevent_audit_log_change / set_updated_at: retorno trigger, provolatile v, proacl {postgres=X/postgres}
select p.proname, pg_catalog.pg_get_function_result(p.oid) as retorno, p.prosecdef, p.provolatile, p.proconfig,
       pg_catalog.pg_get_userbyid(p.proowner) as dono, p.proacl
  from pg_catalog.pg_proc p where p.pronamespace = 'mescala'::regnamespace order by 1;
-- V1.12b Esperado: 20 linhas; execute = t SÓ em (context_church_id, mescala_app) e (context_user_id, mescala_app).
select p.proname, r.rolname, pg_catalog.has_function_privilege(r.oid, p.oid, 'EXECUTE') as execute
  from pg_catalog.pg_proc p cross join pg_catalog.pg_roles r
 where p.pronamespace = 'mescala'::regnamespace
   and r.rolname in ('mescala_app', 'anon', 'authenticated', 'service_role', 'authenticator')
 order by 1, 2;

-- V1.13 Esperado: rolsuper, rolcreaterole, rolcreatedb, rolcanlogin, rolreplication e rolbypassrls todos f.
select rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, rolcanlogin, rolreplication, rolbypassrls, rolconfig
  from pg_catalog.pg_roles where rolname = 'mescala_app';
-- V1.13b mescala_app é membro de algum papel? Esperado: 0 linhas.
select m.roleid::regrole as papel from pg_catalog.pg_auth_members m where m.member = 'mescala_app'::regrole;
-- V1.13c (PG16+) Membros de mescala_app. Esperado: 1 linha — membro postgres, concedente = superusuário de bootstrap
--        (no Supabase, supabase_admin), admin_option t, inherit_option f, set_option f.
--        Uma 2ª linha com concedente postgres só existe se o projeto usar createrole_self_grant: registrar.
--        (Em PG15 essas colunas não existem: remover inherit_option/set_option; esperado 0 linhas.)
select m.member::regrole as membro, m.grantor::regrole as concedente, m.admin_option, m.inherit_option, m.set_option
  from pg_catalog.pg_auth_members m where m.roleid = 'mescala_app'::regrole;
-- V1.13d Objetos de mescala_app. Esperado: 0.
select (select count(*) from pg_catalog.pg_class where relowner = 'mescala_app'::regrole)
     + (select count(*) from pg_catalog.pg_proc where proowner = 'mescala_app'::regrole)
     + (select count(*) from pg_catalog.pg_namespace where nspowner = 'mescala_app'::regrole) as objetos;

-- V1.14a Esperado: só mescala_app com usage = t; create = f para os 5.
select r.rolname, pg_catalog.has_schema_privilege(r.oid, 'mescala', 'USAGE') as usage,
       pg_catalog.has_schema_privilege(r.oid, 'mescala', 'CREATE') as create_
  from pg_catalog.pg_roles r
 where r.rolname in ('mescala_app', 'anon', 'authenticated', 'service_role', 'authenticator') order by 1;
-- V1.14b Privilégios de tabela (exceto do dono). Esperado: exatamente 12 linhas, todas de mescala_app:
--   SELECT+INSERT em churches, church_memberships, ministries, ministry_memberships, ministry_functions,
--   ministry_member_functions (12). Nenhuma linha de audit_log: o INSERT é por coluna (V1.14c; ARQ-F002-15).
--   Nada em users. Nenhum PUBLIC.
select c.relname as tabela, case when a.grantee = 0 then 'PUBLIC' else a.grantee::regrole::text end as grantee, a.privilege_type
  from pg_catalog.pg_class c cross join lateral pg_catalog.aclexplode(c.relacl) a
 where c.relnamespace = 'mescala'::regnamespace and c.relkind = 'r' and a.grantee <> c.relowner
 order by 1, 2, 3;
-- V1.14c Privilégios de coluna. Esperado: exatamente 22 linhas, todas de mescala_app:
--   15 UPDATE: churches(ended_at,name,status), church_memberships(ended_at,role,status), ministries(ended_at,name,status),
--   ministry_memberships(ended_at,role,status), ministry_functions(ended_at,name,status);
--   7 INSERT: audit_log(action,actor_user_id,after_data,before_data,church_id,entity_id,entity_type) (ARQ-F002-15).
--   Nenhuma linha para audit_log.id nem audit_log.occurred_at.
select c.relname as tabela, att.attname as coluna,
       case when a.grantee = 0 then 'PUBLIC' else a.grantee::regrole::text end as grantee, a.privilege_type
  from pg_catalog.pg_attribute att
  join pg_catalog.pg_class c on c.oid = att.attrelid
 cross join lateral pg_catalog.aclexplode(att.attacl) a
 where c.relnamespace = 'mescala'::regnamespace and att.attacl is not null
 order by 1, 2, 3, 4;
-- V1.14d Papéis da Data API com qualquer privilégio de tabela. Esperado: 0 linhas.
select r.rolname, c.relname, p.priv
  from pg_catalog.pg_roles r
 cross join pg_catalog.pg_class c
 cross join (values ('SELECT'), ('INSERT'), ('UPDATE'), ('DELETE'), ('TRUNCATE'), ('REFERENCES'), ('TRIGGER')) p(priv)
 where r.rolname in ('anon', 'authenticated', 'service_role', 'authenticator')
   and c.relnamespace = 'mescala'::regnamespace and c.relkind = 'r'
   and pg_catalog.has_table_privilege(r.oid, c.oid, p.priv);

-- V1.15 Esperado: 18 linhas; permissive = PERMISSIVE; roles = {mescala_app}:
--   churches: churches_select_tenant (SELECT, qual id = contexto), churches_insert_tenant (INSERT, with_check id = contexto),
--             churches_update_tenant (UPDATE, qual e with_check id = contexto)
--   church_memberships, ministries, ministry_memberships, ministry_functions: <t>_select_tenant, <t>_insert_tenant,
--             <t>_update_tenant (church_id = contexto)
--   ministry_member_functions: _select_tenant, _insert_tenant
--   audit_log: audit_log_insert_tenant_actor (INSERT; with_check church_id = contexto AND actor_user_id = contexto de usuário)
--   Nenhuma em users.
select tablename, policyname, permissive, roles, cmd, qual, with_check
  from pg_catalog.pg_policies where schemaname = 'mescala' order by 1, 2;

-- V1.16a Privilégios padrão do schema. Esperado: 0 linhas.
select pg_catalog.pg_get_userbyid(d.defaclrole) as papel, d.defaclobjtype, d.defaclacl
  from pg_catalog.pg_default_acl d where d.defaclnamespace = 'mescala'::regnamespace;
-- V1.16b (informativo, para a DIV-01) Padrões globais. Registrar a saída.
select pg_catalog.pg_get_userbyid(d.defaclrole) as papel, d.defaclobjtype, d.defaclacl
  from pg_catalog.pg_default_acl d where d.defaclnamespace = 0;

-- V1.17 Esperado: 0 linhas em cada uma (ou idêntico ao V0.3).
select c.relname, c.relkind from pg_catalog.pg_class c where c.relnamespace = 'public'::regnamespace;
select p.proname from pg_catalog.pg_proc p where p.pronamespace = 'public'::regnamespace;
select t.typname from pg_catalog.pg_type t where t.typnamespace = 'public'::regnamespace;

-- V1.18 Data API: confirmação manual do PO (A6). V1.19: saída do V2.

-- V1.20 Resíduo (rodar antes e DEPOIS do V2). Esperado: 9 linhas, todas 0;
--       e V1.13b/V1.13c idênticos aos de antes do V2.
select 'users' as tabela, count(*) from mescala.users
union all select 'churches', count(*) from mescala.churches
union all select 'church_memberships', count(*) from mescala.church_memberships
union all select 'ministries', count(*) from mescala.ministries
union all select 'ministry_memberships', count(*) from mescala.ministry_memberships
union all select 'ministry_functions', count(*) from mescala.ministry_functions
union all select 'ministry_member_functions', count(*) from mescala.ministry_member_functions
union all select 'audit_log', count(*) from mescala.audit_log
union all select 'auth.users sinteticos do V2', count(*) from auth.users
 where id::text like '00000000-0000-4000-8000-0000000000%';

-- V1.21 Publicações (Realtime/replicação) que incluem tabelas de mescala. Esperado: 0 linhas.
select pt.pubname, pt.schemaname, pt.tablename
  from pg_catalog.pg_publication_tables pt where pt.schemaname = 'mescala';
-- V1.21b Publicações FOR ALL TABLES. Esperado: 0 linhas (registrar se houver).
select p.pubname from pg_catalog.pg_publication p where p.puballtables;

-- V1.22 (R-17) Locale do banco depois da aplicação. Registrar; tem de ser igual ao V0.4a (quem decide é o V0.4b).
select pg_catalog.current_setting('server_version_num')::int as versao_num,
       pg_catalog.pg_encoding_to_char(d.encoding) as codificacao,
       pg_catalog.to_jsonb(d) ->> 'datlocprovider' as provedor,
       d.datcollate, d.datctype,
       coalesce(pg_catalog.to_jsonb(d) ->> 'datlocale', pg_catalog.to_jsonb(d) ->> 'daticulocale') as locale_icu_ou_builtin
  from pg_catalog.pg_database d
 where d.datname = pg_catalog.current_database();

-- V1.23 (PG15+) SET concedido em parâmetros. Esperado: nenhuma entrada que dê session_replication_role ou
--       row_security a PUBLIC (entrada "=s/..."), mescala_app, anon, authenticated, service_role ou authenticator.
--       Entrada para postgres: registrar (ligada ao I1 do bloco B e ao R-16). Em PG14 ou anterior a consulta
--       dá erro de tabela inexistente: registrar e seguir.
select a.parname, a.paracl from pg_catalog.pg_parameter_acl a order by 1;

-- V1.24 (informativo) Event triggers da plataforma. Registrar; cruzar com o V1.14 (nenhum pode ter concedido
--       privilégio em mescala).
select e.evtname, e.evtevent, e.evtowner::regrole as dono, e.evtfoid::regproc as funcao, e.evtenabled
  from pg_catalog.pg_event_trigger e order by 1;
```

## V2: testes negativos (rodar sozinho, como postgres; termina SEMPRE em erro proposital, que desfaz tudo)
Revisão 2: este bloco já traz os complementos do QA (fase 1 e fase 1b), aprovados na revisão pré-aplicação. Roda num só bloco.

Como funciona:
- Cada caso roda num sub-bloco que sempre termina em exceção. O próprio caso é desfeito, inclusive o `SET LOCAL ROLE` e o contexto.
- O erro final desfaz a preparação, os usuários sintéticos em `auth.users` e o GRANT do R-12.
- A mensagem do erro final traz PASS, FAIL, NOT TESTED e o motivo de cada falha.
- Se não for possível inserir em `auth.users`, os casos que dependem de usuário saem como NOT TESTED, com o erro.
- **Casos:**
  - N1 a N13, do contrato;
  - X1 a X6, extras que cubro além do contrato: unicidade, FK e NOT NULL de `auth_user_id`, mais dois casos entre igrejas e o trigger de `updated_at`;
  - R1 a R10, do contrato. O R4h confirma que o UPDATE permitido funciona como `mescala_app`, com o trigger, sem EXECUTE na função de trigger;
  - complementos do QA (fase 1 e fase 1b):
    - QP1 a QP9: caminho feliz como `mescala_app` (INSERT e UPDATE permitidos; fluxo da CHURCH-001 num só comando; trigger de `updated_at`). Mostram que os 42501 do R1 e do R3 vêm do RLS, não de grant ausente;
    - QM1 a QM5: promoção a segundo OWNER (23505); UPDATE de `created_at`, `updated_at` ou de chave, e upsert que muda chave (42501);
    - QM6 e QM7: INSERT em `audit_log` informando `occurred_at` ou `id` (42501; ARQ-F002-15). O R7a é o controle: as mesmas colunas, sem essas duas, passam;
    - QC1 a QC4: contexto incompleto ou malformado e igreja sem `id` (42501; 22P02);
    - QD1 a QD7: como `mescala_app`, DDL em trigger, desligar RLS, `session_replication_role`, CREATE e CREATE POLICY (42501); como `postgres`, `TRUNCATE … CASCADE` (P0001);
    - QA1 e QA2: `service_role` e `authenticator` (42501; o QA2 pode sair NOT TESTED);
    - QT1a, QT1b, QT2, QT3 e QT4: no contexto da igreja A, INSERT com ministério, vínculo, nome de função ou habilitação que existem na igreja B, inclusive com `ON CONFLICT DO NOTHING`. Sempre 23503, nunca 23505 nem 0 linhas (ARQ-F002-14; F002-QA-01). O QT1b (usuário sem vínculo no ministério da igreja B) é o par de comparação do QT1a;
    - QI2: "Recepção" e "RECEPÇÃO" no mesmo escopo (23505; DATA-DEC-013 com letras acentuadas; R-17 e V0.4);
    - QI3 e QI4: registro, não reprovam a feature. JSON `null` em `before_data` (RD) e CREATE em `public` como `mescala_app`.

```sql
do $v2$
declare
  k text[] := array[
    '{aA}', '{aB}', '{aC}', '{aX}',
    '{uA}', '{uB}', '{uC}',
    '{cA}', '{cB}', '{cC}', '{cX}',
    '{mA1}', '{mA2}', '{mB1}',
    '{mmA1}', '{mmA2}', '{mmB1}',
    '{fA1}', '{fA2}', '{fB1}',
    '{lA}', '{lB}'];
  v text[] := array[
    '00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-0000000000a2',
    '00000000-0000-4000-8000-0000000000a3', '00000000-0000-4000-8000-0000000000af',
    '00000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-0000000000b2',
    '00000000-0000-4000-8000-0000000000b3',
    '00000000-0000-4000-8000-0000000000c1', '00000000-0000-4000-8000-0000000000c2',
    '00000000-0000-4000-8000-0000000000c3', '00000000-0000-4000-8000-0000000000cf',
    '00000000-0000-4000-8000-0000000000d1', '00000000-0000-4000-8000-0000000000d2',
    '00000000-0000-4000-8000-0000000000d3',
    '00000000-0000-4000-8000-0000000000e1', '00000000-0000-4000-8000-0000000000e2',
    '00000000-0000-4000-8000-0000000000e3',
    '00000000-0000-4000-8000-0000000000f1', '00000000-0000-4000-8000-0000000000f2',
    '00000000-0000-4000-8000-0000000000f3',
    '00000000-0000-4000-8000-000000000011', '00000000-0000-4000-8000-000000000012'];
  fix1 text[] := array[
    $s$insert into mescala.churches (id, name, status) values ({cA}, 'Igreja A (V2)', 'ATIVO'), ({cB}, 'Igreja B (V2)', 'ATIVO')$s$,
    $s$insert into mescala.churches (id, name, status, created_at, updated_at) values ({cC}, 'Igreja C (V2)', 'ATIVO', '2000-01-01 00:00:00+00', '2000-01-01 00:00:00+00')$s$,
    $s$insert into mescala.ministries (id, church_id, name, status) values ({mA1}, {cA}, 'Louvor', 'ATIVO'), ({mA2}, {cA}, 'Midia', 'ATIVO'), ({mB1}, {cB}, 'Louvor', 'ATIVO')$s$,
    $s$insert into mescala.ministry_functions (id, church_id, ministry_id, name, status) values ({fA1}, {cA}, {mA1}, 'Vocal', 'ATIVO'), ({fA2}, {cA}, {mA2}, 'Camera', 'ATIVO'), ({fB1}, {cB}, {mB1}, 'Vocal', 'ATIVO')$s$];
  fix2 text[] := array[
    $s$insert into auth.users (id, aud, role, email) values ({aA}, 'authenticated', 'authenticated', 'v2-a@verificacao.invalid'), ({aB}, 'authenticated', 'authenticated', 'v2-b@verificacao.invalid'), ({aC}, 'authenticated', 'authenticated', 'v2-c@verificacao.invalid')$s$,
    $s$insert into mescala.users (id, auth_user_id) values ({uA}, {aA}), ({uB}, {aB}), ({uC}, {aC})$s$,
    $s$insert into mescala.church_memberships (church_id, user_id, role, status) values ({cA}, {uA}, 'OWNER', 'ATIVO'), ({cB}, {uB}, 'OWNER', 'ATIVO'), ({cA}, {uB}, 'MEMBER', 'ATIVO')$s$,
    $s$insert into mescala.ministry_memberships (id, church_id, ministry_id, user_id, role, status) values ({mmA1}, {cA}, {mA1}, {uA}, 'LEADER', 'ATIVO'), ({mmA2}, {cA}, {mA2}, {uA}, 'MEMBER', 'ATIVO'), ({mmB1}, {cB}, {mB1}, {uB}, 'LEADER', 'ATIVO')$s$,
    $s$insert into mescala.ministry_member_functions (church_id, ministry_id, ministry_membership_id, ministry_function_id) values ({cA}, {mA1}, {mmA1}, {fA1}), ({cB}, {mB1}, {mmB1}, {fB1})$s$,
    $s$insert into mescala.audit_log (id, church_id, actor_user_id, action, entity_type, entity_id, after_data) values ({lA}, {cA}, {uA}, 'V2_FIXTURE', 'churches', {cA}, '{}'::jsonb), ({lB}, {cB}, {uB}, 'V2_FIXTURE', 'churches', {cB}, '{}'::jsonb)$s$];
  c record;
  i int;
  s text;
  q text;
  cc text;
  cu text;
  phase text;
  got text;
  txt text;
  nrows bigint;
  st text;
  msg text;
  outcome text;
  users_ok boolean := false;
  users_err text := '';
  grant_err text := '';
  pass_ids text[] := '{}';
  fail_lines text[] := '{}';
  nt_lines text[] := '{}';
begin
  if current_user <> 'postgres' then
    raise exception 'V2: execute como postgres (current_user = %). Nada foi alterado.', current_user;
  end if;

  -- Preparação 1: igrejas, ministérios e funções (não dependem de auth.users)
  begin
    foreach s in array fix1 loop
      for i in 1 .. array_length(k, 1) loop
        s := replace(s, k[i], quote_literal(v[i]));
      end loop;
      execute s;
    end loop;
  exception when others then
    get stacked diagnostics st = returned_sqlstate, msg = message_text;
    raise exception 'V2 ABORTADA na preparação 1 (% %). Nada persistiu.', st, msg;
  end;

  -- Preparação 2: usuários sintéticos e dados que dependem deles
  begin
    foreach s in array fix2 loop
      for i in 1 .. array_length(k, 1) loop
        s := replace(s, k[i], quote_literal(v[i]));
      end loop;
      execute s;
    end loop;
    users_ok := true;
  exception when others then
    get stacked diagnostics st = returned_sqlstate, msg = message_text;
    users_err := st || ' ' || msg;
  end;

  -- R-12: permite SET ROLE mescala_app ao usuário da sessão (desfeito pelo erro final)
  begin
    if not (select r.rolsuper from pg_catalog.pg_roles as r where r.rolname = session_user) then
      if pg_catalog.current_setting('server_version_num')::int >= 160000 then
        execute format('grant mescala_app to %I with inherit false, set true', session_user);
      else
        execute format('grant mescala_app to %I', session_user);
      end if;
    end if;
  exception when others then
    get stacked diagnostics st = returned_sqlstate, msg = message_text;
    grant_err := st || ' ' || msg;
  end;

  for c in
    select * from (values
      -- id, precisa de usuários, papel, contexto igreja, contexto usuário, esperado, NOT TESTED se, comando
      ('N1',   false, null, null, null, 'E:23503', null, $s$insert into mescala.ministry_functions (church_id, ministry_id, name, status) values ({cB}, {mA1}, 'Baixo', 'ATIVO')$s$),
      ('N2',   true,  null, null, null, 'E:23503', null, $s$insert into mescala.ministry_memberships (church_id, ministry_id, user_id, role, status) values ({cA}, {mA1}, {uC}, 'MEMBER', 'ATIVO')$s$),
      ('N3a',  true,  null, null, null, 'E:23503', null, $s$insert into mescala.ministry_member_functions (church_id, ministry_id, ministry_membership_id, ministry_function_id) values ({cA}, {mA1}, {mmA1}, {fA2})$s$),
      ('N3b',  true,  null, null, null, 'E:23503', null, $s$insert into mescala.ministry_member_functions (church_id, ministry_id, ministry_membership_id, ministry_function_id) values ({cA}, {mA2}, {mmA1}, {fA2})$s$),
      ('N4a',  true,  null, null, null, 'E:23505', null, $s$insert into mescala.church_memberships (church_id, user_id, role, status) values ({cA}, {uC}, 'OWNER', 'ATIVO')$s$),
      ('N4b',  true,  null, null, null, 'E:23505', null, $s$insert into mescala.church_memberships (church_id, user_id, role, status) values ({cA}, {uC}, 'OWNER', 'INATIVO')$s$),
      ('N4c',  true,  null, null, null, 'OK',      null, $s$insert into mescala.church_memberships (church_id, user_id, role, status) values ({cC}, {uA}, 'OWNER', 'ATIVO')$s$),
      ('N5',   true,  null, null, null, 'E:23505', null, $s$insert into mescala.church_memberships (church_id, user_id, role, status) values ({cA}, {uA}, 'MEMBER', 'ATIVO')$s$),
      ('N6',   true,  null, null, null, 'E:23505', null, $s$insert into mescala.ministry_memberships (church_id, ministry_id, user_id, role, status) values ({cA}, {mA1}, {uA}, 'MEMBER', 'ATIVO')$s$),
      ('N7a',  false, null, null, null, 'E:23505', null, $s$insert into mescala.ministries (church_id, name, status) values ({cA}, 'LOUVOR', 'ATIVO')$s$),
      ('N7b',  false, null, null, null, 'E:23505', null, $s$insert into mescala.ministries (church_id, name, status) values ({cA}, 'louvor', 'INATIVO')$s$),
      ('N7c',  false, null, null, null, 'OK',      null, $s$insert into mescala.ministries (church_id, name, status) values ({cB}, 'Midia', 'ATIVO')$s$),
      ('N8a',  false, null, null, null, 'E:23505', null, $s$insert into mescala.ministry_functions (church_id, ministry_id, name, status) values ({cA}, {mA1}, 'VOCAL', 'ATIVO')$s$),
      ('N8b',  false, null, null, null, 'OK',      null, $s$insert into mescala.ministry_functions (church_id, ministry_id, name, status) values ({cA}, {mA2}, 'Vocal', 'ATIVO')$s$),
      ('N9a',  true,  null, null, null, 'E:23514', null, $s$insert into mescala.church_memberships (church_id, user_id, role, status) values ({cA}, {uC}, 'owner', 'ATIVO')$s$),
      ('N9b',  true,  null, null, null, 'E:23514', null, $s$insert into mescala.church_memberships (church_id, user_id, role, status) values ({cA}, {uC}, 'LEADER', 'ATIVO')$s$),
      ('N9c',  true,  null, null, null, 'E:23514', null, $s$insert into mescala.ministry_memberships (church_id, ministry_id, user_id, role, status) values ({cA}, {mA1}, {uB}, 'OWNER', 'ATIVO')$s$),
      ('N9d',  true,  null, null, null, 'E:23514', null, $s$insert into mescala.ministry_memberships (church_id, ministry_id, user_id, role, status) values ({cA}, {mA1}, {uB}, 'ADMIN', 'ATIVO')$s$),
      ('N9e',  true,  null, null, null, 'E:23514', null, $s$insert into mescala.church_memberships (church_id, user_id, role, status) values ({cA}, {uC}, 'MEMBER', 'SUSPENSO')$s$),
      ('N9f',  false, null, null, null, 'E:23514', null, $s$insert into mescala.churches (name, status) values ('Igreja N9', 'ATIVA')$s$),
      ('N9g',  false, null, null, null, 'E:23514', null, $s$insert into mescala.churches (name, status) values ('Igreja N9', 'ativo')$s$),
      ('N9h',  false, null, null, null, 'E:23514', null, $s$insert into mescala.ministries (church_id, name, status) values ({cA}, 'Recepcao', 'ARQUIVADO')$s$),
      ('N9i',  false, null, null, null, 'E:23514', null, $s$insert into mescala.ministry_functions (church_id, ministry_id, name, status) values ({cA}, {mA1}, 'Teclado', 'INATIVA')$s$),
      ('N10a', false, null, null, null, 'E:23514', null, $s$insert into mescala.churches (name, status) values ('', 'ATIVO')$s$),
      ('N10b', false, null, null, null, 'E:23514', null, $s$insert into mescala.ministries (church_id, name, status) values ({cA}, '   ', 'ATIVO')$s$),
      ('N10c', false, null, null, null, 'E:23514', null, $s$insert into mescala.ministry_functions (church_id, ministry_id, name, status) values ({cA}, {mA1}, ' Teclado', 'ATIVO')$s$),
      ('N10d', false, null, null, null, 'E:23514', null, $s$insert into mescala.ministries (church_id, name, status) values ({cA}, 'Teclado ', 'ATIVO')$s$),
      ('N10e', false, null, null, null, 'E:23502', null, $s$insert into mescala.churches (name, status) values (null, 'ATIVO')$s$),
      ('N11a', false, null, null, null, 'E:23503', null, $s$delete from mescala.churches where id = {cA}$s$),
      ('N11b', true,  null, null, null, 'E:23503', '42501', $s$delete from auth.users where id = {aA}$s$),
      ('N12a', true,  null, null, null, 'E:P0001', null, $s$update mescala.audit_log set action = 'ALTERADO' where id = {lA}$s$),
      ('N12b', true,  null, null, null, 'E:P0001', null, $s$delete from mescala.audit_log where id = {lA}$s$),
      ('N12c', false, null, null, null, 'E:P0001', null, $s$truncate mescala.audit_log$s$),
      ('N13',  false, null, null, null, 'E:23514', null, $s$insert into mescala.audit_log (church_id, actor_user_id, action, entity_type, entity_id) values ({cA}, {uA}, 'V2', 'churches', {cA})$s$),
      ('X1',   true,  null, null, null, 'E:23505', null, $s$insert into mescala.users (auth_user_id) values ({aA})$s$),
      ('X2',   false, null, null, null, 'E:23503', null, $s$insert into mescala.users (auth_user_id) values ({aX})$s$),
      ('X3',   false, null, null, null, 'E:23502', null, $s$insert into mescala.users (auth_user_id) values (null)$s$),
      ('X4',   true,  null, null, null, 'E:23503', null, $s$insert into mescala.ministry_memberships (church_id, ministry_id, user_id, role, status) values ({cB}, {mA1}, {uB}, 'MEMBER', 'ATIVO')$s$),
      ('X5',   true,  null, null, null, 'E:23503', null, $s$insert into mescala.ministry_member_functions (church_id, ministry_id, ministry_membership_id, ministry_function_id) values ({cB}, {mA2}, {mmA2}, {fA2})$s$),
      ('X6',   false, null, null, null, 'V:true',  null, $s$with u as (update mescala.churches set name = 'Igreja C (V2)' where id = {cC} returning updated_at) select (select updated_at from u) > timestamptz '2000-01-01 00:00:00+00'$s$),
      ('R1a',  false, 'mescala_app', null, null, 'V:churches=0;church_memberships=0;ministries=0;ministry_memberships=0;ministry_functions=0;ministry_member_functions=0', null, $s$select format('churches=%s;church_memberships=%s;ministries=%s;ministry_memberships=%s;ministry_functions=%s;ministry_member_functions=%s', (select count(*) from mescala.churches), (select count(*) from mescala.church_memberships), (select count(*) from mescala.ministries), (select count(*) from mescala.ministry_memberships), (select count(*) from mescala.ministry_functions), (select count(*) from mescala.ministry_member_functions))$s$),
      ('R1b',  false, 'mescala_app', null, null, 'E:42501', null, $s$insert into mescala.ministries (church_id, name, status) values ({cA}, 'R1', 'ATIVO')$s$),
      ('R1c',  false, 'mescala_app', null, null, 'E:42501', null, $s$insert into mescala.churches (id, name, status) values ({cX}, 'Igreja R1', 'ATIVO')$s$),
      ('R1d',  false, 'mescala_app', null, null, 'V:true', null, $s$select mescala.context_church_id() is null and mescala.context_user_id() is null$s$),
      ('R2a',  false, 'mescala_app', '{cA}', '{uA}', 'V:churches=1/0;ministries=2/0;ministry_functions=2/0', null, $s$select format('churches=%s/%s;ministries=%s/%s;ministry_functions=%s/%s', (select count(*) from mescala.churches where id = {cA}), (select count(*) from mescala.churches where id <> {cA}), (select count(*) from mescala.ministries where church_id = {cA}), (select count(*) from mescala.ministries where church_id <> {cA}), (select count(*) from mescala.ministry_functions where church_id = {cA}), (select count(*) from mescala.ministry_functions where church_id <> {cA}))$s$),
      ('R2b',  true,  'mescala_app', '{cA}', '{uA}', 'V:church_memberships=2/0;ministry_memberships=2/0;ministry_member_functions=1/0', null, $s$select format('church_memberships=%s/%s;ministry_memberships=%s/%s;ministry_member_functions=%s/%s', (select count(*) from mescala.church_memberships where church_id = {cA}), (select count(*) from mescala.church_memberships where church_id <> {cA}), (select count(*) from mescala.ministry_memberships where church_id = {cA}), (select count(*) from mescala.ministry_memberships where church_id <> {cA}), (select count(*) from mescala.ministry_member_functions where church_id = {cA}), (select count(*) from mescala.ministry_member_functions where church_id <> {cA}))$s$),
      ('R2c',  false, 'mescala_app', '{cB}', '{uB}', 'V:churches=1/0;ministries=1/0;ministry_functions=1/0', null, $s$select format('churches=%s/%s;ministries=%s/%s;ministry_functions=%s/%s', (select count(*) from mescala.churches where id = {cB}), (select count(*) from mescala.churches where id <> {cB}), (select count(*) from mescala.ministries where church_id = {cB}), (select count(*) from mescala.ministries where church_id <> {cB}), (select count(*) from mescala.ministry_functions where church_id = {cB}), (select count(*) from mescala.ministry_functions where church_id <> {cB}))$s$),
      ('R3a',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$insert into mescala.ministries (church_id, name, status) values ({cB}, 'R3', 'ATIVO')$s$),
      ('R3b',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$insert into mescala.ministry_functions (church_id, ministry_id, name, status) values ({cB}, {mB1}, 'R3', 'ATIVO')$s$),
      ('R3c',  true,  'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$insert into mescala.church_memberships (church_id, user_id, role, status) values ({cB}, {uA}, 'MEMBER', 'ATIVO')$s$),
      ('R3d',  true,  'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$insert into mescala.ministry_memberships (church_id, ministry_id, user_id, role, status) values ({cB}, {mB1}, {uA}, 'MEMBER', 'ATIVO')$s$),
      ('R3e',  true,  'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$insert into mescala.ministry_member_functions (church_id, ministry_id, ministry_membership_id, ministry_function_id) values ({cB}, {mB1}, {mmB1}, {fB1})$s$),
      ('R4a',  false, 'mescala_app', '{cA}', '{uA}', 'R:0', null, $s$update mescala.ministries set name = 'Invasao' where id = {mB1}$s$),
      ('R4b',  true,  'mescala_app', '{cA}', '{uA}', 'R:0', null, $s$update mescala.church_memberships set status = 'INATIVO' where church_id = {cB}$s$),
      ('R4c',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$update mescala.ministries set church_id = {cB} where id = {mA1}$s$),
      ('R4d',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$update mescala.ministry_functions set ministry_id = {mA2} where id = {fA1}$s$),
      ('R4e',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$update mescala.church_memberships set user_id = {uC} where church_id = {cA}$s$),
      ('R4f',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$update mescala.churches set id = {cX} where id = {cA}$s$),
      ('R4g',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$update mescala.ministry_member_functions set ministry_function_id = {fA2}$s$),
      ('R4h',  false, 'mescala_app', '{cA}', '{uA}', 'R:1', null, $s$update mescala.ministries set name = 'Louvor A' where id = {mA1}$s$),
      ('R6a',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$select count(*) from mescala.users$s$),
      ('R6b',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$insert into mescala.users (auth_user_id) values ({aA})$s$),
      ('R6c',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$update mescala.users set auth_user_id = {aB}$s$),
      ('R7a',  true,  'mescala_app', '{cA}', '{uA}', 'OK', null, $s$insert into mescala.audit_log (church_id, actor_user_id, action, entity_type, entity_id, after_data) values ({cA}, {uA}, 'V2_TESTE', 'churches', {cA}, '{}'::jsonb)$s$),
      ('R7b',  true,  'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$insert into mescala.audit_log (church_id, actor_user_id, action, entity_type, entity_id, after_data) values ({cA}, {uB}, 'V2_TESTE', 'churches', {cA}, '{}'::jsonb)$s$),
      ('R7c',  true,  'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$insert into mescala.audit_log (church_id, actor_user_id, action, entity_type, entity_id, after_data) values ({cB}, {uA}, 'V2_TESTE', 'churches', {cB}, '{}'::jsonb)$s$),
      ('R7d',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$select count(*) from mescala.audit_log$s$),
      ('R7e',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$update mescala.audit_log set action = 'ALTERADO'$s$),
      ('R8a',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$insert into mescala.churches (id, name, status) values ({cX}, 'Igreja X (V2)', 'ATIVO')$s$),
      ('R8b',  false, 'mescala_app', '{cA}', '{uA}', 'R:0', null, $s$update mescala.churches set name = 'Invasao' where id = {cB}$s$),
      ('R8c',  false, 'mescala_app', '{cX}', '{uA}', 'OK', null, $s$insert into mescala.churches (id, name, status) values ({cX}, 'Igreja X (V2)', 'ATIVO')$s$),
      ('R9a',  false, 'mescala_app', 'nao-e-uuid', '{uA}', 'E:22P02', null, $s$select count(*) from mescala.churches$s$),
      ('R9b',  false, 'mescala_app', 'nao-e-uuid', '{uA}', 'E:22P02', null, $s$select mescala.context_church_id()$s$),
      ('R9c',  false, 'mescala_app', '{cA}', 'nao-e-uuid', 'E:22P02', null, $s$select mescala.context_user_id()$s$),
      ('R10a-anon',          false, 'anon',          '{cA}', '{uA}', 'E:42501', null, $s$select count(*) from mescala.churches$s$),
      ('R10b-anon',          false, 'anon',          '{cA}', '{uA}', 'E:42501', null, $s$select mescala.context_church_id()$s$),
      ('R10a-authenticated', false, 'authenticated', '{cA}', '{uA}', 'E:42501', null, $s$select count(*) from mescala.churches$s$),
      ('R10b-authenticated', false, 'authenticated', '{cA}', '{uA}', 'E:42501', null, $s$select mescala.context_church_id()$s$),
      ('R10a-service_role',  false, 'service_role',  '{cA}', '{uA}', 'E:42501', null, $s$select count(*) from mescala.churches$s$),
      ('R10b-service_role',  false, 'service_role',  '{cA}', '{uA}', 'E:42501', null, $s$select mescala.context_church_id()$s$),
      -- ===== Complementos do QA (fase 1 e fase 1b), aprovados na revisão pré-aplicação =====
      -- QP: caminho feliz como mescala_app; provam que os 42501 do R1 e do R3 vêm do RLS, não de grant ausente
      ('QP1',  false, 'mescala_app', '{cA}', '{uA}', 'OK',      null, $s$insert into mescala.ministries (church_id, name, status) values ({cA}, 'Recepcao', 'ATIVO')$s$),
      ('QP2',  false, 'mescala_app', '{cA}', '{uA}', 'OK',      null, $s$insert into mescala.ministry_functions (church_id, ministry_id, name, status) values ({cA}, {mA1}, 'Teclado', 'ATIVO')$s$),
      ('QP3',  true,  'mescala_app', '{cA}', '{uA}', 'OK',      null, $s$insert into mescala.church_memberships (church_id, user_id, role, status) values ({cA}, {uC}, 'MEMBER', 'ATIVO')$s$),
      ('QP4',  true,  'mescala_app', '{cA}', '{uA}', 'OK',      null, $s$insert into mescala.ministry_memberships (church_id, ministry_id, user_id, role, status) values ({cA}, {mA1}, {uB}, 'MEMBER', 'ATIVO')$s$),
      ('QP5',  true,  'mescala_app', '{cA}', '{uA}', 'OK',      null, $s$insert into mescala.ministry_member_functions (church_id, ministry_id, ministry_membership_id, ministry_function_id) values ({cA}, {mA2}, {mmA2}, {fA2})$s$),
      ('QP6',  true,  'mescala_app', '{cX}', '{uA}', 'OK',      null, $s$with c as (insert into mescala.churches (id, name, status) values ({cX}, 'Igreja X (QP6)', 'ATIVO')), m as (insert into mescala.church_memberships (church_id, user_id, role, status) values ({cX}, {uA}, 'OWNER', 'ATIVO')) insert into mescala.audit_log (church_id, actor_user_id, action, entity_type, entity_id, after_data) values ({cX}, {uA}, 'V2_QP6', 'churches', {cX}, '{}'::jsonb)$s$),
      ('QP7',  false, 'mescala_app', '{cA}', '{uA}', 'R:1',     null, $s$update mescala.churches set status = 'INATIVO', ended_at = pg_catalog.now() where id = {cA}$s$),
      ('QP8',  true,  'mescala_app', '{cA}', '{uA}', 'R:1',     null, $s$update mescala.church_memberships set role = 'ADMIN' where church_id = {cA} and user_id = {uB}$s$),
      ('QP9',  false, 'mescala_app', '{cC}', '{uA}', 'V:true',  null, $s$with u as (update mescala.churches set name = 'Igreja C (QP9)' where id = {cC} returning updated_at) select (select updated_at from u) > timestamptz '2000-01-01 00:00:00+00'$s$),
      -- QM: escalada e mass assignment; QM6 e QM7: id e occurred_at do audit_log vêm só do banco (ARQ-F002-15; o R7a é o controle)
      ('QM1',  true,  'mescala_app', '{cA}', '{uA}', 'E:23505', null, $s$update mescala.church_memberships set role = 'OWNER' where church_id = {cA} and user_id = {uB}$s$),
      ('QM2',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$update mescala.ministries set created_at = pg_catalog.now() where id = {mA1}$s$),
      ('QM3',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$update mescala.churches set updated_at = timestamptz '2000-01-01 00:00:00+00' where id = {cA}$s$),
      ('QM4',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$update mescala.ministries set church_id = church_id where id = {mA1}$s$),
      ('QM5',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$insert into mescala.ministries (church_id, name, status) values ({cA}, 'QM5', 'ATIVO') on conflict (id) do update set church_id = excluded.church_id$s$),
      ('QM6',  true,  'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$insert into mescala.audit_log (church_id, actor_user_id, action, entity_type, entity_id, after_data, occurred_at) values ({cA}, {uA}, 'V2_QM6', 'churches', {cA}, '{}'::jsonb, timestamptz '2000-01-01 00:00:00+00')$s$),
      ('QM7',  true,  'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$insert into mescala.audit_log (id, church_id, actor_user_id, action, entity_type, entity_id, after_data) values (pg_catalog.gen_random_uuid(), {cA}, {uA}, 'V2_QM7', 'churches', {cA}, '{}'::jsonb)$s$),
      -- QC: contexto incompleto ou malformado (falha fechada)
      ('QC1',  true,  'mescala_app', '{cA}', null,   'E:42501', null, $s$insert into mescala.audit_log (church_id, actor_user_id, action, entity_type, entity_id, after_data) values ({cA}, {uA}, 'V2_QC1', 'churches', {cA}, '{}'::jsonb)$s$),
      ('QC2',  true,  'mescala_app', null,   '{uA}', 'E:42501', null, $s$insert into mescala.audit_log (church_id, actor_user_id, action, entity_type, entity_id, after_data) values ({cA}, {uA}, 'V2_QC2', 'churches', {cA}, '{}'::jsonb)$s$),
      ('QC3',  false, 'mescala_app', ' ',    '{uA}', 'E:22P02', null, $s$select count(*) from mescala.churches$s$),
      ('QC4',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$insert into mescala.churches (name, status) values ('Igreja sem id (QC4)', 'ATIVO')$s$),
      -- QD: o backend não desliga proteções (não é dono, não tem CREATE); QD7: nem o postgres esvazia o audit_log por TRUNCATE CASCADE
      ('QD1',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$alter table mescala.audit_log disable trigger audit_log_prevent_update_delete$s$),
      ('QD2',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$drop trigger audit_log_prevent_truncate on mescala.audit_log$s$),
      ('QD3',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$alter table mescala.churches disable row level security$s$),
      ('QD4',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$set local session_replication_role = replica$s$),
      ('QD5',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$create table mescala.v2_qa_probe (x int)$s$),
      ('QD6',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$create policy v2_qa_probe on mescala.churches for select to mescala_app using (true)$s$),
      ('QD7',  false, null,          null,   null,   'E:P0001', null, $s$truncate mescala.churches cascade$s$),
      -- QA: papéis da Data API (o service_role tem BYPASSRLS: a barreira é só a falta de USAGE e de grants)
      ('QA1',  false, 'service_role',  '{cA}', '{uA}', 'E:42501', null, $s$insert into mescala.churches (id, name, status) values ({cX}, 'QA1', 'ATIVO')$s$),
      ('QA2',  false, 'authenticator', '{cA}', '{uA}', 'E:42501', null, $s$select count(*) from mescala.churches$s$),
      -- QT: no contexto da igreja A, ministério, vínculo, nome ou habilitação da igreja B dão 23503, nunca 23505 nem 0 linhas (ARQ-F002-14; F002-QA-01)
      ('QT1a', true,  'mescala_app', '{cA}', '{uA}', 'E:23503', null, $s$insert into mescala.ministry_memberships (church_id, ministry_id, user_id, role, status) values ({cA}, {mB1}, {uB}, 'MEMBER', 'ATIVO')$s$),
      ('QT1b', true,  'mescala_app', '{cA}', '{uA}', 'E:23503', null, $s$insert into mescala.ministry_memberships (church_id, ministry_id, user_id, role, status) values ({cA}, {mB1}, {uA}, 'MEMBER', 'ATIVO')$s$),
      ('QT2',  false, 'mescala_app', '{cA}', '{uA}', 'E:23503', null, $s$insert into mescala.ministry_functions (church_id, ministry_id, name, status) values ({cA}, {mB1}, 'Vocal', 'ATIVO')$s$),
      ('QT3',  true,  'mescala_app', '{cA}', '{uA}', 'E:23503', null, $s$insert into mescala.ministry_member_functions (church_id, ministry_id, ministry_membership_id, ministry_function_id) values ({cA}, {mA1}, {mmB1}, {fB1})$s$),
      ('QT4',  true,  'mescala_app', '{cA}', '{uA}', 'E:23503', null, $s$insert into mescala.ministry_memberships (church_id, ministry_id, user_id, role, status) values ({cA}, {mB1}, {uB}, 'MEMBER', 'ATIVO') on conflict do nothing$s$),
      -- QI2: DATA-DEC-013 com letras acentuadas (R-17; V0.4). OK aqui pede decisão do Arquiteto
      ('QI2',  false, null, null, null, 'E:23505', null, $s$insert into mescala.ministries (church_id, name, status) values ({cA}, 'Recepção', 'ATIVO'), ({cA}, 'RECEPÇÃO', 'ATIVO')$s$),
      -- QI3 e QI4: registro, não reprovam a feature (QI3: JSON null passa no CHECK, RD; QI4: OK é achado de plataforma para a FOUNDATION-003)
      ('QI3',  true,  null, null, null, 'OK',      null, $s$insert into mescala.audit_log (church_id, actor_user_id, action, entity_type, entity_id, before_data) values ({cA}, {uA}, 'V2_QI3', 'churches', {cA}, 'null'::jsonb)$s$),
      ('QI4',  false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, $s$create table public.v2_qa_probe (x int)$s$)
    ) as t(id, nu, r, cc, cu, e, nt, q)
    union all
    select 'R5-' || op.n || '-' || tb.n, false, 'mescala_app', '{cA}', '{uA}', 'E:42501', null, format(op.f, tb.n)
      from (values ('users'), ('churches'), ('church_memberships'), ('ministries'), ('ministry_memberships'),
                   ('ministry_functions'), ('ministry_member_functions'), ('audit_log')) as tb(n)
     cross join (values ('delete', 'delete from mescala.%I'), ('truncate', 'truncate mescala.%I')) as op(n, f)
  loop
    if c.nu and not users_ok then
      nt_lines := nt_lines || format('%s (sem usuários sintéticos: %s)', c.id, users_err);
      continue;
    end if;

    q := c.q;
    cc := coalesce(c.cc, '');
    cu := coalesce(c.cu, '');
    for i in 1 .. array_length(k, 1) loop
      q := replace(q, k[i], quote_literal(v[i]));
      cc := replace(cc, k[i], v[i]);
      cu := replace(cu, k[i], v[i]);
    end loop;

    phase := 'preparacao';
    begin
      if c.r is not null then
        execute format('set local role %I', c.r);
      end if;
      perform pg_catalog.set_config('mescala.current_church_id', cc, true);
      perform pg_catalog.set_config('mescala.current_user_id', cu, true);
      phase := 'comando';
      if c.e like 'V:%' then
        execute q into txt;
        got := 'V:' || coalesce(txt, '<null>');
      elsif c.e like 'R:%' then
        execute q;
        get diagnostics nrows = row_count;
        got := 'R:' || nrows;
      else
        execute q;
        got := 'OK';
      end if;
      raise exception using errcode = 'MS999', message = got;   -- desfaz o caso
    exception when others then
      get stacked diagnostics st = returned_sqlstate, msg = message_text;
      outcome := case when st = 'MS999' then msg else 'E:' || st end;
      if phase = 'preparacao' then
        nt_lines := nt_lines || format('%s (preparação: %s %s; grant: %s)', c.id, st, msg, grant_err);
      elsif outcome = c.e then
        pass_ids := pass_ids || c.id;
      elsif c.nt is not null and st = c.nt then
        nt_lines := nt_lines || format('%s (%s %s)', c.id, st, msg);
      else
        fail_lines := fail_lines || format('%s: esperado %s, obtido %s (%s)', c.id, c.e, outcome, msg);
      end if;
    end;
  end loop;

  raise exception 'V2 - ERRO PROPOSITAL, TUDO FOI DESFEITO. PASS=% FAIL=% NOT_TESTED=% || FALHAS: % || NAO TESTADOS: % || PASS: %',
    coalesce(array_length(pass_ids, 1), 0),
    coalesce(array_length(fail_lines, 1), 0),
    coalesce(array_length(nt_lines, 1), 0),
    coalesce(nullif(array_to_string(fail_lines, ' | '), ''), 'nenhuma'),
    coalesce(nullif(array_to_string(nt_lines, ' | '), ''), 'nenhum'),
    array_to_string(pass_ids, ', ');
end
$v2$;
```

**Resultado esperado do V2:** um único erro com `PASS=133 FAIL=0 NOT_TESTED=0`. São 133 casos: 34 N, 6 X, 56 R (16 deles do R5) e 37 do QA (9 QP, 7 QM, 4 QC, 7 QD, 2 QA, 5 QT, mais QI2, QI3 e QI4).
- Também aceito: `PASS=132 FAIL=0 NOT_TESTED=1`, quando o único NOT TESTED é o QA2 porque a sessão não assume `authenticator`.
- NOT TESTED só é aceitável com motivo:
  - sem inserção em `auth.users` (NT-06);
  - N11b com 42501 (sem DELETE em `auth.users`);
  - papel que a sessão não consegue assumir (R10, QA1, QA2, ou R-12).
- Como ler um FAIL nos complementos do QA:
  - QT1a, QT1b, QT2, QT3 ou QT4 com 23505 ou OK: a unicidade com `church_id` (ARQ-F002-14) não está no banco aplicado. É defeito e volta ao Analista;
  - QM6 ou QM7 com OK: o INSERT por coluna em `audit_log` (ARQ-F002-15) não está no banco aplicado. É defeito e volta ao Analista;
  - QI2 com OK: `lower()` não iguala maiúsculas acentuadas apesar do V0.4. `ARCHITECTURAL_DECISION_REQUIRED`: correção por migration nova antes da CHURCH-001 (revisão pré-aplicação, 3c);
  - QI3 diferente de OK, ou QI4 com OK: registro, não reprova (QI4 com OK é achado de plataforma para a FOUNDATION-003).
- Depois do V2, rodar o bloco B do QA (seção seguinte), sozinho. Depois do bloco B, rodar de novo, uma consulta por vez, V1.20, V1.13b, V1.13c e V1.11: 0 linhas de resíduo, participações idênticas às de antes do V2 e os 8 triggers com `tgenabled = O`.

## Bloco B do QA: plano administrativo (informativo; rodar sozinho, como postgres, depois do V2)
O que mede: se o dono (`postgres`) contorna a imutabilidade de `audit_log` com `session_replication_role = replica` (I1) ou com `DISABLE TRIGGER` (I2). É o risco residual R-16, do plano administrativo (R-15). O critério 11 vale para DML direto: CONTORNADO **não** reprova a feature.
- Termina sempre num erro proposital, que desfaz tudo, inclusive o `DISABLE TRIGGER` do I2.
- Devolver o texto completo da mensagem de erro (`V2-QA-INFO - ERRO PROPOSITAL, TUDO FOI DESFEITO. ...`).
- Resultado provável: I2 CONTORNADO; I1 depende da plataforma (o V1.23 mostra se `postgres` recebeu SET em `session_replication_role`).
- **Resultado no projeto oficial (2026-10-23):** I1 e I2 CONTORNADOS. O V1.23 não tem entrada de `session_replication_role` para `postgres`: o I1 passa por um mecanismo da plataforma fora do `pg_parameter_acl`, e a premissa da linha anterior não se confirmou. Ver o R-16 do contrato (fechamento).

```sql
do $info$
declare
  st  text;
  msg text;
  i1  text := 'nao executado';
  i2  text := 'nao executado';
begin
  if current_user <> 'postgres' then
    raise exception 'V2-QA-INFO: execute como postgres (current_user = %). Nada foi alterado.', current_user;
  end if;

  -- I1: o dono contorna o trigger de TRUNCATE com session_replication_role = replica?
  begin
    set local session_replication_role = replica;
    truncate mescala.audit_log;
    raise exception using errcode = 'MS999', message = 'CONTORNADO: TRUNCATE aceito com session_replication_role = replica';
  exception when others then
    get stacked diagnostics st = returned_sqlstate, msg = message_text;
    i1 := case when st = 'MS999' then msg else 'BLOQUEADO: ' || st || ' ' || msg end;
  end;

  -- I2: o dono desabilita o trigger e trunca?
  begin
    alter table mescala.audit_log disable trigger audit_log_prevent_truncate;
    truncate mescala.audit_log;
    raise exception using errcode = 'MS999', message = 'CONTORNADO: TRUNCATE aceito depois de DISABLE TRIGGER pelo dono';
  exception when others then
    get stacked diagnostics st = returned_sqlstate, msg = message_text;
    i2 := case when st = 'MS999' then msg else 'BLOQUEADO: ' || st || ' ' || msg end;
  end;

  raise exception 'V2-QA-INFO - ERRO PROPOSITAL, TUDO FOI DESFEITO. I1 (session_replication_role): % || I2 (DISABLE TRIGGER pelo dono): %', i1, i2;
end
$info$;
```

**Depois do bloco B:** rodar de novo, uma consulta por vez, o V1.11 (8 linhas, todas com `tgenabled = O`, o que mostra que o `DISABLE TRIGGER` do I2 foi desfeito) e o V1.20 (9 linhas, todas 0). Pelo A7 do contrato, repetir também o V1.13b e o V1.13c, que têm de sair idênticos aos de antes do V2.

**Execução** (nada disso foi executado por mim; o PO rodou o V0 em 2026-10-22 e aplicou e verificou em 2026-10-23, pelo SQL Editor; saídas em `docs/features/FOUNDATION-002-SAIDAS-PO.md`):
- aplicar as 9 migrations;
- rodar o V0 antes de aplicar, uma consulta por vez (com o V0.4); depois da aplicação, o V1 uma consulta por vez (V1.1 a V1.24), o V2 integrado sozinho, o bloco B do QA sozinho (informativo) e de novo V1.20, V1.13b, V1.13c e V1.11;
- conferir a Data API (A6).

Se a aplicação de algum arquivo falhar, ele não foi aplicado: devolver a mensagem para que eu corrija o próprio arquivo. Se uma migration já tiver sido aplicada com sucesso, ela não é mais editada: qualquer correção vira migration nova.
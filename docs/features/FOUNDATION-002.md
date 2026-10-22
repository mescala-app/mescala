# FOUNDATION-002 — Fundação de Persistência

> Emitido pelo Arquiteto (`arquiteto-mescala`) em 2026-10-22, a pedido do PO. Nada foi encaminhado aos executores.
> **Fontes normativas:**
> - ADR-002, ADR-003, DEC-02, DEC-04 (parte 1), DEC-05, DEC-08;
> - DEC-09 (DATA-DEC-001 a 023 e micro-decisões de 2026-10-22);
> - `05-REGRAS-DE-NEGOCIO`, `04-USUARIOS-E-PERMISSOES`, `dados/*`, `seguranca/*`.
>
> **Relatório de origem:** `docs/data/DATA-ARCHITECTURE-REPORT.md`, seções 5 a 7, 13 e 15.
> **Conteúdo deste arquivo:** ARCHITECT ANALYSIS, Feature Contract, Data Task, Backend Implementation Task, Organization Task, QA Contract, dependências e bloqueios.
> **Status: READY desde 2026-10-22.** Respostas do PO (aceitou as recomendações do Arquiteto):
> - **B-01:** schema dedicado = `mescala`.
> - **B-02:** status da Igreja = ATIVO, INATIVO.
> - **B-03** (para a FOUNDATION-004): contam como alocação "ativa" AGUARDANDO_CONFIRMACAO e CONFIRMADA (opção A).
> - **B-04:** opção A. `invitations` sai desta fundação e nasce com a feature de convites; as transições do convite ficam para o contrato dessa feature.
> - **Fase 4 autorizada** para a FOUNDATION-002: o Analista cria as migrations em `backend/supabase/migrations/`, sem aplicar. A aplicação pelo PO só acontece depois da revisão estática do QA e da revisão pré-aplicação do Arquiteto (ARQ-F002-11).
> - Decisões técnicas ARQ-F002-01 a 13: aceitas, sem veto.
> - Sequência combinada com o PO: o Analista começa já; o trecho do Desenvolvedor (seção 8: `backend/supabase/config.toml` e `backend/.gitignore`) espera o encerramento da AUTH-001, porque o contrato v2 da AUTH-001 exige `backend/.gitignore` sem diff.
> - **VERSÃO 2 (2026-10-22), emitida na revisão pré-aplicação (ARQ-F002-11):** marcadores trocados pelas respostas do PO; F002-QA-01 decidido (opção b, ARQ-F002-14); INSERT por coluna em `audit_log` (ARQ-F002-15); DIV-01 decidida (opção A, ARQ-F002-16); critério 11 lido como DML direto (R-16); riscos R-16 a R-19; Anexo A e QA Contract ajustados. ARQ-F002-14 a 16 são decisões técnicas: o PO pode vetá-las até o A3.

---

# ARCHITECT ANALYSIS

## 1. Entendimento da solicitação

**O que o PO pediu.** O contrato da fundação oficial de persistência. Ele cria, no projeto Supabase novo `vitqnyzuvrvkmnvshcpb` (que começa vazio), o schema oficial do Mescala por migrations versionadas em `backend/supabase/migrations/`. Inclui:
- tabelas, constraints e índices;
- RLS e policies;
- o papel de banco do backend e suas permissões;
- as funções estritamente necessárias;
- a estrutura `backend/supabase/` da Supabase CLI.

O cliente de banco do backend (DEC-04, parte 2) fica fora e vira feature própria.

**Que problema resolve.** Não existe banco oficial. Nenhuma feature que grava dados pode começar: AUTH-002, CHURCH-001 e as demais (ADR-002#Consequências).

**Ordem do ADR-002 (ponto 6 do pedido).** O ADR-002 diz: "após a fundação técnica, deverá ser estabelecida a fundação oficial de persistência antes das features que dependam do banco".
- A fundação técnica, FOUNDATION-001, está **encerrada**: ARCHITECT REVIEW APPROVED em 2026-10-19, commit `7f26d30`.
- **A persistência pode começar.** Isso também encerra o bloqueio 4 da seção 17 do relatório de dados.
- Faltavam só duas coisas, cumpridas em 2026-10-22 (cabeçalho):
  - as respostas a B-01 e B-02 (seção 12);
  - a autorização explícita da Fase 4 (`decisoes/PENDENCIAS`, "Autorização da Fase 4").

**Decomposição decidida (ARQ-F002-01).** O modelo da DEC-09 vira quatro entregas, e não uma só:

| Feature | Escopo | Bloqueio próprio |
|---|---|---|
| **FOUNDATION-002** (este contrato) | Base técnica do schema: schema dedicado, papel `mescala_app`, mecanismo de contexto, `updated_at`. Identidade e organização: `users`, `churches`, `church_memberships`, `ministries`, `ministry_memberships`, `ministry_functions`, `ministry_member_functions`. Auditoria: `audit_log`. RLS de isolamento dessas tabelas. Estrutura `backend/supabase/`. | B-01, B-02 |
| FOUNDATION-003 (proposta; ID a confirmar) | Cliente de banco do backend: DEC-04 parte 2, papel de login, conexão, transação com contexto, estratégia de banco de teste | DEC-04 parte 2 |
| FOUNDATION-004 (proposta; ID a confirmar) | `programs`, `program_ministries`, `schedules`, `allocations` e a tabela de impedimentos | B-03 |
| Convites (feature própria; ID a definir) | `invitations`, junto com o fluxo do convite | B-04 |

Por que separar:
1. **Granularidade.** São features pequenas e completas. A revisão estática de RLS, FKs compostas e grants de 8 tabelas já é uma unidade grande. Com 14 tabelas e o QA sem acesso ao banco, o risco de erro passaria despercebido sobe muito.
2. **Os bloqueios ficam isolados.**
   - B-03 (alocação "ativa") só afeta `allocations`.
   - B-04 (fluxo e papel do convite) só afeta `invitations`.
   - Sem a separação, travariam a base de que AUTH-002 e CHURCH-001 precisam.
3. **Os consumidores chegam em sequência.** O próximo trecho do roadmap (cliente de banco → AUTH-002 → AUTH-003 → CHURCH-001 → CHURCH-002) usa só o que a FOUNDATION-002 cria. Programação e escala só serão consumidas bem depois. Até lá, o mecanismo de contexto e RLS já terá sido exercitado com o cliente de banco real.
4. **A ordem 1–14 da seção 15 do relatório é preservada.** A FOUNDATION-004 continua a mesma sequência depois da FOUNDATION-002.

## 2. Brain consultada

| Grupo | Notas |
|---|---|
| Núcleo | `00-MOC-MESCALA`, `03-DOMINIO`, `05-REGRAS-DE-NEGOCIO`, `04-USUARIOS-E-PERMISSOES`, `02-ARQUITETURA` |
| Módulos | `IGREJAS`, `EQUIPES` (Ministérios), `MEMBROS`, `FUNCOES`, `PROGRAMACOES`, `ESCALAS`, `DISPONIBILIDADE` |
| Fluxos | `FLUXO-CADASTRO-IGREJA`, `FLUXO-EQUIPES`, `FLUXO-MEMBROS`, `FLUXO-PROGRAMACOES`, `FLUXO-ESCALAS`, `FLUXO-CONFIRMACAO`, `FLUXO-SUBSTITUICAO` |
| Dados | `dados/ENTIDADES`, `dados/RELACIONAMENTOS`, `dados/STATUS`, `dados/EVENTOS-DO-SISTEMA` |
| Segurança | `seguranca/ISOLAMENTO-DE-DADOS`, `AUTORIZACAO`, `AUTENTICACAO`, `AUDITORIA` |
| Técnico | `tecnico/BANCO-DE-DADOS`, `BACKEND`, `API`, `CONVENCOES` |
| Decisões e processo | `ADR-002`, `ADR-003`, `DEC-02`, `DEC-04`, `DEC-05`, `DEC-08`, `DEC-09`, `PENDENCIAS`, `features/FLUXO-DE-ENTREGA`, `features/FOUNDATION-001` |

Fora do vault, também li:
- `docs/data/DATA-ARCHITECTURE-REPORT.md` (seções 1, 2 a 7, 13 a 19);
- `docs/features/AUTH-001.md` (seções sobre AUTH-002/003, B7, B8 e dependências);
- `docs/features/FOUNDATION-001.md`;
- as definições em `.claude/agents/` (diff de alinhamento de 2026-10-22).

Estado do repositório:
- `backend/` tem só a FOUNDATION-001: `package.json`, `tsconfig.json`, `eslint.config.mjs`, `next.config.ts`, `.gitignore` e `src/app/api/health/route.ts`;
- `backend/supabase/` não existe;
- `supabase/` da raiz: `config.toml` com só `project_id = "fiurvpkieiorngshjric"`, mais `supabase/.temp/project-ref` de um vínculo antigo (é a divergência D4);
- Supabase CLI 2.109.1 instalada globalmente nesta máquina.

**Regras que o vault-brain derivou da DEC-09: conferência pedida pelo PO.**

| Regra | Origem na DEC-09 | Resultado |
|---|---|---|
| IGR-001 | DATA-DEC-007; "quem cria torna-se OWNER" vem do `FLUXO-CADASTRO-IGREJA` | Fiel |
| MEM-001 | DATA-DEC-010 (texto e impacto) | Fiel |
| MEM-002 | DATA-DEC-009 e DATA-DEC-008 | Fiel |
| MEM-003 | DATA-DEC-011, que manda registrar a regra legada | Fiel, transcrição literal |
| HIS-001 | DATA-DEC-012 e DATA-DEC-016 (e) | Fiel |
| ESC-005 | DATA-DEC-014 (texto e impacto) | Fiel |
| DIS-001 | DATA-DEC-017 e o complemento de 2026-10-22 | Fiel |
| Complementos de ESC-003 e ESC-004 | DATA-DEC-016 (2026-10-22) e DATA-DEC-015 | Fiel |

**Nenhuma regra vai além do que a DEC-09 decide. Nenhuma ARCHITECTURAL DIVERGENCE a reportar.**

## 3. Domínio proprietário

```text
Principal:    foundation (persistência; sem regra de negócio nova)
Secundários:  auth (users), church (churches, church_memberships),
              ministry (ministries, ministry_functions),
              member (ministry_memberships, ministry_member_functions),
              audit (audit_log)
```

A feature cria estrutura e mecanismos de proteção. Não cria comportamento de negócio, rota nem código TypeScript.

## 4. Dependências

| Item | Situação |
|---|---|
| FOUNDATION-001 | Encerrada (APPROVED 2026-10-19, `7f26d30`) |
| ADR-002 (persistência reproduzível por migrations) | Aceito |
| ADR-003 (Supabase Auth do projeto oficial; nada de autorização no token; nenhum segredo) | Aceito |
| DEC-04 parte 1 (local, CLI, aplicação manual) | Aceita |
| DEC-04 parte 2 (ferramenta de acesso) | Aberta. **Não bloqueia**: o mecanismo de contexto definido aqui funciona com qualquer cliente Postgres direto |
| DEC-05 (projeto `vitqnyzuvrvkmnvshcpb`, vazio) | Aceita. A região a confirmar é irrelevante para o schema |
| DEC-09 (modelo) | Aceita, com as lacunas da seção 12 |
| DEC-02 (Vitest) | Aceita. Não é usada nesta feature (seção 10) |
| DEC-08 (dependências transitivas) | Aceita. Nenhuma dependência npm muda |
| DEC-06 (provisionamento) e B8 da AUTH-001 (status do usuário) | Abertas. **Não bloqueiam**: os atributos e o status de `users` ficam para AUTH-002/003 (ARQ-F002-02) |
| Respostas B-01 e B-02 | Respondidas pelo PO em 2026-10-22: B-01 = `mescala`; B-02 = ATIVO, INATIVO |
| Autorização explícita da Fase 4 | Concedida pelo PO em 2026-10-22 |

## 5. Riscos e invariantes

### 5.1 Invariantes que o banco passa a garantir

| # | Invariante | Fonte |
|---|---|---|
| I-01 | Nada de uma igreja se liga a outra (FKs compostas por `church_id`). Nada é lido ou gravado fora do contexto da igreja (RLS) | SEC-001; relatório E1 |
| I-02 | Nada com histórico é apagado: toda FK com RESTRICT; nenhum CASCADE ou SET NULL; o backend não tem DELETE nem TRUNCATE | HIS-001; DATA-DEC-012 |
| I-03 | No máximo um OWNER por igreja (índice único parcial). "Pelo menos um" fica com o backend (a CHURCH-001 cria a igreja e o OWNER na mesma transação) | IGR-001; DATA-DEC-007 |
| I-04 | Um vínculo por (igreja, usuário) | DATA-DEC-006 |
| I-05 | Um vínculo por (ministério, usuário), com um papel | MEM-002; DATA-DEC-009 |
| I-06 | O vínculo com um ministério exige vínculo com a mesma igreja | Relatório E2; `FLUXO-MEMBROS` 1→3 |
| I-07 | A habilitação liga um vínculo e uma função do mesmo ministério | Relatório E3; ESC-002 (parte estrutural) |
| I-08 | Nome de ministério único na igreja, e de função único no ministério, sem diferenciar maiúsculas | DATA-DEC-013 |
| I-09 | `users` ↔ `auth.users` é 1:1, obrigatório e único. Nenhuma outra FK aponta para `auth.users` | DATA-DEC-019; ADR-003 |
| I-10 | Schema fora da Data API; só `mescala_app` tem acesso; sem BYPASSRLS; contexto por transação; falha fechada | DATA-DEC-020 |
| I-11 | `audit_log` só aceita inserção | DATA-DEC-021 |
| I-12 | Status e papéis em `text` + CHECK, com os valores da Brain em MAIÚSCULAS. As transições ficam no backend | DATA-DEC-016 A; DATA-DEC-018; `dados/STATUS` |
| I-13 | O schema oficial é o resultado das migrations; nada é feito à mão no banco | ADR-002#Persistência |
| I-14 | Nenhum segredo no repositório; nenhuma autorização a partir do token | ADR-003, itens 7 e 9 |
| I-15 | O legado fica intocado; sem migração de dados | DATA-DEC-022; DATA-DEC-023 (não se aplica) |
| I-16 | A FOUNDATION-001 continua intacta: lint, typecheck, build e `/api/health` | FOUNDATION-001 |

### 5.2 Análise de segurança

| Vetor | Tratamento |
|---|---|
| Autenticação | Não há nada em tempo de execução. Só a FK `users.auth_user_id` → `auth.users`. O token nunca chega ao banco |
| Autorização | O RLS faz isolamento de tenant. Papel + escopo (OWNER/ADMIN/LEADER/MEMBER) ficam no backend (`04-USUARIOS-E-PERMISSOES`; `seguranca/AUTORIZACAO`). Nenhuma policy usa cargo nem claim de token |
| IDOR | `church_id` em toda tabela de tenant + FKs compostas + RLS por contexto. O UUID não substitui autorização (relatório, seção 6). Toda unicidade alcançável por INSERT inclui `church_id` (ARQ-F002-14): nenhum erro de unicidade revela dado de outra igreja |
| Tenant isolation | Duas camadas: estrutural (I-01, I-06, I-07) e de acesso (policies por contexto de igreja) |
| Mass assignment | UPDATE concedido por coluna, só em atributos e estado (`name`, `role`, `status`, `ended_at`). Chaves de pertencimento (`id`, `church_id`, `user_id`, `ministry_id`, `created_at`) imutáveis para o backend |
| Validação de entrada | CHECKs de domínio (valores, nomes aparados e não vazios, ao menos um de `before_data`/`after_data`) |
| Exposição de campos | Schema fora da Data API; nenhum privilégio para `PUBLIC`, `anon`, `authenticated`, `service_role` ou `authenticator` |
| Escalada de privilégio | `mescala_app` sem LOGIN, BYPASSRLS, SUPERUSER, CREATEDB, CREATEROLE ou REPLICATION; membro de nenhum papel; sem CREATE no schema. Nenhuma função SECURITY DEFINER; `search_path` fixo em todas as funções |
| Inconsistência transacional | Cada migration é atômica; o script de verificação não deixa resíduo |

### 5.3 Riscos

| # | Risco | Mitigação |
|---|---|---|
| R-01 | O RLS pega filtro errado, mas **não pega contexto de igreja errado**. Se o backend definir o contexto de uma igreja em que o usuário não tem vínculo, as policies liberam essa igreja | A CHURCH-002 valida o vínculo ATIVO antes de definir o contexto. Um endurecimento (policy que também exige vínculo) será avaliado na CHURCH-002 |
| R-02 | CLI rodada na raiz do repositório usa o vínculo legado (`supabase/.temp/project-ref`, divergência D4) | Comandos só a partir de `/backend`; conferir o project-ref antes de aplicar (Anexo A) |
| R-03 | `supabase config push` sobrescreve a configuração remota (Auth, Data API) com valores locais, o que pode desligar condições do ADR-003 | `config.toml` mínimo, sem seções de Auth; comando proibido |
| R-04 | `supabase db reset --linked` apaga o banco remoto | Proibido |
| R-05 | Misturar SQL Editor e CLI deixa o histórico `supabase_migrations` divergente | Um único método. Recomendação: CLI |
| R-06 | Migration aplicada não pode ser editada | Revisão estática do QA e revisão pré-aplicação do Arquiteto **antes** de o PO aplicar (ARQ-F002-11) |
| R-07 | Com FK RESTRICT para `auth.users`, excluir a conta no Supabase Auth falha quando ela já tem usuário do Mescala | Consequência aceita da DATA-DEC-012. Pedido de exclusão pela LGPD exige feature de anonimização |
| R-08 | `audit_log` vai guardar dados pessoais em `before_data`/`after_data`, e a imutabilidade (trigger) bloqueia correções | A feature de anonimização trará migration própria |
| R-09 | Alguém adiciona o schema em "Exposed schemas" | `anon`, `authenticated` e `service_role` não têm USAGE nem grants: nada fica acessível |
| R-10 | Identificador com mais de 63 caracteres é truncado em silêncio pelo Postgres | Regra D10 do Data Task; checagem do QA |
| R-11 | Scripts de verificação escritos sem execução prévia podem ter erro | O PO devolve o erro; corrige-se o script, não a migration |
| R-12 | No Postgres 16+, o `postgres` não pode fazer `SET ROLE mescala_app` sem conceder a si a opção SET | O script de verificação concede isso dentro do bloco que é desfeito no fim |
| R-13 | AUTH-001 em paralelo pode mexer em `backend/.gitignore` | Conflito trivial, resolvido por quem entrar por último |
| R-14 | O schema `public` continua exposto pela Data API | Nenhuma migration oficial cria objeto em `public` (D1) |
| R-15 | Papéis administrativos da plataforma (`postgres`, `supabase_admin` e outros) mantêm acesso | Fora do modelo: o RLS protege o caminho da aplicação, não o plano administrativo do Supabase |
| R-16 | A imutabilidade de `audit_log` vale para DML. O dono (`postgres`) pode contorná-la por DDL (`ALTER TABLE … DISABLE TRIGGER`) e, se a plataforma permitir, por `session_replication_role = replica`. Risco residual ligado ao R-08 | Plano administrativo (R-15). Nenhum papel de aplicação é dono nem tem CREATE (QD1 a QD6). DDL em `audit_log` só por migration revisada. O bloco B do QA mede o contorno; o resultado é informativo e não reprova |
| R-17 | O `lower()` de nomes com acento depende do locale do banco (RB). Se o locale não igualar maiúsculas acentuadas, a DATA-DEC-013 falha para nomes em português | V0.4 antes de aplicar. Se falhar, nada é aplicado: as migrations `create_ministries` e `create_ministry_functions` ganham collation explícita (contingência da revisão pré-aplicação) antes do A3 |
| R-18 | Função criada no schema sem retirar EXECUTE de `PUBLIC` fica executável por `mescala_app`, porque o padrão global do PostgreSQL não é retirado por schema (DIV-01) | Convenção ARQ-F002-16. V1.12b e V1.14b a V1.14d como regressão fixa no QA de toda feature que crie função ou tabela em `mescala` |
| R-19 | Os timestamps das 9 migrations (até `20261022150800`, 15:08 UTC de 2026-10-22) estão à frente do horário em que foram escritas. Uma migration gerada pela CLI antes desse instante ficaria fora de ordem | Toda migration nova tem timestamp maior que o da última da pasta (S1 do QA de cada feature); se a CLI gerar um menor, renomear antes da revisão |

### 5.4 Decisões do Arquiteto neste contrato

São técnicas, dentro da competência do Arquiteto. O PO pode vetar qualquer uma.

| ID | Decisão | Motivo |
|---|---|---|
| ARQ-F002-01 | Decomposição em FOUNDATION-002, 003, 004 e Convites | Seção 1 |
| ARQ-F002-02 | Atributos cuja obrigatoriedade a Brain não define entram na feature que primeiro os grava: atributos de `users` (DATA-DEC-013) na AUTH-002; `churches.address` na CHURCH-001 | A obrigatoriedade de `users` depende da DEC-06 (se o registro nasce sem nome, o nome não pode ser obrigatório). Para o endereço, nada foi decidido. As tabelas ficam vazias até essas features, então acrescentar a coluna depois não custa nada |
| ARQ-F002-03 | O RLS faz **isolamento por contexto de igreja** em todas as tabelas de tenant. Papel + escopo ficam no backend. Policies por usuário (os próprios vínculos, as próprias igrejas, o próprio registro em `users`) entram com AUTH-002/003 e CHURCH-002 | DATA-DEC-020: "as policies usam esse contexto"; `04-USUARIOS-E-PERMISSOES`: permissões = papel + escopo, no backend |
| ARQ-F002-04 | Contexto por parâmetros transacionais `mescala.current_user_id` (`users.id`) e `mescala.current_church_id`, lidos pelas funções `mescala.context_user_id()` e `mescala.context_church_id()`, que devolvem NULL quando o parâmetro falta (falha fechada) | Independe da ferramenta da DEC-04 parte 2 |
| ARQ-F002-05 | A migration cria só o papel de grupo `mescala_app` (NOLOGIN). O papel de login, com senha, é criado pelo PO fora do repositório, na feature do cliente de banco | Nenhum segredo em migration; rotação de credencial sem migration |
| ARQ-F002-06 | Nenhum DELETE nem TRUNCATE para o backend nesta fundação | HIS-001. A exceção já decidida (escala em rascunho nunca publicada, DATA-DEC-016 e) entra com a feature de escalas |
| ARQ-F002-07 | UPDATE só nas colunas de atributo e estado | Mass assignment; preservação do histórico |
| ARQ-F002-08 | `audit_log` é imutável também para papéis administrativos (trigger) | "Só inserção" (DATA-DEC-021) não pode depender só de grant, porque `postgres` e `service_role` existem em todo projeto |
| ARQ-F002-09 | Colunas de status sem DEFAULT; nenhum CHECK que acople status e `ended_at` | O estado inicial e as transições são regras das features (DATA-DEC-016 A); não impor regra não escrita |
| ARQ-F002-10 | O Desenvolvedor escreve à mão um `config.toml` mínimo. O `supabase init` não é usado | Seção 8 |
| ARQ-F002-11 | O QA revisa estaticamente, e o Arquiteto revisa antes da aplicação, **antes** de o PO aplicar | R-06 |
| ARQ-F002-12 | Nomes explícitos de FK: `ministry_membership_id` e `ministry_function_id` (em vez de `membership_id` e `function_id`). O nome `audit_log` é mantido, como a DEC-09 o cita | `membership_id` é ambíguo (igreja ou ministério). `audit_log` é substantivo coletivo; trocar o nome citado na decisão seria divergência gratuita |
| ARQ-F002-13 | RLS habilitado, **não** forçado | `mescala_app` não é dono das tabelas. FORCE só afetaria o dono (`postgres`), que administra e aplica migrations |
| ARQ-F002-14 | Em tabela de tenant, toda unicidade que um INSERT do backend pode atingir inclui `church_id`. Nesta feature: `ministry_memberships` UNIQUE(church_id, ministry_id, user_id); `ministry_functions` UNIQUE(church_id, ministry_id, nome em minúsculas); PK de `ministry_member_functions` (church_id, ministry_membership_id, ministry_function_id). Exceção: a PK `id` e os UNIQUE(x, id) alvo de FK, que só revelam a existência de um `id` que o chamador já tem; o backend nunca grava `id` vindo do cliente | F002-QA-01: o RLS só fixa `church_id`, e o índice único é checado antes da FK composta (que roda no fim do comando). Sem `church_id` na chave, um INSERT com ID de outra igreja responde 23505 em vez de 23503 e revela vínculo, nome ou habilitação da outra igreja (SEC-001; seção 17). Com as FKs compostas, a chave nova equivale à antiga |
| ARQ-F002-15 | INSERT de `mescala_app` em `audit_log` só nas colunas `church_id`, `actor_user_id`, `action`, `entity_type`, `entity_id`, `before_data` e `after_data`. `id` e `occurred_at` vêm sempre do default do banco | O "quando" e a identidade do registro de auditoria não dependem do backend (`seguranca/AUDITORIA`: ator, data e alteração; DATA-DEC-021). O backend não precisa desses valores: não tem SELECT na tabela |
| ARQ-F002-16 | DIV-01, opção A: o padrão global de privilégios do banco não é alterado. Toda migration que cria função em `mescala` retira EXECUTE de `PUBLIC` e concede explicitamente; toda tabela nova nasce sem privilégio para `PUBLIC` e para os papéis da Data API. ALTER DEFAULT PRIVILEGES sem IN SCHEMA é proibido | A opção B valeria para o banco inteiro, inclusive para objetos da plataforma e de extensões, e contraria o critério 2. O risco residual (R-18) não dá a ninguém mais que o `mescala_app` já tem: só ele tem USAGE no schema, e SECURITY DEFINER exige decisão explícita no contrato |

### 5.5 Diferenças em relação à proposta da seção 13.2 do relatório

A DEC-09 diz que a especificação vinculante vem deste contrato.

| Item | Seção 13.2 | Este contrato | Motivo |
|---|---|---|---|
| Atributos de `users` | Na tabela | AUTH-002 | ARQ-F002-02 |
| `churches.address` | Na tabela | CHURCH-001 | ARQ-F002-02 |
| `church_memberships` UNIQUE(church_id, id) | Sim | Não | Nenhuma FK o usa |
| Colunas de FK da habilitação | `membership_id`, `function_id` | `ministry_membership_id`, `ministry_function_id` | ARQ-F002-12 |
| `ministry_member_functions` | "Todas têm id, created_at, updated_at" | PK composta e só `created_at` | Não tem atributo mutável |
| `audit_log.church_id` | Nulidade não dita | NOT NULL | Toda mudança auditada prevista na Brain é de igreja. Tirar o NOT NULL depois não quebra nada |
| Unicidades de `ministry_memberships` e de nome em `ministry_functions` | UNIQUE(ministry_id, user_id); UNIQUE(ministry_id, lower(name)) | Com `church_id`; a PK das habilitações também (VERSÃO 2) | ARQ-F002-14 |
| Programação, escala, disponibilidade e convites | Nesta fundação | FOUNDATION-004 e Convites | ARQ-F002-01 |
| Policies | "Conforme DEC-020" | Matriz D8 | ARQ-F002-03 |

---

## 6. FEATURE CONTRACT

```text
ID:      FOUNDATION-002
DOMÍNIO: foundation (persistência; sem regra de negócio nova)
NOME:    Fundação de Persistência — schema oficial, identidade, organização e auditoria
VERSÃO:  2
STATUS:  READY
```

Histórico de versões:
- **VERSÃO 1 (2026-10-22):** emitida com STATUS BLOCKED (B-01, B-02 e autorização da Fase 4 pendentes).
- **VERSÃO 2 (2026-10-22), revisão pré-aplicação (ARQ-F002-11):** respostas do PO aplicadas (B-01 = `mescala`; B-02 = ATIVO, INATIVO); ARQ-F002-14 a 16; R-16 a R-19; critérios 2, 6, 8, 9, 11, 13 e 22 a 24 ajustados; Anexo A e QA Contract ajustados. A aplicação continua condicionada às pré-condições do Anexo A.

### 1. Objetivo
- **O que faz:** cria, no projeto oficial `vitqnyzuvrvkmnvshcpb`:
  - o schema dedicado `mescala`, fora da Data API;
  - o papel de acesso do backend `mescala_app`, sem BYPASSRLS;
  - o mecanismo de contexto (usuário, igreja) por transação;
  - as tabelas de identidade, organização e auditoria, com integridade multi-tenant garantida pelo banco e RLS de isolamento por igreja.

  Cria também a estrutura `backend/supabase/` da CLI.
- **Por que existe:** o ADR-002 exige a fundação de persistência antes de qualquer feature que dependa do banco.
- **Resultado:** banco oficial reproduzível pelas migrations, pronto para o cliente de banco (FOUNDATION-003), a AUTH-002 e a CHURCH-001.

### 2. Ator
Não há ator de negócio. É uma operação técnica:
- o Analista de Dados escreve as migrations;
- o Desenvolvedor escreve a configuração da CLI;
- o PO aplica as migrations no projeto oficial (DEC-04: aplicação manual).

Em tempo de execução, o único consumidor previsto do schema é o backend, pelo papel `mescala_app`, a partir da FOUNDATION-003.

### 3. Pré-condições
- FOUNDATION-001 encerrada (cumprida).
- ADR-002, ADR-003, DEC-04 parte 1, DEC-05 e DEC-09 aceitos (cumprida).
- B-01 e B-02 respondidos pelo PO (cumprida em 2026-10-22).
- Fase 4 autorizada explicitamente pelo PO (cumprida em 2026-10-22).
- O projeto `vitqnyzuvrvkmnvshcpb` está vazio: não existem o schema `mescala`, o papel `mescala_app` nem histórico em `supabase_migrations`. O PO confirma com o V0 antes de aplicar (A2b).
- Antes do A3, `backend/supabase/` contém só `config.toml` (Desenvolvedor) e `migrations/` (Analista).
- A integração GitHub ↔ Supabase não está conectada (DEC-04).
- O PO tem a Supabase CLI 2.x (nesta máquina, 2.109.1).

### 4. Entradas
Nenhuma em tempo de execução: não há API, rota nem payload.

Insumos de decisão:

| Insumo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| Nome do schema (B-01) | Identificador SQL | Sim | Minúsculo; não pode colidir com schemas do Supabase (`auth`, `storage`, `realtime`, `extensions`, `graphql`, `graphql_public`, `vault`, `supabase_*`, `pgbouncer`, `net`, `cron`) |
| Valores do status da Igreja (B-02) | Lista de valores | Sim | MAIÚSCULAS, sem acento (padrão de `dados/STATUS`) |

### 5. Processamento
Fluxo de entrega desta feature. Ajusta o `FLUXO-DE-ENTREGA` porque migration aplicada não pode ser editada (ARQ-F002-11):

1. **Analista de Dados:** escreve as 9 migrations (Data Task D9) e devolve o DATA TASK RESULT com o texto do script de verificação (D11). Não aplica nada.
2. **Desenvolvedor:** cria `backend/supabase/config.toml` e atualiza `backend/.gitignore`. Roda typecheck, lint e build. As etapas 1 e 2 são independentes, mas a etapa 2 só começa depois do encerramento da AUTH-001 (cabeçalho). A etapa 6 nunca começa antes da etapa 2 e do S15: sem `backend/supabase/config.toml`, a CLI rodada em `/backend` sobe até a raiz e usa a `supabase/` legada.
3. **Organizador:** confere a estrutura (Organization Task).
4. **QA, fase 1:** revisão estática das migrations, da configuração e do script de verificação.
5. **Arquiteto, revisão pré-aplicação:** APPROVED (libera a aplicação nas condições do Anexo A) ou CHANGES_REQUIRED. Um delta pedido nesta revisão volta ao Analista, passa pela revisão estática do QA (fase 1b) e pela confirmação do Arquiteto antes da etapa 6.
6. **PO:** vincula a CLI, aplica as migrations, confere a Data API e roda a verificação (Anexo A). Devolve as saídas.
7. **QA, fase 2:** avalia as saídas e emite o QA RESULT final.
8. **Arquiteto:** ARCHITECT REVIEW final.

### 6. Regras de negócio e normas aplicáveis
- `05-REGRAS-DE-NEGOCIO#SEC-001`: isolamento por igreja (I-01).
- `05-REGRAS-DE-NEGOCIO#HIS-001` e DATA-DEC-012: nada com histórico é apagado; status ATIVO/INATIVO e data de término para vínculos, ministérios e funções; FKs com RESTRICT.
- `05-REGRAS-DE-NEGOCIO#IGR-001` e DATA-DEC-007: um OWNER por igreja (índice único parcial).
- `05-REGRAS-DE-NEGOCIO#MEM-001` e DATA-DEC-010: só quem tem conta é membro. Estrutura: todo vínculo aponta para `users`, que aponta para `auth.users`.
- `05-REGRAS-DE-NEGOCIO#MEM-002`, DATA-DEC-008 e DATA-DEC-009: um vínculo por (ministério, usuário) e um papel; vários LEADER.
- `04-USUARIOS-E-PERMISSOES` e DATA-DEC-005:
  - papéis da igreja: OWNER, ADMIN, MEMBER;
  - papéis do ministério: LEADER, MEMBER;
  - cargo não é papel;
  - nada vem do token.
- DATA-DEC-006: um usuário pode estar em N igrejas; um vínculo por (igreja, usuário).
- DATA-DEC-013: nomes únicos sem diferenciar maiúsculas (ministério na igreja, função no ministério).
- DATA-DEC-016 A e `dados/STATUS#Representação e validação`: CHECK no banco, transições no backend.
- DATA-DEC-018: nomes do padrão 13.4.
- DATA-DEC-019: tabela própria `users`, ligada a `auth.users`.
- DATA-DEC-020: schema dedicado fora da Data API; papel sem BYPASSRLS; contexto por transação.
- DATA-DEC-021: auditoria só de inserção, gravada pelo backend.
- DATA-DEC-022 (complemento de 2026-10-22): banco vazio, sem migração. DATA-DEC-023: não se aplica.
- `FLUXO-MEMBROS`, passos 1 a 4: vínculo com a igreja antes do vínculo com o ministério; funções no vínculo com o ministério.
- `FUNCOES` e `ESC-002`: a parte estrutural (habilitação do mesmo ministério).
- `ADR-002#Persistência`; `ADR-003`, itens 7 e 9; DEC-04 parte 1; DEC-05.

### 7. Entidades envolvidas
Todas são criadas:
- Usuário (`users`);
- Igreja (`churches`);
- Vínculo com a igreja (`church_memberships`);
- Ministério (`ministries`);
- Vínculo com o ministério (`ministry_memberships`);
- Função (`ministry_functions`);
- Habilitação, isto é, as funções que o vínculo pode exercer (`ministry_member_functions`);
- Registro de auditoria (`audit_log`).

Referenciada: `auth.users`, do Supabase Auth do projeto oficial.

### 8. Relacionamentos

| Relação | Cardinalidade |
|---|---|
| `auth.users` → `users` | 1:0..1 (único, obrigatório do lado de `users`) |
| `users` → `church_memberships` | 1:N |
| `churches` → `church_memberships` | 1:N; UNIQUE(igreja, usuário) |
| `churches` → `ministries` | 1:N |
| `ministries` → `ministry_memberships` | 1:N; UNIQUE(ministério, usuário) |
| `church_memberships` → `ministry_memberships` | 1:N, pela chave (igreja, usuário) |
| `ministries` → `ministry_functions` | 1:N |
| `ministry_memberships` ↔ `ministry_functions` | N:N por `ministry_member_functions`, do mesmo ministério |
| `churches` → `audit_log`; `users` (ator) → `audit_log` | 1:N |

### 9. Autorização
- **Quem opera a feature:** o Analista escreve, o Desenvolvedor configura e o PO aplica. Nenhum agente aplica nada nem acessa o banco remoto.
- **Quem acessa o schema em tempo de execução:** só `mescala_app`, por um papel de login que o PO criará fora do repositório na FOUNDATION-003.
- **Quem não acessa:** `PUBLIC`, `anon`, `authenticated`, `service_role` e `authenticator`, de forma alguma: sem USAGE, sem privilégio, sem policy. A administração da plataforma (`postgres` e afins) fica fora do caminho da aplicação.
- **O que as policies decidem (em escopo):**
  - (a) isolamento por igreja: só linhas cujo `church_id` (ou `id`, em `churches`) é o contexto de igreja da transação;
  - (b) em `audit_log`, o ator gravado tem de ser o usuário do contexto.
- **O que as policies não decidem:**
  - quem pode criar igreja, ministério, vínculo ou função;
  - quem pode alterar papel;
  - o que um MEMBER pode ler.

  Isso é papel + escopo, no backend, em cada feature (`04-USUARIOS-E-PERMISSOES`; `seguranca/AUTORIZACAO`). As regras de autorização ainda abertas (o ADMIN gerencia todos os ministérios? o que o LEADER faz fora da escala?) não afetam o RLS de tenant.
- **Proibido:** policy baseada em cargo (ANCIÃO), em claim de token ou em `app_metadata`/`user_metadata`.
- **Operações sem permissão:** DELETE e TRUNCATE em todas as tabelas; UPDATE de chaves de pertencimento; SELECT em `audit_log`; `id` e `occurred_at` no INSERT de `audit_log` (ARQ-F002-15); qualquer acesso a `users`.

### 10. Multi-tenancy
- **Como a igreja é identificada:**
  - `churches.id` é o tenant;
  - toda tabela de tenant tem `church_id NOT NULL`;
  - `users` é global (uma pessoa pode estar em N igrejas).
- **Onde ocorre o isolamento:**
  - (1) estrutural: FKs compostas que levam `church_id` até a raiz (I-01, I-06, I-07);
  - (2) acesso: policies com `church_id = context_church_id()`.
- **Consultas com escopo:** todas as do backend sobre tabelas de tenant (`WHERE church_id = :ctx`, relatório, seção 6). O RLS é a segunda camada.
- **Leituras entre igrejas que serão necessárias:** os próprios vínculos e as próprias igrejas ("minhas igrejas") e a resolução do usuário. Elas **não** são criadas aqui; vêm da CHURCH-002 e da AUTH-002/003, por policies explícitas.
- **Riscos:**
  - R-01 (contexto errado);
  - IDs vindos do cliente: um UUID de outra igreja não é encontrado (RLS) nem aceito em FK composta, e nenhum erro de unicidade revela se existe vínculo, nome ou habilitação com ele na outra igreja (ARQ-F002-14).

### 11. Transação
- Cada migration é uma unidade atômica: se um comando falhar, nada daquele arquivo persiste. Proibidos dentro dos arquivos: BEGIN/COMMIT explícitos e comandos que não rodam em transação (por exemplo, `CREATE INDEX CONCURRENTLY`).
- A ordem é obrigatória (D9). Uma migration que falhou na aplicação não foi aplicada: pode ser corrigida no próprio arquivo, com registro no relatório. Uma migration aplicada com sucesso nunca é editada.
- O script de verificação roda numa unidade que é sempre desfeita (D11).
- Requisito para features futuras (FOUNDATION-003): o contexto vale só dentro de uma transação explícita (`set_config(..., true)`), nunca na sessão.

### 12. Impacto no banco
**SIM.** Criar no projeto oficial:
- o schema `mescala`, fora da Data API;
- o papel de grupo `mescala_app`;
- 4 funções;
- 8 tabelas com RLS habilitado;
- FKs compostas, unicidades, CHECKs e índices;
- grants por coluna;
- policies de isolamento;
- a imutabilidade de `audit_log`.

Especificação fechada no Data Task (seção 7). Nenhum SQL neste contrato.

### 13. Domínios impactados
- **Principal:** foundation.
- **Secundários:** auth, church, ministry, member, audit (só estrutura).

### 14. Dependências
- **Decisões:** listadas na seção 4 da análise.
- **Ferramentas:**
  - Supabase CLI (do PO, para `link` e `db push`);
  - SQL Editor do projeto (verificação).
- **Do banco:** `auth.users` do projeto oficial; o gerador de UUID nativo do Postgres. **Nenhuma extensão.**
- **npm:** nenhuma dependência nova.
- **Proibidos nesta feature** (interpretação pela DEC-08):
  - driver, query builder ou ORM;
  - `@supabase/*`;
  - biblioteca de validação;
  - Vitest ou outra biblioteca de testes (o Vitest entra pela AUTH-001);
  - qualquer script npm para a CLI.

### 15. Eventos de domínio
Nenhum.

### 16. Auditoria
- Cria a infraestrutura de auditoria (`audit_log`: igreja, ator, ação, entidade, id, antes, depois e quando; só inserção).
- Não grava nenhum registro.
- As mudanças desta feature são rastreadas pelo git e pelo histórico `supabase_migrations` (quando aplicadas pela CLI).

### 17. Erros esperados
A estrutura precisa produzir estes erros do Postgres, por SQLSTATE. O mapeamento para respostas HTTP é da DEC-07 e das features.

| Situação | SQLSTATE |
|---|---|
| FK simples ou composta violada (inclusive entre igrejas); exclusão barrada por RESTRICT | 23503 `foreign_key_violation` |
| Unicidade (segundo OWNER, vínculo duplicado, nome duplicado) | 23505 `unique_violation` |
| Valor de papel ou status inválido; nome em branco ou com espaço nas pontas; auditoria sem antes nem depois | 23514 `check_violation` |
| Coluna obrigatória ausente | 23502 `not_null_violation` |
| Sem privilégio (DELETE, coluna imutável, `id` ou `occurred_at` no INSERT de `audit_log`, `users`, schema para `anon`); nova linha fora da policy de RLS | 42501 `insufficient_privilege` |
| Contexto com valor que não é UUID | 22P02 `invalid_text_representation` |
| UPDATE, DELETE ou TRUNCATE em `audit_log` | P0001 `raise_exception` |

Leitura e UPDATE fora do contexto não dão erro: devolvem 0 linhas.

Um INSERT feito no contexto da igreja A com ministério, vínculo ou função da igreja B responde 23503, nunca 23505 (ARQ-F002-14). O 23505 só aparece para duplicidade dentro da própria igreja.

### 18. Resultado esperado
- Projeto `vitqnyzuvrvkmnvshcpb` com o schema `mescala`, as 8 tabelas vazias e protegidas, o papel `mescala_app` e as 4 funções.
- Histórico de 9 migrations.
- Repositório com `backend/supabase/config.toml`, `backend/supabase/migrations/` (9 arquivos) e `backend/.gitignore` atualizado.
- FOUNDATION-001 intacta.

### 19. Critérios de aceite
1. Existem exatamente 9 arquivos em `backend/supabase/migrations/`, no formato `<14 dígitos>_<objetivo>.sql`, com timestamps estritamente crescentes, nos objetivos e na ordem do D9.
2. Cada migration tem o cabeçalho do D9 e não contém:
   - BEGIN/COMMIT;
   - comando não transacional;
   - segredo;
   - objeto fora de `mescala`;
   - ALTER DEFAULT PRIVILEGES sem IN SCHEMA (ARQ-F002-16).

   Exceções: o papel `mescala_app`, que é do cluster, e a referência de FK a `auth.users`.
3. Depois da aplicação, `mescala` contém exatamente as 8 tabelas do D5, com colunas, tipos, nulidade e defaults como especificados. Nenhuma outra tabela, view, sequence ou tipo.
4. As 8 tabelas têm RLS habilitado e não forçado.
5. Toda FK é ON DELETE RESTRICT e ON UPDATE NO ACTION. Nenhuma é CASCADE, SET NULL ou SET DEFAULT.
6. As FKs compostas e as unicidades do D5 existem. Os testes N1 a N13 do QA Contract falham com o erro esperado. Um INSERT no contexto de uma igreja com ministério, vínculo ou função de outra responde 23503, nunca 23505 (ARQ-F002-14; casos QT1 a QT4).
7. No máximo um OWNER por igreja (N4).
8. Nomes de ministério e de função são únicos sem diferenciar maiúsculas no seu escopo, inclusive com letras acentuadas (N7, N8, V0.4, QI2), aparados e não vazios (N10).
9. Papéis e status aceitam só os valores do D5, em MAIÚSCULAS (N9). O status da Igreja aceita só ATIVO e INATIVO (B-02).
10. `users.auth_user_id` é obrigatório e único, com FK para `auth.users(id)` em RESTRICT.
11. `audit_log` rejeita UPDATE, DELETE e TRUNCATE feitos por DML direto, de qualquer papel, inclusive `postgres` (N12, QD7), e exige ao menos um entre `before_data` e `after_data` (N13). `mescala_app` não informa `id` nem `occurred_at` (ARQ-F002-15; QM6, QM7). O contorno pelo dono, por DDL ou por `session_replication_role`, é plano administrativo e fica fora deste critério (R-16; bloco B, informativo).
12. `mescala_app` é NOLOGIN, NOBYPASSRLS, NOSUPERUSER, NOCREATEDB, NOCREATEROLE e NOREPLICATION, e não é membro de nenhum papel. Nenhuma migration cria papel com LOGIN ou senha.
13. Os privilégios seguem exatamente a matriz D7, inclusive o UPDATE por coluna e o INSERT por coluna em `audit_log`. `PUBLIC`, `anon`, `authenticated`, `service_role` e `authenticator` não têm USAGE no schema nem privilégio em tabelas e funções.
14. As policies seguem exatamente a matriz D8: todas `TO mescala_app`, permissivas, uma por comando. Nenhuma policy para outro papel e nenhuma em `users`.
15. Os cenários R1 a R10 do QA Contract se comportam como especificado.
16. Existem exatamente as 4 funções do D3, D4 e D6, todas SECURITY INVOKER e com `search_path` fixo. As duas funções de contexto são executáveis só por `mescala_app`; as de trigger, por nenhum papel além do dono.
17. Há trigger de `updated_at` nas 6 tabelas que têm essa coluna. `audit_log` e `ministry_member_functions` não têm `updated_at`.
18. Nenhum identificador passa de 63 caracteres; os nomes seguem o D10.
19. O PO confirma que `mescala` não está em "Exposed schemas" da Data API.
20. A verificação não deixa resíduo: depois dela, as 8 tabelas têm 0 linhas, e nenhum papel ou privilégio novo persiste.
21. `backend/supabase/config.toml` tem o conteúdo da seção 8. `backend/.gitignore` cobre `supabase/.temp/` e `supabase/.branches/`. `backend/supabase/` só contém `config.toml` e `migrations/`.
22. `npm run typecheck`, `npm run lint` e `npm run build` passam em `/backend`. `backend/package.json` e `backend/package-lock.json` estão inalterados em relação ao commit que encerrar a AUTH-001. Nada mudou em `backend/src` por esta feature; nenhum `.jsx`.
23. Fora de `/backend`, esta feature só muda `docs/features/FOUNDATION-002.md` e `docs/features/FOUNDATION-002-DATA-TASK-RESULT.md`. A `supabase/` da raiz (inclusive `supabase/.temp/project-ref`), `src/` e `.claude/` estão intactos; `brain-mescala/` só muda pela sincronização do vault-brain pedida na seção 12.
24. Antes do A3: QA fase 1 APPROVED (inclusive a fase 1b, do delta da VERSÃO 2), revisão pré-aplicação do Arquiteto APPROVED, S15 e S16 executável OK. Na fase 2, o QA avaliou as saídas do V0, do V1, do V2 integrado e do bloco B.
25. Nenhuma tabela ou coluna além do contrato: sem atributos de `users`, sem `address`, sem status de usuário, sem `programs`, `invitations` ou tabela de impedimentos.

### 20. Fora do escopo
- Cliente de banco, conexão, pooler, papel de login, string de conexão, variáveis de ambiente (FOUNDATION-003).
- Atributos de `users` e sua obrigatoriedade; policies de `users`; resolução `sub` → `users.id` (AUTH-002/003, DEC-06).
- Status ou revogação de usuário (B8 da AUTH-001, na AUTH-003).
- `churches.address`; a criação da igreja e do OWNER (CHURCH-001).
- Policies por usuário (próprios vínculos, "minhas igrejas") e o contexto de igreja da requisição (CHURCH-002).
- Programação, participação, escala, alocação, impedimentos (FOUNDATION-004).
- Convites (feature própria; B-04).
- DELETE de escala em rascunho (feature de escalas); revogação de habilitação (feature de funções do membro).
- Reunião, Comissão, Cronograma, Pauta, recorrência (DATA-DEC-003 e 004).
- Migração de dados do legado e qualquer mudança nos projetos antigos (DATA-DEC-022 e 023).
- Seeds; testes automatizados de banco; Vitest.
- Edge Functions; `backend/supabase/functions/`.
- Configuração do projeto remoto (Auth, chaves, SMTP, região); integração GitHub ↔ Supabase.
- Qualquer código TypeScript, rota ou UI.

### Anexo A — Procedimento do PO (fora do repositório)

**Antes das execuções:**
- **A1.** Responder B-01 e B-02 (e, quando quiser, B-03 e B-04). Cumprido em 2026-10-22: B-01 = `mescala`; B-02 = ATIVO, INATIVO; B-03 = A; B-04 = A.
- **A2.** (Cumprido em 2026-10-22.) Autorizar explicitamente a Fase 4, por exemplo: "autorizo a Fase 4 da FOUNDATION-002".

**Pré-condições do A3 (todas):**
- VERSÃO 2 deste contrato registrada.
- Delta da VERSÃO 2 feito pelo Analista; QA fase 1b APPROVED; delta confirmado pelo Arquiteto (revisão pré-aplicação APPROVED).
- `docs/features/FOUNDATION-002-DATA-TASK-RESULT.md` com o script integrado: V0 (com V0.3b, V0.3c e V0.4), V1 (com V1.21 a V1.24), V2 num só bloco (com os casos do complemento A do QA) e o bloco B.
- AUTH-001 encerrada; trecho do Desenvolvedor (seção 8) feito; Organizador sem pendência; QA com S15 e S16 executável OK.
- Recomendado: commit autorizado pelo PO com as 9 migrations, `backend/supabase/config.toml`, `backend/.gitignore` e os dois documentos da feature, para o estado aplicado corresponder a um commit identificado.

**Depois das pré-condições:**
- **A2b.** No SQL Editor do projeto `vitqnyzuvrvkmnvshcpb`, rodar o V0 **uma consulta por vez** (o editor mostra só o resultado da última instrução e para no primeiro erro). Parar e devolver as saídas, sem aplicar nada, se o V0.1 mostrar o schema ou o papel, se o V0.2 mostrar alguma migration ou se o V0.4 mostrar que `lower()` não iguala maiúsculas acentuadas (R-17). Anotar também o conteúdo de `supabase/.temp/project-ref` da raiz do repositório (para o A4).
- **A3.** No terminal, **dentro de `/backend`** (nunca na raiz do repositório), depois de conferir que `backend/supabase/config.toml` existe:
  - rodar `supabase login`, se necessário;
  - rodar `supabase link --project-ref vitqnyzuvrvkmnvshcpb`;
  - a senha do banco só no prompt ou numa variável de ambiente da sessão; nunca em arquivo versionado;
  - se o `link` avisar que a configuração local difere da do projeto remoto (às vezes com uma lista de diferenças de Auth, API ou banco), é esperado: o `config.toml` é mínimo de propósito (ARQ-F002-10). Não rodar `supabase config push` nem completar o `config.toml` (R-03; A9). Só parar e devolver a mensagem se o `link` terminar com **erro**. Com o commit recomendado feito, o `git status` do A4 confirma que o `config.toml` não mudou.
- **A4.** Conferir que `backend/supabase/.temp/project-ref` contém `vitqnyzuvrvkmnvshcpb`, que `supabase/.temp/project-ref` da raiz continua com o conteúdo anotado no A2b (a CLI não usou a raiz) e que o `git status` não mostra `.temp/` nem mudança em arquivo versionado.
- **A5.** Aplicar:
  - rodar `supabase db push --dry-run`: tem de listar exatamente as 9 migrations de `backend/supabase/migrations/`, na ordem, e nenhuma da `supabase/migrations/` da raiz;
  - depois, rodar `supabase db push`;
  - se algum arquivo falhar, parar e devolver a mensagem; não corrigir nada à mão no banco.

  Alternativa permitida pela DEC-04: SQL Editor, um arquivo por vez, inteiro, na ordem. Nesse caso o histórico `supabase_migrations` não é preenchido, e o `db push` não deve ser usado depois sem orientação do Arquiteto. **Recomendação: CLI.**
- **A6.** No painel, em Data API → "Exposed schemas", confirmar que `mescala` não aparece. Opcional: uma requisição REST com a chave publishable pedindo o perfil `mescala` deve ser recusada.
- **A7.** No SQL Editor, como `postgres`:
  - rodar o V1 **uma consulta por vez**, de V1.1 a V1.24 (somente leitura);
  - rodar o V2 integrado, sozinho: um só bloco, que termina sempre num erro proposital que desfaz tudo;
  - rodar o bloco B do QA, sozinho: informativo, termina sempre num erro proposital; CONTORNADO não é falha (R-16);
  - rodar de novo V1.20, V1.13b, V1.13c e V1.11 (resíduo; triggers de `audit_log` habilitados);
  - devolver todas as saídas à sessão principal, inclusive o texto completo das duas mensagens de erro proposital.
- **A8.** **Não** criar agora o papel de login nem a string de conexão: isso vem com a FOUNDATION-003. Para referência futura, o papel de login terá:
  - LOGIN e senha forte;
  - NOBYPASSRLS, sem SUPERUSER, CREATEDB, CREATEROLE ou REPLICATION;
  - INHERIT e participação em `mescala_app`.

  A senha fica só no cofre ou na variável de ambiente do backend.
- **A9.** Proibido no projeto oficial:
  - `supabase db reset --linked`;
  - `supabase config push`;
  - `supabase db pull`;
  - `supabase migration repair` sem orientação;
  - `supabase functions deploy`;
  - qualquer comando da CLI na raiz do repositório;
  - conectar a integração GitHub ↔ Supabase.
- **A10.** Opcional: rodar o Security Advisor do painel e anexar o resultado. Achado esperado: RLS sem policy em `mescala.users` (D8).

---

## 7. DATA TASK

```text
Feature: FOUNDATION-002 — Fundação de Persistência (v2)
Domínio: foundation; secundários: auth, church, ministry, member, audit
```

**Contexto, para que este bloco se baste:**
- **Banco:** projeto Supabase novo `vitqnyzuvrvkmnvshcpb`, vazio (DEC-05; DATA-DEC-022, complemento de 2026-10-22).
- **Migrations:** `backend/supabase/migrations/<YYYYMMDDHHMMSS>_<objetivo>.sql` (DEC-04 parte 1; DATA-DEC-018).
  - A pasta ainda não existe: você a cria ao escrever o primeiro arquivo.
  - Não há migration oficial anterior.
- **Legado:** a `supabase/` da raiz e `src/integrations/supabase/types.ts` não são referência e não podem ser tocados.
- **Você não aplica nada.** O PO aplica, depois das revisões.
- **Respostas do PO (VERSÃO 2):** schema `mescala` (B-01); status da Igreja ATIVO, INATIVO (B-02). Não há mais marcadores.
- **Delta da VERSÃO 2** (migrations ainda não aplicadas): ARQ-F002-14 (D5) e ARQ-F002-15 (D7), conforme a lista da revisão pré-aplicação.

**Entidades afetadas:** `users`, `churches`, `church_memberships`, `ministries`, `ministry_memberships`, `ministry_functions`, `ministry_member_functions`, `audit_log`.

**Necessidade:**

**D1 — Schema e higiene de privilégios**
- Criar `mescala`, com dono `postgres` (o papel que aplica as migrations).
- Retirar de `PUBLIC`, `anon`, `authenticated`, `service_role` e `authenticator` todo privilégio no schema.
- Conceder USAGE só a `mescala_app`, que não recebe CREATE.
- Ajustar os privilégios padrão do schema para objetos futuros criados por `postgres`: o schema não concede nada automaticamente a ninguém.
- Limite do PostgreSQL (DIV-01): privilégio padrão por schema não retira o padrão global, que dá EXECUTE a `PUBLIC` em toda função nova. Decisão ARQ-F002-16 (opção A): o padrão global não é alterado; cada função criada retira EXECUTE de `PUBLIC` e recebe concessão explícita (D3, D4, D6 e a retirada em massa da migration 9).
- Nenhum objeto em `public` ou `auth`, nem em outro schema. A única exceção é a referência de FK a `auth.users`.

**D2 — Papel `mescala_app`**
- Papel de grupo com NOLOGIN, NOBYPASSRLS, NOSUPERUSER, NOCREATEDB, NOCREATEROLE e NOREPLICATION.
- Não é membro de nenhum papel. Não é dono de nenhum objeto.
- A criação deve poder rodar de novo num cluster onde o papel já existe (por exemplo, um banco local resetado). Nesse caso, os atributos acima são reafirmados, nunca afrouxados.
- Nenhuma senha, nenhum LOGIN, nenhum papel de login. O papel de login é do PO, na FOUNDATION-003.

**D3 — Mecanismo de contexto (ARQ-F002-04)**
- Parâmetros de sessão customizados, definidos pelo backend **por transação**:
  - `mescala.current_user_id`: o `users.id` do Mescala, nunca o `sub` do provedor;
  - `mescala.current_church_id`.
- Funções `mescala.context_user_id()` e `mescala.context_church_id()`:
  - devolvem `uuid`;
  - devolvem NULL quando o parâmetro não está definido ou está vazio (depois de uma transação, o parâmetro volta como texto vazio);
  - geram erro quando o valor não é UUID.
- Propriedades das duas: STABLE, SECURITY INVOKER, `search_path` fixo e vazio, só nomes qualificados.
- EXECUTE só para `mescala_app`, retirado de `PUBLIC`.

**D4 — `updated_at`**
- Função de trigger `mescala.set_updated_at()`, que grava a hora atual em `updated_at` antes de cada UPDATE de linha.
- Propriedades: SECURITY INVOKER, `search_path` fixo, EXECUTE retirado de `PUBLIC`.
- Trigger em `users`, `churches`, `church_memberships`, `ministries`, `ministry_memberships` e `ministry_functions`.

**D5 — Tabelas**

Convenções que valem para todas as tabelas:
- `id uuid` é PK com default de UUID aleatório nativo, exceto na tabela de habilitações.
- `created_at` e `updated_at` são `timestamptz NOT NULL` com default "agora", exceto onde indicado.
- Toda FK é ON DELETE RESTRICT e ON UPDATE NO ACTION.
- RLS é habilitado no próprio `create_*`, sem FORCE.
- "Nome válido" significa NOT NULL, sem espaço nas pontas e não vazio.
- Colunas de status não têm DEFAULT (ARQ-F002-09).
- Nenhum CHECK acopla `status` e `ended_at`.

`users` (global; DATA-DEC-019):

| Coluna | Tipo | Nulo | Regra |
|---|---|---|---|
| id | uuid | não | PK |
| auth_user_id | uuid | não | UNIQUE; FK → `auth.users(id)` |
| created_at, updated_at | timestamptz | não | — |

Nada mais: os atributos vêm da AUTH-002 e o status, se existir, da AUTH-003.

`churches` (raiz do tenant):

| Coluna | Tipo | Nulo | Regra |
|---|---|---|---|
| id | uuid | não | PK. O backend pode informar o valor (necessário para a CHURCH-001; ver D8) |
| name | text | não | Nome válido |
| status | text | não | CHECK em ATIVO, INATIVO (B-02) |
| ended_at | timestamptz | sim | Data de término (DATA-DEC-012) |
| created_at, updated_at | timestamptz | não | — |

`church_memberships` (DATA-DEC-005, 006 e 007):

| Coluna | Tipo | Nulo | Regra |
|---|---|---|---|
| id | uuid | não | PK |
| church_id | uuid | não | FK → `churches(id)` |
| user_id | uuid | não | FK → `users(id)` |
| role | text | não | CHECK em OWNER, ADMIN, MEMBER |
| status | text | não | CHECK em ATIVO, INATIVO |
| ended_at | timestamptz | sim | — |
| created_at, updated_at | timestamptz | não | — |

Chaves: UNIQUE(church_id, user_id), que é alvo da FK E2; UNIQUE parcial (church_id) onde `role = 'OWNER'`, valendo para qualquer status.

`ministries` (DATA-DEC-001, 012, 013):

| Coluna | Tipo | Nulo | Regra |
|---|---|---|---|
| id | uuid | não | PK |
| church_id | uuid | não | FK → `churches(id)` |
| name | text | não | Nome válido |
| status | text | não | CHECK em ATIVO, INATIVO |
| ended_at | timestamptz | sim | — |
| created_at, updated_at | timestamptz | não | — |

Chaves: UNIQUE(church_id, id), alvo de FKs compostas; UNIQUE (church_id, nome em minúsculas), valendo para todos os status.

`ministry_memberships` (MEM-002; E2):

| Coluna | Tipo | Nulo | Regra |
|---|---|---|---|
| id | uuid | não | PK |
| church_id | uuid | não | — |
| ministry_id | uuid | não | — |
| user_id | uuid | não | — |
| role | text | não | CHECK em LEADER, MEMBER |
| status | text | não | CHECK em ATIVO, INATIVO |
| ended_at | timestamptz | sim | — |
| created_at, updated_at | timestamptz | não | — |

FKs:
- (church_id, ministry_id) → `ministries(church_id, id)`;
- (church_id, user_id) → `church_memberships(church_id, user_id)`.

Chaves: UNIQUE(church_id, ministry_id, user_id), que garante um vínculo por (ministério, usuário) e leva `church_id` pela ARQ-F002-14; UNIQUE(ministry_id, id), alvo de FKs compostas.

`ministry_functions` (FUNCOES; DATA-DEC-013):

| Coluna | Tipo | Nulo | Regra |
|---|---|---|---|
| id | uuid | não | PK |
| church_id | uuid | não | — |
| ministry_id | uuid | não | — |
| name | text | não | Nome válido |
| status | text | não | CHECK em ATIVO, INATIVO |
| ended_at | timestamptz | sim | — |
| created_at, updated_at | timestamptz | não | — |

FK: (church_id, ministry_id) → `ministries(church_id, id)`.

Chaves: UNIQUE(ministry_id, id), alvo de FKs compostas; UNIQUE (church_id, ministry_id, nome em minúsculas), valendo para todos os status, com `church_id` pela ARQ-F002-14.

`ministry_member_functions` (habilitações; `FLUXO-MEMBROS` passo 4; E3):

| Coluna | Tipo | Nulo | Regra |
|---|---|---|---|
| church_id | uuid | não | — |
| ministry_id | uuid | não | — |
| ministry_membership_id | uuid | não | — |
| ministry_function_id | uuid | não | — |
| created_at | timestamptz | não | — |

PK: (church_id, ministry_membership_id, ministry_function_id), com `church_id` pela ARQ-F002-14.

FKs:
- (church_id, ministry_id) → `ministries(church_id, id)`;
- (ministry_id, ministry_membership_id) → `ministry_memberships(ministry_id, id)`;
- (ministry_id, ministry_function_id) → `ministry_functions(ministry_id, id)`.

`audit_log` (DATA-DEC-021; `seguranca/AUDITORIA`):

| Coluna | Tipo | Nulo | Regra |
|---|---|---|---|
| id | uuid | não | PK |
| church_id | uuid | não | FK → `churches(id)` |
| actor_user_id | uuid | não | FK → `users(id)` |
| action | text | não | Não vazio; sem lista de valores |
| entity_type | text | não | Não vazio; sem lista de valores |
| entity_id | uuid | não | — |
| before_data | jsonb | sim | — |
| after_data | jsonb | sim | — |
| occurred_at | timestamptz | não | Default "agora" |

CHECK: ao menos um entre `before_data` e `after_data` preenchido. Sem `created_at` nem `updated_at`.

**D6 — Imutabilidade de `audit_log`**
- Função de trigger `mescala.prevent_audit_log_change()` que lança exceção citando a DATA-DEC-021:
  - trigger BEFORE UPDATE OR DELETE, por linha;
  - trigger BEFORE TRUNCATE, por comando.
- Propriedades: SECURITY INVOKER, `search_path` fixo, EXECUTE retirado de `PUBLIC`.

**D7 — Privilégios de `mescala_app` (matriz fechada)**

| Tabela | SELECT | INSERT | UPDATE (só estas colunas) | DELETE / TRUNCATE / REFERENCES / TRIGGER |
|---|---|---|---|---|
| users | não | não | não | não |
| churches | sim | sim | name, status, ended_at | não |
| church_memberships | sim | sim | role, status, ended_at | não |
| ministries | sim | sim | name, status, ended_at | não |
| ministry_memberships | sim | sim | role, status, ended_at | não |
| ministry_functions | sim | sim | name, status, ended_at | não |
| ministry_member_functions | sim | sim | não | não |
| audit_log | não | sim, só nas colunas `church_id`, `actor_user_id`, `action`, `entity_type`, `entity_id`, `before_data`, `after_data` (ARQ-F002-15) | não | não |

Retirar todo privilégio de `PUBLIC`, `anon`, `authenticated`, `service_role` e `authenticator` em todas as tabelas e funções do schema.

**D8 — Policies (matriz fechada; todas permissivas, `TO mescala_app`, uma por comando)**

| Tabela | Comando | Predicado |
|---|---|---|
| churches | SELECT | `id` = contexto de igreja |
| churches | INSERT | WITH CHECK: `id` = contexto de igreja |
| churches | UPDATE | USING e WITH CHECK: `id` = contexto de igreja |
| church_memberships, ministries, ministry_memberships, ministry_functions | SELECT | `church_id` = contexto de igreja |
| (mesmas 4) | INSERT | WITH CHECK: `church_id` = contexto de igreja |
| (mesmas 4) | UPDATE | USING e WITH CHECK: `church_id` = contexto de igreja |
| ministry_member_functions | SELECT; INSERT | `church_id` = contexto de igreja (USING / WITH CHECK) |
| audit_log | INSERT | WITH CHECK: `church_id` = contexto de igreja **e** `actor_user_id` = contexto de usuário |
| users | — | **nenhuma** (nega tudo) |

- Nomes das policies: `<tabela>_<select|insert|update>_<tenant|tenant_actor>`.
- Otimização permitida, que não muda a semântica: avaliar a função de contexto uma vez por comando (subconsulta escalar).
- O cabeçalho da migration diz qual linha da matriz e qual item das seções 9 e 10 do Feature Contract cada policy implementa.
- Consequência para a CHURCH-001: o backend gera o `id` da igreja e define o contexto com ele antes de inserir a igreja, o OWNER e a auditoria.

**D9 — Migrations: ordem, objetivo e cabeçalho**

| # | Objetivo (nome do arquivo) | Conteúdo |
|---|---|---|
| 1 | `create_official_schema` | D1, D2, D3, D4 (só a função) |
| 2 | `create_users` | Tabela, trigger D4, RLS |
| 3 | `create_churches` | Tabela, trigger D4, RLS |
| 4 | `create_church_memberships` | Tabela, índices, trigger D4, RLS |
| 5 | `create_ministries` | Tabela, índices, trigger D4, RLS |
| 6 | `create_ministry_memberships` | Tabela, índices, trigger D4, RLS |
| 7 | `create_ministry_functions` | Funções + habilitações, índices, trigger D4, RLS |
| 8 | `create_audit_log` | Tabela, índice, D6, RLS |
| 9 | `grant_app_role_and_rls_policies` | D7 e D8, mais a retirada de privilégios das tabelas e funções |

O cabeçalho de cada arquivo traz:
- MIGRATION, DOMÍNIO e FEATURE: FOUNDATION-002;
- OBJETIVO;
- REGRAS, com a referência `arquivo#ID` da Brain;
- DEPENDÊNCIAS: migrations e objetos anteriores usados (é o equivalente da "relação externa");
- **COMO DESFAZER**: passos de reversão, porque a CLI não executa "down".

Dividir uma migration só se for necessário, com justificativa. Não juntar migrations.

**D10 — Nomes**
- Padrão 13.4:
  - `<tabela>_pkey`, `<tabela>_<colunas>_fkey`, `<tabela>_<colunas>_key`, `<tabela>_<regra>_check`, `<tabela>_<colunas>_idx`;
  - índices únicos de expressão ou parciais usam o sufixo `_key`.
- Nenhum identificador passa de **63 caracteres**. Por exemplo, a FK `(ministry_id, ministry_membership_id)` de `ministry_member_functions` passa do limite pelo padrão literal: quando passar, abreviar de forma documentada no cabeçalho.
- Todo objeto é qualificado com `mescala.`. Nada depende do `search_path`.

**D11 — Script de verificação (texto no DATA TASK RESULT; não é migration, não vai para `migrations/`)**
- V0: consultas somente leitura antes da aplicação: projeto vazio, linha de base de `public` e V0.4 (locale e `lower()` com letras acentuadas). Se o V0 falhar, nada é aplicado.
- V1: consultas somente leitura, numeradas, cada uma com o resultado esperado. Cobrem os itens V1.x do QA Contract, inclusive V1.21 a V1.24.
- V2: um único bloco anônimo que:
  - executa N1 a N13 e R1 a R10 em sub-blocos com tratamento de exceção;
  - acumula PASS ou FAIL por caso;
  - **termina sempre com um erro proposital** cuja mensagem contém o resumo.

  Assim tudo é desfeito, inclusive as linhas sintéticas em `auth.users` e o GRANT de verificação (R-12), qualquer que seja o modo de transação do SQL Editor.
- Se `postgres` não puder inserir em `auth.users`, os casos que dependem de usuário ficam marcados NOT TESTED, com o erro.
- Complementos do QA aprovados na revisão pré-aplicação: os casos do bloco A entram no V2 (um só bloco); o bloco B (plano administrativo, informativo) roda sozinho depois do V2; as consultas do bloco C entram no V0 e no V1.

**Relacionamentos esperados e cardinalidades:** seção 8 do Feature Contract.

**Constraints necessárias:** D5 e D6.

**Tenant isolation:**
- `church_id NOT NULL` em todas as tabelas de tenant, ligado por FK composta até a raiz;
- nenhum `church_id` "solto" sem FK que garanta a mesma igreja do pai;
- RLS por contexto (D8).
- toda unicidade que um INSERT do backend pode atingir inclui `church_id` (ARQ-F002-14).

**Índices esperados:**
- os criados pelas PKs e UNIQUEs do D5;
- `church_memberships(user_id)`, para "minhas igrejas";
- `ministry_memberships(church_id, user_id)`, para a FK E2 e para "meus ministérios";
- em `ministry_member_functions`, um índice para buscar por função, porque a escalação procura "quem pode exercer a função F";
- `audit_log(church_id, occurred_at)`.

Índice extra só com justificativa no DATA MODEL SUMMARY.

**Transação envolvida:** seção 11 do Feature Contract.

**Riscos:** seção 5.3, itens R-02 a R-12, R-14 e R-16 a R-19.

**Não implementar nada fora deste escopo.** Em particular:
- atributos de `users`;
- `address`;
- status de usuário;
- policies de `users` ou por usuário;
- DELETE;
- SECURITY DEFINER;
- extensões;
- seeds;
- tabelas da FOUNDATION-004 ou de convites;
- qualquer objeto em `public`.

---

## 8. BACKEND IMPLEMENTATION TASK

```text
Feature:          FOUNDATION-002 — Fundação de Persistência (v2)
Domínio:          foundation
Responsabilidade: só a estrutura da Supabase CLI em /backend. Nenhum código TypeScript.
```

**Arquivos esperados:**
1. `backend/supabase/config.toml` (novo).
2. `backend/.gitignore` (alterado: acrescentar uma seção).

**Por que um arquivo mínimo, e não `supabase init` (ARQ-F002-10):**
- O `supabase init` da CLI 2.x gera um `config.toml` completo, com valores padrão da stack local, e um `supabase/.gitignore`. Também pode oferecer configurações de editor para Deno. Esse é o comportamento conhecido da CLI; o comando não foi executado nesta análise.
- Os valores padrão incluem seções de Auth que valem só para a stack local. Versioná-los criaria uma falsa "fonte" da configuração do projeto oficial e um risco real com `supabase config push` (R-03).
- A CLI funciona com um `config.toml` mínimo. Evidência: o `supabase/config.toml` legado tem só `project_id`, e a CLI foi vinculada ali (`supabase/.temp/project-ref`).
- A mesma evidência mostra que `project_id` **não** vincula ao projeto remoto. Quem vincula é o `supabase link`, que grava em `supabase/.temp/`. Foi exatamente a divergência D4.

**Regras:**
- `config.toml`:
  - começa com um cabeçalho didático em comentários TOML (`#`): ARQUIVO, DOMÍNIO (foundation), FEATURE (FOUNDATION-002), OBJETIVO ("configuração própria da Supabase CLI para as migrations oficiais; DEC-04 parte 1");
  - traz três AVISOS:
    1. o vínculo efetivo com o projeto remoto é feito pelo PO com `supabase link --project-ref vitqnyzuvrvkmnvshcpb` e gravado em `supabase/.temp/`, que é ignorado;
    2. as configurações do projeto remoto (Auth, Data API) vivem no painel; este arquivo não é fonte delas, e `supabase config push` é proibido;
    3. a CLI roda sempre a partir de `/backend`; a `supabase/` da raiz é do legado;
  - conteúdo funcional: **só** `project_id = "vitqnyzuvrvkmnvshcpb"`, coerente com o vínculo (evita a repetição da D4). Nenhuma outra chave ou seção.
- `backend/.gitignore`: acrescentar a seção comentada "Supabase CLI (cache local e vínculo com o projeto; nunca versionar)", com `supabase/.temp/` e `supabase/.branches/`. O `.env*` existente já cobre `.env` em qualquer nível.
- Não criar `backend/supabase/migrations/`: é do Analista.
- Não criar `functions/`, `seed.sql`, `tests/`, `.temp/` nem qualquer `.ts` ou `.js` em `backend/supabase/`.
- Nada em `backend/src`; nada em `package.json` nem no lockfile; nenhum `.env` nem `.env.example`; nenhum script npm para a CLI.

**Comandos:**
- Permitidos: `npm run typecheck`, `npm run lint`, `npm run build`, `git status`, `git diff`.
- Proibidos: **qualquer** comando `supabase` (inclusive `init` e `link`), instalação de dependência e commit.

**Validações:**
- os três scripts passam;
- `git status` mostra só esses 2 arquivos, além das migrations do Analista se já existirem.

**Por que não interfere na FOUNDATION-001:**
- o `include` do `tsconfig` cobre só `next-env.d.ts`, `next.config.ts`, `src/**/*.ts` e `.next/types`;
- o `eslint .` só analisa JS/TS, e `backend/supabase/` não terá nenhum;
- o `next build` só compila `src/app` e o que é importado;
- o `eslint.config.js` da raiz já ignora `backend`.

**Não se aplicam:** autorização, transação, auditoria, Vitest (seção 10).

**Critérios de aceite:** 21, 22 e 23 do Feature Contract.

**Fora de escopo:** seção 20 do Feature Contract.

---

## 9. ORGANIZATION TASK

```text
Feature: FOUNDATION-002
Domínio principal: foundation
Domínios secundários: auth, church, ministry, member, audit (só no banco; nenhuma pasta em backend/src)
```

**Estrutura esperada ao fim:**
```text
backend/
├── .gitignore                       (alterado: seção Supabase CLI)
├── supabase/
│   ├── config.toml                  (Desenvolvedor)
│   └── migrations/                  (Analista de Dados)
│       ├── <ts1>_create_official_schema.sql
│       ├── <ts2>_create_users.sql
│       ├── <ts3>_create_churches.sql
│       ├── <ts4>_create_church_memberships.sql
│       ├── <ts5>_create_ministries.sql
│       ├── <ts6>_create_ministry_memberships.sql
│       ├── <ts7>_create_ministry_functions.sql
│       ├── <ts8>_create_audit_log.sql
│       └── <ts9>_grant_app_role_and_rls_policies.sql
└── (resto da FOUNDATION-001 inalterado)
```

**Dependências permitidas:** as migrations dependem só das anteriores e de `auth.users`.

**Dependências proibidas:**
- referência às migrations ou à configuração da `supabase/` da raiz;
- qualquer import de `backend/src` para `backend/supabase` ou o contrário.

**Possíveis violações a apontar** (ORPHAN FILE DETECTED / STRUCTURAL DEBT):
- `.ts`, `.js` ou `.jsx` em `backend/supabase/`;
- `functions/`, `seed.sql`, `tests/`, `.temp/` ou `.branches/` versionados;
- um `.gitignore` duplicado dentro de `backend/supabase/`;
- pastas vazias em `backend/src` "para o banco";
- migrations fora de `backend/supabase/migrations/`;
- qualquer mudança na `supabase/` da raiz;
- `backend/app/`, `pages/`, `middleware.*` ou `proxy.*` (L-02).

Pela definição do Organizador, `backend/supabase/` não é movida, renomeada nem reorganizada. O Organizador não muda regras nem conteúdo SQL.

---

## 10. QA CONTRACT

```text
Feature: FOUNDATION-002 — Fundação de Persistência (v2)
```

**O QA recebe:**
- Feature Contract, Data Task (especificação física vinculante), Backend Implementation Task e Organization Task;
- DATA TASK RESULT (com o script D11), BACKEND IMPLEMENTATION RESULT e REPOSITORY ORGANIZATION RESULT;
- na fase 2, as saídas do PO.

**Limites:**
- não acessa o banco remoto, não cria usuários reais e não aplica nada;
- não instala nem usa Vitest nesta feature.

### Fase 1 — revisão estática (antes da aplicação)

| # | Checagem |
|---|---|
| S1 | 9 arquivos: nomes, formato, timestamps crescentes, um objetivo por arquivo, ordem do D9. Cabeçalho completo, inclusive COMO DESFAZER |
| S2 | Sem BEGIN/COMMIT e sem comandos não transacionais. Nenhum objeto em `public`; nenhum DDL em `auth`. Nenhuma referência ao legado |
| S3 | Todos os objetos qualificados com `mescala.`; nada depende de `search_path` |
| S4 | Sem segredo: procurar PASSWORD, LOGIN, `postgres://`, `postgresql://`, `sb_`, `eyJ`, chaves. `service_role` só aparece em retirada de privilégio |
| S5 | Exatamente 4 funções, nenhuma SECURITY DEFINER, `search_path` fixo, semântica do D3 (NULL quando o parâmetro falta ou está vazio) |
| S6 | Todo CREATE TABLE tem RLS habilitado no mesmo arquivo; nenhum FORCE |
| S7 | Toda FK com RESTRICT e NO ACTION; nenhum CASCADE, SET NULL ou SET DEFAULT |
| S8 | FKs compostas E1 a E3 exatamente como no D5; `church_id` ligado até a raiz em todas as tabelas de tenant |
| S9 | Valores de CHECK exatamente como na Brain, em MAIÚSCULAS; status da Igreja conforme B-02 |
| S10 | Unicidades do D5, inclusive o OWNER parcial e os nomes sem diferenciar maiúsculas |
| S11 | Grants exatamente pela matriz D7, inclusive o UPDATE por coluna e o INSERT por coluna em `audit_log` (ARQ-F002-15); retirada de privilégios de PUBLIC, anon, authenticated, service_role e authenticator; sem DELETE, TRUNCATE, REFERENCES ou TRIGGER |
| S12 | Policies exatamente pela matriz D8: `TO mescala_app`, permissivas, por comando, nomes no padrão. Nenhuma em `users` |
| S13 | Identificadores com no máximo 63 caracteres; padrão 13.4 (D10) |
| S14 | Escopo: nenhuma tabela ou coluna além do D5 (critério 25) |
| S15 | `config.toml` exatamente como na seção 8; `.gitignore`; nada mais em `backend/supabase/` |
| S16 | Regressão: typecheck, lint e build passam. `package.json` e lockfile inalterados em relação ao commit que encerrar a AUTH-001 (S5 da DEC-08 sem dependência nova). Nenhum `.jsx` (L-06). `git diff --stat` fora de `/backend` vazio, exceto `docs/` e a sincronização do vault-brain em `brain-mescala/` |
| S17 | Script D11: cobre V1 e V2; termina sempre em erro proposital; nenhuma escrita persistente; casos adversariais complementados pelo QA quando houver risco real (complementos A, B e C da fase 1, aprovados na revisão pré-aplicação) |
| S18 | Fase 1b (delta da VERSÃO 2): só mudaram os trechos listados na revisão pré-aplicação; ARQ-F002-14 e 15 implementadas; comentários atualizados; V1.8, V1.14b, V1.14c e o total do V2 atualizados no DATA TASK RESULT; script integrado conferido |

Resultado da fase 1: APPROVED, CHANGES_REQUIRED ou BLOCKED, mais recomendação. Só com APPROVED segue para a revisão pré-aplicação do Arquiteto.

### Fase 2 — avaliação das saídas do PO

**V0 — antes da aplicação, somente leitura:** projeto vazio (V0.1, V0.2); linha de base de `public` (V0.3 a V0.3c); V0.4: versão, locale e teste de `lower()` com letras acentuadas (tem de igualar maiúsculas e minúsculas acentuadas). Qualquer outro resultado impede a aplicação (A2b).

**V1 — catálogo, somente leitura** (resultado esperado entre parênteses):

| # | Checagem |
|---|---|
| V1.1 | Versão do Postgres (registrar) |
| V1.2 | `supabase_migrations.schema_migrations` (exatamente as 9 versões), se a aplicação foi pela CLI |
| V1.3 | O schema existe e tem dono `postgres` |
| V1.4 | Tabelas do schema (exatamente as 8) |
| V1.5 | Colunas, tipos, nulidade e defaults (iguais ao D5) |
| V1.6 | `relrowsecurity` verdadeiro e `relforcerowsecurity` falso nas 8 |
| V1.7 | Definições de PK, UNIQUE, CHECK e FK. Toda FK com ação de exclusão RESTRICT e de atualização NO ACTION; nenhuma CASCADE, SET NULL ou SET DEFAULT |
| V1.8 | Índices, inclusive o parcial do OWNER e os de nome em minúsculas |
| V1.9 | FK para `auth.users` presente, em RESTRICT |
| V1.10 | Nomes de todos os objetos (nenhum truncado; padrão D10) |
| V1.11 | Triggers: `updated_at` nas 6 tabelas; 2 triggers de imutabilidade em `audit_log` |
| V1.12 | Funções (exatamente 4): SECURITY INVOKER, `search_path` fixo, EXECUTE pela regra do D3 |
| V1.13 | Atributos de `mescala_app` (todos falsos). Ele é membro de nenhum papel. Membros de `mescala_app`: nenhum, exceto a concessão implícita com ADMIN OPTION ao `postgres` que o Postgres 16+ registra quando ele cria o papel |
| V1.14 | Privilégios em tabelas e colunas iguais ao D7. `PUBLIC`, `anon`, `authenticated`, `service_role` e `authenticator` sem USAGE no schema e sem privilégio. Nenhuma sequence |
| V1.15 | Policies iguais ao D8 |
| V1.16 | Privilégios padrão do schema: nenhum concedido |
| V1.17 | Nenhum objeto criado em `public` |
| V1.18 | Data API: confirmação do PO (A6) |
| V1.19 | Saída do V2 |
| V1.20 | Resíduo: contagem de linhas das 8 tabelas (0) e nenhuma participação nova em papéis |
| V1.21 | Publicações que incluem tabelas de `mescala` (nenhuma); publicações FOR ALL TABLES (nenhuma; registrar se houver) |
| V1.22 | Locale do banco (registrar; quem decide é o V0.4) |
| V1.23 | SET concedido em parâmetros: nada que dê `session_replication_role` ou `row_security` a `PUBLIC`, `mescala_app` ou papéis da Data API |
| V1.24 | Event triggers da plataforma (registrar; cruzar com o V1.14) |

**V2 — testes negativos, desfeitos no fim:**

Estrutura (como `postgres`):

| # | Caso | Erro esperado |
|---|---|---|
| N1 | Função com `church_id` da igreja B num ministério da igreja A | 23503 |
| N2 | Vínculo com ministério de quem não tem vínculo com a igreja | 23503 |
| N3 | Habilitação que mistura vínculo de M1 e função de M2, na mesma igreja | 23503 |
| N4 | Segundo OWNER na igreja | 23505 (OWNER em outra igreja: aceito) |
| N5 | Vínculo com a igreja duplicado | 23505 |
| N6 | Vínculo com o ministério duplicado | 23505 |
| N7 | "Louvor" e "LOUVOR" na mesma igreja | 23505 (o mesmo nome em outra igreja: aceito) |
| N8 | O equivalente de N7 para funções no ministério | 23505 (o mesmo nome em outro ministério: aceito) |
| N9 | Valores inválidos: minúsculas; LEADER na igreja; OWNER ou ADMIN no ministério; status fora da lista | 23514 |
| N10 | Nome vazio, só com espaços ou com espaço nas pontas | 23514 |
| N11 | Excluir igreja com dependentes; excluir linha de `auth.users` referenciada | 23503 |
| N12 | UPDATE, DELETE ou TRUNCATE em `audit_log` | P0001 |
| N13 | Auditoria sem `before_data` nem `after_data` | 23514 |

Acesso (como `mescala_app`):

| # | Caso | Resultado esperado |
|---|---|---|
| R1 | Sem contexto | SELECT devolve 0 linhas em todas as tabelas; INSERT dá 42501 |
| R2 | Contexto A | Só dados de A em todas as tabelas e em `churches` |
| R3 | Contexto A, INSERT com `church_id` de B | 42501 |
| R4 | Contexto A, UPDATE em linhas de B; UPDATE de `church_id`, `ministry_id` ou `user_id` | 0 linhas; 42501 (privilégio de coluna) |
| R5 | DELETE ou TRUNCATE em qualquer tabela | 42501 |
| R6 | Qualquer acesso a `users` | 42501 |
| R7 | `audit_log`: INSERT com ator do contexto; ator ou igreja diferente do contexto; SELECT | Aceito; 42501; 42501 |
| R8 | `churches`: INSERT com `id` diferente do contexto; UPDATE da igreja B | 42501; 0 linhas |
| R9 | Contexto com valor que não é UUID | 22P02 |
| R10 | Como `anon`, `authenticated` e `service_role`, qualquer acesso ao schema | 42501 |

Complementos do QA (fase 1), aprovados na revisão pré-aplicação e integrados ao V2:

| Grupo | Caso | Resultado esperado |
|---|---|---|
| QP1 a QP9 | Caminho feliz como `mescala_app`: INSERT e UPDATE permitidos; fluxo da CHURCH-001 num só comando; trigger de `updated_at` | Aceito |
| QM1 a QM5 | Promoção a segundo OWNER; UPDATE de `created_at`, `updated_at` ou de chave; upsert que muda chave | 23505; 42501 |
| QM6, QM7 | INSERT em `audit_log` informando `occurred_at` ou `id` (ARQ-F002-15) | 42501 |
| QC1 a QC4 | Contexto incompleto ou malformado; igreja sem `id` | 42501; 22P02 |
| QD1 a QD7 | Como `mescala_app`: DDL em trigger, desligar RLS, `session_replication_role`, CREATE, CREATE POLICY. Como `postgres`: `TRUNCATE … CASCADE` | 42501; P0001 |
| QA1, QA2 | `service_role` e `authenticator` | 42501 (QA2 pode sair NOT TESTED) |
| QT1 a QT4 | Contexto A, INSERT com vínculo, nome de função ou habilitação que existem na igreja B, inclusive com `ON CONFLICT DO NOTHING` | 23503 (ARQ-F002-14) |
| QI2 | "Recepção" e "RECEPÇÃO" no mesmo escopo | 23505 |
| QI3, QI4 | JSON `null` em `before_data` (RD); CREATE em `public` como `mescala_app` | Registrar; um CREATE aceito em `public` é achado para a FOUNDATION-003, não falha desta feature |

Bloco B (como `postgres`, sozinho, depois do V2): I1 (`session_replication_role = replica`) e I2 (`DISABLE TRIGGER` pelo dono) contra a imutabilidade de `audit_log`. Informativo: CONTORNADO é o R-16, não falha.

### Cenários mínimos exigidos

| Cenário | Cobertura |
|---|---|
| Happy path | Aplicação limpa das 9 migrations; V1 confere |
| Invalid input | N9, N10, N13, R9 |
| Unauthorized | R10; V1.14 |
| Forbidden | R4, R5, R6, R7 |
| Cross-tenant access | N1 a N3, R2 a R4, R8, QT1 a QT4 |
| Transaction rollback | S2; regra de falha do Anexo A5; V1.20 sem resíduo |
| Dependency failure | R1 (contexto ausente: falha fechada); N11 (`auth.users` com RESTRICT) |
| Regression | S16; `/api/health` intocado (nada em `src/` mudou) |
| Específicos da feature | N4 (IGR-001), N2 (E2), N3 (E3), N12 (DATA-DEC-021), S4 (segredos), S13 e V1.10 (63 caracteres), V1.18 (Data API), QM6 e QM7 (ARQ-F002-15), V0.4 e QI2 (DATA-DEC-013 com acentos) |

### NOT TESTED (com motivo)

| # | Item | Motivo |
|---|---|---|
| NT-01 | Acesso real do backend: papel de login, pooler, transação com contexto | Fica para a FOUNDATION-003 |
| NT-02 | Comportamento da Data API além dos privilégios e do painel | O QA não acessa o projeto; vale a confirmação do PO |
| NT-03 | Testes automatizados (ver avaliação do Vitest) | Sem banco de teste |
| NT-04 | Desempenho das policies | Tabelas vazias |
| NT-05 | Concorrência (por exemplo, dois OWNER ao mesmo tempo) | Garantida pelo índice, mas não exercitada |
| NT-06 | Casos que dependem de `auth.users` | Só se o PO não puder inserir linhas sintéticas |
| NT-07 | Ensaio da aplicação num banco descartável (Supabase local via Docker ou projeto de teste) | Opcional, não exigido |

### Avaliação do Vitest

**Nesta feature, nenhum teste Vitest.**
1. A DEC-02 instala o Vitest na AUTH-001, não aqui.
2. Não há banco local nem de teste configurado. Um teste Vitest não executaria SQL.
3. Testes de texto sobre os arquivos SQL (expressões regulares) seriam frágeis e duplicariam a revisão S1 a S17.

Testes automatizados de banco, como integração Vitest contra um banco descartável ou pgTAP via `supabase test db` com a stack local, dependem de decidir o ambiente de banco de teste. Proposta: decidir na FOUNDATION-003.

**Resultado final:** QA RESULT da fase 2, com recomendação: `READY_FOR_ARCHITECT_REVIEW`, `RETURN_TO_DATA_ANALYST` (corrigir com **nova** migration, se a falha estiver numa migration já aplicada), `RETURN_TO_DEVELOPER` ou `ARCHITECTURAL_DECISION_REQUIRED`.

---

## 11. Dependências entre features

```text
FOUNDATION-001 (encerrada, 7f26d30)
 ├── AUTH-001 Fundação de Autenticação (sem banco; paralela; instala o Vitest)
 └── FOUNDATION-002 Fundação de Persistência  [READY v2; aplicação pelo PO pendente]
       ├── FOUNDATION-003 Cliente de banco do backend (proposta)  [DEC-04 parte 2]
       │     └── (+ AUTH-001) AUTH-002 Provisionamento do usuário  [DEC-06]
       │            └── AUTH-003 Usuário atual  [DEC-07; B8 da AUTH-001]
       │                   └── CHURCH-001 Criar igreja
       │                          └── CHURCH-002 Contexto de igreja da requisição
       │                                 └── ministérios, membros, funções…
       ├── FOUNDATION-004 Programação, escala e impedimentos (proposta)  [B-03]
       └── Convites (feature própria; ID a definir)  [B-04; fluxo do convite]
```

**FOUNDATION-002:**
- **DEPENDS_ON:**
  - FOUNDATION-001 (cumprida);
  - ADR-002, ADR-003, DEC-04 parte 1, DEC-05 e DEC-09 (aceitos);
  - B-01 e B-02 (respondidos em 2026-10-22);
  - autorização da Fase 4 (concedida em 2026-10-22).
- **BLOCKS:** FOUNDATION-003, AUTH-002, AUTH-003, CHURCH-001, CHURCH-002, FOUNDATION-004, Convites e toda feature com banco.
- **RELATED_TO:**
  - AUTH-001, em paralelo: único ponto de contato é `backend/.gitignore`. A AUTH-001 não depende desta feature, e esta não depende dela;
  - DEC-06, DEC-07 e B8 da AUTH-001;
  - DEC-08;
  - L-06 e RT-FOUND-01: não acionados, porque nenhum lint nem dependência muda.

**O que cada feature seguinte herda e precisa trazer:**

| Feature | Herda | Precisa trazer (no próprio contrato e Data Task) |
|---|---|---|
| FOUNDATION-003 | `mescala_app`, parâmetros de contexto, funções de contexto | Decisão da DEC-04 parte 2. Papel de login (PO, fora do repositório). Conexão e pooler. Transação explícita que define os dois parâmetros com `set_config(..., true)`, nunca na sessão. Ambiente de banco de teste |
| AUTH-002 | `users` (âncora) | Colunas da DATA-DEC-013, com a obrigatoriedade da DEC-06. Grants e policies de `users`. Mecanismo `sub` → `users.id` sob RLS (por exemplo, um parâmetro de contexto do `sub`). `auth_user_id` imutável |
| AUTH-003 | — | Resolução do usuário atual. Status do usuário, se o B8 escolher A ou C |
| CHURCH-001 | Policies de tenant em `churches` e `church_memberships`; `audit_log` | Coluna `address` e sua obrigatoriedade. Na mesma transação: gerar o `id`, definir o contexto, inserir igreja, OWNER e auditoria |
| CHURCH-002 | — | Policies SELECT por usuário (os próprios vínculos e "minhas igrejas"). Validação do vínculo ATIVO antes de definir o contexto (R-01). Também precisa resolver **como a igreja atual chega à API**, que é dependência desta feature futura e não do banco (`tecnico/API`: A DEFINIR) |
| FOUNDATION-004 | Padrão completo | `programs` (`starts_at`, `ends_at`, fim depois do início). `program_ministries`. `schedules` (RASCUNHO, PUBLICADA, CONCLUIDA; a escala nunca é cancelada; UNIQUE(programação, ministério)). `allocations` (5 status, data da resposta, substituição na mesma escala, unicidade de B-03). Impedimentos (por pessoa na igreja; INSERT só pelo próprio usuário, DIS-001; nome da tabela a fixar) |
| Convites | Padrão completo | B-04, o fluxo documentado na Brain e a policy de aceite entre igrejas |

**Requisitos acrescentados na VERSÃO 2:**
- **Toda feature com migration:** convenções ARQ-F002-14 (unicidade com `church_id`; na FOUNDATION-004, por exemplo, o UNIQUE(programação, ministério) de `schedules` já nasce com `church_id`), ARQ-F002-16 (privilégios explícitos; V1.12b e V1.14b a V1.14d como regressão fixa) e R-19 (timestamp maior que o da última migration da pasta).
- **FOUNDATION-003:** um único helper de transação define o contexto, só com `set_config(..., true)`, e um teste com duas transações seguidas na mesma conexão mostra que o contexto some depois de COMMIT e de ROLLBACK. O banco de teste precisa dos papéis do Supabase e de `auth.users` (stack local do Supabase ou equivalente; OBS-04 do Analista).
- **Primeira feature que gravar `audit_log` (CHURCH-001):** o helper de auditoria grava SQL NULL, nunca JSON `null`, em `before_data` e `after_data` (RD); não informa `id` nem `occurred_at` (ARQ-F002-15); não usa RETURNING.
- **Features que recebem IDs do cliente:** o backend nunca grava `id` vindo do cliente como chave de linha nova (exceção da ARQ-F002-14).

---

## 12. Bloqueios

### B-01 — BLOQUEIO DE DOMÍNIO: nome do schema dedicado (RESOLVIDO em 2026-10-22: `mescala`)
- **Onde está marcado:**
  - `decisoes/DEC-09-MODELO-DE-DADOS` (DATA-DEC-020: "nome do schema"; lacunas observadas);
  - `decisoes/PENDENCIAS` ("Lacunas observadas no registro de 2026-10-21");
  - `seguranca/ISOLAMENTO-DE-DADOS` ("Nome do schema dedicado: **A DEFINIR**");
  - `tecnico/BANCO-DE-DADOS`.
- **O que a Brain decide:** o schema é dedicado e fica fora da Data API. `mescala` é só exemplo do relatório.
- **Opções:**
  - A) `mescala`: nome do produto; não colide com schemas do Supabase; é o exemplo do relatório.
  - B) `app`.
  - C) Outro nome, minúsculo, que não colida com schemas do Supabase.
- **Recomendação:** A.
- **Bloqueia:** toda a FOUNDATION-002.

### B-02 — BLOQUEIO DE DOMÍNIO: valores do status da Igreja (RESOLVIDO em 2026-10-22: ATIVO, INATIVO)
- **Onde está marcado:**
  - `dados/STATUS` ("Igreja… Valores: **A DEFINIR**");
  - `modulos/IGREJAS`;
  - `dados/ENTIDADES`;
  - `05-REGRAS-DE-NEGOCIO#HIS-001`;
  - `decisoes/DEC-09` (DATA-DEC-012: "Continua A DEFINIR");
  - `decisoes/PENDENCIAS`.
- **O que a Brain decide:** a Igreja ganha status e data de término, e nada é apagado (DATA-DEC-012).
- **Opções:**
  - A) ATIVO, INATIVO: o mesmo conjunto decidido em 2026-10-22 para vínculos, ministérios e **funções** (que também é palavra feminina). O CHECK fica idêntico em todas as entidades que podem ser inativadas.
  - B) ATIVA, INATIVA: concordância com o gênero de "Igreja", como em PUBLICADA (Escala) e CONFIRMADA (Alocação).
  - C) Outro conjunto (por exemplo, com um estado de suspensão), com o significado de cada estado documentado antes na Brain.
- **Recomendação:** A.
- **Não decide:** o efeito de uma igreja inativa (acesso, leitura, escrita). Isso fica para a feature que inativar a igreja.
- **Bloqueia:** `churches` e, por FK, as demais tabelas de tenant.

### B-03 — BLOQUEIO DE DOMÍNIO: quais status de alocação contam como "ativa" (bloqueia a FOUNDATION-004, não esta; RESOLVIDO em 2026-10-22: opção A)
- **Onde está marcado:**
  - `05-REGRAS-DE-NEGOCIO#ESC-005` ("**A DEFINIR**: quais status contam como ativa");
  - `dados/STATUS#Alocação`;
  - `modulos/ESCALAS`;
  - `fluxos/FLUXO-ESCALAS`;
  - DEC-09 (DATA-DEC-014);
  - PENDENCIAS.
- **Status existentes:** AGUARDANDO_CONFIRMACAO, CONFIRMADA, RECUSADA, SUBSTITUICAO_PENDENTE, SUBSTITUIDA.
- **Opções:**
  - A) Contam AGUARDANDO_CONFIRMACAO e CONFIRMADA, isto é, quando a pessoa vai ou pode ir servir. Quem recusou, quem está em substituição pendente e quem foi substituído pode ser alocado de novo, em outra função da mesma escala. Se uma recusa voltar para AGUARDANDO_CONFIRMACAO enquanto houver outra alocação ativa, o banco barra.
  - B) Contam todos os status, exceto SUBSTITUIDA. A pessoa fica "ocupada" até a substituição terminar: quem recusou a função X não pode ser posta na Y antes de a X ser substituída.
  - C) Contam todos os status. A pessoa aparece no máximo uma vez por escala, inclusive no histórico: quem foi substituído nunca volta àquela escala.
- **Recomendação:** A. É a que corresponde ao objetivo da ESC-005: uma função por pessoa entre as que vão servir.
- **Bloqueia:** o índice único parcial de `allocations`, na FOUNDATION-004.

### B-04 — BLOQUEIO DE DOMÍNIO: convites (fluxo, transições e papel pretendido) (escopo RESOLVIDO em 2026-10-22: opção A; fluxo e transições ficam para o contrato da feature de convites)
- **Onde está marcado:**
  - `05-REGRAS-DE-NEGOCIO#MEM-003` ("**A DEFINIR**: o fluxo de convite, inclusive as transições");
  - `dados/STATUS#Convite` ("Transições: **A DEFINIR**");
  - `dados/ENTIDADES#Convite`;
  - `04-USUARIOS-E-PERMISSOES`;
  - `FLUXO-MEMBROS` e `FLUXO-EQUIPES`;
  - DEC-09 (DATA-DEC-011).
- **O que a Brain não fecha:**
  - (a) as transições entre PENDENTE, ACEITO, EXPIRADO e CANCELADO;
  - (b) os valores do "papel pretendido" e o que significa um convite **sem** ministério. A MEM-003 só fala em convite de líder e de membro, e a DATA-DEC-011 diz "ministério (opcional)". Sem isso, o CHECK do papel e a coerência com `ministry_id` não podem ser escritos;
  - (c) o aceite por quem ainda não é membro exige leitura entre igrejas pelo hash do token, e essa policy depende do fluxo.
- **Opções de escopo:**
  - A) Tirar `invitations` da fundação. A tabela nasce no Data Task da feature de convites, quando o fluxo for documentado na Brain.
  - B) Criar agora, com o papel pretendido em {LEADER, MEMBER} e ministério obrigatório. Isso exige ajustar a DATA-DEC-011, que diz "ministério opcional".
  - C) Criar agora com convite de igreja sem ministério. O PO define o conjunto de papéis (por exemplo, ADMIN ou MEMBER) e a regra de coerência.
- **Transições, se o PO quiser responder já** (senão, ficam para o contrato da feature de convites):
  - PENDENTE → ACEITO (aceite);
  - PENDENTE → CANCELADO (por quem pode convidar);
  - PENDENTE → EXPIRADO (prazo vencido);
  - os outros três estados são finais; reenviar é criar um novo convite.
- **Recomendação:** A, com as transições decididas no contrato da feature de convites.
- **Bloqueia:** a feature de convites. Com a opção A, não bloqueia a FOUNDATION-002.

### Dependência de feature futura (não é do banco)
- **Como a igreja atual chega à API** (`tecnico/API`: **A DEFINIR**; DATA-DEC-006): fica para a CHURCH-002. O banco só recebe o contexto já validado.

### Lacunas não bloqueantes, resolvidas por adiamento explícito
- Obrigatoriedade dos atributos de `users`: na AUTH-002, com a DEC-06.
- `churches.address`: na CHURCH-001.
- Status ou revogação do usuário: na AUTH-003 (B8 da AUTH-001).
- Revogar uma habilitação: exclusão com auditoria, ou status? Na feature de funções do membro. Aqui não há DELETE.
- Acoplamento entre status e `ended_at`: nas features de inativação (ARQ-F002-09).
- Cancelamento de Programação: na FOUNDATION-004 e na feature de programações. Nada decidido.
- O que é "excluir" o membro: na feature de escalas (DIS-001).
- Ambiente de banco de teste: na FOUNDATION-003.
- Regras de autorização abertas (o ADMIN gerencia todos os ministérios? o que o LEADER faz fora da escala? quem cria programações?): no backend, nas features. Não afetam o RLS de tenant.

### Pedido ao vault-brain (VERSÃO 2; substitui o da VERSÃO 1, que não foi executado)
Registrar agora (decisões já tomadas), sem marcar nada como aplicado:
- as respostas do PO de 2026-10-22 a B-01, B-02, B-03 e B-04, nos pontos que hoje dizem **A DEFINIR**;
- a Fase 4 autorizada e o contrato emitido (VERSÃO 2, READY), com 9 migrations escritas e **não aplicadas**, em `features/FLUXO-DE-ENTREGA` e numa nota `features/FOUNDATION-002`;
- a decomposição em FOUNDATION-003, FOUNDATION-004 e Convites, e a ordem vinculante das 9 migrations (D9);
- o mecanismo de contexto e o papel `mescala_app`, em `tecnico/BANCO-DE-DADOS` e `seguranca/ISOLAMENTO-DE-DADOS`;
- as convenções do schema oficial (ARQ-F002-14 e 16, R-19), em `tecnico/BANCO-DE-DADOS`;
- `audit_log` imutável para DML, `id` e `occurred_at` do banco (ARQ-F002-15) e o risco residual R-16, em `seguranca/AUDITORIA`.

Depois da ARCHITECT REVIEW final: registrar a aplicação (data, método, commit) e o estado do banco oficial.

Parei aqui. Não encaminhei nada aos executores.

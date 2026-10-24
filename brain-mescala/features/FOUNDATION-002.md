---
tipo: feature
id: FOUNDATION-002
dominio: foundation
status: encerrada
implementacao: aplicada
contrato: docs/features/FOUNDATION-002.md
contrato-versao: 2
contrato-status: READY
emitido: 2026-10-22
fase-4-autorizada: 2026-10-22
aplicacao: "2026-10-23 (SQL Editor, arquivo por arquivo, pelo PO)"
commit: "028f9ff (migrations aplicadas); 8ee70a6 (fechamento)"
revisao-final: "APPROVED_WITH_NOTES (2026-10-23)"
relacionado:
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]]"
  - "[[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]"
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
  - "[[tecnico/BANCO-DE-DADOS]]"
  - "[[seguranca/ISOLAMENTO-DE-DADOS]]"
  - "[[seguranca/AUDITORIA]]"
  - "[[features/FLUXO-DE-ENTREGA]]"
  - "[[features/FOUNDATION-001]]"
  - "[[features/AUTH-001]]"
  - "[[decisoes/PENDENCIAS]]"
atualizado: 2026-10-24
---
# FOUNDATION-002 — Fundação de Persistência

## Situação em 2026-10-24
- **Status:** **APLICADA e ENCERRADA.** ARCHITECT REVIEW final **APPROVED_WITH_NOTES** em 2026-10-23, que equivale a APPROVED na definição do [[agents/arquiteto|Arquiteto]]: nada voltou a nenhum executor, e restaram só pendências de documentação e registro ([[#Revisões do Arquiteto|revisões]]). A feature libera a FOUNDATION-003 e, em seguida, a AUTH-002 e a CHURCH-001.
- **Aplicação:** em **2026-10-23**, pelo PO, no projeto oficial `vitqnyzuvrvkmnvshcpb`, pelo **SQL Editor**, como `postgres`, um arquivo por vez, inteiro, na ordem dos timestamps (alternativa do A5 do contrato). A3 e A4 (pela CLI) não foram executados e a CLI não foi vinculada (`supabase link`); `backend/supabase/.temp` não existe. O V0 foi rodado em 2026-10-22. Resultado declarado pelo PO: "todas as migrations subiram limpas". Registro: [[tecnico/BANCO-DE-DADOS#Registro de migrations aplicadas|registro de migrations aplicadas]] e [[tecnico/BANCO-DE-DADOS#Estado do banco oficial em 2026-10-23|estado do banco oficial]].
- **Commits:**
  - `028f9ff` (2026-10-22), o **commit aplicado**: as 9 migrations, `backend/supabase/config.toml`, `backend/.gitignore`, a VERSÃO 2 do contrato e o DATA TASK RESULT (13 arquivos);
  - `8ee70a6`, o **commit de fechamento**: contrato com as substituições F-01 a F-18, DATA TASK RESULT com D-01 e D-02 e os 3 arquivos de evidência (5 arquivos);
  - a Brain foi atualizada antes no `f451be9`.
  - **Correção:** até este registro, esta nota dizia "nada commitado" e "VERSÃO 2 ainda não commitada". A VERSÃO 2 e o DATA TASK RESULT estão no `028f9ff`.
- **Contrato (fora do vault):** `docs/features/FOUNDATION-002.md`, emitido pelo Arquiteto em 2026-10-22, a pedido do PO. Contém ARCHITECT ANALYSIS, Feature Contract, Data Task, Backend Implementation Task, Organization Task, QA Contract, dependências e bloqueios. Versionado desde o commit `4039fe0` (VERSÃO 1); VERSÃO 2 no `028f9ff`; fechamento no `8ee70a6`.
  - **VERSÃO 1 (2026-10-22):** STATUS BLOCKED, por B-01, B-02 e pela autorização da Fase 4.
  - No mesmo dia, o PO respondeu B-01 a B-04, aceitando as recomendações do Arquiteto ([[decisoes/DEC-09-MODELO-DE-DADOS#Respostas do PO aos bloqueios da FOUNDATION-002|DEC-09]]), **autorizou a Fase 4** e aceitou, sem veto, as decisões técnicas ARQ-F002-01 a 13.
  - **VERSÃO 2 (2026-10-22), STATUS READY**, emitida na revisão pré-aplicação (ARQ-F002-11): marcadores trocados pelas respostas do PO; F002-QA-01 decidido (ARQ-F002-14); INSERT por coluna em `audit_log` (ARQ-F002-15); DIV-01 decidida (ARQ-F002-16); critério 11 lido como DML direto (R-16); riscos R-16 a R-19; critérios 2, 6, 8, 9, 11, 13 e 22 a 24 ajustados; Anexo A e QA Contract ajustados. **ARQ-F002-14 a 16 não foram vetadas até a aplicação e estão em vigor.**
  - **Fechamento (2026-10-23), sem nova versão:** aplicação pelo SQL Editor; ARQ-F002-17 a 19; R-05 encerrado por decisão, R-16 confirmado e R-20 novo; seções 5 (etapa 6), 14, 16 e 18, critérios 23 e 24 e Anexo A (A5, A9 e A10) anotados; requisitos de herança acrescentados na seção 11. Nenhum requisito do banco desta feature mudou. **ARQ-F002-17 a 19 foram aceitas pelo PO sem veto em 2026-10-24.**
- **Migrations:** 9 arquivos escritos pelo [[agents/analista-de-dados|Analista de Dados]] em `backend/supabase/migrations/` e **aplicados em 2026-10-23** ([[tecnico/BANCO-DE-DADOS#Ordem vinculante das migrations (FOUNDATION-002, D9)|ordem vinculante]]). O delta da VERSÃO 2 (ARQ-F002-14 e 15) foi feito nos próprios arquivos antes do commit e da aplicação. Relatório do Analista: `docs/features/FOUNDATION-002-DATA-TASK-RESULT.md`, sem DATA MODEL BLOCKED e com a divergência técnica DIV-01, decidida pelo Arquiteto (ARQ-F002-16).
- **QA:**
  - fase 1 (revisão estática): APPROVED com condições;
  - fase 1b (delta da VERSÃO 2): APPROVED; S15 (estrutura de `backend/supabase/`) e S16 executável: OK;
  - fase 2 (saídas do PO): **APPROVED**, READY_FOR_ARCHITECT_REVIEW, sem bugs. V1: 154 checagens OK, 0 FAIL; V2: PASS=133, FAIL=0, NOT_TESTED=0; bloco B: I1 e I2 CONTORNADOS (R-16, informativo). NOT TESTED: NT-01 (fica para a FOUNDATION-003), NT-02 (vale a confirmação do PO no A6 mais o V1.14), NT-03, NT-04, NT-05 e NT-07 (não exigidos); NT-06 resolvido.
- **Trecho do Desenvolvedor** (seção 8 do contrato): feito depois do encerramento da [[features/AUTH-001]]: `backend/supabase/config.toml`, cujo único conteúdo funcional é `project_id = "vitqnyzuvrvkmnvshcpb"`, e `backend/.gitignore` com `supabase/.temp/` e `supabase/.branches/`. Desvio aceito: `supabase --version` (N-4).
- **Organizador** (Organization Task) e **QA S15/S16**: OK antes do commit `028f9ff`.
- **Evidências versionadas** (ARQ-F002-19; commit `8ee70a6`):
  - `docs/features/FOUNDATION-002-SAIDAS-PO.md`: contexto da aplicação e as saídas literais do V0, do V2, do bloco B e da consulta de resíduo;
  - `docs/features/FOUNDATION-002-V1-CONSULTA-UNICA.sql`: a consulta que o PO rodou, sem alteração (SHA-256 com LF `14f116f0e57f102d920cad25445ead89a58f6d5d189275dfcc27512344928b38`);
  - `docs/features/FOUNDATION-002-V1-RESULTADO.csv`: o CSV exportado pelo PO, cópia byte a byte, com cabeçalho e 36 linhas (SHA-256 `fe55456fc40deca184fc97cf4caaddeea2c34920df3b9a0fdfdc55aabe495043` com CRLF, como exportado; `920ca1325478a1c70755e4b74e15bcb41af386863add8d6a76e03c9d327df45b` com LF, como no git).
- **Base de comparação** ([[features/AUTH-001#ARQ-AUTH-02 — Escopo dos critérios 1, 18 e 19 diante da FOUNDATION-002 em paralelo|ARQ-AUTH-02]]): o critério 22 e o S16 desta feature são medidos tomando o commit da AUTH-001 (`50eaa1f`) como base, não o `4039fe0`.
- **Registro da revisão:** as ARCHITECT REVIEW desta feature não foram gravadas no repositório. **Esta nota é o registro permanente delas**, junto com a entrada de 2026-10-24 do [[CHANGELOG]].

## Por que existe
O [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] exige a fundação oficial de persistência antes das features que dependem do banco. Até a aplicação de 2026-10-23 não existia banco oficial, e nenhuma feature que grava dados podia começar (AUTH-002, CHURCH-001 e as demais). A fundação técnica ([[features/FOUNDATION-001]]) está encerrada desde 2026-10-19.

## Escopo e decomposição (ARQ-F002-01)
O modelo da [[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]] virou quatro entregas, e não uma só:

| Feature | Escopo | Bloqueio próprio |
|---|---|---|
| **FOUNDATION-002** (esta) | Schema `mescala`, papel `mescala_app`, mecanismo de contexto, `updated_at`; `users`, `churches`, `church_memberships`, `ministries`, `ministry_memberships`, `ministry_functions`, `ministry_member_functions`; `audit_log`; RLS de isolamento dessas tabelas; estrutura `backend/supabase/` | B-01 e B-02 (respondidos em 2026-10-22) |
| FOUNDATION-003 (proposta; ID a confirmar) | Cliente de banco do backend: [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco\|DEC-04, parte 2]], papel de login, conexão, transação com contexto, banco de teste | DEC-04, parte 2 |
| FOUNDATION-004 (proposta; ID a confirmar) | `programs`, `program_ministries`, `schedules`, `allocations` e a tabela de impedimentos | B-03 (respondido em 2026-10-22) |
| Convites (feature própria; ID a definir) | `invitations`, junto com o fluxo do convite | B-04 (escopo respondido; fluxo **A DEFINIR**) |

Motivos registrados no contrato: features pequenas e completas; bloqueios isolados; consumidores que chegam em sequência (cliente de banco → AUTH-002 → AUTH-003 → CHURCH-001 → CHURCH-002); a ordem 1–14 da seção 15 do relatório preservada.

**O que a FOUNDATION-002 cria** no projeto oficial `vitqnyzuvrvkmnvshcpb` (aplicado em 2026-10-23): o schema `mescala`, fora da Data API; o papel de grupo `mescala_app`; 4 funções (duas de contexto, a de `updated_at` e a de imutabilidade de `audit_log`); 8 tabelas com RLS habilitado; FKs compostas, unicidades, CHECKs e índices; grants por coluna; policies de isolamento; a imutabilidade de `audit_log`. Também a estrutura `backend/supabase/` da CLI. Não cria regra de negócio nova, rota nem código TypeScript.

## Fora do escopo
Cliente de banco, conexão, papel de login e variáveis de ambiente (FOUNDATION-003); atributos e policies de `users` e a resolução `sub` → `users.id` (AUTH-002/003, DEC-06); status ou revogação do usuário (B8, AUTH-003); `churches.address` e a criação da igreja e do OWNER (CHURCH-001); policies por usuário e o contexto de igreja da requisição (CHURCH-002); programação, escala, alocação e impedimentos (FOUNDATION-004); convites; seeds e testes automatizados de banco; Edge Functions; configuração do projeto remoto; qualquer código TypeScript, rota ou UI.

## Mecanismo
Resumo; o detalhe está em [[tecnico/BANCO-DE-DADOS#Mecanismo do schema oficial (FOUNDATION-002)|tecnico/BANCO-DE-DADOS]], [[seguranca/ISOLAMENTO-DE-DADOS#Mecanismo decidido na FOUNDATION-002|seguranca/ISOLAMENTO-DE-DADOS]] e [[seguranca/AUDITORIA#Estrutura decidida na FOUNDATION-002|seguranca/AUDITORIA]].
- Schema `mescala` fora da Data API; nenhum acesso para `PUBLIC`, `anon`, `authenticated`, `service_role` e `authenticator`.
- `mescala_app` NOLOGIN, sem BYPASSRLS; o papel de login vem na FOUNDATION-003, fora do repositório.
- Contexto `mescala.current_user_id` (= `users.id`) e `mescala.current_church_id`, só com `set_config(..., true)`.
- O RLS faz só isolamento por igreja; papel + escopo ficam no backend.
- R-01: a CHURCH-002 valida o vínculo antes de definir o contexto.
- `audit_log` imutável para DML; `id` e `occurred_at` do banco.

## Fluxo desta feature (ARQ-F002-11)
O contrato ajusta o [[features/FLUXO-DE-ENTREGA]], porque migration aplicada não pode ser editada:

| # | Etapa | Situação |
|---|---|---|
| 1 | Analista de Dados: 9 migrations e DATA TASK RESULT, sem aplicar | feito; delta da VERSÃO 2 feito antes do commit `028f9ff` |
| 2 | Desenvolvedor: `backend/supabase/config.toml` e `backend/.gitignore` (só depois do encerramento da AUTH-001) | feito (desvio `supabase --version` aceito, N-4) |
| 3 | Organizador: estrutura | feito, sem pendência |
| 4 | QA, fase 1: revisão estática (e fase 1b, do delta) | fase 1 APPROVED com condições; fase 1b APPROVED; S15 e S16 executável OK |
| 5 | Arquiteto, revisão pré-aplicação | RETURN_TO_DATA_ANALYST; delta confirmado (APPROVED) em 2026-10-22 |
| 6 | PO: aplica as migrations e roda a verificação (Anexo A). Previsto: vincular a CLI dentro de `/backend` | feito em 2026-10-23, pelo SQL Editor, sem `supabase link` (alternativa do A5; ARQ-F002-17); V0 em 2026-10-22 |
| 7 | QA, fase 2: avalia as saídas do PO | APPROVED (READY_FOR_ARCHITECT_REVIEW), sem bugs |
| 8 | Arquiteto: ARCHITECT REVIEW final | APPROVED_WITH_NOTES (2026-10-23) |

Pré-condições do A3 (Anexo A), cumpridas antes da aplicação (critério 24): VERSÃO 2 registrada; delta feito, QA fase 1b APPROVED e delta confirmado pelo Arquiteto; DATA TASK RESULT com o script integrado (V0 com V0.4, V1 até V1.24, V2 num só bloco e o bloco B do QA); AUTH-001 encerrada; trecho do Desenvolvedor feito; Organizador sem pendência; QA com S15 e S16 executável OK; o commit recomendado foi feito (`028f9ff`). Proibidos no projeto oficial, entre outros: `supabase db reset --linked`, `supabase config push`, qualquer comando da CLI na raiz do repositório e conectar a integração GitHub ↔ Supabase. Desde o fechamento, também `supabase db push` (inclusive `--dry-run`) e `supabase migration up`; `supabase migration repair` só num plano escrito do Arquiteto (ARQ-F002-17).

## Revisões do Arquiteto
Registro permanente das três revisões (precedente: as ARCHITECT REVIEW ficam nas notas das features). Este é o registro da confirmação do delta que o critério 24 do contrato cita (F-10).

### (a) Revisão pré-aplicação — 2026-10-22: RETURN_TO_DATA_ANALYST
- Decisão CHANGES_REQUIRED. Pediu o **delta D-1 a D-5** (3 arquivos com mudança de SQL e 2 só de comentário), que corrige um defeito da especificação: o D5 contradizia a seção 17 do contrato e a SEC-001 (F002-QA-01).
- Emitiu a **VERSÃO 2** do contrato (READY): ARQ-F002-14 a 16, R-16 a R-19 e os ajustes listados na [[#Situação em 2026-10-24|situação]].

### (b) Confirmação do delta — 2026-10-22: APPROVED
- Com ela, a revisão pré-aplicação passa a **APPROVED**.
- Ajustes S-1 ("DECISÕES:" → "DECISÃO:"), S-2 (aviso do `supabase link` no A3), S-3 (S11 com `authenticator` e INSERT por coluna) e S-4 a S-6 (marcas de histórico), aplicados antes do commit `028f9ff` (13 arquivos).
- Desvio do Desenvolvedor aceito: `supabase --version`, quando a seção 8 proibia qualquer comando `supabase`. Só leitura, sem efeito.
- SHA-1 do `backend/supabase/config.toml` = `a8156528eeeff63cd5ec78d941bf61f151520113` (conferido de novo na revisão final).
- Corroborada pela mensagem do commit `028f9ff` ("Arquiteto APPROVED (2026-10-22)").

### (c) ARCHITECT REVIEW final — 2026-10-23: APPROVED_WITH_NOTES
Equivale a APPROVED, como na [[features/AUTH-001]]. Conferido:
- **Brain respeitada:** o SQL Editor é permitido pela [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04]], parte 1, item 3; nenhum ponto **A DEFINIR** foi tocado.
- **Contrato respeitado, com notas:** aplicação pela alternativa do A5; seção 18 e critérios 23 e 24 anotados.
- **Banco:** V1 com 154 checagens OK; catálogo igual às migrations de `028f9ff`; V2 com PASS=133, FAIL=0, NOT_TESTED=0.
- **Backend:** nada mudou em `backend/src`; typecheck, lint, test (251) e build OK. `backend/supabase/` só tem `config.toml` e `migrations/`; não existe `.temp`.
- **Autorização:** V1.14a–d, V1.12b, R4–R7, R10, QA1, QA2, QM6 e QM7.
- **Isolamento por igreja:** N1–N3, R2–R4, R8 e QT1–QT4 (23503, nunca 23505).
- **Escopo:** 8 tabelas, 4 funções, 18 policies; os arquivos de evidência são exceção aprovada (ARQ-F002-19).

**Notas da revisão** (viram registro, não correção):
- **N-1:** a aplicação usou a alternativa do A5 (SQL Editor). A3 e A4 não foram executados, e não existe `supabase_migrations` (decisão 1 → ARQ-F002-17).
- **N-2:** V0.1 a V0.3 só foram declarados pelo PO, sem saída colada. Aceito, porque o V1.2, o V1.17 (1/3) e o `create schema mescala` sem erro (ele não tem IF NOT EXISTS) sustentam a declaração. Daqui em diante, o V0 exige saída literal (ARQ-F002-17).
- **N-3:** a primeira execução do V1 saiu truncada (só V1.1 a V1.4b). O CSV completo foi gerado depois do V2 e do bloco B. A conclusão não muda: os dois terminam num erro que desfaz tudo, e `mescala` não tem sequence.
- **N-4:** o desvio do Desenvolvedor (`supabase --version`) é aceito: só leitura, sem efeito.

**Decisões da revisão final:**
1. Método de aplicação (R-05): **ARQ-F002-17**.
2. `ensure_rls`: registro como **R-20**, sem ação no banco.
3. I1 contornado sem entrada em `pg_parameter_acl`: **R-16 confirmado e reescrito** ([[seguranca/AUDITORIA]]).
4. QI3: **ARQ-F002-18**, as duas camadas na CHURCH-001.
5. Evidências versionadas: **ARQ-F002-19**, exceção ao critério 23.
6. Critério 24: a confirmação do delta fica registrada nesta nota ((b), acima); o critério está cumprido.
7. A10 (Security Advisor, opcional): **dispensado**, sem efeito no aceite e sem virar pendência. Se o PO rodar um dia, o achado esperado é "RLS sem policy" em `mescala.users` (D8; some na AUTH-002); achado sobre objeto fora de `mescala` é da plataforma (R-15).

**Pendências documentais da revisão** (não voltam a executor): P-1 (substituições F-01 a F-18 no contrato e D-01 e D-02 no DATA TASK RESULT), P-2 (os 3 arquivos de evidência, com os SHA-256 conferidos) e P-3 (commit A) estão no commit `8ee70a6`; P-4 é este registro (pedido 2 ao vault-brain); P-5 é o commit da Brain, só com `brain-mescala/`.

## Respostas do PO aos bloqueios (2026-10-22)
| Bloqueio | Decisão |
|---|---|
| B-01 — nome do schema | `mescala` |
| B-02 — status da Igreja | ATIVO, INATIVO. O efeito de uma igreja INATIVO continua **A DEFINIR** |
| B-03 — alocação "ativa" (para a FOUNDATION-004) | AGUARDANDO_CONFIRMACAO e CONFIRMADA |
| B-04 — convites | Escopo: `invitations` nasce com a feature de convites. Fluxo, transições e papel pretendido continuam **A DEFINIR** |

Registro normativo: [[decisoes/DEC-09-MODELO-DE-DADOS#Respostas do PO aos bloqueios da FOUNDATION-002|DEC-09]].

## Decisões do Arquiteto no contrato (ARQ-F002-01 a 19)
Decisões técnicas, dentro da competência do Arquiteto. ARQ-F002-01 a 13 foram aceitas pelo PO sem veto; ARQ-F002-14 a 16 (VERSÃO 2) não foram vetadas até a aplicação e estão em vigor desde 2026-10-23; ARQ-F002-17 a 19 (fechamento, 2026-10-23) foram **aceitas pelo PO sem veto em 2026-10-24**.

| ID | Resumo |
|---|---|
| ARQ-F002-01 | Decomposição em FOUNDATION-002, 003, 004 e Convites |
| ARQ-F002-02 | Atributos cuja obrigatoriedade a Brain não define entram na feature que primeiro os grava: atributos de `users` na AUTH-002; `churches.address` na CHURCH-001 |
| ARQ-F002-03 | O RLS faz isolamento por contexto de igreja; papel + escopo ficam no backend; policies por usuário entram com AUTH-002/003 e CHURCH-002 |
| ARQ-F002-04 | Contexto por parâmetros transacionais `mescala.current_user_id` e `mescala.current_church_id`, lidos por funções que devolvem NULL quando falta (falha fechada) |
| ARQ-F002-05 | A migration cria só o papel de grupo `mescala_app` (NOLOGIN); o papel de login, com senha, é criado pelo PO fora do repositório, na FOUNDATION-003 |
| ARQ-F002-06 | Nenhum DELETE nem TRUNCATE para o backend nesta fundação (HIS-001) |
| ARQ-F002-07 | UPDATE só nas colunas de atributo e estado |
| ARQ-F002-08 | `audit_log` imutável também para papéis administrativos (trigger) |
| ARQ-F002-09 | Colunas de status sem DEFAULT; nenhum CHECK acopla status e `ended_at` |
| ARQ-F002-10 | `config.toml` mínimo, escrito à mão; `supabase init` não é usado |
| ARQ-F002-11 | Revisão estática do QA e revisão pré-aplicação do Arquiteto **antes** de o PO aplicar |
| ARQ-F002-12 | Nomes explícitos de FK (`ministry_membership_id`, `ministry_function_id`); o nome `audit_log` é mantido |
| ARQ-F002-13 | RLS habilitado, não forçado |
| ARQ-F002-14 | Em tabela de tenant, toda unicidade que um INSERT do backend pode atingir inclui `church_id` (vínculo com o ministério, nome de função e PK das habilitações). Exceção: a PK `id` e os UNIQUE(x, id) alvo de FK |
| ARQ-F002-15 | INSERT de `mescala_app` em `audit_log` só por coluna; `id` e `occurred_at` sempre do default do banco |
| ARQ-F002-16 | DIV-01, opção A: o padrão global de privilégios não é alterado; cada função criada em `mescala` retira EXECUTE de `PUBLIC` e concede explicitamente; ALTER DEFAULT PRIVILEGES sem IN SCHEMA é proibido |
| ARQ-F002-17 | Método único de aplicação no projeto oficial: **SQL Editor** (escolha do PO dentro da DEC-04, parte 1, item 3). Só arquivo já commitado, um por vez, inteiro, sem texto selecionado, em aba nova, na ordem dos timestamps; se um falhar, parar, devolver a mensagem literal e rodar o V1 da feature antes de qualquer correção. Proibidos lá: `supabase db push` (inclusive `--dry-run`) e `supabase migration up`; `supabase migration repair` só num plano escrito do Arquiteto para adotar a CLI. Registro de migrations aplicadas na Brain e evidência mínima E1 a E5 versionada em `docs/features/` ([[tecnico/BANCO-DE-DADOS#Aplicação no projeto oficial (ARQ-F002-17)\|detalhe]]) |
| ARQ-F002-18 | QI3 (o CHECK de `audit_log` aceita o valor JSON `null` em `before_data` e `after_data`) é resolvido na CHURCH-001, primeira feature que grava `audit_log`, em duas camadas: (1) o helper de auditoria grava SQL NULL, nunca JSON `null`, com teste automatizado; (2) uma migration própria da CHURCH-001 substitui `audit_log_data_present_check` por uma regra em que nenhuma das duas colunas aceita JSON `null` e ao menos uma é não nula, aplicada antes da primeira linha de `audit_log`. QI3 passa a esperar 23514. Sem veto: valem as duas camadas |
| ARQ-F002-19 | As evidências da aplicação ficam versionadas, por exceção ao critério 23: `FOUNDATION-002-V1-CONSULTA-UNICA.sql`, `FOUNDATION-002-V1-RESULTADO.csv` e `FOUNDATION-002-SAIDAS-PO.md`, em `docs/features/`. Sem `supabase_migrations`, são o único registro de que o banco oficial corresponde ao commit `028f9ff`. Nenhum segredo nelas; não entram dados alheios à aplicação, como a conta em que a CLI da máquina estava logada |

ARQ-F002-14, 16 e 17, mais o R-19 e o R-20, viraram as [[tecnico/BANCO-DE-DADOS#Convenções do schema oficial (FOUNDATION-002, 2026-10-22)|convenções do schema oficial]], válidas para toda migration. São convenções técnicas, não regras de negócio `<ÁREA>-<NNN>`.

### F002-QA-01
Achado do QA na fase 1: o índice único é checado antes da FK composta, e o RLS só fixa `church_id`; sem `church_id` na chave, um INSERT com ID de outra igreja responderia 23505 em vez de 23503 e revelaria vínculo, nome ou habilitação dela (SEC-001). **Resolvido pela estrutura** (ARQ-F002-14): um INSERT no contexto de uma igreja com ministério, vínculo ou função de outra responde 23503, nunca 23505 (confirmado no projeto oficial por QT1 a QT4 em 2026-10-23). Não gera requisito de mapeamento de erros para as features.

## Riscos registrados no contrato (R-01 a R-20)
| # | Risco | Mitigação |
|---|---|---|
| R-01 | O RLS não pega contexto de igreja errado | A CHURCH-002 valida o vínculo ATIVO antes de definir o contexto |
| R-02 | CLI rodada na raiz usa o vínculo legado | Comandos só a partir de `/backend`; conferir o project-ref |
| R-03 | `supabase config push` sobrescreve a configuração remota | `config.toml` mínimo; comando proibido |
| R-04 | `supabase db reset --linked` apaga o banco remoto | Proibido |
| R-05 | Misturar SQL Editor e CLI diverge o histórico | **Encerrado por decisão em 2026-10-23:** a aplicação foi pelo SQL Editor, método único no projeto oficial (ARQ-F002-17). O projeto não tem `supabase_migrations` (V1.2); `supabase db push` e `supabase migration up` são proibidos nele (A9). Adotar a CLI depois exige `supabase migration repair` das versões já aplicadas, só por plano escrito do Arquiteto |
| R-06 | Migration aplicada não pode ser editada | Revisões antes da aplicação (ARQ-F002-11) |
| R-07 | Excluir a conta no Supabase Auth falha com usuário do Mescala (FK RESTRICT) | Consequência aceita da DATA-DEC-012; LGPD exige feature de anonimização |
| R-08 | `audit_log` guarda dados pessoais, e a imutabilidade bloqueia correções | A feature de anonimização trará migration própria |
| R-09 | Alguém expõe o schema na Data API | Papéis da Data API sem USAGE nem grants |
| R-10 | Identificador com mais de 63 caracteres é truncado | Regra D10; checagem do QA |
| R-11 | Scripts de verificação escritos sem execução prévia | O PO devolve o erro; corrige-se o script, não a migration |
| R-12 | No Postgres 16+, `postgres` precisa da opção SET para `SET ROLE mescala_app` | O script concede isso dentro do bloco desfeito |
| R-13 | AUTH-001 em paralelo e `backend/.gitignore` | Conflito trivial |
| R-14 | `public` continua exposto pela Data API | Nenhuma migration oficial cria objeto em `public` |
| R-15 | Papéis administrativos da plataforma mantêm acesso | Fora do modelo: o RLS protege o caminho da aplicação |
| R-16 | Imutabilidade de `audit_log` contornável pelo dono por DDL (`DISABLE TRIGGER`, I2) e por `session_replication_role = replica` (I1). **Confirmado no projeto oficial em 2026-10-23** (bloco B: I1 e I2 CONTORNADOS). O SET de `session_replication_role` pelo `postgres` não vem de `pg_parameter_acl` (o V1.23 não tem entrada para ele): é um mecanismo da plataforma | Plano administrativo (R-15). `mescala_app` não consegue (QD4: 42501). DDL só por migration revisada. O V1.23 não detecta o I1 nesta plataforma; a medida é o bloco B, informativo ([[seguranca/AUDITORIA]]) |
| R-17 | `lower()` de nomes com acento depende do locale | V0.4 antes de aplicar; se falhar, nada é aplicado e as migrations de ministérios e funções ganham collation explícita, com nova revisão. Em 2026-10-22, o V0.4b passou: sem contingência |
| R-18 | Função criada sem retirar EXECUTE de `PUBLIC` fica executável por `mescala_app` | Convenção ARQ-F002-16; V1.12b e V1.14b a V1.14d como regressão fixa |
| R-19 | Timestamps das 9 migrations (até `20261022150800`) à frente do horário em que foram escritas | Toda migration nova com timestamp maior que o da última da pasta e do [[tecnico/BANCO-DE-DADOS#Registro de migrations aplicadas\|registro]] |
| R-20 | Event trigger da plataforma `ensure_rls` (dono `postgres`, evento `ddl_command_end`) chama `public.rls_auto_enable()` em todo DDL, inclusive nas migrations do Mescala. Já existia antes da aplicação (V0.3b) e não é do Mescala; o corpo da função não foi lido | Objeto da plataforma, fora do modelo (R-15). Nenhuma migration o altera, desabilita ou remove, nem depende dele: o RLS continua explícito em todo `create_*` (ADR-002: o schema se reproduz num banco sem esse trigger). Em 2026-10-23, nenhum efeito em `mescala` (V1.6 e V1.12b). V1.6, V1.17 e V1.24 viram regressão fixa ([[tecnico/BANCO-DE-DADOS#Linha de base da plataforma\|linha de base]]) |

## Dependências entre features
- **DEPENDS_ON:** [[features/FOUNDATION-001]] (cumprida); [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]], [[decisoes/ADR-003-AUTENTICACAO|ADR-003]], DEC-04 parte 1, [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]] e [[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]] (aceitos); B-01 e B-02 (respondidos em 2026-10-22); autorização da Fase 4 (concedida em 2026-10-22).
- **BLOCKS (até o encerramento):** FOUNDATION-003, AUTH-002, AUTH-003, CHURCH-001, CHURCH-002, FOUNDATION-004, Convites e toda feature com banco. Encerrada em 2026-10-23, libera a FOUNDATION-003 e, em seguida, a AUTH-002 e a CHURCH-001.
- **RELATED_TO:** [[features/AUTH-001]], em paralelo (único ponto de contato: `backend/.gitignore`); DEC-06, DEC-07 e B8 da AUTH-001; [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]] (nenhuma dependência npm muda).

**Requisitos que as features seguintes herdam** (seção 11 do contrato, com os acréscimos da VERSÃO 2 e do fechamento):
- **Toda feature com migration:** ARQ-F002-14, ARQ-F002-16 e R-19, com timestamp maior que `20261022150800`, a última migration da pasta e do registro ([[tecnico/BANCO-DE-DADOS#Convenções do schema oficial (FOUNDATION-002, 2026-10-22)|convenções]]).
- **Toda feature que muda o banco oficial** (fechamento): ARQ-F002-17 (SQL Editor; só arquivo commitado; V0 e V1 em consulta única, escritos pelo Analista e revisados pelo QA na fase 1; evidências E1 a E5 versionadas em `docs/features/`; registro de migrations aplicadas na Brain) e R-20 (RLS explícito em todo `create_*`; V1.6, V1.17 e V1.24 como regressão fixa).
- **Primeira feature com V0 depois deste fechamento:** registrar, só por leitura, o corpo de `public.rls_auto_enable()`, para documentar o que o `ensure_rls` faz (R-20).
- **FOUNDATION-003:**
  - decisão da DEC-04 parte 2;
  - papel de login criado pelo PO no SQL Editor, fora do repositório, com evidência de catálogo em consulta única (atributos e participação em `mescala_app`) e sem senha em nenhum arquivo. O `postgres` tem ADMIN OPTION sobre `mescala_app` (V1.13c), o que basta para essa concessão;
  - conexão e pooler;
  - um único helper de transação que define o contexto só com `set_config(..., true)`, com teste de duas transações seguidas na mesma conexão mostrando que o contexto some depois de COMMIT e de ROLLBACK;
  - banco de teste com os papéis do Supabase e `auth.users`. Se for a stack local da CLI, ela roda só a partir de `/backend`, nunca contra o projeto oficial, e não terá o `ensure_rls`;
  - NT-01 (login, pooler, transação com contexto) é verificado nela; QI4 sem achado, porque `mescala_app` não cria em `public`.
- **AUTH-002:** colunas de `users` da DATA-DEC-013, com a obrigatoriedade da DEC-06; grants e policies de `users` (some o achado esperado do Security Advisor, "RLS sem policy" em `mescala.users`); mecanismo `sub` → `users.id` sob RLS; `auth_user_id` imutável.
- **AUTH-003:** resolução do usuário atual; status do usuário, conforme o B8.
- **CHURCH-001:** coluna `address`; na mesma transação, gerar o `id` da igreja, definir o contexto e inserir igreja, OWNER e auditoria; helper de auditoria com SQL NULL (nunca JSON `null`), sem `id`, `occurred_at` nem RETURNING; ARQ-F002-18 (as duas camadas; QI3 passa a esperar 23514).
- **CHURCH-002:** policies SELECT por usuário ("minhas igrejas", os próprios vínculos); validação do vínculo ATIVO antes de definir o contexto (R-01); como a igreja atual chega à API (**A DEFINIR**).
- **FOUNDATION-004:** programação, participação, escala (RASCUNHO, PUBLICADA, CONCLUIDA; UNIQUE(programação, ministério) já com `church_id`), alocações (com a unicidade do B-03) e impedimentos (INSERT só pelo próprio usuário, DIS-001).
- **Convites:** B-04, o fluxo documentado na Brain e a policy de aceite entre igrejas.
- **Feature de anonimização (R-08):** agora se sabe que o `postgres` consegue I1 e I2. O contrato dela escolhe o caminho, só por migration revisada.
- **Features que recebem IDs do cliente:** o backend nunca grava `id` vindo do cliente como chave de linha nova.
- **Fora de feature:** na próxima revisão das definições dos agentes, alinhar `.claude/agents/analista-dados-mescala.md`, que ainda diz "SQL Editor ou CLI", à ARQ-F002-17. Não é urgente, porque os agentes nunca aplicam.

## Lacunas não bloqueantes, adiadas pelo contrato
Obrigatoriedade dos atributos de `users` (AUTH-002); `churches.address` (CHURCH-001); status ou revogação do usuário (AUTH-003); revogar uma habilitação (feature de funções do membro); acoplamento entre status e `ended_at` (features de inativação); cancelamento de Programação (FOUNDATION-004 e feature de programações; nada decidido); o que é "excluir" o membro (feature de escalas); ambiente de banco de teste (FOUNDATION-003); regras de autorização abertas (no backend, nas features).

Continuam **A DEFINIR**, sem mudança no fechamento: o efeito de uma igreja INATIVO; o fluxo, as transições e o papel pretendido do convite; como a igreja atual chega à API; a [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]].

## Próximo registro
**Feito em 2026-10-24** (pedido 2 do Arquiteto, emitido na ARCHITECT REVIEW final de 2026-10-23): a aplicação (data, método, commit), o [[tecnico/BANCO-DE-DADOS#Estado do banco oficial em 2026-10-23|estado do banco oficial]], o [[tecnico/BANCO-DE-DADOS#Registro de migrations aplicadas|registro de migrations aplicadas]] e as revisões do Arquiteto. Nenhum segredo nem dado da conta em que a CLI da máquina estava logada foi registrado.

Relacionados: [[tecnico/BANCO-DE-DADOS]], [[seguranca/ISOLAMENTO-DE-DADOS]], [[seguranca/AUDITORIA]], [[decisoes/PENDENCIAS]], [[MOCs/MOC-GOVERNANCA]], [[MOCs/MOC-DADOS]], [[MOCs/MOC-ARQUITETURA]].

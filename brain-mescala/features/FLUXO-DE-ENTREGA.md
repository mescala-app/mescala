---
tipo: processo
status: ativo
area: governanca
relacionado:
  - "[[agents/arquiteto]]"
  - "[[agents/analista-de-dados]]"
  - "[[agents/desenvolvedor-backend]]"
  - "[[agents/organizador]]"
  - "[[agents/qa]]"
  - "[[features/FOUNDATION-001]]"
  - "[[features/AUTH-001]]"
  - "[[features/FOUNDATION-002]]"
  - "[[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]]"
  - "[[decisoes/DEC-02-BIBLIOTECA-DE-TESTES]]"
  - "[[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]]"
atualizado: 2026-10-22
---
# Fluxo de entrega de features

Como uma feature do backend sai da Brain e chega à revisão final. Descreve o processo definido pelos cinco agentes executáveis em `.claude/agents/` (fora do vault). Não é um fluxo de negócio: os fluxos do produto estão em [[00-MOC-MESCALA#Fluxos principais|Fluxos principais]].

```text
Arquiteto → Analista de Dados → Desenvolvedor → Organizador → QA → Arquiteto
```

## Etapas

| # | Agente | Recebe | Entrega | Resultado possível |
|---|---|---|---|---|
| 1 | [[agents/arquiteto\|Arquiteto]] | Solicitação de feature + Brain | ARCHITECT ANALYSIS com Feature Contract, Data Task (se houver banco), Backend Implementation Task, Organization Task e QA Contract | Contrato `READY`, ou BLOQUEIO DE DOMÍNIO |
| 2 | [[agents/analista-de-dados\|Analista de Dados]] | Feature Contract + Data Task | DATA ANALYSIS, arquivos de migration (sem aplicar), DATA MODEL SUMMARY, DATA TASK RESULT | `READY_FOR_BACKEND` ou `BLOCKED` |
| 3 | [[agents/desenvolvedor-backend\|Desenvolvedor]] | Contrato + Backend Implementation Task + Data Task Result | BACKEND IMPLEMENTATION ANALYSIS, código em `/backend`, BACKEND IMPLEMENTATION RESULT | `IMPLEMENTED` ou `BLOCKED`; `READY_FOR_QA` se completo |
| 4 | [[agents/organizador\|Organizador]] | Contrato + Organization Task + resultado do Desenvolvedor | REPOSITORY ORGANIZATION ANALYSIS e RESULT | `ORGANIZED`, `CHANGES_REQUIRED` ou `BLOCKED` |
| 5 | [[agents/qa\|QA]] | Contrato + QA Contract + resultados anteriores | QA ANALYSIS e QA RESULT, com bug reports | `APPROVED`, `CHANGES_REQUIRED` ou `BLOCKED`, mais recomendação ao Arquiteto |
| 6 | [[agents/arquiteto\|Arquiteto]] | Tudo acima | ARCHITECT REVIEW | `APPROVED`, `CHANGES_REQUIRED` ou `BLOCKED` |

A etapa 2 só acontece quando a feature tem impacto no banco. Entre as etapas 2 e 3, o PO aplica as migrations manualmente (SQL Editor ou CLI) no projeto oficial `vitqnyzuvrvkmnvshcpb` ([[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04]]).

**Migrations: revisão antes da aplicação** (convenção 4 do [[tecnico/BANCO-DE-DADOS#Convenções do schema oficial (FOUNDATION-002, 2026-10-22)|schema oficial]]). Migration aplicada não é editada; correção vira migration nova. Por isso, antes de o PO aplicar, vêm a revisão estática do QA e a revisão pré-aplicação do Arquiteto. Na [[features/FOUNDATION-002]], o contrato fixou esta ordem (ARQ-F002-11): Analista → Desenvolvedor → Organizador → QA fase 1 (estática) → revisão pré-aplicação do Arquiteto → aplicação pelo PO → QA fase 2 (saídas do PO) → ARCHITECT REVIEW final. Um delta pedido na revisão pré-aplicação volta ao Analista, passa pela fase 1b do QA e pela confirmação do Arquiteto antes da aplicação.

## Testes (DEC-02, decidida em 2026-10-22)
- Biblioteca oficial: **Vitest** ([[decisoes/DEC-02-BIBLIOTECA-DE-TESTES|DEC-02]]), versão 5.0.5, instalada pela [[features/AUTH-001]] como dependência de desenvolvimento do `/backend`.
- Na etapa 3, o [[agents/desenvolvedor-backend|Desenvolvedor]] escreve os testes dos cenários do QA Contract como parte da entrega.
- Na etapa 5, o [[agents/qa|QA]] revisa esses testes e acrescenta casos adversariais, nos arquivos existentes ou num `<arquivo>.qa.test.ts` próprio.
- Local dos testes, script `test` e convenções: definidos pelo [[agents/arquiteto|Arquiteto]] no contrato da AUTH-001 e registrados em [[tecnico/BACKEND#Convenções do código e dos testes (desde a AUTH-001)|tecnico/BACKEND]].
- Até 2026-10-22, o QA não criava arquivos de teste, e o que exigia teste automatizado ficava NOT TESTED.

## Como os agentes se comunicam
- Os agentes não conversam entre si. Cada um devolve seus blocos à sessão principal, que os encaminha ao próximo.
- Por isso o Arquiteto escreve cada bloco de forma autocontida.
- O QA devolve uma recomendação: `READY_FOR_ARCHITECT_REVIEW`, `RETURN_TO_DEVELOPER`, `RETURN_TO_DATA_ANALYST`, `RETURN_TO_ORGANIZER` ou `ARCHITECTURAL_DECISION_REQUIRED`.

## Sinais de parada
Cada agente para e reporta em vez de decidir sozinho:
- Arquiteto: **BLOQUEIO DE DOMÍNIO** (lacuna na Brain, inclusive itens **A DEFINIR**) e **ARCHITECTURAL DIVERGENCE** (Brain × código).
- Analista de Dados: **DATA MODEL BLOCKED**, **DATA MODEL DIVERGENCE** e **DATABASE DRIFT DETECTED**.
- Desenvolvedor: **IMPLEMENTATION DIVERGENCE**.
- Organizador: **ORPHAN FILE DETECTED** e **STRUCTURAL DEBT**.
- QA: **SCOPE VIOLATION** e **NOT TESTED** (nada é PASS sem evidência).

## Onde ficam os artefatos (fora do vault)
- Feature Contracts e QA Contracts: `docs/features/<ID>.md`.
- Relatórios do Analista de Dados: `docs/data/` (hoje `docs/data/DATA-ARCHITECTURE-REPORT.md`).
- Migrations oficiais: `backend/supabase/migrations/` ([[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04, parte 1]], 2026-10-21). Desde 2026-10-22, a pasta tem as 9 migrations da [[features/FOUNDATION-002]], escritas pelo Analista e **ainda não aplicadas** nem commitadas; `backend/supabase/config.toml` (configuração própria da CLI) também existe. A `supabase/migrations/` da raiz guarda só as 9 migrations do legado, que nunca rodam no banco oficial.
- DATA TASK RESULT da FOUNDATION-002: `docs/features/FOUNDATION-002-DATA-TASK-RESULT.md` (ainda não commitado). O contrato prevê que o orquestrador integre nele o adendo do Analista e os complementos do QA.
- Código do backend oficial: `/backend` ([[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]]), versionado desde o commit `7f26d30`.
- ARCHITECT REVIEW: até agora não foram gravadas no repositório. As da FOUNDATION-001 e a da AUTH-001 estão registradas nas notas das features ([[features/FOUNDATION-001]], [[features/AUTH-001]]).
- Definições dos agentes: `.claude/agents/*.md`.

## Regras que valem para todo o fluxo
- Fase **BACKEND ONLY** ([[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]]): nenhuma UI.
- Nenhum agente aplica migration, faz commit ou publica (deploy).
- Código anterior ao ADR-002 ([[tecnico/LEGADO-ATUAL]]) não é ponto de extensão sem um Feature Contract que peça isso.
- Decisões em aberto ([[decisoes/PENDENCIAS]]) bloqueiam os pontos que cobrem.

## Checagens herdadas da FOUNDATION-001
Aceitas pelo Arquiteto na revisão da [[features/FOUNDATION-001]]. Valem para toda feature do `/backend`:
- **Estrutura:** nenhum `backend/app/`, `pages/`, `src/pages/`, `middleware.*` ou `proxy.*` (limite L-02, em [[features/FOUNDATION-001#Limites aceitos das guardas de lint|limites aceitos]]).
- **`.jsx`:** nenhum em `backend/src`, **de forma permanente** (BACKEND ONLY, sem React). Era condição do [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|L-06]], encerrado em 2026-10-22, e virou regra estrutural; Organizador e QA conferem.
- **Dependências:** listas de proibidas conforme a [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]]; dependência fantasma checada no S5 (RT-FOUND-02).
- **Feature que altere dependências do `/backend`:** `npm audit --omit=dev` = 0 é condição de encerramento ([[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]]).
- **Feature que altere o `backend/eslint.config.mjs`:** `npm run test` e extensão da suíte GL (`backend/eslint.config.test.ts`) com casos para cada guarda nova. A [[features/FOUNDATION-001#Verificação mínima de regressão do lint|verificação mínima de regressão do lint]] está automatizada nessa suíte desde a AUTH-001.

## Checagens herdadas da AUTH-001
Aceitas pelo Arquiteto na revisão da [[features/AUTH-001]] (2026-10-22). Valem para toda feature do `/backend`:
- **Imports canônicos:** `@/` entre áreas, `./` na mesma pasta, sem segmentos `.`, sem `..` no meio, sem `//`; nenhum módulo fora de `infrastructure/supabase-auth` reexporta símbolos dela. Organizador e QA conferem (S12) ([[decisoes/PENDENCIAS#L-07 — Guarda 2b não normaliza o especificador|L-07]]).
- **`fetchCache`:** nenhum arquivo em `src/app/**` declara `fetchCache` até a guarda de lint da AUTH-003; o QA confere ([[decisoes/PENDENCIAS#RT-AUTH-01 — Cache de segmento do Next sobre a busca do JWKS|RT-AUTH-01]]).
- **Composição domínio → infraestrutura** como a da AUTH-001: só com autorização do contrato ([[decisoes/PENDENCIAS#RT-AUTH-02 — Composição padrão no domínio|RT-AUTH-02]]).
- **Testes:** convenções de [[tecnico/BACKEND#Convenções do código e dos testes (desde a AUTH-001)|tecnico/BACKEND]].

## Checagens herdadas da FOUNDATION-002
Decididas no contrato da [[features/FOUNDATION-002]] (VERSÃO 2, 2026-10-22). Valem para **toda feature com migration**; o QA confere. ARQ-F002-14 a 16 são decisões técnicas que o PO pode vetar até o A3 da FOUNDATION-002.
- Convenções do schema oficial: privilégios explícitos (ARQ-F002-16), unicidade com `church_id` (ARQ-F002-14), timestamp maior que o da última migration da pasta (R-19), migration aplicada não é editada ([[tecnico/BANCO-DE-DADOS#Convenções do schema oficial (FOUNDATION-002, 2026-10-22)|tecnico/BANCO-DE-DADOS]]).
- Regressão fixa no QA: EXECUTE por papel em todas as funções do schema (V1.12b) e privilégios de tabela, de coluna e dos papéis da Data API (V1.14b a V1.14d).

## Primeira execução completa: FOUNDATION-001
O fluxo rodou de ponta a ponta pela primeira vez na [[features/FOUNDATION-001]], sem a etapa 2 (a feature não tem banco), e incluiu uma rodada de correção:

```text
Arquiteto (READY) → Desenvolvedor (IMPLEMENTED) → Organizador (ORGANIZED) → QA (APPROVED) → Arquiteto (CHANGES_REQUIRED)
→ Desenvolvedor (correções) → QA (revalidação, APPROVED) → Arquiteto (APPROVED, 2026-10-19)
```

- Na rodada de correção não houve etapa do [[agents/organizador|Organizador]], porque nada foi criado nem movido.
- Entre as rodadas, o PO decidiu incluir na correção um limite apontado pelo Arquiteto (L-03).
- As ARCHITECT REVIEW não foram gravadas em arquivo; o registro permanente está na nota da feature.
- Depois do APPROVED, a entrega foi commitada (`7f26d30`).

## Segunda execução completa: AUTH-001
O fluxo rodou de ponta a ponta pela segunda vez na [[features/AUTH-001]], sem a etapa 2 (a feature não tem banco) e sem rodada de correção:

```text
Arquiteto (v2 READY) → Desenvolvedor → Organizador → QA (APPROVED) → Arquiteto (APPROVED_WITH_NOTES, 2026-10-22)
```

- Primeira feature com testes automatizados (Vitest, DEC-02): o Desenvolvedor escreveu os testes dos cenários; o QA acrescentou os casos adversariais QA-1 a QA-4 num arquivo próprio (`<arquivo>.qa.test.ts`, convenção inaugurada aqui).
- APPROVED_WITH_NOTES equivale a APPROVED: nada voltou a nenhum executor; as notas viraram registros (L-07, RT-AUTH-01, RT-AUTH-02, ARQ-AUTH-01).
- A ARCHITECT REVIEW não foi gravada no repositório; o registro permanente está na nota da feature.
- Depois do APPROVED, a entrega foi commitada pelo orquestrador, com autorização do PO (`50eaa1f`, 16 arquivos, local).

## Features registradas
| ID | Nome | Contrato | Implementação |
|---|---|---|---|
| [[features/FOUNDATION-001\|FOUNDATION-001]] | Inicialização do Backend Next.js | READY (v1, 2026-10-04) | implementada; ARCHITECT REVIEW APPROVED em 2026-10-19; commit `7f26d30`; **encerrada** |
| [[features/AUTH-001\|AUTH-001]] | Fundação de Autenticação | READY (v2, 2026-10-22; v1 emitida em 2026-10-06). Versionado em `docs/features/AUTH-001.md` desde o commit `50a1cd6` | implementada; ARCHITECT REVIEW APPROVED (APPROVED_WITH_NOTES) em 2026-10-22; commit `50eaa1f`; **encerrada** |
| [[features/FOUNDATION-002\|FOUNDATION-002]] | Fundação de Persistência | emitido em 2026-10-22; **READY (VERSÃO 2, 2026-10-22)**. Fase 4 autorizada pelo PO em 2026-10-22 | **em andamento:** 9 migrations escritas e **não aplicadas**; QA fase 1 APPROVED com condições; revisão pré-aplicação do Arquiteto = RETURN_TO_DATA_ANALYST (delta da VERSÃO 2 em curso; pendentes a fase 1b do QA e a confirmação do Arquiteto); trecho do Desenvolvedor feito; Organizador e QA (S15/S16) pendentes; nada commitado; aplicação pelo PO pendente |

Próximas features previstas, segundo o contrato da FOUNDATION-002: FOUNDATION-003 (cliente de banco do backend; proposta, ID a confirmar), depois AUTH-002, AUTH-003, CHURCH-001 e CHURCH-002. FOUNDATION-004 (programação, escala e impedimentos) e a feature de convites também dependem da FOUNDATION-002 ([[features/FOUNDATION-002#Dependências entre features|dependências]]).

## Observação sobre o relatório de dados
O `docs/data/DATA-ARCHITECTURE-REPORT.md` (2026-10-04) foi produzido executando o papel do Analista de Dados diretamente, a partir de um Data Task do PO, sem Feature Contract do Arquiteto. O próprio relatório registra que a fase de migrations precisa de um contrato do Arquiteto ou de uma declaração do PO de que o Data Task vale como contrato.

Relacionados: [[MOCs/MOC-GOVERNANCA]], [[agents/vault-brain]], [[tecnico/CONVENCOES]].

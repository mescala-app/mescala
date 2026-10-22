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

## Testes (DEC-02, decidida em 2026-10-22)
- Biblioteca oficial: **Vitest** ([[decisoes/DEC-02-BIBLIOTECA-DE-TESTES|DEC-02]]).
- Na etapa 3, o [[agents/desenvolvedor-backend|Desenvolvedor]] escreve os testes dos cenários do QA Contract como parte da entrega.
- Na etapa 5, o [[agents/qa|QA]] revisa esses testes e acrescenta casos adversariais.
- O Vitest entra como dependência de desenvolvimento do `/backend`, com versão exata, na primeira feature que precisar dele (a AUTH-001). Local dos testes, script `test` e convenções: o [[agents/arquiteto|Arquiteto]] define nesse contrato.
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
- Migrations oficiais: `backend/supabase/migrations/` ([[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04, parte 1]], 2026-10-21). A pasta ainda não existe. A `supabase/migrations/` da raiz guarda só as 9 migrations do legado, que nunca rodam no banco oficial.
- Código do backend oficial: `/backend` ([[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]]), versionado desde o commit `7f26d30`.
- ARCHITECT REVIEW: até agora não foram gravadas em arquivo. As da FOUNDATION-001 estão registradas na nota da feature ([[features/FOUNDATION-001]]).
- Definições dos agentes: `.claude/agents/*.md`.

## Regras que valem para todo o fluxo
- Fase **BACKEND ONLY** ([[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]]): nenhuma UI.
- Nenhum agente aplica migration, faz commit ou publica (deploy).
- Código anterior ao ADR-002 ([[tecnico/LEGADO-ATUAL]]) não é ponto de extensão sem um Feature Contract que peça isso.
- Decisões em aberto ([[decisoes/PENDENCIAS]]) bloqueiam os pontos que cobrem.

## Checagens herdadas da FOUNDATION-001
Aceitas pelo Arquiteto na revisão da [[features/FOUNDATION-001]]. Valem para toda feature do `/backend`:
- **Estrutura:** nenhum `backend/app/`, `pages/`, `src/pages/`, `middleware.*` ou `proxy.*` (limite L-02, em [[features/FOUNDATION-001#Limites aceitos das guardas de lint|limites aceitos]]).
- **`.jsx`:** nenhum em `backend/src` enquanto o [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|L-06]] estiver aberto; o QA confere.
- **Dependências:** listas de proibidas conforme a [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]]; dependência fantasma checada no S5 (RT-FOUND-02).
- **Feature que altere dependências do `/backend`:** `npm audit --omit=dev` = 0 é condição de encerramento ([[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]]).
- **Feature que altere o `backend/eslint.config.mjs`:** [[features/FOUNDATION-001#Verificação mínima de regressão do lint|verificação mínima de regressão do lint]]. Enquanto o L-06 estiver aberto, o contrato dessa feature também especifica a correção dele.

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

## Features registradas
| ID | Nome | Contrato | Implementação |
|---|---|---|---|
| [[features/FOUNDATION-001\|FOUNDATION-001]] | Inicialização do Backend Next.js | READY (v1, 2026-10-04) | implementada; ARCHITECT REVIEW APPROVED em 2026-10-19; commit `7f26d30`; **encerrada** |
| [[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação\|AUTH-001]] | Fundação de Autenticação | emitido em 2026-10-06; fora do git. ADR-003 aceito em 2026-10-21; DEC-02 decidida em 2026-10-22. **Sem bloqueios de decisão:** passa a READY quando o Arquiteto atualizar o contrato com o Vitest | não iniciada |
| FOUNDATION-002 | Fundação de Persistência | **contrato ainda não emitido**; o Arquiteto vai emiti-lo a partir das decisões de 2026-10-21 e 2026-10-22 ([[decisoes/DEC-09-MODELO-DE-DADOS\|DEC-09]], [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS\|DEC-04]], [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL\|DEC-05]]) | não iniciada; a Fase 4 (migrations) depende do contrato e de autorização explícita do PO |

Próxima feature prevista: **FOUNDATION-002 — Fundação de Persistência**. A AUTH-001 não usa banco e pode correr em paralelo a ela, segundo o documento da AUTH-001.

## Observação sobre o relatório de dados
O `docs/data/DATA-ARCHITECTURE-REPORT.md` (2026-10-04) foi produzido executando o papel do Analista de Dados diretamente, a partir de um Data Task do PO, sem Feature Contract do Arquiteto. O próprio relatório registra que a fase de migrations precisa de um contrato do Arquiteto ou de uma declaração do PO de que o Data Task vale como contrato.

Relacionados: [[MOCs/MOC-GOVERNANCA]], [[agents/vault-brain]], [[tecnico/CONVENCOES]].

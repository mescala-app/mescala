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

A etapa 2 só acontece quando a feature tem impacto no banco. Entre as etapas 2 e 3, o responsável do projeto aplica as migrations manualmente.

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
- Migrations: `supabase/migrations/` (único padrão existente; estratégia oficial pendente na [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04]]).
- Código do backend oficial: `/backend` ([[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]]).
- Definições dos agentes: `.claude/agents/*.md`.

## Regras que valem para todo o fluxo
- Fase **BACKEND ONLY** ([[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]]): nenhuma UI.
- Nenhum agente aplica migration, faz commit ou publica (deploy).
- Código anterior ao ADR-002 ([[tecnico/LEGADO-ATUAL]]) não é ponto de extensão sem um Feature Contract que peça isso.
- Decisões em aberto ([[decisoes/PENDENCIAS]]) bloqueiam os pontos que cobrem.

## Features registradas
| ID | Nome | Contrato | Implementação |
|---|---|---|---|
| [[features/FOUNDATION-001\|FOUNDATION-001]] | Inicialização do Backend Next.js | READY | não iniciada |
| A DEFINIR | Fundação oficial de persistência | sem contrato | bloqueada pela FOUNDATION-001 e pelas [[decisoes/PENDENCIAS\|decisões pendentes]] |

## Observação sobre o relatório de dados
O `docs/data/DATA-ARCHITECTURE-REPORT.md` (2026-10-04) foi produzido executando o papel do Analista de Dados diretamente, a partir de um Data Task do PO, sem Feature Contract do Arquiteto. O próprio relatório registra que a fase de migrations precisa de um contrato do Arquiteto ou de uma declaração do PO de que o Data Task vale como contrato.

Relacionados: [[MOCs/MOC-GOVERNANCA]], [[agents/vault-brain]], [[tecnico/CONVENCOES]].

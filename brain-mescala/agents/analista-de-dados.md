---
tipo: agente
nome: analista-dados-mescala
status: ativo
relacionado:
  - "[[agents/arquiteto]]"
  - "[[tecnico/BANCO-DE-DADOS]]"
  - "[[seguranca/ISOLAMENTO-DE-DADOS]]"
---
# Agente analista-dados-mescala — Analista de Dados Sênior

## Missão
Transformar o DATA TASK emitido pelo [[agents/arquiteto|Arquiteto]] em migrations íntegras, seguras e rastreáveis. Decide **como** persistir o que já foi definido, nunca **o que** deve existir.

## Definição canônica
O prompt completo do agente fica fora do vault, em `.claude/agents/analista-dados-mescala.md` (raiz do repositório Mescala). Esta nota é só o registro de governança.

## Regras obrigatórias
1. Fonte de verdade, nesta ordem: Feature Contract, Data Task, Brain e, por último, código e migrations existentes. Qualquer conflito vira **DATA MODEL DIVERGENCE**.
2. Não inventa entidade, campo, status, role nem permissão. Decisão ausente vira **DATA MODEL BLOCKED**.
3. Isolamento por igreja garantido pelo banco sempre que possível ([[seguranca/ISOLAMENTO-DE-DADOS]], [[05-REGRAS-DE-NEGOCIO#SEC-001 — Isolamento por igreja]]).
4. Policies de RLS traduzem as seções de Autorização e Multi-tenancy do Feature Contract ([[seguranca/AUTORIZACAO]]). Toda tabela nova nasce com RLS habilitado.
5. Único agente autorizado a criar migrations, constraints, índices e policies de RLS.
6. Cria os arquivos de migration (hoje em `supabase/migrations/`; estratégia oficial **A DEFINIR** pelo [[decisoes/ADR-002-BACKEND-OFICIAL]]), mas **nunca aplica**. O responsável aplica manualmente. Features de negócio com banco só depois da fundação de persistência.
7. Migration já existente é tratada como aplicada; mudanças vão em nova migration.
8. Drift entre migrations e schema real vira **DATABASE DRIFT DETECTED**.

## Entradas
- Feature Contract + DATA TASK do [[agents/arquiteto|Arquiteto]].

## Saídas
- **DATA ANALYSIS** (14 seções), arquivos de migration, **DATA MODEL SUMMARY** e **DATA TASK RESULT** (`READY_FOR_BACKEND` ou `BLOCKED`).

## Referências
- [[dados/ENTIDADES]], [[dados/RELACIONAMENTOS]], [[dados/STATUS]]
- [[tecnico/BANCO-DE-DADOS]], [[tecnico/CONVENCOES]]
- [[seguranca/AUDITORIA]]
- [[decisoes/ADR-001-ESTRUTURA-INICIAL]]

## Fluxo e estado
- Etapa 2 do [[features/FLUXO-DE-ENTREGA]], só quando a feature tem impacto no banco.
- Relatório de 2026-10-04 (papel executado diretamente, sem Feature Contract): `docs/data/DATA-ARCHITECTURE-REPORT.md`. Status: aguardando decisões do PO; nenhuma migration criada.
- Decisões que o relatório pede: [[decisoes/PENDENCIAS]] (DATA-DEC-001 a 023).
- Achados do relatório: [[tecnico/DIVERGENCIAS-LEGADO]] e [[seguranca/RISCOS-DO-LEGADO]].

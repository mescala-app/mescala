---
tipo: agente
nome: desenvolvedor-backend-mescala
status: ativo
relacionado:
  - "[[agents/arquiteto]]"
  - "[[agents/analista-de-dados]]"
  - "[[tecnico/BACKEND]]"
---
# Agente desenvolvedor-backend-mescala — Desenvolvedor Backend Sênior

## Missão
Implementar no backend, de forma fiel, didática e rastreável, exatamente a feature especificada pelo [[agents/arquiteto|Arquiteto]], sobre o schema entregue pelo [[agents/analista-de-dados|Analista de Dados]]. Implementa a regra, nunca a define.

## Definição canônica
O prompt completo do agente fica fora do vault, em `.claude/agents/desenvolvedor-backend-mescala.md` (raiz do repositório Mescala). Esta nota é só o registro de governança.

## Regras obrigatórias
1. Fonte de verdade, nesta ordem: Feature Contract, Backend Implementation Task, Data Task Result/schema, Brain e, por último, código existente. Conflito vira **IMPLEMENTATION DIVERGENCE**.
2. Não cria migrations nem altera schema, RLS, funções SQL ou índices. Necessidade de banco volta ao Arquiteto como Data Task.
3. Fase **BACKEND ONLY**: nenhuma UI.
4. Autorização por papel + escopo e isolamento por igreja explícitos ([[seguranca/AUTORIZACAO]], [[seguranca/ISOLAMENTO-DE-DADOS]]). Em código com service role do Supabase, o RLS não protege.
5. Cabeçalho didático obrigatório (sumário de funções com nome em PT-BR, dependências externas, regras) e comentários de **RELAÇÃO EXTERNA**. Comentário desatualizado é defeito.
6. Só instala dependências aprovadas por ADR ou Feature Contract; não faz commit, não publica (deploy) e não mexe em secrets.
7. Backend oficial em Next.js + TypeScript + Node.js, em `/backend` ([[decisoes/ADR-002-BACKEND-OFICIAL]]). Antes da `FOUNDATION-001`, só implementa a própria `FOUNDATION-001`. ORM, validação, autenticação, testes, auditoria e eventos só com decisão registrada.
8. Nunca afirma que funciona ou que testes passaram sem ter executado.

## Entradas
- Feature Contract + BACKEND IMPLEMENTATION TASK do [[agents/arquiteto|Arquiteto]].
- DATA TASK RESULT do [[agents/analista-de-dados|Analista de Dados]], quando houver banco.

## Saídas
- **BACKEND IMPLEMENTATION ANALYSIS** (11 seções), código da feature e **BACKEND IMPLEMENTATION RESULT** (`IMPLEMENTED` ou `BLOCKED`; `READY_FOR_QA` só se completo).

## Referências
- [[02-ARQUITETURA]], [[tecnico/BACKEND]], [[tecnico/API]], [[tecnico/CONVENCOES]]
- [[05-REGRAS-DE-NEGOCIO]], [[04-USUARIOS-E-PERMISSOES]]
- [[seguranca/AUDITORIA]]

## Fluxo e estado
- Etapa 3 do [[features/FLUXO-DE-ENTREGA]].
- [[features/FOUNDATION-001]]: implementada e encerrada (ARCHITECT REVIEW APPROVED em 2026-10-19, commit `7f26d30`), com uma rodada de correção (C1, L-03 e C2).
- Nenhuma outra feature está liberada. A AUTH-001 está sem bloqueios de decisão desde 2026-10-22, mas só passa a READY quando o Arquiteto atualizar o contrato com o Vitest; nada foi encaminhado ([[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|AUTH-001]]).
- Dependências: listas de proibidas conforme a [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]]. Em feature que altere dependências do `/backend`, `npm audit --omit=dev` = 0 é condição de encerramento, e `npm audit fix --force`, downgrade de `next` ou de `eslint-config-next` e `overrides` sem decisão registrada são proibidos ([[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]]).
- Nenhum `.jsx` em `backend/src` enquanto o [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|L-06]] estiver aberto.
- **Testes:** biblioteca oficial Vitest ([[decisoes/DEC-02-BIBLIOTECA-DE-TESTES|DEC-02]], 2026-10-22). O Desenvolvedor escreve os testes dos cenários do QA Contract como parte da entrega; o Vitest entra como dependência de desenvolvimento, com versão exata, na feature cujo contrato o aprovar.
- **Autenticação:** [[decisoes/ADR-003-AUTENTICACAO|ADR-003]] (2026-10-21).
- **Acesso ao banco:** conexão direta ao Postgres com papel sem BYPASSRLS ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]]); a ferramenta continua aberta ([[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]]).
- Escolhas que ainda dependem de decisão: [[decisoes/PENDENCIAS]].
- Código legado fora do escopo: [[tecnico/LEGADO-ATUAL]].

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
- Única feature liberada hoje: [[features/FOUNDATION-001]] (READY, não implementada).
- Escolhas que dependem de decisão: [[decisoes/PENDENCIAS]] (DEC-02, DEC-03, DEC-04).
- Código legado fora do escopo: [[tecnico/LEGADO-ATUAL]].

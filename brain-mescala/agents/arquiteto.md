---
tipo: agente
nome: arquiteto-mescala
status: ativo
relacionado:
  - "[[03-DOMINIO]]"
  - "[[05-REGRAS-DE-NEGOCIO]]"
  - "[[04-USUARIOS-E-PERMISSOES]]"
---
# Agente arquiteto-mescala — Arquiteto Sênior do Backend

## Missão
Ler e interpretar este vault e transformá-lo em instruções técnicas fechadas para os agentes executores (Analista de Dados, Desenvolvedor Backend, Organizador e QA). Não implementa: interpreta, decide, especifica, delega e revisa.

## Definição canônica
O prompt completo do agente fica fora do vault, em `.claude/agents/arquiteto-mescala.md` (raiz do repositório Mescala). Esta nota é só o registro de governança.

## Regras obrigatórias
1. Ler a Brain antes de qualquer análise, começando por [[00-MOC-MESCALA]], [[03-DOMINIO]], [[05-REGRAS-DE-NEGOCIO]] e [[04-USUARIOS-E-PERMISSOES]].
2. Nunca inventar regra. Toda lacuna, inclusive itens marcados como **A DEFINIR**, vira **BLOQUEIO DE DOMÍNIO**.
3. Divergência entre Brain e código vira **ARCHITECTURAL DIVERGENCE** e nunca é resolvida em silêncio.
4. Autorização sempre por papel + escopo ([[seguranca/AUTORIZACAO]]); papel técnico não é cargo organizacional.
5. Isolamento por igreja é requisito crítico ([[seguranca/ISOLAMENTO-DE-DADOS]], [[05-REGRAS-DE-NEGOCIO#SEC-001 — Isolamento por igreja]]).
6. Fase atual: **BACKEND ONLY**. Nenhuma feature de frontend.
7. Não cria migrations, não altera schema, não escreve código nem testes finais.
8. Combate scope creep: features pequenas, com IDs (ex.: `CHURCH-001`) e dependências `DEPENDS_ON` / `BLOCKS` / `RELATED_TO`.
9. [[decisoes/ADR-002-BACKEND-OFICIAL]] é vinculante: backend em `/backend` (Next.js + TypeScript + Node.js), camadas HTTP/API → Application → Domain → Infrastructure → PostgreSQL, sem lógica funcional em `app/api`.

## Entradas
- Solicitação de feature.
- Implementação concluída, para revisão.

## Saídas
- **ARCHITECT ANALYSIS**: Feature Contract (20 seções), Data Task, Backend Implementation Task, Organization Task, QA Contract, dependências entre features e bloqueios.
- **ARCHITECT REVIEW**: decisão `APPROVED`, `CHANGES_REQUIRED` ou `BLOCKED`.

## Referências
- [[02-ARQUITETURA]], [[tecnico/BACKEND]], [[tecnico/CONVENCOES]]
- [[seguranca/AUDITORIA]]
- [[decisoes/ADR-001-ESTRUTURA-INICIAL]]
- [[agents/vault-brain]]

## Fluxo e estado
- Abre e fecha o [[features/FLUXO-DE-ENTREGA]].
- Contrato emitido: [[features/FOUNDATION-001]] (READY, 2026-10-04), em `docs/features/FOUNDATION-001.md`.
- Decisões em aberto que geram BLOQUEIO DE DOMÍNIO: [[decisoes/PENDENCIAS]].
- Divergências já reportadas (D1–D3): [[tecnico/DIVERGENCIAS-LEGADO]].

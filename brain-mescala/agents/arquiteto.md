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
- Contratos emitidos:
  - [[features/FOUNDATION-001]] (READY, 2026-10-04), em `docs/features/FOUNDATION-001.md`. ARCHITECT REVIEW: CHANGES_REQUIRED na rodada 0 e **APPROVED** na rodada 1 (2026-10-19). As revisões não foram gravadas em arquivo; o registro permanente está na nota da feature.
  - [[features/AUTH-001]] (v1 em 2026-10-06; **v2 READY em 2026-10-22**), em `docs/features/AUTH-001.md`, versionado desde o commit `50a1cd6` (v2 no `4039fe0`). ARCHITECT REVIEW **APPROVED_WITH_NOTES** em 2026-10-22, sem rodada de correção; commit `50eaa1f`. A revisão não foi gravada no repositório; o registro permanente está na nota da feature. Registrou D-AUTH-01, D-AUTH-02, ARQ-AUTH-01, ARQ-AUTH-02, L-07, RT-AUTH-01 e RT-AUTH-02, e encerrou o L-06. DEC-06 e DEC-07 continuam propostas.
  - [[features/FOUNDATION-002]] (2026-10-22), em `docs/features/FOUNDATION-002.md`. VERSÃO 1 BLOCKED (B-01, B-02, Fase 4); respostas do PO no mesmo dia; **VERSÃO 2 READY**, emitida na revisão pré-aplicação (ARQ-F002-11). A revisão pré-aplicação devolveu um delta ao Analista (`RETURN_TO_DATA_ANALYST`); a confirmação do delta pelo Arquiteto está pendente, assim como a ARCHITECT REVIEW final.
- Próximos contratos previstos, segundo a FOUNDATION-002: FOUNDATION-003 (cliente de banco; traz a [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]]), AUTH-002 (DEC-06), AUTH-003 (DEC-07, B8 e a herança da AUTH-001), CHURCH-001, CHURCH-002, FOUNDATION-004 e a feature de convites.
- Interpretação aceita na revisão da FOUNDATION-001: [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]] (ARQ-FOUND-02).
- Decisões aceitas desde então: [[decisoes/ADR-003-AUTENTICACAO|ADR-003]], [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES|DEC-02]], [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04]] (parte 1), [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]] e [[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]] (com as respostas do PO aos bloqueios B-01 a B-04 da FOUNDATION-002).
- O [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|L-06]] foi encerrado pela AUTH-001 em 2026-10-22. Feature que altere o `backend/eslint.config.mjs` especifica casos novos na suíte GL ([[tecnico/BACKEND#Convenções do código e dos testes (desde a AUTH-001)|convenções]]). O contrato da AUTH-003 especifica a guarda de `fetchCache` ([[decisoes/PENDENCIAS#RT-AUTH-01 — Cache de segmento do Next sobre a busca do JWKS|RT-AUTH-01]]).
- Contrato com migration: aplica as [[tecnico/BANCO-DE-DADOS#Convenções do schema oficial (FOUNDATION-002, 2026-10-22)|convenções do schema oficial]]; função SECURITY DEFINER só com decisão explícita no contrato.
- Decisões em aberto que geram BLOQUEIO DE DOMÍNIO: [[decisoes/PENDENCIAS]].
- Divergências já reportadas (D1–D3 da FOUNDATION-001; D4 e D5 da análise da AUTH-001; D4 resolvida quanto ao backend oficial em 2026-10-21): [[tecnico/DIVERGENCIAS-LEGADO]].

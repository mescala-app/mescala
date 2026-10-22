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
  - AUTH-001 (2026-10-06), em `docs/features/AUTH-001.md` (fora do git). O PO aceitou o ADR-003 e decidiu a DEC-05 em 2026-10-21, e a DEC-02 (Vitest) em 2026-10-22. **Sem bloqueios de decisão:** passa a READY quando o Arquiteto atualizar o contrato com o Vitest (local dos testes, script `test` e convenções). DEC-06 e DEC-07 continuam propostas ([[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|AUTH-001]]).
- Próximo contrato previsto: **FOUNDATION-002 — Fundação de Persistência**, a emitir a partir de [[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]], [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04]] e [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]. Pontos ainda abertos que ele precisa tratar: [[decisoes/PENDENCIAS#Lacunas observadas no registro de 2026-10-21|lacunas observadas]] e [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]].
- Interpretação aceita na revisão da FOUNDATION-001: [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]] (ARQ-FOUND-02).
- Decisões aceitas desde então: [[decisoes/ADR-003-AUTENTICACAO|ADR-003]], [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES|DEC-02]], [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04]] (parte 1), [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]] e [[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]].
- Enquanto o [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|L-06]] estiver aberto, o contrato do primeiro gatilho especifica a correção dele. Gatilhos: feature que altere o `backend/eslint.config.mjs`; proposta de aceitar `.jsx`, ligar `allowJs` ou alterar `pageExtensions`; ou antes de CI/deploy.
- Decisões em aberto que geram BLOQUEIO DE DOMÍNIO: [[decisoes/PENDENCIAS]].
- Divergências já reportadas (D1–D3 da FOUNDATION-001; D4 e D5 da análise da AUTH-001; D4 resolvida quanto ao backend oficial em 2026-10-21): [[tecnico/DIVERGENCIAS-LEGADO]].

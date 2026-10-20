---
tipo: moc
area: governanca
---
# MOC — Governança

Decisões, pendências, entrega de features, agentes e estado atual do sistema.

## Decisões aceitas
- [[decisoes/ADR-001-ESTRUTURA-INICIAL]]
- [[decisoes/ADR-002-BACKEND-OFICIAL]]
- [[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]
- [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]] (ARQ-FOUND-02, da revisão da FOUNDATION-001)

## Decisões pendentes
- [[decisoes/PENDENCIAS]]: DEC-02 (testes), DEC-03 (autenticação), DEC-04 (migrations e acesso ao banco) e DATA-DEC-001 a 023.
- Propostas da AUTH-001, com número reservado e nada decidido: [[decisoes/PENDENCIAS#DEC-05 — Projeto Supabase oficial|DEC-05]] (projeto Supabase oficial), [[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]] (provisionamento do usuário) e [[decisoes/PENDENCIAS#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]] (padrão HTTP de erros e convenções de API).
- Aceitos com condições e ainda abertos: [[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]] (dívida de tooling) e [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|L-06]] (`.jsx` fora das guardas de lint).
- Observação para o PO: [[decisoes/PENDENCIAS#Cache do Supabase CLI no git|cache do Supabase CLI no git]].

## Entrega de features
- [[features/FLUXO-DE-ENTREGA]]
- [[features/FOUNDATION-001]]: implementada e encerrada (ARCHITECT REVIEW APPROVED em 2026-10-19, commit `7f26d30`).
- AUTH-001: contrato aguardando aprovação do PO ([[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|registro em PENDENCIAS]]).

## Agentes
- [[agents/arquiteto]]
- [[agents/analista-de-dados]]
- [[agents/desenvolvedor-backend]]
- [[agents/organizador]]
- [[agents/qa]]
- [[agents/vault-brain]]

## Estado atual (backend oficial)
- [[tecnico/BACKEND]]: `/backend` só com a rota técnica `GET /api/health` ([[features/FOUNDATION-001]]).
- [[tecnico/API]]: contratos de negócio continuam **A DEFINIR**.

## Estado atual (legado)
- [[tecnico/LEGADO-ATUAL]]
- [[tecnico/DIVERGENCIAS-LEGADO]]
- [[seguranca/RISCOS-DO-LEGADO]]
- [[produto/CONCEITOS-DO-CANVAS]] e [[Fluxograma.canvas]]

## Fontes fora do vault
- `docs/features/<ID>.md`: Feature Contracts e QA Contracts. Hoje: `FOUNDATION-001.md` (versionado) e `AUTH-001.md` (fora do git, aguardando aprovação do PO).
- ARCHITECT REVIEW da FOUNDATION-001: não foram gravadas em arquivo; o registro permanente está em [[features/FOUNDATION-001]].
- `backend/`: código do backend oficial (commit `7f26d30`).
- `docs/data/DATA-ARCHITECTURE-REPORT.md`: relatório do Analista de Dados (aguardando decisões do PO).
- `.claude/agents/*.md`: definições executáveis dos agentes.

## Manutenção
- [[tecnico/CONVENCOES]]
- [[CHANGELOG]]

---
tipo: moc
area: arquitetura
atualizado: 2026-10-22
---
# MOC — Arquitetura
- [[02-ARQUITETURA]]
- [[tecnico/FRONTEND]]
- [[tecnico/BACKEND]]
- [[tecnico/API]]
- [[tecnico/BANCO-DE-DADOS]]
- [[tecnico/CONVENCOES]]
- [[decisoes/ADR-001-ESTRUTURA-INICIAL]]
- [[decisoes/ADR-002-BACKEND-OFICIAL]]
- [[decisoes/ADR-003-AUTENTICACAO]]
- [[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]
- [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES]]
- [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]]
- [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]
- [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]]
- [[decisoes/DEC-09-MODELO-DE-DADOS]] (schema, RLS e nomes: DATA-DEC-018, 020 e 022)

## Estado atual e pendências
- [[features/FOUNDATION-001]]: implementada e encerrada; `/backend` existe, só com `GET /api/health`.
- AUTH-001: sem bloqueios de decisão ([[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|AUTH-001]]). FOUNDATION-002: contrato não emitido ([[features/FLUXO-DE-ENTREGA]]).
- [[tecnico/LEGADO-ATUAL]]
- [[tecnico/DIVERGENCIAS-LEGADO]]
- [[features/FLUXO-DE-ENTREGA]]
- [[decisoes/PENDENCIAS]]: [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]] (acesso ao banco) e [[decisoes/PENDENCIAS#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]] (padrão HTTP de erros e convenções de API, proposta da AUTH-001).
- Aceitos com condições e ainda abertos: [[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]] e [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|L-06]].
- [[MOCs/MOC-GOVERNANCA]]

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
- [[features/AUTH-001]]: implementada e encerrada em 2026-10-22 (commit `50eaa1f`); verificação do access token em `domains/auth`, testes com Vitest e convenções de código ([[tecnico/BACKEND#Convenções do código e dos testes (desde a AUTH-001)|tecnico/BACKEND]]).
- [[features/FOUNDATION-002]]: contrato VERSÃO 2 READY; 9 migrations escritas e não aplicadas; convenções do schema oficial em [[tecnico/BANCO-DE-DADOS#Convenções do schema oficial (FOUNDATION-002, 2026-10-22)|tecnico/BANCO-DE-DADOS]].
- [[tecnico/LEGADO-ATUAL]]
- [[tecnico/DIVERGENCIAS-LEGADO]]
- [[features/FLUXO-DE-ENTREGA]]
- [[decisoes/PENDENCIAS]]: [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]] (acesso ao banco) e [[decisoes/PENDENCIAS#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]] (padrão HTTP de erros e convenções de API, proposta da AUTH-001).
- Aceitos com condições e ainda abertos: [[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]], [[decisoes/PENDENCIAS#L-07 — Guarda 2b não normaliza o especificador|L-07]], [[decisoes/PENDENCIAS#RT-AUTH-01 — Cache de segmento do Next sobre a busca do JWKS|RT-AUTH-01]] e [[decisoes/PENDENCIAS#RT-AUTH-02 — Composição padrão no domínio|RT-AUTH-02]]. O [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|L-06]] foi encerrado em 2026-10-22.
- [[MOCs/MOC-GOVERNANCA]]

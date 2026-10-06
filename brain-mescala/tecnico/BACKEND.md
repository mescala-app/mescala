---
tipo: tecnico
camada: backend
---
# Backend
Decisão oficial: [[decisoes/ADR-002-BACKEND-OFICIAL]].

- Next.js + TypeScript, runtime Node.js, em `/backend`.
- Next.js apenas como camada HTTP/API; Route Handlers finos.
- Camadas: HTTP/API → Application → Domain → Infrastructure → PostgreSQL.
- Supabase Edge Functions não são a arquitetura principal.
- Primeira feature: `FOUNDATION-001` (inicialização do backend), sem regra de negócio.
- ORM, query builder, validação, autenticação, migrations, testes, auditoria e eventos: **A DEFINIR** (fora do ADR-002).

Responsabilidades:
- regras de domínio;
- autorização;
- validação de conflitos;
- persistência;
- eventos e integrações.

Referências: [[05-REGRAS-DE-NEGOCIO]], [[seguranca/AUTORIZACAO]], [[tecnico/API]].

## Estado em 2026-10-06
- `/backend` ainda não existe. A [[features/FOUNDATION-001]] está READY e não foi implementada.
- O app em uso não tem backend próprio: frontend legado + Supabase ([[tecnico/LEGADO-ATUAL]]).
- Entrega pelo [[features/FLUXO-DE-ENTREGA]].

## Pendências
- [[decisoes/PENDENCIAS#DEC-02 — Biblioteca oficial de testes e quem escreve os testes|DEC-02]]: biblioteca de testes.
- [[decisoes/PENDENCIAS#DEC-03 — Autenticação|DEC-03]]: autenticação.
- [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04]]: migrations e forma de acesso ao banco (afeta transações e o papel do RLS).

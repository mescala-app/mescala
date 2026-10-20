---
tipo: tecnico
camada: backend
status: ativo
relacionado:
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[features/FOUNDATION-001]]"
  - "[[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]]"
  - "[[tecnico/API]]"
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

## Estado em 2026-10-20
- `/backend` existe desde o commit `7f26d30`, entregue pela [[features/FOUNDATION-001]] (implementada e encerrada; ARCHITECT REVIEW APPROVED em 2026-10-19).
- **Pilha:** Next.js 16.4.2, TypeScript 6.0.3 e runtime Node.js; App Router em `backend/src/app`. React e React DOM entram só por exigência do Next, sem código React.
- **Scripts:** `dev`, `build`, `start`, `lint` e `typecheck`; sem `test` até a [[decisoes/PENDENCIAS#DEC-02 — Biblioteca oficial de testes e quem escreve os testes|DEC-02]].
- **Única rota:** `GET /api/health` ([[decisoes/DEC-01-ROTA-TECNICA-HEALTH|DEC-01]]). Ainda não há regra de negócio, banco nem autenticação, nem pastas `domains/`, `infrastructure/` ou `shared/`.
- **Guardas de lint do ADR-002** no `backend/eslint.config.mjs`: `src/domains/**` não importa `next`; `src/app/**` não exporta `runtime` diferente de `'nodejs'`. Limites aceitos (L-01 a L-06) e verificação mínima de regressão: [[features/FOUNDATION-001]].
- **Configuração aceita como desvio (D-01):** o `next.config.ts` só fixa a raiz do projeto no `/backend`; qualquer outra opção exige contrato.
- **Dependências:** só as aprovadas no contrato. Pacotes que estão no lockfile só como transitivos seguem a [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]].
- O app em uso ainda não passa pelo backend oficial: frontend legado + Supabase ([[tecnico/LEGADO-ATUAL]]).
- Entrega pelo [[features/FLUXO-DE-ENTREGA]].

## Pendências
- [[decisoes/PENDENCIAS#DEC-02 — Biblioteca oficial de testes e quem escreve os testes|DEC-02]]: biblioteca de testes.
- [[decisoes/PENDENCIAS#DEC-03 — Autenticação|DEC-03]]: autenticação. Proposta aguardando aprovação do PO: [[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|AUTH-001]].
- [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04]]: migrations e forma de acesso ao banco (afeta transações e o papel do RLS).
- [[decisoes/PENDENCIAS#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]]: padrão HTTP de erros e convenções de API (proposta da AUTH-001).
- [[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]]: dívida de tooling na cadeia de lint, aceita com condições.
- [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|L-06]]: `.jsx` fora das guardas de lint; nenhum `.jsx` em `backend/src` enquanto estiver aberto.

---
tipo: tecnico
camada: backend
status: ativo
atualizado: 2026-10-22
relacionado:
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[decisoes/ADR-003-AUTENTICACAO]]"
  - "[[decisoes/DEC-02-BIBLIOTECA-DE-TESTES]]"
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

Escolhas que o ADR-002 deixou de fora:

| Escolha | Situação |
|---|---|
| Autenticação | **Decidida:** [[decisoes/ADR-003-AUTENTICACAO\|ADR-003]] (2026-10-21) |
| Biblioteca de testes | **Decidida:** Vitest, [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES\|DEC-02]] (2026-10-22) |
| Estratégia de migrations | **Decidida:** [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS\|DEC-04, parte 1]] (2026-10-21) |
| Mecanismo de auditoria | **Decidido:** tabela só de inserção, gravada pelo backend ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 — Auditoria\|DATA-DEC-021]]) |
| ORM, query builder ou driver | **A DEFINIR:** [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco\|DEC-04, parte 2]] |
| Validação | **A DEFINIR** |
| Eventos | **A DEFINIR** |

Responsabilidades:
- regras de domínio;
- autorização;
- validação de conflitos;
- persistência;
- eventos e integrações.

Referências: [[05-REGRAS-DE-NEGOCIO]], [[seguranca/AUTORIZACAO]], [[tecnico/API]].

## O que as decisões de 2026-10-21 e 2026-10-22 pedem do backend
- **Autenticação:** resource server sem estado; valida o access token do Supabase Auth do projeto oficial pelo JWKS público, com `jose`; ponto único em `domains/auth`; sem middleware; sem segredos ([[decisoes/ADR-003-AUTENTICACAO|ADR-003]]).
- **Igreja atual:** como um usuário pode estar em várias igrejas, cada requisição precisa de "igreja atual" no contexto ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-006 — Usuário em mais de uma igreja|DATA-DEC-006]]).
- **Acesso ao banco:** conexão direta ao Postgres com um papel sem BYPASSRLS, definindo o contexto (usuário, igreja) em cada transação ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]]). A ferramenta está na DEC-04, parte 2.
- **Transições de status:** validadas no backend; o banco só guarda os valores ([[dados/STATUS]]).
- **Auditoria:** gravada pelo backend, na mesma transação da operação.
- **Testes:** Vitest, como dependência de desenvolvimento, com versão exata, na primeira feature que precisar dele (AUTH-001). O Desenvolvedor escreve os testes dos cenários do QA Contract; o QA revisa e acrescenta casos adversariais. Local, script `test` e convenções: definidos pelo Arquiteto nesse contrato ([[decisoes/DEC-02-BIBLIOTECA-DE-TESTES|DEC-02]]).

## Estado em 2026-10-22
- `/backend` existe desde o commit `7f26d30`, entregue pela [[features/FOUNDATION-001]] (implementada e encerrada; ARCHITECT REVIEW APPROVED em 2026-10-19).
- **Pilha:** Next.js 16.4.2, TypeScript 6.0.3 e runtime Node.js; App Router em `backend/src/app`. React e React DOM entram só por exigência do Next, sem código React.
- **Scripts:** `dev`, `build`, `start`, `lint` e `typecheck`. Ainda sem `test`: ele entra com a feature que instalar o Vitest.
- **Única rota:** `GET /api/health` ([[decisoes/DEC-01-ROTA-TECNICA-HEALTH|DEC-01]]). Ainda não há regra de negócio, banco nem autenticação, nem pastas `domains/`, `infrastructure/` ou `shared/`.
- **Guardas de lint do ADR-002** no `backend/eslint.config.mjs`: `src/domains/**` não importa `next`; `src/app/**` não exporta `runtime` diferente de `'nodejs'`. Limites aceitos (L-01 a L-06) e verificação mínima de regressão: [[features/FOUNDATION-001]].
- **Configuração aceita como desvio (D-01):** o `next.config.ts` só fixa a raiz do projeto no `/backend`; qualquer outra opção exige contrato.
- **Dependências:** só as aprovadas no contrato. Pacotes que estão no lockfile só como transitivos seguem a [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]].
- O app legado não passa pelo backend oficial e não tem uso real (2026-10-22) ([[tecnico/LEGADO-ATUAL]]).
- Entrega pelo [[features/FLUXO-DE-ENTREGA]]. Próximas features: AUTH-001 (sem bloqueios de decisão) e FOUNDATION-002 (contrato não emitido).

## Pendências
- [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]]: forma de acesso ao banco (afeta transações e o papel do RLS).
- [[decisoes/PENDENCIAS#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]]: padrão HTTP de erros e convenções de API (proposta da AUTH-001).
- [[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]]: provisionamento do usuário do Mescala.
- [[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]]: dívida de tooling na cadeia de lint, aceita com condições. A feature que instalar o Vitest altera dependências: `npm audit --omit=dev` = 0 é condição de encerramento.
- [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|L-06]]: `.jsx` fora das guardas de lint; nenhum `.jsx` em `backend/src` enquanto estiver aberto.

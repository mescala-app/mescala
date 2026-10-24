---
tipo: tecnico
camada: backend
status: ativo
atualizado: 2026-10-24
relacionado:
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[decisoes/ADR-003-AUTENTICACAO]]"
  - "[[decisoes/DEC-02-BIBLIOTECA-DE-TESTES]]"
  - "[[features/FOUNDATION-001]]"
  - "[[features/AUTH-001]]"
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
| Biblioteca de testes | **Decidida:** Vitest 5.0.5, [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES\|DEC-02]] (2026-10-22); instalada pela [[features/AUTH-001]]. Convenções: [[#Convenções do código e dos testes (desde a AUTH-001)\|abaixo]] |
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
- **Testes:** Vitest 5.0.5, como dependência de desenvolvimento, instalado pela [[features/AUTH-001]]. O Desenvolvedor escreve os testes dos cenários do QA Contract; o QA revisa e acrescenta casos adversariais ([[decisoes/DEC-02-BIBLIOTECA-DE-TESTES|DEC-02]]). Local, script `test` e convenções foram definidos pelo Arquiteto no contrato da AUTH-001: [[#Convenções do código e dos testes (desde a AUTH-001)|convenções]].

## Estado em 2026-10-22
- `/backend` existe desde o commit `7f26d30`, entregue pela [[features/FOUNDATION-001]] (implementada e encerrada; ARCHITECT REVIEW APPROVED em 2026-10-19). A [[features/AUTH-001]] foi implementada e encerrada em 2026-10-22 (ARCHITECT REVIEW APPROVED_WITH_NOTES; commit `50eaa1f`).
- **Pilha:** Next.js 16.4.2, TypeScript 6.0.3 e runtime Node.js; App Router em `backend/src/app`. React e React DOM entram só por exigência do Next, sem código React.
- **Scripts:** `dev`, `build`, `start`, `lint`, `typecheck` e `test` (`vitest run`, desde a AUTH-001).
- **Única rota:** `GET /api/health` ([[decisoes/DEC-01-ROTA-TECNICA-HEALTH|DEC-01]]). Ainda não há regra de negócio nem banco.
- **Pastas:** `src/app`, `src/domains/auth` e `src/infrastructure/supabase-auth` (desde a AUTH-001). Não existe `shared/`.
- **Autenticação:** a verificação do access token existe desde a AUTH-001 (`requireAuthenticatedIdentity`, em `domains/auth`, com o verificador em `infrastructure/supabase-auth`), mas **ainda não há rota protegida** (AUTH-003).
- **Guardas de lint** no `backend/eslint.config.mjs`, um objeto por área:
  - ADR-002: `src/domains/**` não importa `next`; `src/app/**` não exporta `runtime` diferente de `'nodejs'`;
  - ADR-003 (desde a AUTH-001): `src/domains/**` não importa `jose` nem `@supabase/*`; `src/app/**` não importa `jose`, `@supabase/*` nem `infrastructure/supabase-auth`;
  - arquivos cobertos: `.ts`, `.tsx`, `.mts`, `.cts`, `.js`, `.jsx`, `.mjs` e `.cjs`. O L-06 foi **encerrado** em 2026-10-22;
  - regressão automatizada: suíte GL em `backend/eslint.config.test.ts`. Limites aceitos (L-01 a L-05, L-07): [[features/FOUNDATION-001]] e [[features/AUTH-001]].
- **Configuração aceita como desvio (D-01):** o `next.config.ts` só fixa a raiz do projeto no `/backend`; qualquer outra opção exige contrato.
- **Dependências:** só as aprovadas em contrato. Desde a AUTH-001: `jose` 6.2.13 (`dependencies`) e `vitest` 5.0.5 (`devDependencies`). Pacotes que estão no lockfile só como transitivos seguem a [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]].
- O app legado não passa pelo backend oficial e não tem uso real (2026-10-22) ([[tecnico/LEGADO-ATUAL]]).
- Entrega pelo [[features/FLUXO-DE-ENTREGA]]. A [[features/FOUNDATION-002]] foi aplicada em 2026-10-23 e está encerrada (APPROVED_WITH_NOTES): criou `backend/supabase/` e não mudou `backend/src`. O acesso do backend ao banco vem na FOUNDATION-003 (proposta).

## Convenções do código e dos testes (desde a AUTH-001)
Definidas no contrato da [[features/AUTH-001]] e registradas pela ARCHITECT REVIEW dela (O-9). Valem para toda feature do `/backend`.

- **Pastas:** `src/domains/<domínio>/`; `src/infrastructure/<provedor>-<capacidade>/` (exemplo: `supabase-auth`). Nunca pasta genérica por fornecedor (`infrastructure/supabase/`), nem `shared/`, `lib/`, `utils/` ou `helpers/` para conceito de negócio.
- **Arquivos:**
  - inglês, kebab-case, um conceito principal por arquivo;
  - nome do arquivo = símbolo principal exportado (`require-authenticated-identity.ts` → `requireAuthenticatedIdentity`);
  - sufixos por papel (`.service`, `.repository`, `.policy`, `.use-case`): **não decididos**; o primeiro contrato com caso de uso ou repositório decide;
  - sem barrels (`index.ts`), pastas vazias ou `.gitkeep`;
  - cabeçalho didático em todo `.ts` e `.mts`, inclusive testes e configuração; comentário RELAÇÃO EXTERNA nas chamadas entre áreas e a bibliotecas.
- **Imports:** alias `@/` entre áreas (`app`, `domains`, `infrastructure`) e `./` na mesma pasta, sempre na forma canônica ([[decisoes/PENDENCIAS#L-07 — Guarda 2b não normaliza o especificador|L-07]]); código de produção nunca importa `vitest` nem `*.test.ts`.
- **Composição:** a da AUTH-001, conforme o [[decisoes/PENDENCIAS#RT-AUTH-02 — Composição padrão no domínio|RT-AUTH-02]]. Não é padrão geral.
- **Testes (Vitest):** um único script `"test": "vitest run"`; configuração única em `backend/vitest.config.mts` (alias `@/` por expressão regular, `include` = `src/**/*.test.ts` + `eslint.config.test.ts`, ambiente `node`, sem globais, sem setupFiles, coverage ou plugins).
- **Local e nome dos testes:**
  - `<arquivo>.test.ts` na mesma pasta do arquivo testado;
  - casos adversariais do QA em arquivo próprio `<arquivo>.qa.test.ts`, na mesma pasta, ou nos arquivos existentes (D-AUTH-01);
  - teste de configuração na raiz do `/backend` (`eslint.config.test.ts`);
  - extensão sempre `.test.ts`;
  - sem `__tests__/`, `tests/`, `test/`, `spec/`, `test-utils/`, `helpers/`, `fixtures/`, `mocks/`, `__mocks__/`, `__snapshots__/` nem `setup*`; utilitários de teste dentro do próprio arquivo.
- **Nome de cada caso:** começa pelo ID do cenário (`B6 — …`, `H1 — …`, `GL9 — …`, `QA-1 — …`); `it.each` mantém o ID.
- **Sem rede:** nenhum teste usa rede, projeto real ou usuário real. Em `domains/auth` e `infrastructure/supabase-auth`, o `fetch` global é bloqueado (`vi.stubGlobal`) e conferido como não chamado. Domínios de teste com TLD `.invalid`; chaves geradas no teste; ambiente só por `vi.stubEnv`, com restauração.
- **Proibidos:** `vi.mock` e `vi.doMock` de bibliotecas ou de módulos do projeto (usar a injeção prevista no contrato); snapshots; `.only`, `.skip`, `.todo`; espera real; ler `.env*`; `node:test`; APIs ausentes no Node 22.15.1.
- **Lint e tipos:** testes lintados e tipados como o resto, sem exceção e sem `eslint-disable`.
- **Regressão do lint:** suíte GL em `backend/eslint.config.test.ts` (ESLint pela API, configuração real, caminhos virtuais). Toda mudança no `eslint.config.mjs` exige `npm run test` e casos novos para cada guarda nova.

## Pendências
- [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]]: forma de acesso ao banco (afeta transações e o papel do RLS). Vem com a FOUNDATION-003 (proposta), o cliente de banco do backend.
- [[decisoes/PENDENCIAS#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]]: padrão HTTP de erros e convenções de API (proposta da AUTH-001).
- [[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]]: provisionamento do usuário do Mescala.
- [[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]]: dívida de tooling na cadeia de lint, aceita com condições. A AUTH-001 alterou dependências e cumpriu a condição de encerramento (`npm audit --omit=dev` = 0).
- [[decisoes/PENDENCIAS#L-07 — Guarda 2b não normaliza o especificador|L-07]]: a guarda 2b não normaliza o especificador; imports sempre na forma canônica.
- [[decisoes/PENDENCIAS#RT-AUTH-01 — Cache de segmento do Next sobre a busca do JWKS|RT-AUTH-01]]: nenhum `fetchCache` em `src/app/**` até a guarda da AUTH-003.
- [[decisoes/PENDENCIAS#RT-AUTH-02 — Composição padrão no domínio|RT-AUTH-02]]: composição padrão no domínio, dívida estrutural aceita; não é padrão geral.
- Herança da AUTH-001 para a AUTH-003: [[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|PENDENCIAS]].

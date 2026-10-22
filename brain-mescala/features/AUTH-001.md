---
tipo: feature
id: AUTH-001
dominio: auth
status: encerrada
implementacao: implementada
revisao-arquiteto: approved
decisao-revisao: APPROVED_WITH_NOTES
aprovada: 2026-10-22
commit: "50eaa1f"
contrato: docs/features/AUTH-001.md
contrato-versao: 2
contrato-ready: 2026-10-22
emitido: 2026-10-06
relacionado:
  - "[[decisoes/ADR-003-AUTENTICACAO]]"
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[decisoes/DEC-02-BIBLIOTECA-DE-TESTES]]"
  - "[[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]"
  - "[[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]]"
  - "[[features/FOUNDATION-001]]"
  - "[[features/FOUNDATION-002]]"
  - "[[features/FLUXO-DE-ENTREGA]]"
  - "[[decisoes/PENDENCIAS]]"
  - "[[seguranca/AUTENTICACAO]]"
  - "[[tecnico/BACKEND]]"
  - "[[tecnico/API]]"
atualizado: 2026-10-22
---
# AUTH-001 — Fundação de Autenticação

## Situação em 2026-10-22
- **Status:** **IMPLEMENTADA e ENCERRADA**. ARCHITECT REVIEW **APPROVED_WITH_NOTES** em 2026-10-22, que equivale a APPROVED na definição do [[agents/arquiteto|Arquiteto]]. Nenhuma mudança de código foi pedida e nada voltou a nenhum executor. Não houve rodada de correção.
- **Commit:** `50eaa1f` ("AUTH-001: fundação de autenticação (verificação do access token do Supabase Auth)"), com exatamente 16 arquivos ([[#Os 16 arquivos do commit|lista abaixo]]). Feito pelo orquestrador, com autorização do PO. Local: ainda não enviado ao `origin`.
- **Fora do commit:** `backend/supabase/**`, o diff de `backend/.gitignore` e `docs/features/FOUNDATION-002-DATA-TASK-RESULT.md`, que são da [[features/FOUNDATION-002]]; e `brain-mescala/**`, que tem commit próprio, como no precedente `f2f2569`.
- **Contrato (fora do vault):** `docs/features/AUTH-001.md`. A v1 foi emitida pelo Arquiteto em 2026-10-06. A **v2 ficou READY em 2026-10-22**: o "ADENDO v2", no fim do arquivo, substitui as seções que lista. O arquivo está versionado desde o commit `50a1cd6` (v1, 2026-10-22 00:37) e foi atualizado para a v2 no `4039fe0`.
- **Registro da revisão:** a ARCHITECT REVIEW não foi gravada no repositório. **Esta nota é o registro permanente dela**, junto com a entrada de 2026-10-22 do [[CHANGELOG]].

## Por que existe
O [[decisoes/ADR-003-AUTENTICACAO|ADR-003]] (aceito em 2026-10-21) decidiu a autenticação: Supabase Auth do projeto oficial, com o backend como resource server sem estado, que só valida o access token. A AUTH-001 cria o ponto único dessa validação em `domains/auth`. Toda rota protegida e toda feature que precise saber "quem é o usuário" depende dela.

## Escopo, segundo o contrato
- Verificar o access token e devolver a **identidade do provedor**, sem banco, sem igreja e sem rota nova.
- O adendo v2 também:
  - instala o Vitest ([[decisoes/DEC-02-BIBLIOTECA-DE-TESTES|DEC-02]]) e especifica as convenções de teste;
  - corrige o [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|L-06]];
  - transforma em teste automatizado a [[features/FOUNDATION-001#Verificação mínima de regressão do lint|verificação mínima de regressão do lint]] (B3 da FOUNDATION-001);
  - automatiza o B1 e o B2 da FOUNDATION-001 no nível do módulo.

## Fora do escopo
Segundo a FC-20 do contrato v2:
- endpoints de login, cadastro, logout, refresh, senha, confirmação de email, OAuth e MFA; cookies, BFF e CORS; qualquer rota nova;
- mapeamento HTTP e envelope de erro ([[decisoes/PENDENCIAS#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]]);
- usuário do Mescala, tabela `users` e provisionamento ([[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]]);
- igreja, vínculos, papéis, permissões, ministérios e convites;
- validação remota (`getUser`), service role e Admin API; logging, auditoria, eventos e rate limit;
- painel do Supabase e ambiente (`SUPABASE_URL`, chaves, TTL, confirmação de email), que ficam com o PO; arquivos `.env*`;
- `backend/supabase/`, que é da [[features/FOUNDATION-002]];
- aceitar `.jsx`, ligar `allowJs` ou alterar `pageExtensions` (o encerramento do L-06 não autoriza nada disso);
- teste HTTP com servidor rodando (inclusive o 405 real do B2 da FOUNDATION-001), testes com banco, cobertura mínima e CI.

## O que foi entregue
- **Ponto único:** `requireAuthenticatedIdentity` em `backend/src/domains/auth`. Lê só o header `Authorization`, valida o formato `Bearer <token>` e delega a verificação à infraestrutura. Devolve a `AuthenticatedIdentity` com **exatamente 3 campos** (`externalUserId` = `sub`, `sessionId` = `session_id`, `expiresAt`), somente leitura e congelada.
- **5 códigos de erro** (`AuthenticationError`): `AUTH_MISSING_CREDENTIAL`, `AUTH_MALFORMED_CREDENTIAL`, `AUTH_INVALID_TOKEN`, `AUTH_TOKEN_EXPIRED` e `AUTH_VERIFICATION_UNAVAILABLE`. Nenhum caminho de falha devolve identidade.
- **Infraestrutura** em `backend/src/infrastructure/supabase-auth`:
  - configuração a partir de `SUPABASE_URL`, a única variável de ambiente lida, carregada sob demanda; a falha não fica guardada; configuração inválida falha fechada;
  - verificador com `jose`, com o JWKS criado uma vez por processo e buscado com `cache: "no-store"`;
  - lista fechada de algoritmos (ES256 e RS256) antes de resolver a chave; `jku`, `x5u` e `jwk` não são usados; `none` e `HS*` são rejeitados; `iss`, `aud`, `role`, `exp`/`nbf`, `sub`, `session_id` e `is_anonymous` são validados;
  - falhas classificadas pela origem (`guardKeyResolution`, `classifyVerificationFailure`): nenhum erro desconhecido resulta em identidade;
  - nenhum segredo; nenhum vazamento de token em mensagem, propriedade ou `cause` de erro.
- **Guardas de lint do ADR-003** (`backend/eslint.config.mjs`, um objeto de configuração por área):
  - guarda 1, `src/domains/**`: além de `next` e `next/*` (ADR-002), não importa `jose`, `jose/*` nem `@supabase/*`;
  - guarda 2, `src/app/**`: parte 2a (`runtime`, ADR-002, sem mudança) e parte 2b (ADR-003, item 8): não importa `jose`, `jose/*`, `@supabase/*` nem nenhum especificador com o segmento `infrastructure/supabase-auth`;
  - correção do L-06: `jsx` no `files` das duas guardas; "Arquivos cobertos" nos itens 1 e 2 do cabeçalho; redação sobre `import()` de tipo corrigida.
- **Dependências:** `jose` 6.2.13 em `dependencies`; `vitest` 5.0.5 em `devDependencies`, com `vite` 8.3.5 transitivo. Nenhuma versão com `^` ou `~`. O lockfile só acrescenta os transitivos do Vitest e o `jose`.
- **Testes:** script `"test": "vitest run"`; configuração única em `backend/vitest.config.mts`. **6 arquivos de teste, 251 casos**:
  - `backend/eslint.config.test.ts`: suíte GL (GL1 a GL12), regressão das guardas de lint;
  - `backend/src/app/api/health/route.test.ts`: H1 e H2 (B1 e B2 da FOUNDATION-001 no nível do módulo);
  - `require-authenticated-identity.test.ts`, `supabase-auth-config.test.ts` e `supabase-access-token-verifier.test.ts`: cenários B;
  - `supabase-access-token-verifier.qa.test.ts`: casos adversariais do QA, QA-1 a QA-4 (19 casos).
- **Sem** rota nova (`/api/health` intacta, `route.ts` sem diff), banco, cliente Supabase, `middleware.*` ou `proxy.*`. Nenhuma ref ou URL de projeto no código, nos testes ou na configuração.
- **Convenções** de pastas, nomes, imports, composição e testes que a AUTH-001 inaugurou: [[tecnico/BACKEND#Convenções do código e dos testes (desde a AUTH-001)|tecnico/BACKEND]].

### Os 16 arquivos do commit
- **Modificados (4):** `backend/eslint.config.mjs`, `backend/package.json`, `backend/package-lock.json`, `backend/tsconfig.json` (só o `include`).
- **Novos (12):**
  - `backend/eslint.config.test.ts`, `backend/vitest.config.mts`, `backend/src/app/api/health/route.test.ts`;
  - `backend/src/domains/auth/`: `authenticated-identity.ts`, `authentication-error.ts`, `require-authenticated-identity.ts`, `require-authenticated-identity.test.ts`;
  - `backend/src/infrastructure/supabase-auth/`: `supabase-auth-config.ts`, `supabase-auth-config.test.ts`, `supabase-access-token-verifier.ts`, `supabase-access-token-verifier.test.ts`, `supabase-access-token-verifier.qa.test.ts`.

## Histórico do fluxo
Segunda execução completa do [[features/FLUXO-DE-ENTREGA]]. Sem a etapa do [[agents/analista-de-dados|Analista de Dados]], porque a feature não tem banco, e sem rodada de correção.

| # | Etapa | Resultado |
|---|---|---|
| 1 | [[agents/arquiteto\|Arquiteto]]: contrato | v1 emitida em 2026-10-06; **v2 READY** em 2026-10-22 |
| 2 | [[agents/desenvolvedor-backend\|Desenvolvedor]] | implementação e testes dos cenários do QA Contract (DEC-02) |
| 3 | [[agents/organizador\|Organizador]] | conferência da estrutura; apontou a composição domínio → infraestrutura (O-8), que virou a dívida RT-AUTH-02 |
| 4 | [[agents/qa\|QA]] | **APPROVED** (`READY_FOR_ARCHITECT_REVIEW`), com casos adversariais QA-1 a QA-4 |
| 5 | Arquiteto: ARCHITECT REVIEW | **APPROVED_WITH_NOTES** (2026-10-22) |
| 6 | Orquestrador, com autorização do PO | commit `50eaa1f` |

## Validação realizada
- **QA:** APPROVED, com recomendação `READY_FOR_ARCHITECT_REVIEW`.
- **Ferramentas (E.2 do QA Contract):** T1 `npm run typecheck`; T2 `npm run lint`; T3 `npm run build` sem `SUPABASE_URL`; T4 `npm run test`; T5 lint da raiz sem caminhos `backend/`; T6 `npm audit --omit=dev` = 0; T7 `npm audit` sem advisory além do GHSA-vfj7-8cjw-p6xm ([[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]]).
- **Reexecução pelo Arquiteto** (só leitura, 2026-10-22), em `/backend`, sem `SUPABASE_URL`, Node v22.15.1: `npm run typecheck` exit 0; `npm run lint` exit 0; `npm test` com 6 arquivos e 251/251. Não rodou de novo `build` nem `npm audit`: valem T3, T6 e T7 do QA.
- **Automatizados:** B1 a B23, B25 e B26 (o B24 foi substituído pela suíte GL), H1, H2, GL1 a GL12 e QA-1 a QA-4.
- **Buscas do Arquiteto:** nenhum `eslint-disable`, `.only`, `.skip`, `.todo`, `vi.mock`, snapshot ou `console`; nenhuma ref ou URL de projeto; a única leitura de ambiente é `process.env.SUPABASE_URL`; nenhum `.jsx`, `middleware.*`, `proxy.*`, `backend/app/` ou `pages/`. `next.config.ts`, `.gitignore` e `route.ts` sem diff.
- **NOT TESTED** (E.7 do QA Contract), aceitos e passados para a AUTH-003:
  - integração real com o JWKS do projeto oficial;
  - chaves assimétricas, TTL e confirmação de email no projeto novo (verificação do PO);
  - 405 HTTP real do B2 da FOUNDATION-001 (só com servidor rodando; o H2 cobre o nível do módulo);
  - regra 6 (cache de dados do Next sobre o `fetch` do JWKS): o `fetch` do Next não existe no Vitest; ficou com a revisão estática (S18);
  - também o O-14: teste do verificador padrão com configuração válida, hoje só com revisão estática.
- **Sem cenários de banco.**

## Revisão por dimensão (resumo)
- **Brain:** ADR-003, itens 1 a 9 e 11 implementados (o item 10, revogação, é do provedor); ADR-002 (domínio sem `next`, HTTP inalterada, runtime Node); DEC-01 (`/api/health` intacta); DEC-02 (o Desenvolvedor escreveu os testes, o QA os adversariais); DEC-05 (nenhuma ref no código); DEC-08 (testes importam só `vitest`, `jose`, `eslint` e `node:*`).
- **Contrato:** FC-19, critérios 1 a 21 atendidos; dois desvios formais, D-AUTH-01 e D-AUTH-02, e a interpretação ARQ-AUTH-02 (abaixo).
- **Banco:** não se aplica.
- **Autorização:** não se aplica por desenho: nenhum papel nem igreja vem do token (S8 e B21).
- **Isolamento por igreja:** não se aplica: a identidade não tem igreja; token de outro projeto é rejeitado (B13).
- **Escopo:** nenhum escopo extra.

## Decisões e desvios aceitos pelo Arquiteto
### D-AUTH-01 — Arquivo do QA fora de "Arquivos esperados"
`backend/src/infrastructure/supabase-auth/supabase-access-token-verifier.qa.test.ts`, com QA-1 a QA-4 (19 casos). Literalmente fora da lista dos critérios 1 e 18 da FC-19, mas autorizado pela E.8 do QA Contract ("um `*.test.ts` novo ao lado do arquivo testado"); casa com `src/**/*.test.ts`. Faz parte da AUTH-001 e **inaugura a convenção `<arquivo>.qa.test.ts`** para casos adversariais do QA em arquivo próprio.

### D-AUTH-02 — `export type SupabaseAuthConfig`
A assinatura conceitual é `loadSupabaseAuthConfig(): { issuer: string; jwksUrl: URL }`; o código nomeia e exporta `Readonly<{ issuer; jwksUrl }>`. Aceito: estruturalmente igual, sem consumidor externo, sem camada nova. **Qualquer outro símbolo exportado de `infrastructure/supabase-auth` precisa de contrato.**

### ARQ-AUTH-01 — Leitura literal das validações de claims
Aceita. O código segue a letra do [[decisoes/ADR-003-AUTENTICACAO|ADR-003]] (item 5) e da FC-5:
- `session_id` só com espaços é aceito (regra "string não vazia"; formato não exigido);
- `is_anonymous: "true"` (string) é aceito (regra "diferente de `true`" booleano);
- `exp` vencido com assinatura válida → `AUTH_TOKEN_EXPIRED`, mesmo com `role` ou `sub` inválidos (o `jose` confere `exp` antes das checagens do Mescala).

Nenhum devolve identidade; os dois primeiros exigem assinatura do provedor, que emite UUID e booleano. Consequências:
- **(a)** `AUTH_TOKEN_EXPIRED` significa só "não autenticado, token vencido" e não atesta os demais claims. O mapeamento HTTP ([[decisoes/PENDENCIAS#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]]) e o provisionamento (AUTH-002) não podem tratar esse código como prova de conta legítima;
- **(b)** se o PO adotar um Custom Access Token Hook, a validação de tipo de `role`, `is_anonymous` e `session_id` é reaberta em contrato próprio;
- **(c)** se a revogação por sessão (B8) usar `sessionId` como chave, o contrato dela decide se exige formato UUID.

Acompanhamento: [[decisoes/PENDENCIAS#ARQ-AUTH-01 — Leitura literal das validações de claims|PENDENCIAS]].

### ARQ-AUTH-02 — Escopo dos critérios 1, 18 e 19 diante da FOUNDATION-002 em paralelo
Os critérios valem para o conjunto de mudanças da AUTH-001. `backend/supabase/` e `docs/features/FOUNDATION-002-DATA-TASK-RESULT.md` são da [[features/FOUNDATION-002]] ([[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04]]): "`backend/supabase/` não é criado" quer dizer "não é criado pela AUTH-001". Vale o simétrico para a FOUNDATION-002: o critério 22 e o S16 dela são medidos tomando o commit da AUTH-001 como base, não o `4039fe0`.

### Decisões sobre as observações do QA e do Organizador
- **O-4:** aceito como está, com nota para a AUTH-003 (registro: ARQ-AUTH-01).
- **O-10:** aceito o `export type SupabaseAuthConfig` (registro: D-AUTH-02).
- **O-12:** limite novo L-07, sem ajustar a expressão regular.
- **O-2:** confirmado; limite documentado como RT-AUTH-01, com a guarda na AUTH-003. A regra 6 está cumprida hoje (nenhum `fetchCache`, nenhuma rota protegida); não é IMPLEMENTATION DIVERGENCE.
- **Arquivo do QA:** entra na AUTH-001 (registro: D-AUTH-01).
- **L-06:** encerrado.
- **O-8:** dívida estrutural aceita, RT-AUTH-02; não vira padrão geral. **O-9:** as convenções de nomes, imports, composição e testes vão para [[tecnico/BACKEND#Convenções do código e dos testes (desde a AUTH-001)|tecnico/BACKEND]].
- **O-7:** lista exata dos 16 arquivos do commit.

### Observações sem ação
- O-3 (alias `@/` por expressão regular no `vitest.config.mts`): equivalente ao `paths`, aceito.
- O-5 (`cause`) e O-6 (mensagem do GL11): conformes.
- O-11 (duplicação do `blockedFetch`): exigida pela convenção de utilitários dentro do próprio arquivo de teste.
- O cabeçalho do `vitest.config.mts` não cita QA-1 a QA-4 nem o `.qa.test.ts` (o QA não podia alterá-lo): atualizar na próxima feature que mexer nele.

## Limites e riscos
### L-06 — encerrado
**ENCERRADO em 2026-10-22** por esta feature. Correção em `backend/eslint.config.mjs`: `jsx` no `files` das duas guardas; itens 1 e 2 do cabeçalho com "Arquivos cobertos: .ts, .tsx, .mts, .cts, .js, .jsx, .mjs e .cjs"; redação sobre `import()` de tipo corrigida. Provas: casos `.jsx` de GL3, GL7 e GL10 na suíte GL. O encerramento não autoriza `.jsx`, `allowJs` nem mudança de `pageExtensions`. A condição (a) vira regra estrutural permanente: **nenhum `.jsx` em `backend/src`** (BACKEND ONLY, sem React); Organizador e QA conferem em toda feature. A condição (c) ficou sem objeto. Registro: [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|PENDENCIAS]].

### L-07 — Guarda 2b não normaliza o especificador
Aberto, não bloqueante. A guarda compara o texto do especificador: formas não normalizadas (`@/infrastructure/./supabase-auth/...`, `@/infrastructure//supabase-auth/...`) e reexportação a partir de outro módulo de `@/infrastructure` a contornam. Protege contra violação acidental, não contra contorno deliberado. Condições e reavaliação: [[decisoes/PENDENCIAS#L-07 — Guarda 2b não normaliza o especificador|PENDENCIAS]].

### RT-AUTH-01 — Cache de segmento do Next sobre a busca do JWKS
Aceito. Com `fetchCache = 'force-cache'` num segmento de rota, a busca do JWKS (`no-store`) passaria a ter cache infinito; com `'only-cache'`, a verificação falha fechada. Hoje nenhum segmento declara `fetchCache`. Condições: [[decisoes/PENDENCIAS#RT-AUTH-01 — Cache de segmento do Next sobre a busca do JWKS|PENDENCIAS]].

### RT-AUTH-02 — Composição padrão no domínio
Dívida estrutural aceita: `requireAuthenticatedIdentity` recebe o verificador da infraestrutura como parâmetro com valor padrão, o que cria um ciclo entre as pastas `domains/auth` e `infrastructure/supabase-auth` (não entre arquivos). Não é padrão geral. Reavaliação: [[decisoes/PENDENCIAS#RT-AUTH-02 — Composição padrão no domínio|PENDENCIAS]].

### RT-FOUND-01 — condição cumprida
A AUTH-001 alterou dependências do `/backend` e cumpriu a condição de encerramento: `npm audit --omit=dev` = 0; nenhum advisory além do GHSA-vfj7-8cjw-p6xm.

## Herança para a AUTH-003
1. [[decisoes/PENDENCIAS#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]]: o mapeamento HTTP mantém separados os 4 códigos de "não autenticado" e o `AUTH_VERIFICATION_UNAVAILABLE`; `AUTH_TOKEN_EXPIRED` não atesta os demais claims (ARQ-AUTH-01, a).
2. RT-AUTH-01: guarda de lint contra `fetchCache` em `src/app/**` e verificação da regra 6 em runtime.
3. Teste do verificador padrão com configuração válida (`createDefaultVerifier`, `fetchJwksWithoutNextCache`, `createRemoteJWKSet`), hoje só com revisão estática (O-14). Inclui o JWKS real, que depende das condições do ADR-003 com o PO.
4. O 405 real do B2 da [[features/FOUNDATION-001]], com servidor rodando.
5. `Object.freeze` é raso (O-13): `expiresAt` é `Date` mutável; consumidores não o alteram (copiam, se precisarem).
6. B8 (revogação do usuário no domínio): **A DEFINIR**.

## Dependências entre features
- **DEPENDS_ON:** [[features/FOUNDATION-001]], [[decisoes/ADR-003-AUTENTICACAO|ADR-003]] e [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES|DEC-02]]. Todas cumpridas.
- **BLOCKS:** AUTH-002, AUTH-003, CHURCH-001 e CHURCH-002 (e toda rota protegida, segundo o contrato). Com a AUTH-001 encerrada, essa dependência está cumprida. A AUTH-002 continua bloqueada pela [[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]]; a AUTH-003, pela DEC-07 e pelo B8.
- **RELATED_TO:**
  - [[features/FOUNDATION-001]]: L-06 corrigido aqui; B1 a B3 automatizados aqui (H1, H2 e suíte GL);
  - [[features/FOUNDATION-002]], em paralelo: o único ponto de contato é `backend/.gitignore` (ARQ-AUTH-02);
  - [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]], necessária para operar; [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]]; RT-FOUND-01;
  - toda feature futura que alterar o `eslint.config.mjs` herda a suíte GL e precisa estendê-la.

## Pendências que não bloqueiam
- **Para operar, com o PO:** `SUPABASE_URL` no ambiente; chaves assimétricas ativas no projeto `vitqnyzuvrvkmnvshcpb`; TTL do access token definido; confirmação de email ligada em produção ([[decisoes/PENDENCIAS#Condições operacionais do ADR-003|condições operacionais do ADR-003]]). Até lá, o backend em operação rejeita todos os tokens (falha fechada).
- **AUTH-003:** a herança acima, mais a DEC-07 e o B8. **AUTH-002:** a DEC-06.
- **Revisão da FOUNDATION-002:** a base de comparação muda (ARQ-AUTH-02).

Relacionados: [[tecnico/BACKEND]], [[tecnico/API]], [[seguranca/AUTENTICACAO]], [[decisoes/ADR-003-AUTENTICACAO]], [[MOCs/MOC-GOVERNANCA]], [[MOCs/MOC-ARQUITETURA]], [[MOCs/MOC-SEGURANCA]].

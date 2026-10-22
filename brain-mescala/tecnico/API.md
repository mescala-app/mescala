---
tipo: tecnico
camada: api
status: a-definir
atualizado: 2026-10-22
relacionado:
  - "[[decisoes/ADR-003-AUTENTICACAO]]"
  - "[[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]"
  - "[[features/AUTH-001]]"
---
# API
Contratos e endpoints definitivos: **A DEFINIR**.

Exceção técnica controlada: `GET /api/health` ([[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]). Ela não define envelope, padrão de erros, autenticação, autorização, validação, versionamento nem convenções das APIs de negócio, e não autoriza outras rotas.

Toda operação deve respeitar [[seguranca/AUTORIZACAO]] e [[seguranca/ISOLAMENTO-DE-DADOS]].

## Estado em 2026-10-20
- A rota de saúde existe desde a [[features/FOUNDATION-001]] (APPROVED em 2026-10-19, commit `7f26d30`): `GET /api/health` → 200 `{"status":"ok"}`. É a única rota do `/backend` ([[tecnico/BACKEND]]).
- HEAD 200 e OPTIONS 204 são automáticos do Next.js; POST, PUT, PATCH e DELETE recebem 405. É o comportamento padrão do framework e não constitui padrão de erros.
- Fora a rota de saúde, não existe API própria: o frontend legado fala direto com o Supabase e com duas Edge Functions de convite ([[tecnico/LEGADO-ATUAL]]).

## Autenticação nas rotas (decidida)
- A autenticação foi decidida pelo [[decisoes/ADR-003-AUTENTICACAO|ADR-003]] em 2026-10-21: as rotas protegidas recebem somente `Authorization: Bearer <access_token>` (nunca token em query, body ou cookie) e chamam a verificação de `domains/auth` explicitamente, sem middleware.
- A [[features/AUTH-001]] implementou a verificação sem criar rota nova: **encerrada em 2026-10-22** (commit `50eaa1f`). Os Route Handlers vão chamar `requireAuthenticatedIdentity(request)`, de `@/domains/auth`; ainda não há rota protegida (a primeira vem com a AUTH-003). Desde a AUTH-001, o B1 e o B2 da rota de saúde são testados no nível do módulo (H1 e H2); o 405 real, com servidor rodando, fica para a AUTH-003.
- **Nota para a DEC-07** ([[decisoes/PENDENCIAS#ARQ-AUTH-01 — Leitura literal das validações de claims|ARQ-AUTH-01]], a): o mapeamento HTTP mantém separados os 4 códigos de "não autenticado" (`AUTH_MISSING_CREDENTIAL`, `AUTH_MALFORMED_CREDENTIAL`, `AUTH_INVALID_TOKEN`, `AUTH_TOKEN_EXPIRED`) e o `AUTH_VERIFICATION_UNAVAILABLE`. `AUTH_TOKEN_EXPIRED` significa só "não autenticado, token vencido": não atesta os demais claims e não pode ser tratado como prova de conta legítima.
- Cada requisição de igreja precisa de "igreja atual" no contexto, porque um usuário pode estar em várias igrejas ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-006 — Usuário em mais de uma igreja|DATA-DEC-006]]). Como a igreja atual chega à API: **A DEFINIR** (o documento da AUTH-001 propõe uma feature para isso, CHURCH-002, sem contrato).

## Pendências
- Padrão HTTP de erros e convenções de API: [[decisoes/PENDENCIAS#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]], proposta pela AUTH-001 e não decidida. Bloqueia a primeira rota protegida. Deve respeitar a nota da ARQ-AUTH-01 acima.
- Contratos e endpoints de negócio: **A DEFINIR**.

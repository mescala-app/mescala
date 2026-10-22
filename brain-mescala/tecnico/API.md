---
tipo: tecnico
camada: api
status: a-definir
atualizado: 2026-10-22
relacionado:
  - "[[decisoes/ADR-003-AUTENTICACAO]]"
  - "[[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]"
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
- A [[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|AUTH-001]] implementa a verificação sem criar rota nova. Desde 2026-10-22 está sem bloqueios de decisão; passa a READY quando o Arquiteto atualizar o contrato com o Vitest.
- Cada requisição de igreja precisa de "igreja atual" no contexto, porque um usuário pode estar em várias igrejas ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-006 — Usuário em mais de uma igreja|DATA-DEC-006]]). Como a igreja atual chega à API: **A DEFINIR** (o documento da AUTH-001 propõe uma feature para isso, CHURCH-002, sem contrato).

## Pendências
- Padrão HTTP de erros e convenções de API: [[decisoes/PENDENCIAS#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]], proposta pela AUTH-001 e não decidida. Bloqueia a primeira rota protegida.
- Contratos e endpoints de negócio: **A DEFINIR**.

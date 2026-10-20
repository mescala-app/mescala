---
tipo: tecnico
camada: api
status: a-definir
---
# API
Contratos e endpoints definitivos: **A DEFINIR**.

Exceção técnica controlada: `GET /api/health` ([[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]). Ela não define envelope, padrão de erros, autenticação, autorização, validação, versionamento nem convenções das APIs de negócio, e não autoriza outras rotas.

Toda operação deve respeitar [[seguranca/AUTORIZACAO]] e [[seguranca/ISOLAMENTO-DE-DADOS]].

## Estado em 2026-10-20
- A rota de saúde existe desde a [[features/FOUNDATION-001]] (APPROVED em 2026-10-19, commit `7f26d30`): `GET /api/health` → 200 `{"status":"ok"}`. É a única rota do `/backend` ([[tecnico/BACKEND]]).
- HEAD 200 e OPTIONS 204 são automáticos do Next.js; POST, PUT, PATCH e DELETE recebem 405. É o comportamento padrão do framework e não constitui padrão de erros.
- Fora a rota de saúde, não existe API própria: o frontend legado fala direto com o Supabase e com duas Edge Functions de convite ([[tecnico/LEGADO-ATUAL]]).

## Pendências
- Rotas protegidas dependem da autenticação ([[decisoes/PENDENCIAS#DEC-03 — Autenticação|DEC-03]]). Há um contrato aguardando aprovação do PO que propõe resolvê-la ([[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|AUTH-001]]).
- Padrão HTTP de erros e convenções de API: [[decisoes/PENDENCIAS#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]], proposta pela AUTH-001 e não decidida.

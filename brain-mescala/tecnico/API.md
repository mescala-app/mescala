---
tipo: tecnico
camada: api
status: a-definir
---
# API
Contratos e endpoints definitivos: **A DEFINIR**.

Exceção técnica controlada: `GET /api/health` ([[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]). Ela não define envelope, padrão de erros, autenticação, autorização, validação, versionamento nem convenções das APIs de negócio, e não autoriza outras rotas.

Toda operação deve respeitar [[seguranca/AUTORIZACAO]] e [[seguranca/ISOLAMENTO-DE-DADOS]].

A rota de saúde será criada pela [[features/FOUNDATION-001]] (READY, não implementada). Rotas protegidas dependem da autenticação ([[decisoes/PENDENCIAS#DEC-03 — Autenticação|DEC-03]]).

Hoje não existe API própria: o frontend legado fala direto com o Supabase e com duas Edge Functions de convite ([[tecnico/LEGADO-ATUAL]]).

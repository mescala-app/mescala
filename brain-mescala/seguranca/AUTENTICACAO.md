---
tipo: seguranca
status: inicial
---
# Autenticação
Define como usuários provam sua identidade.

Provider e mecanismo definitivo: **A DEFINIR**.

Autenticação não substitui [[seguranca/AUTORIZACAO|Autorização]].

## Pendências
- Decisão de autenticação do backend oficial: [[decisoes/PENDENCIAS#DEC-03 — Autenticação|DEC-03]]. Bloqueia o contexto de igreja e qualquer rota protegida.
- Ligação entre usuário e provedor: [[decisoes/PENDENCIAS#DATA-DEC-019 — Identidade × provedor de autenticação|DATA-DEC-019]].
- Convites como forma de entrada: [[decisoes/PENDENCIAS#DATA-DEC-011 — Convites|DATA-DEC-011]].

## Legado
O app legado usa Supabase Auth com email e senha ([[tecnico/LEGADO-ATUAL]]). Isso não decide a autenticação oficial. Riscos S2 e S3 em [[seguranca/RISCOS-DO-LEGADO]].

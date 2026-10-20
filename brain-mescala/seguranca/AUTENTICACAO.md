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
- Contrato [[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|AUTH-001]] emitido em 2026-10-06, **aguardando aprovação do PO**. Ele propõe um ADR-003: Supabase Auth do projeto oficial como provedor, com validação local do access token pelo JWKS público. **É proposta, não decisão:** o provider continua **A DEFINIR**.
- Projeto Supabase oficial: [[decisoes/PENDENCIAS#DEC-05 — Projeto Supabase oficial|DEC-05]] (proposta da AUTH-001).
- Provisionamento do usuário do Mescala: [[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]] (proposta da AUTH-001).
- Ligação entre usuário e provedor: [[decisoes/PENDENCIAS#DATA-DEC-019 — Identidade × provedor de autenticação|DATA-DEC-019]].
- Convites como forma de entrada: [[decisoes/PENDENCIAS#DATA-DEC-011 — Convites|DATA-DEC-011]].

## Legado
O app legado usa Supabase Auth com email e senha ([[tecnico/LEGADO-ATUAL]]). Isso não decide a autenticação oficial. Riscos S2 e S3 em [[seguranca/RISCOS-DO-LEGADO]].

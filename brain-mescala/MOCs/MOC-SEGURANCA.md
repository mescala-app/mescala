---
tipo: moc
area: seguranca
---
# MOC — Segurança
- [[seguranca/AUTENTICACAO]]
- [[seguranca/AUTORIZACAO]]
- [[seguranca/ISOLAMENTO-DE-DADOS]]
- [[seguranca/AUDITORIA]]
- [[04-USUARIOS-E-PERMISSOES]]
- [[05-REGRAS-DE-NEGOCIO]]

## Estado atual e pendências
- [[seguranca/RISCOS-DO-LEGADO]]: S1–S11 (leitura estática, não testados contra o banco).
- [[decisoes/PENDENCIAS#DATA-DEC-023 — Correção urgente de segurança no legado|DATA-DEC-023]]: correção do legado.
- [[decisoes/PENDENCIAS#DEC-03 — Autenticação|DEC-03]]: autenticação.
- [[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|AUTH-001]]: contrato de autenticação aguardando aprovação do PO. Propõe um ADR-003 para resolver a DEC-03 (proposta, não aceita).
- [[decisoes/PENDENCIAS#DEC-05 — Projeto Supabase oficial|DEC-05]]: projeto Supabase oficial (proposta da AUTH-001).
- [[decisoes/PENDENCIAS#Cache do Supabase CLI no git|Cache do Supabase CLI no git]]: observação de baixo risco para o PO.
- [[decisoes/PENDENCIAS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]]: schema e modelo de RLS.
- [[decisoes/PENDENCIAS#DATA-DEC-021 — Auditoria|DATA-DEC-021]]: mecanismo de auditoria.
- [[tecnico/LEGADO-ATUAL]]

---
tipo: moc
area: seguranca
atualizado: 2026-10-22
---
# MOC — Segurança
- [[seguranca/AUTENTICACAO]]
- [[seguranca/AUTORIZACAO]]
- [[seguranca/ISOLAMENTO-DE-DADOS]]
- [[seguranca/AUDITORIA]]
- [[04-USUARIOS-E-PERMISSOES]]
- [[05-REGRAS-DE-NEGOCIO]]

## Decisões
- [[decisoes/ADR-003-AUTENTICACAO]]: Supabase Auth do projeto oficial; backend valida o access token pelo JWKS público; papéis e igreja nunca vêm do token.
- [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]: projeto oficial `vitqnyzuvrvkmnvshcpb`.
- [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]]: schema dedicado fora da Data API, papel sem BYPASSRLS, contexto por transação.
- [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 — Auditoria|DATA-DEC-021]]: auditoria só de inserção, gravada pelo backend.
- [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]]: papéis por camada; ANCIÃO é cargo, sem efeito de autorização.

## Estado atual e pendências
- [[seguranca/RISCOS-DO-LEGADO]]: S1–S11 (leitura estática). A correção do legado ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-023 — Correção urgente de segurança no legado|DATA-DEC-023]]) não se aplica, porque o app legado não tem uso real; os riscos continuam nos projetos antigos enquanto estiverem ativos.
- [[decisoes/PENDENCIAS#Condições operacionais do ADR-003|Condições operacionais do ADR-003]]: chaves assimétricas e confirmação de email, com o PO.
- [[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|AUTH-001]]: sem bloqueios de decisão.
- [[decisoes/PENDENCIAS#Pausar ou excluir os projetos antigos — DATA-DEC-022|Pausar ou excluir os projetos antigos]]: decisão operacional do PO, data A DEFINIR.
- [[decisoes/PENDENCIAS#Cache do Supabase CLI no git|Cache do Supabase CLI no git]]: resolvido no repositório (commit `a034046`).
- Regras de autorização em aberto: [[decisoes/PENDENCIAS#Outras pendências registradas|PENDENCIAS]].
- [[tecnico/LEGADO-ATUAL]]

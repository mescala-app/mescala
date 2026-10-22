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
- [[features/AUTH-001]]: implementada e encerrada em 2026-10-22 (commit `50eaa1f`); verificação do access token sem rota protegida. Riscos aceitos: [[decisoes/PENDENCIAS#RT-AUTH-01 — Cache de segmento do Next sobre a busca do JWKS|RT-AUTH-01]]; interpretação [[decisoes/PENDENCIAS#ARQ-AUTH-01 — Leitura literal das validações de claims|ARQ-AUTH-01]]; herança para a AUTH-003 em [[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|PENDENCIAS]].
- [[features/FOUNDATION-002]]: isolamento por igreja no banco (schema `mescala`, papel `mescala_app`, RLS por contexto, FKs compostas, unicidade com `church_id`) e `audit_log` imutável, decididos no contrato VERSÃO 2 e **ainda não aplicados** ([[seguranca/ISOLAMENTO-DE-DADOS]], [[seguranca/AUDITORIA]]).
- [[decisoes/PENDENCIAS#Pausar ou excluir os projetos antigos — DATA-DEC-022|Pausar ou excluir os projetos antigos]]: decisão operacional do PO, data A DEFINIR.
- [[decisoes/PENDENCIAS#Cache do Supabase CLI no git|Cache do Supabase CLI no git]]: resolvido no repositório (commit `a034046`).
- Regras de autorização em aberto: [[decisoes/PENDENCIAS#Outras pendências registradas|PENDENCIAS]].
- [[tecnico/LEGADO-ATUAL]]

---
tipo: tecnico
camada: dados
status: ativo
atualizado: 2026-10-22
relacionado:
  - "[[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]]"
  - "[[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]"
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
---
# Banco de Dados
O modelo físico deve derivar do domínio, não o contrário.

Banco oficial: PostgreSQL, podendo usar o Supabase como infraestrutura gerenciada. O schema oficial deve ser reproduzível pelas migrations versionadas ([[decisoes/ADR-002-BACKEND-OFICIAL]]).

Referências obrigatórias:
- [[dados/ENTIDADES]]
- [[dados/RELACIONAMENTOS]]
- [[04-USUARIOS-E-PERMISSOES]]
- [[seguranca/ISOLAMENTO-DE-DADOS]]

Evitar colunas fixas como `vocalista_id` ou `baterista_id`; posições pertencem à entidade [[dados/ENTIDADES#Alocação|Alocação]].

## Decisões
- **Projeto:** o banco oficial fica no projeto Supabase novo `vitqnyzuvrvkmnvshcpb` e **começa vazio** ([[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]; app legado sem uso real, sem migração de dados: [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-022 — Convivência com o legado e migração de dados|DATA-DEC-022]], 2026-10-22).
- **Migrations:** em `backend/supabase/migrations/`, pelo Supabase CLI, com `backend/supabase/config.toml` ligado ao projeto oficial. As 9 migrations legadas da `supabase/` da raiz nunca são aplicadas no banco novo. Aplicação manual pelo PO (SQL Editor ou CLI). Integração GitHub ↔ Supabase não conectada por enquanto ([[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04, parte 1]]).
- **Nomes:** identificadores em inglês, tabelas no plural em snake_case, status e papéis em `text` + CHECK com os valores da Brain em MAIÚSCULAS, migrations `<YYYYMMDDHHMMSS>_<objetivo>.sql`, uma por objetivo ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-018 — Nomenclatura e idioma|DATA-DEC-018]]).
- **Schema e RLS:** schema dedicado, fora da Data API; o backend conecta direto ao Postgres com um papel sem BYPASSRLS e define o contexto (usuário, igreja) em cada transação; as policies usam esse contexto. Toda tabela nasce com RLS habilitado ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]]).
- **Usuários:** tabela própria `users`, com uma coluna de ligação ao `auth.users` do projeto oficial ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-019 — Identidade × provedor de autenticação|DATA-DEC-019]]).
- **Histórico:** nada com histórico é apagado; status e data de término em vez de exclusão ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]]).
- **Auditoria:** tabela só de inserção, gravada pelo backend na mesma transação ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 — Auditoria|DATA-DEC-021]]).
- **Status e transições:** o banco guarda os valores; o backend valida as transições ([[dados/STATUS]]).

## Estado atual
- **Oficial:** nenhuma migration oficial foi criada. Em 2026-10-21, `backend/supabase/` ainda não existe. A Fase 4 depende do contrato **FOUNDATION-002 — Fundação de Persistência** (não emitido) e de autorização explícita do PO ([[features/FLUXO-DE-ENTREGA]]).
- **Legado:** 11 tabelas em `public` e 9 migrations em `supabase/migrations/`, nos projetos antigos ([[tecnico/LEGADO-ATUAL]]). O app legado não tem uso real; a consulta de inventário foi dispensada (2026-10-22).
- Divergências com a Brain: [[tecnico/DIVERGENCIAS-LEGADO]]. Riscos de RLS do legado: [[seguranca/RISCOS-DO-LEGADO]].

## Ordem proposta das migrations
Seção 15 do relatório `docs/data/DATA-ARCHITECTURE-REPORT.md`. É **proposta** do Analista de Dados; a ordem vinculante virá do contrato FOUNDATION-002. Cada migration tem objetivo único e nasce com RLS habilitado.

| Ordem | Migration | Observação |
|---|---|---|
| 0 | `security_hotfix_legacy_rls` | Trilha separada, sobre o legado. **Não se aplica**: app legado sem uso real (2026-10-22) |
| 1 | `create_official_schema` | Schema, papel de acesso e função de `updated_at` (DATA-DEC-020 A) |
| 2 | `create_users` | — |
| 3 | `create_churches` | — |
| 4 | `create_church_memberships` | — |
| 5 | `create_ministries` | — |
| 6 | `create_ministry_memberships` | — |
| 7 | `create_ministry_functions` | Funções + habilitações |
| 8 | `create_programs` | Programações + participação |
| 9 | `create_schedules` | — |
| 10 | `create_allocations` | — |
| 11 | `create_availability` | — |
| 12 | `create_invitations` | — |
| 13 | `create_audit_log` | — |
| 14 | `rls_policies_official_schema` | Conforme DATA-DEC-020 |
| 15+ | `migrate_legacy_<entidade>` | **Sem objeto**: não há migração de dados do legado (2026-10-22) |
| Futuro | Depreciação do legado | Com autorização própria |

## Pendências
- Ferramenta de acesso do backend ao banco (driver, query builder ou ORM): [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]].
- Nome do schema dedicado; status da Igreja; status "ativa" da alocação; transições do convite: **A DEFINIR** ([[decisoes/PENDENCIAS#Lacunas observadas no registro de 2026-10-21|PENDENCIAS]]).
- Contrato FOUNDATION-002 e autorização da Fase 4.
- Data para pausar ou excluir os projetos antigos (decisão operacional do PO): **A DEFINIR**.

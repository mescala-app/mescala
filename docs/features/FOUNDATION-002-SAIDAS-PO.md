# FOUNDATION-002 — Saídas do PO na aplicação (evidência)

> Evidência da aplicação da FOUNDATION-002 no projeto oficial (ARQ-F002-19). Montado pelo orquestrador a partir das saídas devolvidas pelo PO; nenhum agente acessou o banco. Contrato: `docs/features/FOUNDATION-002.md` (VERSÃO 2, fechamento 2026-10-23).

## 1. Contexto da aplicação

| Campo | Valor |
|---|---|
| Projeto | `vitqnyzuvrvkmnvshcpb` |
| V0 | 2026-10-22 |
| Aplicação e verificação | 2026-10-23 |
| Quem aplicou | PO |
| Método | SQL Editor, um arquivo por vez, inteiro, na ordem (alternativa do A5; ARQ-F002-17). A3 e A4 (CLI) não executados; `backend/supabase/.temp` não existe. Confirmado pelo PO. |
| Papel | `postgres` (V1.1) |
| Commit aplicado | `028f9ff` |
| Arquivos, na ordem | os 9 arquivos de `backend/supabase/migrations/` listados abaixo |
| Resultado declarado pelo PO | "todas as migrations subiram limpas" |
| `supabase_migrations.schema_migrations` | não existe (V1.2) |

Arquivos aplicados, na ordem:
1. `20261022150000_create_official_schema.sql`
2. `20261022150100_create_users.sql`
3. `20261022150200_create_churches.sql`
4. `20261022150300_create_church_memberships.sql`
5. `20261022150400_create_ministries.sql`
6. `20261022150500_create_ministry_memberships.sql`
7. `20261022150600_create_ministry_functions.sql`
8. `20261022150700_create_audit_log.sql`
9. `20261022150800_grant_app_role_and_rls_policies.sql`

## 2. V0 (A2b), 2026-10-22

- V0.1, V0.2, V0.3: DECLARADOS pelo PO (resultado esperado), sem saída colada. Sustentação: V1.2, V1.17 (1/3) e a aplicação sem erro de `create schema mescala` (sem IF NOT EXISTS). Como registrado na sessão:
  - V0.1 (schema `mescala`; papel `mescala_app`): resultado esperado (0 linhas), confirmado pelo PO sem colar a saída.
  - V0.2 (`supabase_migrations.schema_migrations`): resultado esperado (erro "does not exist" ou 0 linhas), confirmado pelo PO sem colar a saída.
  - V0.3 (pg_class em public): resultado esperado (0 linhas), confirmado pelo PO sem colar a saída.
- Literais:
  - V0.3b (funções de public): 1 linha — `rls_auto_enable` (provavelmente da plataforma: RLS automático em tabelas novas). Linha de base para o V1.17.
  - V0.3c (tipos de public): "Success. No rows returned".
  - V0.4a: versao_num 170011; codificacao UTF8; provedor i (ICU); datcollate en_US.UTF-8; datctype en_US.UTF-8; locale_icu_ou_builtin en-US.
  - V0.4b: qtd_letras 13; resultado áàâãéêíóôõúüç; minusculas_ok true; recepcao_ok true. → sem contingência de collation.
  - V0.4c: pg_c_utf8 (provider b, encoding 6); und-x-icu (provider i, encoding -1).
- V0.4d: não rodado (não necessário).
- `supabase/.temp/project-ref` da raiz: não anotado pelo PO (A4 não se aplicou); o QA registrou SHA-1 `cdeddcc9…` e mtime 2026-07-08, sem mudança nas fases 1b e 2.

## 3. A6 / V1.18 — Data API, 2026-10-23

- PO confirmou: "Exposed schemas" contém só `public` e `graphql_public`. `mescala` NÃO está exposto. Nada foi alterado no painel.

## 4. V1 completo (consulta 1), 2026-10-23

- Consulta: `docs/features/FOUNDATION-002-V1-CONSULTA-UNICA.sql` (SHA-256, LF: `14f116f0e57f102d920cad25445ead89a58f6d5d189275dfcc27512344928b38`).
- Resultado: `docs/features/FOUNDATION-002-V1-RESULTADO.csv`: cópia byte a byte do CSV exportado pelo PO; cabeçalho + 36 linhas.
  - SHA-256 `fe55456fc40deca184fc97cf4caaddeea2c34920df3b9a0fdfdc55aabe495043` (CRLF, como exportado);
  - SHA-256 `920ca1325478a1c70755e4b74e15bcb41af386863add8d6a76e03c9d327df45b` (LF, como no git).
- Ordem de execução: 1ª execução antes do V2, colagem truncada (só V1.1 a V1.4b, literais abaixo); execução completa (o CSV) depois do V2 e do bloco B. V1.1 a V1.4b idênticos nas duas.
- Literais da 1ª execução:
  - V1.1: PostgreSQL 17.11 (170011); current_user postgres; session_user postgres.
  - V1.2: "tabela inexistente: aplicação pelo SQL Editor" (linhas null).
  - V1.3: 1 linha; dono postgres; nspacl ["postgres=UC/postgres","mescala_app=U/postgres"]; nspname mescala.
  - V1.4: 8 linhas, relkind r, dono postgres: audit_log, church_memberships, churches, ministries, ministry_functions, ministry_member_functions, ministry_memberships, users.
  - V1.4b: 0 linhas.

## 5. V2 integrado, 2026-10-23 — mensagem literal

```text
Failed to run sql query: ERROR:  P0001: V2 - ERRO PROPOSITAL, TUDO FOI DESFEITO. PASS=133 FAIL=0 NOT_TESTED=0 || FALHAS: nenhuma || NAO TESTADOS: nenhum || PASS: N1, N2, N3a, N3b, N4a, N4b, N4c, N5, N6, N7a, N7b, N7c, N8a, N8b, N9a, N9b, N9c, N9d, N9e, N9f, N9g, N9h, N9i, N10a, N10b, N10c, N10d, N10e, N11a, N11b, N12a, N12b, N12c, N13, X1, X2, X3, X4, X5, X6, R1a, R1b, R1c, R1d, R2a, R2b, R2c, R3a, R3b, R3c, R3d, R3e, R4a, R4b, R4c, R4d, R4e, R4f, R4g, R4h, R6a, R6b, R6c, R7a, R7b, R7c, R7d, R7e, R8a, R8b, R8c, R9a, R9b, R9c, R10a-anon, R10b-anon, R10a-authenticated, R10b-authenticated, R10a-service_role, R10b-service_role, QP1, QP2, QP3, QP4, QP5, QP6, QP7, QP8, QP9, QM1, QM2, QM3, QM4, QM5, QM6, QM7, QC1, QC2, QC3, QC4, QD1, QD2, QD3, QD4, QD5, QD6, QD7, QA1, QA2, QT1a, QT1b, QT2, QT3, QT4, QI2, QI3, QI4, R5-delete-users, R5-truncate-users, R5-delete-churches, R5-truncate-churches, R5-delete-church_memberships, R5-truncate-church_memberships, R5-delete-ministries, R5-truncate-ministries, R5-delete-ministry_memberships, R5-truncate-ministry_memberships, R5-delete-ministry_functions, R5-truncate-ministry_functions, R5-delete-ministry_member_functions, R5-truncate-ministry_member_functions, R5-delete-audit_log, R5-truncate-audit_log
CONTEXT:  PL/pgSQL function inline_code_block line 287 at RAISE
```

## 6. Bloco B, 2026-10-23 — mensagem literal

```text
Failed to run sql query: ERROR:  P0001: V2-QA-INFO - ERRO PROPOSITAL, TUDO FOI DESFEITO. I1 (session_replication_role): CONTORNADO: TRUNCATE aceito com session_replication_role = replica || I2 (DISABLE TRIGGER pelo dono): CONTORNADO: TRUNCATE aceito depois de DISABLE TRIGGER pelo dono
CONTEXT:  PL/pgSQL function inline_code_block line 32 at RAISE
```

## 7. Consulta 2 (resíduo, depois do V2 e do bloco B), 2026-10-23 — literal

- V1.20: 9 linhas, todas count 0 (users, churches, church_memberships, ministries, ministry_memberships, ministry_functions, ministry_member_functions, audit_log, auth.users sinteticos do V2).
- V1.13b: 0 linhas.
- V1.13c: 1 linha — membro postgres, concedente supabase_admin, admin_option true, inherit_option false, set_option false.
- V1.11: 8 linhas, todas tgenabled "O": audit_log_prevent_truncate (BEFORE TRUNCATE, FOR EACH STATEMENT, mescala.prevent_audit_log_change()); audit_log_prevent_update_delete (BEFORE DELETE OR UPDATE, FOR EACH ROW); church_memberships/churches/ministries/ministry_functions/ministry_memberships/users _set_updated_at (BEFORE UPDATE, FOR EACH ROW, mescala.set_updated_at()).

## 8. A10 — Security Advisor

Não entregue (opcional; dispensado na ARCHITECT REVIEW final).

## 9. Resumo da QA fase 2

- APPROVED, READY_FOR_ARCHITECT_REVIEW; V1: 154 checagens OK, 0 FAIL; V2: PASS=133, FAIL=0, NT=0; bloco B: I1 e I2 CONTORNADOS (R-16, informativo); bugs: nenhum.
- Observações e destino: 1 → ARQ-F002-17; 2 → R-20; 3 → R-16; 4 → ARQ-F002-18; 5 → ARQ-F002-19; 6 → critério 24 e nota da Brain; 7 → aceito (V0.1 a V0.3 declarados).
- NOT TESTED: NT-01 (FOUNDATION-003), NT-02 (vale A6 + V1.14), NT-03/04/05/07 (não exigidos); NT-06 resolvido.
- ARCHITECT REVIEW final: APPROVED_WITH_NOTES (2026-10-23); registro na nota `features/FOUNDATION-002` da Brain.

## 10. O que não entra neste arquivo

- Identificação da conta ou de projetos de outra organização em que a CLI desta máquina estava logada (a aplicação não usou a CLI).
- Nenhuma senha, chave, string de conexão ou token (nenhum foi devolvido).

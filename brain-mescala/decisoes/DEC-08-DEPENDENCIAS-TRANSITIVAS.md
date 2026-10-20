---
tipo: decisao
status: aceito
data: 2026-10-19
origem: ARQ-FOUND-02
feature: FOUNDATION-001
relacionado:
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[features/FOUNDATION-001]]"
  - "[[tecnico/BACKEND]]"
  - "[[decisoes/PENDENCIAS]]"
---
# DEC-08 — Dependências transitivas e listas de dependências proibidas

## Status

**ACEITO** em 2026-10-19.

- **Origem:** interpretação formal **ARQ-FOUND-02**, aceita pelo [[agents/arquiteto|Arquiteto]] na revisão da [[features/FOUNDATION-001]]. As ARCHITECT REVIEW dessa feature não foram gravadas em arquivo; o registro permanente está na nota da feature e nesta nota.
- **Numeração:** DEC-05, DEC-06 e DEC-07 estão reservadas pela análise da AUTH-001, que aguarda aprovação do PO ([[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|AUTH-001]]). Por isso esta decisão é a DEC-08.

---

## Contexto

A seção 14 do contrato da FOUNDATION-001 (`docs/features/FOUNDATION-001.md`, fora do vault) lista como **proibidas**: ORM, query builder ou driver de Postgres; `@supabase/*`; bibliotecas de validação (inclusive `zod`), autenticação, testes ou logging; Tailwind, PostCSS ou qualquer pacote de UI.

O `backend/package-lock.json` entregue contém pacotes dessa lista que o Mescala não declara nem usa: eles entram só como dependência de pacotes aprovados. Faltava dizer se isso viola o contrato.

---

## Decisão

A lista "Proibidas" da seção 14 da FOUNDATION-001 — e listas desse tipo nos próximos contratos, até decisão em contrário — aplica-se a:

- **(a)** dependências declaradas no `backend/package.json` (`dependencies`, `devDependencies`, `optionalDependencies`, `peerDependencies`) ou forçadas via `overrides`;
- **(b)** uso explícito pelo Mescala: `import`, `export … from`, `import()` ou `require()` em qualquer arquivo de `/backend` fora de `node_modules/` e `.next/`, arquivo de configuração da ferramenta (ex.: `postcss.config.*`, `tailwind.config.*`) ou script npm.

Pacote que aparece no lockfile só como transitivo, trazido exclusivamente por pacote aprovado, **não é violação**.

**Presença transitiva não é aprovação:** `zod` continua sem decisão como biblioteca de validação, e `postcss` continua proibido como ferramenta de UI.

---

## Transitivos no lockfile aprovado (commit `7f26d30`)

| Pacote | Tipo | Trazido por |
|---|---|---|
| `postcss@8.5.23` | produção | `next` |
| `zod@4.6.7` | desenvolvimento | `eslint-config-next` → `eslint-plugin-react-hooks@7.1.1` |
| `zod-validation-error@4.0.2` | desenvolvimento | `eslint-config-next` → `eslint-plugin-react-hooks@7.1.1` |

---

## Risco aceito: RT-FOUND-02

- Dependência fantasma (importar `zod` sem declarar) é violação de (a) e (b).
- O [[agents/qa|QA]] checa no cenário S5 de cada feature.
- Guarda automática não é exigida agora.

---

## Consequências

- Para o QA, o S5 de cada feature confere (a), (b) e dependência fantasma.
- A biblioteca de validação continua **A DEFINIR**, como diz o [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] ("Decisões ainda não definidas por este ADR"). Ter `zod` no lockfile não muda isso.
- `postcss` continua proibido como ferramenta de UI (contrato da FOUNDATION-001, seção 14; fase **BACKEND ONLY** do ADR-002).

## Fora desta decisão

- A dívida de tooling da cadeia de lint (advisory GHSA-vfj7-8cjw-p6xm, `braces`): [[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]].
- A escolha de ORM, query builder, validação, autenticação, testes, auditoria e eventos ([[decisoes/PENDENCIAS]]).

---

Relacionados: [[decisoes/ADR-002-BACKEND-OFICIAL]], [[features/FOUNDATION-001]], [[tecnico/BACKEND]], [[decisoes/PENDENCIAS]], [[agents/qa]], [[agents/desenvolvedor-backend]], [[MOCs/MOC-GOVERNANCA]].

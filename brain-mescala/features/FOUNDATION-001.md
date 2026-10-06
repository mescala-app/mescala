---
tipo: feature
id: FOUNDATION-001
dominio: foundation
status: ready
implementacao: nao-iniciada
contrato: docs/features/FOUNDATION-001.md
emitido: 2026-10-04
relacionado:
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]"
  - "[[features/FLUXO-DE-ENTREGA]]"
  - "[[decisoes/PENDENCIAS]]"
---
# FOUNDATION-001 — Inicialização do Backend Next.js

## Situação em 2026-10-06
- **Contrato:** STATUS **READY**, versão 1, emitido pelo [[agents/arquiteto|Arquiteto]] em 2026-10-04.
- **Implementação:** **não iniciada**. A pasta `/backend` ainda não existe no repositório.
- **Resultados do fluxo:** nenhum BACKEND IMPLEMENTATION RESULT, REPOSITORY ORGANIZATION RESULT, QA RESULT ou ARCHITECT REVIEW registrado.
- **Contrato completo (fora do vault):** `docs/features/FOUNDATION-001.md`. Ele contém o Feature Contract, o Backend Implementation Task, o Organization Task e o QA Contract. Data Task: não aplicável.

## Por que existe
O [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] determina que, antes de qualquer feature de negócio, seja criada a fundação técnica do backend oficial. É a primeira feature do [[features/FLUXO-DE-ENTREGA|fluxo de entrega]].

## Escopo, segundo o contrato
- Criar `/backend` como pacote npm independente: Next.js, TypeScript (`strict`) e runtime Node.js, App Router em `backend/src/app`.
- Scripts `dev`, `build`, `start`, `lint` e `typecheck`; sem script `test`.
- Guardas de ESLint do ADR-002: nada de `next` em `src/domains/**`; nenhum `runtime` diferente de `nodejs` em `src/app/**`.
- Única rota: `GET /api/health` → 200 `{"status":"ok"}`, conforme [[decisoes/DEC-01-ROTA-TECNICA-HEALTH|DEC-01]].
- Fora de `/backend`, só muda o `eslint.config.js` da raiz (incluir `backend` nos ignores).

## Fora do escopo
Qualquer regra de negócio, entidade ou tenant; banco, ORM, migrations e fundação de persistência; autenticação e contexto de igreja; validação, envelope de resposta e padrão de erros ([[tecnico/API]] continua A DEFINIR); testes e biblioteca de testes; UI e migração do frontend legado; Edge Functions existentes; deploy e CI.

Por isso a feature não toca em [[05-REGRAS-DE-NEGOCIO]], e o [[05-REGRAS-DE-NEGOCIO#SEC-001 — Isolamento por igreja|SEC-001]] fica preservado por construção: nenhum dado é lido nem gravado.

## Dependências entre features
- **DEPENDS_ON:** [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] (aceito); [[decisoes/DEC-01-ROTA-TECNICA-HEALTH|DEC-01]] (aceita).
- **BLOCKS:** a fundação oficial de persistência (sem contrato, ID a definir) e todas as features de negócio.
- **RELATED_TO:** DEC-02, DEC-03 e DEC-04, todas pendentes ([[decisoes/PENDENCIAS]]).

## Decisões pendentes citadas pelo contrato
Não bloqueiam a FOUNDATION-001:
- [[decisoes/PENDENCIAS#DEC-02 — Biblioteca oficial de testes e quem escreve os testes|DEC-02]]: biblioteca de testes e quem escreve testes.
- [[decisoes/PENDENCIAS#DEC-03 — Autenticação|DEC-03]]: autenticação.
- [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04]]: estratégia de migrations e forma de acesso ao banco.

## QA previsto
- Validação estática S1–S12 e por ferramentas T1–T4 (typecheck, lint, build, regressão do lint da raiz).
- B1 (`GET` → 200) e B2 (`POST` → 405): até a DEC-02, o [[agents/qa|QA]] está autorizado a um teste manual local, que vale como evidência, não como regressão.
- B3 (guardas do ESLint disparam): exige arquivo de teste. Até a DEC-02, fica NOT TESTED e é validado só pela configuração (S7).
- Sem cenários de banco.

## Divergências registradas pelo contrato
O contrato registra três ARCHITECTURAL DIVERGENCE entre o código existente e a Brain. Nenhuma bloqueia esta feature. Detalhes em [[tecnico/DIVERGENCIAS-LEGADO]]:
- **D1:** regra crítica no backend × páginas Vite gravando direto em 8 tabelas, protegidas só por RLS.
- **D2:** papéis OWNER/ADMIN/LEADER/MEMBER × enum legado `app_role` (organizador/lider/membro).
- **D3:** Igreja como tenant com `church_id` × tabela `igrejas` com colunas em português.

Relacionados: [[tecnico/BACKEND]], [[tecnico/LEGADO-ATUAL]], [[MOCs/MOC-GOVERNANCA]], [[MOCs/MOC-ARQUITETURA]].

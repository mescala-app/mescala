---
tipo: feature
id: FOUNDATION-001
dominio: foundation
status: encerrada
implementacao: implementada
revisao-arquiteto: approved
aprovada: 2026-10-19
commit: "7f26d30"
contrato: docs/features/FOUNDATION-001.md
emitido: 2026-10-04
relacionado:
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]"
  - "[[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]]"
  - "[[features/FLUXO-DE-ENTREGA]]"
  - "[[decisoes/PENDENCIAS]]"
  - "[[tecnico/BACKEND]]"
---
# FOUNDATION-001 — Inicialização do Backend Next.js

## Situação em 2026-10-20
- **Status:** **IMPLEMENTADA e ENCERRADA**. ARCHITECT REVIEW **APPROVED** em 2026-10-19, na rodada de correção 1.
- **Commit:** `7f26d30` ("FOUNDATION-001: inicializa o backend Next.js em /backend"), com exatamente 8 arquivos: `backend/.gitignore`, `backend/eslint.config.mjs`, `backend/next.config.ts`, `backend/package-lock.json`, `backend/package.json`, `backend/src/app/api/health/route.ts`, `backend/tsconfig.json` e o `eslint.config.js` da raiz (só `"backend"` acrescentado aos ignores). Conferido: os blobs commitados batem com os SHA-256 aprovados.
- **Contrato (fora do vault):** `docs/features/FOUNDATION-001.md`, STATUS READY, versão 1, emitido pelo [[agents/arquiteto|Arquiteto]] em 2026-10-04. Contém o Feature Contract, o Backend Implementation Task, o Organization Task e o QA Contract. Data Task: não aplicável.
- **Registro das revisões:** as duas ARCHITECT REVIEW (rodadas 0 e 1) não foram gravadas em arquivo. **Esta nota é o registro permanente delas**, junto com a entrada de 2026-10-20 do [[CHANGELOG]].

## Por que existe
O [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] determina que, antes de qualquer feature de negócio, seja criada a fundação técnica do backend oficial. Foi a primeira feature do [[features/FLUXO-DE-ENTREGA|fluxo de entrega]].

## Escopo, segundo o contrato
- Criar `/backend` como pacote npm independente: Next.js, TypeScript (`strict`) e runtime Node.js, App Router em `backend/src/app`.
- Scripts `dev`, `build`, `start`, `lint` e `typecheck`; sem script `test`.
- Guardas de ESLint do ADR-002: nada de `next` em `src/domains/**`; nenhum `runtime` diferente de `nodejs` em `src/app/**`.
- Única rota: `GET /api/health` → 200 `{"status":"ok"}`, conforme [[decisoes/DEC-01-ROTA-TECNICA-HEALTH|DEC-01]].
- Fora de `/backend`, só muda o `eslint.config.js` da raiz (incluir `backend` nos ignores).

## Fora do escopo
Qualquer regra de negócio, entidade ou tenant; banco, ORM, migrations e fundação de persistência; autenticação e contexto de igreja; validação, envelope de resposta e padrão de erros ([[tecnico/API]] continua A DEFINIR); testes e biblioteca de testes; UI e migração do frontend legado; Edge Functions existentes; deploy e CI.

Por isso a feature não toca em [[05-REGRAS-DE-NEGOCIO]], e o [[05-REGRAS-DE-NEGOCIO#SEC-001 — Isolamento por igreja|SEC-001]] fica preservado por construção: nenhum dado é lido nem gravado.

## O que foi entregue
- **Versões exatas:** Next.js 16.4.2; React 19.3.1 e React DOM 19.3.1 (só por exigência do Next; nenhum código React); TypeScript 6.0.3; `@types/node` 26.6.5; `@types/react` 19.3.0; ESLint 9.39.5; `eslint-config-next` 16.4.2.
- **Estrutura:** App Router em `backend/src/app`. Não existem `domains/`, `infrastructure/` nem `shared/`: nenhuma pasta vazia foi criada.
- **Única rota:** `GET /api/health` → 200 `{"status":"ok"}` ([[decisoes/DEC-01-ROTA-TECNICA-HEALTH|DEC-01]]). HEAD 200 e OPTIONS 204 são automáticos do Next; POST, PUT, PATCH e DELETE → 405. Runtime Node.js.
- **Sem** UI, banco, autenticação ou domínio de negócio.
- **Guardas de lint do ADR-002** (`backend/eslint.config.mjs`):
  1. `src/domains/**` (arquivos `.ts`, `.tsx`, `.mts`, `.cts`, `.js`, `.mjs` e `.cjs`) não importa `next` nem `next/*`: import estático, `import type`, `import()` dinâmico e `import()` de tipo com especificador estático.
  2. `src/app/**` não exporta `runtime` diferente de `'nodejs'` e não reexporta `runtime`.

## Histórico do fluxo
Primeira execução completa do [[features/FLUXO-DE-ENTREGA]]. Sem a etapa do [[agents/analista-de-dados|Analista de Dados]], porque a feature não tem banco.

| # | Etapa | Resultado |
|---|---|---|
| 1 | [[agents/arquiteto\|Arquiteto]]: contrato | READY (2026-10-04) |
| 2 | [[agents/desenvolvedor-backend\|Desenvolvedor]] | IMPLEMENTED |
| 3 | [[agents/organizador\|Organizador]] | ORGANIZED (só completou um comentário) |
| 4 | [[agents/qa\|QA]] | APPROVED, com BUG-01 (LOW) |
| 5 | Arquiteto, rodada 0 | **CHANGES_REQUIRED** (C1 e C2) |
| 6 | PO | decidiu incluir o L-03 na correção |
| 7 | Desenvolvedor | aplicou C1, L-03 e C2 (só 2 arquivos) |
| 8 | QA, revalidação R1–R6 | APPROVED |
| 9 | Arquiteto, rodada 1 | **APPROVED** (2026-10-19) |

Na rodada de correção não houve etapa do Organizador: nada foi criado nem movido.

### Rodada 0: CHANGES_REQUIRED
- **C1:** a guarda do domínio não pegava `import()` dinâmico nem em posição de tipo. Critério 8 atendido só em parte.
- **C2:** o comentário do `route.ts` dizia que todo método diferente de GET recebe 405 (critério 16). O comportamento registrado na entrega é outro: HEAD 200 e OPTIONS 204, automáticos do Next.

### Rodada 1: APPROVED (2026-10-19)
- Correções aplicadas: C1, L-03 (por decisão do PO) e C2.
- Revalidação do QA (R1–R6): APPROVED.
- Nas revisões, o Arquiteto aceitou os desvios D-01 a D-03, a interpretação ARQ-FOUND-02, os riscos RT-FOUND-01 a 03 e os limites L-01, L-02, L-04, L-05 e L-06, e registrou a observação O-01 (seções abaixo).

## Validação realizada (QA)
- **Resultado:** QA APPROVED (com BUG-01, LOW); depois da correção, revalidação R1–R6 APPROVED.
- **Ferramentas:** typecheck, lint e build passam.
- **B1 e B2:** teste HTTP manual local feito pelo QA, autorizado pelo contrato até a DEC-02. Vale como evidência, não como regressão.
- **Dependências de produção:** `npm audit --omit=dev` = 0.
- **B1–B3 como regressão automatizada:** continuam **NOT TESTED** até a [[decisoes/PENDENCIAS#DEC-02 — Biblioteca oficial de testes e quem escreve os testes|DEC-02]]. Quando ela for decidida, a [[#Verificação mínima de regressão do lint|verificação mínima de regressão do lint]] vira o teste automatizado B3.
- Sem cenários de banco.

## Decisões e desvios aceitos pelo Arquiteto
- **D-01 — `next.config.ts`:** aceito. Fixa `turbopack.root` e `outputFileTracingRoot` no `/backend`. Sem ele, o Next adotava a raiz do repositório, por causa do `package-lock.json` do frontend. **Condição:** o arquivo fica restrito ao isolamento da raiz; qualquer outra opção exige contrato.
- **D-02 — ESLint 9.39.5 e TypeScript 6.0.3:** aceito. ESLint 10 e TypeScript 7 são incompatíveis com `eslint-config-next` 16.4.2. O `"types": ["node"]` do `tsconfig` é consequência do TypeScript 6. Subir de versão é tarefa de manutenção própria.
- **D-03 — regra contra reexportar `runtime`:** aceito. O Next 16.4.2 ignora configuração de segmento reexportada; bloquear a reexportação mantém verificável o [[decisoes/ADR-002-BACKEND-OFICIAL#Runtime|ADR-002#Runtime]].
- **ARQ-FOUND-02 — dependências transitivas:** interpretação formal das listas de dependências proibidas, aceita. Registrada como [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]].

## Riscos aceitos

### RT-FOUND-01 — dívida de tooling (ARQ-FOUND-01)
- 5 vulnerabilidades altas, de um único advisory: GHSA-vfj7-8cjw-p6xm (`braces` ≤ 3.0.3).
- Só na cadeia de lint: `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`. Todas `dev`.
- **Risco aceito, com condições:**
  - proibidos `npm audit fix --force`, downgrade de `next` ou de `eslint-config-next` e `overrides` sem decisão registrada;
  - `npm audit --omit=dev` = 0 é condição de encerramento de toda feature que altere dependências do `/backend`. Vulnerabilidade de produção nunca é aceita implicitamente;
  - reavaliar quando houver versão sem essa cadeia ou corrigida, e antes de qualquer decisão de CI/deploy.
- Acompanhamento: [[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|PENDENCIAS]].

### RT-FOUND-02 — dependência fantasma
Importar um pacote sem declará-lo (ex.: `zod`) é violação dos itens (a) e (b) da [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]]. O QA checa no S5 de cada feature; guarda automática não é exigida agora.

### RT-FOUND-03 — `@types/node` à frente do Node local
`@types/node` 26.6.5 com Node v22.15.1 local: o typecheck aceita APIs que o runtime local não tem. Aceito sem mudança; alinhar quando o runtime oficial for decidido (deploy está fora do escopo).

## Limites aceitos das guardas de lint

| # | Limite | Situação |
|---|---|---|
| L-01 | A guarda 2 dá falso positivo em `'nodejs' as const` (lado seguro: usar o literal). `export * from` não é coberto (o Next também não lê) | aceito |
| L-02 | A guarda 2 só cobre `src/app/**`. O Next prioriza `backend/app/`, e o Pages Router usa outra sintaxe. Criar `backend/app/`, `pages/`, `src/pages/`, `middleware.*` ou `proxy.*` viola a estrutura do contrato; checar em toda feature | aceito |
| L-03 | `.mts` e `.cts` fora da guarda 1 | **ENCERRADO**: incluídos na rodada 1, por decisão do PO |
| L-04 | O bloqueio de `require("next/…")` depende de `@typescript-eslint/no-require-imports` (regra herdada, mensagem genérica). Se ela for desligada, reavaliar a guarda 1 | aceito |
| L-05 | `import()` com especificador calculado em tempo de execução não é verificável estaticamente | aceito |
| L-06 | `.jsx` fica fora das duas guardas (o Next 16.4.2 aceita `route.jsx` como rota) | **aberto**; novo, aceito, não bloqueante |

### Condições do L-06
- **(a)** Enquanto o L-06 estiver aberto, nenhum `.jsx` em `backend/src`; o QA confere em toda feature.
- **(b)** A correção é especificada pelo Arquiteto no contrato do primeiro gatilho. Ela consiste em acrescentar `jsx` ao `files` das duas guardas, declarar "Arquivos cobertos" também no item 2 do cabeçalho do `eslint.config.mjs` e ajustar a redação ligada a `import()` de tipo. Gatilhos:
  - qualquer feature que altere o `eslint.config.mjs`;
  - qualquer proposta de aceitar `.jsx`, ligar `allowJs` ou alterar `pageExtensions`;
  - antes de CI/deploy.
- **(c)** O PO pode antecipar a correção como mudança isolada.
- Acompanhamento: [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|PENDENCIAS]].

### Observação O-01
A telemetria do Next fica ativa por padrão no ambiente local. É decisão de CI/deploy, fora do escopo.

## Verificação mínima de regressão do lint
Vale para **toda feature que alterar `backend/eslint.config.mjs`**.
- **Sondagens R4 e R5 da rodada 1:**
  - bloqueia `next` e `next/*` em `src/domains/**` por import estático, `import type`, `import()` dinâmico, template sem interpolação e posição de tipo, inclusive em `.js`, `.mts` e `.cts`;
  - não bloqueia `next-auth`, `nextSomething`, `@next/env`, `./next`, `../next`, `node:*` nem template com interpolação;
  - a guarda 2 acusa `runtime` `"edge"`, `"experimental-edge"` ou reexportado, e aceita `"nodejs"`.
- **Mais dois casos:**
  - `require("next/server")` em `.js` ou `.cjs` → erro de qualquer regra;
  - `import s = require("next/server")` em `.ts` → erro com a mensagem do ADR-002.
- **Depois de corrigido o L-06:** os casos `.jsx` das duas guardas.
- **Quando a DEC-02 for decidida,** esse conjunto vira o teste automatizado B3.

## Dependências entre features
- **DEPENDS_ON:** [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] (aceito); [[decisoes/DEC-01-ROTA-TECNICA-HEALTH|DEC-01]] (aceita).
- **BLOCKS (segundo o contrato):** a fundação oficial de persistência (sem contrato, ID a definir) e todas as features de negócio. Com a FOUNDATION-001 aprovada, essa dependência está cumprida; elas continuam esperando as próprias decisões ([[decisoes/PENDENCIAS]]).
- **RELATED_TO:** DEC-02, DEC-03 e DEC-04, todas pendentes ([[decisoes/PENDENCIAS]]).
- **AUTH-001:** o contrato emitido em 2026-10-06, que aguarda aprovação do PO, tem a FOUNDATION-001 aprovada como uma de suas condições. Essa condição está cumprida ([[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|AUTH-001]]).

## Decisões pendentes citadas pelo contrato
Não bloquearam a FOUNDATION-001 e continuam abertas:
- [[decisoes/PENDENCIAS#DEC-02 — Biblioteca oficial de testes e quem escreve os testes|DEC-02]]: biblioteca de testes e quem escreve testes. Dela dependem B1–B3 como regressão automatizada.
- [[decisoes/PENDENCIAS#DEC-03 — Autenticação|DEC-03]]: autenticação.
- [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04]]: estratégia de migrations e forma de acesso ao banco.

## Divergências registradas pelo contrato
O contrato registra três ARCHITECTURAL DIVERGENCE entre o código existente e a Brain. Nenhuma bloqueou esta feature. Detalhes em [[tecnico/DIVERGENCIAS-LEGADO]]:
- **D1:** regra crítica no backend × páginas Vite gravando direto em 8 tabelas, protegidas só por RLS.
- **D2:** papéis OWNER/ADMIN/LEADER/MEMBER × enum legado `app_role` (organizador/lider/membro).
- **D3:** Igreja como tenant com `church_id` × tabela `igrejas` com colunas em português.

Relacionados: [[tecnico/BACKEND]], [[tecnico/API]], [[tecnico/LEGADO-ATUAL]], [[MOCs/MOC-GOVERNANCA]], [[MOCs/MOC-ARQUITETURA]].

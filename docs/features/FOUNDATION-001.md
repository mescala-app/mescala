# FOUNDATION-001 — Inicialização do Backend Next.js

> Emitido pelo Arquiteto (`arquiteto-mescala`) em 2026-10-04.
> Fontes normativas: `brain-mescala/decisoes/ADR-002-BACKEND-OFICIAL.md` e `brain-mescala/decisoes/DEC-01-ROTA-TECNICA-HEALTH.md`.
> Este arquivo contém o Feature Contract, o Backend Implementation Task, o Organization Task e o QA Contract. Data Task: não aplicável.

---

## FEATURE CONTRACT

```text
ID: FOUNDATION-001
DOMÍNIO: foundation (infraestrutura técnica; sem domínio de negócio)
NOME: Inicialização do Backend Next.js
VERSÃO: 1
STATUS: READY
```

### 1. Objetivo
Criar a aplicação backend oficial em `/backend` (Next.js, TypeScript, runtime Node.js) com typecheck, lint e build funcionando, as guardas estáticas do ADR-002 e a rota técnica `GET /api/health` (DEC-01). Sem regra de negócio, banco ou autenticação.

### 2. Ator
Nenhum ator de negócio. Operação técnica executada pelo Desenvolvedor Backend. A rota técnica é pública (DEC-01).

### 3. Pré-condições
- ADR-002 aceito; DEC-01 aceita.
- `/backend` inexistente.
- Node.js ≥ mínimo exigido pela versão do Next.js instalada (ambiente local em 2026-10-04: Node v22.15.1, npm 11.21.0).

### 4. Entradas
Nenhuma. `GET /api/health` não recebe parâmetros e não lê body, headers, cookies nem variáveis de ambiente (DEC-01).

### 5. Processamento
1. Criar `/backend` como pacote npm independente (`package.json` e `package-lock.json` próprios; sem workspace com a raiz).
2. Instalar somente as dependências da seção 14.
3. Configurar TypeScript com `strict: true` e alias `@/*` → `./src/*` (relativo a `/backend`).
4. Usar App Router com a pasta `src/` (`backend/src/app`).
5. Configurar o ESLint do `/backend` com as guardas do ADR-002 (ver Backend Implementation Task).
6. Criar os scripts `dev`, `build`, `start`, `lint` e `typecheck`. Sem script `test`.
7. Criar o `.gitignore` do `/backend`.
8. Na raiz: adicionar `backend` aos ignores do `eslint.config.js` (única exceção fora de `/backend`).
9. Criar `GET /api/health` conforme DEC-01.
10. Rodar typecheck, lint e build e registrar os resultados.

### 6. Regras normativas
Não há regra de negócio. Aplicam-se:
- `ADR-002#Decisão`: Next.js + TypeScript + Node.js em `/backend`.
- `ADR-002#Route Handlers`: handlers finos.
- `ADR-002#Runtime`: Node.js; Edge Runtime não é padrão.
- `ADR-002#Regras de negócio`: o domínio não depende do Next.js.
- `ADR-002#Fase atual`: sem UI.
- `ADR-002#Consequências`: nenhuma regra de negócio.
- `ADR-002#Decisões ainda não definidas`: não escolher ORM, query builder, validação, autenticação, migrations, testes, auditoria nem eventos.
- `DEC-01`: rota pública, resposta fixa, exceção única; não define envelope, erros, autenticação, autorização, validação, versionamento nem convenções de API.
- `05-REGRAS-DE-NEGOCIO#SEC-001`: preservada por construção (nenhum dado).

### 7. Entidades
Nenhuma.

### 8. Relacionamentos
Nenhum.

### 9. Autorização
Nenhuma operação protegida é criada. `GET /api/health` é pública (DEC-01) e não expõe dado algum. Proibida qualquer outra rota: DEC-01 não autoriza outras rotas, e `tecnico/API` e `seguranca/AUTENTICACAO` continuam A DEFINIR.

### 10. Multi-tenancy
Não há tenant nesta feature: nenhuma consulta, nenhum identificador de igreja, nenhuma conexão com banco. Sem superfície de IDOR. O mecanismo de contexto de igreja depende da decisão de autenticação (DEC-03) e será feature própria.

### 11. Transação
Não se aplica (sem escrita).

### 12. Impacto no banco
NÃO.

### 13. Domínios impactados
Principal: `foundation`. Secundários: nenhum.

### 14. Dependências aprovadas
Instaladas somente em `/backend`, com versões exatas fixadas no lockfile e registradas no relatório.
- **Runtime:** `next` (última versão estável na implementação), `react`, `react-dom`. React e React DOM entram só porque o Next.js os exige; nenhum código React será escrito.
- **Desenvolvimento:** `typescript`, `@types/node`, `@types/react`, `eslint`, `eslint-config-next`.
- **Proibidas:** ORM, query builder ou driver de Postgres; `@supabase/*`; bibliotecas de validação (inclusive `zod`), autenticação, testes ou logging; Tailwind, PostCSS ou qualquer pacote de UI.

### 15. Eventos de domínio
Nenhum.

### 16. Auditoria
Não se aplica.

### 17. Erros esperados
Nenhum erro de negócio. Método não suportado em `/api/health` → 405, comportamento padrão do Next.js (não implementar manualmente; não constitui padrão de erros).

### 18. Resultado esperado
`/backend` passa em typecheck, lint e build. `GET /api/health` → HTTP 200 com corpo `{"status":"ok"}`.

### 19. Critérios de aceite
1. `/backend` é um pacote npm independente, com `package-lock.json`.
2. Só as dependências da seção 14, com versões exatas registradas.
3. `tsconfig` com `strict: true` e alias `@/*` → `./src/*` do próprio `/backend`.
4. Scripts `dev`, `build`, `start`, `lint` e `typecheck` existem; nenhum script `test`.
5. `npm run typecheck`, `npm run lint` e `npm run build` passam em `/backend`.
6. Nenhum arquivo de UI: sem `page.*`, `layout.*`, CSS, Tailwind, `public/` ou componentes.
7. Nenhuma rota exporta `runtime` diferente de `nodejs`; não existe middleware nem proxy.
8. O ESLint do `/backend` acusa erro quando um arquivo em `src/domains/**` importa `next` ou `next/*`, e quando um arquivo em `src/app/**` exporta `runtime` diferente de `'nodejs'`.
9. O `.gitignore` do `/backend` cobre `.next/`, `node_modules/` e `.env*`.
10. Fora de `/backend`, só o `eslint.config.js` da raiz muda (`backend` nos ignores). `src/`, `supabase/`, `brain-mescala/` e `.claude/` intactos.
11. Nenhuma variável de ambiente, segredo ou cliente de banco.
12. `GET /api/health` → 200 com `{"status":"ok"}`; o handler não lê parâmetros, body, headers, cookies, variáveis de ambiente nem banco, e não identifica usuário nem igreja.
13. `POST /api/health` → 405 (padrão do Next.js).
14. `/api/health` é a única rota existente em `/backend`.
15. Nenhum helper, tipo ou utilitário de resposta/erro "reaproveitável" foi criado a partir da rota de saúde (DEC-01 não define envelope nem padrão de erros).
16. `route.ts` com o cabeçalho didático do padrão Mescala.

### 20. Fora do escopo
- Qualquer UI ou página; migração do frontend Vite.
- Conexão com banco, cliente, ORM, migrations, fundação de persistência.
- Autenticação, sessão, middleware/proxy, contexto de igreja.
- Validação de entrada; envelope de resposta; padrão de erros; versionamento e convenções de API (DEC-01; `tecnico/API` A DEFINIR).
- Qualquer rota além de `/api/health`.
- Logging, auditoria, eventos.
- Testes e biblioteca de testes.
- CORS, rate limit, headers de segurança.
- Deploy, CI, Docker, variáveis de ambiente.
- Pastas `domains/`, `infrastructure/`, `shared/` vazias ou com `.gitkeep`.
- Edge Functions existentes.
- Qualquer domínio de negócio.

---

## BACKEND IMPLEMENTATION TASK

```text
Feature:          FOUNDATION-001 — Inicialização do Backend Next.js
Domínio:          foundation
Responsabilidade: criar /backend conforme o Feature Contract (seções 5, 14 e 19)
```

**Arquivos esperados**

```text
backend/
├── package.json
├── package-lock.json
├── tsconfig.json
├── eslint.config.mjs
├── next.config.ts          (somente se necessário)
├── .gitignore
└── src/app/api/health/route.ts
```

Arquivo alterado fora de `/backend`: `eslint.config.js` da raiz, apenas para incluir `backend` nos ignores. Exceção autorizada por este contrato; justifique-a na seção 8 da sua análise.

**Regras de implementação**
- Não usar o template do Next.js com UI. Se usar `create-next-app`, a entrega final não pode conter nenhum arquivo de UI gerado.
- Se o Next.js exigir um arquivo de UI (ex.: layout raiz) para buildar só com Route Handlers: pare e reporte IMPLEMENTATION DIVERGENCE. Não crie o arquivo.
- Guardas de ESLint, cada uma com comentário curto citando o ADR-002:
  - `no-restricted-imports` bloqueando `next` e `next/*` em `src/domains/**`;
  - `no-restricted-syntax` bloqueando export de `runtime` diferente de `'nodejs'` em `src/app/**`.
- Handler: exporta só `GET`, responde com a API padrão `Response` e JSON estático `{"status":"ok"}`; não recebe nem lê nada (DEC-01).
- Não criar helper, tipo ou utilitário de resposta a partir desta rota.
- Cabeçalho do `route.ts`: `ARQUIVO`; `DOMÍNIO: foundation`; `FEATURE: FOUNDATION-001`; referência a `DEC-01`; sumário com `GET` — PT-BR "Verificar Saúde do Backend".
- Arquivos de configuração JSON não levam comentário.

**Dependências:** só as da seção 14. Qualquer outra é bloqueio.

**Validações, autorização, transação, auditoria:** não se aplicam.

**Ao entregar:** rodar `typecheck`, `lint` e `build` em `/backend`; registrar versões exatas; não fazer commit nem deploy.

**Critérios de aceite e fora do escopo:** seções 19 e 20 do contrato.

---

## ORGANIZATION TASK

- **Domínio principal:** `foundation`. Secundários: nenhum.
- **Estrutura esperada:** a árvore do Backend Implementation Task. A rota técnica fica em `app/api/health/` por exigência do framework.

**Dependências permitidas**
- Agora: nenhuma dependência interna.
- Futuro: `app/api` poderá depender da camada Application/Domain.

**Dependências proibidas**
- `src/domains/**` → `next/*`.
- Qualquer arquivo de `/backend` → `../src` (frontend) ou `../supabase`.
- Frontend → `/backend`.

**Possíveis violações estruturais**
- Arquivos de UI remanescentes do template.
- Pastas vazias ou com `.gitkeep`.
- `utils/`, `lib/` ou `shared/` criadas sem necessidade.
- Helpers de resposta criados a partir da rota de saúde.
- Configurações do backend na raiz do repositório.
- Rota técnica fora de `app/api`, ou qualquer rota adicional.

---

## QA CONTRACT

Validar contra o Feature Contract acima.

### A. Validação estática (código e diff)

| ID | Cenário | Critério |
|---|---|---|
| S1 | Nenhum arquivo de UI em `/backend` | 6 |
| S2 | Diff fora de `/backend` contém só os ignores do `eslint.config.js` | 10 |
| S3 | Nenhum `runtime` diferente de `nodejs`; sem middleware/proxy | 7 |
| S4 | Handler não lê parâmetros, body, headers, cookies, env nem banco; não identifica usuário nem igreja (cobre IDOR e cross-tenant: sem superfície) | 11, 12 |
| S5 | Dependências limitadas à seção 14 | 2 |
| S6 | `strict: true`; alias aponta para `backend/src`; nenhum import de `../src` | 3 |
| S7 | Regras de guarda presentes no `eslint.config.mjs` do backend | 8 (configuração) |
| S8 | `.gitignore` correto; nenhum `.env*` nem `.next/` versionado | 9, 11 |
| S9 | Nenhum script `test` | 4 |
| S10 | Cabeçalho didático no `route.ts` | 16 |
| S11 | `/api/health` é a única rota em `/backend` | 14 |
| S12 | Nenhum helper/tipo de resposta ou erro derivado da rota de saúde | 15 |

### A'. Validação por ferramentas (scripts existentes)

| ID | Cenário | Critério |
|---|---|---|
| T1 | `npm run typecheck` em `/backend` | 5 |
| T2 | `npm run lint` em `/backend` | 5 |
| T3 | `npm run build` em `/backend` | 5 |
| T4 | Regressão: `npm run lint` na raiz não traz nenhum caminho `backend/` no resultado (erros preexistentes do frontend não contam) | 10 |

### B. Cenários que exigem teste automatizado

| ID | Cenário | Critério |
|---|---|---|
| B1 | `GET /api/health` → 200 `{"status":"ok"}` | 12 |
| B2 | `POST /api/health` → 405 | 13 |
| B3 | Guardas do ESLint disparam com arquivo de exemplo que viola cada regra | 8 |

### C. Cenários que dependem de banco
Nenhum. A FOUNDATION-001 não acessa banco.

### D. Não executáveis enquanto a biblioteca de testes estiver A DEFINIR
B1, B2 e B3 como testes automatizados de regressão.
- Para B1 e B2, o QA está **autorizado** a um teste manual local: `npm run build`; `npm run start` em porta local livre; duas requisições a `localhost`; encerrar o processo. Vale como evidência, não como regressão.
- B3 exige um arquivo de exemplo que viole as regras, ou seja, um teste. O QA só escreve arquivos de teste depois da decisão da biblioteca oficial (DEC-02). Até lá, B3 fica validado só por S7 e é registrado como NOT TESTED.

### Cenários padrão

| Cenário | Situação |
|---|---|
| Happy path | B1 |
| Invalid input | Não se aplica (sem entrada); método inválido: B2 |
| Unauthorized / Forbidden | Não se aplica: rota pública sem dados (S4) |
| Cross-tenant | Não se aplica: sem dados (S4) |
| Transaction rollback | Não se aplica: sem escrita |
| Dependency failure | Não se aplica: sem dependências externas |
| Regression | T4 |

---

## DEPENDÊNCIAS ENTRE FEATURES

```text
FOUNDATION-001
DEPENDS_ON:  ADR-002 (aceito); DEC-01 (aceita)
BLOCKS:      Fundação oficial de persistência (ID a definir); todas as features de negócio
RELATED_TO:  DEC-02 (testes); DEC-03 (autenticação); DEC-04 (migrations e acesso ao banco)
```

## DECISÕES PENDENTES (não bloqueiam a FOUNDATION-001)

- **DEC-02 — Biblioteca oficial de testes e quem escreve os testes.** Bloqueia a regressão automatizada de B1–B3 e todas as features de negócio. Decidir antes da primeira feature de negócio.
- **DEC-03 — Autenticação** (`seguranca/AUTENTICACAO`). Bloqueia contexto de igreja e qualquer rota protegida.
- **DEC-04 — Estratégia de migrations e forma de acesso ao banco** (ADR-002). Bloqueia a fundação de persistência.

## ARCHITECTURAL DIVERGENCE (código existente × Brain; não bloqueiam esta feature)

| # | A Brain determina | O código atual faz | Necessita decisão |
|---|---|---|---|
| D1 | Regra crítica no backend (`02-ARQUITETURA`, ADR-002) | Páginas Vite gravam direto em 8 tabelas via `supabase-js`, protegidas só por RLS | SIM: plano de migração para `/backend` |
| D2 | Papéis OWNER/ADMIN/LEADER/MEMBER | Enum `app_role` organizador/lider/membro | SIM: fundação de persistência |
| D3 | Igreja como tenant, `church_id` | Tabela `igrejas`, colunas em português | SIM: fundação de persistência |

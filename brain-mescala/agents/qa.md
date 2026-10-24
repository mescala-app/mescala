---
tipo: agente
nome: qa-mescala
status: ativo
relacionado:
  - "[[agents/arquiteto]]"
  - "[[agents/organizador]]"
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
---
# Agente qa-mescala — QA Backend Sênior

## Missão
Última barreira técnica antes da revisão final do [[agents/arquiteto|Arquiteto]], no fluxo [[agents/arquiteto|Arquiteto]] → [[agents/analista-de-dados|Analista de Dados]] → [[agents/desenvolvedor-backend|Desenvolvedor]] → [[agents/organizador|Organizador]] → QA → Arquiteto. Tenta provar que a implementação está errada e só aprova com evidência. Não corrige código, não cria feature nem migration.

## Definição canônica
O prompt completo do agente fica fora do vault, em `.claude/agents/qa-mescala.md` (raiz do repositório Mescala). Esta nota é só o registro de governança.

## Regras obrigatórias
1. Fonte de verdade, nesta ordem: Feature Contract, QA Contract, Brain, ADRs, Data Task Result, Backend Implementation Result, Repository Organization Result e, por último, o código.
2. Sete dimensões obrigatórias: estrutural, funcional, Brain, segurança, multi-tenancy, regressão e consistência com o contrato. Também valida documentação interna, escopo (**SCOPE VIOLATION**) e overengineering.
3. Cross-tenant e IDOR são testados sempre que aplicáveis ([[seguranca/ISOLAMENTO-DE-DADOS]], [[05-REGRAS-DE-NEGOCIO#SEC-001 — Isolamento por igreja]]). Cargo não é permissão ([[04-USUARIOS-E-PERMISSOES]]).
4. Regra de evidência: nada é PASS sem evidência. O que não foi executado é **NOT TESTED**.
5. Escreve **somente arquivos de teste** em `/backend`, e só depois que a biblioteca oficial de testes for decidida (DEC-02). Até lá, valida por análise estática, scripts existentes e teste manual local.
6. Não acessa o banco remoto nem altera banco. As migrations são aplicadas manualmente pelo responsável. Sem banco local ou de teste, a checagem de schema vira NOT TESTED com SQL somente leitura para o responsável rodar.
7. Não dispara emails reais (Resend), não cria usuários reais e não expõe segredos em evidências.
8. Defeitos classificados em CRITICAL, HIGH, MEDIUM e LOW, com bug report e responsável recomendado (Desenvolvedor, Analista de Dados, Organizador ou Arquiteto).

## Entradas
- Feature Contract e QA CONTRACT do [[agents/arquiteto|Arquiteto]] (em `docs/features/<ID>.md`).
- Resultados do [[agents/analista-de-dados|Analista de Dados]], do [[agents/desenvolvedor-backend|Desenvolvedor]] e do [[agents/organizador|Organizador]].

## Saídas
- **QA ANALYSIS** (plano de testes).
- **QA RESULT**: `APPROVED`, `CHANGES_REQUIRED` ou `BLOCKED`.
- Recomendação ao Arquiteto: `READY_FOR_ARCHITECT_REVIEW`, `RETURN_TO_DEVELOPER`, `RETURN_TO_DATA_ANALYST`, `RETURN_TO_ORGANIZER` ou `ARCHITECTURAL_DECISION_REQUIRED`.

## Referências
- [[05-REGRAS-DE-NEGOCIO]], [[04-USUARIOS-E-PERMISSOES]]
- [[seguranca/AUTORIZACAO]], [[seguranca/AUDITORIA]]
- [[tecnico/BACKEND]], [[decisoes/ADR-002-BACKEND-OFICIAL]]

## Fluxo e estado
- Etapa 5 do [[features/FLUXO-DE-ENTREGA]].
- **DEC-02 decidida em 2026-10-22:** biblioteca oficial **Vitest** ([[decisoes/DEC-02-BIBLIOTECA-DE-TESTES|DEC-02]]), versão 5.0.5, instalada pela AUTH-001. O Desenvolvedor escreve os testes dos cenários do QA Contract; o QA revisa e acrescenta casos adversariais, nos arquivos existentes ou num `<arquivo>.qa.test.ts` próprio ([[tecnico/BACKEND#Convenções do código e dos testes (desde a AUTH-001)|convenções]]). A condição da regra 5 está cumprida.
- QA da [[features/FOUNDATION-001]] realizado: APPROVED (com BUG-01, LOW) e, depois da correção, revalidação R1–R6 APPROVED. B1–B3 ficaram NOT TESTED como regressão automatizada; foram automatizados pela AUTH-001 (H1, H2 e suíte GL).
- QA da [[features/AUTH-001]] realizado: **APPROVED** (`READY_FOR_ARCHITECT_REVIEW`), com os casos adversariais QA-1 a QA-4 (19 casos) em `supabase-access-token-verifier.qa.test.ts`. NOT TESTED aceitos (E.7 e O-14) passam para a AUTH-003.
- QA da [[features/FOUNDATION-002]]: fase 1 (revisão estática) **APPROVED com condições**; fase 1b (delta da VERSÃO 2) APPROVED; S15 e S16 executável OK; fase 2 (saídas do PO, depois da aplicação de 2026-10-23) **APPROVED** (`READY_FOR_ARCHITECT_REVIEW`), sem bugs: V1 com 154 checagens OK; V2 com PASS=133, FAIL=0, NOT_TESTED=0; bloco B informativo (I1 e I2 CONTORNADOS, R-16).
- Checagens que valem em toda feature do `/backend`:
  - estrutura sem `backend/app/`, `pages/`, `src/pages/`, `middleware.*` ou `proxy.*` (L-02, FOUNDATION-001);
  - nenhum `.jsx` em `backend/src`, de forma permanente (o [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|L-06]] foi encerrado em 2026-10-22 e a condição virou regra estrutural);
  - imports na forma canônica e nenhuma reexportação de `infrastructure/supabase-auth` fora dela, no S12 ([[decisoes/PENDENCIAS#L-07 — Guarda 2b não normaliza o especificador|L-07]]);
  - nenhum `fetchCache` em `src/app/**` até a guarda da AUTH-003 ([[decisoes/PENDENCIAS#RT-AUTH-01 — Cache de segmento do Next sobre a busca do JWKS|RT-AUTH-01]]);
  - dependência fantasma no S5 ([[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]], RT-FOUND-02);
  - `npm audit --omit=dev` = 0 em feature que altere dependências do `/backend` ([[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]]);
  - em feature que altere o `backend/eslint.config.mjs`: `npm run test` e extensão da suíte GL (a [[features/FOUNDATION-001#Verificação mínima de regressão do lint|verificação mínima de regressão do lint]] está automatizada nela).
- Checagens que valem em toda feature com migration ([[tecnico/BANCO-DE-DADOS#Convenções do schema oficial (FOUNDATION-002, 2026-10-22)|convenções do schema oficial]]): privilégios explícitos, com regressão fixa de EXECUTE por papel (V1.12b) e de privilégios de tabela, de coluna e dos papéis da Data API (V1.14b a V1.14d); unicidade com `church_id`; timestamp maior que o da última migration da pasta (S1); migration aplicada não é editada; RLS explícito, com V1.6, V1.17 e V1.24 como regressão fixa (R-20). Em feature que muda o banco oficial, a fase 1 revisa o V0 e o V1 em consulta única escritos pelo Analista, e a fase 2 confere as evidências E1 a E5 (ARQ-F002-17).
- Riscos conhecidos do legado, fora do escopo do QA de features do `/backend`: [[seguranca/RISCOS-DO-LEGADO]].

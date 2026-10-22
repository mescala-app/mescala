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
- **DEC-02 decidida em 2026-10-22:** biblioteca oficial **Vitest** ([[decisoes/DEC-02-BIBLIOTECA-DE-TESTES|DEC-02]]). O Desenvolvedor escreve os testes dos cenários do QA Contract; o QA revisa e acrescenta casos adversariais. A condição da regra 5 está cumprida; o Vitest entra no `/backend` com a primeira feature que precisar dele (a AUTH-001).
- QA da [[features/FOUNDATION-001]] realizado: APPROVED (com BUG-01, LOW) e, depois da correção, revalidação R1–R6 APPROVED. B1–B3 ficaram NOT TESTED como regressão automatizada; daqui para frente, viram teste automatizado quando o lint for alterado.
- Checagens que passam a valer em toda feature do `/backend`, aceitas na revisão da FOUNDATION-001:
  - estrutura sem `backend/app/`, `pages/`, `src/pages/`, `middleware.*` ou `proxy.*` (L-02);
  - nenhum `.jsx` em `backend/src` enquanto o [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|L-06]] estiver aberto;
  - dependência fantasma no S5 ([[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]], RT-FOUND-02);
  - `npm audit --omit=dev` = 0 em feature que altere dependências do `/backend` ([[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]]);
  - [[features/FOUNDATION-001#Verificação mínima de regressão do lint|verificação mínima de regressão do lint]] em feature que altere o `backend/eslint.config.mjs`.
- Riscos conhecidos do legado, fora do escopo do QA de features do `/backend`: [[seguranca/RISCOS-DO-LEGADO]].

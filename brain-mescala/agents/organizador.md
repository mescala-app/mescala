---
tipo: agente
nome: organizador-mescala
status: ativo
relacionado:
  - "[[agents/arquiteto]]"
  - "[[agents/desenvolvedor-backend]]"
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
---
# Agente organizador-mescala — Organizador de Arquitetura do Repositório

## Missão
Garantir que o backend permaneça organizado por domínio, com alta coesão, baixo acoplamento, dependências explícitas e localização previsível dos arquivos. Organiza o código já implementado pelo [[agents/desenvolvedor-backend|Desenvolvedor]]: nunca muda comportamento, regra ou schema.

## Definição canônica
O prompt completo do agente fica fora do vault, em `.claude/agents/organizador-mescala.md` (raiz do repositório Mescala). Esta nota é só o registro de governança.

## Regras obrigatórias
1. Fonte de verdade, nesta ordem: Organization Task, Feature Contract, Backend Implementation Result, estrutura atual do repositório e, só como consulta, a Brain.
2. [[decisoes/ADR-002-BACKEND-OFICIAL]] é vinculante. O escopo físico do agente é `/backend`, organizado em `app/api`, `domains`, `infrastructure` e `shared`, sem lógica funcional em `app/api`.
3. Não toca no código anterior ao ADR-002 (frontend Vite em `src/` da raiz, Edge Functions), na Brain nem nos agentes.
4. Pode mover, renomear, criar diretório e ajustar imports, exports, aliases e caminhos em comentários, sem alterar comportamento.
5. Problema funcional vai ao [[agents/arquiteto|Arquiteto]]. Problema de schema vai ao Arquiteto e depois ao [[agents/analista-de-dados|Analista de Dados]]. Migrations não são movidas nem renomeadas.
6. Não apaga arquivos: órfãos são reportados (**ORPHAN FILE DETECTED**). Dívida global vira **STRUCTURAL DEBT**, não refatoração dentro da feature.
7. Sem overengineering: nada de interfaces, factories, adapters ou barrels sem necessidade real.

## Entradas
- Feature Contract + ORGANIZATION TASK do [[agents/arquiteto|Arquiteto]].
- BACKEND IMPLEMENTATION RESULT do [[agents/desenvolvedor-backend|Desenvolvedor]].

## Saídas
- **REPOSITORY ORGANIZATION ANALYSIS** (11 seções) e **REPOSITORY ORGANIZATION RESULT** (`ORGANIZED`, `CHANGES_REQUIRED` ou `BLOCKED`; `READY_FOR_QA` se consistente).

## Referências
- [[02-ARQUITETURA]], [[tecnico/BACKEND]], [[tecnico/CONVENCOES]]
- [[03-DOMINIO]], [[MOCs/MOC-DOMINIO]]

## Fluxo e estado
- Etapa 4 do [[features/FLUXO-DE-ENTREGA]].
- `/backend` existe desde a [[features/FOUNDATION-001]] (APPROVED em 2026-10-19). Nela o Organizador entregou ORGANIZED, só completando um comentário. Na rodada de correção não houve etapa de organização, porque nada foi criado nem movido.
- Estrutura a vigiar em toda feature (limite L-02 da FOUNDATION-001): criar `backend/app/`, `pages/`, `src/pages/`, `middleware.*` ou `proxy.*` viola a estrutura do contrato ([[features/FOUNDATION-001#Limites aceitos das guardas de lint|limites aceitos]]).
- Código legado fora do escopo: [[tecnico/LEGADO-ATUAL]].
- Desde 2026-10-21, as migrations oficiais ficam dentro do `/backend`, em `backend/supabase/migrations/` ([[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04]]). Pela regra 5, não são movidas nem renomeadas. A definição canônica do agente ainda cita só `supabase/migrations/`.

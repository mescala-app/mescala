---
tipo: divergencias
status: aberto
area: arquitetura
relacionado:
  - "[[tecnico/LEGADO-ATUAL]]"
  - "[[features/FOUNDATION-001]]"
  - "[[decisoes/PENDENCIAS]]"
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
---
# Divergências: Brain × legado

O que a Brain determina e o que o sistema legado ([[tecnico/LEGADO-ATUAL]]) faz hoje. **Só a divergência de versionamento teve a causa resolvida**, no repositório (commit `0394893`); as demais continuam abertas. A Brain continua sendo a fonte normativa; o legado não altera regra. Resolver cada uma depende de decisão ([[decisoes/PENDENCIAS]]).

## Divergências arquiteturais da FOUNDATION-001 (D1–D3)
Registradas como ARCHITECTURAL DIVERGENCE no contrato da [[features/FOUNDATION-001]]. Nenhuma bloqueou aquela feature, encerrada em 2026-10-19; as três continuam abertas.

| # | A Brain determina | O código atual faz | Necessita decisão |
|---|---|---|---|
| D1 | Regra crítica no backend ([[02-ARQUITETURA]], [[decisoes/ADR-002-BACKEND-OFICIAL\|ADR-002]]) | Páginas Vite gravam direto em 8 tabelas via `supabase-js`, protegidas só por RLS | SIM: plano de migração para `/backend` |
| D2 | Papéis OWNER, ADMIN, LEADER e MEMBER ([[04-USUARIOS-E-PERMISSOES]]) | Enum `app_role` com organizador, lider e membro | SIM: fundação de persistência ([[decisoes/PENDENCIAS#DATA-DEC-005 — Papéis em cada camada\|DATA-DEC-005]]) |
| D3 | Igreja como tenant, com `church_id` ([[modulos/IGREJAS]], [[seguranca/ISOLAMENTO-DE-DADOS]]) | Tabela `igrejas`, colunas em português (`igreja_id`) | SIM: fundação de persistência ([[decisoes/PENDENCIAS#DATA-DEC-018 — Nomenclatura e idioma\|DATA-DEC-018]]) |

## Divergências apontadas na análise da AUTH-001 (D4–D5)
Registradas como ARCHITECTURAL DIVERGENCE no documento da AUTH-001 (`docs/features/AUTH-001.md`, fora do git), que aguarda aprovação do PO ([[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|AUTH-001]]).

| # | Divergência | Situação |
|---|---|---|
| D4 | Projeto Supabase: o `.env` do app e o vínculo do Supabase CLI apontam para `ehbidizpzxhfusfyjgtl` ("Projeto Mescala"); o `supabase/config.toml` aponta para `fiurvpkieiorngshjric` | Necessita decisão: [[decisoes/PENDENCIAS#DEC-05 — Projeto Supabase oficial\|DEC-05]] (proposta, não decidida) |
| D5 | A Brain dizia que as 3 migrations de julho, `aceitar-convite-cadastro`, `src/lib/profiles.ts`, `brain-mescala/`, `docs/`, `.claude/` e `daily/` estavam fora do git; o commit `0394893` já os tinha versionado | Não necessita decisão. Corrigida na Brain em 2026-10-20 ([[tecnico/LEGADO-ATUAL]], [[decisoes/PENDENCIAS]]) |

## Divergências Brain × banco atual
Seção 9 de `docs/data/DATA-ARCHITECTURE-REPORT.md` (fora do vault). A coluna "Pendência" só cita decisões que o próprio relatório liga ao tema.

| Tema | Brain | Banco atual | Pendência |
|---|---|---|---|
| Papéis | OWNER, ADMIN, LEADER e MEMBER por escopo ([[04-USUARIOS-E-PERMISSOES]]) | `app_role` organizador/lider/membro, com três fontes de verdade: `user_roles`, `igrejas.organizador_id` e `equipes.lider_id` | [[decisoes/PENDENCIAS#DATA-DEC-005 — Papéis em cada camada\|DATA-DEC-005]] |
| Nomes | Igreja, Equipe; `church_id` nos contratos | `igrejas`, `equipes`, `igreja_id` | [[decisoes/PENDENCIAS#DATA-DEC-001 — Equipe × Ministério\|DATA-DEC-001]], [[decisoes/PENDENCIAS#DATA-DEC-018 — Nomenclatura e idioma\|DATA-DEC-018]] |
| Líder da equipe | Papel no vínculo ([[modulos/EQUIPES]]) | Um único `lider_id` na equipe | [[decisoes/PENDENCIAS#DATA-DEC-008 — Quantidade de LEADER por ministério\|DATA-DEC-008]] |
| Funções | Entidade da equipe + compatibilidade do membro ([[modulos/FUNCOES]]) | Inexistentes: o [[05-REGRAS-DE-NEGOCIO#ESC-002 — Compatibilidade de função\|ESC-002]] é impossível hoje | — |
| Programação | Data + intervalo; várias equipes ([[modulos/PROGRAMACOES]]) | `eventos` semanal, sem data e sem fim: o [[05-REGRAS-DE-NEGOCIO#ESC-001 — Conflito de horário\|ESC-001]] é impossível | [[decisoes/PENDENCIAS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma\|DATA-DEC-003]], [[decisoes/PENDENCIAS#DATA-DEC-004 — Programações recorrentes\|DATA-DEC-004]] |
| Participação da equipe | Explícita ([[fluxos/FLUXO-PROGRAMACOES]]) | Inexistente | [[decisoes/PENDENCIAS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma\|DATA-DEC-003]] |
| Status da escala | 4 estados ([[dados/STATUS]]) | Inexistente | [[decisoes/PENDENCIAS#DATA-DEC-016 — Status e transições\|DATA-DEC-016]] |
| Alocação | Membro + função + 5 estados ([[dados/ENTIDADES#Alocação\|Alocação]]) | `escala_membros` sem função; `confirmado` booleano em que `false` significa ao mesmo tempo "pendente" e "recusou" | [[decisoes/PENDENCIAS#DATA-DEC-016 — Status e transições\|DATA-DEC-016]], [[decisoes/PENDENCIAS#DATA-DEC-022 — Convivência com o legado e migração de dados\|DATA-DEC-022]] |
| Substituição com histórico | [[05-REGRAS-DE-NEGOCIO#ESC-004 — Histórico de substituição\|ESC-004]] | Inexistente | [[decisoes/PENDENCIAS#DATA-DEC-015 — Modelo de substituição\|DATA-DEC-015]] |
| Disponibilidade | Datas **ou intervalos** ([[modulos/DISPONIBILIDADE]]) | `ausencias`: uma data, por equipe, sem uso | [[decisoes/PENDENCIAS#DATA-DEC-017 — Disponibilidade\|DATA-DEC-017]] |
| Membro | "São usuários" ([[modulos/MEMBROS]]) | `member_contacts`: membro sem conta | [[decisoes/PENDENCIAS#DATA-DEC-010 — Membro sem conta\|DATA-DEC-010]] |
| Convite | Ausente | Existe | [[decisoes/PENDENCIAS#DATA-DEC-011 — Convites\|DATA-DEC-011]] |
| Auditoria | Obrigatória para mudanças críticas ([[seguranca/AUDITORIA]]) | Inexistente | [[decisoes/PENDENCIAS#DATA-DEC-021 — Auditoria\|DATA-DEC-021]] |
| Isolamento | Obrigatório ([[05-REGRAS-DE-NEGOCIO#SEC-001 — Isolamento por igreja\|SEC-001]]) | Violado ([[seguranca/RISCOS-DO-LEGADO]]) | [[decisoes/PENDENCIAS#DATA-DEC-023 — Correção urgente de segurança no legado\|DATA-DEC-023]] |
| Histórico | Preservado ([[05-REGRAS-DE-NEGOCIO#ESC-004 — Histórico de substituição\|ESC-004]]) | CASCADE em quase todas as FKs | [[decisoes/PENDENCIAS#DATA-DEC-012 — Inativação, arquivamento e exclusão\|DATA-DEC-012]] |
| Integridade entre igrejas | Obrigatória ([[seguranca/ISOLAMENTO-DE-DADOS]]) | Nenhuma FK composta por igreja | — |
| FKs | — | `member_contacts.user_id` e `created_by` sem FK | [[decisoes/PENDENCIAS#DATA-DEC-010 — Membro sem conta\|DATA-DEC-010]] |
| Versionamento | Schema = migrations versionadas ([[decisoes/ADR-002-BACKEND-OFICIAL\|ADR-002]]) | O relatório registrou 3 migrations e 1 função fora do git. **Causa resolvida:** o commit `0394893` versionou as 3 migrations e a função que faltavam; hoje as 9 migrations e as 2 Edge Functions estão no git. Se o banco remoto corresponde às migrations continua sem verificação (inventário pendente) | — |

## Vocabulário
As notas da Brain dizem "Equipe"; o ADR-002, o [[Fluxograma.canvas]] e o Data Task do PO dizem "Ministério"; o legado diz `equipes` na tabela e "Líder de Equipe" / "Membro de Equipe" na tela. A escolha está em [[decisoes/PENDENCIAS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]]. Até lá, o vocabulário das notas não muda.

Relacionados: [[MOCs/MOC-ARQUITETURA]], [[MOCs/MOC-DADOS]], [[MOCs/MOC-GOVERNANCA]], [[tecnico/BANCO-DE-DADOS]].

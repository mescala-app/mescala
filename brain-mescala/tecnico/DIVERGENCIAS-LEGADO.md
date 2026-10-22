---
tipo: divergencias
status: aberto
area: arquitetura
atualizado: 2026-10-22
relacionado:
  - "[[tecnico/LEGADO-ATUAL]]"
  - "[[features/FOUNDATION-001]]"
  - "[[decisoes/PENDENCIAS]]"
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
  - "[[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]"
---
# Divergências: Brain × legado

O que a Brain determina e o que o sistema legado ([[tecnico/LEGADO-ATUAL]]) faz hoje. A Brain continua sendo a fonte normativa; o legado não altera regra.

**Situação em 2026-10-22:**
- O modelo oficial foi decidido ([[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]]) e nasce do zero no projeto Supabase novo `vitqnyzuvrvkmnvshcpb` ([[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]). O legado não é alterado ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-022 — Convivência com o legado e migração de dados|DATA-DEC-022]]).
- O app legado **não tem uso real**: não há migração de dados, e a correção de segurança do legado não se aplica (decisões do PO de 2026-10-22).
- Nenhuma das decisões tomadas corrige as divergências abaixo no legado: elas continuam existindo nele enquanto os projetos antigos estiverem ativos. Resolvidas: D4 (quanto ao backend oficial), D5 e o versionamento.

## Divergências arquiteturais da FOUNDATION-001 (D1–D3)
Registradas como ARCHITECTURAL DIVERGENCE no contrato da [[features/FOUNDATION-001]]. Nenhuma bloqueou aquela feature, encerrada em 2026-10-19.

| # | A Brain determina | O código atual faz | Situação |
|---|---|---|---|
| D1 | Regra crítica no backend ([[02-ARQUITETURA]], [[decisoes/ADR-002-BACKEND-OFICIAL\|ADR-002]]) | Páginas Vite gravam direto em 8 tabelas via `supabase-js`, protegidas só por RLS | Aberta. O plano para o frontend legado necessita decisão; o app não tem uso real (2026-10-22) |
| D2 | Papéis da igreja OWNER, ADMIN e MEMBER; do ministério LEADER e MEMBER ([[04-USUARIOS-E-PERMISSOES]]) | Enum `app_role` com organizador, lider e membro | Modelo oficial decidido ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 — Papéis em cada camada\|DATA-DEC-005]]); o legado continua divergente |
| D3 | Igreja como tenant, com `church_id` ([[modulos/IGREJAS]], [[seguranca/ISOLAMENTO-DE-DADOS]]) | Tabela `igrejas`, colunas em português (`igreja_id`) | Modelo oficial decidido ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-018 — Nomenclatura e idioma\|DATA-DEC-018]]: inglês); o legado continua divergente |

Até 2026-10-21, a coluna "A Brain determina" de D2 dizia "Papéis OWNER, ADMIN, LEADER e MEMBER".

## Divergências apontadas na análise da AUTH-001 (D4–D5)
Registradas como ARCHITECTURAL DIVERGENCE no documento da AUTH-001 (`docs/features/AUTH-001.md`, versionado desde o commit `50a1cd6` e atualizado para a v2 no `4039fe0`; até 2026-10-22, esta nota dizia "fora do git").

| # | Divergência | Situação |
|---|---|---|
| D4 | Projeto Supabase: o `.env` do app e o vínculo do Supabase CLI apontam para `ehbidizpzxhfusfyjgtl` ("Projeto Mescala"); o `supabase/config.toml` aponta para `fiurvpkieiorngshjric` | **Resolvida quanto ao backend oficial em 2026-10-21:** o projeto oficial é o novo `vitqnyzuvrvkmnvshcpb` ([[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL\|DEC-05]]). Os dois projetos antigos ficam só para o app legado, que continua com a diferença entre `.env`/CLI e `config.toml`. Pausar ou excluir os projetos antigos: decisão operacional do PO, data **A DEFINIR** |
| D5 | A Brain dizia que as 3 migrations de julho, `aceitar-convite-cadastro`, `src/lib/profiles.ts`, `brain-mescala/`, `docs/`, `.claude/` e `daily/` estavam fora do git; o commit `0394893` já os tinha versionado | Não necessita decisão. Corrigida na Brain em 2026-10-20 ([[tecnico/LEGADO-ATUAL]], [[decisoes/PENDENCIAS]]) |

## Divergências Brain × banco atual
Seção 9 de `docs/data/DATA-ARCHITECTURE-REPORT.md` (fora do vault). A coluna "Brain" mostra o que a Brain determina desde as decisões de 2026-10-21 e 2026-10-22; a coluna "Decisão" aponta a decisão que fixou o modelo oficial. O banco atual é o do legado e não muda.

| Tema | Brain | Banco atual (legado) | Decisão |
|---|---|---|---|
| Papéis | Igreja: OWNER, ADMIN, MEMBER; ministério: LEADER, MEMBER ([[04-USUARIOS-E-PERMISSOES]]) | `app_role` organizador/lider/membro, com três fontes de verdade: `user_roles`, `igrejas.organizador_id` e `equipes.lider_id` | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 — Papéis em cada camada\|DATA-DEC-005]] |
| Nomes | Igreja, Ministério; identificadores em inglês (`church_id`, `ministry_id`) | `igrejas`, `equipes`, `igreja_id` | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-001 — Equipe × Ministério\|DATA-DEC-001]], [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-018 — Nomenclatura e idioma\|DATA-DEC-018]] |
| Líder do ministério | Papel no vínculo; vários por ministério ([[modulos/EQUIPES]]) | Um único `lider_id` na equipe | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-008 — Quantidade de LEADER por ministério\|DATA-DEC-008]] |
| Funções | Entidade do ministério + compatibilidade do membro ([[modulos/FUNCOES]]) | Inexistentes: o [[05-REGRAS-DE-NEGOCIO#ESC-002 — Compatibilidade de função\|ESC-002]] é impossível hoje | — |
| Programação | Ocorrência datada (início e fim); vários ministérios ([[modulos/PROGRAMACOES]]) | `eventos` semanal, sem data e sem fim: o [[05-REGRAS-DE-NEGOCIO#ESC-001 — Conflito de horário\|ESC-001]] é impossível | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma\|DATA-DEC-003]], [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-004 — Programações recorrentes\|DATA-DEC-004]] |
| Participação do ministério | Explícita ([[fluxos/FLUXO-PROGRAMACOES]]) | Inexistente | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma\|DATA-DEC-003]] |
| Status da escala | 3 estados: RASCUNHO, PUBLICADA, CONCLUIDA; CANCELADA removido em 2026-10-22 ([[dados/STATUS]]) | Inexistente | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-016 — Status e transições\|DATA-DEC-016]] |
| Alocação | Membro + função + 5 estados ([[dados/ENTIDADES#Alocação\|Alocação]]) | `escala_membros` sem função; `confirmado` booleano em que `false` significa ao mesmo tempo "pendente" e "recusou" | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-016 — Status e transições\|DATA-DEC-016]], [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-022 — Convivência com o legado e migração de dados\|DATA-DEC-022]] |
| Substituição com histórico | [[05-REGRAS-DE-NEGOCIO#ESC-004 — Histórico de substituição\|ESC-004]] | Inexistente | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-015 — Modelo de substituição\|DATA-DEC-015]] |
| Disponibilidade | Só impedimentos, por pessoa na igreja, com início e fim ([[modulos/DISPONIBILIDADE]]) | `ausencias`: uma data, por equipe, sem uso | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-017 — Disponibilidade\|DATA-DEC-017]] |
| Membro | Só quem tem conta é membro ([[modulos/MEMBROS]]) | `member_contacts`: membro sem conta | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-010 — Membro sem conta\|DATA-DEC-010]] |
| Convite | Convite oficial, só com o hash do token; status PENDENTE, ACEITO, EXPIRADO, CANCELADO | Token em texto puro; `invite_status` pending/accepted/expired | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-011 — Convites\|DATA-DEC-011]] |
| Auditoria | Tabela só de inserção, gravada pelo backend ([[seguranca/AUDITORIA]]) | Inexistente | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 — Auditoria\|DATA-DEC-021]] |
| Isolamento | Obrigatório ([[05-REGRAS-DE-NEGOCIO#SEC-001 — Isolamento por igreja\|SEC-001]]) | Violado ([[seguranca/RISCOS-DO-LEGADO]]) | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-023 — Correção urgente de segurança no legado\|DATA-DEC-023]]: correção não se aplica (2026-10-22) |
| Histórico | Nada com histórico é apagado ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado\|HIS-001]]) | CASCADE em quase todas as FKs | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-012 — Inativação, arquivamento e exclusão\|DATA-DEC-012]] |
| Integridade entre igrejas | Obrigatória ([[seguranca/ISOLAMENTO-DE-DADOS]]) | Nenhuma FK composta por igreja | — |
| FKs | — | `member_contacts.user_id` e `created_by` sem FK | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-010 — Membro sem conta\|DATA-DEC-010]] |
| Versionamento | Schema = migrations versionadas ([[decisoes/ADR-002-BACKEND-OFICIAL\|ADR-002]]) | O relatório registrou 3 migrations e 1 função fora do git. **Causa resolvida:** o commit `0394893` versionou as 3 migrations e a função que faltavam; hoje as 9 migrations e as 2 Edge Functions estão no git. Se o banco remoto corresponde às migrations não foi verificado; o inventário foi dispensado em 2026-10-22 | — |

## Vocabulário
Desde 2026-10-21, as notas da Brain dizem **Ministério**, como o ADR-002, o [[Fluxograma.canvas]] e o Data Task do PO ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]]). O legado continua dizendo `equipes` na tabela e "Líder de Equipe" / "Membro de Equipe" na tela.

Relacionados: [[MOCs/MOC-ARQUITETURA]], [[MOCs/MOC-DADOS]], [[MOCs/MOC-GOVERNANCA]], [[tecnico/BANCO-DE-DADOS]].

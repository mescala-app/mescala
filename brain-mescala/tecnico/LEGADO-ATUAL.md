---
tipo: tecnico
camada: legado
status: legado
normativo: false
verificado: 2026-10-06
atualizado: 2026-10-22
uso-real: nao (PO, 2026-10-22)
relacionado:
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[tecnico/DIVERGENCIAS-LEGADO]]"
  - "[[seguranca/RISCOS-DO-LEGADO]]"
  - "[[tecnico/FRONTEND]]"
  - "[[tecnico/BANCO-DE-DADOS]]"
---
# Estado atual do sistema (legado)

> **Nota descritiva, não normativa.** Registra o que existe hoje no repositório. Não é fonte de regra: onde o legado diverge da Brain, a Brain prevalece e a divergência vai para [[tecnico/DIVERGENCIAS-LEGADO]].

## Resumo
O app legado é um **frontend Vite + React que grava direto nas tabelas do Supabase**, protegido **só por RLS**, com **Edge Functions para convites**. Ele não passa por backend próprio.

> **Sem uso real** (decisão do PO, 2026-10-22: "o app antigo não tinha movimento"). Consequências: não há migração de dados para o modelo oficial, a consulta de inventário foi dispensada e a correção de segurança do legado não se aplica ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-022 — Convivência com o legado e migração de dados|DATA-DEC-022]], [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-023 — Correção urgente de segurança no legado|DATA-DEC-023]]). Os riscos S1–S11 continuam existindo nos projetos antigos enquanto estiverem ativos ([[seguranca/RISCOS-DO-LEGADO]]). Pausar ou excluir esses projetos é decisão operacional do PO, com data **A DEFINIR**.

Isso diverge da arquitetura oficial: o [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] define um backend Next.js em `/backend` como entrada da aplicação e diz que Edge Functions não são a arquitetura principal. O `/backend` existe desde a [[features/FOUNDATION-001]] (APPROVED em 2026-10-19, commit `7f26d30`), mas só tem a rota técnica `GET /api/health`, e o app legado não o utiliza ([[tecnico/BACKEND]]).

## Origem
- O projeto começou como **Escala.iasd** (commit inicial "Escala.iasd baseline"). O `README.md` da raiz descreve essa versão. Ele é contexto histórico, **não é fonte normativa** da Brain.
- As 6 migrations de 2026-01 têm nomes em UUID, padrão do Lovable (o `package.json` ainda tem `lovable-tagger`).

## Frontend (`src/`)
- Vite + React + TypeScript, com React Router, TanStack Query e componentes shadcn/Radix com Tailwind.
- Cliente `supabase-js` com a chave pública (publishable) do projeto, que fica no frontend.
- Lê e grava direto em **8 tabelas**: `profiles`, `user_roles`, `igrejas`, `equipes`, `eventos`, `convites`, `member_contacts` e `escala_membros`.
- Rotas: `/`, `/auth`, `/dashboard`, `/cadastrar-igreja`, `/igreja/:igrejaId`, `/igreja/:igrejaId/equipes`, `/equipe/:equipeId`, `/equipe/:equipeId/membros`, `/lider`, `/membro`, `/aceitar-convite`.
- Nenhuma tela cria escala; `escalas` só é lida por join.
- Contrasta com o princípio de [[02-ARQUITETURA]] ("nenhuma regra crítica pode existir apenas no frontend") e com a fase BACKEND ONLY: o frontend legado está fora do escopo dos agentes ([[features/FLUXO-DE-ENTREGA]]).

## Autenticação
- Supabase Auth com email e senha (`signUp`, `signInWithPassword`).
- Modo de teste: a variável `VITE_TEST_SKIP_EMAIL_CONFIRM` e a coluna `profiles.confirmado` simulam a confirmação de email.
- Na tela de login, a pessoa escolhe o perfil com que vai entrar, porque o mesmo email pode ter mais de um papel:

| Valor no banco (`app_role`) | Rótulo na tela | Rota |
|---|---|---|
| `organizador` | Líder de Igreja | `/dashboard` |
| `lider` | Líder de Equipe | `/lider` |
| `membro` | Membro de Equipe | `/membro` |

A autenticação oficial foi decidida pelo [[decisoes/ADR-003-AUTENTICACAO|ADR-003]] em 2026-10-21: Supabase Auth do projeto **novo** `vitqnyzuvrvkmnvshcpb` ([[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]), não dos projetos do legado ([[seguranca/AUTENTICACAO]]). O uso de Supabase Auth no legado não decidiu nada para o backend oficial.

## Convites (comportamento legado)
- Convite por email com token, guardado em texto puro na tabela `convites`.
- Regra legada de quem convida quem (migration de 2026-07-11): **Líder de Igreja** só convida **Líder de Equipe**; **Líder de Equipe** só convida **Membro de Equipe**.
- O líder também cadastra pessoas sem conta em `member_contacts` e depois as convida.
- Desde 2026-10-21, o modelo oficial tem convite, com só o hash do token, e não tem membro sem conta ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-011 — Convites|DATA-DEC-011]], [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-010 — Membro sem conta|DATA-DEC-010]]). A regra legada de quem convida quem foi registrada na Brain como [[05-REGRAS-DE-NEGOCIO#MEM-003 — Quem convida quem|MEM-003]].

## Edge Functions (`supabase/functions/`)
| Função | O que faz | Observação |
|---|---|---|
| `enviar-convites` | Usa a service role, busca os convites pendentes de uma igreja (`igreja_id` vindo no corpo) e envia os emails pelo Resend | Não verifica quem chama (risco S8 em [[seguranca/RISCOS-DO-LEGADO]]) |
| `aceitar-convite-cadastro` | Usa a service role, valida o convite pelo token e cria a conta já com email confirmado | Versionada no commit `0394893` (antes estava fora do git); ligada ao risco S3 |

## Banco (Supabase, schema `public`)
- **11 tabelas:** `profiles`, `user_roles`, `igrejas`, `eventos`, `equipes`, `convites`, `member_contacts`, `ausencias`, `escalas`, `escala_membros`, `notificacoes`.
- **Sem uso por nenhuma tela:** `ausencias` e `notificacoes`.
- **Enums:** `app_role` (organizador, lider, membro), `dia_semana`, `invite_status` (pending, accepted, expired).
- **Funções do RLS:** `user_belongs_to_igreja`, `user_belongs_to_equipe`, `user_is_lider_of_equipe` (SECURITY DEFINER). `has_role()` existe, mas nenhuma policy a usa.
- **Papéis com três fontes de verdade:** `user_roles`, `igrejas.organizador_id` e `equipes.lider_id`.
- **Exclusão em cascata:** apagar uma igreja ou um usuário apaga escalas, escalações e papéis. O histórico desaparece, o que contraria [[05-REGRAS-DE-NEGOCIO#ESC-004 — Histórico de substituição|ESC-004]] e [[seguranca/AUDITORIA]].
- **Migrations:** 9 em `supabase/migrations/`, ligadas ao app legado. O `types.ts` gerado bate com elas. Elas **nunca** são aplicadas no banco oficial, cujas migrations ficam em `backend/supabase/migrations/` ([[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04]]). O estado real do banco remoto não foi verificado; a consulta de inventário foi dispensada em 2026-10-22.

## Versionamento (conferido com `git ls-files` em 2026-10-20)
- **Correção (divergência D5, apontada na análise da AUTH-001):** esta nota dizia que estavam fora do git as 3 migrations de julho (`20260711053429_fix_convite_lider_rls`, `20260711060850_apelido_e_convites_por_perfil`, `20260712094502_profiles_confirmado_teste`), a função `aceitar-convite-cadastro`, `src/lib/profiles.ts`, `brain-mescala/`, `docs/`, `.claude/` e `daily/`. Isso vinha do `git status` de 2026-10-06, anterior ao commit `0394893` (2026-10-06 20:13), que versionou todos esses arquivos.
- **Hoje:** as 9 migrations e as 2 Edge Functions estão versionadas. Em 2026-10-20 e 2026-10-21, só `docs/features/AUTH-001.md` estava fora do git, além do que o `.gitignore` ignora de propósito (por exemplo `.env`, `node_modules/` e os artefatos de build do `/backend`). **Correção de 2026-10-22:** `docs/features/AUTH-001.md` está versionado desde o commit `50a1cd6` (v1, 2026-10-22 00:37) e foi atualizado para a v2 no `4039fe0`.
- **Consequência que o relatório de dados registrava:** a regra "schema = migrations" do [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] não estava garantida, porque havia migrations fora do git. Essa causa deixou de existir. Se o banco remoto corresponde às migrations não foi verificado; a consulta de inventário foi dispensada em 2026-10-22, porque o app legado não tem uso real ([[decisoes/PENDENCIAS#Uso real do app legado — DATA-DEC-022 e 023|PENDENCIAS]]).
- **Cache do Supabase CLI:** `supabase/.temp/` (project ref e URL do pooler com usuário, sem senha) estava versionado desde o commit `a6447fc` (2026-07-11). O commit `a034046` o tirou do git e o acrescentou ao `.gitignore`; o histórico anterior ainda contém os arquivos. Ver [[decisoes/PENDENCIAS#Cache do Supabase CLI no git|Cache do Supabase CLI no git]].

## Histórico recente (resumo do `daily/2026-07-11.txt`)
- Corrigida a policy de RLS que impedia o líder de equipe de assumir a equipe depois de aceitar o convite.
- Adicionado o seletor de perfil no login.
- Quem cria conta sem convite passa a ser levado ao cadastro de igreja.
- Adicionado o apelido ("como quer ser chamado").
- Restringido quem pode convidar quem.
- Travamentos de configuração do Supabase (confirmação de email e limite de envio de emails), não de código.

## Relação com a arquitetura oficial
- Divergências formais: D1–D3 da [[features/FOUNDATION-001]], D4–D5 da análise da AUTH-001 e a seção 9 do relatório de dados, todas em [[tecnico/DIVERGENCIAS-LEGADO]].
- Riscos de segurança conhecidos: [[seguranca/RISCOS-DO-LEGADO]].
- Convivência com o modelo oficial: schema oficial em paralelo, no projeto novo, sem tocar no legado; sem migração de dados, porque o app não tem uso real ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-022 — Convivência com o legado e migração de dados|DATA-DEC-022]]).
- Plano para o frontend legado (D1): necessita decisão.
- Projeto Supabase: o `.env` do app e o vínculo do Supabase CLI apontam para um projeto (`ehbidizpzxhfusfyjgtl`), e o `supabase/config.toml` para outro (`fiurvpkieiorngshjric`). Divergência D4 da análise da AUTH-001, **resolvida quanto ao backend oficial** em 2026-10-21: o projeto oficial é o novo `vitqnyzuvrvkmnvshcpb`, e os dois antigos ficam só para o legado ([[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]).

## Fontes (fora do vault)
`src/`, `supabase/migrations/`, `supabase/functions/`, `README.md`, `daily/2026-07-11.txt` e as seções 1, 8 e 9 de `docs/data/DATA-ARCHITECTURE-REPORT.md`. Versionamento e projeto Supabase: `git log`, `git ls-files` (2026-10-20 e 2026-10-21), `supabase/config.toml`, `supabase/.temp/` e as seções 1.3 e 1.4 de `docs/features/AUTH-001.md`. Uso real: decisão do PO de 2026-10-22.

Relacionados: [[MOCs/MOC-ARQUITETURA]], [[MOCs/MOC-GOVERNANCA]], [[tecnico/BACKEND]], [[tecnico/API]].

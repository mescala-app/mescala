---
tipo: tecnico
camada: legado
status: legado
normativo: false
verificado: 2026-10-06
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
O app em uso hoje (produção/teste) é um **frontend Vite + React que grava direto nas tabelas do Supabase**, protegido **só por RLS**, com **Edge Functions para convites**. Não existe backend próprio.

Isso diverge da arquitetura oficial: o [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] define um backend Next.js em `/backend` como entrada da aplicação e diz que Edge Functions não são a arquitetura principal. Em 2026-10-06, `/backend` ainda não existe: ele nasce na [[features/FOUNDATION-001]], que não foi implementada.

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

A autenticação oficial está pendente ([[decisoes/PENDENCIAS#DEC-03 — Autenticação|DEC-03]]; [[seguranca/AUTENTICACAO]]). O uso de Supabase Auth no legado não decide nada para o backend oficial.

## Convites (comportamento legado)
- Convite por email com token, guardado em texto puro na tabela `convites`.
- Regra legada de quem convida quem (migration de 2026-07-11): **Líder de Igreja** só convida **Líder de Equipe**; **Líder de Equipe** só convida **Membro de Equipe**.
- O líder também cadastra pessoas sem conta em `member_contacts` e depois as convida.
- A Brain não tem convite nem membro sem conta. Ambos estão em decisão: [[decisoes/PENDENCIAS#DATA-DEC-011 — Convites|DATA-DEC-011]] e [[decisoes/PENDENCIAS#DATA-DEC-010 — Membro sem conta|DATA-DEC-010]].

## Edge Functions (`supabase/functions/`)
| Função | O que faz | Observação |
|---|---|---|
| `enviar-convites` | Usa a service role, busca os convites pendentes de uma igreja (`igreja_id` vindo no corpo) e envia os emails pelo Resend | Não verifica quem chama (risco S8 em [[seguranca/RISCOS-DO-LEGADO]]) |
| `aceitar-convite-cadastro` | Usa a service role, valida o convite pelo token e cria a conta já com email confirmado | Fora do git; ligada ao risco S3 |

## Banco (Supabase, schema `public`)
- **11 tabelas:** `profiles`, `user_roles`, `igrejas`, `eventos`, `equipes`, `convites`, `member_contacts`, `ausencias`, `escalas`, `escala_membros`, `notificacoes`.
- **Sem uso por nenhuma tela:** `ausencias` e `notificacoes`.
- **Enums:** `app_role` (organizador, lider, membro), `dia_semana`, `invite_status` (pending, accepted, expired).
- **Funções do RLS:** `user_belongs_to_igreja`, `user_belongs_to_equipe`, `user_is_lider_of_equipe` (SECURITY DEFINER). `has_role()` existe, mas nenhuma policy a usa.
- **Papéis com três fontes de verdade:** `user_roles`, `igrejas.organizador_id` e `equipes.lider_id`.
- **Exclusão em cascata:** apagar uma igreja ou um usuário apaga escalas, escalações e papéis. O histórico desaparece, o que contraria [[05-REGRAS-DE-NEGOCIO#ESC-004 — Histórico de substituição|ESC-004]] e [[seguranca/AUDITORIA]].
- **Migrations:** 9 em `supabase/migrations/`. O `types.ts` gerado bate com elas. O estado real do banco remoto não foi verificado; a consulta de inventário está pendente ([[decisoes/PENDENCIAS]]).

## Fora do git (git status de 2026-10-06)
- As 3 migrations de julho (`20260711053429_fix_convite_lider_rls`, `20260711060850_apelido_e_convites_por_perfil`, `20260712094502_profiles_confirmado_teste`).
- A função `aceitar-convite-cadastro` e `src/lib/profiles.ts`.
- Também não estão versionados: `brain-mescala/`, `docs/`, `.claude/` e `daily/`.
- Consequência registrada pelo relatório de dados: a regra "schema = migrations" do [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] não está garantida no repositório.

## Histórico recente (resumo do `daily/2026-07-11.txt`)
- Corrigida a policy de RLS que impedia o líder de equipe de assumir a equipe depois de aceitar o convite.
- Adicionado o seletor de perfil no login.
- Quem cria conta sem convite passa a ser levado ao cadastro de igreja.
- Adicionado o apelido ("como quer ser chamado").
- Restringido quem pode convidar quem.
- Travamentos de configuração do Supabase (confirmação de email e limite de envio de emails), não de código.

## Relação com a arquitetura oficial
- Divergências formais: D1–D3 da [[features/FOUNDATION-001]] e a seção 9 do relatório de dados, ambas em [[tecnico/DIVERGENCIAS-LEGADO]].
- Riscos de segurança conhecidos: [[seguranca/RISCOS-DO-LEGADO]].
- Convivência e migração para o modelo oficial: [[decisoes/PENDENCIAS#DATA-DEC-022 — Convivência com o legado e migração de dados|DATA-DEC-022]].
- Plano de migração do frontend para `/backend`: necessita decisão (D1).

## Fontes (fora do vault)
`src/`, `supabase/migrations/`, `supabase/functions/`, `README.md`, `daily/2026-07-11.txt` e as seções 1, 8 e 9 de `docs/data/DATA-ARCHITECTURE-REPORT.md`.

Relacionados: [[MOCs/MOC-ARQUITETURA]], [[MOCs/MOC-GOVERNANCA]], [[tecnico/BACKEND]], [[tecnico/API]].

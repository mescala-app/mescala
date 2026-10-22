---
tipo: decisao
status: aceito
data: 2026-10-21
complemento: 2026-10-22
origem: AUTH-001 (divergência D4, bloqueio B4)
projeto-oficial: vitqnyzuvrvkmnvshcpb
relacionado:
  - "[[decisoes/ADR-003-AUTENTICACAO]]"
  - "[[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]]"
  - "[[tecnico/DIVERGENCIAS-LEGADO]]"
  - "[[tecnico/BANCO-DE-DADOS]]"
  - "[[decisoes/PENDENCIAS]]"
---
# DEC-05 — Projeto Supabase oficial

## Status
**ACEITO** em 2026-10-21, pelo PO.

- **Origem:** decisão proposta pela análise da AUTH-001 (`docs/features/AUTH-001.md`, fora do vault), que apontou a divergência D4 e o bloqueio B4. O número estava reservado desde 2026-10-06 ([[decisoes/PENDENCIAS#DEC-05 — Projeto Supabase oficial|registro em PENDENCIAS]]).

---

## Contexto
- O `.env` do app legado e o vínculo do Supabase CLI apontam para `ehbidizpzxhfusfyjgtl` ("Projeto Mescala"); o `supabase/config.toml` aponta para `fiurvpkieiorngshjric` (divergência D4 em [[tecnico/DIVERGENCIAS-LEGADO]]).
- O [[decisoes/ADR-003-AUTENTICACAO|ADR-003]] usa o Supabase Auth "do projeto oficial": o `iss` e o JWKS que o backend aceita dependem do projeto.
- Opções da AUTH-001 (B4): A) `ehbidizpzxhfusfyjgtl`; B) `fiurvpkieiorngshjric`; C) "novo projeto, o que exige migrar as identidades".

## Decisão
O projeto Supabase oficial do Mescala é um projeto **novo** (opção C da AUTH-001):

| Item | Valor |
|---|---|
| Project ref | `vitqnyzuvrvkmnvshcpb` |
| URL | `https://vitqnyzuvrvkmnvshcpb.supabase.co` |
| Região | **a confirmar pelo PO** |

- **Motivo informado pelo PO:** o plano gratuito do Supabase limita a quantidade de projetos por usuário. Por isso o PO criou uma nova conta no GitHub, com o repositório `mescala` (o usuário `athrios` é colaborador; a URL do repositório ainda não foi informada), e o projeto Supabase novo.
- **Projetos antigos:** `ehbidizpzxhfusfyjgtl` ("Projeto Mescala", usado pelo `.env` e pela CLI do app legado) e `fiurvpkieiorngshjric` (`supabase/config.toml` legado) ficam **só para o app legado**, até ele sair de uso ([[tecnico/LEGADO-ATUAL]]).
- **Divergência D4:** encerrada quanto ao backend oficial. No legado, os dois projetos antigos continuam como estão.

## Consequências
- **Autenticação:** o `<SUPABASE_URL>` do [[decisoes/ADR-003-AUTENTICACAO|ADR-003]] é a URL acima. Por substituição no texto do ADR: `iss` = `https://vitqnyzuvrvkmnvshcpb.supabase.co/auth/v1` e JWKS em `https://vitqnyzuvrvkmnvshcpb.supabase.co/auth/v1/.well-known/jwks.json`.
- **Condições do ADR-003 que continuam com o PO:** chaves de assinatura assimétricas ativas no projeto novo e confirmação de email ligada em produção.
- **Banco oficial:** nasce do zero no projeto novo, com as migrations em `backend/supabase/migrations/` ([[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04, parte 1]]). As 9 migrations legadas da `supabase/` da raiz nunca são aplicadas nele.
- **Schema oficial:** criado no projeto novo, em paralelo ao legado ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-022 — Convivência com o legado e migração de dados|DATA-DEC-022]]).
- **Identidades do legado:** a AUTH-001 registra que um projeto novo "exige migrar as identidades". Em 2026-10-21, se e como as contas e os dados do legado passariam para o projeto novo dependia do uso real do legado e do inventário.
- **Consulta de inventário** (seção 1.3 de `docs/data/DATA-ARCHITECTURE-REPORT.md`): em 2026-10-21, rodaria no banco do legado só para decidir a migração de dados (DATA-DEC-022). A AUTH-001 dizia que os indícios apontavam `ehbidizpzxhfusfyjgtl` como o projeto em uso pelo legado (inferência).

## Complemento de 2026-10-22
Decisão do PO sobre o legado ([[decisoes/PENDENCIAS#Uso real do app legado — DATA-DEC-022 e 023|PENDENCIAS]]), que muda as consequências acima sem alterar a decisão:
- o app legado **não tem uso real** ("o app antigo não tinha movimento");
- não há migração de dados: o banco oficial no projeto `vitqnyzuvrvkmnvshcpb` começa vazio, e a consulta de inventário fica dispensada ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-022 — Convivência com o legado e migração de dados|DATA-DEC-022]]);
- a correção de segurança do legado não se aplica ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-023 — Correção urgente de segurança no legado|DATA-DEC-023]]);
- pausar ou excluir os projetos antigos `ehbidizpzxhfusfyjgtl` e `fiurvpkieiorngshjric` é decisão operacional do PO, com data **A DEFINIR**. Enquanto estiverem ativos, os riscos S1–S11 continuam existindo neles ([[seguranca/RISCOS-DO-LEGADO]]).

## Fora desta decisão
- Região do projeto (a confirmar pelo PO).
- URL do repositório GitHub novo.
- Configuração do projeto: chaves de assinatura, confirmação de email, SMTP, TTL do token (PO, condições do [[decisoes/ADR-003-AUTENTICACAO|ADR-003]]).
- Integração GitHub ↔ Supabase: tratada na [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04]].
- Destino final dos projetos antigos (pausar ou excluir): decisão operacional do PO, data **A DEFINIR** (complemento de 2026-10-22, acima).

---

Relacionados: [[decisoes/ADR-003-AUTENTICACAO]], [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]], [[decisoes/DEC-09-MODELO-DE-DADOS]], [[seguranca/AUTENTICACAO]], [[tecnico/BANCO-DE-DADOS]], [[tecnico/DIVERGENCIAS-LEGADO]], [[tecnico/LEGADO-ATUAL]], [[decisoes/PENDENCIAS]], [[MOCs/MOC-GOVERNANCA]].

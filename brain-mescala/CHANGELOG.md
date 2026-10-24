# Changelog

## 2026-10-24 — FOUNDATION-002 aplicada (2026-10-23) e encerrada
Pedido 2 do Arquiteto (`arquiteto-mescala`), emitido na ARCHITECT REVIEW final da FOUNDATION-002 (**APPROVED_WITH_NOTES**, 2026-10-23), aplicado pelo agente [[agents/vault-brain]] depois do commit de fechamento `8ee70a6`. Fontes: a revisão final, o contrato `docs/features/FOUNDATION-002.md` com as substituições F-01 a F-18 e as evidências versionadas (`FOUNDATION-002-SAIDAS-PO.md`, `FOUNDATION-002-V1-CONSULTA-UNICA.sql` e `FOUNDATION-002-V1-RESULTADO.csv`). Fato repassado pela sessão principal: **ARQ-F002-17, 18 e 19 foram aceitas pelo PO sem veto em 2026-10-24**; ARQ-F002-14 a 16 continuam em vigor, sem veto. Nenhuma decisão do PO foi mudada; nenhum segredo nem dado da conta em que a CLI da máquina estava logada foi registrado.

**Fatos registrados**
- Aplicação das 9 migrations do commit `028f9ff` no projeto oficial em **2026-10-23**, pelo PO, pelo **SQL Editor**, arquivo por arquivo, como `postgres` (alternativa do A5; A3 e A4 pela CLI não executados). V0 em 2026-10-22.
- QA fase 1b APPROVED, S15/S16 OK e confirmação do delta pelo Arquiteto (APPROVED) em 2026-10-22, antes do `028f9ff`; QA fase 2 APPROVED (V1: 154 checagens OK; V2: PASS=133, FAIL=0, NOT_TESTED=0; bloco B informativo).
- Decisões do fechamento: **ARQ-F002-17** (SQL Editor como método único no projeto oficial; `supabase db push` e `supabase migration up` proibidos lá; evidência mínima E1 a E5; registro de migrations aplicadas na Brain), **ARQ-F002-18** (QI3 resolvido na CHURCH-001 em duas camadas) e **ARQ-F002-19** (evidências versionadas, exceção ao critério 23); **R-05** encerrado por decisão; **R-16** confirmado (o `postgres` contorna a imutabilidade de `audit_log` por I1 e I2; `mescala_app` não); **R-20** novo (event trigger `ensure_rls` da plataforma); A10 dispensado.

**Nota da feature** ([[features/FOUNDATION-002]])
- Frontmatter: `status: encerrada`, `implementacao: aplicada`, `aplicacao`, `commit` (`028f9ff` aplicado; `8ee70a6` fechamento), `revisao-final`.
- "Situação em 2026-10-24" reescrita. **Correção:** a nota dizia "nada commitado" e "VERSÃO 2 ainda não commitada"; a VERSÃO 2 e o DATA TASK RESULT estão no `028f9ff`. Também: delta feito, fase 1b APPROVED e delta confirmado; Organizador e S15/S16 OK; ARQ-F002-14 a 16 em vigor; evidências com os SHA-256.
- Tabela do fluxo: etapas 1 a 8 feitas; a etapa 6 foi pelo SQL Editor, sem `supabase link`.
- Seção nova **"Revisões do Arquiteto"**: (a) pré-aplicação RETURN_TO_DATA_ANALYST, delta D-1 a D-5 e VERSÃO 2; (b) confirmação do delta APPROVED, com S-1 a S-6, o desvio `supabase --version` aceito, o SHA-1 do `config.toml` e a corroboração pela mensagem do `028f9ff` (registro que o critério 24 cita); (c) revisão final APPROVED_WITH_NOTES, com N-1 a N-4, as decisões 1 a 7 e as pendências P-1 a P-5.
- Tabelas: decisões ARQ-F002-01 a 19 (17 a 19 aceitas sem veto em 2026-10-24); riscos R-01 a R-20 (R-05 encerrado, R-16 confirmado, R-20 novo; R-17 sem contingência). Herança com os acréscimos do fechamento (toda feature que muda o banco oficial, primeira feature com V0, FOUNDATION-003, AUTH-002, CHURCH-001, anonimização e o alinhamento da definição do Analista). "Próximo registro": feito.

**Banco de dados** ([[tecnico/BANCO-DE-DADOS]])
- Linha "Migrations" das Decisões: estrutura da Supabase CLI em `backend/supabase/`; aplicação manual pelo PO; no projeto oficial, só pelo SQL Editor (ARQ-F002-17).
- "Estado atual", "Mecanismo" e "Ordem vinculante": aplicado em 2026-10-23.
- Seções novas: **"Aplicação no projeto oficial (ARQ-F002-17)"** (método, o que fazer se um arquivo falhar, proibições, evidência mínima E1 a E5, quem escreve), **"Registro de migrations aplicadas"** (9 linhas: versão, arquivo, feature, data, método, commit, evidência), **"Estado do banco oficial em 2026-10-23"** (8 tabelas vazias; `mescala_app` NOLOGIN, sem papel de login; 4 funções, 39 constraints, 21 índices, 18 policies, 8 triggers; fora da Data API; sem `supabase_migrations`) e **"Linha de base da plataforma"** (PostgreSQL 17.11; UTF8, ICU `en-US`, `en_US.UTF-8`; `pg_c_utf8` e `und-x-icu`; `public.rls_auto_enable` e `ensure_rls`; 6 event triggers de `supabase_admin`; `pg_parameter_acl` só com `log_min_messages`; R-20).
- Convenções: novas **5** (método e evidência, ARQ-F002-17) e **6** (RLS explícito; V1.6, V1.17 e V1.24 como regressão; R-20). "Que o PO pode vetar até o A3" virou "sem veto; em vigor desde a aplicação de 2026-10-23". O título da seção foi mantido, para não quebrar links.
- Pendências: saiu "aplicação pendente"; entrou o registro, só por leitura, do corpo de `public.rls_auto_enable()` no próximo V0 (não é A DEFINIR).

**Decisões e pendências**
- [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]]: "Registro de 2026-10-23" nas consequências da parte 1 (FOUNDATION-002 aplicada pelo SQL Editor; método único no projeto oficial pela ARQ-F002-17, aceita sem veto; `db push` e `migration up` proibidos lá; `migration repair` só por plano do Arquiteto; estrutura e `config.toml` continuam). Os itens 1 a 4 não mudaram.
- [[decisoes/PENDENCIAS]]: resumo da DEC-04 parte 1 cita o SQL Editor como método único; "Aplicação da FOUNDATION-002" e "não foram aplicadas" passaram a "aplicadas em 2026-10-23", com linha nova na tabela de decididas e resolvidas (título da seção ajustado; nenhum link apontava para ele); fonte nova. Nada novo como **A DEFINIR**.

**Segurança**
- [[seguranca/AUDITORIA]]: R-16 confirmado (I1 e I2 contornáveis pelo `postgres`; `mescala_app` não consegue, QD4; o mecanismo do I1 é da plataforma, fora do `pg_parameter_acl`); estrutura aplicada em 2026-10-23; ARQ-F002-18 no item da CHURCH-001.
- [[seguranca/ISOLAMENTO-DE-DADOS]]: as duas ocorrências de "ainda não aplicado" passaram a "aplicado em 2026-10-23"; verificado R1 a R10, N1 a N3 e QT1 a QT4 (23503).

**Fluxo de entrega** ([[features/FLUXO-DE-ENTREGA]])
- No projeto oficial, aplicação só pelo SQL Editor, com a evidência mínima; o commit antes da aplicação passa a ser obrigatório.
- Artefatos: migrations e DATA TASK RESULT no `028f9ff`; evidências em `docs/features/`; consultas `<ID>-V0/V1-CONSULTA-UNICA.sql`; ARCHITECT REVIEW da FOUNDATION-002 na nota da feature.
- Seção nova **"Terceira execução completa: FOUNDATION-002"** (primeira com a etapa 2 e com aplicação). Linha da tabela de features: encerrada. Checagens herdadas da FOUNDATION-002: ARQ-F002-17 e R-20.

**Linhas de status** ("não aplicadas" → "aplicada em 2026-10-23; encerrada (APPROVED_WITH_NOTES)")
- [[00-MOC-MESCALA]], [[02-ARQUITETURA]], [[MOCs/MOC-ARQUITETURA]], [[MOCs/MOC-DADOS]], [[MOCs/MOC-GOVERNANCA]] (todas as ocorrências, inclusive as fontes fora do vault e a DEC-04), [[MOCs/MOC-SEGURANCA]], [[tecnico/BACKEND]], [[modulos/IGREJAS]], [[dados/ENTIDADES]], [[decisoes/DEC-09-MODELO-DE-DADOS]] (DATA-DEC-020), [[features/FOUNDATION-001]] e [[produto/ROADMAP]].
- Também, por estarem defasadas: [[tecnico/CONVENCOES]] (ponteiro para as convenções 5 e 6) e os agentes [[agents/analista-de-dados]] (delta feito; V0 e V1 em consulta única; alinhamento da definição canônica à ARQ-F002-17), [[agents/arquiteto]], [[agents/desenvolvedor-backend]], [[agents/organizador]] e [[agents/qa]].

**Continuam A DEFINIR** (sem mudança): o efeito de uma igreja INATIVO; o fluxo, as transições e o papel pretendido do convite; como a igreja atual chega à API; a DEC-04, parte 2.

## 2026-10-22 — AUTH-001 encerrada; FOUNDATION-002 na VERSÃO 2
Dois pedidos de sincronização do Arquiteto (`arquiteto-mescala`), aceitos no fluxo do PO, aplicados pelo agente [[agents/vault-brain]]. Só foi registrado o que as fontes decidem; o que continua aberto ficou **A DEFINIR**. Nada da FOUNDATION-002 foi marcado como aplicado.

### Pedido 1 — AUTH-001 encerrada (ARCHITECT REVIEW de 2026-10-22, seção 7)
**Nota nova**
- [[features/AUTH-001]]: registro permanente da ARCHITECT REVIEW **APPROVED_WITH_NOTES** (equivale a APPROVED; nenhuma mudança de código pedida; sem rodada de correção). Commit `50eaa1f` (16 arquivos, local). Contrato v2 READY em 2026-10-22. Registra: o que foi entregue (`requireAuthenticatedIdentity` em `domains/auth`, os 5 códigos de erro, as guardas de lint do ADR-003, `jose` 6.2.13, `vitest` 5.0.5 com `vite` 8.3.5 transitivo, 6 arquivos de teste com 251 casos); o histórico do fluxo; a validação (T1 a T7, reexecução do Arquiteto, NOT TESTED da E.7 e O-14); os desvios D-AUTH-01 e D-AUTH-02; as interpretações ARQ-AUTH-01 e ARQ-AUTH-02; a herança para a AUTH-003.

**Limites e riscos** ([[decisoes/PENDENCIAS]])
- **L-06 ENCERRADO** em 2026-10-22, com o título mantido. A condição (a) virou regra permanente: nenhum `.jsx` em `backend/src`.
- Novos: **L-07** (guarda 2b não normaliza o especificador), **RT-AUTH-01** (cache de segmento do Next sobre a busca do JWKS), **RT-AUTH-02** (composição padrão no domínio, dívida estrutural, não é padrão geral) e **ARQ-AUTH-01** (leitura literal das validações de claims; `AUTH_TOKEN_EXPIRED` não atesta os demais claims).
- **RT-FOUND-01:** a AUTH-001 cumpriu a condição (`npm audit --omit=dev` = 0; nenhum advisory além do GHSA-vfj7-8cjw-p6xm).
- Seção da AUTH-001 em PENDENCIAS: IMPLEMENTADA e ENCERRADA, contrato v2 READY, herança para a AUTH-003. Saiu "Nada foi encaminhado".

**Convenções**
- [[tecnico/BACKEND]]: seção nova **"Convenções do código e dos testes (desde a AUTH-001)"** (pastas, arquivos, imports, composição, Vitest, local e nome dos testes, sem rede, proibidos, lint e tipos, regressão do lint). Estado: script `test`, pastas `domains/auth` e `infrastructure/supabase-auth`, verificação de autenticação sem rota protegida, guardas do ADR-002 e do ADR-003, suíte GL, L-06 encerrado. Tabela: Vitest 5.0.5.
- [[tecnico/CONVENCOES]]: link para essa seção.
- **Suíte GL** (`backend/eslint.config.test.ts`) como regressão do lint: [[features/FOUNDATION-001]] (verificação mínima automatizada; B1 e B2 automatizados no nível do módulo por H1 e H2; o 405 real fica para a AUTH-003; L-06 encerrado) e [[features/FLUXO-DE-ENTREGA]] (checagens herdadas, testes, artefatos, segunda execução completa do fluxo).

**Status atualizado** ("passa a READY quando…", "sem autenticação")
- [[seguranca/AUTENTICACAO]], [[tecnico/API]] (com a nota da ARQ-AUTH-01 (a) para a DEC-07), [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES]] (Vitest 5.0.5 e convenções definidos), [[00-MOC-MESCALA]], [[02-ARQUITETURA]], [[MOCs/MOC-ARQUITETURA]], [[MOCs/MOC-GOVERNANCA]], [[MOCs/MOC-SEGURANCA]], [[agents/arquiteto]], [[agents/desenvolvedor-backend]], [[agents/qa]] (L-06 encerrado; checagens do L-07 e do RT-AUTH-01) e [[agents/organizador]].
- [[decisoes/ADR-003-AUTENTICACAO]]: só uma nota de registro ("implementado pela AUTH-001, commit `50eaa1f`"); o texto aceito não mudou.

**Correção de "AUTH-001 fora do git"**
- Fato: `docs/features/AUTH-001.md` está versionado desde o commit `50a1cd6` (v1, 2026-10-22 00:37) e foi atualizado para a v2 no `4039fe0`. A Brain continuava dizendo "fora do git". Corrigido em [[decisoes/PENDENCIAS]] (fontes, seção da AUTH-001, versionamento do legado), [[features/FLUXO-DE-ENTREGA]], [[MOCs/MOC-GOVERNANCA]], [[agents/arquiteto]], [[tecnico/DIVERGENCIAS-LEGADO]] e [[tecnico/LEGADO-ATUAL]]. A entrada de 2026-10-20 deste CHANGELOG ("Hoje só `docs/features/AUTH-001.md` está fora do git") é histórico e não foi editada.

### Pedido 2 — FOUNDATION-002, pedido 1 do Arquiteto (revisão pré-aplicação; decisões, nada aplicado)
**Nota nova**
- [[features/FOUNDATION-002]]: Fase 4 autorizada; contrato VERSÃO 2 READY; 9 migrations escritas e **não aplicadas** (delta da VERSÃO 2 em curso); QA fase 1 APPROVED com condições; revisão pré-aplicação RETURN_TO_DATA_ANALYST, com fase 1b do QA e confirmação do Arquiteto pendentes; trecho do Desenvolvedor feito; Organizador e QA (S15/S16) pendentes; nada commitado; aplicação pelo PO pendente. Inclui a decomposição, o fluxo da feature, ARQ-F002-01 a 16, F002-QA-01, R-01 a R-19 e o que as features seguintes herdam.

**Respostas do PO aos bloqueios B-01 a B-04** (nova seção em [[decisoes/DEC-09-MODELO-DE-DADOS#Respostas do PO aos bloqueios da FOUNDATION-002|DEC-09]]; DATA-DEC-011, 012, 014 e 020, resumo, lacunas e matriz atualizados)
1. **B-01:** schema `mescala`. [[seguranca/ISOLAMENTO-DE-DADOS]], [[tecnico/BANCO-DE-DADOS]], DEC-09 e [[decisoes/PENDENCIAS]].
2. **B-02:** status da Igreja ATIVO, INATIVO. [[05-REGRAS-DE-NEGOCIO]] (HIS-001), [[dados/STATUS]], [[dados/ENTIDADES]], [[modulos/IGREJAS]], DEC-09 e PENDENCIAS. Continua **A DEFINIR** o efeito de uma igreja INATIVO.
3. **B-03** (para a FOUNDATION-004): contam como "ativa" AGUARDANDO_CONFIRMACAO e CONFIRMADA. 05-REGRAS (ESC-005 e pendências), [[dados/STATUS]], [[dados/ENTIDADES]], [[modulos/ESCALAS]], [[fluxos/FLUXO-ESCALAS]], [[MOCs/MOC-ESCALAS]], DEC-09 e PENDENCIAS.
4. **B-04** (escopo): `invitations` nasce com a feature de convites. PENDENCIAS, [[dados/ENTIDADES#Convite]], nota de escopo na MEM-003 e [[dados/STATUS#Convite]]. Continuam **A DEFINIR** o fluxo, as transições e o papel pretendido.
- As lacunas observadas no registro de 2026-10-21 ficaram marcadas como decididas em PENDENCIAS e na DEC-09, com os títulos mantidos.

**Estado, mecanismo e convenções**
- [[tecnico/BANCO-DE-DADOS]]: "Estado atual" (contrato VERSÃO 2, `backend/supabase/` com `config.toml` e 9 migrations não aplicadas); seções novas **"Mecanismo do schema oficial (FOUNDATION-002)"** (schema fora da Data API; `mescala_app` NOLOGIN, sem BYPASSRLS; papel de login na FOUNDATION-003, fora do repositório; contexto só com `set_config(..., true)`; RLS só para isolamento por igreja; R-01), **"Ordem vinculante das migrations (FOUNDATION-002, D9)"** e **"Convenções do schema oficial (FOUNDATION-002, 2026-10-22)"** (texto do Arquiteto: ARQ-F002-16, ARQ-F002-14, ordem dos timestamps e R-19, migration aplicada não é editada). A "Ordem proposta" ficou como histórico, com o destino de cada item (8 a 11 → FOUNDATION-004; 12 → Convites; 14 → incorporada em `grant_app_role_and_rls_policies`).
- [[tecnico/CONVENCOES]]: link para as convenções do schema; ARQ-F002-14 a 16 registradas como convenções técnicas, não regras `<ÁREA>-<NNN>`.
- [[seguranca/ISOLAMENTO-DE-DADOS]]: seção "Mecanismo decidido na FOUNDATION-002"; F002-QA-01 resolvido pela estrutura (ARQ-F002-14), sem requisito de mapeamento de erros para as features.
- [[seguranca/AUDITORIA]]: `audit_log` imutável para DML de qualquer papel; `id` e `occurred_at` do banco (ARQ-F002-15); risco residual R-16 junto da nota de LGPD (R-08).
- [[features/FLUXO-DE-ENTREGA]]: linha da FOUNDATION-002 na tabela; artefatos (a pasta das migrations existe); revisão antes da aplicação; checagens herdadas da FOUNDATION-002.

**Outras notas com o estado da FOUNDATION-002** (diziam "contrato não emitido")
- [[00-MOC-MESCALA]], [[02-ARQUITETURA]], [[MOCs/MOC-ARQUITETURA]], [[MOCs/MOC-GOVERNANCA]], [[MOCs/MOC-SEGURANCA]], [[MOCs/MOC-DADOS]], [[produto/ROADMAP]], [[features/FOUNDATION-001]], [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]] (só nota de registro; a decisão não mudou), [[agents/arquiteto]], [[agents/analista-de-dados]], [[agents/desenvolvedor-backend]], [[agents/qa]] e [[agents/organizador]].

**Não feito (fora deste pedido):** o registro da aplicação da FOUNDATION-002 (data, método, commit) e do estado do banco oficial, que é o pedido 2 do Arquiteto, para depois da ARCHITECT REVIEW final.

## 2026-10-22
Complemento da atualização de 2026-10-21, feito na mesma sessão do agente [[agents/vault-brain]]: o PO tomou mais decisões, repassadas pela sessão principal. Nada além do que o PO decidiu foi tratado como decidido.

**Nota nova**
- [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES]]: **aceita**. Biblioteca oficial de testes: **Vitest**. O Desenvolvedor escreve os testes dos cenários do QA Contract como parte da entrega; o QA revisa e acrescenta casos adversariais (recomendação do Arquiteto na AUTH-001). O Vitest entra como dependência de desenvolvimento do `/backend`, com versão exata, na primeira feature que precisar dele (a AUTH-001). Local dos testes, script `test` e convenções ficam para o Arquiteto definir nesse contrato.

**Micro-decisões das DATA-DEC** (registradas em [[decisoes/DEC-09-MODELO-DE-DADOS#Micro-decisões de 2026-10-22|DEC-09]] e marcadas como decididas em [[decisoes/PENDENCIAS]], sem apagar as perguntas)
1. **Status do convite** (DATA-DEC-011): PENDENTE, ACEITO, EXPIRADO, CANCELADO.
2. **Status de vínculos** (com a igreja e com o ministério), **ministérios e funções** (DATA-DEC-012): ATIVO, INATIVO. A decisão não cita a Igreja: o status da Igreja continua **A DEFINIR**.
3. **A Escala nunca é cancelada:** a máquina de estados passa a ser RASCUNHO, PUBLICADA, CONCLUIDA. O status **CANCELADA**, que a Brain previa em [[dados/STATUS]] até 2026-10-22, foi removido pelo PO, e a micro-decisão da DATA-DEC-016 (c) deixou de existir. Cancelar uma Programação: nada decidido, **A DEFINIR**.
4. **Impedimento** (DATA-DEC-017): só o próprio membro registra o dele; o líder não registra por um membro e, se não o quiser participando, o exclui. O que é "excluir" (da escala ou do ministério) e o efeito no histórico ficam para o contrato da feature de escalas, respeitando a regra de que nada com histórico é apagado.
5. **App legado sem uso real:** a correção do DATA-DEC-023 não se aplica; o DATA-DEC-022 fica sem migração de dados (o banco oficial começa vazio) e a consulta de inventário fica dispensada. Pausar ou excluir os projetos antigos é decisão operacional do PO, com data **A DEFINIR**. Os riscos S1–S11 continuam nesses projetos enquanto estiverem ativos.

**Regra de negócio nova** ([[05-REGRAS-DE-NEGOCIO]])
- [[05-REGRAS-DE-NEGOCIO#DIS-001 — Impedimento é registrado só pelo próprio membro|DIS-001]]: impedimento registrado só pelo próprio membro.

**AUTH-001**
- Sem bloqueios de decisão. Passa a READY quando o Arquiteto atualizar o contrato com o Vitest. Atualizado em [[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|PENDENCIAS]], [[features/FLUXO-DE-ENTREGA]], [[seguranca/AUTENTICACAO]], [[tecnico/API]], [[tecnico/BACKEND]], [[decisoes/ADR-003-AUTENTICACAO]] (só as notas de registro) e nos MOCs.
- [[features/FOUNDATION-001]]: B1–B3 deixam de ficar NOT TESTED por falta de biblioteca; viram teste automatizado quando o lint for alterado.

**Notas alteradas pelo complemento**
- [[dados/STATUS]] (Escala sem CANCELADA; status de convite, vínculos, ministérios e funções), [[modulos/ESCALAS]], [[modulos/DISPONIBILIDADE]], [[modulos/MEMBROS]], [[modulos/EQUIPES]], [[modulos/FUNCOES]], [[modulos/IGREJAS]], [[modulos/PROGRAMACOES]], [[fluxos/FLUXO-ESCALAS]], [[fluxos/FLUXO-MEMBROS]], [[fluxos/FLUXO-EQUIPES]], [[fluxos/FLUXO-PROGRAMACOES]], [[dados/ENTIDADES]], [[05-REGRAS-DE-NEGOCIO]] (HIS-001, MEM-003, ESC-003).
- [[seguranca/RISCOS-DO-LEGADO]]: a correção não se aplica; os riscos continuam nos projetos antigos enquanto estiverem ativos. [[seguranca/AUTORIZACAO]], [[seguranca/ISOLAMENTO-DE-DADOS]] e [[seguranca/AUDITORIA]] também citam o legado sem uso real.
- [[tecnico/DIVERGENCIAS-LEGADO]], [[tecnico/LEGADO-ATUAL]], [[tecnico/BANCO-DE-DADOS]] (banco oficial começa vazio; ordem proposta das migrations marcada) e [[tecnico/FRONTEND]].
- [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]: seção "Complemento de 2026-10-22"; a decisão não mudou.
- Agentes [[agents/qa]], [[agents/desenvolvedor-backend]], [[agents/arquiteto]] e [[agents/analista-de-dados]]: seção "Fluxo e estado".

## 2026-10-21
O PO tomou as decisões que o vault registrava como pendentes (agente [[agents/vault-brain]]). As decisões foram gravadas como aceitas e aplicadas às notas normativas, sempre com a decisão de origem citada. Não foi decidido nada além do que está nas fontes: `docs/data/DATA-ARCHITECTURE-REPORT.md` (seções 13 a 15) e `docs/features/AUTH-001.md` (texto proposto do ADR-003 e seção 9).

**Notas novas**
- [[decisoes/ADR-003-AUTENTICACAO]]: **aceito** (resolve a DEC-03). Texto proposto pela AUTH-001, mantido; mudaram só o status e a seção de condições (DEC-05 cumprida; chaves assimétricas e confirmação de email continuam com o PO). Notas de registro do vault-brain separadas no fim.
- [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]: projeto Supabase oficial = projeto **novo** `vitqnyzuvrvkmnvshcpb` (`https://vitqnyzuvrvkmnvshcpb.supabase.co`; região a confirmar pelo PO). Motivo informado pelo PO: limite de projetos do plano gratuito; nova conta no GitHub, repositório `mescala` (URL ainda não informada). Os projetos `ehbidizpzxhfusfyjgtl` e `fiurvpkieiorngshjric` ficam só para o app legado.
- [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]]: **parte 1 aceita** (migrations oficiais em `backend/supabase/migrations/`, Supabase CLI, `backend/supabase/config.toml` ligado ao projeto novo; as 9 migrations legadas nunca rodam no banco novo; aplicação manual pelo PO; integração GitHub ↔ Supabase não conectada por enquanto). **Parte 2 aberta** (driver, query builder ou ORM); a DATA-DEC-020 já implica conexão direta ao Postgres com papel sem BYPASSRLS.
- [[decisoes/DEC-09-MODELO-DE-DADOS]]: aceite dos **DATA-DEC-001 a 023** na opção recomendada, um por um, com o texto do relatório, as respostas sugeridas (DATA-DEC-016 (a)–(e); sub-decisão da DATA-DEC-022), as micro-decisões que ficaram A DEFINIR, lacunas observadas e a matriz depois do aceite. Recebeu o número 09 porque DEC-06 e DEC-07 estão reservadas pela AUTH-001 e a DEC-08 já existe.

**Vocabulário (DATA-DEC-001 A)**
- O termo canônico passa a ser **Ministério** (`ministry`). As notas trocaram "Equipe" por "Ministério" onde o termo designa o conceito. [[modulos/EQUIPES]] e [[fluxos/FLUXO-EQUIPES]] **não foram renomeados**: o título mudou para "Ministérios (antes: Equipes)" e "Fluxo — Ministérios (antes: Equipes)", com `aliases`. Descrições do legado, a transcrição do canvas e o texto de decisões aceitas antigas (ADR-001, ADR-002) não mudaram. O evento `equipe.criada` virou `ministerio.criado`.

**Regras de negócio novas** ([[05-REGRAS-DE-NEGOCIO]], todas citando a DEC-09)
- IGR-001 (um único OWNER por igreja), MEM-001 (membro é usuário com conta), MEM-002 (um vínculo por usuário em cada ministério), MEM-003 (quem convida quem: regra legada que a DATA-DEC-011 manda registrar), HIS-001 (nada com histórico é apagado) e ESC-005 (uma alocação ativa por pessoa na escala). ESC-002 só trocou "equipe" por "ministério"; ESC-003 e ESC-004 ganharam referências às decisões. Nenhuma regra anterior mudou de sentido.

**Decisões aplicadas às notas normativas**
- Vocabulário e termos equivalentes: [[03-DOMINIO]] (nova seção "Termos equivalentes"), [[01-VISAO-GERAL]], [[produto/JORNADAS]], [[produto/PERSONAS]], [[produto/ROADMAP]].
- Papéis e vínculos (DATA-DEC-005 a 010): [[04-USUARIOS-E-PERMISSOES]] (igreja: OWNER, ADMIN, MEMBER; ministério: LEADER, MEMBER; "líder" na igreja é derivado; ANCIÃO é cargo), [[modulos/MEMBROS]], [[fluxos/FLUXO-MEMBROS]], [[fluxos/FLUXO-CADASTRO-IGREJA]], [[dados/ENTIDADES]], [[dados/RELACIONAMENTOS]] (cardinalidades decididas).
- Convite, inativação e atributos (DATA-DEC-011 a 013): [[dados/ENTIDADES]] (novas seções Convite, Vínculo com a igreja, Vínculo com o ministério e Registro de auditoria), [[modulos/IGREJAS]], [[modulos/EQUIPES]], [[modulos/FUNCOES]].
- Programação (DATA-DEC-003 e 004): [[modulos/PROGRAMACOES]], [[fluxos/FLUXO-PROGRAMACOES]], [[produto/CONCEITOS-DO-CANVAS]] (Culto, Agenda, ADMIN (ANCIÃO) e Líder de Ministério decididos; Cronograma, Reunião, Comissão e Pauta continuam A DEFINIR; transcrição literal intacta).
- Escalas (DATA-DEC-014 a 017): [[modulos/ESCALAS]], [[dados/STATUS]], [[fluxos/FLUXO-ESCALAS]], [[fluxos/FLUXO-CONFIRMACAO]], [[fluxos/FLUXO-SUBSTITUICAO]], [[modulos/DISPONIBILIDADE]], [[modulos/NOTIFICACOES]].
- Infraestrutura (DATA-DEC-018 a 022): [[tecnico/BANCO-DE-DADOS]] (nova seção "Ordem proposta das migrations"), [[tecnico/BACKEND]], [[tecnico/CONVENCOES]], [[seguranca/ISOLAMENTO-DE-DADOS]], [[seguranca/AUTORIZACAO]], [[seguranca/AUDITORIA]].
- DATA-DEC-023: aceita **condicionada** ao uso real do app legado ([[seguranca/RISCOS-DO-LEGADO]]).
- Autenticação: [[seguranca/AUTENTICACAO]] (provedor e mecanismo decididos pelo ADR-003; condições operacionais pendentes), [[tecnico/API]], [[tecnico/FRONTEND]].

**Pendências** ([[decisoes/PENDENCIAS]])
- Marcadas como **decididas em 2026-10-21**, com os títulos-âncora mantidos e as perguntas preservadas como histórico: DEC-03, DEC-05, DEC-04 parte 1 e DATA-DEC-001 a 023. Novas seções: "Decididas", "Continuam abertas", "Condições operacionais do ADR-003", "Micro-decisões deixadas em aberto pelo aceite de 2026-10-21" e "Lacunas observadas no registro de 2026-10-21".
- AUTH-001: BLOCKED só pela DEC-02 (até o complemento de 2026-10-22, acima).
- Próxima feature prevista: **FOUNDATION-002 — Fundação de Persistência**, contrato ainda não emitido ([[features/FLUXO-DE-ENTREGA]], [[features/FOUNDATION-001]], [[produto/ROADMAP]]).
- **Cache do Supabase CLI no git:** resolvido no repositório. O commit `a034046` tirou `supabase/.temp/` do git (conferido com `git log`). Atualizado também em [[tecnico/LEGADO-ATUAL]].

**Divergências** ([[tecnico/DIVERGENCIAS-LEGADO]])
- D4 resolvida quanto ao backend oficial (projeto novo); o legado continua com os projetos antigos. A tabela Brain × banco atual passa a mostrar o que a Brain determina depois das decisões, com link para a decisão de cada tema.

**MOCs e governança**
- [[00-MOC-MESCALA]] (nova seção de decisões), [[MOCs/MOC-GOVERNANCA]], [[MOCs/MOC-ARQUITETURA]], [[MOCs/MOC-DADOS]], [[MOCs/MOC-DOMINIO]], [[MOCs/MOC-ESCALAS]], [[MOCs/MOC-SEGURANCA]] e [[MOCs/MOC-USUARIOS]]: novas notas no grafo.
- [[02-ARQUITETURA]], [[00-README]], [[features/FLUXO-DE-ENTREGA]] (local das migrations; FOUNDATION-002), agentes [[agents/analista-de-dados]], [[agents/arquiteto]], [[agents/desenvolvedor-backend]] e [[agents/organizador]].
- [[decisoes/ADR-001-ESTRUTURA-INICIAL]], [[decisoes/ADR-002-BACKEND-OFICIAL]], [[decisoes/DEC-01-ROTA-TECNICA-HEALTH]] e [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]]: só uma linha de "Relacionados" no fim; conteúdo intacto.

## 2026-10-20
Sincronização da Brain com o encerramento da FOUNDATION-001 (commit `7f26d30`) e com o contrato da AUTH-001, que aguarda aprovação do PO (agente [[agents/vault-brain]]). As duas ARCHITECT REVIEW da FOUNDATION-001 não foram gravadas em arquivo: esta entrada e a nota [[features/FOUNDATION-001]] são o registro permanente delas. **Nada da AUTH-001 foi aprovado:** não há ADR-003, e DEC-02, DEC-03, DEC-04 e as DATA-DEC continuam abertas.

**Nota nova**
- [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]]: interpretação formal ARQ-FOUND-02, aceita em 2026-10-19. A lista de dependências proibidas vale para o que o `backend/package.json` declara ou força via `overrides` e para o uso explícito pelo Mescala; transitivo trazido só por pacote aprovado não é violação, mas também não é aprovação. Inclui o risco aceito RT-FOUND-02 (dependência fantasma). Recebeu o número 08 porque DEC-05 a DEC-07 estão reservadas pela AUTH-001.

**FOUNDATION-001 encerrada**
- [[features/FOUNDATION-001]]: de "READY, não implementada" para **implementada e encerrada** (ARCHITECT REVIEW APPROVED em 2026-10-19, na rodada de correção 1; commit `7f26d30`, com 8 arquivos). O QA passou de "previsto" para "realizado"; B1–B3 automatizados seguem NOT TESTED até a DEC-02.
- A nota registra o histórico do fluxo (rodada 0 CHANGES_REQUIRED com C1 e C2; PO inclui o L-03; correção em 2 arquivos; revalidação R1–R6; rodada 1 APPROVED), o que foi entregue, D-01 a D-03, RT-FOUND-01 a 03, L-01 a L-06 (L-03 encerrado), O-01, ARQ-FOUND-01 e 02 e a verificação mínima de regressão do lint.

**Pendências** ([[decisoes/PENDENCIAS]])
- Ordem do ADR-002: cumprida quanto à FOUNDATION-001. A fundação de persistência continua dependendo da DEC-04 e das decisões de dados.
- Nova seção da AUTH-001: contrato emitido em 2026-10-06, BLOCKED e aguardando aprovação do PO. Propostas com número reservado e nada decidido: DEC-05 (projeto Supabase oficial), DEC-06 (provisionamento do usuário do Mescala) e DEC-07 (padrão HTTP de erros e convenções de API).
- Em "Outras pendências registradas": a dívida RT-FOUND-01 e o limite L-06, com as condições, e a observação sobre `supabase/.temp/` versionado, para o PO decidir.
- DEC-02 e DEC-03 ganharam só referências cruzadas (AUTH-001; a verificação do lint como futuro B3). As três decisões técnicas continuam abertas.

**Correção de versionamento (divergência D5, apontada na análise da AUTH-001)**
- [[tecnico/LEGADO-ATUAL]], [[decisoes/PENDENCIAS]], [[tecnico/DIVERGENCIAS-LEGADO]] e [[tecnico/BANCO-DE-DADOS]] diziam que as 3 migrations de julho, `aceitar-convite-cadastro`, `src/lib/profiles.ts`, `brain-mescala/`, `docs/`, `.claude/` e `daily/` estavam fora do git. O commit `0394893` (2026-10-06 20:13) já os tinha versionado. Hoje só `docs/features/AUTH-001.md` está fora do git, além do que o `.gitignore` ignora.
- [[tecnico/DIVERGENCIAS-LEGADO]]: nova seção com D4 (projeto Supabase: `.env` e CLI × `config.toml`) e D5.

**Notas que diziam "não implementada", "`/backend` não existe" ou equivalente** (atualizadas para o estado real, com link para a FOUNDATION-001)
- [[00-MOC-MESCALA]], [[MOCs/MOC-GOVERNANCA]], [[02-ARQUITETURA]], [[tecnico/BACKEND]], [[tecnico/API]] (a rota de saúde existe), [[produto/ROADMAP]], [[tecnico/LEGADO-ATUAL]], [[seguranca/RISCOS-DO-LEGADO]], [[agents/desenvolvedor-backend]], [[agents/organizador]], [[agents/arquiteto]] e [[agents/qa]].

**Outras notas alteradas**
- [[features/FLUXO-DE-ENTREGA]]: primeira execução completa do fluxo, com a rodada de correção (sem Organizador, porque nada foi criado nem movido); checagens herdadas da FOUNDATION-001 para toda feature; AUTH-001 na tabela de features.
- MOCs de área: [[MOCs/MOC-ARQUITETURA]] (DEC-08, AUTH-001, DEC-07, RT-FOUND-01, L-06), [[MOCs/MOC-SEGURANCA]] (AUTH-001, DEC-05, cache do CLI), [[MOCs/MOC-USUARIOS]] (DEC-06) e [[MOCs/MOC-DADOS]] (DEC-05).
- [[seguranca/AUTENTICACAO]]: a AUTH-001 como proposta aguardando aprovação; o provider continua **A DEFINIR**.
- [[decisoes/ADR-002-BACKEND-OFICIAL]]: só uma linha de "Relacionados" no fim (DEC-08); conteúdo intacto.

## 2026-10-06
Integração do estado atual do projeto ao grafo (agente [[agents/vault-brain]]). Nada foi decidido nesta atualização; o que está em aberto ficou como pendente ou **A DEFINIR**.

**Notas novas**
- [[decisoes/PENDENCIAS]]: índice das decisões pendentes DEC-02 (testes), DEC-03 (autenticação), DEC-04 (migrations e acesso ao banco) e DATA-DEC-001 a 023 do relatório do Analista de Dados (`docs/data/DATA-ARCHITECTURE-REPORT.md`), com o que cada uma bloqueia e as notas afetadas.
- [[features/FOUNDATION-001]]: registro da primeira feature (contrato READY, não implementada; `/backend` não existe).
- [[features/FLUXO-DE-ENTREGA]]: fluxo Arquiteto → Analista de Dados → Desenvolvedor → Organizador → QA → Arquiteto, com entradas, saídas e sinais de parada.
- [[tecnico/LEGADO-ATUAL]]: descrição factual e não normativa do app em uso (frontend Vite + React gravando direto no Supabase, só RLS, Edge Functions de convite).
- [[tecnico/DIVERGENCIAS-LEGADO]]: divergências D1–D3 da FOUNDATION-001 e seção 9 do relatório de dados.
- [[seguranca/RISCOS-DO-LEGADO]]: achados S1–S11 com a severidade do relatório; leitura estática, não testados contra o banco.
- [[produto/CONCEITOS-DO-CANVAS]]: Culto, Agenda, Cronograma, Reunião, Comissão, "ADMIN (ANCIÃO)" e "Líder de Ministério", citados no [[Fluxograma.canvas]] sem definição (A DEFINIR), com transcrição literal do canvas.
- [[MOCs/MOC-GOVERNANCA]]: decisões, pendências, features, agentes e estado atual.

**Notas alteradas** (só acréscimos; nenhuma regra mudou)
- [[00-MOC-MESCALA]]: seções "Estado atual do sistema", "Pendências" e "Features"; links para o MOC de governança, os conceitos do canvas e o canvas.
- MOCs de área ([[MOCs/MOC-ARQUITETURA]], [[MOCs/MOC-DADOS]], [[MOCs/MOC-DOMINIO]], [[MOCs/MOC-ESCALAS]], [[MOCs/MOC-SEGURANCA]], [[MOCs/MOC-USUARIOS]]): seções de estado atual e pendências. O MOC de domínio passa a listar [[modulos/NOTIFICACOES]] e [[modulos/RELATORIOS]], que não estavam em nenhum MOC.
- [[00-README]], [[01-VISAO-GERAL]], [[02-ARQUITETURA]], [[03-DOMINIO]], [[04-USUARIOS-E-PERMISSOES]], [[05-REGRAS-DE-NEGOCIO]]: links para pendências, legado e divergências.
- Módulos, fluxos, dados, segurança e técnico: seções "Pendências" e "Legado" ligadas às decisões e às notas novas.
- [[produto/ROADMAP]] e [[produto/PERSONAS]]: pré-requisitos do ADR-002 e perfis citados no canvas.
- Agentes ([[agents/arquiteto]], [[agents/analista-de-dados]], [[agents/desenvolvedor-backend]], [[agents/organizador]], [[agents/qa]]): seção "Fluxo e estado". Conferidos com `.claude/agents/*.md`: batem com as definições.
- [[agents/vault-brain]]: redação alinhada à definição atual ("antes de alterar o vault", "criar ou atualizar MOCs", "abrir como cofre").
- [[decisoes/ADR-001-ESTRUTURA-INICIAL]], [[decisoes/ADR-002-BACKEND-OFICIAL]] e [[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]: só uma linha de "Relacionados" no fim; conteúdo intacto.
- [[tecnico/CONVENCOES]]: onde ficam pendências, Feature Contracts e a nota do legado.

**Vocabulário:** "Equipe" foi mantido em todas as notas. A divergência com "Ministério" (ADR-002, canvas, Data Task do PO) está sinalizada e aguarda a DATA-DEC-001.

**Anterior no mesmo dia**
- Agente [[agents/qa]] substituído pela versão "QA Backend Sênior": valida em sete dimensões, emite QA RESULT (`APPROVED`, `CHANGES_REQUIRED`, `BLOCKED`) e pode escrever arquivos de teste depois que a biblioteca oficial de testes for decidida (DEC-02).

## 2026-10-04
- Adicionado agente Arquiteto Sênior do Backend ([[agents/arquiteto]]), com definição executável em `.claude/agents/arquiteto-mescala.md`.
- Agente vinculado ao [[00-MOC-MESCALA]] (Governança) e ao [[00-README]].
- Adicionado agente Analista de Dados Sênior ([[agents/analista-de-dados]]), com definição executável em `.claude/agents/analista-dados-mescala.md`. Dono das migrations e das policies de RLS; cria migrations sem aplicá-las.
- Adicionado agente Desenvolvedor Backend Sênior ([[agents/desenvolvedor-backend]]), com definição executável em `.claude/agents/desenvolvedor-backend-mescala.md`. Implementa só a feature contratada; não cria migrations, não faz UI, não publica.
- Registrado [[decisoes/ADR-002-BACKEND-OFICIAL]] (aceito): backend oficial em Next.js + TypeScript + Node.js em `/backend`; Edge Functions deixam de ser arquitetura principal; `FOUNDATION-001` antes de qualquer feature.
- [[tecnico/BACKEND]], [[tecnico/BANCO-DE-DADOS]], [[02-ARQUITETURA]] e [[MOCs/MOC-ARQUITETURA]] passam a apontar para o ADR-002.
- Agentes [[agents/analista-de-dados]] e [[agents/desenvolvedor-backend]] alinhados ao ADR-002.
- Agente [[agents/arquiteto]] recebeu a seção "Arquitetura oficial do backend" (ADR-002 vinculante).
- Adicionado agente Organizador de Arquitetura do Repositório ([[agents/organizador]]), com definição executável em `.claude/agents/organizador-mescala.md`. Organiza só a estrutura física de `/backend`, sem mudar comportamento.
- Adicionado agente QA e Validação Arquitetural ([[agents/qa]]), com definição executável em `.claude/agents/qa-mescala.md`. Somente leitura; fecha o fluxo Arquiteto → Analista → Desenvolvedor → Organizador → QA.
- Registrada [[decisoes/DEC-01-ROTA-TECNICA-HEALTH]] (aceita): `GET /api/health` como exceção técnica controlada da FOUNDATION-001. [[tecnico/API]] continua **A DEFINIR** e passa a citar a exceção.

## 2026-10-02
- Vault reconstruído como grafo conectado.
- Adicionados MOCs.
- Adicionados wikilinks entre módulos, fluxos, regras, dados, segurança e técnico.
- Adicionado frontmatter estrutural.
- Atualizado agente `/vault-brain` para exigir conexões nativas do Obsidian.

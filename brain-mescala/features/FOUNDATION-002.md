---
tipo: feature
id: FOUNDATION-002
dominio: foundation
status: em-andamento
implementacao: migrations-escritas-nao-aplicadas
contrato: docs/features/FOUNDATION-002.md
contrato-versao: 2
contrato-status: READY
emitido: 2026-10-22
fase-4-autorizada: 2026-10-22
aplicacao: pendente
commit: nenhum
relacionado:
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]]"
  - "[[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]"
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
  - "[[tecnico/BANCO-DE-DADOS]]"
  - "[[seguranca/ISOLAMENTO-DE-DADOS]]"
  - "[[seguranca/AUDITORIA]]"
  - "[[features/FLUXO-DE-ENTREGA]]"
  - "[[features/FOUNDATION-001]]"
  - "[[features/AUTH-001]]"
  - "[[decisoes/PENDENCIAS]]"
atualizado: 2026-10-22
---
# FOUNDATION-002 — Fundação de Persistência

## Situação em 2026-10-22
- **Status:** **EM ANDAMENTO.** Nada foi aplicado no banco oficial e nada foi commitado.
- **Contrato (fora do vault):** `docs/features/FOUNDATION-002.md`, emitido pelo [[agents/arquiteto|Arquiteto]] em 2026-10-22, a pedido do PO. Contém ARCHITECT ANALYSIS, Feature Contract, Data Task, Backend Implementation Task, Organization Task, QA Contract, dependências e bloqueios. O arquivo está versionado desde o commit `4039fe0`, com a VERSÃO 1; a VERSÃO 2 ainda não foi commitada.
  - **VERSÃO 1 (2026-10-22):** STATUS BLOCKED, por B-01, B-02 e pela autorização da Fase 4.
  - No mesmo dia, o PO respondeu B-01 a B-04, aceitando as recomendações do Arquiteto ([[decisoes/DEC-09-MODELO-DE-DADOS#Respostas do PO aos bloqueios da FOUNDATION-002|DEC-09]]), **autorizou a Fase 4** e aceitou, sem veto, as decisões técnicas ARQ-F002-01 a 13.
  - **VERSÃO 2 (2026-10-22), STATUS READY**, emitida na revisão pré-aplicação (ARQ-F002-11): marcadores trocados pelas respostas do PO; F002-QA-01 decidido (ARQ-F002-14); INSERT por coluna em `audit_log` (ARQ-F002-15); DIV-01 decidida (ARQ-F002-16); critério 11 lido como DML direto (R-16); riscos R-16 a R-19; critérios 2, 6, 8, 9, 11, 13 e 22 a 24 ajustados; Anexo A e QA Contract ajustados. **ARQ-F002-14 a 16 são decisões técnicas: o PO pode vetá-las até o A3.**
- **Migrations:** **9 arquivos escritos** pelo [[agents/analista-de-dados|Analista de Dados]] em `backend/supabase/migrations/`, **não aplicados** ([[tecnico/BANCO-DE-DADOS#Ordem vinculante das migrations (FOUNDATION-002, D9)|ordem vinculante]]). O Analista está aplicando agora, nos próprios arquivos, o delta da VERSÃO 2 (ARQ-F002-14 e 15); editar é permitido porque nada foi aplicado. Relatório do Analista: `docs/features/FOUNDATION-002-DATA-TASK-RESULT.md` (não commitado), sem DATA MODEL BLOCKED e com a divergência técnica DIV-01, decidida pelo Arquiteto (ARQ-F002-16).
- **QA fase 1** (revisão estática): **APPROVED com condições**.
- **Revisão pré-aplicação do Arquiteto:** **RETURN_TO_DATA_ANALYST** (decisão CHANGES_REQUIRED). Pediu um delta curto (3 arquivos com mudança de SQL e 2 só de comentário), que corrige um defeito da especificação: o D5 contradizia a seção 17 do contrato e a SEC-001 (F002-QA-01). **Pendentes:** a fase 1b do QA (revisão estática do delta) e a confirmação do delta pelo Arquiteto. Com as duas, o veredito passa a READY_FOR_APPLICATION_AFTER_CONDITIONS, com as pré-condições do Anexo A.
- **Trecho do Desenvolvedor** (seção 8 do contrato): **feito**, depois do encerramento da [[features/AUTH-001]]. `backend/supabase/config.toml`, cujo único conteúdo funcional é `project_id = "vitqnyzuvrvkmnvshcpb"`, e `backend/.gitignore` com `supabase/.temp/` e `supabase/.branches/`.
- **Organizador** (Organization Task) e **QA S15/S16** (estrutura de `backend/supabase/` e S16 executável): **pendentes**.
- **Commit:** nenhum. Recomendado antes do A3: commit autorizado pelo PO com as 9 migrations, `backend/supabase/config.toml`, `backend/.gitignore` e os dois documentos da feature, para o estado aplicado corresponder a um commit identificado.
- **Aplicação pelo PO:** **pendente** (Anexo A do contrato).
- **Base de comparação** ([[features/AUTH-001#ARQ-AUTH-02 — Escopo dos critérios 1, 18 e 19 diante da FOUNDATION-002 em paralelo|ARQ-AUTH-02]]): o critério 22 e o S16 desta feature são medidos tomando o commit da AUTH-001 (`50eaa1f`) como base, não o `4039fe0`.

## Por que existe
O [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] exige a fundação oficial de persistência antes das features que dependem do banco. Não existe banco oficial: nenhuma feature que grava dados pode começar (AUTH-002, CHURCH-001 e as demais). A fundação técnica ([[features/FOUNDATION-001]]) está encerrada desde 2026-10-19.

## Escopo e decomposição (ARQ-F002-01)
O modelo da [[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]] virou quatro entregas, e não uma só:

| Feature | Escopo | Bloqueio próprio |
|---|---|---|
| **FOUNDATION-002** (esta) | Schema `mescala`, papel `mescala_app`, mecanismo de contexto, `updated_at`; `users`, `churches`, `church_memberships`, `ministries`, `ministry_memberships`, `ministry_functions`, `ministry_member_functions`; `audit_log`; RLS de isolamento dessas tabelas; estrutura `backend/supabase/` | B-01 e B-02 (respondidos em 2026-10-22) |
| FOUNDATION-003 (proposta; ID a confirmar) | Cliente de banco do backend: [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco\|DEC-04, parte 2]], papel de login, conexão, transação com contexto, banco de teste | DEC-04, parte 2 |
| FOUNDATION-004 (proposta; ID a confirmar) | `programs`, `program_ministries`, `schedules`, `allocations` e a tabela de impedimentos | B-03 (respondido em 2026-10-22) |
| Convites (feature própria; ID a definir) | `invitations`, junto com o fluxo do convite | B-04 (escopo respondido; fluxo **A DEFINIR**) |

Motivos registrados no contrato: features pequenas e completas; bloqueios isolados; consumidores que chegam em sequência (cliente de banco → AUTH-002 → AUTH-003 → CHURCH-001 → CHURCH-002); a ordem 1–14 da seção 15 do relatório preservada.

**O que a FOUNDATION-002 cria** no projeto oficial `vitqnyzuvrvkmnvshcpb`: o schema `mescala`, fora da Data API; o papel de grupo `mescala_app`; 4 funções (duas de contexto, a de `updated_at` e a de imutabilidade de `audit_log`); 8 tabelas com RLS habilitado; FKs compostas, unicidades, CHECKs e índices; grants por coluna; policies de isolamento; a imutabilidade de `audit_log`. Também a estrutura `backend/supabase/` da CLI. Não cria regra de negócio nova, rota nem código TypeScript.

## Fora do escopo
Cliente de banco, conexão, papel de login e variáveis de ambiente (FOUNDATION-003); atributos e policies de `users` e a resolução `sub` → `users.id` (AUTH-002/003, DEC-06); status ou revogação do usuário (B8, AUTH-003); `churches.address` e a criação da igreja e do OWNER (CHURCH-001); policies por usuário e o contexto de igreja da requisição (CHURCH-002); programação, escala, alocação e impedimentos (FOUNDATION-004); convites; seeds e testes automatizados de banco; Edge Functions; configuração do projeto remoto; qualquer código TypeScript, rota ou UI.

## Mecanismo
Resumo; o detalhe está em [[tecnico/BANCO-DE-DADOS#Mecanismo do schema oficial (FOUNDATION-002)|tecnico/BANCO-DE-DADOS]], [[seguranca/ISOLAMENTO-DE-DADOS#Mecanismo decidido na FOUNDATION-002|seguranca/ISOLAMENTO-DE-DADOS]] e [[seguranca/AUDITORIA#Estrutura decidida na FOUNDATION-002|seguranca/AUDITORIA]].
- Schema `mescala` fora da Data API; nenhum acesso para `PUBLIC`, `anon`, `authenticated`, `service_role` e `authenticator`.
- `mescala_app` NOLOGIN, sem BYPASSRLS; o papel de login vem na FOUNDATION-003, fora do repositório.
- Contexto `mescala.current_user_id` (= `users.id`) e `mescala.current_church_id`, só com `set_config(..., true)`.
- O RLS faz só isolamento por igreja; papel + escopo ficam no backend.
- R-01: a CHURCH-002 valida o vínculo antes de definir o contexto.
- `audit_log` imutável para DML; `id` e `occurred_at` do banco.

## Fluxo desta feature (ARQ-F002-11)
O contrato ajusta o [[features/FLUXO-DE-ENTREGA]], porque migration aplicada não pode ser editada:

| # | Etapa | Situação em 2026-10-22 |
|---|---|---|
| 1 | Analista de Dados: 9 migrations e DATA TASK RESULT, sem aplicar | feito; delta da VERSÃO 2 em curso |
| 2 | Desenvolvedor: `backend/supabase/config.toml` e `backend/.gitignore` (só depois do encerramento da AUTH-001) | feito |
| 3 | Organizador: estrutura | pendente |
| 4 | QA, fase 1: revisão estática (e fase 1b, do delta) | fase 1 APPROVED com condições; fase 1b pendente |
| 5 | Arquiteto, revisão pré-aplicação | RETURN_TO_DATA_ANALYST; confirmação do delta pendente |
| 6 | PO: vincula a CLI dentro de `/backend`, aplica as migrations e roda a verificação (Anexo A) | pendente |
| 7 | QA, fase 2: avalia as saídas do PO | pendente |
| 8 | Arquiteto: ARCHITECT REVIEW final | pendente |

Pré-condições do A3 (Anexo A): VERSÃO 2 registrada; delta feito, QA fase 1b APPROVED e delta confirmado pelo Arquiteto; DATA TASK RESULT com o script integrado (V0 com V0.4, V1 até V1.24, V2 num só bloco e o bloco B do QA); AUTH-001 encerrada (cumprida); trecho do Desenvolvedor feito (cumprida); Organizador sem pendência; QA com S15 e S16 executável OK; recomendado, o commit autorizado pelo PO. Proibidos no projeto oficial, entre outros: `supabase db reset --linked`, `supabase config push`, qualquer comando da CLI na raiz do repositório e conectar a integração GitHub ↔ Supabase.

## Respostas do PO aos bloqueios (2026-10-22)
| Bloqueio | Decisão |
|---|---|
| B-01 — nome do schema | `mescala` |
| B-02 — status da Igreja | ATIVO, INATIVO. O efeito de uma igreja INATIVO continua **A DEFINIR** |
| B-03 — alocação "ativa" (para a FOUNDATION-004) | AGUARDANDO_CONFIRMACAO e CONFIRMADA |
| B-04 — convites | Escopo: `invitations` nasce com a feature de convites. Fluxo, transições e papel pretendido continuam **A DEFINIR** |

Registro normativo: [[decisoes/DEC-09-MODELO-DE-DADOS#Respostas do PO aos bloqueios da FOUNDATION-002|DEC-09]].

## Decisões do Arquiteto no contrato (ARQ-F002-01 a 16)
Decisões técnicas, dentro da competência do Arquiteto. ARQ-F002-01 a 13 foram aceitas pelo PO sem veto; ARQ-F002-14 a 16 (VERSÃO 2) podem ser vetadas até o A3.

| ID | Resumo |
|---|---|
| ARQ-F002-01 | Decomposição em FOUNDATION-002, 003, 004 e Convites |
| ARQ-F002-02 | Atributos cuja obrigatoriedade a Brain não define entram na feature que primeiro os grava: atributos de `users` na AUTH-002; `churches.address` na CHURCH-001 |
| ARQ-F002-03 | O RLS faz isolamento por contexto de igreja; papel + escopo ficam no backend; policies por usuário entram com AUTH-002/003 e CHURCH-002 |
| ARQ-F002-04 | Contexto por parâmetros transacionais `mescala.current_user_id` e `mescala.current_church_id`, lidos por funções que devolvem NULL quando falta (falha fechada) |
| ARQ-F002-05 | A migration cria só o papel de grupo `mescala_app` (NOLOGIN); o papel de login, com senha, é criado pelo PO fora do repositório, na FOUNDATION-003 |
| ARQ-F002-06 | Nenhum DELETE nem TRUNCATE para o backend nesta fundação (HIS-001) |
| ARQ-F002-07 | UPDATE só nas colunas de atributo e estado |
| ARQ-F002-08 | `audit_log` imutável também para papéis administrativos (trigger) |
| ARQ-F002-09 | Colunas de status sem DEFAULT; nenhum CHECK acopla status e `ended_at` |
| ARQ-F002-10 | `config.toml` mínimo, escrito à mão; `supabase init` não é usado |
| ARQ-F002-11 | Revisão estática do QA e revisão pré-aplicação do Arquiteto **antes** de o PO aplicar |
| ARQ-F002-12 | Nomes explícitos de FK (`ministry_membership_id`, `ministry_function_id`); o nome `audit_log` é mantido |
| ARQ-F002-13 | RLS habilitado, não forçado |
| ARQ-F002-14 | Em tabela de tenant, toda unicidade que um INSERT do backend pode atingir inclui `church_id` (vínculo com o ministério, nome de função e PK das habilitações). Exceção: a PK `id` e os UNIQUE(x, id) alvo de FK |
| ARQ-F002-15 | INSERT de `mescala_app` em `audit_log` só por coluna; `id` e `occurred_at` sempre do default do banco |
| ARQ-F002-16 | DIV-01, opção A: o padrão global de privilégios não é alterado; cada função criada em `mescala` retira EXECUTE de `PUBLIC` e concede explicitamente; ALTER DEFAULT PRIVILEGES sem IN SCHEMA é proibido |

ARQ-F002-14 e 16, mais o R-19, viraram as [[tecnico/BANCO-DE-DADOS#Convenções do schema oficial (FOUNDATION-002, 2026-10-22)|convenções do schema oficial]], válidas para toda migration. São convenções técnicas, não regras de negócio `<ÁREA>-<NNN>`.

### F002-QA-01
Achado do QA na fase 1: o índice único é checado antes da FK composta, e o RLS só fixa `church_id`; sem `church_id` na chave, um INSERT com ID de outra igreja responderia 23505 em vez de 23503 e revelaria vínculo, nome ou habilitação dela (SEC-001). **Resolvido pela estrutura** (ARQ-F002-14): um INSERT no contexto de uma igreja com ministério, vínculo ou função de outra responde 23503, nunca 23505. Não gera requisito de mapeamento de erros para as features.

## Riscos registrados no contrato (R-01 a R-19)
| # | Risco | Mitigação |
|---|---|---|
| R-01 | O RLS não pega contexto de igreja errado | A CHURCH-002 valida o vínculo ATIVO antes de definir o contexto |
| R-02 | CLI rodada na raiz usa o vínculo legado | Comandos só a partir de `/backend`; conferir o project-ref |
| R-03 | `supabase config push` sobrescreve a configuração remota | `config.toml` mínimo; comando proibido |
| R-04 | `supabase db reset --linked` apaga o banco remoto | Proibido |
| R-05 | Misturar SQL Editor e CLI diverge o histórico | Um único método; recomendação: CLI |
| R-06 | Migration aplicada não pode ser editada | Revisões antes da aplicação (ARQ-F002-11) |
| R-07 | Excluir a conta no Supabase Auth falha com usuário do Mescala (FK RESTRICT) | Consequência aceita da DATA-DEC-012; LGPD exige feature de anonimização |
| R-08 | `audit_log` guarda dados pessoais, e a imutabilidade bloqueia correções | A feature de anonimização trará migration própria |
| R-09 | Alguém expõe o schema na Data API | Papéis da Data API sem USAGE nem grants |
| R-10 | Identificador com mais de 63 caracteres é truncado | Regra D10; checagem do QA |
| R-11 | Scripts de verificação escritos sem execução prévia | O PO devolve o erro; corrige-se o script, não a migration |
| R-12 | No Postgres 16+, `postgres` precisa da opção SET para `SET ROLE mescala_app` | O script concede isso dentro do bloco desfeito |
| R-13 | AUTH-001 em paralelo e `backend/.gitignore` | Conflito trivial |
| R-14 | `public` continua exposto pela Data API | Nenhuma migration oficial cria objeto em `public` |
| R-15 | Papéis administrativos da plataforma mantêm acesso | Fora do modelo: o RLS protege o caminho da aplicação |
| R-16 | Imutabilidade de `audit_log` contornável pelo dono por DDL ou `session_replication_role` | Plano administrativo; DDL só por migration revisada; bloco B informativo ([[seguranca/AUDITORIA]]) |
| R-17 | `lower()` de nomes com acento depende do locale | V0.4 antes de aplicar; se falhar, nada é aplicado e as migrations de ministérios e funções ganham collation explícita, com nova revisão |
| R-18 | Função criada sem retirar EXECUTE de `PUBLIC` fica executável por `mescala_app` | Convenção ARQ-F002-16; V1.12b e V1.14b a V1.14d como regressão fixa |
| R-19 | Timestamps das 9 migrations (até `20261022150800`) à frente do horário em que foram escritas | Toda migration nova com timestamp maior que o da última da pasta |

## Dependências entre features
- **DEPENDS_ON:** [[features/FOUNDATION-001]] (cumprida); [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]], [[decisoes/ADR-003-AUTENTICACAO|ADR-003]], DEC-04 parte 1, [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]] e [[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]] (aceitos); B-01 e B-02 (respondidos em 2026-10-22); autorização da Fase 4 (concedida em 2026-10-22).
- **BLOCKS:** FOUNDATION-003, AUTH-002, AUTH-003, CHURCH-001, CHURCH-002, FOUNDATION-004, Convites e toda feature com banco.
- **RELATED_TO:** [[features/AUTH-001]], em paralelo (único ponto de contato: `backend/.gitignore`); DEC-06, DEC-07 e B8 da AUTH-001; [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]] (nenhuma dependência npm muda).

**Requisitos que as features seguintes herdam** (seção 11 do contrato, com os acréscimos da VERSÃO 2):
- **Toda feature com migration:** ARQ-F002-14, ARQ-F002-16 e R-19 ([[tecnico/BANCO-DE-DADOS#Convenções do schema oficial (FOUNDATION-002, 2026-10-22)|convenções]]).
- **FOUNDATION-003:** decisão da DEC-04 parte 2; papel de login (PO, fora do repositório); conexão e pooler; um único helper de transação que define o contexto só com `set_config(..., true)`, com teste de duas transações seguidas na mesma conexão mostrando que o contexto some depois de COMMIT e de ROLLBACK; banco de teste com os papéis do Supabase e `auth.users`.
- **AUTH-002:** colunas de `users` da DATA-DEC-013, com a obrigatoriedade da DEC-06; grants e policies de `users`; mecanismo `sub` → `users.id` sob RLS; `auth_user_id` imutável.
- **AUTH-003:** resolução do usuário atual; status do usuário, conforme o B8.
- **CHURCH-001:** coluna `address`; na mesma transação, gerar o `id` da igreja, definir o contexto e inserir igreja, OWNER e auditoria; helper de auditoria com SQL NULL (nunca JSON `null`), sem `id`, `occurred_at` nem RETURNING.
- **CHURCH-002:** policies SELECT por usuário ("minhas igrejas", os próprios vínculos); validação do vínculo ATIVO antes de definir o contexto (R-01); como a igreja atual chega à API (**A DEFINIR**).
- **FOUNDATION-004:** programação, participação, escala (RASCUNHO, PUBLICADA, CONCLUIDA; UNIQUE(programação, ministério) já com `church_id`), alocações (com a unicidade do B-03) e impedimentos (INSERT só pelo próprio usuário, DIS-001).
- **Convites:** B-04, o fluxo documentado na Brain e a policy de aceite entre igrejas.
- **Features que recebem IDs do cliente:** o backend nunca grava `id` vindo do cliente como chave de linha nova.

## Lacunas não bloqueantes, adiadas pelo contrato
Obrigatoriedade dos atributos de `users` (AUTH-002); `churches.address` (CHURCH-001); status ou revogação do usuário (AUTH-003); revogar uma habilitação (feature de funções do membro); acoplamento entre status e `ended_at` (features de inativação); cancelamento de Programação (FOUNDATION-004 e feature de programações; nada decidido); o que é "excluir" o membro (feature de escalas); ambiente de banco de teste (FOUNDATION-003); regras de autorização abertas (no backend, nas features).

## Próximo registro
Depois da ARCHITECT REVIEW final: registrar a aplicação (data, método, commit) e o estado do banco oficial (pedido 2 do Arquiteto). **Não feito:** a aplicação ainda não aconteceu.

Relacionados: [[tecnico/BANCO-DE-DADOS]], [[seguranca/ISOLAMENTO-DE-DADOS]], [[seguranca/AUDITORIA]], [[decisoes/PENDENCIAS]], [[MOCs/MOC-GOVERNANCA]], [[MOCs/MOC-DADOS]], [[MOCs/MOC-ARQUITETURA]].

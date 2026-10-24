---
tipo: indice-pendencias
status: pendente
area: governanca
atualizado: 2026-10-24
relacionado:
  - "[[MOCs/MOC-GOVERNANCA]]"
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[decisoes/ADR-003-AUTENTICACAO]]"
  - "[[decisoes/DEC-02-BIBLIOTECA-DE-TESTES]]"
  - "[[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]]"
  - "[[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]"
  - "[[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]]"
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
  - "[[features/FOUNDATION-001]]"
  - "[[features/AUTH-001]]"
  - "[[features/FOUNDATION-002]]"
  - "[[tecnico/DIVERGENCIAS-LEGADO]]"
  - "[[seguranca/RISCOS-DO-LEGADO]]"
---
# Decisões pendentes

> Esta nota lista as perguntas em aberto e o que cada uma bloqueia. Enquanto uma decisão estiver pendente, o ponto que ela cobre é **A DEFINIR**: o [[agents/arquiteto|Arquiteto]] o trata como BLOQUEIO DE DOMÍNIO e o [[agents/analista-de-dados|Analista de Dados]] como DATA MODEL BLOCKED.
>
> **Itens decididos continuam aqui com o título original**, para não quebrar links nem apagar o histórico. Cada um diz "**DECIDIDA em …**" e aponta para a nota da decisão em `/decisoes`, que é a fonte normativa. Só o que está marcado como aberto continua pendente.

Exceção: [[#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]], [[#L-07 — Guarda 2b não normaliza o especificador|L-07]], [[#RT-AUTH-01 — Cache de segmento do Next sobre a busca do JWKS|RT-AUTH-01]] e [[#RT-AUTH-02 — Composição padrão no domínio|RT-AUTH-02]] são riscos e limite **já aceitos** pelo Arquiteto. Estão aqui porque as condições e a reavaliação deles continuam abertas. O [[#L-06 — Arquivos .jsx fora das guardas de lint|L-06]] foi **encerrado em 2026-10-22** e fica como histórico.

## Decididas e resolvidas de 2026-10-21 a 2026-10-23

| Pendência | Data | Decisão | Nota |
|---|---|---|---|
| [[#DEC-03 — Autenticação\|DEC-03]] | 2026-10-21 | Supabase Auth do projeto oficial; backend como resource server sem estado, que só valida o access token (JWKS, `jose`) | [[decisoes/ADR-003-AUTENTICACAO\|ADR-003]] (aceito) |
| [[#DEC-05 — Projeto Supabase oficial\|DEC-05]] | 2026-10-21 | Projeto novo `vitqnyzuvrvkmnvshcpb`; os antigos ficam só para o legado | [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL\|DEC-05]] |
| [[#DEC-04 — Estratégia de migrations e forma de acesso ao banco\|DEC-04]], **parte 1** | 2026-10-21 | Migrations oficiais em `backend/supabase/migrations/`; as legadas nunca rodam no banco novo; aplicação manual pelo PO (no projeto oficial, só pelo SQL Editor desde 2026-10-23: ARQ-F002-17) | [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS\|DEC-04]] (parte 2 aberta) |
| DATA-DEC-001 a 023 | 2026-10-21 | Todas na opção recomendada do relatório, com as respostas sugeridas | [[decisoes/DEC-09-MODELO-DE-DADOS\|DEC-09]] |
| [[#Micro-decisões deixadas em aberto pelo aceite de 2026-10-21\|Micro-decisões]] das DATA-DEC | 2026-10-22 | Status do convite e de vínculos, ministérios e funções; Escala nunca é cancelada; só o membro registra impedimento; app legado sem uso real | [[decisoes/DEC-09-MODELO-DE-DADOS#Micro-decisões de 2026-10-22\|DEC-09, complemento]] |
| [[#DEC-02 — Biblioteca oficial de testes e quem escreve os testes\|DEC-02]] | 2026-10-22 | Vitest; o Desenvolvedor escreve os testes dos cenários do QA Contract e o QA revisa e acrescenta casos adversariais | [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES\|DEC-02]] |
| [[#Lacunas observadas no registro de 2026-10-21\|Lacunas observadas]] (bloqueios B-01 a B-04 da FOUNDATION-002) | 2026-10-22 | Schema `mescala`; status da Igreja ATIVO, INATIVO; alocação "ativa" = AGUARDANDO_CONFIRMACAO e CONFIRMADA; `invitations` nasce com a feature de convites (o fluxo continua A DEFINIR) | [[decisoes/DEC-09-MODELO-DE-DADOS#Respostas do PO aos bloqueios da FOUNDATION-002\|DEC-09, respostas aos bloqueios]] |
| [[#Outras pendências registradas\|Autorização da Fase 4]] | 2026-10-22 | Concedida pelo PO para a FOUNDATION-002: o Analista cria as migrations, sem aplicar | [[features/FOUNDATION-002]] |
| [[#Outras pendências registradas\|Aplicação da FOUNDATION-002]] | 2026-10-23 | Aplicadas em 2026-10-23 pelo PO, no projeto oficial, pelo SQL Editor (commit `028f9ff`); ARCHITECT REVIEW final APPROVED_WITH_NOTES; feature encerrada. ARQ-F002-17 a 19 aceitas pelo PO sem veto em 2026-10-24 | [[features/FOUNDATION-002]] |

## Continuam abertas
- [[#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]]: forma de acesso do backend ao banco (driver, query builder ou ORM).
- [[#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]] e [[#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]], propostas pela AUTH-001.
- [[#Condições operacionais do ADR-003|Condições operacionais do ADR-003]]: chaves assimétricas ativas no projeto novo e confirmação de email ligada em produção.
- [[#Pontos em aberto criados pelas decisões de 2026-10-22|Pontos criados pelas decisões de 2026-10-22]]: o que é "excluir" o membro; data para pausar ou excluir os projetos antigos; cancelamento de Programação.
- [[#Lacunas observadas no registro de 2026-10-21|Lacunas observadas no registro]]: decididas em 2026-10-22 (B-01 a B-04 da FOUNDATION-002), exceto o fluxo, as transições e o papel pretendido do convite, e o efeito de uma igreja INATIVO, que continuam **A DEFINIR**.
- [[#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]], [[#L-07 — Guarda 2b não normaliza o especificador|L-07]], [[#RT-AUTH-01 — Cache de segmento do Next sobre a busca do JWKS|RT-AUTH-01]] e [[#RT-AUTH-02 — Composição padrão no domínio|RT-AUTH-02]] (aceitos com condições). Interpretação aceita com consequências para features futuras: [[#ARQ-AUTH-01 — Leitura literal das validações de claims|ARQ-AUTH-01]].
- [[#AUTH-001 — Fundação de Autenticação|Herança da AUTH-001 para a AUTH-003]].
- [[#Outras pendências registradas|Outras pendências]]: regras de autorização em aberto, plano para o frontend legado. A aplicação da FOUNDATION-002 saiu daqui: aplicadas em 2026-10-23.

## Fontes
- **DEC-02, DEC-03 e DEC-04:** seção "Decisões pendentes" do Feature Contract `docs/features/FOUNDATION-001.md` (fora do vault). Registro no vault: [[features/FOUNDATION-001]].
- **AUTH-001 e as propostas DEC-05, DEC-06 e DEC-07:** análise e contrato `docs/features/AUTH-001.md` (fora do vault), emitidos pelo Arquiteto em 2026-10-06; v2 READY em 2026-10-22. O arquivo está versionado desde o commit `50a1cd6` (v1, 2026-10-22 00:37) e foi atualizado para a v2 no `4039fe0`. O ADR-003 e a DEC-05 foram aceitos pelo PO em 2026-10-21; DEC-06 e DEC-07 continuam propostas, com número reservado.
- **RT-FOUND-01 e L-06:** ARCHITECT REVIEW da FOUNDATION-001 (APPROVED em 2026-10-19), que não foi gravada em arquivo. Registro permanente: [[features/FOUNDATION-001]].
- **L-07, RT-AUTH-01, RT-AUTH-02, ARQ-AUTH-01 e o encerramento do L-06:** ARCHITECT REVIEW da AUTH-001 (APPROVED_WITH_NOTES em 2026-10-22), que não foi gravada no repositório. Registro permanente: [[features/AUTH-001]].
- **B-01 a B-04 e autorização da Fase 4:** respostas do PO de 2026-10-22 aos bloqueios do contrato `docs/features/FOUNDATION-002.md` (fora do vault), registradas no cabeçalho dele. Pedido de registro: revisão pré-aplicação do Arquiteto (pedido 1). Registro: [[features/FOUNDATION-002]].
- **Aplicação e encerramento da FOUNDATION-002, ARQ-F002-17 a 19, R-16 confirmado e R-20:** ARCHITECT REVIEW final (APPROVED_WITH_NOTES em 2026-10-23), que não foi gravada no repositório (pedido 2 ao vault-brain), e o fechamento do contrato no commit `8ee70a6`. O aceite de ARQ-F002-17 a 19 pelo PO, sem veto, em 2026-10-24, foi repassado pela sessão principal. Registro permanente: [[features/FOUNDATION-002]].
- **DATA-DEC-001 a DATA-DEC-023:** seção 14 do relatório `docs/data/DATA-ARCHITECTURE-REPORT.md` (fora do vault), emitido pelo Analista de Dados em 2026-10-04. Todas aceitas pelo PO em 2026-10-21 na opção recomendada ([[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]]); o cabeçalho do relatório registra "decisões aceitas pelo PO em 2026-10-21".
- **Decisões de 2026-10-22** (micro-decisões, Escala sem CANCELADA, DEC-02): decisões do PO repassadas pela sessão principal ao vault-brain em 2026-10-22.
- No relatório, as tabelas abreviam "DATA-DEC-0xx" como "DEC-0xx" (três dígitos). DEC-01 a DEC-09 (dois dígitos) são outra série: decisões técnicas e de governança.

## Decisões já aceitas (para contraste)
- [[decisoes/ADR-001-ESTRUTURA-INICIAL]]
- [[decisoes/ADR-002-BACKEND-OFICIAL]]
- [[decisoes/ADR-003-AUTENTICACAO]] (aceito em 2026-10-21; resolve a DEC-03)
- [[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]
- [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES]] (aceita em 2026-10-22)
- [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]] (parte 1 aceita em 2026-10-21; parte 2 aberta)
- [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]] (aceita em 2026-10-21)
- [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]] (ARQ-FOUND-02, aceita em 2026-10-19)
- [[decisoes/DEC-09-MODELO-DE-DADOS]] (DATA-DEC-001 a 023, aceitas em 2026-10-21; micro-decisões em 2026-10-22)

---

## Decisões técnicas da arquitetura (FOUNDATION-001)

O [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] deixa essas escolhas fora do seu escopo ("Decisões ainda não definidas por este ADR"). Nenhuma bloqueou a [[features/FOUNDATION-001]], encerrada em 2026-10-19. A DEC-03 e a parte 1 da DEC-04 foram decididas em 2026-10-21; a DEC-02, em 2026-10-22. Só a parte 2 da DEC-04 continua aberta.

### DEC-02 — Biblioteca oficial de testes e quem escreve os testes
- **Situação:** **DECIDIDA em 2026-10-22.** Biblioteca: **Vitest**. O [[agents/desenvolvedor-backend|Desenvolvedor]] escreve os testes dos cenários do QA Contract como parte da entrega; o [[agents/qa|QA]] revisa e acrescenta casos adversariais. Registro: [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES|DEC-02]].
- **Instalação:** o Vitest entra como dependência de desenvolvimento do `/backend` na primeira feature que precisar dele (a AUTH-001), com versão exata. Local dos testes, script `test` e convenções: o Arquiteto define nesse contrato.
- **Bloqueava (até 2026-10-22):** a regressão automatizada dos cenários B1–B3 da FOUNDATION-001, as features de negócio e o READY da [[#AUTH-001 — Fundação de Autenticação|AUTH-001]] (era o único bloqueio dela desde 2026-10-21).
- **Efeito anterior, substituído:** o [[agents/qa|QA]] não criava arquivos de teste nem usava executor de testes; cenários que exigiam teste automatizado ficavam NOT TESTED.
- **Daqui para frente:** os cenários B1–B3 da FOUNDATION-001 viram teste automatizado quando o lint for alterado ([[features/FOUNDATION-001#Verificação mínima de regressão do lint|verificação mínima de regressão do lint]]).
- **Notas atualizadas:** [[agents/qa]], [[agents/desenvolvedor-backend]], [[tecnico/BACKEND]], [[features/FLUXO-DE-ENTREGA]], [[features/FOUNDATION-001]].

### DEC-03 — Autenticação
- **Situação:** **DECIDIDA em 2026-10-21** pelo [[decisoes/ADR-003-AUTENTICACAO|ADR-003]] (aceito): Supabase Auth do projeto oficial como provedor; o backend é resource server sem estado e só valida o access token, localmente, pelo JWKS público, com a biblioteca `jose`.
- **Bloqueava (até 2026-10-21):** o contexto de igreja e qualquer rota protegida; em parte, a [[#DATA-DEC-019 — Identidade × provedor de autenticação|DATA-DEC-019]]; e o READY da [[#AUTH-001 — Fundação de Autenticação|AUTH-001]].
- **Histórico:** em 2026-10-20 o ADR-003 era só proposta da AUTH-001, e não havia nota de ADR-003 no vault.
- **Continua aberto:** as [[#Condições operacionais do ADR-003|condições operacionais do ADR-003]].
- **Notas atualizadas:** [[seguranca/AUTENTICACAO]], [[seguranca/ISOLAMENTO-DE-DADOS]], [[tecnico/API]], [[tecnico/BACKEND]].

### DEC-04 — Estratégia de migrations e forma de acesso ao banco
- **Situação:** **parte 1 DECIDIDA em 2026-10-21; parte 2 aberta.** Registro: [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04]].
- **Parte 1 (decidida):** migrations oficiais em `backend/supabase/migrations/` (Supabase CLI, configuração própria em `backend/supabase/config.toml`, ligada ao projeto `vitqnyzuvrvkmnvshcpb`). A `supabase/` da raiz continua com as 9 migrations legadas, ligadas ao app legado, e elas nunca são aplicadas no banco novo. Aplicação manual pelo PO (SQL Editor ou CLI, pelo texto aceito). **No projeto oficial, o SQL Editor é o método único desde 2026-10-23** (ARQ-F002-17, aceita pelo PO sem veto em 2026-10-24; `supabase db push` e `supabase migration up` proibidos lá; [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04, registro de 2026-10-23]]). Integração GitHub ↔ Supabase: não conectar por enquanto; se for conectada, com diretório `backend/supabase` e deploy automático desligado.
- **Parte 2 (aberta):** forma de acesso do backend ao banco: driver, query builder ou ORM. **A DEFINIR.** A [[#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]], aceita na opção A, já implica conexão direta ao Postgres com papel sem BYPASSRLS.
- **Bloqueava (até 2026-10-21):** a [[#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]], decidida no mesmo dia.
- **Efeito anterior, substituído:** até 2026-10-21, as migrations eram criadas em `supabase/migrations/` (único padrão existente).
- **Efeito atual da parte 2:** o [[agents/desenvolvedor-backend|Desenvolvedor]] não escolhe biblioteca de acesso ao banco sem decisão.
- **Desde 2026-10-22 (contrato [[features/FOUNDATION-002]], ARQ-F002-01):** o cliente de banco do backend é uma feature própria, a FOUNDATION-003 (proposta; ID a confirmar), que traz a decisão da parte 2, o papel de login, a conexão e a transação com contexto. A parte 2 não bloqueia a FOUNDATION-002: o mecanismo de contexto definido nela funciona com qualquer cliente Postgres direto.
- **Notas afetadas:** [[tecnico/BANCO-DE-DADOS]], [[agents/analista-de-dados]], [[agents/desenvolvedor-backend]].

---

## AUTH-001 e decisões propostas pela análise

> O contrato e as decisões abaixo foram propostos pelo [[agents/arquiteto|Arquiteto]] em 2026-10-06. Em 2026-10-21 o PO aceitou o ADR-003 e decidiu a DEC-05; em 2026-10-22, a DEC-02. DEC-06 e DEC-07 continuam propostas, com número reservado. A AUTH-001 foi implementada e encerrada em 2026-10-22 ([[features/AUTH-001]]).

### AUTH-001 — Fundação de Autenticação
- **Situação:** **IMPLEMENTADA e ENCERRADA em 2026-10-22.** ARCHITECT REVIEW **APPROVED_WITH_NOTES** (equivale a APPROVED); commit `50eaa1f` (16 arquivos, local). Registro permanente: [[features/AUTH-001]].
- **Contrato:** `docs/features/AUTH-001.md` (fora do vault). v1 emitida pelo Arquiteto em 2026-10-06; **v2 READY em 2026-10-22**. Versionado desde o commit `50a1cd6` (v1) e atualizado para a v2 no `4039fe0`. Condições cumpridas:
  - [[decisoes/ADR-003-AUTENTICACAO|ADR-003]] aceito em 2026-10-21 (resolve a [[#DEC-03 — Autenticação|DEC-03]]);
  - [[#DEC-02 — Biblioteca oficial de testes e quem escreve os testes|DEC-02]] decidida em 2026-10-22 e especificada no adendo v2;
  - [[features/FOUNDATION-001]] implementada e aprovada em 2026-10-19 (commit `7f26d30`);
  - [[#DEC-05 — Projeto Supabase oficial|DEC-05]] decidida em 2026-10-21 (condição de operação, não de implementação).
- **Histórico do status:** BLOCKED por DEC-03 e DEC-02 até 2026-10-21; BLOCKED só pela DEC-02 de 2026-10-21 a 2026-10-22; sem bloqueios de decisão em 2026-10-22, até o Arquiteto emitir a v2 READY; implementada e encerrada no mesmo dia.
- **Escopo:** verificar o access token e devolver a identidade do provedor, sem banco, sem igreja e sem rota nova. O usuário do Mescala fica para features seguintes, propostas no documento (AUTH-002 e AUTH-003).
- **Pendente para operar:** `SUPABASE_URL` no ambiente e as [[#Condições operacionais do ADR-003|condições operacionais do ADR-003]].
- **Também aponta, sem número:** a revogação do usuário no domínio (bloqueio B8, para a AUTH-003). **A DEFINIR.**
- **Herança para a AUTH-003** (ARCHITECT REVIEW da AUTH-001):
  1. [[#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]]: o mapeamento HTTP mantém separados os 4 códigos de "não autenticado" e o `AUTH_VERIFICATION_UNAVAILABLE`; `AUTH_TOKEN_EXPIRED` não atesta os demais claims ([[#ARQ-AUTH-01 — Leitura literal das validações de claims|ARQ-AUTH-01]], a);
  2. [[#RT-AUTH-01 — Cache de segmento do Next sobre a busca do JWKS|RT-AUTH-01]]: guarda de `fetchCache` e verificação da regra 6 em runtime;
  3. teste do verificador padrão com configuração válida (`createDefaultVerifier`, `fetchJwksWithoutNextCache`, `createRemoteJWKSet`), hoje só com revisão estática (O-14), inclusive o JWKS real, que depende das condições do ADR-003 com o PO;
  4. o 405 real do B2 da [[features/FOUNDATION-001]], com servidor rodando;
  5. `Object.freeze` é raso (O-13): `expiresAt` é `Date` mutável; consumidores não o alteram (copiam, se precisarem);
  6. B8 (revogação no domínio): **A DEFINIR**.
- **Divergências apontadas:** D4, sobre o projeto Supabase (**resolvida quanto ao backend oficial** pela [[#DEC-05 — Projeto Supabase oficial|DEC-05]]), e D5, sobre a Brain dizer que arquivos já versionados estavam fora do git (corrigida em 2026-10-20). Ver [[tecnico/DIVERGENCIAS-LEGADO]].
- **Pedido do documento ao vault-brain, depois do aceite:** gravar o ADR-003 e atualizar [[seguranca/AUTENTICACAO]], esta nota, [[features/FLUXO-DE-ENTREGA]] e o "fora do git" de [[tecnico/LEGADO-ATUAL]]. **Feito em 2026-10-21** (o "fora do git" já tinha sido corrigido em 2026-10-20).

### Condições operacionais do ADR-003
Condições do [[decisoes/ADR-003-AUTENTICACAO#Condições|ADR-003]], com o PO. Não bloqueiam a implementação da AUTH-001; bloqueiam a operação.
- **Chaves de assinatura assimétricas** ativas no projeto `vitqnyzuvrvkmnvshcpb` (painel do Supabase, JWT Signing Keys: chave atual ECC P-256 ou RSA). Se não for possível, o ADR-003 deve ser revisto para validação remota. **Pendente.**
- **Confirmação de email ligada** no provedor, em produção. **Pendente.**
- Também cabe ao PO, segundo a AUTH-001 (B5): o TTL do access token (recomendação do documento: manter no máximo o padrão de 3600 s). **Pendente.**
- **Região do projeto novo:** a confirmar pelo PO ([[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]).

### DEC-05 — Projeto Supabase oficial
- **Situação:** **DECIDIDA em 2026-10-21.** Projeto oficial = projeto **novo** `vitqnyzuvrvkmnvshcpb` (`https://vitqnyzuvrvkmnvshcpb.supabase.co`). Registro: [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]].
- **Pergunta (aberta de 2026-10-06 a 2026-10-21):** qual é o projeto Supabase oficial?
- **Contexto:** o `.env` do app e o vínculo do Supabase CLI apontavam para `ehbidizpzxhfusfyjgtl` ("Projeto Mescala"); o `supabase/config.toml`, para `fiurvpkieiorngshjric`. Os dois ficam só para o app legado, até ele sair de uso.
- **Bloqueava, segundo a AUTH-001:** a operação da AUTH-001 e a consulta de inventário. A consulta foi **dispensada em 2026-10-22** (app legado sem uso real).
- **Continua aberto:** região do projeto; data para pausar ou excluir os projetos antigos ([[#Pontos em aberto criados pelas decisões de 2026-10-22|decisão operacional do PO]]).
- **Notas atualizadas:** [[seguranca/AUTENTICACAO]], [[tecnico/LEGADO-ATUAL]], [[tecnico/BANCO-DE-DADOS]], [[tecnico/DIVERGENCIAS-LEGADO]].

### DEC-06 — Provisionamento do usuário do Mescala
- **Situação:** proposta pela AUTH-001 (bloqueio B7). **Não decidida.**
- **Pergunta:** como nasce o registro do usuário do Mescala depois que a conta é criada no provedor de autenticação?
- **Contexto:** a Brain diz "Usuário cria ou acessa sua conta" ([[fluxos/FLUXO-CADASTRO-IGREJA]]), sem dizer como o registro do Mescala nasce. A tabela própria `users` foi decidida na [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-019 — Identidade × provedor de autenticação|DATA-DEC-019]]; o momento e a forma de criar o registro, não. As opções e a recomendação estão no documento da AUTH-001.
- **Bloqueia, segundo a AUTH-001:** a AUTH-002 (provisionamento do usuário, proposta).
- **Notas afetadas:** [[fluxos/FLUXO-CADASTRO-IGREJA]], [[dados/ENTIDADES#Usuário|Usuário]], [[seguranca/AUTENTICACAO]].

### DEC-07 — Padrão HTTP de erros e convenções de API
- **Situação:** proposta pela AUTH-001 (bloqueio B9). **Não decidida.**
- **Pergunta:** qual é o padrão HTTP de erros e quais são as convenções de API?
- **Contexto:** [[tecnico/API]] diz "Contratos e endpoints definitivos: **A DEFINIR**", e a [[decisoes/DEC-01-ROTA-TECNICA-HEALTH|DEC-01]] não define envelope nem padrão de erros. As opções e a recomendação estão no documento da AUTH-001.
- **Bloqueia, segundo a AUTH-001:** a primeira rota protegida, que precisa mapear os erros de autenticação para respostas HTTP (AUTH-003, proposta).
- **Notas afetadas:** [[tecnico/API]], [[tecnico/BACKEND]].

---

## Decisões de dados — Bloco A: vocabulário e escopo do domínio

> **Todas as DATA-DEC foram DECIDIDAS em 2026-10-21**, na opção recomendada do relatório, e as micro-decisões que ficaram em aberto foram decididas em 2026-10-22. Registro normativo: [[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]]. Cada bloco abaixo guarda a pergunta original como histórico e aponta o que continua em aberto.

### DATA-DEC-001 — Equipe × Ministério
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): mesmo conceito, nome canônico **Ministério** (`ministry` no código). [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-001 — Equipe × Ministério|DEC-09]].
- **Pergunta (histórico):** Equipe e Ministério são o mesmo conceito? Se forem, qual é o nome canônico? Ou um Ministério contém Equipes?
- **Contexto:** as notas da Brain diziam "Equipe". O [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] (`ministry`), o [[Fluxograma.canvas]] ("Líder de Ministério") e o Data Task do PO diziam "Ministério". O legado usa a tabela `equipes`.
- **Regra de vocabulário (até 2026-10-21):** as notas continuavam dizendo "Equipe". Desde o aceite, dizem "Ministério"; [[modulos/EQUIPES]] e [[fluxos/FLUXO-EQUIPES]] mantêm o nome do arquivo e ganharam `aliases`.
- **Bloqueava:** os nomes de tudo no modelo oficial (com a 018) e as tabelas de ministério e função (com a 012 e a 013).
- **Notas atualizadas:** [[modulos/EQUIPES]], [[modulos/FUNCOES]], [[03-DOMINIO]], [[04-USUARIOS-E-PERMISSOES]], [[dados/ENTIDADES]], [[fluxos/FLUXO-EQUIPES]], [[produto/CONCEITOS-DO-CANVAS]].

### DATA-DEC-002 — Mapeamento dos termos do Data Task
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): Convocação = Alocação; Confirmação = status da Alocação; Ausência = impedimento da Disponibilidade; Permissões = papel + escopo, sem tabela; Funções ministeriais = Funções. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-002 — Mapeamento dos termos do Data Task|DEC-09]].
- **Pergunta (histórico):** os termos do Data Task do PO correspondem a conceitos que a Brain já tem, ou algum deles é entidade própria?
- **Notas atualizadas:** [[03-DOMINIO]], [[dados/ENTIDADES]], [[modulos/DISPONIBILIDADE]], [[modulos/FUNCOES]], [[fluxos/FLUXO-CONFIRMACAO]], [[04-USUARIOS-E-PERMISSOES]].

### DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): só Programação é modelada; Culto = programação comum; Agenda = consulta, sem tabela; Reunião, Comissão, Cronograma e Pauta ficam fora até a Brain documentá-los. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma|DEC-09]].
- **Pergunta (histórico):** Culto é um tipo de Programação? O que é Cronograma? Agenda é entidade ou consulta? Reunião e Comissão entram agora?
- **Continua A DEFINIR:** Reunião, Comissão, Cronograma e Pauta ([[produto/CONCEITOS-DO-CANVAS]]).
- **Notas atualizadas:** [[modulos/PROGRAMACOES]], [[fluxos/FLUXO-PROGRAMACOES]], [[produto/CONCEITOS-DO-CANVAS]], [[03-DOMINIO]].

### DATA-DEC-004 — Programações recorrentes
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): Programação = ocorrência datada (início e fim), sem recorrência nesta fundação. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-004 — Programações recorrentes|DEC-09]].
- **Pergunta (histórico):** existem programações recorrentes? Com quais regras?
- **Notas atualizadas:** [[modulos/PROGRAMACOES]], [[fluxos/FLUXO-PROGRAMACOES]].

## Decisões de dados — Bloco B: identidade, papéis e vínculos

### DATA-DEC-005 — Papéis em cada camada
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): igreja com OWNER, ADMIN e MEMBER (todo vinculado é ao menos MEMBER); ministério com LEADER e MEMBER; "líder" na igreja é derivado; OWNER inclui ADMIN; ANCIÃO é cargo, sem tabela e sem efeito de autorização. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 — Papéis em cada camada|DEC-09]].
- **Pergunta (histórico):** LEADER e MEMBER existem nos dois níveis? OWNER inclui ADMIN? O que significa "ANCIÃO"?
- **Notas atualizadas:** [[04-USUARIOS-E-PERMISSOES]], [[seguranca/AUTORIZACAO]], [[fluxos/FLUXO-MEMBROS]], [[produto/PERSONAS]], [[produto/CONCEITOS-DO-CANVAS]].

### DATA-DEC-006 — Usuário em mais de uma igreja
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): N igrejas, um vínculo por (igreja, usuário). [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-006 — Usuário em mais de uma igreja|DEC-09]].
- **Pergunta (histórico):** um usuário pode estar vinculado a mais de uma igreja?
- **Notas atualizadas:** [[04-USUARIOS-E-PERMISSOES]], [[modulos/IGREJAS]], [[dados/RELACIONAMENTOS]], [[seguranca/ISOLAMENTO-DE-DADOS]].

### DATA-DEC-007 — Quantidade de OWNER por igreja
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): exatamente 1 OWNER por igreja; trocar de dono exige uma feature de transferência. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-007 — Quantidade de OWNER por igreja|DEC-09]].
- **Pergunta (histórico):** uma igreja tem exatamente um OWNER ou pode ter vários?
- **Notas atualizadas:** [[fluxos/FLUXO-CADASTRO-IGREJA]], [[modulos/IGREJAS]], [[04-USUARIOS-E-PERMISSOES]], [[05-REGRAS-DE-NEGOCIO]].

### DATA-DEC-008 — Quantidade de LEADER por ministério
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): vários líderes por ministério (co-liderança). [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-008 — Quantidade de LEADER por ministério|DEC-09]].
- **Pergunta (histórico):** um ministério tem um único líder ou pode ter vários?
- **Notas atualizadas:** [[modulos/EQUIPES]], [[fluxos/FLUXO-EQUIPES]], [[04-USUARIOS-E-PERMISSOES]].

### DATA-DEC-009 — Papel único por usuário em cada ministério
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): um vínculo por (ministério, usuário), com um papel; um líder que também serve recebe funções no mesmo vínculo. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-009 — Papel único por usuário em cada ministério|DEC-09]].
- **Pergunta (histórico):** um usuário tem um único papel em cada ministério ou pode ter vários?
- **Notas atualizadas:** [[modulos/EQUIPES]], [[modulos/MEMBROS]], [[04-USUARIOS-E-PERMISSOES]], [[05-REGRAS-DE-NEGOCIO]].

### DATA-DEC-010 — Membro sem conta
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): só quem tem conta é membro; antes do aceite existe apenas o convite pendente. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-010 — Membro sem conta|DEC-09]].
- **Pergunta (histórico):** uma pessoa sem conta pode ser membro e ser escalada?
- **Notas atualizadas:** [[modulos/MEMBROS]], [[fluxos/FLUXO-MEMBROS]], [[dados/ENTIDADES]], [[05-REGRAS-DE-NEGOCIO]].

### DATA-DEC-011 — Convites
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): convite oficial, com só o hash do token; o aceite cria os vínculos; a regra "OWNER/ADMIN convida líder; líder convida membro" é registrada na Brain. **Status decididos em 2026-10-22:** PENDENTE, ACEITO, EXPIRADO, CANCELADO. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-011 — Convites|DEC-09]].
- **Pergunta (histórico):** o modelo oficial tem convite? Com quais status, regras e efeitos no aceite?
- **Escopo decidido em 2026-10-22** (B-04 do contrato FOUNDATION-002, opção A): a tabela `invitations` sai da fundação de persistência e nasce com a feature de convites (ID a definir), quando o fluxo for documentado na Brain.
- **Continua A DEFINIR:** o fluxo de convite (inclusive as transições entre os status), que a decisão diz que precisa ser documentado, e o papel pretendido (valores e o que significa um convite sem ministério). Ficam para o contrato da feature de convites.
- **Notas atualizadas:** [[modulos/MEMBROS]], [[fluxos/FLUXO-MEMBROS]], [[fluxos/FLUXO-EQUIPES]], [[seguranca/AUTENTICACAO]], [[dados/ENTIDADES]], [[dados/STATUS]], [[05-REGRAS-DE-NEGOCIO]].

### DATA-DEC-012 — Inativação, arquivamento e exclusão
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): nada com histórico é apagado; igreja, ministério, vínculos e funções ganham status e data de término; FKs com RESTRICT; um pedido de exclusão pela LGPD vai exigir uma feature de anonimização. **Status decididos em 2026-10-22** para vínculos (com a igreja e com o ministério), ministérios e funções: ATIVO, INATIVO. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-012 — Inativação, arquivamento e exclusão|DEC-09]].
- **Pergunta (histórico):** igreja, ministério, vínculos e funções podem ser inativados, arquivados ou excluídos? Como o histórico é preservado?
- **Status da Igreja decidido em 2026-10-22** (B-02 do contrato FOUNDATION-002, opção A): **ATIVO, INATIVO**. Até então, era **A DEFINIR** ([[#Lacunas observadas no registro de 2026-10-21|lacuna observada]]).
- **Continua A DEFINIR:** o efeito de uma igreja INATIVO (acesso, leitura e escrita), na feature que inativar a igreja.
- **Notas atualizadas:** [[modulos/IGREJAS]], [[modulos/EQUIPES]], [[modulos/FUNCOES]], [[dados/STATUS]], [[seguranca/AUDITORIA]], [[05-REGRAS-DE-NEGOCIO]].

### DATA-DEC-013 — Atributos e unicidade de nomes
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): só os atributos com uso real; nome de ministério único por igreja e de função único por ministério, sem diferenciar maiúsculas. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-013 — Atributos e unicidade de nomes|DEC-09]].
- **Pergunta (histórico):** quais atributos cada entidade tem? Nomes de ministério e de função são únicos no seu escopo?
- **Notas atualizadas:** [[dados/ENTIDADES]], [[modulos/IGREJAS]], [[modulos/EQUIPES]], [[modulos/MEMBROS]].

## Decisões de dados — Bloco C: escalas

### DATA-DEC-014 — A mesma pessoa mais de uma vez na mesma escala
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): no máximo uma alocação ativa por pessoa por escala. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-014 — A mesma pessoa mais de uma vez na mesma escala|DEC-09]].
- **Pergunta (histórico):** a mesma pessoa pode ter mais de uma alocação na mesma escala?
- **Status que contam como "ativa", decididos em 2026-10-22** (B-03 do contrato FOUNDATION-002, opção A): **AGUARDANDO_CONFIRMACAO e CONFIRMADA**. Até então, era **A DEFINIR** ([[#Lacunas observadas no registro de 2026-10-21|lacuna observada]]). O índice único parcial entra com a FOUNDATION-004.
- **Notas atualizadas:** [[modulos/ESCALAS]], [[dados/ENTIDADES#Alocação|Alocação]], [[05-REGRAS-DE-NEGOCIO]].

### DATA-DEC-015 — Modelo de substituição
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): a alocação original vira SUBSTITUIDA, e uma nova alocação, na mesma escala, aponta para ela. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-015 — Modelo de substituição|DEC-09]].
- **Pergunta (histórico):** como a substituição é representada nos dados, mantendo o membro original no histórico?
- **Notas atualizadas:** [[fluxos/FLUXO-SUBSTITUICAO]], [[05-REGRAS-DE-NEGOCIO#ESC-004 — Histórico de substituição|ESC-004]], [[dados/STATUS]].

### DATA-DEC-016 — Status e transições
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): o banco guarda os valores e o backend valida as transições. Respostas: (a) AGUARDANDO_CONFIRMACAO durante o rascunho, com o pedido de resposta enviado só na publicação; (b) CONCLUIDA manual; (c) cancelar a escala muda o status das alocações, para um estado a definir; (d) guardar também a data da resposta; (e) escala em rascunho pode ser apagada se nunca foi publicada. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-016 — Status e transições|DEC-09]].
- **Complemento de 2026-10-22:** **a Escala nunca é cancelada.** Estados da Escala: RASCUNHO, PUBLICADA, CONCLUIDA. O status CANCELADA, previsto na Brain até 2026-10-22, foi removido pelo PO; a resposta (c) deixa de existir.
- **Pergunta (histórico):** quem valida as transições, e as perguntas (a) a (e).
- **Continua A DEFINIR:** cancelar uma Programação (nada decidido; ver [[#Pontos em aberto criados pelas decisões de 2026-10-22|pontos em aberto]]).
- **Notas atualizadas:** [[dados/STATUS]], [[05-REGRAS-DE-NEGOCIO#ESC-003 — Estado controlado|ESC-003]], [[modulos/ESCALAS]], [[fluxos/FLUXO-ESCALAS]], [[fluxos/FLUXO-CONFIRMACAO]].

### DATA-DEC-017 — Disponibilidade
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): só impedimentos, por pessoa na igreja (valem para todos os ministérios), com início, fim e motivo opcional, registrados pelo próprio membro. **Complemento de 2026-10-22:** só o próprio membro registra o impedimento dele; o líder não registra por um membro e, se não quiser o membro participando, o exclui. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-017 — Disponibilidade|DEC-09]].
- **Pergunta (histórico):** tipo, escopo, recorrência e quem registra.
- **Continua A DEFINIR:** o significado de "excluir" e o efeito no histórico ([[#Pontos em aberto criados pelas decisões de 2026-10-22|pontos em aberto]]).
- **Notas atualizadas:** [[modulos/DISPONIBILIDADE]], [[fluxos/FLUXO-ESCALAS]], [[05-REGRAS-DE-NEGOCIO#ESC-001 — Conflito de horário|ESC-001]].

## Decisões de dados — Bloco D: infraestrutura de dados

### DATA-DEC-018 — Nomenclatura e idioma
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): identificadores em inglês (padrão da seção 13.4 do relatório), com valores de status e papel como na Brain. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-018 — Nomenclatura e idioma|DEC-09]].
- **Pergunta (histórico):** os identificadores do schema oficial ficam em inglês ou em português?
- **Notas atualizadas:** [[tecnico/BANCO-DE-DADOS]], [[tecnico/CONVENCOES]], [[dados/ENTIDADES]].

### DATA-DEC-019 — Identidade × provedor de autenticação
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): tabela própria `users` como âncora, com uma coluna de ligação ao `auth.users` do projeto novo ([[decisoes/ADR-003-AUTENTICACAO|ADR-003]], [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]). [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-019 — Identidade × provedor de autenticação|DEC-09]].
- **Pergunta (histórico):** tabela própria ligada ao provedor, ou o identificador do provedor em todo o schema?
- **Dependia de:** [[#DEC-03 — Autenticação|DEC-03]], decidida no mesmo dia.
- **Continua aberta:** [[#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]] (como o registro nasce).
- **Notas atualizadas:** [[seguranca/AUTENTICACAO]], [[dados/ENTIDADES#Usuário|Usuário]].

### DATA-DEC-020 — Onde o schema vive e modelo de RLS
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): schema dedicado fora da Data API; backend conectado direto ao Postgres com papel sem BYPASSRLS, definindo o contexto (usuário, igreja) em cada transação; policies usam esse contexto. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DEC-09]].
- **Pergunta (histórico):** em qual schema o modelo oficial vive e qual o modelo de RLS?
- **Dependia de:** [[#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04]]. A decisão implica acesso direto ao Postgres; a ferramenta continua aberta na parte 2 da DEC-04.
- **Nome do schema decidido em 2026-10-22** (B-01 do contrato FOUNDATION-002, opção A): **`mescala`**. Até então, era **A DEFINIR** (`mescala` era só exemplo do relatório). O mecanismo (papel `mescala_app`, contexto por transação) está em [[tecnico/BANCO-DE-DADOS#Mecanismo do schema oficial (FOUNDATION-002)|tecnico/BANCO-DE-DADOS]].
- **Notas atualizadas:** [[tecnico/BANCO-DE-DADOS]], [[seguranca/ISOLAMENTO-DE-DADOS]], [[seguranca/AUTORIZACAO]], [[agents/analista-de-dados]].

### DATA-DEC-021 — Auditoria
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): tabela de auditoria só de inserção, gravada pelo backend na mesma transação da operação. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 — Auditoria|DEC-09]].
- **Pergunta (histórico):** qual o mecanismo de auditoria e quando ele entra?
- **Notas atualizadas:** [[seguranca/AUDITORIA]], [[05-REGRAS-DE-NEGOCIO#ESC-004 — Histórico de substituição|ESC-004]].

### DATA-DEC-022 — Convivência com o legado e migração de dados
- **Situação:** **DECIDIDA em 2026-10-21** (opção A): schema oficial criado em paralelo, sem tocar no legado (no projeto novo, [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]); cópia de dados depois do inventário; tabelas legadas somente leitura quando o frontend migrar; remoção só com autorização futura. Sub-decisão: descartar `escalas` e `escala_membros` legadas se o inventário mostrar as tabelas vazias. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-022 — Convivência com o legado e migração de dados|DEC-09]].
- **Complemento de 2026-10-22:** app legado **sem uso real**. Não há migração de dados: o banco oficial começa vazio, e a consulta de inventário fica dispensada.
- **Pergunta (histórico):** como o modelo oficial convive com o legado e como os dados são migrados?
- **Continua A DEFINIR:** data para pausar ou excluir os projetos antigos (decisão operacional do PO; [[#Pontos em aberto criados pelas decisões de 2026-10-22|pontos em aberto]]).
- **Notas atualizadas:** [[tecnico/LEGADO-ATUAL]], [[tecnico/DIVERGENCIAS-LEGADO]], [[tecnico/BANCO-DE-DADOS]], [[modulos/ESCALAS]].

### DATA-DEC-023 — Correção urgente de segurança no legado
- **Situação:** **DECIDIDA em 2026-10-21** (opção A), **condicionada ao uso real do app legado**: migration pequena e separada do redesenho, sobre o banco legado, que fecharia S1, S2, S5 e S6. [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-023 — Correção urgente de segurança no legado|DEC-09]].
- **Complemento de 2026-10-22:** o app legado **não tem uso real**; **a correção não se aplica**. Os riscos S1–S11 continuam existindo nos projetos antigos enquanto estiverem ativos ([[seguranca/RISCOS-DO-LEGADO]]).
- **Pergunta (histórico):** corrigir agora as falhas de RLS do legado ou esperar o redesenho?
- **Notas atualizadas:** [[seguranca/RISCOS-DO-LEGADO]], [[seguranca/ISOLAMENTO-DE-DADOS]], [[seguranca/AUTORIZACAO]], [[tecnico/LEGADO-ATUAL]].

---

## Micro-decisões deixadas em aberto pelo aceite de 2026-10-21
As recomendações aceitas em 2026-10-21 deixaram estes pontos em aberto. **O PO decidiu todos em 2026-10-22** ([[decisoes/DEC-09-MODELO-DE-DADOS#Micro-decisões de 2026-10-22|DEC-09, complemento]]). As perguntas ficam como histórico.

### Status do convite — DATA-DEC-011
- **Situação:** **DECIDIDA em 2026-10-22:** PENDENTE, ACEITO, EXPIRADO, CANCELADO ([[dados/STATUS#Convite]]).
- **Pergunta (histórico):** quais são os valores de status do convite oficial?
- **Contexto:** a opção aceita dizia "status (valores a confirmar)". O legado usa `pending`, `accepted` e `expired` ([[tecnico/LEGADO-ATUAL]]), o que não decidia nada.
- **Continua A DEFINIR:** as transições entre esses status (fluxo de convite a documentar).

### Status de vínculos, ministérios e funções — DATA-DEC-012
- **Situação:** **DECIDIDA em 2026-10-22:** ATIVO, INATIVO, para vínculos (com a igreja e com o ministério), ministérios e funções ([[dados/STATUS#Vínculos, ministérios e funções]]).
- **Pergunta (histórico):** quais são os valores de status de igreja, ministério, vínculos e funções?
- **Contexto:** a opção aceita citava "ATIVO/INATIVO, valores a confirmar".
- **Status da Igreja:** a decisão não o citava; **decidido em 2026-10-22** pela resposta ao B-02 do contrato FOUNDATION-002: ATIVO, INATIVO ([[#DATA-DEC-012 — Inativação, arquivamento e exclusão|DATA-DEC-012]]).

### Alocações na escala cancelada — DATA-DEC-016 c
- **Situação:** **DEIXOU DE EXISTIR em 2026-10-22.** O PO decidiu que a Escala nunca é cancelada: os estados da Escala são RASCUNHO, PUBLICADA e CONCLUIDA, e o status CANCELADA saiu de [[dados/STATUS]].
- **Pergunta (histórico):** para qual estado vão as alocações quando a escala é cancelada? A resposta aceita em 2026-10-21 para (c) era "sim, para um estado a definir".

### Impedimento registrado pelo líder — DATA-DEC-017
- **Situação:** **DECIDIDA em 2026-10-22:** não. Só o próprio membro registra o impedimento dele. O líder não registra impedimento por um membro; se não quiser o membro participando, ele o exclui ([[05-REGRAS-DE-NEGOCIO#DIS-001 — Impedimento é registrado só pelo próprio membro|DIS-001]]).
- **Pergunta (histórico):** além do próprio membro, o líder também pode registrar impedimento?
- **Continua A DEFINIR:** o que é "excluir" ([[#Significado de excluir o membro — DATA-DEC-017|ver abaixo]]).

### Uso real do app legado — DATA-DEC-022 e 023
- **Situação:** **DECIDIDA em 2026-10-22:** o app legado **não tem uso real** ("o app antigo não tinha movimento", segundo o PO).
- **Pergunta (histórico):** o app legado tem uso real? Dependia da consulta de inventário da seção 1.3 do relatório.
- **Efeitos:**
  - a correção do [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-023 — Correção urgente de segurança no legado|DATA-DEC-023]] não se aplica;
  - o [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-022 — Convivência com o legado e migração de dados|DATA-DEC-022]] fica sem migração de dados: o banco oficial começa vazio;
  - a consulta de inventário fica dispensada;
  - os riscos S1–S11 continuam existindo nos projetos antigos enquanto estiverem ativos ([[seguranca/RISCOS-DO-LEGADO]]).
- **Continua A DEFINIR:** a data para pausar ou excluir os projetos antigos ([[#Pausar ou excluir os projetos antigos — DATA-DEC-022|ver abaixo]]).

## Pontos em aberto criados pelas decisões de 2026-10-22

### Significado de excluir o membro — DATA-DEC-017
- **Pergunta:** quando o líder não quer um membro participando e o exclui, "excluir" é da escala ou do ministério? Qual o efeito no histórico?
- **Situação:** **A DEFINIR** no contrato da feature de escalas, segundo o PO.
- **Limite já decidido:** nada com histórico é apagado ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]], [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-012 — Inativação, arquivamento e exclusão|DATA-DEC-012]]).
- **Afeta:** [[modulos/DISPONIBILIDADE]], [[modulos/ESCALAS]], [[modulos/MEMBROS]].

### Pausar ou excluir os projetos antigos — DATA-DEC-022
- **Pergunta:** quando pausar ou excluir os projetos Supabase antigos `ehbidizpzxhfusfyjgtl` e `fiurvpkieiorngshjric`?
- **Situação:** decisão operacional do PO, com data **A DEFINIR**.
- **Por que importa:** enquanto estiverem ativos, os riscos S1–S11 continuam existindo neles ([[seguranca/RISCOS-DO-LEGADO]]).
- **Afeta:** [[tecnico/LEGADO-ATUAL]], [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]].

### Cancelamento de Programação
- **Situação:** nada foi decidido. A decisão de 2026-10-22 trata só da Escala. **A DEFINIR**, se o tema aparecer.
- **Afeta:** [[modulos/PROGRAMACOES]], [[dados/STATUS]].

### Lacunas observadas no registro de 2026-10-21
Pontos que o vault-brain notou ao aplicar as decisões. Não estavam na lista do relatório e ficaram **A DEFINIR** para o Arquiteto avaliar no contrato FOUNDATION-002. O Arquiteto os levou ao PO como bloqueios B-01 a B-04 do contrato, e **o PO respondeu em 2026-10-22**, aceitando as recomendações ([[decisoes/DEC-09-MODELO-DE-DADOS#Respostas do PO aos bloqueios da FOUNDATION-002|DEC-09]]; [[features/FOUNDATION-002]]):
- quais status de alocação contam como "ativa" para a [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-014 — A mesma pessoa mais de uma vez na mesma escala|DATA-DEC-014]]: **DECIDIDA em 2026-10-22** (B-03): AGUARDANDO_CONFIRMACAO e CONFIRMADA. Vale para a FOUNDATION-004;
- o nome do schema dedicado da DATA-DEC-020 (`mescala` era exemplo do relatório): **DECIDIDA em 2026-10-22** (B-01): `mescala`;
- o fluxo de convite, que a DATA-DEC-011 diz que precisa ser documentado: **escopo decidido em 2026-10-22** (B-04): `invitations` nasce com a feature de convites. O fluxo, as transições e o papel pretendido continuam **A DEFINIR**, no contrato dessa feature;
- os valores do status da Igreja, que a decisão de 2026-10-22 sobre a DATA-DEC-012 não cita (acrescentada em 2026-10-22): **DECIDIDA em 2026-10-22** (B-02): ATIVO, INATIVO. O efeito de uma igreja INATIVO (acesso, leitura e escrita) continua **A DEFINIR**, na feature que inativar a igreja.

Superadas em 2026-10-22, pela decisão de que o legado não tem uso real: o destino das `escalas` legadas caso o inventário mostrasse dados, e a forma de copiar os dados do legado para o projeto novo.

---

## Outras pendências registradas
- **Contrato FOUNDATION-002 — Fundação de Persistência:** **emitido em 2026-10-22** pelo [[agents/arquiteto|Arquiteto]]; **VERSÃO 2, READY**; fechamento em 2026-10-23, sem nova versão (commit `8ee70a6`). Registro: [[features/FOUNDATION-002]]. Até 2026-10-22, "contrato ainda não emitido".
- **Autorização da Fase 4:** **concedida pelo PO em 2026-10-22** para a FOUNDATION-002. As 9 migrations foram escritas em `backend/supabase/migrations/` e **aplicadas em 2026-10-23**. Continua valendo: nenhuma migration é criada sem contrato e sem autorização explícita do PO.
- **Aplicação da FOUNDATION-002:** **aplicadas em 2026-10-23** pelo PO, no projeto oficial, pelo SQL Editor, arquivo por arquivo (commit `028f9ff`), depois da fase 1b do QA, da confirmação do delta pelo Arquiteto, do Organizador e do S15/S16 do QA. ARCHITECT REVIEW final APPROVED_WITH_NOTES em 2026-10-23; feature encerrada ([[features/FOUNDATION-002#Situação em 2026-10-24|situação]]). Até 2026-10-23, **pendente**.
- **Inventário do banco legado:** **dispensado em 2026-10-22** (app legado sem uso real; sem migração de dados).
- **Ordem do ADR-002:** **cumprida quanto à [[features/FOUNDATION-001]]** (implementada e aprovada em 2026-10-19, commit `7f26d30`). A fundação oficial de persistência, que vem em seguida, é a FOUNDATION-002: contrato VERSÃO 2 READY e Fase 4 autorizada em 2026-10-22; aplicada no banco oficial em 2026-10-23 e encerrada (APPROVED_WITH_NOTES). A AUTH-001, que não usa banco, correu em paralelo e foi encerrada em 2026-10-22 ([[features/AUTH-001]]).
- **Regras de autorização em aberto** (relatório, seção 7; a fechar com o Arquiteto, não bloqueiam o schema):
  - ADMIN gerencia todos os ministérios?
  - O que o LEADER pode fazer fora da escala?
  - Quem cria programações? (o canvas diz que ADMIN e LEADER administram "agenda e cronograma de cultos")
- **Plano de migração do frontend legado para `/backend`:** necessita decisão (D1 em [[tecnico/DIVERGENCIAS-LEGADO]]). Em 2026-10-22 o PO registrou que o app legado não tem uso real; o que acontece com o frontend legado não foi decidido.
- **Versionamento do legado:** **resolvida.** O relatório recomendava commitar as 3 migrations de julho e a função `aceitar-convite-cadastro`. O commit `0394893` (2026-10-06 20:13) versionou esses arquivos e também `src/lib/profiles.ts`, `brain-mescala/`, `docs/`, `.claude/` e `daily/`. Esta nota dizia que eles continuavam fora do git porque se baseava no `git status` anterior a esse commit (divergência D5, apontada na análise da AUTH-001). Em 2026-10-21, só `docs/features/AUTH-001.md` estava fora do git, além do que o `.gitignore` ignora de propósito ([[tecnico/LEGADO-ATUAL]]). **Correção de 2026-10-22:** `docs/features/AUTH-001.md` está versionado desde o commit `50a1cd6` (v1, 2026-10-22 00:37) e foi atualizado para a v2 no `4039fe0`; a Brain continuou dizendo "fora do git" depois disso.

### RT-FOUND-01 — Dívida de tooling no backend
- **Origem:** ARQ-FOUND-01, aceita pelo Arquiteto na revisão da [[features/FOUNDATION-001]] (APPROVED em 2026-10-19). Risco aceito com condições; a reavaliação continua pendente.
- **O que é:** 5 vulnerabilidades altas, de um único advisory, GHSA-vfj7-8cjw-p6xm (`braces` ≤ 3.0.3). Ficam só na cadeia de lint (`eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`) e são todas `dev`.
- **Condições:**
  - proibidos `npm audit fix --force`, downgrade de `next` ou de `eslint-config-next` e `overrides` sem decisão registrada;
  - `npm audit --omit=dev` = 0 é condição de encerramento de toda feature que altere dependências do `/backend`. Vulnerabilidade de produção nunca é aceita implicitamente.
- **Reavaliar:** quando houver versão sem essa cadeia ou corrigida, e antes de qualquer decisão de CI/deploy.
- **Cumprimento pela AUTH-001 (2026-10-22):** a [[features/AUTH-001]] alterou dependências do `/backend` (`jose` 6.2.13 e `vitest` 5.0.5) e cumpriu a condição: `npm audit --omit=dev` = 0; `npm audit` sem advisory além do GHSA-vfj7-8cjw-p6xm. O risco continua aceito, com as mesmas condições.
- **Notas afetadas:** [[tecnico/BACKEND]], [[agents/qa]], [[agents/desenvolvedor-backend]], [[features/FLUXO-DE-ENTREGA]].

### L-06 — Arquivos .jsx fora das guardas de lint
- **Situação:** **ENCERRADO em 2026-10-22** pela [[features/AUTH-001]] (ARCHITECT REVIEW APPROVED_WITH_NOTES). O título é mantido para não quebrar links ([[tecnico/CONVENCOES]]).
- **Correção:** em `backend/eslint.config.mjs`, `jsx` no `files` das duas guardas; itens 1 e 2 do cabeçalho com "Arquivos cobertos: .ts, .tsx, .mts, .cts, .js, .jsx, .mjs e .cjs"; redação sobre `import()` de tipo corrigida. Provas: casos `.jsx` de GL3, GL7 e GL10 na suíte GL (`backend/eslint.config.test.ts`).
- **O encerramento não autoriza** `.jsx`, `allowJs` nem mudança de `pageExtensions`.
- **Regra permanente:** a condição (a) vira regra estrutural: **nenhum `.jsx` em `backend/src`** (BACKEND ONLY, sem React); Organizador e QA conferem em toda feature. A condição (c) ficou sem objeto.
- **Origem (histórico):** limite novo, aceito e não bloqueante, registrado na revisão da [[features/FOUNDATION-001]] (APPROVED em 2026-10-19). Aberto de 2026-10-19 a 2026-10-22.
- **O que era:** `.jsx` ficava fora das duas guardas de lint do ADR-002, e o Next 16.4.2 aceita `route.jsx` como rota.
- **Condições, enquanto aberto (histórico):**
  - **(a)** enquanto o L-06 estiver aberto, nenhum `.jsx` em `backend/src`; o QA confere em toda feature;
  - **(b)** a correção (acrescentar `jsx` ao `files` das duas guardas, declarar "Arquivos cobertos" também no item 2 do cabeçalho e ajustar a redação ligada a `import()` de tipo) é especificada pelo Arquiteto no contrato do primeiro gatilho: qualquer feature que altere o `eslint.config.mjs`; qualquer proposta de aceitar `.jsx`, ligar `allowJs` ou alterar `pageExtensions`; ou antes de CI/deploy;
  - **(c)** o PO pode antecipar a correção como mudança isolada.
- **Notas afetadas:** [[tecnico/BACKEND]], [[agents/qa]], [[features/FLUXO-DE-ENTREGA]].

### L-07 — Guarda 2b não normaliza o especificador
- **Origem:** QA da [[features/AUTH-001]] (O-12), aceito pelo Arquiteto em 2026-10-22. **Aberto, não bloqueante.**
- **O que é:** a parte 2b da guarda 2 (`src/app/**` não importa `infrastructure/supabase-auth`) compara o texto do especificador. Especificadores não normalizados (`@/infrastructure/./supabase-auth/...`, `@/infrastructure//supabase-auth/...`) não são acusados, nem em import estático nem em `import()`. Outras variações não foram sondadas, e não foi verificado se TypeScript e Turbopack resolvem esses especificadores. Por desenho, uma reexportação a partir de outro módulo de `@/infrastructure` também contorna a guarda.
- **Natureza:** protege contra violação acidental; não é barreira contra contorno deliberado (como o L-05).
- **Condições:**
  - **(a)** imports sempre na forma canônica (`@/` entre áreas, `./` na mesma pasta, sem segmentos `.`, sem `..` no meio, sem `//`), conferidos pelo Organizador e pelo QA em toda feature (S12);
  - **(b)** nenhum módulo fora de `infrastructure/supabase-auth` reexporta símbolos dela;
  - **(c)** reavaliar se aparecer caso real ou se uma feature propuser regra de lint que resolva caminhos (exige contrato e verificação pela [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]]).
- **Notas afetadas:** [[tecnico/BACKEND]], [[agents/qa]], [[agents/organizador]], [[features/FLUXO-DE-ENTREGA]].

### RT-AUTH-01 — Cache de segmento do Next sobre a busca do JWKS
- **Origem:** observação do Desenvolvedor na [[features/AUTH-001]] (O-2), confirmada pelo QA em `next/dist/server/lib/patch-fetch.js:523-528` (Next 16.4.2). Aceito em 2026-10-22.
- **O que é:** o verificador busca o JWKS com `cache: "no-store"` (AUTH-001, regra 6). Com `export const fetchCache = 'force-cache'` num segmento de rota, a revalidação 0 vira cache infinito: uma chave nova seria rejeitada depois da rotação, e uma chave retirada continuaria aceita. Com `'only-cache'`, o Next lança erro na busca `no-store` e a verificação falha fechada (`AUTH_VERIFICATION_UNAVAILABLE`).
- **Situação:** nenhum segmento declara `fetchCache` e ainda não há rota protegida; a regra 6 está cumprida no estado atual. O limite está documentado no cabeçalho de `supabase-access-token-verifier.ts`.
- **Condições:**
  - **(a)** até a guarda existir, nenhum arquivo em `src/app/**` declara `fetchCache` (o QA confere em toda feature);
  - **(b)** o contrato da AUTH-003 especifica uma guarda de lint em `src/app/**` contra `fetchCache` (no mínimo `'force-cache'`, `'only-cache'` e reexportação), com casos na suíte GL, e a verificação da regra 6 em runtime;
  - **(c)** a AUTH-003 avalia também `dynamic = 'force-static'`, `revalidate` e `"use cache"` (hoje nenhuma habilitada, D-01).
- **Notas afetadas:** [[tecnico/BACKEND]], [[agents/qa]], [[features/FLUXO-DE-ENTREGA]], [[seguranca/AUTENTICACAO]].

### RT-AUTH-02 — Composição padrão no domínio
- **Origem:** Organizador da [[features/AUTH-001]] (O-8). Permitido pela regra 11 da AUTH-001. Aceito como **dívida estrutural** em 2026-10-22.
- **O que é:** ciclo entre as pastas `domains/auth` e `infrastructure/supabase-auth`, não entre arquivos. O domínio define o contrato (`VerifyAccessToken`, tipo de função) e o erro; a infraestrutura implementa e importa do domínio só tipos e erro; `requireAuthenticatedIdentity` recebe o verificador da infraestrutura como parâmetro com valor padrão.
- **Não é padrão geral:** outra feature só usa essa forma se o contrato autorizar.
- **Reavaliar quando:** (a) surgir a camada Application com o primeiro caso de uso; (b) surgir uma segunda implementação de `VerifyAccessToken`; (c) a [[#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]] definir como os repositórios são compostos.
- **Notas afetadas:** [[tecnico/BACKEND]], [[agents/organizador]].

### ARQ-AUTH-01 — Leitura literal das validações de claims
- **Origem:** QA da [[features/AUTH-001]] (O-4). Interpretação aceita pelo Arquiteto em 2026-10-22. Não é risco nem limite: fica aqui pelas consequências para features futuras.
- **O que é:** o código segue a letra do [[decisoes/ADR-003-AUTENTICACAO|ADR-003]] (item 5) e da FC-5:
  - `session_id` só com espaços é aceito (regra "string não vazia"; formato não exigido);
  - `is_anonymous: "true"` (string) é aceito (regra "diferente de `true`" booleano);
  - `exp` vencido com assinatura válida → `AUTH_TOKEN_EXPIRED`, mesmo com `role` ou `sub` inválidos (o `jose` confere `exp` antes das checagens do Mescala).

  Nenhum devolve identidade; os dois primeiros exigem assinatura do provedor, que emite UUID e booleano.
- **Consequências:**
  - **(a)** `AUTH_TOKEN_EXPIRED` significa só "não autenticado, token vencido"; não atesta os demais claims. O mapeamento HTTP ([[#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]]) e o provisionamento (AUTH-002) não podem tratar esse código como prova de conta legítima;
  - **(b)** se o PO adotar um Custom Access Token Hook, a validação de tipo de `role`, `is_anonymous` e `session_id` é reaberta em contrato próprio;
  - **(c)** se a revogação por sessão (B8) usar `sessionId` como chave, o contrato dela decide se exige formato UUID.
- **Notas afetadas:** [[tecnico/API]], [[seguranca/AUTENTICACAO]].

### Cache do Supabase CLI no git
- **Situação:** **resolvida no repositório.** O commit `a034046` ("chore: remove cache local do Supabase do versionamento") tirou `supabase/.temp/` do git e o acrescentou ao `.gitignore`. Conferido com `git log` em 2026-10-21.
- **Fato registrado antes:** `supabase/.temp/` estava versionado desde o commit `a6447fc` (2026-07-11). É cache do Supabase CLI: project ref, nome do projeto e da organização, versões dos serviços e a URL do pooler com o usuário, **sem senha**.
- **Avaliação da análise da AUTH-001:** baixo risco; não é segredo, mas é cache do CLI e não deveria estar no git.
- **Observação:** o histórico do git anterior ao `a034046` ainda contém esses arquivos.
- **Notas afetadas:** [[tecnico/LEGADO-ATUAL]].

## Lacunas que já estavam marcadas como A DEFINIR na Brain
- Contratos e endpoints: [[tecnico/API]] (padrão HTTP de erros: proposta [[#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]]).
- Provider e mecanismo de autenticação: **decididos** pelo [[decisoes/ADR-003-AUTENTICACAO|ADR-003]] em 2026-10-21 ([[seguranca/AUTENTICACAO]]). Continuam abertos o provisionamento ([[#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]]) e as [[#Condições operacionais do ADR-003|condições operacionais]].
- Canais e política de entrega: [[modulos/NOTIFICACOES]].
- Indicadores e filtros: [[modulos/RELATORIOS]].
- Transições de status: [[dados/STATUS]]. Parte decidida pela [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-016 — Status e transições|DATA-DEC-016]] e pela remoção de CANCELADA da Escala (2026-10-22); a lista completa de transições continua a validar.
- ORM e query builder: [[#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]]. Biblioteca de testes: decidida ([[decisoes/DEC-02-BIBLIOTECA-DE-TESTES|DEC-02]]). Mecanismo de auditoria: decidido ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 — Auditoria|DATA-DEC-021]]). Validação e eventos: continuam fora do [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] e **A DEFINIR**. `zod` aparece no lockfile do `/backend` só como transitivo, o que não é aprovação ([[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]]).

## Matriz do relatório: o que fica parado
**Histórico: situação até 2026-10-21.** Depois do aceite, a matriz atualizada está em [[decisoes/DEC-09-MODELO-DE-DADOS#Matriz do relatório depois do aceite|DEC-09]].

| Parte do modelo oficial | Bloqueada por (até 2026-10-21) |
|---|---|
| Usuários | DATA-DEC-013, DATA-DEC-019 (+ DEC-03) |
| Vínculos com igreja e ministério | DATA-DEC-005 a 009, DATA-DEC-012 |
| Ministérios e funções | DATA-DEC-001, 012, 013 |
| Programações e participação | DATA-DEC-003, 004 |
| Escalas e alocações | DATA-DEC-014, 015, 016 |
| Disponibilidade | DATA-DEC-017 |
| Convites | DATA-DEC-011 |
| Auditoria | DATA-DEC-021 |
| Policies de RLS | DATA-DEC-020 (+ DEC-04) |
| Nomes de tudo | DATA-DEC-001, 018 |
| Migração de dados | DATA-DEC-022 + inventário |
| Hotfix do legado | DATA-DEC-023 |

Relacionados: [[MOCs/MOC-GOVERNANCA]], [[00-MOC-MESCALA]], [[features/FLUXO-DE-ENTREGA]], [[features/FOUNDATION-001]], [[features/AUTH-001]], [[features/FOUNDATION-002]], [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES]], [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]], [[decisoes/DEC-09-MODELO-DE-DADOS]], [[decisoes/ADR-003-AUTENTICACAO]], [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]], [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]], [[tecnico/LEGADO-ATUAL]].

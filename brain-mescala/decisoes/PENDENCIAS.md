---
tipo: indice-pendencias
status: pendente
area: governanca
atualizado: 2026-10-20
relacionado:
  - "[[MOCs/MOC-GOVERNANCA]]"
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]]"
  - "[[features/FOUNDATION-001]]"
  - "[[tecnico/DIVERGENCIAS-LEGADO]]"
  - "[[seguranca/RISCOS-DO-LEGADO]]"
---
# Decisões pendentes

> **Nada nesta nota está decidido.** Ela só lista as perguntas em aberto e o que cada uma bloqueia. Enquanto uma decisão estiver pendente, o ponto que ela cobre é **A DEFINIR**: o [[agents/arquiteto|Arquiteto]] o trata como BLOQUEIO DE DOMÍNIO e o [[agents/analista-de-dados|Analista de Dados]] como DATA MODEL BLOCKED.

Exceção: [[#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]] e [[#L-06 — Arquivos .jsx fora das guardas de lint|L-06]] são risco e limite **já aceitos** pelo Arquiteto. Estão aqui porque as condições e a reavaliação deles continuam abertas.

## Fontes
- **DEC-02, DEC-03 e DEC-04:** seção "Decisões pendentes" do Feature Contract `docs/features/FOUNDATION-001.md` (fora do vault). Registro no vault: [[features/FOUNDATION-001]].
- **AUTH-001 e as propostas DEC-05, DEC-06 e DEC-07:** análise e contrato `docs/features/AUTH-001.md` (fora do vault e fora do git), emitidos pelo Arquiteto em 2026-10-06 e **aguardando aprovação do PO**. Os números estão reservados; nada foi decidido.
- **RT-FOUND-01 e L-06:** ARCHITECT REVIEW da FOUNDATION-001 (APPROVED em 2026-10-19), que não foi gravada em arquivo. Registro permanente: [[features/FOUNDATION-001]].
- **DATA-DEC-001 a DATA-DEC-023:** seção 14 do relatório `docs/data/DATA-ARCHITECTURE-REPORT.md` (fora do vault), emitido pelo Analista de Dados em 2026-10-04 com status **AGUARDANDO DECISÕES DO PO**. As opções (A, B, C) e a recomendação do analista para cada uma estão no relatório. **Até 2026-10-06 nenhuma foi aceita.**
- No relatório, as tabelas abreviam "DATA-DEC-0xx" como "DEC-0xx" (três dígitos). DEC-02, DEC-03 e DEC-04 (dois dígitos) são outra série: decisões técnicas da arquitetura.

## Decisões já aceitas (para contraste)
- [[decisoes/ADR-001-ESTRUTURA-INICIAL]]
- [[decisoes/ADR-002-BACKEND-OFICIAL]]
- [[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]
- [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]] (ARQ-FOUND-02, aceita em 2026-10-19)

---

## Decisões técnicas da arquitetura (FOUNDATION-001)

O [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] deixa essas escolhas fora do seu escopo ("Decisões ainda não definidas por este ADR"). Nenhuma bloqueou a [[features/FOUNDATION-001]], encerrada em 2026-10-19; as três continuam abertas. O relatório de dados sugere registrar DEC-03 e DEC-04 como ADRs.

### DEC-02 — Biblioteca oficial de testes e quem escreve os testes
- **Bloqueia:** a regressão automatizada dos cenários B1–B3 da FOUNDATION-001 e todas as features de negócio. O contrato pede a decisão antes da primeira feature de negócio.
- **Também bloqueia:** o READY da [[#AUTH-001 — Fundação de Autenticação|AUTH-001]], cujo contrato depende de testes automatizados.
- **Efeito atual:** o [[agents/qa|QA]] não cria arquivos de teste nem usa executor de testes; cenários que exigem teste automatizado ficam NOT TESTED.
- **Quando for decidida:** a [[features/FOUNDATION-001#Verificação mínima de regressão do lint|verificação mínima de regressão do lint]] da FOUNDATION-001 vira o teste automatizado B3.
- **Notas afetadas:** [[agents/qa]], [[agents/desenvolvedor-backend]], [[tecnico/BACKEND]], [[features/FLUXO-DE-ENTREGA]].

### DEC-03 — Autenticação
- **Bloqueia:** o contexto de igreja e qualquer rota protegida. Bloqueia em parte a [[#DATA-DEC-019 — Identidade × provedor de autenticação|DATA-DEC-019]].
- **Também bloqueia:** o READY da [[#AUTH-001 — Fundação de Autenticação|AUTH-001]].
- **Proposta aguardando aprovação:** a AUTH-001 propõe um ADR-003 para resolver esta decisão (recomendação: Supabase Auth com validação local do access token pelo JWKS público). **É só proposta: a DEC-03 continua aberta e não existe ADR-003.**
- **Notas afetadas:** [[seguranca/AUTENTICACAO]], [[seguranca/ISOLAMENTO-DE-DADOS]], [[tecnico/API]], [[tecnico/BACKEND]].

### DEC-04 — Estratégia de migrations e forma de acesso ao banco
- **Bloqueia:** a fundação oficial de persistência e a [[#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]].
- **Efeito atual:** migrations continuam sendo criadas em `supabase/migrations/` (único padrão existente) e aplicadas manualmente pelo responsável. O [[agents/desenvolvedor-backend|Desenvolvedor]] não pode presumir transação nem proteção por RLS enquanto a forma de acesso não for decidida.
- **Notas afetadas:** [[tecnico/BANCO-DE-DADOS]], [[agents/analista-de-dados]], [[agents/desenvolvedor-backend]].

---

## AUTH-001: contrato aguardando aprovação do PO

> **Nada desta seção foi aprovado.** O contrato e as decisões abaixo são propostas do [[agents/arquiteto|Arquiteto]]. Os números DEC-05, DEC-06 e DEC-07 estão reservados para elas; nenhuma foi decidida.

### AUTH-001 — Fundação de Autenticação
- **Situação:** análise e contrato emitidos pelo Arquiteto em 2026-10-06, em `docs/features/AUTH-001.md` (fora do vault e **fora do git**). O documento está **aguardando aprovação do PO** e registra que nada foi encaminhado aos executores.
- **Status do contrato:** **BLOCKED** até três condições:
  - o PO aceitar o ADR-003 proposto, que resolveria a [[#DEC-03 — Autenticação|DEC-03]];
  - a [[#DEC-02 — Biblioteca oficial de testes e quem escreve os testes|DEC-02]] ser decidida;
  - a [[features/FOUNDATION-001]] estar aprovada. **Cumprida em 2026-10-19.**
- **Escopo proposto:** verificar o access token e devolver a identidade do provedor, sem banco, sem igreja e sem rota nova. O usuário do Mescala fica para features seguintes, também propostas (AUTH-002 e AUTH-003).
- **Recomendação (proposta, não aceita):** Supabase Auth do projeto oficial como provedor, com o backend validando localmente o access token pelo JWKS público. O texto do ADR-003 existe só no documento da AUTH-001; **não há ADR-003 no vault**.
- **Também aponta, sem número:** a revogação do usuário no domínio (bloqueio B8, para a AUTH-003). **A DEFINIR.**
- **Divergências apontadas:** D4, sobre o projeto Supabase ([[#DEC-05 — Projeto Supabase oficial|DEC-05]]), e D5, sobre a Brain dizer que arquivos já versionados estavam fora do git (corrigida em 2026-10-20). Ver [[tecnico/DIVERGENCIAS-LEGADO]].
- **Se o PO aprovar:** o documento pede ao vault-brain que grave o ADR-003 e atualize [[seguranca/AUTENTICACAO]], esta nota e [[features/FLUXO-DE-ENTREGA]].

### DEC-05 — Projeto Supabase oficial
- **Situação:** proposta pela AUTH-001 (divergência D4). **Não decidida.**
- **Pergunta:** qual é o projeto Supabase oficial?
- **Contexto:** o `.env` do app e o vínculo do Supabase CLI (`supabase/.temp/linked-project.json`, nome "Projeto Mescala") apontam para `ehbidizpzxhfusfyjgtl`; o `supabase/config.toml` aponta para `fiurvpkieiorngshjric`. As opções e a recomendação estão no documento da AUTH-001.
- **Bloqueia, segundo a AUTH-001:** a operação da AUTH-001 (não a implementação) e a consulta de inventário do banco (seção 1.3 do relatório de dados).
- **Notas afetadas:** [[seguranca/AUTENTICACAO]], [[tecnico/LEGADO-ATUAL]], [[tecnico/BANCO-DE-DADOS]].

### DEC-06 — Provisionamento do usuário do Mescala
- **Situação:** proposta pela AUTH-001 (bloqueio B7). **Não decidida.**
- **Pergunta:** como nasce o registro do usuário do Mescala depois que a conta é criada no provedor de autenticação?
- **Contexto:** a Brain diz "Usuário cria ou acessa sua conta" ([[fluxos/FLUXO-CADASTRO-IGREJA]]), sem dizer como o registro do Mescala nasce. Ligada à [[#DATA-DEC-019 — Identidade × provedor de autenticação|DATA-DEC-019]]. As opções e a recomendação estão no documento da AUTH-001.
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

### DATA-DEC-001 — Equipe × Ministério
- **Pergunta:** Equipe e Ministério são o mesmo conceito? Se forem, qual é o nome canônico? Ou um Ministério contém Equipes?
- **Contexto:** as notas da Brain dizem "Equipe". O [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] (`ministry`), o [[Fluxograma.canvas]] ("Líder de Ministério") e o Data Task do PO dizem "Ministério". O legado usa a tabela `equipes`.
- **Regra de vocabulário:** até a decisão, as notas continuam dizendo "Equipe". Não trocar o termo.
- **Bloqueia:** os nomes de tudo no modelo oficial (com a 018) e as tabelas de ministério e função (com a 012 e a 013).
- **Notas afetadas:** [[modulos/EQUIPES]], [[modulos/FUNCOES]], [[03-DOMINIO]], [[04-USUARIOS-E-PERMISSOES]], [[dados/ENTIDADES]], [[fluxos/FLUXO-EQUIPES]], [[produto/CONCEITOS-DO-CANVAS]].

### DATA-DEC-002 — Mapeamento dos termos do Data Task
- **Pergunta:** os termos do Data Task do PO (Convocações, Confirmações, Ausências, Permissões, Funções ministeriais) correspondem a conceitos que a Brain já tem (Alocação, status da Alocação, Disponibilidade, papel + escopo, Função)? Ou algum deles é entidade própria?
- **Bloqueia:** não aparece na matriz de bloqueios do relatório.
- **Notas afetadas:** [[dados/ENTIDADES]], [[modulos/DISPONIBILIDADE]], [[modulos/FUNCOES]], [[fluxos/FLUXO-CONFIRMACAO]], [[04-USUARIOS-E-PERMISSOES]].

### DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma
- **Pergunta:** Culto é um tipo de Programação? O que é Cronograma? Agenda é entidade ou só uma consulta? Reunião e Comissão (com pauta) entram agora?
- **Contexto:** só Programação tem definição operacional na Brain. Os demais termos aparecem só no canvas ([[produto/CONCEITOS-DO-CANVAS]]). O ADR-002 lista os domínios `worship-service`, `meeting` e `commission`.
- **Bloqueia:** programações e participação das equipes (com a 004).
- **Notas afetadas:** [[modulos/PROGRAMACOES]], [[fluxos/FLUXO-PROGRAMACOES]], [[produto/CONCEITOS-DO-CANVAS]], [[03-DOMINIO]].

### DATA-DEC-004 — Programações recorrentes
- **Pergunta:** existem programações recorrentes? Com quais regras?
- **Contexto:** a Brain fala em "data e intervalo de horário" e não menciona recorrência. A tabela legada `eventos` guarda um modelo semanal (dia + hora), sem data e sem fim ([[tecnico/LEGADO-ATUAL]]).
- **Bloqueia:** programações (com a 003).
- **Notas afetadas:** [[modulos/PROGRAMACOES]], [[fluxos/FLUXO-PROGRAMACOES]], [[05-REGRAS-DE-NEGOCIO#ESC-001 — Conflito de horário|ESC-001]].

## Decisões de dados — Bloco B: identidade, papéis e vínculos

### DATA-DEC-005 — Papéis em cada camada
- **Pergunta:** LEADER e MEMBER existem nos dois níveis (igreja e equipe)? OWNER inclui ADMIN? O que significa "ANCIÃO"?
- **Contexto:** a nota [[04-USUARIOS-E-PERMISSOES]] lista OWNER, ADMIN, LEADER e MEMBER como papéis da igreja e diz que "podem existir" LEADER e MEMBER por equipe. O canvas mostra "ADMIN(ANCIÃO)" e OWNER com "ACESSO LIVRE A TUDO". O legado usa outro conjunto de papéis (ver D2 em [[tecnico/DIVERGENCIAS-LEGADO]]).
- **Bloqueia:** os vínculos com igreja e com equipe (com 006 a 009 e 012).
- **Notas afetadas:** [[04-USUARIOS-E-PERMISSOES]], [[seguranca/AUTORIZACAO]], [[fluxos/FLUXO-MEMBROS]], [[produto/PERSONAS]], [[produto/CONCEITOS-DO-CANVAS]].

### DATA-DEC-006 — Usuário em mais de uma igreja
- **Pergunta:** um usuário pode estar vinculado a mais de uma igreja?
- **Contexto:** a Brain não diz nada.
- **Bloqueia:** os vínculos.
- **Notas afetadas:** [[04-USUARIOS-E-PERMISSOES]], [[modulos/IGREJAS]], [[dados/RELACIONAMENTOS]], [[seguranca/ISOLAMENTO-DE-DADOS]].

### DATA-DEC-007 — Quantidade de OWNER por igreja
- **Pergunta:** uma igreja tem exatamente um OWNER ou pode ter vários?
- **Contexto:** a Brain diz que o criador torna-se OWNER ([[fluxos/FLUXO-CADASTRO-IGREJA]]); a persona "Master / Owner" aparece no singular ([[produto/PERSONAS]]).
- **Bloqueia:** os vínculos.
- **Notas afetadas:** [[fluxos/FLUXO-CADASTRO-IGREJA]], [[modulos/IGREJAS]], [[04-USUARIOS-E-PERMISSOES]].

### DATA-DEC-008 — Quantidade de LEADER por ministério
- **Pergunta:** uma equipe tem um único líder ou pode ter vários?
- **Contexto:** a Brain não diz nada. O legado guarda um único `lider_id` na equipe.
- **Bloqueia:** os vínculos.
- **Notas afetadas:** [[modulos/EQUIPES]], [[fluxos/FLUXO-EQUIPES]], [[04-USUARIOS-E-PERMISSOES]].

### DATA-DEC-009 — Papel único por usuário em cada ministério
- **Pergunta:** um usuário tem um único papel em cada equipe ou pode ter vários?
- **Bloqueia:** os vínculos.
- **Notas afetadas:** [[modulos/EQUIPES]], [[modulos/MEMBROS]], [[04-USUARIOS-E-PERMISSOES]], [[dados/ENTIDADES#Alocação|Alocação]].

### DATA-DEC-010 — Membro sem conta
- **Pergunta:** uma pessoa sem conta pode ser membro e ser escalada?
- **Contexto:** a Brain diz "Membros são usuários vinculados a uma igreja" ([[modulos/MEMBROS]]). O legado tem a tabela `member_contacts`, em que o líder cadastra pessoas sem conta.
- **Bloqueia:** não aparece na matriz; afeta a definição de Membro.
- **Notas afetadas:** [[modulos/MEMBROS]], [[fluxos/FLUXO-MEMBROS]], [[dados/ENTIDADES]].

### DATA-DEC-011 — Convites
- **Pergunta:** o modelo oficial tem convite? Com quais status, regras e efeitos no aceite?
- **Contexto:** a Brain não tem convite. O legado faz convite por email com token, e a regra legada de quem convida quem está descrita em [[tecnico/LEGADO-ATUAL]]. Vários riscos do legado envolvem convites ([[seguranca/RISCOS-DO-LEGADO]]: S2, S3, S7, S8).
- **Bloqueia:** a tabela de convites.
- **Notas afetadas:** [[modulos/MEMBROS]], [[fluxos/FLUXO-MEMBROS]], [[fluxos/FLUXO-EQUIPES]], [[seguranca/AUTENTICACAO]].

### DATA-DEC-012 — Inativação, arquivamento e exclusão
- **Pergunta:** igreja, equipe, vínculos e funções podem ser inativados, arquivados ou excluídos? Como o histórico é preservado?
- **Contexto:** a Brain exige histórico auditável ([[05-REGRAS-DE-NEGOCIO#ESC-004 — Histórico de substituição|ESC-004]], [[seguranca/AUDITORIA]]) e trata CANCELADA como status ([[dados/STATUS]]). Não diz nada sobre arquivar ou excluir. No legado, apagar uma igreja ou um usuário apaga o histórico em cascata.
- **Bloqueia:** os vínculos e as tabelas de equipe e função.
- **Notas afetadas:** [[modulos/IGREJAS]], [[modulos/EQUIPES]], [[modulos/FUNCOES]], [[dados/STATUS]], [[seguranca/AUDITORIA]].

### DATA-DEC-013 — Atributos e unicidade de nomes
- **Pergunta:** quais atributos cada entidade tem (pessoa, igreja, equipe, função, programação)? Nomes de equipe e de função são únicos no seu escopo?
- **Contexto:** a Brain não define atributos. O legado tem campos sem correspondência na Brain (quantidade por culto, suplentes, formulário de ausência, data de nascimento, `confirmado`).
- **Bloqueia:** usuários, equipes e funções.
- **Notas afetadas:** [[dados/ENTIDADES]], [[modulos/IGREJAS]], [[modulos/EQUIPES]], [[modulos/MEMBROS]].

## Decisões de dados — Bloco C: escalas

### DATA-DEC-014 — A mesma pessoa mais de uma vez na mesma escala
- **Pergunta:** a mesma pessoa pode ter mais de uma alocação na mesma escala? Se puder, quais combinações são compatíveis?
- **Contexto:** o [[05-REGRAS-DE-NEGOCIO#ESC-001 — Conflito de horário|ESC-001]] proíbe alocações "incompatíveis" sobrepostas, mas não define o que é compatível.
- **Bloqueia:** escalas e alocações.
- **Notas afetadas:** [[modulos/ESCALAS]], [[dados/ENTIDADES#Alocação|Alocação]], [[05-REGRAS-DE-NEGOCIO]].

### DATA-DEC-015 — Modelo de substituição
- **Pergunta:** como a substituição é representada nos dados, mantendo o membro original no histórico?
- **Contexto:** a Brain diz que o novo membro assume a alocação operacional e o original permanece no histórico ([[fluxos/FLUXO-SUBSTITUICAO]]); o status SUBSTITUIDA pertence à alocação ([[dados/STATUS]]).
- **Bloqueia:** escalas e alocações.
- **Notas afetadas:** [[fluxos/FLUXO-SUBSTITUICAO]], [[05-REGRAS-DE-NEGOCIO#ESC-004 — Histórico de substituição|ESC-004]], [[dados/STATUS]].

### DATA-DEC-016 — Status e transições
- **Pergunta:** quem valida as transições (só o backend ou também o banco)? E, em aberto na Brain:
  - (a) o estado da alocação enquanto a escala é RASCUNHO;
  - (b) se CONCLUIDA é manual ou automática depois da data;
  - (c) se cancelar a escala muda o status das alocações;
  - (d) se "confirmação" em [[dados/ENTIDADES]] é só o status ou guarda também a data da resposta;
  - (e) se uma escala em rascunho pode ser apagada.
- **Contexto:** [[dados/STATUS]] lista os valores e diz que as transições devem ser validadas antes da implementação definitiva.
- **Bloqueia:** escalas e alocações.
- **Notas afetadas:** [[dados/STATUS]], [[05-REGRAS-DE-NEGOCIO#ESC-003 — Estado controlado|ESC-003]], [[modulos/ESCALAS]], [[fluxos/FLUXO-ESCALAS]], [[fluxos/FLUXO-CONFIRMACAO]].

### DATA-DEC-017 — Disponibilidade
- **Pergunta:** qual o tipo (impedimento, disponibilidade ou ambos), o escopo (igreja ou equipe), a recorrência e quem registra?
- **Contexto:** a Brain fala em "impedimentos ou disponibilidade… datas ou intervalos", associada ao membro. A tabela legada `ausencias` guarda uma data por equipe e não é usada por nenhuma tela.
- **Bloqueia:** a tabela de disponibilidade.
- **Notas afetadas:** [[modulos/DISPONIBILIDADE]], [[fluxos/FLUXO-ESCALAS]], [[05-REGRAS-DE-NEGOCIO#ESC-001 — Conflito de horário|ESC-001]].

## Decisões de dados — Bloco D: infraestrutura de dados

### DATA-DEC-018 — Nomenclatura e idioma
- **Pergunta:** os identificadores do schema oficial ficam em inglês ou em português?
- **Contexto:** o domínio está em português (inclusive `escala_id` e `membro_id` em [[dados/ENTIDADES]]). O ADR-002 e os contratos usam inglês (`church`, `ministry`, `church_id`). O legado está em português.
- **Bloqueia:** os nomes de tudo (com a 001).
- **Notas afetadas:** [[tecnico/BANCO-DE-DADOS]], [[tecnico/CONVENCOES]], [[dados/ENTIDADES]].

### DATA-DEC-019 — Identidade × provedor de autenticação
- **Pergunta:** o usuário do modelo oficial tem uma tabela própria, ligada ao provedor de autenticação, ou o schema usa diretamente o identificador do provedor?
- **Depende de:** [[#DEC-03 — Autenticação|DEC-03]].
- **Bloqueia:** a tabela de usuários (com a 013).
- **Notas afetadas:** [[seguranca/AUTENTICACAO]], [[dados/ENTIDADES#Usuário|Usuário]].

### DATA-DEC-020 — Onde o schema vive e modelo de RLS
- **Pergunta:** em qual schema do Postgres o modelo oficial vive e qual o modelo de RLS (como backend, RLS e API pública do Supabase se relacionam)?
- **Depende de:** [[#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04]].
- **Bloqueia:** as policies de RLS do modelo oficial.
- **Notas afetadas:** [[tecnico/BANCO-DE-DADOS]], [[seguranca/ISOLAMENTO-DE-DADOS]], [[seguranca/AUTORIZACAO]], [[agents/analista-de-dados]].

### DATA-DEC-021 — Auditoria
- **Pergunta:** qual o mecanismo de auditoria e quando ele entra?
- **Contexto:** a Brain exige auditar publicação de escala, mudança de alocação, confirmação e recusa, substituição e alteração de permissões ([[seguranca/AUDITORIA]]). O mecanismo está fora do ADR-002.
- **Bloqueia:** a tabela de auditoria.
- **Notas afetadas:** [[seguranca/AUDITORIA]], [[05-REGRAS-DE-NEGOCIO#ESC-004 — Histórico de substituição|ESC-004]].

### DATA-DEC-022 — Convivência com o legado e migração de dados
- **Pergunta:** como o modelo oficial convive com as tabelas legadas e como os dados são migrados? Sub-decisão: o que fazer com `escalas` e `escala_membros` legadas, que não têm função.
- **Depende de:** o resultado da consulta de inventário (seção 1.3 do relatório).
- **Bloqueia:** a migração de dados.
- **Notas afetadas:** [[tecnico/LEGADO-ATUAL]], [[tecnico/DIVERGENCIAS-LEGADO]], [[tecnico/BANCO-DE-DADOS]], [[modulos/ESCALAS]].

### DATA-DEC-023 — Correção urgente de segurança no legado
- **Pergunta:** corrigir agora as falhas de RLS do legado, numa migration pequena e separada do redesenho, ou esperar o redesenho e a migração do frontend?
- **Contexto:** achados S1 a S11 em [[seguranca/RISCOS-DO-LEGADO]]. Tem trilha e autorização próprias, separadas da fundação de persistência.
- **Bloqueia:** o hotfix do legado.
- **Notas afetadas:** [[seguranca/RISCOS-DO-LEGADO]], [[seguranca/ISOLAMENTO-DE-DADOS]], [[seguranca/AUTORIZACAO]], [[tecnico/LEGADO-ATUAL]].

---

## Outras pendências registradas
- **Inventário do banco:** a consulta somente leitura da seção 1.3 do relatório ainda não teve resultado registrado. Sem ela, o volume de dados reais é desconhecido.
- **Autorização da Fase 4:** nenhuma migration da fundação de persistência pode ser criada sem autorização explícita do PO.
- **Contrato da fundação de persistência:** ainda não existe. O relatório pede um Feature Contract do Arquiteto (ID a definir) ou uma declaração do PO de que o Data Task vale como contrato. A análise da AUTH-001 usa o nome provisório FOUNDATION-002 (ID a confirmar).
- **Ordem do ADR-002:** **cumprida quanto à [[features/FOUNDATION-001]].** A fundação técnica foi implementada e aprovada em 2026-10-19 (commit `7f26d30`), sem dispensa da ordem. A fundação oficial de persistência, que vem em seguida, continua dependendo da [[#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04]] e das decisões de dados (matriz abaixo), além do contrato e da autorização da Fase 4 (itens acima).
- **Regras de autorização em aberto** (relatório, seção 7; a fechar com o Arquiteto, não bloqueiam o schema):
  - ADMIN gerencia todos os ministérios?
  - O que o LEADER pode fazer fora da escala?
  - Quem cria programações? (o canvas diz que ADMIN e LEADER administram "agenda e cronograma de cultos")
- **Plano de migração do frontend legado para `/backend`:** necessita decisão (D1 em [[tecnico/DIVERGENCIAS-LEGADO]]).
- **Versionamento do legado:** **resolvida.** O relatório recomendava commitar as 3 migrations de julho e a função `aceitar-convite-cadastro`. O commit `0394893` (2026-10-06 20:13) versionou esses arquivos e também `src/lib/profiles.ts`, `brain-mescala/`, `docs/`, `.claude/` e `daily/`. Esta nota dizia que eles continuavam fora do git porque se baseava no `git status` anterior a esse commit (divergência D5, apontada na análise da AUTH-001). Em 2026-10-20, só `docs/features/AUTH-001.md` está fora do git, além do que o `.gitignore` ignora de propósito ([[tecnico/LEGADO-ATUAL]]).

### RT-FOUND-01 — Dívida de tooling no backend
- **Origem:** ARQ-FOUND-01, aceita pelo Arquiteto na revisão da [[features/FOUNDATION-001]] (APPROVED em 2026-10-19). Risco aceito com condições; a reavaliação continua pendente.
- **O que é:** 5 vulnerabilidades altas, de um único advisory, GHSA-vfj7-8cjw-p6xm (`braces` ≤ 3.0.3). Ficam só na cadeia de lint (`eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`) e são todas `dev`.
- **Condições:**
  - proibidos `npm audit fix --force`, downgrade de `next` ou de `eslint-config-next` e `overrides` sem decisão registrada;
  - `npm audit --omit=dev` = 0 é condição de encerramento de toda feature que altere dependências do `/backend`. Vulnerabilidade de produção nunca é aceita implicitamente.
- **Reavaliar:** quando houver versão sem essa cadeia ou corrigida, e antes de qualquer decisão de CI/deploy.
- **Notas afetadas:** [[tecnico/BACKEND]], [[agents/qa]], [[agents/desenvolvedor-backend]], [[features/FLUXO-DE-ENTREGA]].

### L-06 — Arquivos .jsx fora das guardas de lint
- **Origem:** limite novo, aceito e não bloqueante, registrado na revisão da [[features/FOUNDATION-001]] (APPROVED em 2026-10-19). **Aberto.**
- **O que é:** `.jsx` fica fora das duas guardas de lint do ADR-002, e o Next 16.4.2 aceita `route.jsx` como rota.
- **Condições:**
  - **(a)** enquanto o L-06 estiver aberto, nenhum `.jsx` em `backend/src`; o QA confere em toda feature;
  - **(b)** a correção (acrescentar `jsx` ao `files` das duas guardas, declarar "Arquivos cobertos" também no item 2 do cabeçalho e ajustar a redação ligada a `import()` de tipo) é especificada pelo Arquiteto no contrato do primeiro gatilho: qualquer feature que altere o `eslint.config.mjs`; qualquer proposta de aceitar `.jsx`, ligar `allowJs` ou alterar `pageExtensions`; ou antes de CI/deploy;
  - **(c)** o PO pode antecipar a correção como mudança isolada.
- **Notas afetadas:** [[tecnico/BACKEND]], [[agents/qa]], [[features/FLUXO-DE-ENTREGA]].

### Cache do Supabase CLI no git
- **Observação para o PO decidir.** Não bloqueia nada.
- **Fato:** `supabase/.temp/` está versionado desde o commit `a6447fc` (2026-07-11). É cache do Supabase CLI: project ref, nome do projeto e da organização, versões dos serviços e a URL do pooler com o usuário, **sem senha**.
- **Avaliação da análise da AUTH-001:** baixo risco; não é segredo, mas é cache do CLI e não deveria estar no git.
- **Decisão:** **A DEFINIR** pelo PO.
- **Notas afetadas:** [[tecnico/LEGADO-ATUAL]].

## Lacunas que já estavam marcadas como A DEFINIR na Brain
- Contratos e endpoints: [[tecnico/API]] (padrão HTTP de erros: proposta [[#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]]).
- Provider e mecanismo de autenticação: [[seguranca/AUTENTICACAO]] (agora ligado à DEC-03; proposta da [[#AUTH-001 — Fundação de Autenticação|AUTH-001]] aguardando aprovação).
- Canais e política de entrega: [[modulos/NOTIFICACOES]].
- Indicadores e filtros: [[modulos/RELATORIOS]].
- Transições de status: [[dados/STATUS]] (agora ligado à DATA-DEC-016).
- ORM, query builder, validação, auditoria e eventos: [[decisoes/ADR-002-BACKEND-OFICIAL]]. `zod` aparece no lockfile do `/backend` só como transitivo, o que não é aprovação ([[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]]).

## Matriz do relatório: o que fica parado

| Parte do modelo oficial | Bloqueada por |
|---|---|
| Usuários | DATA-DEC-013, DATA-DEC-019 (+ DEC-03) |
| Vínculos com igreja e equipe | DATA-DEC-005 a 009, DATA-DEC-012 |
| Equipes/ministérios e funções | DATA-DEC-001, 012, 013 |
| Programações e participação | DATA-DEC-003, 004 |
| Escalas e alocações | DATA-DEC-014, 015, 016 |
| Disponibilidade | DATA-DEC-017 |
| Convites | DATA-DEC-011 |
| Auditoria | DATA-DEC-021 |
| Policies de RLS | DATA-DEC-020 (+ DEC-04) |
| Nomes de tudo | DATA-DEC-001, 018 |
| Migração de dados | DATA-DEC-022 + inventário |
| Hotfix do legado | DATA-DEC-023 |

Relacionados: [[MOCs/MOC-GOVERNANCA]], [[00-MOC-MESCALA]], [[features/FLUXO-DE-ENTREGA]], [[features/FOUNDATION-001]], [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]], [[tecnico/LEGADO-ATUAL]].

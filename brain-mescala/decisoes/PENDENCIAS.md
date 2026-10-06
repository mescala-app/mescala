---
tipo: indice-pendencias
status: pendente
area: governanca
atualizado: 2026-10-06
relacionado:
  - "[[MOCs/MOC-GOVERNANCA]]"
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[features/FOUNDATION-001]]"
  - "[[tecnico/DIVERGENCIAS-LEGADO]]"
  - "[[seguranca/RISCOS-DO-LEGADO]]"
---
# Decisões pendentes

> **Nada nesta nota está decidido.** Ela só lista as perguntas em aberto e o que cada uma bloqueia. Enquanto uma decisão estiver pendente, o ponto que ela cobre é **A DEFINIR**: o [[agents/arquiteto|Arquiteto]] o trata como BLOQUEIO DE DOMÍNIO e o [[agents/analista-de-dados|Analista de Dados]] como DATA MODEL BLOCKED.

## Fontes
- **DEC-02, DEC-03 e DEC-04:** seção "Decisões pendentes" do Feature Contract `docs/features/FOUNDATION-001.md` (fora do vault). Registro no vault: [[features/FOUNDATION-001]].
- **DATA-DEC-001 a DATA-DEC-023:** seção 14 do relatório `docs/data/DATA-ARCHITECTURE-REPORT.md` (fora do vault), emitido pelo Analista de Dados em 2026-10-04 com status **AGUARDANDO DECISÕES DO PO**. As opções (A, B, C) e a recomendação do analista para cada uma estão no relatório. **Até 2026-10-06 nenhuma foi aceita.**
- No relatório, as tabelas abreviam "DATA-DEC-0xx" como "DEC-0xx" (três dígitos). DEC-02, DEC-03 e DEC-04 (dois dígitos) são outra série: decisões técnicas da arquitetura.

## Decisões já aceitas (para contraste)
- [[decisoes/ADR-001-ESTRUTURA-INICIAL]]
- [[decisoes/ADR-002-BACKEND-OFICIAL]]
- [[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]

---

## Decisões técnicas da arquitetura (FOUNDATION-001)

O [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] deixa essas escolhas fora do seu escopo ("Decisões ainda não definidas por este ADR"). Nenhuma bloqueia a [[features/FOUNDATION-001]]. O relatório de dados sugere registrar DEC-03 e DEC-04 como ADRs.

### DEC-02 — Biblioteca oficial de testes e quem escreve os testes
- **Bloqueia:** a regressão automatizada dos cenários B1–B3 da FOUNDATION-001 e todas as features de negócio. O contrato pede a decisão antes da primeira feature de negócio.
- **Efeito atual:** o [[agents/qa|QA]] não cria arquivos de teste nem usa executor de testes; cenários que exigem teste automatizado ficam NOT TESTED.
- **Notas afetadas:** [[agents/qa]], [[agents/desenvolvedor-backend]], [[tecnico/BACKEND]], [[features/FLUXO-DE-ENTREGA]].

### DEC-03 — Autenticação
- **Bloqueia:** o contexto de igreja e qualquer rota protegida. Bloqueia em parte a [[#DATA-DEC-019 — Identidade × provedor de autenticação|DATA-DEC-019]].
- **Notas afetadas:** [[seguranca/AUTENTICACAO]], [[seguranca/ISOLAMENTO-DE-DADOS]], [[tecnico/API]], [[tecnico/BACKEND]].

### DEC-04 — Estratégia de migrations e forma de acesso ao banco
- **Bloqueia:** a fundação oficial de persistência e a [[#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]].
- **Efeito atual:** migrations continuam sendo criadas em `supabase/migrations/` (único padrão existente) e aplicadas manualmente pelo responsável. O [[agents/desenvolvedor-backend|Desenvolvedor]] não pode presumir transação nem proteção por RLS enquanto a forma de acesso não for decidida.
- **Notas afetadas:** [[tecnico/BANCO-DE-DADOS]], [[agents/analista-de-dados]], [[agents/desenvolvedor-backend]].

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
- **Contrato da fundação de persistência:** ainda não existe. O relatório pede um Feature Contract do Arquiteto (ID a definir) ou uma declaração do PO de que o Data Task vale como contrato.
- **Ordem do ADR-002:** a fundação de persistência vem depois da [[features/FOUNDATION-001]], que está READY e ainda não foi implementada. O relatório pede implementá-la antes ou dispensar formalmente essa ordem.
- **Regras de autorização em aberto** (relatório, seção 7; a fechar com o Arquiteto, não bloqueiam o schema):
  - ADMIN gerencia todos os ministérios?
  - O que o LEADER pode fazer fora da escala?
  - Quem cria programações? (o canvas diz que ADMIN e LEADER administram "agenda e cronograma de cultos")
- **Plano de migração do frontend legado para `/backend`:** necessita decisão (D1 em [[tecnico/DIVERGENCIAS-LEGADO]]).
- **Versionamento do legado:** o relatório recomenda commitar as 3 migrations de julho e a função `aceitar-convite-cadastro`. Em 2026-10-06 elas continuam fora do git ([[tecnico/LEGADO-ATUAL]]).

## Lacunas que já estavam marcadas como A DEFINIR na Brain
- Contratos e endpoints: [[tecnico/API]].
- Provider e mecanismo de autenticação: [[seguranca/AUTENTICACAO]] (agora ligado à DEC-03).
- Canais e política de entrega: [[modulos/NOTIFICACOES]].
- Indicadores e filtros: [[modulos/RELATORIOS]].
- Transições de status: [[dados/STATUS]] (agora ligado à DATA-DEC-016).
- ORM, query builder, validação, auditoria e eventos: [[decisoes/ADR-002-BACKEND-OFICIAL]].

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

Relacionados: [[MOCs/MOC-GOVERNANCA]], [[00-MOC-MESCALA]], [[features/FLUXO-DE-ENTREGA]], [[tecnico/LEGADO-ATUAL]].

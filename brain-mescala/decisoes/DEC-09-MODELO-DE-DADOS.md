---
tipo: decisao
status: aceito
data: 2026-10-21
complemento: 2026-10-22
origem: docs/data/DATA-ARCHITECTURE-REPORT.md (seção 14)
decisoes: DATA-DEC-001 a DATA-DEC-023
opcao-aceita: recomendada (todas)
relacionado:
  - "[[decisoes/PENDENCIAS]]"
  - "[[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]]"
  - "[[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]"
  - "[[decisoes/ADR-003-AUTENTICACAO]]"
  - "[[MOCs/MOC-DADOS]]"
  - "[[tecnico/BANCO-DE-DADOS]]"
  - "[[features/FOUNDATION-002]]"
---
# DEC-09 — Modelo de dados: aceite dos DATA-DEC-001 a 023

## Status
**ACEITO** em 2026-10-21, pelo PO: **todos os DATA-DEC-001 a 023 na opção recomendada** da seção 14 do relatório do [[agents/analista-de-dados|Analista de Dados]] (`docs/data/DATA-ARCHITECTURE-REPORT.md`, fora do vault), inclusive as respostas sugeridas que acompanham a recomendação.

**Complemento de 2026-10-22:** o PO decidiu as micro-decisões que o aceite tinha deixado em aberto e removeu o status CANCELADA da Escala. Ver [[#Micro-decisões de 2026-10-22]]. Cada DATA-DEC afetada indica o complemento na própria seção.

**Segundo complemento de 2026-10-22:** o PO respondeu aos bloqueios B-01 a B-04 do contrato FOUNDATION-002, aceitando as recomendações do Arquiteto. Ver [[#Respostas do PO aos bloqueios da FOUNDATION-002]].

- **Numeração:** DEC-06 e DEC-07 estão reservadas pela AUTH-001 e continuam abertas; DEC-08 já existe. Por isso este registro é a DEC-09.
- **Séries:** "DATA-DEC-0xx" (três dígitos) é a série do relatório, que nas tabelas a abrevia como "DEC-0xx". DEC-01 a DEC-09 (dois dígitos) são outra série, a das decisões técnicas e de governança.
- **Fidelidade:** cada seção abaixo reproduz a opção aceita com o texto do relatório. O que continua em aberto está marcado **A DEFINIR**.
- **O que este aceite não autoriza:** nenhuma migration. A Fase 4 do relatório depende do contrato **FOUNDATION-002 — Fundação de Persistência** e de autorização explícita do PO ([[features/FLUXO-DE-ENTREGA]]). **Registro de 2026-10-22:** o contrato foi emitido pelo [[agents/arquiteto|Arquiteto]] a partir destas decisões (VERSÃO 2, READY), e o PO autorizou a Fase 4 para ele ([[features/FOUNDATION-002]]). As migrations estão escritas e não foram aplicadas.
- **Decisões do mesmo dia que mudam o contexto do relatório:** o banco oficial nasce do zero no projeto Supabase novo `vitqnyzuvrvkmnvshcpb` ([[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]), com migrations em `backend/supabase/migrations/` ([[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04, parte 1]]); a autenticação é o Supabase Auth desse projeto ([[decisoes/ADR-003-AUTENTICACAO|ADR-003]]). O relatório foi escrito antes delas, quando o schema oficial ficaria no mesmo banco do legado.

## Resumo

| DATA-DEC | Tema | Aceita (2026-10-21) | Complemento (2026-10-22) | Continua em aberto |
|---|---|---|---|---|
| 001 | Equipe × Ministério | A: mesmo conceito, nome canônico **Ministério** | — | — |
| 002 | Mapeamento dos termos do Data Task | A: nenhuma entidade extra | — | — |
| 003 | Programação × Culto × Reunião × Comissão × Agenda × Cronograma | A: só Programação | — | Reunião, Comissão, Cronograma e Pauta até serem documentados |
| 004 | Programações recorrentes | A: ocorrência datada, sem recorrência | — | — |
| 005 | Papéis em cada camada | A: igreja OWNER/ADMIN/MEMBER; ministério LEADER/MEMBER | — | — |
| 006 | Usuário em mais de uma igreja | A: N igrejas | — | — |
| 007 | OWNER por igreja | A: exatamente 1 | — | — |
| 008 | LEADER por ministério | A: vários | — | — |
| 009 | Papel por usuário no ministério | A: um vínculo, um papel | — | — |
| 010 | Membro sem conta | A: só quem tem conta é membro | — | — |
| 011 | Convites | A: convite oficial | status PENDENTE, ACEITO, EXPIRADO, CANCELADO; `invitations` nasce com a feature de convites (B-04) | fluxo, transições e papel pretendido do convite |
| 012 | Inativação, arquivamento e exclusão | A: nada com histórico é apagado | status ATIVO, INATIVO para vínculos, ministérios e funções; status da Igreja ATIVO, INATIVO (B-02) | efeito de uma igreja INATIVO |
| 013 | Atributos e unicidade de nomes | A: só o que tem uso real; nomes únicos | — | — |
| 014 | Mesma pessoa na mesma escala | A: no máximo uma alocação ativa | contam como "ativa" AGUARDANDO_CONFIRMACAO e CONFIRMADA (B-03) | — |
| 015 | Modelo de substituição | A: original SUBSTITUIDA + nova aponta para ela | — | — |
| 016 | Status e transições | A: CHECK no banco, transições no backend; (a)–(e) | Escala nunca é cancelada; (c) deixa de existir | — |
| 017 | Disponibilidade | A: só impedimentos, por pessoa na igreja | só o próprio membro registra | significado de "excluir" o membro |
| 018 | Nomenclatura e idioma | A: inglês; status e papéis como na Brain | — | — |
| 019 | Identidade × provedor | A: tabela própria `users` | — | provisionamento (DEC-06) |
| 020 | Schema e RLS | A: schema dedicado fora da Data API, papel sem BYPASSRLS | nome do schema: `mescala` (B-01) | ferramenta de acesso (DEC-04, parte 2) |
| 021 | Auditoria | A: tabela só de inserção, gravada pelo backend | — | — |
| 022 | Convivência com o legado | A: schema oficial em paralelo; descartar escalas legadas se vazias | legado sem uso real: sem migração de dados; banco oficial começa vazio | data para pausar ou excluir os projetos antigos |
| 023 | Correção urgente no legado | A, condicionada ao uso real do app legado | não se aplica (legado sem uso real) | — |

---

## Bloco A — Vocabulário e escopo do domínio

### DATA-DEC-001 — Equipe × Ministério
- **Aceita:** opção **A**.
- **Texto:** mesmo conceito, com nome canônico **Ministério** (`ministries`). Impacto: alinha ADR-002, canvas e Data Task; as notas da Brain trocam "Equipe" por "Ministério".
- **No código:** `ministry` (tabela `ministries`, FK `ministry_id`).
- **Aplicação no vault:** as notas passam a dizer "Ministério". Os arquivos [[modulos/EQUIPES]] e [[fluxos/FLUXO-EQUIPES]] mantêm o nome, para não quebrar links nem o histórico, e ganham `aliases: [Equipes, Equipe]`. Descrições do legado (`equipes`, "Líder de Equipe") e citações literais de decisões aceitas antes desta não mudam.

### DATA-DEC-002 — Mapeamento dos termos do Data Task
- **Aceita:** opção **A**. Mapeamentos confirmados:
  - Convocação = Alocação;
  - Confirmação = status da Alocação;
  - Ausência = impedimento da Disponibilidade;
  - Permissões = papel + escopo, sem tabela;
  - Funções ministeriais = Funções.
- **Impacto:** nenhuma entidade extra.
- **Aplicação:** [[03-DOMINIO#Termos equivalentes]].

### DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma
- **Aceita:** opção **A**. Modelar só **Programação** agora:
  - Culto = programação comum;
  - Agenda = consulta, sem tabela;
  - Reunião, Comissão, Cronograma e Pauta ficam fora até a Brain documentá-los.
- **Impacto:** uma fundação totalmente fundamentada; os outros conceitos chegam em migrations próprias.
- **Continua A DEFINIR:** Reunião, Comissão, Cronograma e Pauta ([[produto/CONCEITOS-DO-CANVAS]]).
- **Aplicação:** [[modulos/PROGRAMACOES]], [[produto/CONCEITOS-DO-CANVAS]].

### DATA-DEC-004 — Programações recorrentes
- **Aceita:** opção **A**. Programação = ocorrência datada (`starts_at`, `ends_at`), sem recorrência nesta fundação.
- **Impacto:** `eventos` não migra para programações; vira insumo de uma futura feature de recorrência, ou é descartado.
- **Aplicação:** [[modulos/PROGRAMACOES]], [[fluxos/FLUXO-PROGRAMACOES]].

## Bloco B — Identidade, papéis e vínculos

### DATA-DEC-005 — Papéis em cada camada
- **Aceita:** opção **A**:
  - Igreja: OWNER, ADMIN, MEMBER (todo vinculado é ao menos MEMBER).
  - Ministério: LEADER, MEMBER.
  - "Líder" na igreja é **derivado** (lidera ao menos um ministério).
  - OWNER inclui ADMIN.
  - ANCIÃO é cargo, sem tabela e sem efeito de autorização.
- **Impacto:** sem redundância.
- **Confirmações pedidas pelo relatório:** OWNER ⊇ ADMIN, confirmado; ANCIÃO como cargo, confirmado.
- **Aplicação:** [[04-USUARIOS-E-PERMISSOES]], [[seguranca/AUTORIZACAO]].

### DATA-DEC-006 — Usuário em mais de uma igreja
- **Aceita:** opção **A**. N igrejas, com UNIQUE(church_id, user_id).
- **Impacto:** o backend precisa de "igreja atual" no contexto de cada requisição.
- **Aplicação:** [[04-USUARIOS-E-PERMISSOES]], [[dados/RELACIONAMENTOS]], [[seguranca/ISOLAMENTO-DE-DADOS]].

### DATA-DEC-007 — Quantidade de OWNER por igreja
- **Aceita:** opção **A**. Exatamente 1 (índice único parcial).
- **Impacto:** trocar de dono exige uma feature de transferência.
- **Aplicação:** [[05-REGRAS-DE-NEGOCIO#IGR-001 — Um único OWNER por igreja|IGR-001]], [[fluxos/FLUXO-CADASTRO-IGREJA]].

### DATA-DEC-008 — Quantidade de LEADER por ministério
- **Aceita:** opção **A**. Vários líderes por ministério.
- **Impacto:** sem índice; co-liderança suportada.
- **Aplicação:** [[modulos/EQUIPES]], [[04-USUARIOS-E-PERMISSOES]].

### DATA-DEC-009 — Papel único por usuário em cada ministério
- **Aceita:** opção **A**. Um vínculo por (ministério, usuário), com um papel. Um líder que também serve recebe funções no mesmo vínculo.
- **Impacto:** simples; a alocação aponta para um vínculo só.
- **Aplicação:** [[05-REGRAS-DE-NEGOCIO#MEM-002 — Um vínculo por usuário em cada ministério|MEM-002]], [[modulos/MEMBROS]].

### DATA-DEC-010 — Membro sem conta
- **Aceita:** opção **A**. Só quem tem conta é membro; antes do aceite existe apenas o convite pendente.
- **Impacto:** segue a Brain; pessoas sem conta não podem ser escaladas.
- **Aplicação:** [[05-REGRAS-DE-NEGOCIO#MEM-001 — Membro é usuário com conta|MEM-001]], [[modulos/MEMBROS]].

### DATA-DEC-011 — Convites
- **Aceita:** opção **A**. Convite oficial com:
  - igreja e ministério (opcional);
  - email e papel pretendido;
  - status (valores a confirmar pelo PO), expiração;
  - quem convidou e quem aceitou;
  - **só o hash do token**;
  - um convite pendente por (igreja, ministério, email).
- O aceite cria os vínculos. A criação de conta é da autenticação. A regra legada "OWNER/ADMIN convida líder; líder convida membro" (confirmada pelo canvas) é registrada na Brain ([[05-REGRAS-DE-NEGOCIO#MEM-003 — Quem convida quem|MEM-003]]).
- **Impacto:** o fluxo de convite precisa ser documentado.
- **Complemento de 2026-10-22:** valores de status do convite: **PENDENTE, ACEITO, EXPIRADO, CANCELADO**.
- **Escopo (resposta do PO ao B-04 da FOUNDATION-002, 2026-10-22, opção A):** a tabela `invitations` sai da fundação de persistência e nasce no Data Task da feature de convites, quando o fluxo for documentado na Brain.
- **Continua A DEFINIR:** o fluxo de convite, ainda não documentado na Brain (inclusive as transições entre esses status), e o papel pretendido (valores e o que significa um convite sem ministério). Ficam para o contrato da feature de convites.
- **Aplicação:** [[dados/STATUS#Convite]], [[modulos/MEMBROS]], [[fluxos/FLUXO-MEMBROS]], [[dados/ENTIDADES#Convite|Convite]].

### DATA-DEC-012 — Inativação, arquivamento e exclusão
- **Aceita:** opção **A**. Nada com histórico é apagado. Igreja, ministério, vínculos e funções ganham **status** (ATIVO/INATIVO, valores a confirmar) e data de término; FKs com RESTRICT.
- **Impacto:** um pedido de exclusão pela LGPD vai exigir uma feature de anonimização.
- **Complemento de 2026-10-22:** valores de status dos **vínculos (com a igreja e com o ministério), ministérios e funções**: **ATIVO, INATIVO**.
- **Status da Igreja (resposta do PO ao B-02 da FOUNDATION-002, 2026-10-22, opção A):** **ATIVO, INATIVO**, o mesmo conjunto das demais entidades que podem ser inativadas. Até essa resposta, era **A DEFINIR**, porque a decisão anterior de 2026-10-22 não citava a igreja.
- **Continua A DEFINIR:** o efeito de uma igreja INATIVO (acesso, leitura e escrita), na feature que inativar a igreja.
- **Aplicação:** [[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]], [[dados/STATUS#Vínculos, ministérios e funções]], [[seguranca/AUDITORIA]].

### DATA-DEC-013 — Atributos e unicidade de nomes
- **Aceita:** opção **A**. Levar só o que tem uso real:
  - pessoa: nome completo, apelido, email, WhatsApp;
  - igreja: nome, endereço;
  - ministério, função e programação: nome.
- Descartar `data_nascimento` (sem uso, dado pessoal), `confirmado` (modo teste) e os campos de quantidade e formulário (não estão na Brain).
- Nome único por igreja para ministérios e por ministério para funções, sem diferenciar maiúsculas (unicidade confirmada).
- **Impacto:** a geração automática de escala do legado (quantidades, suplentes) fica sem suporte até virar regra na Brain.
- **Aplicação:** [[dados/ENTIDADES]].

## Bloco C — Escalas

### DATA-DEC-014 — A mesma pessoa mais de uma vez na mesma escala
- **Aceita:** opção **A**. No máximo uma alocação ativa por pessoa por escala (índice único parcial).
- **Impacto:** quem toca e canta fica com uma função por escala.
- **Status que contam como "ativa" (resposta do PO ao B-03 da FOUNDATION-002, 2026-10-22, opção A):** **AGUARDANDO_CONFIRMACAO e CONFIRMADA**, isto é, quando a pessoa vai ou pode ir servir. Quem recusou, quem está em substituição pendente e quem foi substituído pode ser alocado de novo, em outra função da mesma escala. Até essa resposta, era **A DEFINIR** ([[#Lacunas observadas no registro]]). O índice único parcial entra com a FOUNDATION-004.
- **Aplicação:** [[05-REGRAS-DE-NEGOCIO#ESC-005 — Uma alocação ativa por pessoa na escala|ESC-005]], [[modulos/ESCALAS]].

### DATA-DEC-015 — Modelo de substituição
- **Aceita:** opção **A**. A alocação original vira SUBSTITUIDA, e uma nova alocação aponta para ela (`replaces_allocation_id`, mesma escala).
- **Impacto:** histórico na própria tabela; encaixa no status da Brain.
- **Aplicação:** [[fluxos/FLUXO-SUBSTITUICAO]], [[05-REGRAS-DE-NEGOCIO#ESC-004 — Histórico de substituição|ESC-004]].

### DATA-DEC-016 — Status e transições
- **Aceita:** opção **A**. O banco guarda os valores (CHECK) e o backend valida as transições.
- **Respostas aceitas em 2026-10-21 (as sugeridas pelo relatório):**
  - **(a)** estado da alocação enquanto a escala é RASCUNHO: AGUARDANDO_CONFIRMACAO, com o pedido de resposta enviado só na publicação;
  - **(b)** CONCLUIDA é **manual**;
  - **(c)** cancelar a escala muda o status das alocações: sim, para um estado a definir. **Deixou de existir em 2026-10-22** (ver abaixo);
  - **(d)** a confirmação guarda também a **data da resposta**;
  - **(e)** uma escala em rascunho pode ser apagada: **sim, se nunca foi publicada**.
- **Complemento de 2026-10-22 — a Escala nunca é cancelada:** a máquina de estados da Escala passa a ser **RASCUNHO, PUBLICADA, CONCLUIDA**. O status CANCELADA, que a Brain previa em [[dados/STATUS]] até 2026-10-22, foi removido pelo PO. Com isso, a resposta (c) e a micro-decisão sobre o estado das alocações em escala cancelada deixam de existir.
- **Cancelar uma Programação:** nada foi decidido. **A DEFINIR**, se o tema aparecer.
- **Aplicação:** [[dados/STATUS]], [[modulos/ESCALAS]], [[fluxos/FLUXO-ESCALAS]], [[fluxos/FLUXO-CONFIRMACAO]].

### DATA-DEC-017 — Disponibilidade
- **Aceita:** opção **A**. Só **impedimentos**, por pessoa **na igreja** (valem para todos os ministérios), com intervalo de início e fim e motivo opcional, registrados pelo próprio membro.
- **Impacto:** cobre as ausências do legado e a validação na escalação.
- **Complemento de 2026-10-22:** **só o próprio membro registra o impedimento dele.** O líder não registra impedimento por um membro; se não quiser o membro participando, ele o exclui.
- **Continua A DEFINIR:** o significado exato de "excluir" (da escala ou do ministério) e o efeito no histórico ficam para o contrato da feature de escalas. Vale a regra aceita da [[#DATA-DEC-012 — Inativação, arquivamento e exclusão|DATA-DEC-012]]: nada com histórico é apagado.
- **Aplicação:** [[05-REGRAS-DE-NEGOCIO#DIS-001 — Impedimento é registrado só pelo próprio membro|DIS-001]], [[modulos/DISPONIBILIDADE]].

## Bloco D — Infraestrutura de dados

### DATA-DEC-018 — Nomenclatura e idioma
- **Aceita:** opção **A**. Identificadores em **inglês** (padrão da seção 13.4), com valores de status e papel **como na Brain** (RASCUNHO, OWNER…).
- **Impacto:** alinha com o `/backend` e não colide com as tabelas legadas no mesmo schema.
- **Padrão da seção 13.4:**

| Item | Padrão |
|---|---|
| Tabelas | Plural, snake_case |
| PK | `id` |
| FK | `<entidade>_id` (`church_id`, `ministry_id`) |
| Timestamps | `created_at` / `updated_at`; outros `*_at` só com significado de domínio |
| Status e papéis | `text` + CHECK, com valores da Brain em MAIÚSCULAS |
| PK (constraint) | `<tabela>_pkey` |
| FK (constraint) | `<tabela>_<colunas>_fkey` |
| UNIQUE | `<tabela>_<colunas>_key` |
| CHECK | `<tabela>_<regra>_check` |
| Índices | `<tabela>_<colunas>_idx` |
| Migrations | `<YYYYMMDDHHMMSS>_<objetivo>.sql`, uma por objetivo |

- **Local das migrations:** a seção 13.4 escreve `supabase/migrations/`; o local foi decidido depois, na [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04, parte 1]]: `backend/supabase/migrations/`.
- **Aplicação:** [[tecnico/BANCO-DE-DADOS]], [[dados/ENTIDADES]].

### DATA-DEC-019 — Identidade × provedor de autenticação
- **Aceita:** opção **A**. Uma tabela própria `users` como âncora; todas as FKs apontam para ela, mais uma coluna de ligação com o provedor (com FK para `auth.users` se for Supabase Auth).
- **Impacto:** só **uma coluna** depende do DEC-03.
- **Com o [[decisoes/ADR-003-AUTENTICACAO|ADR-003]] e a [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]:** o provedor é o Supabase Auth, então a coluna de ligação (`auth_user_id` UNIQUE, na seção 13.2) tem FK para o `auth.users` do projeto novo. O bloqueio parcial pela DEC-03 acabou.
- **Continua aberta:** como o registro do usuário do Mescala nasce ([[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]]).
- **Aplicação:** [[dados/ENTIDADES#Usuário|Usuário]], [[seguranca/AUTENTICACAO]].

### DATA-DEC-020 — Onde o schema vive e modelo de RLS
- **Aceita:** opção **A**. Schema dedicado (o relatório dá `mescala` como exemplo) **fora da Data API**. O backend conecta direto ao Postgres com um papel **sem BYPASSRLS** e define o contexto (usuário, igreja) em cada transação; as policies usam esse contexto.
- **Impacto:** o RLS protege mesmo se o backend errar um filtro; exige que o DEC-04 escolha acesso direto ao Postgres.
- **Relação com a DEC-04:** o acesso direto ao Postgres fica implicado por esta decisão; a ferramenta (driver, query builder ou ORM) continua aberta na [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04, parte 2]].
- **Seção 13.3 do relatório:** toda tabela nasce com RLS habilitado; até haver policies, o estado padrão é RLS sem policy, que nega tudo à API pública.
- **Nome do schema (resposta do PO ao B-01 da FOUNDATION-002, 2026-10-22, opção A):** **`mescala`**. Até essa resposta, era **A DEFINIR** (`mescala` era só exemplo do relatório).
- **Especificação vinculante:** contrato [[features/FOUNDATION-002]] (papel `mescala_app`, contexto por transação, policies de isolamento por igreja; escrito nas migrations e ainda não aplicado). Resumo em [[tecnico/BANCO-DE-DADOS#Mecanismo do schema oficial (FOUNDATION-002)|tecnico/BANCO-DE-DADOS]].
- **Aplicação:** [[seguranca/ISOLAMENTO-DE-DADOS]], [[seguranca/AUTORIZACAO]], [[tecnico/BANCO-DE-DADOS]], [[tecnico/BACKEND]].

### DATA-DEC-021 — Auditoria
- **Aceita:** opção **A**. Tabela de auditoria só de inserção, gravada pelo backend na mesma transação da operação.
- **Impacto:** as features já nascem auditáveis.
- **Seção 13.2 do relatório:** `audit_log` com igreja, ator, ação, entidade, id, antes, depois e quando; só inserção; índice (church_id, occurred_at).
- **Aplicação:** [[seguranca/AUDITORIA]].

### DATA-DEC-022 — Convivência com o legado e migração de dados
- **Aceita:** opção **A**. O schema oficial é criado **em paralelo**, sem tocar nas tabelas legadas. A cópia de dados acontece em migrations separadas, depois do inventário (seção 1.3). As tabelas legadas viram somente leitura quando o frontend migrar. A remoção só acontece com autorização futura.
- **Impacto:** o frontend não quebra; durante a convivência, os dados divergem até a data de corte.
- **Sub-decisão aceita:** `escalas` e `escala_membros` legadas (sem função) são **descartadas se o inventário mostrar as tabelas vazias**.
- **Com a [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]:** o schema oficial fica no projeto novo `vitqnyzuvrvkmnvshcpb`, em paralelo ao legado, que continua nos projetos antigos.
- **Complemento de 2026-10-22 — app legado sem uso real** ("o app antigo não tinha movimento", segundo o PO):
  - **não há migração de dados**: o banco oficial começa vazio;
  - a consulta de inventário da seção 1.3 fica **dispensada**;
  - a cópia de dados e a sub-decisão sobre as escalas legadas deixam de ter objeto.
- **Continua A DEFINIR:** pausar ou excluir os projetos antigos (`ehbidizpzxhfusfyjgtl` e `fiurvpkieiorngshjric`) é decisão operacional do PO, com data a definir.
- **Aplicação:** [[tecnico/BANCO-DE-DADOS]], [[tecnico/LEGADO-ATUAL]], [[tecnico/DIVERGENCIAS-LEGADO]].

### DATA-DEC-023 — Correção urgente de segurança no legado
- **Aceita em 2026-10-21:** opção **A**, **condicionada ao uso real do app legado**. A recomendação do relatório é "A, se houver qualquer uso real do app".
- **Texto da opção:** uma migration pequena e imediata, **separada do redesenho**, que não exige mudar o frontend:
  - convite tipo `lider` só com equipe da própria igreja;
  - claim de líder ou papel por convite só com equipe da igreja do convite;
  - `profiles.email` não editável pelo usuário (ou comparado ao email autenticado);
  - WITH CHECK em `equipes` impedindo a troca de igreja;
  - vínculo criado pelo organizador só com equipe da própria igreja;
  - remover a referência a `auth.users`.
- O S3 e o S4 (leitura anônima de convite, igreja e equipe) precisam de uma função dedicada **e** de uma mudança no frontend, então ficam para uma tarefa própria.
- **Impacto:** fecha o S1, o S2, o S5 e o S6.
- **Complemento de 2026-10-22:** o app legado **não tem uso real**. A condição não se cumpre: **a correção não se aplica**. Os riscos S1–S11 continuam existindo nos projetos antigos enquanto estiverem ativos ([[seguranca/RISCOS-DO-LEGADO]]).
- **Aplicação:** [[seguranca/RISCOS-DO-LEGADO]].

---

## Micro-decisões de 2026-10-22
O aceite de 2026-10-21 tinha deixado cinco pontos em aberto, que o cabeçalho do relatório dizia que seriam levantados no contrato FOUNDATION-002. O PO os decidiu em 2026-10-22, junto com a remoção do status CANCELADA da Escala. Histórico das perguntas: [[decisoes/PENDENCIAS#Micro-decisões deixadas em aberto pelo aceite de 2026-10-21|PENDENCIAS]].

| # | Ponto | Origem | Decisão (2026-10-22) | Ainda em aberto |
|---|---|---|---|---|
| 1 | Valores de status do convite | [[#DATA-DEC-011 — Convites\|DATA-DEC-011]] | PENDENTE, ACEITO, EXPIRADO, CANCELADO | fluxo e transições do convite |
| 2 | Valores de status de vínculos (com a igreja e com o ministério), ministérios e funções | [[#DATA-DEC-012 — Inativação, arquivamento e exclusão\|DATA-DEC-012]] | ATIVO, INATIVO | status da Igreja: decidido no mesmo dia, pela resposta ao B-02 ([[#Respostas do PO aos bloqueios da FOUNDATION-002\|abaixo]]) |
| 3 | Estado das alocações quando a escala é cancelada | [[#DATA-DEC-016 — Status e transições\|DATA-DEC-016]] (c) | **Deixa de existir:** a Escala nunca é cancelada; estados RASCUNHO, PUBLICADA, CONCLUIDA | cancelar uma Programação (nada decidido) |
| 4 | Se o líder também pode registrar impedimento | [[#DATA-DEC-017 — Disponibilidade\|DATA-DEC-017]] | Não: só o próprio membro registra; o líder que não quiser o membro participando o exclui | significado de "excluir" e efeito no histórico (contrato da feature de escalas) |
| 5 | Se o app legado tem uso real | [[#DATA-DEC-022 — Convivência com o legado e migração de dados\|DATA-DEC-022]], [[#DATA-DEC-023 — Correção urgente de segurança no legado\|DATA-DEC-023]] | Não tem: correção do legado não se aplica; sem migração de dados; banco oficial começa vazio; inventário dispensado | data para pausar ou excluir os projetos antigos (decisão operacional do PO) |

## Respostas do PO aos bloqueios da FOUNDATION-002
Em 2026-10-22, o [[agents/arquiteto|Arquiteto]] levou as [[#Lacunas observadas no registro|lacunas observadas]] ao PO como BLOQUEIOS DE DOMÍNIO B-01 a B-04 do contrato FOUNDATION-002 (`docs/features/FOUNDATION-002.md`, seção 12, fora do vault), cada um com opções e recomendação. **O PO respondeu no mesmo dia, aceitando as recomendações do Arquiteto** (cabeçalho do contrato). Registro da feature: [[features/FOUNDATION-002]].

| Bloqueio | Ponto | Decisão (2026-10-22) | Origem | Continua A DEFINIR |
|---|---|---|---|---|
| B-01 | Nome do schema dedicado | Opção A: **`mescala`** | [[#DATA-DEC-020 — Onde o schema vive e modelo de RLS\|DATA-DEC-020]] | — |
| B-02 | Valores do status da Igreja | Opção A: **ATIVO, INATIVO** | [[#DATA-DEC-012 — Inativação, arquivamento e exclusão\|DATA-DEC-012]] | efeito de uma igreja INATIVO (acesso, leitura e escrita), na feature que inativar a igreja |
| B-03 | Status de alocação que contam como "ativa" | Opção A: **AGUARDANDO_CONFIRMACAO e CONFIRMADA** (vale para a FOUNDATION-004) | [[#DATA-DEC-014 — A mesma pessoa mais de uma vez na mesma escala\|DATA-DEC-014]] | — |
| B-04 | Convites: escopo | Opção A: `invitations` sai da fundação e nasce com a feature de convites | [[#DATA-DEC-011 — Convites\|DATA-DEC-011]] | fluxo, transições e papel pretendido do convite, no contrato da feature de convites |

No mesmo dia, o PO autorizou a Fase 4 para a FOUNDATION-002 e aceitou, sem veto, as decisões técnicas ARQ-F002-01 a 13 do contrato.

## Lacunas observadas no registro
O vault-brain notou estes pontos ao aplicar as decisões. Não estavam na lista de micro-decisões do relatório e **não foram decididos** no aceite; ficaram **A DEFINIR** e registrados em [[decisoes/PENDENCIAS#Lacunas observadas no registro de 2026-10-21|PENDENCIAS]]. **Em 2026-10-22, foram respondidos pelo PO** como bloqueios da FOUNDATION-002 ([[#Respostas do PO aos bloqueios da FOUNDATION-002|acima]]):
- quais status de alocação contam como "ativa" para a DATA-DEC-014: **decidido** (B-03);
- o nome do schema dedicado (`mescala` era exemplo do relatório): **decidido** (B-01);
- o fluxo de convite, que a própria DATA-DEC-011 diz que precisa ser documentado: **só o escopo foi decidido** (B-04); o fluxo continua **A DEFINIR**;
- os valores do status da Igreja, que a decisão de 2026-10-22 não cita: **decidido** (B-02).

Superadas em 2026-10-22, pela decisão de que o legado não tem uso real: o destino das `escalas` legadas caso o inventário mostrasse dados, e a forma de copiar os dados do legado para o projeto novo.

## Matriz do relatório depois do aceite

| Parte do modelo oficial | Decidida por | O que continua em aberto |
|---|---|---|
| `users` | 013, 019 + [[decisoes/ADR-003-AUTENTICACAO\|ADR-003]] | provisionamento ([[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala\|DEC-06]]) |
| Vínculos com igreja e ministério | 005 a 009, 012 | — |
| `churches` | 012, 013; B-02 | efeito de uma igreja INATIVO |
| `ministries`, `ministry_functions` | 001, 012, 013 | — |
| `programs`, `program_ministries` | 003, 004 | cancelamento de Programação, se o tema aparecer |
| `schedules`, `allocations` | 014, 015, 016; B-03 | — |
| `availability` | 017 | — (o "excluir" do líder é da feature de escalas) |
| `invitations` | 011; B-04 (feature de convites) | fluxo, transições e papel pretendido do convite |
| `audit_log` | 021 | — |
| Policies de RLS | 020 | ferramenta de acesso ([[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS\|DEC-04, parte 2]]) |
| Nomes de tudo | 001, 018; B-01 (schema `mescala`) | — |
| Migração de dados | 022 | **sem migração** (2026-10-22) |
| Hotfix do legado | 023 | **não se aplica** (2026-10-22) |

O detalhe físico (colunas, constraints, índices) era a proposta da seção 13.2 do relatório. **Desde 2026-10-22, a especificação vinculante está no contrato [[features/FOUNDATION-002]]** (VERSÃO 2, READY) para `users`, `churches`, vínculos, ministérios, funções, habilitações e `audit_log`; programação, escala, alocação e impedimentos ficam para a FOUNDATION-004, e convites para a feature de convites (ARQ-F002-01). A ordem vinculante das migrations está em [[tecnico/BANCO-DE-DADOS#Ordem vinculante das migrations (FOUNDATION-002, D9)]]; a proposta da seção 15, em [[tecnico/BANCO-DE-DADOS#Ordem proposta das migrations]].

---

Fonte: `docs/data/DATA-ARCHITECTURE-REPORT.md`, seções 13 a 15 (fora do vault). Complemento de 2026-10-22: decisões do PO repassadas pela sessão principal. Respostas aos bloqueios B-01 a B-04: cabeçalho e seção 12 de `docs/features/FOUNDATION-002.md` (VERSÃO 2), com pedido de registro do Arquiteto na revisão pré-aplicação.

Relacionados: [[decisoes/PENDENCIAS]], [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]], [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]], [[decisoes/ADR-003-AUTENTICACAO]], [[03-DOMINIO]], [[04-USUARIOS-E-PERMISSOES]], [[05-REGRAS-DE-NEGOCIO]], [[dados/ENTIDADES]], [[dados/RELACIONAMENTOS]], [[dados/STATUS]], [[tecnico/BANCO-DE-DADOS]], [[agents/analista-de-dados]], [[MOCs/MOC-DADOS]], [[MOCs/MOC-GOVERNANCA]].

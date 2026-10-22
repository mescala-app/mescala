---
tipo: modelo-dados
status: ativo
atualizado: 2026-10-22
relacionado:
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
  - "[[dados/RELACIONAMENTOS]]"
  - "[[dados/STATUS]]"
---
# Entidades

Modelo conceitual. As decisões de 2026-10-21 e 2026-10-22 estão em [[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]]. Os identificadores do schema oficial são em inglês e os valores de status e papéis ficam como na Brain ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-018 — Nomenclatura e idioma|DATA-DEC-018]]). O detalhe físico (colunas, constraints, índices) de Usuário, Igreja, vínculos, Ministério, Função, habilitações e Registro de auditoria está no contrato [[features/FOUNDATION-002]] (VERSÃO 2, READY em 2026-10-22; migrations escritas e **não aplicadas**). Programação, Escala, Alocação e Disponibilidade ficam para a FOUNDATION-004 (proposta), e Convite, para a feature de convites. Schema oficial: `mescala`.

## Igreja
Tenant organizacional. Veja [[modulos/IGREJAS]].
- **Atributos:** nome, endereço ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-013 — Atributos e unicidade de nomes|DATA-DEC-013]]).
- **Status e data de término:** previstos pela [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-012 — Inativação, arquivamento e exclusão|DATA-DEC-012]]. **Status: ATIVO, INATIVO** (decidido pelo PO em 2026-10-22, resposta ao B-02 da FOUNDATION-002; [[dados/STATUS]]). O efeito de uma igreja INATIVO (acesso, leitura e escrita): **A DEFINIR**, na feature que inativar a igreja.
- **Endereço:** entra no schema com a CHURCH-001, com a obrigatoriedade decidida lá (ARQ-F002-02).

## Usuário
Identidade autenticável. Papéis dependem de vínculos e escopo. Veja [[04-USUARIOS-E-PERMISSOES]].
- **Tabela própria** (`users`) como âncora de todas as referências, com uma coluna de ligação ao `auth.users` do projeto oficial ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-019 — Identidade × provedor de autenticação|DATA-DEC-019]]; [[decisoes/ADR-003-AUTENTICACAO|ADR-003]]; [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]).
- O identificador do provedor (`sub`, chamado `externalUserId`) não é o usuário do Mescala ([[decisoes/ADR-003-AUTENTICACAO|ADR-003]], item 6).
- **Atributos:** nome completo, apelido, email, WhatsApp ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-013 — Atributos e unicidade de nomes|DATA-DEC-013]]).
- **Como o registro nasce:** [[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]] (aberta).

## Vínculo com a igreja
Usuário × Igreja. Um por (igreja, usuário); um usuário pode estar em várias igrejas ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-006 — Usuário em mais de uma igreja|DATA-DEC-006]]).
- **Papel:** OWNER, ADMIN ou MEMBER ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]]); exatamente um OWNER por igreja ([[05-REGRAS-DE-NEGOCIO#IGR-001 — Um único OWNER por igreja|IGR-001]]).
- **Status:** ATIVO, INATIVO (2026-10-22), com data de término ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]]).

## Ministério
Grupo operacional pertencente a uma igreja. Até 2026-10-21 a Brain o chamava de **Equipe** ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]]). Veja [[modulos/EQUIPES]].
- **Atributo:** nome, único por igreja, sem diferenciar maiúsculas ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-013 — Atributos e unicidade de nomes|DATA-DEC-013]]).
- **Status:** ATIVO, INATIVO (2026-10-22), com data de término.

## Vínculo com o ministério
Usuário × Ministério, com papel LEADER ou MEMBER. Um por (ministério, usuário), com um único papel; vários LEADER por ministério ([[05-REGRAS-DE-NEGOCIO#MEM-002 — Um vínculo por usuário em cada ministério|MEM-002]]).
- Guarda as funções que o membro pode exercer no ministério ([[fluxos/FLUXO-MEMBROS]], passo 4; [[05-REGRAS-DE-NEGOCIO#ESC-002 — Compatibilidade de função|ESC-002]]).
- **Status:** ATIVO, INATIVO (2026-10-22), com data de término.

## Função
Capacidade/posição dentro do ministério. Veja [[modulos/FUNCOES]].
- **Atributo:** nome, único por ministério, sem diferenciar maiúsculas ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-013 — Atributos e unicidade de nomes|DATA-DEC-013]]).
- **Status:** ATIVO, INATIVO (2026-10-22), com data de término.

## Programação
Evento com data e horário. Veja [[modulos/PROGRAMACOES]].
- Ocorrência datada, com início e fim, sem recorrência nesta fundação ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-004 — Programações recorrentes|DATA-DEC-004]]).
- Culto é uma programação comum ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma|DATA-DEC-003]]).
- **Atributo:** nome ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-013 — Atributos e unicidade de nomes|DATA-DEC-013]]).

## Escala
Plano de participação de um ministério em uma programação. Veja [[modulos/ESCALAS]].
- **Status:** RASCUNHO, PUBLICADA, CONCLUIDA. A Escala nunca é cancelada (2026-10-22; [[dados/STATUS]]).

## Alocação
Ligação entre escala, membro e função. É a unidade operacional da escala. O Data Task do PO a chamava de "Convocação" ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-002 — Mapeamento dos termos do Data Task|DATA-DEC-002]]).

Campos conceituais mínimos:
- escala_id
- membro_id
- funcao_id
- status
- confirmação
- referência de substituição/histórico quando aplicável

Decisões sobre esses campos:
- os nomes acima são conceituais; no schema oficial, os identificadores são em inglês ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-018 — Nomenclatura e idioma|DATA-DEC-018]]);
- a alocação aponta para um único vínculo do membro com o ministério ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-009 — Papel único por usuário em cada ministério|DATA-DEC-009]]);
- **confirmação** é o status da alocação ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-002 — Mapeamento dos termos do Data Task|DATA-DEC-002]]) e guarda também a data da resposta ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-016 — Status e transições|DATA-DEC-016]] d);
- **substituição:** a original vira SUBSTITUIDA, e a nova alocação, na mesma escala, aponta para ela ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-015 — Modelo de substituição|DATA-DEC-015]]);
- no máximo uma alocação ativa por pessoa em cada escala ([[05-REGRAS-DE-NEGOCIO#ESC-005 — Uma alocação ativa por pessoa na escala|ESC-005]]); contam como "ativa" AGUARDANDO_CONFIRMACAO e CONFIRMADA (decidido em 2026-10-22, resposta ao B-03 da FOUNDATION-002).

## Disponibilidade
Registro temporal associado a membro. Veja [[modulos/DISPONIBILIDADE]].
- Só **impedimentos**, por pessoa na igreja (valem para todos os ministérios), com início, fim e motivo opcional ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-017 — Disponibilidade|DATA-DEC-017]]).
- Registrados só pelo próprio membro ([[05-REGRAS-DE-NEGOCIO#DIS-001 — Impedimento é registrado só pelo próprio membro|DIS-001]]).
- O Data Task do PO chamava o impedimento de "Ausência".

## Convite
Entidade decidida em 2026-10-21 ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-011 — Convites|DATA-DEC-011]]). Até então, a Brain não tinha convite.
- igreja e ministério (opcional);
- email e papel pretendido;
- status: PENDENTE, ACEITO, EXPIRADO, CANCELADO (2026-10-22; [[dados/STATUS#Convite]]); expiração;
- quem convidou e quem aceitou;
- só o hash do token, nunca o token;
- no máximo um convite pendente por (igreja, ministério, email).

O aceite cria os vínculos. A criação de conta é da autenticação ([[seguranca/AUTENTICACAO]]). Quem convida quem: [[05-REGRAS-DE-NEGOCIO#MEM-003 — Quem convida quem|MEM-003]].
- **Escopo** (decidido pelo PO em 2026-10-22, resposta ao B-04 da FOUNDATION-002, opção A): a tabela `invitations` não entra na fundação de persistência; nasce com a feature de convites (ID a definir).
- **A DEFINIR**, no contrato da feature de convites: o fluxo do convite, as transições entre os status e o papel pretendido (valores e o que significa um convite sem ministério).

## Registro de auditoria
Tabela só de inserção, gravada pelo backend na mesma transação da operação ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 — Auditoria|DATA-DEC-021]]). Pela proposta do relatório (seção 13.2): igreja, ator, ação, entidade, id, antes, depois e quando. Veja [[seguranca/AUDITORIA]].

## Termos que não são entidades
- Convocação, Confirmação, Ausência, Permissões e Funções ministeriais: ver [[03-DOMINIO#Termos equivalentes]].
- Agenda é consulta, sem tabela; Reunião, Comissão, Cronograma e Pauta ficam fora do modelo até serem documentados (**A DEFINIR**, [[produto/CONCEITOS-DO-CANVAS]]).
- Membro sem conta não existe no modelo oficial ([[05-REGRAS-DE-NEGOCIO#MEM-001 — Membro é usuário com conta|MEM-001]]).

Relações: [[dados/RELACIONAMENTOS]].

## Pendências
- Status da Igreja: **decidido em 2026-10-22** (ATIVO, INATIVO). Efeito de uma igreja INATIVO: **A DEFINIR**.
- Quais status de alocação contam como "ativa": **decidido em 2026-10-22** (AGUARDANDO_CONFIRMACAO e CONFIRMADA).
- Fluxo do convite, transições e papel pretendido: **A DEFINIR** (feature de convites).
- Provisionamento do usuário: [[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]].
- Comparação com o banco legado: [[tecnico/DIVERGENCIAS-LEGADO]].

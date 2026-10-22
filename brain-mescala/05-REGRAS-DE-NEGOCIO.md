---
tipo: regras-negocio
status: ativo
atualizado: 2026-10-22
relacionado:
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
---
# Regras de Negócio

## ESC-001 — Conflito de horário
Um membro não pode possuir alocações incompatíveis em programações com sobreposição de horário.

Relacionados: [[modulos/ESCALAS]], [[modulos/PROGRAMACOES]], [[modulos/DISPONIBILIDADE]], [[fluxos/FLUXO-ESCALAS]].

## ESC-002 — Compatibilidade de função
Um membro só pode ser escalado em função permitida para ele dentro do ministério.

Vocabulário: até 2026-10-21 a regra dizia "dentro da equipe" ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]]).

Relacionados: [[modulos/FUNCOES]], [[modulos/EQUIPES]], [[dados/ENTIDADES#Alocação|Alocação]].

## ESC-003 — Estado controlado
Mudanças de estado de escala e alocação devem obedecer aos estados definidos em [[dados/STATUS]].

Desde 2026-10-22, a Escala nunca é cancelada: seus estados são RASCUNHO, PUBLICADA e CONCLUIDA. O banco guarda os valores e o backend valida as transições ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-016 — Status e transições|DATA-DEC-016]]).

## ESC-004 — Histórico de substituição
Uma substituição não deve apagar o membro originalmente escalado. O histórico precisa permanecer auditável.

Representação decidida: a alocação original vira SUBSTITUIDA, e uma nova alocação, na mesma escala, aponta para ela ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-015 — Modelo de substituição|DATA-DEC-015]]). Auditoria: [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 — Auditoria|DATA-DEC-021]].

Relacionados: [[fluxos/FLUXO-SUBSTITUICAO]], [[seguranca/AUDITORIA]].

## ESC-005 — Uma alocação ativa por pessoa na escala
Uma pessoa tem no máximo uma alocação ativa em cada escala. Quem toca e canta fica com uma função por escala.

- **Origem:** [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-014 — A mesma pessoa mais de uma vez na mesma escala|DATA-DEC-014]] (aceita em 2026-10-21).
- **A DEFINIR:** quais status de alocação contam como "ativa" ([[decisoes/PENDENCIAS#Lacunas observadas no registro de 2026-10-21|PENDENCIAS]]).

Relacionados: [[modulos/ESCALAS]], [[dados/STATUS]].

## SEC-001 — Isolamento por igreja
Dados de uma igreja não podem ser expostos a outra.

Relacionados: [[seguranca/ISOLAMENTO-DE-DADOS]], [[seguranca/AUTORIZACAO]].

## IGR-001 — Um único OWNER por igreja
Cada igreja tem exatamente um OWNER. Quem cria a igreja torna-se o OWNER ([[fluxos/FLUXO-CADASTRO-IGREJA]]). Trocar de dono exige uma feature de transferência, ainda sem contrato.

- **Origem:** [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-007 — Quantidade de OWNER por igreja|DATA-DEC-007]] (aceita em 2026-10-21).

Relacionados: [[modulos/IGREJAS]], [[04-USUARIOS-E-PERMISSOES]].

## MEM-001 — Membro é usuário com conta
Só quem tem conta é membro. Antes do aceite existe apenas o convite pendente. Pessoas sem conta não podem ser escaladas.

- **Origem:** [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-010 — Membro sem conta|DATA-DEC-010]] (aceita em 2026-10-21).

Relacionados: [[modulos/MEMBROS]], [[fluxos/FLUXO-MEMBROS]].

## MEM-002 — Um vínculo por usuário em cada ministério
Um usuário tem no máximo um vínculo com cada ministério, com um único papel (LEADER ou MEMBER). Um líder que também serve recebe funções no mesmo vínculo. Um ministério pode ter vários líderes.

- **Origem:** [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-009 — Papel único por usuário em cada ministério|DATA-DEC-009]] e [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-008 — Quantidade de LEADER por ministério|DATA-DEC-008]] (aceitas em 2026-10-21).

Relacionados: [[modulos/EQUIPES]], [[modulos/MEMBROS]], [[04-USUARIOS-E-PERMISSOES]].

## MEM-003 — Quem convida quem
OWNER/ADMIN convida líder; líder convida membro.

- **Origem:** [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-011 — Convites|DATA-DEC-011]] (aceita em 2026-10-21), que manda registrar na Brain esta regra legada, confirmada pelo canvas. A regra está transcrita como no relatório.
- **Status do convite:** PENDENTE, ACEITO, EXPIRADO, CANCELADO (decididos em 2026-10-22; [[dados/STATUS#Convite]]).
- **A DEFINIR:** o fluxo de convite, inclusive as transições entre os status.

Relacionados: [[modulos/MEMBROS]], [[fluxos/FLUXO-MEMBROS]], [[fluxos/FLUXO-EQUIPES]].

## DIS-001 — Impedimento é registrado só pelo próprio membro
Só o próprio membro registra o impedimento dele. O líder não registra impedimento por um membro; se não quiser o membro participando, ele o exclui.

- **Origem:** [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-017 — Disponibilidade|DATA-DEC-017]] (aceita em 2026-10-21; complemento do PO em 2026-10-22).
- **A DEFINIR:** o significado exato de "excluir" (da escala ou do ministério) e o efeito no histórico, no contrato da feature de escalas ([[decisoes/PENDENCIAS#Significado de excluir o membro — DATA-DEC-017|PENDENCIAS]]). Vale a [[#HIS-001 — Nada com histórico é apagado|HIS-001]].

Relacionados: [[modulos/DISPONIBILIDADE]], [[modulos/ESCALAS]].

## HIS-001 — Nada com histórico é apagado
Nada com histórico é apagado. Igreja, ministério, vínculos e funções ganham status e data de término, em vez de serem excluídos.

- **Origem:** [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-012 — Inativação, arquivamento e exclusão|DATA-DEC-012]] (aceita em 2026-10-21).
- **Status:** ATIVO, INATIVO para vínculos (com a igreja e com o ministério), ministérios e funções (decididos em 2026-10-22). Status da Igreja: **A DEFINIR**.
- **Decisão relacionada:** uma escala em rascunho pode ser apagada se nunca foi publicada ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-016 — Status e transições|DATA-DEC-016]] e).
- **Consequência registrada na decisão:** um pedido de exclusão pela LGPD vai exigir uma feature de anonimização.

Relacionados: [[seguranca/AUDITORIA]], [[dados/STATUS]], [[05-REGRAS-DE-NEGOCIO#ESC-004 — Histórico de substituição|ESC-004]].

## Regra de governança
Se uma regra necessária não estiver documentada, ela deve ser marcada como **A DEFINIR** em vez de ser inventada.

As regras IGR-001, MEM-001 a MEM-003, DIS-001, HIS-001 e ESC-005 foram acrescentadas em 2026-10-21 e 2026-10-22 a partir das decisões registradas em [[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]]. Nenhuma regra anterior mudou de sentido; ESC-002 só trocou "equipe" por "ministério".

## Pendências que tocam estas regras
- **ESC-001:** o que são alocações "incompatíveis" entre escalas diferentes não está definido. Na mesma escala, vale a [[#ESC-005 — Uma alocação ativa por pessoa na escala|ESC-005]]. A disponibilidade foi decidida ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-017 — Disponibilidade|DATA-DEC-017]]).
- **ESC-003:** a lista completa de transições continua a validar ([[dados/STATUS]]).
- **ESC-005:** quais status contam como "ativa".
- **DIS-001:** o que é "excluir" o membro.
- **SEC-001:** violada no sistema legado ([[seguranca/RISCOS-DO-LEGADO]]). A correção do legado não se aplica, porque o app legado não tem uso real (2026-10-22); os riscos continuam nos projetos antigos enquanto estiverem ativos.
- O banco legado não consegue cumprir ESC-001, ESC-002 e ESC-004: não tem intervalo de horário, função nem substituição ([[tecnico/DIVERGENCIAS-LEGADO]]).
- Lista completa: [[decisoes/PENDENCIAS]].

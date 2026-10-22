---
tipo: politica-acesso
status: ativo
atualizado: 2026-10-22
relacionado:
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
  - "[[decisoes/ADR-001-ESTRUTURA-INICIAL]]"
  - "[[seguranca/AUTORIZACAO]]"
---
# Usuários e Permissões

A recomendação é usar uma entidade única de usuário com papéis definidos por relacionamento ([[decisoes/ADR-001-ESTRUTURA-INICIAL|ADR-001]]). O usuário do Mescala é uma tabela própria, ligada ao provedor de autenticação ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-019 — Identidade × provedor de autenticação|DATA-DEC-019]]).

## Papéis da igreja
Decididos em 2026-10-21 ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]]):
- **OWNER**: inclui ADMIN. Exatamente um por igreja ([[05-REGRAS-DE-NEGOCIO#IGR-001 — Um único OWNER por igreja|IGR-001]]).
- **ADMIN**
- **MEMBER**: todo vinculado à igreja é ao menos MEMBER.

"Líder" na igreja **não é papel**: é derivado (quem lidera ao menos um ministério).

Até 2026-10-21, esta nota listava OWNER, ADMIN, LEADER e MEMBER como papéis da igreja.

## Papéis do ministério
- **LEADER**: um ministério pode ter vários líderes ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-008 — Quantidade de LEADER por ministério|DATA-DEC-008]]).
- **MEMBER**

Um usuário tem um vínculo e um papel em cada ministério; um líder que também serve recebe funções no mesmo vínculo ([[05-REGRAS-DE-NEGOCIO#MEM-002 — Um vínculo por usuário em cada ministério|MEM-002]]).

## Cargo não é papel
ANCIÃO é **cargo**, sem tabela e sem efeito de autorização ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]]). Nenhuma permissão se baseia em cargo.

## Vínculos
- Um usuário pode estar vinculado a **várias igrejas**, com um vínculo por (igreja, usuário). Por isso o backend precisa de "igreja atual" no contexto de cada requisição ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-006 — Usuário em mais de uma igreja|DATA-DEC-006]]).
- Só quem tem conta é membro ([[05-REGRAS-DE-NEGOCIO#MEM-001 — Membro é usuário com conta|MEM-001]]).
- Entrada por convite: OWNER/ADMIN convida líder; líder convida membro. O aceite cria os vínculos ([[05-REGRAS-DE-NEGOCIO#MEM-003 — Quem convida quem|MEM-003]]).
- Status dos vínculos (com a igreja e com o ministério): ATIVO, INATIVO, decididos em 2026-10-22. Nada com histórico é apagado ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]]).

## Princípio
A autorização deve considerar **papel + escopo**. Um líder de um ministério não recebe automaticamente acesso administrativo a outros ministérios.

- Permissões = papel + escopo, sem tabela de permissões ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-002 — Mapeamento dos termos do Data Task|DATA-DEC-002]]).
- Papéis, vínculos, igreja e permissões nunca vêm do token de autenticação; vêm do banco do Mescala, no backend ([[decisoes/ADR-003-AUTENTICACAO|ADR-003]], item 7).

## Relacionamentos
- [[dados/ENTIDADES#Usuário|Usuário]]
- [[modulos/IGREJAS]]
- [[modulos/EQUIPES]]
- [[seguranca/AUTORIZACAO]]
- [[MOCs/MOC-USUARIOS]]

## Pendências
- Regras de autorização em aberto (relatório de dados, seção 7): ADMIN gerencia todos os ministérios? O que o LEADER faz fora da escala? Quem cria programações? **A DEFINIR** ([[decisoes/PENDENCIAS#Outras pendências registradas|PENDENCIAS]]).
- Como nasce o registro do usuário do Mescala: [[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]].
- Fluxo do convite (transições entre os status): **A DEFINIR**.
- Feature de transferência de OWNER: exigida pela DATA-DEC-007, sem contrato.
- O [[Fluxograma.canvas]] atribui permissões aos perfis "ADMIN (ANCIÃO)" e "Líder de Ministério"; elas não foram incorporadas como regra ([[produto/CONCEITOS-DO-CANVAS]]).
- O legado usa outros papéis (organizador, lider, membro): divergência D2 em [[tecnico/DIVERGENCIAS-LEGADO]].

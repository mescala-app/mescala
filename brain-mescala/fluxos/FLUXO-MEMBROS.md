---
tipo: fluxo
status: ativo
atualizado: 2026-10-22
---
# Fluxo — Membros
1. Usuário é vinculado à [[modulos/IGREJAS|Igreja]].
2. Recebe papel no escopo da igreja.
3. Pode ser vinculado a um ou mais [[modulos/EQUIPES|Ministérios]].
4. Recebe as [[modulos/FUNCOES|Funções]] que pode exercer.

Veja [[MOCs/MOC-USUARIOS]].

## Decisões
- **Passo 1:** só quem tem conta é membro; antes do aceite existe apenas o convite pendente ([[05-REGRAS-DE-NEGOCIO#MEM-001 — Membro é usuário com conta|MEM-001]]). O aceite do convite cria os vínculos; a criação de conta é da autenticação ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-011 — Convites|DATA-DEC-011]]).
- **Passo 2:** papel OWNER, ADMIN ou MEMBER ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]]).
- **Passo 3:** papel LEADER ou MEMBER, com um vínculo por ministério ([[05-REGRAS-DE-NEGOCIO#MEM-002 — Um vínculo por usuário em cada ministério|MEM-002]]).
- **Passo 4:** as funções ficam no vínculo com o ministério; um líder que também serve recebe funções no mesmo vínculo.
- Quem convida quem: [[05-REGRAS-DE-NEGOCIO#MEM-003 — Quem convida quem|MEM-003]]. Status do convite: PENDENTE, ACEITO, EXPIRADO, CANCELADO (2026-10-22).
- Vínculos são inativados (ATIVO, INATIVO), nunca apagados ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]]).

## Pendências
- Fluxo do convite (transições entre os status): **A DEFINIR**.
- O que é "excluir" um membro quando o líder não o quer participando: **A DEFINIR** no contrato da feature de escalas ([[decisoes/PENDENCIAS#Significado de excluir o membro — DATA-DEC-017|PENDENCIAS]]).

Legado: vínculo por convite com token e cadastro de pessoas sem conta ([[tecnico/LEGADO-ATUAL]]).

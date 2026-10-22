---
tipo: modulo
status: ativo
atualizado: 2026-10-22
---
# Membros
Membros são usuários vinculados a uma igreja e, opcionalmente, a um ou mais ministérios.

Relacionamentos: [[modulos/IGREJAS]], [[modulos/EQUIPES]], [[modulos/FUNCOES]], [[modulos/DISPONIBILIDADE]], [[modulos/ESCALAS]].

Fluxo: [[fluxos/FLUXO-MEMBROS]].

## Decisões
- **Só quem tem conta é membro.** Antes do aceite existe apenas o convite pendente; pessoas sem conta não podem ser escaladas ([[05-REGRAS-DE-NEGOCIO#MEM-001 — Membro é usuário com conta|MEM-001]]).
- **Papéis:** na igreja, OWNER, ADMIN ou MEMBER; no ministério, LEADER ou MEMBER ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]]).
- **Vínculo com o ministério:** um por (ministério, usuário), com um papel ([[05-REGRAS-DE-NEGOCIO#MEM-002 — Um vínculo por usuário em cada ministério|MEM-002]]).
- **Convite:** convite oficial, com só o hash do token; o aceite cria os vínculos; OWNER/ADMIN convida líder e líder convida membro ([[05-REGRAS-DE-NEGOCIO#MEM-003 — Quem convida quem|MEM-003]]; [[dados/ENTIDADES#Convite|Convite]]). Status: PENDENTE, ACEITO, EXPIRADO, CANCELADO (2026-10-22).
- **Atributos da pessoa:** nome completo, apelido, email, WhatsApp ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-013 — Atributos e unicidade de nomes|DATA-DEC-013]]).
- **Impedimentos:** registrados só pelo próprio membro ([[05-REGRAS-DE-NEGOCIO#DIS-001 — Impedimento é registrado só pelo próprio membro|DIS-001]]).
- **Vínculos inativados, não apagados:** status ATIVO ou INATIVO (2026-10-22) e data de término ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]]).

## Pendências
- Fluxo do convite: **A DEFINIR** (a DATA-DEC-011 diz que precisa ser documentado).
- O que é "excluir" um membro quando o líder não o quer participando: **A DEFINIR** no contrato da feature de escalas ([[decisoes/PENDENCIAS#Significado de excluir o membro — DATA-DEC-017|PENDENCIAS]]).
- Provisionamento do usuário: [[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]].

## Legado
O legado tem `member_contacts` (pessoas sem conta cadastradas pelo líder) e convites por email com token em texto puro ([[tecnico/LEGADO-ATUAL]]). O modelo oficial não tem membro sem conta e guarda só o hash do token ([[tecnico/DIVERGENCIAS-LEGADO]]).

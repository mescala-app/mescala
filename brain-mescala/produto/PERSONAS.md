---
tipo: produto
---
# Personas
## Master / Owner
Administra a igreja e sua estrutura.

## Líder
Opera ministérios, programações e escalas dentro de seu escopo.

## Membro
Consulta suas escalas, disponibilidade, confirmações e substituições.

Permissões: [[04-USUARIOS-E-PERMISSOES]]. Jornadas: [[produto/JORNADAS]].

## Decisões ligadas às personas
- **Master / Owner:** cada igreja tem exatamente um OWNER, e OWNER inclui ADMIN ([[05-REGRAS-DE-NEGOCIO#IGR-001 — Um único OWNER por igreja|IGR-001]]; [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]]).
- **Líder:** não é papel da igreja; é quem tem papel LEADER em ao menos um ministério (DATA-DEC-005).
- **Membro:** só quem tem conta é membro ([[05-REGRAS-DE-NEGOCIO#MEM-001 — Membro é usuário com conta|MEM-001]]).

## Pendências
- O [[Fluxograma.canvas]] cita os perfis "ADMIN (ANCIÃO)" e "Líder de Ministério". Desde 2026-10-21: ADMIN é papel da igreja, ANCIÃO é cargo sem efeito de autorização, e "Líder de Ministério" é o LEADER do ministério (DATA-DEC-005). Uma persona para o ADMIN e as permissões que o canvas atribui a esses perfis continuam **A DEFINIR** ([[produto/CONCEITOS-DO-CANVAS]]).
- O app legado usa os perfis "Líder de Igreja", "Líder de Equipe" e "Membro de Equipe" ([[tecnico/LEGADO-ATUAL]]).

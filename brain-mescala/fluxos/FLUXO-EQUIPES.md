---
tipo: fluxo
status: ativo
aliases:
  - "Fluxo — Equipes"
  - "Fluxo — Ministérios"
atualizado: 2026-10-22
---
# Fluxo — Ministérios (antes: Equipes)
1. OWNER/ADMIN acessa [[modulos/IGREJAS|Igreja]].
2. Cria [[modulos/EQUIPES|Ministério]].
3. Define [[modulos/FUNCOES|Funções]].
4. Vincula líderes e membros conforme [[04-USUARIOS-E-PERMISSOES]].

Vocabulário: até 2026-10-21 este fluxo se chamava "Fluxo — Equipes" ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]]). O arquivo manteve o nome `FLUXO-EQUIPES`.

## Decisões
- **Passo 2:** nome do ministério único na igreja, sem diferenciar maiúsculas ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-013 — Atributos e unicidade de nomes|DATA-DEC-013]]).
- **Passo 3:** nome da função único no ministério ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-013 — Atributos e unicidade de nomes|DATA-DEC-013]]).
- **Passo 4:** um ministério pode ter vários líderes; cada usuário tem um vínculo e um papel por ministério ([[05-REGRAS-DE-NEGOCIO#MEM-002 — Um vínculo por usuário em cada ministério|MEM-002]]). Quem ainda não tem conta entra por convite: OWNER/ADMIN convida líder; líder convida membro ([[05-REGRAS-DE-NEGOCIO#MEM-003 — Quem convida quem|MEM-003]]).
- Ministério, funções e vínculos são inativados (ATIVO, INATIVO), nunca apagados ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]]).

## Pendências
- Se o ADMIN gerencia todos os ministérios: **A DEFINIR** ([[decisoes/PENDENCIAS#Outras pendências registradas|PENDENCIAS]]).
- Fluxo do convite: **A DEFINIR**.

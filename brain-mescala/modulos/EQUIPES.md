---
tipo: modulo
status: ativo
aliases:
  - Equipes
  - Equipe
  - Ministérios
  - Ministério
atualizado: 2026-10-22
relacionado:
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
---
# Ministérios (antes: Equipes)
Ministérios agrupam membros e funções dentro de uma igreja.

Um ministério pertence a uma [[modulos/IGREJAS|Igreja]], possui [[modulos/MEMBROS|Membros]] e define [[modulos/FUNCOES|Funções]]. Pode participar de [[modulos/PROGRAMACOES|Programações]] e possuir [[modulos/ESCALAS|Escalas]].

Fluxo: [[fluxos/FLUXO-EQUIPES]].

## Vocabulário
**Ministério** é o termo canônico; no código, `ministry` ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]], aceita em 2026-10-21). Até então, esta nota se chamava "Equipes". O arquivo manteve o nome `EQUIPES` para não quebrar links nem o histórico; "Equipe" e "Equipes" ficam como `aliases`.

## Decisões
- **Líderes:** um ministério pode ter vários LEADER ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-008 — Quantidade de LEADER por ministério|DATA-DEC-008]]).
- **Vínculo:** um por (ministério, usuário), com um único papel, LEADER ou MEMBER; um líder que também serve recebe funções no mesmo vínculo ([[05-REGRAS-DE-NEGOCIO#MEM-002 — Um vínculo por usuário em cada ministério|MEM-002]]).
- **Nome:** único por igreja, sem diferenciar maiúsculas ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-013 — Atributos e unicidade de nomes|DATA-DEC-013]]).
- **Inativação:** nada com histórico é apagado; ministério e vínculos têm status ATIVO ou INATIVO (2026-10-22) e data de término ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]]).
- **"Líder de Ministério"** do canvas corresponde ao papel LEADER no ministério ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]]). As permissões escritas no cartão do canvas não foram incorporadas ([[produto/CONCEITOS-DO-CANVAS]]).
- Os campos legados de quantidade por culto, suplentes e formulário de ausência não entram no modelo oficial ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-013 — Atributos e unicidade de nomes|DATA-DEC-013]]).

## Pendências
- Se o ADMIN gerencia todos os ministérios: **A DEFINIR** ([[decisoes/PENDENCIAS#Outras pendências registradas|PENDENCIAS]]).
- O que é "excluir" um membro, quando o líder não o quer participando: **A DEFINIR** no contrato da feature de escalas ([[decisoes/PENDENCIAS#Significado de excluir o membro — DATA-DEC-017|PENDENCIAS]]).

## Legado
Tabela `equipes`, com um único `lider_id` e campos sem correspondência na Brain ([[tecnico/LEGADO-ATUAL]], [[tecnico/DIVERGENCIAS-LEGADO]]). Riscos S1, S4, S5 e S6 em [[seguranca/RISCOS-DO-LEGADO]]. O app legado não tem uso real (2026-10-22): não há migração desses dados.

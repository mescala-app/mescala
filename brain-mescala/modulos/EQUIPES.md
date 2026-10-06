---
tipo: modulo
status: ativo
---
# Equipes
Equipes agrupam membros e funções dentro de uma igreja.

Uma equipe pertence a [[modulos/IGREJAS|Igreja]], possui [[modulos/MEMBROS|Membros]] e define [[modulos/FUNCOES|Funções]]. Pode participar de [[modulos/PROGRAMACOES|Programações]] e possuir [[modulos/ESCALAS|Escalas]].

Fluxo: [[fluxos/FLUXO-EQUIPES]].

## Pendências
- **Vocabulário:** o [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]], o [[Fluxograma.canvas]] e o Data Task do PO chamam este conceito de "Ministério". Se é o mesmo conceito e qual o nome canônico está em [[decisoes/PENDENCIAS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]]. Esta nota continua dizendo "Equipe" até a decisão.
- Quantidade de líderes: [[decisoes/PENDENCIAS#DATA-DEC-008 — Quantidade de LEADER por ministério|DATA-DEC-008]].
- Papel único por usuário na equipe: [[decisoes/PENDENCIAS#DATA-DEC-009 — Papel único por usuário em cada ministério|DATA-DEC-009]].
- Inativação e arquivamento: [[decisoes/PENDENCIAS#DATA-DEC-012 — Inativação, arquivamento e exclusão|DATA-DEC-012]].
- Atributos e unicidade do nome: [[decisoes/PENDENCIAS#DATA-DEC-013 — Atributos e unicidade de nomes|DATA-DEC-013]].
- "Líder de Ministério" no canvas: [[produto/CONCEITOS-DO-CANVAS]].

## Legado
Tabela `equipes`, com um único `lider_id` e campos sem correspondência na Brain ([[tecnico/LEGADO-ATUAL]], [[tecnico/DIVERGENCIAS-LEGADO]]). Riscos S1, S4, S5 e S6 em [[seguranca/RISCOS-DO-LEGADO]].

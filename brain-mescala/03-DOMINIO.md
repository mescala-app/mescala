---
tipo: dominio
status: ativo
---
# Domínio

## Entidades nucleares
- [[modulos/IGREJAS|Igreja]]
- [[dados/ENTIDADES#Usuário|Usuário]]
- [[modulos/EQUIPES|Equipe]]
- [[modulos/FUNCOES|Função]]
- [[modulos/PROGRAMACOES|Programação]]
- [[modulos/ESCALAS|Escala]]
- [[dados/ENTIDADES#Alocação|Alocação]]
- [[modulos/DISPONIBILIDADE|Disponibilidade]]

## Relações principais
Uma [[modulos/IGREJAS|Igreja]] possui [[modulos/EQUIPES|equipes]] e usuários vinculados. Uma [[modulos/PROGRAMACOES|Programação]] representa um evento/data. Cada equipe participante pode possuir sua própria [[modulos/ESCALAS|Escala]]. A escala é composta por [[dados/ENTIDADES#Alocação|alocações]] de membros em funções.

## Distinções essenciais
- Equipe não é função.
- Programação não é escala.
- Escala não é alocação.
- Papel global e papel dentro da equipe são conceitos diferentes.

Veja [[dados/RELACIONAMENTOS]] e [[MOCs/MOC-DOMINIO]].

## Pendências de vocabulário e escopo
- **Equipe × Ministério:** estas notas dizem "Equipe"; o [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]], o [[Fluxograma.canvas]] e o Data Task do PO dizem "Ministério". Não se sabe se são o mesmo conceito. Em decisão: [[decisoes/PENDENCIAS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]]. Até lá, o termo destas notas não muda.
- **Conceitos do canvas sem definição:** Culto, Agenda, Cronograma, Reunião, Comissão, "ADMIN (ANCIÃO)" e "Líder de Ministério" ([[produto/CONCEITOS-DO-CANVAS]]). **A DEFINIR** ([[decisoes/PENDENCIAS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma|DATA-DEC-003]], [[decisoes/PENDENCIAS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]]).
- **Termos do Data Task do PO** (Convocações, Confirmações, Ausências, Permissões, Funções ministeriais): correspondência com os conceitos acima em decisão ([[decisoes/PENDENCIAS#DATA-DEC-002 — Mapeamento dos termos do Data Task|DATA-DEC-002]]).
- **Recorrência de programações:** [[decisoes/PENDENCIAS#DATA-DEC-004 — Programações recorrentes|DATA-DEC-004]].
- O sistema legado usa outro modelo ([[tecnico/DIVERGENCIAS-LEGADO]]).

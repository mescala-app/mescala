---
tipo: modulo
status: ativo
atualizado: 2026-10-22
---
# Programações
Programação representa um evento ou compromisso com data, horário e contexto operacional.

Uma programação pode envolver vários [[modulos/EQUIPES|Ministérios]]. Cada ministério pode possuir sua própria [[modulos/ESCALAS|Escala]].

Fluxo: [[fluxos/FLUXO-PROGRAMACOES]].
Regra associada: [[05-REGRAS-DE-NEGOCIO#ESC-001 — Conflito de horário]].

## Decisões
Aceitas em 2026-10-21 ([[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]]):
- **Só Programação é modelada** nesta fundação ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma|DATA-DEC-003]]):
  - **Culto** = programação comum;
  - **Agenda** = consulta das programações, sem tabela;
  - **Reunião, Comissão, Cronograma e Pauta** ficam fora até serem documentados na Brain (**A DEFINIR**, [[produto/CONCEITOS-DO-CANVAS]]).
- **Programação é uma ocorrência datada**, com início e fim, **sem recorrência** nesta fundação ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-004 — Programações recorrentes|DATA-DEC-004]]).
- **Atributo:** nome ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-013 — Atributos e unicidade de nomes|DATA-DEC-013]]).

## Pendências
- Quem cria programações: **A DEFINIR** ([[decisoes/PENDENCIAS#Outras pendências registradas|PENDENCIAS]]).
- Cancelamento de programação: nada foi decidido (a decisão de 2026-10-22 de nunca cancelar trata só da Escala). **A DEFINIR**, se o tema aparecer ([[decisoes/PENDENCIAS#Cancelamento de Programação|PENDENCIAS]]).
- Reunião, Comissão, Cronograma e Pauta: **A DEFINIR**.

## Legado
A tabela legada `eventos` guarda um modelo semanal (dia + hora, nome padrão "Culto"), sem data e sem fim ([[tecnico/LEGADO-ATUAL]], [[tecnico/DIVERGENCIAS-LEGADO]]). Pela DATA-DEC-004, ela não migra para programações; e o app legado não tem uso real (2026-10-22), então não há migração de dados.

---
tipo: modulo
status: ativo
---
# Programações
Programação representa um evento ou compromisso com data, horário e contexto operacional.

Uma programação pode envolver várias [[modulos/EQUIPES|Equipes]]. Cada equipe pode possuir sua própria [[modulos/ESCALAS|Escala]].

Fluxo: [[fluxos/FLUXO-PROGRAMACOES]].
Regra associada: [[05-REGRAS-DE-NEGOCIO#ESC-001 — Conflito de horário]].

## Pendências
- Relação com Culto, Agenda, Cronograma, Reunião e Comissão, citados no [[Fluxograma.canvas]] sem definição ([[produto/CONCEITOS-DO-CANVAS]]): [[decisoes/PENDENCIAS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma|DATA-DEC-003]].
- Programações recorrentes: [[decisoes/PENDENCIAS#DATA-DEC-004 — Programações recorrentes|DATA-DEC-004]].
- Quem cria programações: **A DEFINIR** ([[decisoes/PENDENCIAS]]).

## Legado
A tabela legada `eventos` guarda um modelo semanal (dia + hora, nome padrão "Culto"), sem data e sem fim ([[tecnico/LEGADO-ATUAL]], [[tecnico/DIVERGENCIAS-LEGADO]]).

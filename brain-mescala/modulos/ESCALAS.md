---
tipo: modulo
status: ativo
relacionado:
  - "[[modulos/PROGRAMACOES]]"
  - "[[dados/ENTIDADES#Alocação|Alocação]]"
---
# Escalas
A escala organiza a participação de uma equipe em uma [[modulos/PROGRAMACOES|Programação]].

Ela não deve armazenar posições fixas por coluna. Sua composição ocorre por [[dados/ENTIDADES#Alocação|Alocações]], permitindo qualquer conjunto de [[modulos/FUNCOES|Funções]].

## Fluxos
- [[fluxos/FLUXO-ESCALAS]]
- [[fluxos/FLUXO-CONFIRMACAO]]
- [[fluxos/FLUXO-SUBSTITUICAO]]

## Regras
- [[05-REGRAS-DE-NEGOCIO#ESC-001 — Conflito de horário]]
- [[05-REGRAS-DE-NEGOCIO#ESC-002 — Compatibilidade de função]]
- [[05-REGRAS-DE-NEGOCIO#ESC-003 — Estado controlado]]

## Dados
- [[dados/STATUS]]
- [[dados/RELACIONAMENTOS]]
- [[dados/EVENTOS-DO-SISTEMA]]

## Pendências
- Mesma pessoa mais de uma vez na escala: [[decisoes/PENDENCIAS#DATA-DEC-014 — A mesma pessoa mais de uma vez na mesma escala|DATA-DEC-014]].
- Modelo de substituição: [[decisoes/PENDENCIAS#DATA-DEC-015 — Modelo de substituição|DATA-DEC-015]].
- Status e transições: [[decisoes/PENDENCIAS#DATA-DEC-016 — Status e transições|DATA-DEC-016]].
- Escalas legadas: [[decisoes/PENDENCIAS#DATA-DEC-022 — Convivência com o legado e migração de dados|DATA-DEC-022]].

## Legado
`escalas` sem status e `escala_membros` sem função, com `confirmado` booleano; nenhuma tela cria escala ([[tecnico/LEGADO-ATUAL]], [[tecnico/DIVERGENCIAS-LEGADO]]). Riscos S9 e S10 em [[seguranca/RISCOS-DO-LEGADO]].

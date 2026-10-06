---
tipo: maquina-estados
status: inicial
---
# Status

## Escala
- RASCUNHO
- PUBLICADA
- CONCLUIDA
- CANCELADA

## Alocação / confirmação
- AGUARDANDO_CONFIRMACAO
- CONFIRMADA
- RECUSADA
- SUBSTITUICAO_PENDENTE
- SUBSTITUIDA

A definição final das transições deve ser validada antes da implementação definitiva.

Relacionados: [[modulos/ESCALAS]], [[fluxos/FLUXO-CONFIRMACAO]], [[fluxos/FLUXO-SUBSTITUICAO]].

## Pendências
- Transições e perguntas (a) a (e): [[decisoes/PENDENCIAS#DATA-DEC-016 — Status e transições|DATA-DEC-016]].
- Status de igreja, equipe, vínculos e funções (não definidos): [[decisoes/PENDENCIAS#DATA-DEC-012 — Inativação, arquivamento e exclusão|DATA-DEC-012]].
- Status de convite (não definidos; o legado usa pending, accepted e expired): [[decisoes/PENDENCIAS#DATA-DEC-011 — Convites|DATA-DEC-011]].
- O legado não tem status de escala e usa um booleano ambíguo na escalação ([[tecnico/DIVERGENCIAS-LEGADO]]).

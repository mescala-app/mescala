---
tipo: seguranca
status: ativo
---
# Autorização
Toda operação deve verificar papel e escopo.

Exemplo: ser LEADER em uma [[modulos/EQUIPES|Equipe]] não concede acesso automático a outra equipe.

Base: [[04-USUARIOS-E-PERMISSOES]].
Complementos: [[seguranca/ISOLAMENTO-DE-DADOS]] e [[seguranca/AUDITORIA]].

## Pendências
- Papéis em cada camada e significado de "ANCIÃO": [[decisoes/PENDENCIAS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]].
- Regras em aberto, a fechar com o Arquiteto: ADMIN gerencia todas as equipes? O que o LEADER pode fazer fora da escala? Quem cria programações? **A DEFINIR** ([[decisoes/PENDENCIAS]]).
- Modelo de RLS do schema oficial: [[decisoes/PENDENCIAS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]].
- O que o [[Fluxograma.canvas]] diz sobre perfis não foi incorporado como regra ([[produto/CONCEITOS-DO-CANVAS]]).

## Legado
No sistema legado, a autorização é feita só por policies de RLS e tem falhas conhecidas (S1, S2, S5–S9 em [[seguranca/RISCOS-DO-LEGADO]]). Correção em decisão: [[decisoes/PENDENCIAS#DATA-DEC-023 — Correção urgente de segurança no legado|DATA-DEC-023]].

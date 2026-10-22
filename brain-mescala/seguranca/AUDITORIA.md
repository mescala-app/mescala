---
tipo: seguranca
status: ativo
atualizado: 2026-10-22
relacionado:
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
---
# Auditoria
Mudanças críticas devem permitir identificar ator, data e alteração realizada.

Prioridade para:
- publicação de escala;
- mudança de alocação;
- confirmação/recusa;
- substituição;
- alteração de permissões.

Relacionados: [[modulos/ESCALAS]], [[fluxos/FLUXO-SUBSTITUICAO]], [[dados/EVENTOS-DO-SISTEMA]].

## Decisões
- **Mecanismo:** tabela de auditoria **só de inserção**, gravada pelo backend **na mesma transação** da operação. As features já nascem auditáveis ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 — Auditoria|DATA-DEC-021]], aceita em 2026-10-21). Até então, o mecanismo estava fora do [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] e **A DEFINIR**.
- **Conteúdo proposto pelo relatório** (seção 13.2): igreja, ator, ação, entidade, id, antes, depois e quando ([[dados/ENTIDADES#Registro de auditoria|Registro de auditoria]]).
- **Histórico preservado:** nada com histórico é apagado; igreja, ministério, vínculos e funções são inativados por status e data de término ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]]). A substituição mantém a alocação original como SUBSTITUIDA ([[05-REGRAS-DE-NEGOCIO#ESC-004 — Histórico de substituição|ESC-004]]).
- **LGPD:** um pedido de exclusão vai exigir uma feature de anonimização (consequência registrada na DATA-DEC-012).

## Pendências
- O que é "excluir" um membro, e o efeito no histórico: **A DEFINIR** no contrato da feature de escalas ([[decisoes/PENDENCIAS#Significado de excluir o membro — DATA-DEC-017|PENDENCIAS]]).
- Mecanismo de eventos: **A DEFINIR** ([[dados/EVENTOS-DO-SISTEMA]]).

## Legado
O sistema legado não tem auditoria, e apagar uma igreja ou um usuário apaga o histórico em cascata ([[tecnico/LEGADO-ATUAL]], [[tecnico/DIVERGENCIAS-LEGADO]]).

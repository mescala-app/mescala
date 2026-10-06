---
tipo: seguranca
status: inicial
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

## Pendências
- Mecanismo de auditoria: [[decisoes/PENDENCIAS#DATA-DEC-021 — Auditoria|DATA-DEC-021]] (fora do [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]]).
- Preservação do histórico em inativação ou exclusão: [[decisoes/PENDENCIAS#DATA-DEC-012 — Inativação, arquivamento e exclusão|DATA-DEC-012]].

## Legado
O sistema legado não tem auditoria, e apagar uma igreja ou um usuário apaga o histórico em cascata ([[tecnico/LEGADO-ATUAL]], [[tecnico/DIVERGENCIAS-LEGADO]]).

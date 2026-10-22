---
tipo: produto
status: inicial
---
# Roadmap
## Fase 1
Estrutura base: igreja, ministérios, usuários, membros e funções.

## Fase 2
Programações, escalas e alocações.

## Fase 3
Confirmação, disponibilidade e substituição.

## Fase 4
Notificações, relatórios, auditoria e refinamentos.

Arquitetura: [[02-ARQUITETURA]].

## Pré-requisitos técnicos (ADR-002)
Antes da Fase 1, o [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] exige:
1. a fundação técnica do backend: [[features/FOUNDATION-001]] (**cumprida**: implementada e encerrada em 2026-10-19, commit `7f26d30`);
2. a fundação oficial de persistência, antes das features que dependem do banco: **FOUNDATION-002 — Fundação de Persistência**. As decisões de dados, o projeto Supabase e o local das migrations foram tomados em 2026-10-21 e 2026-10-22 ([[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]], [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]], [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04]]); o contrato ainda não foi emitido.

Em paralelo, a fundação de autenticação (AUTH-001), que não usa banco, está sem bloqueios de decisão ([[decisoes/ADR-003-AUTENTICACAO|ADR-003]], [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES|DEC-02]]).

Entrega: [[features/FLUXO-DE-ENTREGA]].

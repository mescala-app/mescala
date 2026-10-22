---
tipo: fluxo
status: ativo
atualizado: 2026-10-21
---
# Fluxo — Substituição
1. Uma alocação recusada ou indisponível gera necessidade de substituição.
2. Usuário autorizado seleciona membro compatível.
3. O backend repete validações de conflito, disponibilidade e função.
4. O novo membro assume a alocação operacional.
5. O membro original permanece no histórico.

Regra: [[05-REGRAS-DE-NEGOCIO#ESC-004 — Histórico de substituição]].
Auditoria: [[seguranca/AUDITORIA]].

## Decisões
- **Passos 4 e 5:** a alocação original vira SUBSTITUIDA, e uma nova alocação, na mesma escala, aponta para ela. O histórico fica na própria tabela de alocações ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-015 — Modelo de substituição|DATA-DEC-015]]).
- **Auditoria:** a substituição é registrada numa tabela de auditoria só de inserção, gravada pelo backend na mesma transação ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 — Auditoria|DATA-DEC-021]]).
- **Passo 3:** a nova alocação também respeita a [[05-REGRAS-DE-NEGOCIO#ESC-005 — Uma alocação ativa por pessoa na escala|ESC-005]].

## Pendências
- Quem é o "usuário autorizado" no passo 2: **A DEFINIR** ([[decisoes/PENDENCIAS#Outras pendências registradas|PENDENCIAS]]).

O legado não tem substituição ([[tecnico/DIVERGENCIAS-LEGADO]]).

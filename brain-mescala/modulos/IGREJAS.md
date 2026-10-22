---
tipo: modulo
status: ativo
atualizado: 2026-10-22
---
# Igrejas
A igreja é a raiz organizacional do tenant.

Relaciona-se com [[modulos/EQUIPES|Ministérios]], [[modulos/MEMBROS|Membros]], [[04-USUARIOS-E-PERMISSOES]] e [[seguranca/ISOLAMENTO-DE-DADOS]].

Fluxo de origem: [[fluxos/FLUXO-CADASTRO-IGREJA]].

## Decisões
- **OWNER:** exatamente um por igreja ([[05-REGRAS-DE-NEGOCIO#IGR-001 — Um único OWNER por igreja|IGR-001]]).
- **Usuários:** um usuário pode estar vinculado a várias igrejas, com um vínculo por igreja; o backend precisa de "igreja atual" no contexto de cada requisição ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-006 — Usuário em mais de uma igreja|DATA-DEC-006]]).
- **Atributos:** nome e endereço ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-013 — Atributos e unicidade de nomes|DATA-DEC-013]]).
- **Inativação:** nada com histórico é apagado; a igreja ganha status e data de término ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]]).

## Pendências
- Valores do status da Igreja: **A DEFINIR**. A decisão de 2026-10-22 fixou ATIVO e INATIVO para vínculos, ministérios e funções, mas não cita a igreja ([[decisoes/PENDENCIAS#Lacunas observadas no registro de 2026-10-21|PENDENCIAS]]).
- Feature de transferência de OWNER: exigida pela DATA-DEC-007, sem contrato.

## Legado
Tabela `igrejas`, com `organizador_id` e colunas em português (divergência D3 em [[tecnico/DIVERGENCIAS-LEGADO]]). Apagar uma igreja apaga o histórico em cascata. Risco S4 (leitura anônima de todas as colunas) em [[seguranca/RISCOS-DO-LEGADO]].

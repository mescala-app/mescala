---
tipo: modulo
status: ativo
---
# Igrejas
A igreja é a raiz organizacional do tenant.

Relaciona-se com [[modulos/EQUIPES|Equipes]], [[modulos/MEMBROS|Membros]], [[04-USUARIOS-E-PERMISSOES]] e [[seguranca/ISOLAMENTO-DE-DADOS]].

Fluxo de origem: [[fluxos/FLUXO-CADASTRO-IGREJA]].

## Pendências
- Usuário em mais de uma igreja: [[decisoes/PENDENCIAS#DATA-DEC-006 — Usuário em mais de uma igreja|DATA-DEC-006]].
- Quantidade de OWNER: [[decisoes/PENDENCIAS#DATA-DEC-007 — Quantidade de OWNER por igreja|DATA-DEC-007]].
- Inativação, arquivamento e exclusão: [[decisoes/PENDENCIAS#DATA-DEC-012 — Inativação, arquivamento e exclusão|DATA-DEC-012]].
- Atributos: [[decisoes/PENDENCIAS#DATA-DEC-013 — Atributos e unicidade de nomes|DATA-DEC-013]].

## Legado
Tabela `igrejas`, com `organizador_id` e colunas em português (divergência D3 em [[tecnico/DIVERGENCIAS-LEGADO]]). Apagar uma igreja apaga o histórico em cascata. Risco S4 (leitura anônima de todas as colunas) em [[seguranca/RISCOS-DO-LEGADO]].

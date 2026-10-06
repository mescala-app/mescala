---
tipo: seguranca
status: ativo
---
# Isolamento de Dados
O Mescala é multi-tenant por [[modulos/IGREJAS|Igreja]].

Toda leitura e escrita deve respeitar o tenant correspondente. Nenhum usuário pode acessar dados de outra igreja sem vínculo e autorização válidos.

Regra: [[05-REGRAS-DE-NEGOCIO#SEC-001 — Isolamento por igreja]].

## Pendências
- Usuário em mais de uma igreja: [[decisoes/PENDENCIAS#DATA-DEC-006 — Usuário em mais de uma igreja|DATA-DEC-006]].
- Schema e modelo de RLS do modelo oficial: [[decisoes/PENDENCIAS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]] (depende da [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04]]).
- Contexto de igreja nas requisições depende da autenticação: [[decisoes/PENDENCIAS#DEC-03 — Autenticação|DEC-03]].

## Legado
O SEC-001 está violado no sistema legado, segundo leitura estática do relatório de dados: S1, S4, S5, S6 e S10 em [[seguranca/RISCOS-DO-LEGADO]]. O banco legado não tem FK composta por igreja ([[tecnico/DIVERGENCIAS-LEGADO]]). Correção em decisão: [[decisoes/PENDENCIAS#DATA-DEC-023 — Correção urgente de segurança no legado|DATA-DEC-023]].

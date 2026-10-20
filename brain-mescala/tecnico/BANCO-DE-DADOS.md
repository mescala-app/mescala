---
tipo: tecnico
camada: dados
status: inicial
---
# Banco de Dados
O modelo físico deve derivar do domínio, não o contrário.

Banco oficial: PostgreSQL, podendo usar o Supabase como infraestrutura gerenciada. O schema oficial deve ser reproduzível pelas migrations versionadas; estratégia de migrations: **A DEFINIR** ([[decisoes/ADR-002-BACKEND-OFICIAL]]).

Referências obrigatórias:
- [[dados/ENTIDADES]]
- [[dados/RELACIONAMENTOS]]
- [[04-USUARIOS-E-PERMISSOES]]
- [[seguranca/ISOLAMENTO-DE-DADOS]]

Evitar colunas fixas como `vocalista_id` ou `baterista_id`; posições pertencem à entidade [[dados/ENTIDADES#Alocação|Alocação]].

## Estado atual
- O banco em uso é o legado do Supabase: 11 tabelas em `public` e 9 migrations em `supabase/migrations/`, todas versionadas desde o commit `0394893`; as 3 de julho estavam fora do git até ele ([[tecnico/LEGADO-ATUAL]]).
- Divergências com a Brain: [[tecnico/DIVERGENCIAS-LEGADO]]. Riscos de RLS: [[seguranca/RISCOS-DO-LEGADO]].
- O modelo oficial ainda não existe. O relatório do Analista de Dados (`docs/data/DATA-ARCHITECTURE-REPORT.md`) propõe um modelo alvo, mas está **aguardando decisões do PO**; nenhuma migration foi criada.

## Pendências
- Estratégia de migrations e forma de acesso ao banco: [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04]].
- Nomenclatura e idioma: [[decisoes/PENDENCIAS#DATA-DEC-018 — Nomenclatura e idioma|DATA-DEC-018]].
- Schema e modelo de RLS: [[decisoes/PENDENCIAS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]].
- Convivência com o legado e migração de dados: [[decisoes/PENDENCIAS#DATA-DEC-022 — Convivência com o legado e migração de dados|DATA-DEC-022]].
- Projeto Supabase oficial, onde a consulta de inventário precisa rodar: [[decisoes/PENDENCIAS#DEC-05 — Projeto Supabase oficial|DEC-05]] (proposta da AUTH-001, não decidida).
- Demais decisões de modelagem: [[decisoes/PENDENCIAS]].

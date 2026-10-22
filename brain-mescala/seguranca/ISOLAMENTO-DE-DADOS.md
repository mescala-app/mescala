---
tipo: seguranca
status: ativo
atualizado: 2026-10-22
relacionado:
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
---
# Isolamento de Dados
O Mescala é multi-tenant por [[modulos/IGREJAS|Igreja]].

Toda leitura e escrita deve respeitar o tenant correspondente. Nenhum usuário pode acessar dados de outra igreja sem vínculo e autorização válidos.

Regra: [[05-REGRAS-DE-NEGOCIO#SEC-001 — Isolamento por igreja]].

## Decisões
- **Usuário em várias igrejas:** permitido, com um vínculo por igreja. O backend precisa de "igreja atual" no contexto de cada requisição ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-006 — Usuário em mais de uma igreja|DATA-DEC-006]]).
- **Igreja nunca vem do token:** o contexto de igreja vem do vínculo no banco do Mescala ([[decisoes/ADR-003-AUTENTICACAO|ADR-003]], item 7). A autenticação, decidida pelo ADR-003, já não bloqueia o contexto de igreja.
- **Schema e RLS:** schema dedicado, fora da Data API do Supabase; o backend conecta direto ao Postgres com um papel sem BYPASSRLS e define o contexto (usuário, igreja) em cada transação; as policies usam esse contexto ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]]).
- **Banco oficial separado do legado:** o schema oficial fica no projeto Supabase novo `vitqnyzuvrvkmnvshcpb`, que começa vazio ([[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]; [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-022 — Convivência com o legado e migração de dados|DATA-DEC-022]]).

## Pendências
- Ferramenta de acesso ao banco: [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]].
- Nome do schema dedicado: **A DEFINIR** (`mescala` é exemplo do relatório).
- As policies de RLS e as constraints de isolamento (a proposta do relatório usa `church_id` em toda tabela do tenant e FKs compostas) virão do contrato FOUNDATION-002, ainda não emitido.

## Legado
O SEC-001 está violado no sistema legado, segundo leitura estática do relatório de dados: S1, S4, S5, S6 e S10 em [[seguranca/RISCOS-DO-LEGADO]]. O banco legado não tem FK composta por igreja ([[tecnico/DIVERGENCIAS-LEGADO]]). A correção do legado não se aplica (app sem uso real, 2026-10-22); os riscos continuam nos projetos antigos enquanto estiverem ativos.

---
tipo: seguranca
status: ativo
atualizado: 2026-10-22
relacionado:
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
  - "[[features/FOUNDATION-002]]"
  - "[[tecnico/BANCO-DE-DADOS]]"
---
# Isolamento de Dados
O Mescala é multi-tenant por [[modulos/IGREJAS|Igreja]].

Toda leitura e escrita deve respeitar o tenant correspondente. Nenhum usuário pode acessar dados de outra igreja sem vínculo e autorização válidos.

Regra: [[05-REGRAS-DE-NEGOCIO#SEC-001 — Isolamento por igreja]].

## Decisões
- **Usuário em várias igrejas:** permitido, com um vínculo por igreja. O backend precisa de "igreja atual" no contexto de cada requisição ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-006 — Usuário em mais de uma igreja|DATA-DEC-006]]).
- **Igreja nunca vem do token:** o contexto de igreja vem do vínculo no banco do Mescala ([[decisoes/ADR-003-AUTENTICACAO|ADR-003]], item 7). A autenticação, decidida pelo ADR-003, já não bloqueia o contexto de igreja.
- **Schema e RLS:** schema dedicado, fora da Data API do Supabase; o backend conecta direto ao Postgres com um papel sem BYPASSRLS e define o contexto (usuário, igreja) em cada transação; as policies usam esse contexto ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]]). Nome do schema: **`mescala`** (resposta do PO ao B-01 da FOUNDATION-002, 2026-10-22).
- **Banco oficial separado do legado:** o schema oficial fica no projeto Supabase novo `vitqnyzuvrvkmnvshcpb`, que começa vazio ([[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]; [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-022 — Convivência com o legado e migração de dados|DATA-DEC-022]]).

## Mecanismo decidido na FOUNDATION-002
Contrato [[features/FOUNDATION-002]], VERSÃO 2, READY em 2026-10-22. **Escrito nas migrations e ainda não aplicado.** Detalhe técnico: [[tecnico/BANCO-DE-DADOS#Mecanismo do schema oficial (FOUNDATION-002)|tecnico/BANCO-DE-DADOS]].
- **Schema `mescala` fora da Data API.** `PUBLIC`, `anon`, `authenticated`, `service_role` e `authenticator` não têm acesso nenhum: sem USAGE, sem privilégio, sem policy.
- **Papel `mescala_app`:** NOLOGIN, sem BYPASSRLS, sem CREATE, dono de nada; único papel com acesso ao schema. O papel de login vem na FOUNDATION-003, criado pelo PO fora do repositório.
- **Contexto:** `mescala.current_user_id` (= `users.id`) e `mescala.current_church_id`, definidos pelo backend só com `set_config(..., true)`, por transação. Sem contexto, as funções de contexto devolvem NULL e nada é lido nem gravado (falha fechada).
- **Duas camadas de isolamento:**
  - estrutural: `church_id NOT NULL` em toda tabela de tenant e FKs compostas que levam `church_id` até a raiz (um vínculo com ministério exige vínculo com a mesma igreja; a habilitação liga vínculo e função do mesmo ministério);
  - de acesso: policies com `church_id` = contexto de igreja.
- **O RLS faz só isolamento por igreja** (ARQ-F002-03). Papel + escopo ficam no backend ([[seguranca/AUTORIZACAO]]); nenhuma policy usa cargo, claim de token ou metadata.
- **Unicidade com `church_id`** (ARQ-F002-14): em tabela de tenant, toda unicidade que um INSERT do backend pode atingir inclui `church_id`. Um INSERT no contexto da igreja A com ministério, vínculo ou função da igreja B responde 23503, nunca 23505: nenhum erro de unicidade revela vínculo, nome ou habilitação de outra igreja. Exceção: a PK `id` e os UNIQUE(x, id) alvo de FK; o backend nunca grava `id` vindo do cliente como chave de linha nova.
- **F002-QA-01** (achado do QA na fase 1: o 23505 revelaria dados de outra igreja): **resolvido pela estrutura** (ARQ-F002-14). Não gera requisito de mapeamento de erros para as features.
- **R-01:** o RLS não pega contexto de igreja errado. Se o backend definir o contexto de uma igreja em que o usuário não tem vínculo, as policies liberam essa igreja. Por isso, **a CHURCH-002 valida o vínculo ATIVO antes de definir o contexto**; um endurecimento (policy que também exige vínculo) será avaliado nela.

## Pendências
- Ferramenta de acesso ao banco: [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]] (FOUNDATION-003, proposta).
- Nome do schema dedicado: **decidido em 2026-10-22**: `mescala` (B-01). Até então, **A DEFINIR** (`mescala` era exemplo do relatório).
- Policies de RLS e constraints de isolamento: especificadas no contrato FOUNDATION-002 (matrizes D7 e D8), escritas nas migrations e **ainda não aplicadas**. Até 2026-10-22, "contrato ainda não emitido".
- Leituras entre igrejas que serão necessárias ("minhas igrejas", os próprios vínculos, a resolução do usuário): não existem ainda; vêm da CHURCH-002 e da AUTH-002/003, por policies explícitas.
- Como a igreja atual chega à API: **A DEFINIR**, na CHURCH-002 ([[tecnico/API]]).

## Legado
O SEC-001 está violado no sistema legado, segundo leitura estática do relatório de dados: S1, S4, S5, S6 e S10 em [[seguranca/RISCOS-DO-LEGADO]]. O banco legado não tem FK composta por igreja ([[tecnico/DIVERGENCIAS-LEGADO]]). A correção do legado não se aplica (app sem uso real, 2026-10-22); os riscos continuam nos projetos antigos enquanto estiverem ativos.

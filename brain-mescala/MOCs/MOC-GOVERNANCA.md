---
tipo: moc
area: governanca
atualizado: 2026-10-24
---
# MOC — Governança

Decisões, pendências, entrega de features, agentes e estado atual do sistema.

## Decisões aceitas
- [[decisoes/ADR-001-ESTRUTURA-INICIAL]]
- [[decisoes/ADR-002-BACKEND-OFICIAL]]
- [[decisoes/ADR-003-AUTENTICACAO]] (2026-10-21; resolve a DEC-03)
- [[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]
- [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES]] (2026-10-22; Vitest)
- [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]] (parte 1 em 2026-10-21; no projeto oficial, só pelo SQL Editor desde 2026-10-23, ARQ-F002-17; parte 2 aberta)
- [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]] (2026-10-21; projeto `vitqnyzuvrvkmnvshcpb`)
- [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]] (ARQ-FOUND-02, da revisão da FOUNDATION-001)
- [[decisoes/DEC-09-MODELO-DE-DADOS]] (DATA-DEC-001 a 023 em 2026-10-21; micro-decisões em 2026-10-22)

## Decisões pendentes
- [[decisoes/PENDENCIAS]]: índice. Itens decididos ficam com o título original e apontam para a nota da decisão.
- Abertas: [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]] (acesso ao banco), [[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]] (provisionamento do usuário) e [[decisoes/PENDENCIAS#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]] (padrão HTTP de erros e convenções de API), estas duas propostas pela AUTH-001.
- [[decisoes/PENDENCIAS#Condições operacionais do ADR-003|Condições operacionais do ADR-003]], com o PO.
- [[decisoes/PENDENCIAS#Pontos em aberto criados pelas decisões de 2026-10-22|Pontos criados pelas decisões de 2026-10-22]] e [[decisoes/PENDENCIAS#Lacunas observadas no registro de 2026-10-21|lacunas observadas no registro]] (decididas em 2026-10-22 pelas respostas aos bloqueios B-01 a B-04 da FOUNDATION-002, exceto o fluxo do convite e o efeito de uma igreja INATIVO).
- Aceitos com condições e ainda abertos: [[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]] (dívida de tooling), [[decisoes/PENDENCIAS#L-07 — Guarda 2b não normaliza o especificador|L-07]] (guarda 2b não normaliza o especificador), [[decisoes/PENDENCIAS#RT-AUTH-01 — Cache de segmento do Next sobre a busca do JWKS|RT-AUTH-01]] (cache de segmento sobre o JWKS) e [[decisoes/PENDENCIAS#RT-AUTH-02 — Composição padrão no domínio|RT-AUTH-02]] (composição no domínio). Encerrado em 2026-10-22: [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|L-06]].
- Resolvida no repositório: [[decisoes/PENDENCIAS#Cache do Supabase CLI no git|cache do Supabase CLI no git]] (commit `a034046`).

## Entrega de features
- [[features/FLUXO-DE-ENTREGA]]
- [[features/FOUNDATION-001]]: implementada e encerrada (ARCHITECT REVIEW APPROVED em 2026-10-19, commit `7f26d30`).
- [[features/AUTH-001]]: implementada e encerrada (ARCHITECT REVIEW APPROVED_WITH_NOTES em 2026-10-22, commit `50eaa1f`).
- [[features/FOUNDATION-002]] — Fundação de Persistência: aplicada em 2026-10-23; encerrada (ARCHITECT REVIEW APPROVED_WITH_NOTES em 2026-10-23, commits `028f9ff` e `8ee70a6`).

## Agentes
- [[agents/arquiteto]]
- [[agents/analista-de-dados]]
- [[agents/desenvolvedor-backend]]
- [[agents/organizador]]
- [[agents/qa]]
- [[agents/vault-brain]]

## Estado atual (backend oficial)
- [[tecnico/BACKEND]]: `/backend` só com a rota técnica `GET /api/health` ([[features/FOUNDATION-001]]) e, desde a [[features/AUTH-001]], a verificação do access token em `domains/auth`, ainda sem rota protegida.
- [[tecnico/API]]: contratos de negócio continuam **A DEFINIR**; autenticação das rotas decidida pelo ADR-003.
- [[tecnico/BANCO-DE-DADOS]]: banco oficial no projeto `vitqnyzuvrvkmnvshcpb`; schema `mescala` com as 9 migrations da FOUNDATION-002 aplicadas em 2026-10-23 (8 tabelas, vazias); [[tecnico/BANCO-DE-DADOS#Registro de migrations aplicadas|registro de migrations aplicadas]].

## Estado atual (legado)
- [[tecnico/LEGADO-ATUAL]] (sem uso real, segundo o PO em 2026-10-22)
- [[tecnico/DIVERGENCIAS-LEGADO]]
- [[seguranca/RISCOS-DO-LEGADO]]
- [[produto/CONCEITOS-DO-CANVAS]] e [[Fluxograma.canvas]]

## Fontes fora do vault
- `docs/features/<ID>.md`: Feature Contracts e QA Contracts. Hoje: `FOUNDATION-001.md`, `AUTH-001.md` (versionado desde o commit `50a1cd6`; v2 no `4039fe0`) e `FOUNDATION-002.md` (versionado desde o commit `4039fe0`, com a VERSÃO 1; VERSÃO 2 no `028f9ff`; fechamento no `8ee70a6`). Também `FOUNDATION-002-DATA-TASK-RESULT.md` (relatório do Analista; commit `028f9ff`) e as evidências da aplicação `FOUNDATION-002-SAIDAS-PO.md`, `FOUNDATION-002-V1-CONSULTA-UNICA.sql` e `FOUNDATION-002-V1-RESULTADO.csv` (commit `8ee70a6`).
- ARCHITECT REVIEW da FOUNDATION-001, da AUTH-001 e da FOUNDATION-002: não foram gravadas no repositório; o registro permanente está em [[features/FOUNDATION-001]], [[features/AUTH-001]] e [[features/FOUNDATION-002#Revisões do Arquiteto|features/FOUNDATION-002]].
- `backend/`: código do backend oficial (commits `7f26d30` e `50eaa1f`). `backend/supabase/`: configuração da CLI e migrations da FOUNDATION-002 (commit `028f9ff`; aplicadas em 2026-10-23).
- `docs/data/DATA-ARCHITECTURE-REPORT.md`: relatório do Analista de Dados; decisões aceitas pelo PO em 2026-10-21 ([[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]]).
- `.claude/agents/*.md`: definições executáveis dos agentes.

## Manutenção
- [[tecnico/CONVENCOES]]
- [[CHANGELOG]]

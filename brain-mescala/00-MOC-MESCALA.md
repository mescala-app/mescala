---
tipo: moc
projeto: Mescala
status: ativo
atualizado: 2026-10-22
---
# Mescala — Mapa Central

Este é o ponto de entrada do cérebro do sistema.

## Núcleo
- [[01-VISAO-GERAL]]
- [[02-ARQUITETURA]]
- [[03-DOMINIO]]
- [[04-USUARIOS-E-PERMISSOES]]
- [[05-REGRAS-DE-NEGOCIO]]

## Mapas de conteúdo
- [[MOCs/MOC-DOMINIO]]
- [[MOCs/MOC-ESCALAS]]
- [[MOCs/MOC-USUARIOS]]
- [[MOCs/MOC-DADOS]]
- [[MOCs/MOC-SEGURANCA]]
- [[MOCs/MOC-ARQUITETURA]]
- [[MOCs/MOC-GOVERNANCA]]

## Fluxos principais
- [[fluxos/FLUXO-CADASTRO-IGREJA]]
- [[fluxos/FLUXO-EQUIPES|FLUXO-EQUIPES (Ministérios)]]
- [[fluxos/FLUXO-MEMBROS]]
- [[fluxos/FLUXO-PROGRAMACOES]]
- [[fluxos/FLUXO-ESCALAS]]
- [[fluxos/FLUXO-CONFIRMACAO]]
- [[fluxos/FLUXO-SUBSTITUICAO]]

## Produto
- [[produto/PERSONAS]]
- [[produto/JORNADAS]]
- [[produto/UX-PRINCIPIOS]]
- [[produto/ROADMAP]]
- [[produto/CONCEITOS-DO-CANVAS]] (conceitos do [[Fluxograma.canvas]]: parte decidida em 2026-10-21; Cronograma, Reunião, Comissão e Pauta continuam A DEFINIR)

## Estado atual do sistema
- [[tecnico/BACKEND]]: backend oficial em `/backend` (Next.js + TypeScript + Node.js), criado pela [[features/FOUNDATION-001]]. Só tem a rota técnica `GET /api/health`. Desde a [[features/AUTH-001]] (2026-10-22), tem a verificação do access token em `domains/auth`, ainda sem rota protegida, e testes automatizados (Vitest). Ainda não tem regra de negócio nem banco.
- Banco oficial: projeto Supabase novo `vitqnyzuvrvkmnvshcpb`, que começa vazio ([[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]; [[tecnico/BANCO-DE-DADOS]]). Schema oficial `mescala`. As 9 migrations da [[features/FOUNDATION-002]] estão escritas em `backend/supabase/migrations/` e **não foram aplicadas**.
- [[tecnico/LEGADO-ATUAL]]: o app legado (frontend Vite + React gravando direto no Supabase, nos projetos antigos), não normativo e **sem uso real** (PO, 2026-10-22).
- [[tecnico/DIVERGENCIAS-LEGADO]]: Brain × legado (D1–D5 e banco); D4 resolvida quanto ao backend oficial.
- [[seguranca/RISCOS-DO-LEGADO]]: achados S1–S11, por leitura estática. A correção não se aplica; os riscos continuam nos projetos antigos enquanto estiverem ativos.

## Decisões de 2026-10-21 e 2026-10-22
- [[decisoes/ADR-003-AUTENTICACAO]]: autenticação pelo Supabase Auth do projeto oficial; backend como resource server sem estado (resolve a DEC-03).
- [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]: projeto oficial novo, `vitqnyzuvrvkmnvshcpb`.
- [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]]: migrations oficiais em `backend/supabase/migrations/` (parte 1); forma de acesso ao banco aberta (parte 2).
- [[decisoes/DEC-09-MODELO-DE-DADOS]]: DATA-DEC-001 a 023 aceitas; micro-decisões de 2026-10-22 (status, Escala sem CANCELADA, impedimento só pelo membro, legado sem uso real).
- [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES]]: Vitest.
- [[decisoes/DEC-09-MODELO-DE-DADOS#Respostas do PO aos bloqueios da FOUNDATION-002|Respostas do PO aos bloqueios da FOUNDATION-002]] (2026-10-22): schema `mescala`; status da Igreja ATIVO, INATIVO; alocação "ativa" = AGUARDANDO_CONFIRMACAO e CONFIRMADA; `invitations` nasce com a feature de convites. Fase 4 autorizada para a FOUNDATION-002.
- Vocabulário: o termo canônico é **Ministério** ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]]); arquivos antigos mantêm o nome `EQUIPES`, com `aliases`.

## Pendências
- [[decisoes/PENDENCIAS]]: continuam abertas a DEC-04 parte 2 (acesso ao banco), a DEC-06 (provisionamento do usuário), a DEC-07 (padrão HTTP de erros), as condições operacionais do ADR-003 e os pontos A DEFINIR listados lá.
- Aceitos com condições e ainda abertos: a dívida [[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]] (FOUNDATION-001), o limite [[decisoes/PENDENCIAS#L-07 — Guarda 2b não normaliza o especificador|L-07]] e os riscos [[decisoes/PENDENCIAS#RT-AUTH-01 — Cache de segmento do Next sobre a busca do JWKS|RT-AUTH-01]] e [[decisoes/PENDENCIAS#RT-AUTH-02 — Composição padrão no domínio|RT-AUTH-02]] (AUTH-001). O [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|L-06]] foi encerrado em 2026-10-22.
- Continuam **A DEFINIR**, mesmo depois das respostas de 2026-10-22: o fluxo, as transições e o papel pretendido do convite, e o efeito de uma igreja INATIVO.

## Features
- [[features/FLUXO-DE-ENTREGA]]
- [[features/FOUNDATION-001]]: implementada e encerrada (ARCHITECT REVIEW APPROVED em 2026-10-19, commit `7f26d30`).
- [[features/AUTH-001]]: implementada e encerrada (ARCHITECT REVIEW APPROVED_WITH_NOTES em 2026-10-22, commit `50eaa1f`).
- [[features/FOUNDATION-002]] — Fundação de Persistência: contrato VERSÃO 2 READY e Fase 4 autorizada (2026-10-22); 9 migrations escritas e **não aplicadas**; revisões e aplicação pelo PO pendentes.

## Governança
- [[decisoes/ADR-001-ESTRUTURA-INICIAL]]
- [[decisoes/ADR-002-BACKEND-OFICIAL]]
- [[decisoes/ADR-003-AUTENTICACAO]]
- [[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]
- [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES]]
- [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]]
- [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]
- [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]]
- [[decisoes/DEC-09-MODELO-DE-DADOS]]
- [[decisoes/PENDENCIAS]]
- [[CHANGELOG]]
- [[agents/vault-brain]]
- [[agents/arquiteto]]
- [[agents/analista-de-dados]]
- [[agents/desenvolvedor-backend]]
- [[agents/organizador]]
- [[agents/qa]]

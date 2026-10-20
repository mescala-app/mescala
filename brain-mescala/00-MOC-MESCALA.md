---
tipo: moc
projeto: Mescala
status: ativo
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
- [[fluxos/FLUXO-EQUIPES]]
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
- [[produto/CONCEITOS-DO-CANVAS]] (conceitos do [[Fluxograma.canvas]] sem definição: A DEFINIR)

## Estado atual do sistema
- [[tecnico/BACKEND]]: backend oficial em `/backend` (Next.js + TypeScript + Node.js), criado pela [[features/FOUNDATION-001]]. Só tem a rota técnica `GET /api/health`; ainda não tem regra de negócio, banco nem autenticação.
- [[tecnico/LEGADO-ATUAL]]: o app em uso hoje (frontend Vite + React gravando direto no Supabase), não normativo.
- [[tecnico/DIVERGENCIAS-LEGADO]]: Brain × legado (D1–D5 e banco).
- [[seguranca/RISCOS-DO-LEGADO]]: achados S1–S11, por leitura estática.

## Pendências
- [[decisoes/PENDENCIAS]]: DEC-02, DEC-03, DEC-04, DATA-DEC-001 a 023 e as propostas DEC-05 a DEC-07 da AUTH-001 (números reservados). Nada decidido.
- Aceitos com condições e ainda abertos: a dívida [[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]] e o limite [[decisoes/PENDENCIAS#L-06 — Arquivos .jsx fora das guardas de lint|L-06]], ambos da FOUNDATION-001.
- Vocabulário Equipe × Ministério em aberto ([[decisoes/PENDENCIAS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]]); as notas seguem dizendo "Equipe".

## Features
- [[features/FLUXO-DE-ENTREGA]]
- [[features/FOUNDATION-001]]: implementada e encerrada (ARCHITECT REVIEW APPROVED em 2026-10-19, commit `7f26d30`).
- AUTH-001: contrato emitido em 2026-10-06, aguardando aprovação do PO ([[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|registro em PENDENCIAS]]).

## Governança
- [[decisoes/ADR-001-ESTRUTURA-INICIAL]]
- [[decisoes/ADR-002-BACKEND-OFICIAL]]
- [[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]
- [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]]
- [[decisoes/PENDENCIAS]]
- [[CHANGELOG]]
- [[agents/vault-brain]]
- [[agents/arquiteto]]
- [[agents/analista-de-dados]]
- [[agents/desenvolvedor-backend]]
- [[agents/organizador]]
- [[agents/qa]]

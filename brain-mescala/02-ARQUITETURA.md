---
tipo: arquitetura
status: ativo
relacionado:
  - "[[tecnico/FRONTEND]]"
  - "[[tecnico/BACKEND]]"
  - "[[tecnico/BANCO-DE-DADOS]]"
---
# Arquitetura

A arquitetura deve separar interface, regras de negócio, persistência e segurança.

## Camadas
1. [[tecnico/FRONTEND|Frontend]] — experiência do usuário.
2. [[tecnico/BACKEND|Backend]] — domínio, regras e autorização.
3. [[tecnico/API|API]] — contrato entre cliente e servidor.
4. [[tecnico/BANCO-DE-DADOS|Banco de dados]] — persistência e integridade.

## Princípio obrigatório
Nenhuma regra crítica pode existir apenas no frontend. Validações de conflito, permissão, disponibilidade, publicação, confirmação e substituição pertencem ao domínio/backend.

Veja [[05-REGRAS-DE-NEGOCIO]] e [[seguranca/AUTORIZACAO]].

## Decisões
- [[decisoes/ADR-001-ESTRUTURA-INICIAL]]
- [[decisoes/ADR-002-BACKEND-OFICIAL]]

## Estado atual
- O backend oficial existe em `/backend` desde a [[features/FOUNDATION-001]] (implementada e encerrada em 2026-10-19, commit `7f26d30`): Next.js, TypeScript e runtime Node.js, só com a rota técnica `GET /api/health` ([[decisoes/DEC-01-ROTA-TECNICA-HEALTH|DEC-01]]). Ainda não tem regra de negócio, banco nem autenticação ([[tecnico/BACKEND]]).
- O app em uso é legado: frontend Vite + React gravando direto no Supabase, protegido só por RLS ([[tecnico/LEGADO-ATUAL]]). Ele não passa pelo backend oficial, o que contraria o princípio acima (divergência D1 em [[tecnico/DIVERGENCIAS-LEGADO]]).

## Pendências
- [[decisoes/PENDENCIAS#DEC-02 — Biblioteca oficial de testes e quem escreve os testes|DEC-02]]: biblioteca de testes.
- [[decisoes/PENDENCIAS#DEC-03 — Autenticação|DEC-03]]: autenticação. Há um contrato aguardando aprovação do PO que propõe resolvê-la: [[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|AUTH-001]] (com as propostas DEC-05 a DEC-07).
- [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04]]: migrations e acesso ao banco.
- Plano de migração do frontend legado para `/backend`: necessita decisão.

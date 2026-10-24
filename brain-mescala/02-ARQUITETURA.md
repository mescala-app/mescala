---
tipo: arquitetura
status: ativo
atualizado: 2026-10-24
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
- [[decisoes/ADR-003-AUTENTICACAO]]: Supabase Auth do projeto oficial; backend como resource server sem estado (2026-10-21).
- [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES]]: Vitest (2026-10-22).
- [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]]: migrations oficiais em `backend/supabase/migrations/` (parte 1, 2026-10-21); forma de acesso ao banco aberta (parte 2).
- [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]: projeto Supabase oficial novo, `vitqnyzuvrvkmnvshcpb` (2026-10-21).
- [[decisoes/DEC-09-MODELO-DE-DADOS]]: modelo de dados (DATA-DEC-001 a 023, 2026-10-21; micro-decisões em 2026-10-22).

## Estado atual
- O backend oficial existe em `/backend` desde a [[features/FOUNDATION-001]] (implementada e encerrada em 2026-10-19, commit `7f26d30`): Next.js, TypeScript e runtime Node.js, só com a rota técnica `GET /api/health` ([[decisoes/DEC-01-ROTA-TECNICA-HEALTH|DEC-01]]). Ainda não tem regra de negócio nem banco ([[tecnico/BACKEND]]).
- A [[features/AUTH-001]] foi implementada e encerrada em 2026-10-22 (commit `50eaa1f`): verificação do access token em `domains/auth` ([[decisoes/ADR-003-AUTENTICACAO|ADR-003]]), ainda sem rota protegida.
- [[features/FOUNDATION-002]] — Fundação de Persistência: aplicada em 2026-10-23; encerrada (APPROVED_WITH_NOTES). O schema oficial `mescala` existe no projeto oficial, e a aplicação de migrations lá é só pelo SQL Editor ([[tecnico/BANCO-DE-DADOS#Aplicação no projeto oficial (ARQ-F002-17)|ARQ-F002-17]]). Ver [[features/FLUXO-DE-ENTREGA]].
- O app legado é um frontend Vite + React gravando direto no Supabase, protegido só por RLS, nos projetos antigos ([[tecnico/LEGADO-ATUAL]]). Ele não passa pelo backend oficial, o que contraria o princípio acima (divergência D1 em [[tecnico/DIVERGENCIAS-LEGADO]]). Em 2026-10-22, o PO registrou que ele não tem uso real.

## Pendências
- [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]]: forma de acesso do backend ao banco.
- [[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]] e [[decisoes/PENDENCIAS#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]], propostas pela AUTH-001.
- [[decisoes/PENDENCIAS#Condições operacionais do ADR-003|Condições operacionais do ADR-003]], com o PO.
- Plano para o frontend legado: necessita decisão.

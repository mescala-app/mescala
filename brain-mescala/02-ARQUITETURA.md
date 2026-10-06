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
- O backend oficial ainda não existe. Ele nasce na [[features/FOUNDATION-001]] (READY, não implementada).
- O app em uso é legado: frontend Vite + React gravando direto no Supabase, protegido só por RLS ([[tecnico/LEGADO-ATUAL]]). Isso contraria o princípio acima (divergência D1 em [[tecnico/DIVERGENCIAS-LEGADO]]).

## Pendências
- [[decisoes/PENDENCIAS#DEC-02 — Biblioteca oficial de testes e quem escreve os testes|DEC-02]]: biblioteca de testes.
- [[decisoes/PENDENCIAS#DEC-03 — Autenticação|DEC-03]]: autenticação.
- [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04]]: migrations e acesso ao banco.
- Plano de migração do frontend legado para `/backend`: necessita decisão.

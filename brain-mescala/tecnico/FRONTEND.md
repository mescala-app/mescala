---
tipo: tecnico
camada: frontend
---
# Frontend
Diretriz atual: React para interface.

Responsabilidades:
- renderização;
- interação;
- feedback ao usuário;
- validações de experiência.

Não é fonte final de regras críticas. Veja [[02-ARQUITETURA]] e [[tecnico/BACKEND]].

## Estado atual
- Fase atual: **BACKEND ONLY** ([[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]]). Nenhum frontend novo é criado nesta fase.
- Existe um frontend legado em `src/` (Vite + React) que grava direto nas tabelas do Supabase, protegido só por RLS ([[tecnico/LEGADO-ATUAL]]). Isso diverge desta nota e do [[02-ARQUITETURA]] (D1 em [[tecnico/DIVERGENCIAS-LEGADO]]).
- O plano de migração desse frontend para consumir o `/backend` necessita decisão ([[decisoes/PENDENCIAS]]). Em 2026-10-22 o PO registrou que o app legado não tem uso real; o destino do frontend legado não foi decidido.
- Clientes futuros entram direto no Supabase Auth do projeto oficial e mandam `Authorization: Bearer <access_token>` ao backend ([[decisoes/ADR-003-AUTENTICACAO|ADR-003]]). Cookie ou BFF para cliente web ficam fora do ADR-003.

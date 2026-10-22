---
tipo: fluxo
status: ativo
atualizado: 2026-10-21
---
# Fluxo — Cadastro de Igreja
1. Usuário cria ou acessa sua conta.
2. Cria uma [[modulos/IGREJAS|Igreja]].
3. Torna-se OWNER no relacionamento com a igreja.
4. Pode iniciar [[fluxos/FLUXO-EQUIPES|cadastro de ministérios]].

Segurança: [[seguranca/AUTENTICACAO]] e [[seguranca/AUTORIZACAO]].

## Decisões
- **Passo 1:** a conta é criada e acessada no Supabase Auth do projeto oficial; o backend só valida o access token ([[decisoes/ADR-003-AUTENTICACAO|ADR-003]], [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]).
- **Passo 3:** a igreja tem exatamente um OWNER, e ele é quem a criou ([[05-REGRAS-DE-NEGOCIO#IGR-001 — Um único OWNER por igreja|IGR-001]]).
- O mesmo usuário pode estar vinculado a outras igrejas ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-006 — Usuário em mais de uma igreja|DATA-DEC-006]]).

## Pendências
- Como nasce o registro do usuário do Mescala depois do passo 1: [[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]].

Legado: o criador vira `organizador` (gravado em `igrejas.organizador_id` e `user_roles`), não OWNER ([[tecnico/DIVERGENCIAS-LEGADO]]).

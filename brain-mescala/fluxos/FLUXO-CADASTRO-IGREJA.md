---
tipo: fluxo
status: ativo
---
# Fluxo — Cadastro de Igreja
1. Usuário cria ou acessa sua conta.
2. Cria uma [[modulos/IGREJAS|Igreja]].
3. Torna-se OWNER no relacionamento com a igreja.
4. Pode iniciar [[fluxos/FLUXO-EQUIPES|cadastro de equipes]].

Segurança: [[seguranca/AUTENTICACAO]] e [[seguranca/AUTORIZACAO]].

Pendências: quantidade de OWNER ([[decisoes/PENDENCIAS#DATA-DEC-007 — Quantidade de OWNER por igreja|DATA-DEC-007]]); usuário em mais de uma igreja ([[decisoes/PENDENCIAS#DATA-DEC-006 — Usuário em mais de uma igreja|DATA-DEC-006]]); autenticação ([[decisoes/PENDENCIAS#DEC-03 — Autenticação|DEC-03]]).

Legado: o criador vira `organizador` (gravado em `igrejas.organizador_id` e `user_roles`), não OWNER ([[tecnico/DIVERGENCIAS-LEGADO]]).

---
tipo: politica-acesso
status: ativo
---
# Usuários e Permissões

A recomendação é usar uma entidade única de usuário com papéis definidos por relacionamento.

## Papéis da igreja
- OWNER
- ADMIN
- LEADER
- MEMBER

## Papéis da equipe
Podem existir papéis específicos por equipe, como LEADER e MEMBER.

## Princípio
A autorização deve considerar **papel + escopo**. Um líder de uma equipe não recebe automaticamente acesso administrativo a outras equipes.

## Relacionamentos
- [[dados/ENTIDADES#Usuário|Usuário]]
- [[modulos/IGREJAS]]
- [[modulos/EQUIPES]]
- [[seguranca/AUTORIZACAO]]
- [[MOCs/MOC-USUARIOS]]

## Pendências
Nada abaixo está decidido ([[decisoes/PENDENCIAS]]):
- Papéis em cada camada (igreja e equipe), se OWNER inclui ADMIN e o que significa "ANCIÃO": [[decisoes/PENDENCIAS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]].
- Usuário em mais de uma igreja: [[decisoes/PENDENCIAS#DATA-DEC-006 — Usuário em mais de uma igreja|DATA-DEC-006]].
- Quantidade de OWNER por igreja: [[decisoes/PENDENCIAS#DATA-DEC-007 — Quantidade de OWNER por igreja|DATA-DEC-007]].
- Quantidade de LEADER por equipe: [[decisoes/PENDENCIAS#DATA-DEC-008 — Quantidade de LEADER por ministério|DATA-DEC-008]].
- Papel único por usuário em cada equipe: [[decisoes/PENDENCIAS#DATA-DEC-009 — Papel único por usuário em cada ministério|DATA-DEC-009]].
- Membro sem conta: [[decisoes/PENDENCIAS#DATA-DEC-010 — Membro sem conta|DATA-DEC-010]].
- Convites: [[decisoes/PENDENCIAS#DATA-DEC-011 — Convites|DATA-DEC-011]].
- Regras de autorização em aberto (ADMIN gerencia todas as equipes? o que o LEADER faz fora da escala? quem cria programações?): **A DEFINIR**.
- O [[Fluxograma.canvas]] cita "ADMIN (ANCIÃO)" e "Líder de Ministério" sem definição ([[produto/CONCEITOS-DO-CANVAS]]).
- O legado usa outros papéis (organizador, lider, membro): divergência D2 em [[tecnico/DIVERGENCIAS-LEGADO]].

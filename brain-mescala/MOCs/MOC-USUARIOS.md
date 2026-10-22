---
tipo: moc
area: usuarios
atualizado: 2026-10-22
---
# MOC — Usuários
- [[04-USUARIOS-E-PERMISSOES]]
- [[modulos/MEMBROS]]
- [[modulos/EQUIPES|EQUIPES (Ministérios)]]
- [[seguranca/AUTENTICACAO]]
- [[seguranca/AUTORIZACAO]]
- [[produto/PERSONAS]]
- [[produto/JORNADAS]]

## Decisões
- [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]] a [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-011 — Convites|DATA-DEC-011]]: papéis, vínculos, membro sem conta e convites (2026-10-21; status do convite em 2026-10-22).
- Regras: [[05-REGRAS-DE-NEGOCIO#IGR-001 — Um único OWNER por igreja|IGR-001]], [[05-REGRAS-DE-NEGOCIO#MEM-001 — Membro é usuário com conta|MEM-001]], [[05-REGRAS-DE-NEGOCIO#MEM-002 — Um vínculo por usuário em cada ministério|MEM-002]], [[05-REGRAS-DE-NEGOCIO#MEM-003 — Quem convida quem|MEM-003]], [[05-REGRAS-DE-NEGOCIO#DIS-001 — Impedimento é registrado só pelo próprio membro|DIS-001]].
- [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-019 — Identidade × provedor de autenticação|DATA-DEC-019]] e [[decisoes/ADR-003-AUTENTICACAO|ADR-003]]: usuário do Mescala em tabela própria, ligada ao Supabase Auth do projeto oficial.

## Pendências
- [[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]]: provisionamento do usuário do Mescala (proposta da AUTH-001, não decidida).
- Regras de autorização em aberto e fluxo do convite: [[decisoes/PENDENCIAS]].
- [[produto/CONCEITOS-DO-CANVAS]]: permissões dos perfis do canvas não incorporadas.
- [[tecnico/DIVERGENCIAS-LEGADO]]: papéis legados (organizador, lider, membro).

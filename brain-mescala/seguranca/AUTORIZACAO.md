---
tipo: seguranca
status: ativo
atualizado: 2026-10-22
relacionado:
  - "[[04-USUARIOS-E-PERMISSOES]]"
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
---
# Autorização
Toda operação deve verificar papel e escopo.

Exemplo: ser LEADER em um [[modulos/EQUIPES|Ministério]] não concede acesso automático a outro ministério.

Base: [[04-USUARIOS-E-PERMISSOES]].
Complementos: [[seguranca/ISOLAMENTO-DE-DADOS]] e [[seguranca/AUDITORIA]].

## Decisões
- **Papéis:** igreja com OWNER, ADMIN e MEMBER; ministério com LEADER e MEMBER; OWNER inclui ADMIN; "líder" na igreja é derivado ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]]).
- **Cargo não é permissão:** ANCIÃO é cargo, sem efeito de autorização (DATA-DEC-005).
- **Sem tabela de permissões:** permissões = papel + escopo ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-002 — Mapeamento dos termos do Data Task|DATA-DEC-002]]).
- **Nada vem do token:** papéis, vínculos, igreja e permissões vêm do banco do Mescala, no backend ([[decisoes/ADR-003-AUTENTICACAO|ADR-003]], item 7).
- **Defesa em profundidade no banco:** o schema oficial fica fora da Data API; o backend conecta direto ao Postgres com um papel sem BYPASSRLS e define o contexto (usuário, igreja) em cada transação; as policies de RLS usam esse contexto. O RLS protege mesmo se o backend errar um filtro ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]]).
- **Impedimentos:** só o próprio membro registra o dele; o líder não registra por outro ([[05-REGRAS-DE-NEGOCIO#DIS-001 — Impedimento é registrado só pelo próprio membro|DIS-001]]).
- **Convites:** OWNER/ADMIN convida líder; líder convida membro ([[05-REGRAS-DE-NEGOCIO#MEM-003 — Quem convida quem|MEM-003]]).

## Pendências
- Regras em aberto, a fechar com o Arquiteto: ADMIN gerencia todos os ministérios? O que o LEADER pode fazer fora da escala? Quem cria programações? **A DEFINIR** ([[decisoes/PENDENCIAS#Outras pendências registradas|PENDENCIAS]]).
- Ferramenta de acesso do backend ao banco: [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|DEC-04, parte 2]].
- O que o [[Fluxograma.canvas]] diz sobre permissões dos perfis não foi incorporado como regra ([[produto/CONCEITOS-DO-CANVAS]]).

## Legado
No sistema legado, a autorização é feita só por policies de RLS e tem falhas conhecidas (S1, S2, S5–S9 em [[seguranca/RISCOS-DO-LEGADO]]). A correção do legado ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-023 — Correção urgente de segurança no legado|DATA-DEC-023]]) não se aplica, porque o app legado não tem uso real (2026-10-22); as falhas continuam nos projetos antigos enquanto estiverem ativos.

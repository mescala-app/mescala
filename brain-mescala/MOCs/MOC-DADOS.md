---
tipo: moc
area: dados
atualizado: 2026-10-22
---
# MOC — Dados
- [[dados/ENTIDADES]]
- [[dados/RELACIONAMENTOS]]
- [[dados/STATUS]]
- [[dados/EVENTOS-DO-SISTEMA]]
- [[tecnico/BANCO-DE-DADOS]]
- [[seguranca/AUDITORIA]]

## Decisões
- [[decisoes/DEC-09-MODELO-DE-DADOS]]: DATA-DEC-001 a 023 (aceitas em 2026-10-21) e micro-decisões de 2026-10-22. Relatório de origem: `docs/data/DATA-ARCHITECTURE-REPORT.md`.
- [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]]: migrations oficiais em `backend/supabase/migrations/` (parte 1); forma de acesso ao banco aberta (parte 2).
- [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]: banco oficial no projeto `vitqnyzuvrvkmnvshcpb`, que começa vazio.
- Regras de negócio acrescentadas a partir das decisões: [[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]], [[05-REGRAS-DE-NEGOCIO#ESC-005 — Uma alocação ativa por pessoa na escala|ESC-005]], [[05-REGRAS-DE-NEGOCIO#MEM-001 — Membro é usuário com conta|MEM-001]].

## Estado atual e pendências
- [[tecnico/LEGADO-ATUAL]] (banco legado, sem uso real; sem migração de dados)
- [[tecnico/DIVERGENCIAS-LEGADO]] (Brain × banco atual)
- [[decisoes/PENDENCIAS]]: [[decisoes/PENDENCIAS#Lacunas observadas no registro de 2026-10-21|lacunas observadas]], decididas em 2026-10-22 (status "ativa" da alocação, status da Igreja, nome do schema `mescala`, escopo do convite; [[decisoes/DEC-09-MODELO-DE-DADOS#Respostas do PO aos bloqueios da FOUNDATION-002|DEC-09]]). Continuam **A DEFINIR**: o fluxo, as transições e o papel pretendido do convite, e o efeito de uma igreja INATIVO.
- [[features/FOUNDATION-002]]: contrato VERSÃO 2 READY; 9 migrations escritas e não aplicadas. Mecanismo, ordem vinculante e convenções do schema oficial em [[tecnico/BANCO-DE-DADOS]].

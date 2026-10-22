---
tipo: tecnico
atualizado: 2026-10-22
---
# Convenções
- regras de negócio documentadas antes de mudanças estruturais;
- não inventar estados, permissões ou fluxos;
- registrar decisões relevantes em `/decisoes`;
- manter links entre notas afetadas;
- atualizar [[CHANGELOG]] após alterações significativas no cérebro;
- decisão em aberto fica em [[decisoes/PENDENCIAS]] até ser aceita; decisão aceita ganha nota própria em `/decisoes`. O item decidido continua em PENDENCIAS com o título original e "DECIDIDA em …", para não quebrar links nem apagar o histórico;
- Feature Contracts ficam em `docs/features/<ID>.md` (fora do vault) e são registrados em `features/` ([[features/FLUXO-DE-ENTREGA]]);
- nota que descreve o legado ([[tecnico/LEGADO-ATUAL]]) é descritiva, não normativa.

## Vocabulário e nomes (decididos em 2026-10-21)
- O termo canônico é **Ministério** (no código, `ministry`); "Equipe" é o termo antigo. Arquivos com o nome antigo não são renomeados: ganham `aliases` ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]]).
- Identificadores do schema oficial em inglês; status e papéis com os valores da Brain, em MAIÚSCULAS ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-018 — Nomenclatura e idioma|DATA-DEC-018]]).
- Migrations oficiais em `backend/supabase/migrations/`, no formato `<YYYYMMDDHHMMSS>_<objetivo>.sql` ([[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS|DEC-04]]).
- Regras de negócio novas seguem o padrão `<ÁREA>-<NNN> — título` e citam a decisão de origem ([[05-REGRAS-DE-NEGOCIO]]).

## Convenções técnicas registradas em outras notas
- **Código e testes do `/backend`** (pastas, nomes de arquivo, imports, composição, Vitest, local e nome dos testes; desde a AUTH-001, 2026-10-22): [[tecnico/BACKEND#Convenções do código e dos testes (desde a AUTH-001)|tecnico/BACKEND]].
- **Schema oficial e migrations** (privilégios explícitos, unicidade com `church_id`, ordem dos timestamps, migration aplicada não é editada; FOUNDATION-002, 2026-10-22): [[tecnico/BANCO-DE-DADOS#Convenções do schema oficial (FOUNDATION-002, 2026-10-22)|tecnico/BANCO-DE-DADOS]]. São convenções técnicas, não regras de negócio `<ÁREA>-<NNN>`.

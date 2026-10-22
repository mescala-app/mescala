---
tipo: modelo-dados
status: ativo
atualizado: 2026-10-21
relacionado:
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
---
# Relacionamentos

```text
Igreja
 ├─ Usuários (vínculo com a igreja: OWNER | ADMIN | MEMBER)
 ├─ Ministérios
 │   ├─ Membros (vínculo com o ministério: LEADER | MEMBER)
 │   └─ Funções
 └─ Programações
     └─ Escalas por ministério
         └─ Alocações
             ├─ Membro
             └─ Função
```

Até 2026-10-21 o diagrama dizia "Equipes" ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]]).

Links: [[dados/ENTIDADES]], [[03-DOMINIO]], [[tecnico/BANCO-DE-DADOS]].

## Cardinalidades decididas
Aceitas em 2026-10-21 ([[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]]):

| Relação | Cardinalidade | Decisão |
|---|---|---|
| Usuário ↔ Igreja | um usuário em várias igrejas; um vínculo por (igreja, usuário) | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-006 — Usuário em mais de uma igreja\|DATA-DEC-006]] |
| OWNER por igreja | exatamente 1 | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-007 — Quantidade de OWNER por igreja\|DATA-DEC-007]] |
| LEADER por ministério | vários | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-008 — Quantidade de LEADER por ministério\|DATA-DEC-008]] |
| Usuário ↔ Ministério | um vínculo por (ministério, usuário), com um papel | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-009 — Papel único por usuário em cada ministério\|DATA-DEC-009]] |
| Alocações ativas da mesma pessoa na mesma escala | no máximo 1 | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-014 — A mesma pessoa mais de uma vez na mesma escala\|DATA-DEC-014]] |
| Substituição | a nova alocação aponta para a original, na mesma escala | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-015 — Modelo de substituição\|DATA-DEC-015]] |
| Disponibilidade | por pessoa na igreja (vale para todos os ministérios) | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-017 — Disponibilidade\|DATA-DEC-017]] |
| Convite pendente | no máximo 1 por (igreja, ministério, email) | [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-011 — Convites\|DATA-DEC-011]] |

Já estavam na Brain: um usuário pode estar em um ou mais ministérios ([[fluxos/FLUXO-MEMBROS]]); uma programação envolve vários ministérios, e cada ministério participante pode gerar uma escala ([[fluxos/FLUXO-PROGRAMACOES]]); um membro pode ter várias funções no ministério ([[fluxos/FLUXO-MEMBROS]], passo 4).

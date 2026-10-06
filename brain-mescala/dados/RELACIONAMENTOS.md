---
tipo: modelo-dados
status: ativo
---
# Relacionamentos

```text
Igreja
 ├─ Usuários
 ├─ Equipes
 │   ├─ Membros
 │   └─ Funções
 └─ Programações
     └─ Escalas por equipe
         └─ Alocações
             ├─ Membro
             └─ Função
```

Links: [[dados/ENTIDADES]], [[03-DOMINIO]], [[tecnico/BANCO-DE-DADOS]].

## Cardinalidades em aberto
- Usuário em uma ou várias igrejas: [[decisoes/PENDENCIAS#DATA-DEC-006 — Usuário em mais de uma igreja|DATA-DEC-006]].
- OWNER por igreja: [[decisoes/PENDENCIAS#DATA-DEC-007 — Quantidade de OWNER por igreja|DATA-DEC-007]].
- Líderes por equipe: [[decisoes/PENDENCIAS#DATA-DEC-008 — Quantidade de LEADER por ministério|DATA-DEC-008]].
- Papéis por usuário em cada equipe: [[decisoes/PENDENCIAS#DATA-DEC-009 — Papel único por usuário em cada ministério|DATA-DEC-009]].
- Alocações da mesma pessoa na mesma escala: [[decisoes/PENDENCIAS#DATA-DEC-014 — A mesma pessoa mais de uma vez na mesma escala|DATA-DEC-014]].

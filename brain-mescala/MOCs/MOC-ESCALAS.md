---
tipo: moc
area: escalas
atualizado: 2026-10-22
---
# MOC — Escalas

## Núcleo
- [[modulos/ESCALAS]]
- [[dados/ENTIDADES#Alocação|Alocação]]
- [[modulos/PROGRAMACOES]]
- [[modulos/FUNCOES]]
- [[modulos/MEMBROS]]
- [[modulos/DISPONIBILIDADE]]

## Fluxos
- [[fluxos/FLUXO-ESCALAS]]
- [[fluxos/FLUXO-CONFIRMACAO]]
- [[fluxos/FLUXO-SUBSTITUICAO]]

## Regras e estados
- [[05-REGRAS-DE-NEGOCIO]]: ESC-001 a ESC-005 e [[05-REGRAS-DE-NEGOCIO#DIS-001 — Impedimento é registrado só pelo próprio membro|DIS-001]].
- [[dados/STATUS]]: Escala com RASCUNHO, PUBLICADA e CONCLUIDA; **nunca cancelada** (2026-10-22).
- [[seguranca/AUDITORIA]]

## Decisões
- [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-014 — A mesma pessoa mais de uma vez na mesma escala|DATA-DEC-014]]: no máximo uma alocação ativa por pessoa na escala.
- [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-015 — Modelo de substituição|DATA-DEC-015]]: a original vira SUBSTITUIDA e a nova aponta para ela.
- [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-016 — Status e transições|DATA-DEC-016]]: banco guarda os valores, backend valida as transições; respostas (a), (b), (d) e (e); (c) deixou de existir.
- [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-017 — Disponibilidade|DATA-DEC-017]]: só impedimentos, por pessoa na igreja, registrados só pelo próprio membro.

## Pendências
- Quais status contam como alocação "ativa": [[decisoes/PENDENCIAS#Lacunas observadas no registro de 2026-10-21|PENDENCIAS]].
- O que é "excluir" o membro: [[decisoes/PENDENCIAS#Significado de excluir o membro — DATA-DEC-017|PENDENCIAS]] (contrato da feature de escalas).
- [[tecnico/DIVERGENCIAS-LEGADO]]: o legado não tem função, status da escala nem substituição.

---
tipo: modulo
status: ativo
atualizado: 2026-10-22
relacionado:
  - "[[modulos/PROGRAMACOES]]"
  - "[[dados/ENTIDADES#Alocação|Alocação]]"
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
---
# Escalas
A escala organiza a participação de um ministério em uma [[modulos/PROGRAMACOES|Programação]].

Ela não deve armazenar posições fixas por coluna. Sua composição ocorre por [[dados/ENTIDADES#Alocação|Alocações]], permitindo qualquer conjunto de [[modulos/FUNCOES|Funções]].

## Fluxos
- [[fluxos/FLUXO-ESCALAS]]
- [[fluxos/FLUXO-CONFIRMACAO]]
- [[fluxos/FLUXO-SUBSTITUICAO]]

## Regras
- [[05-REGRAS-DE-NEGOCIO#ESC-001 — Conflito de horário]]
- [[05-REGRAS-DE-NEGOCIO#ESC-002 — Compatibilidade de função]]
- [[05-REGRAS-DE-NEGOCIO#ESC-003 — Estado controlado]]
- [[05-REGRAS-DE-NEGOCIO#ESC-004 — Histórico de substituição]]
- [[05-REGRAS-DE-NEGOCIO#ESC-005 — Uma alocação ativa por pessoa na escala]]

## Decisões
- **Estados:** RASCUNHO, PUBLICADA, CONCLUIDA. **A Escala nunca é cancelada** (PO, 2026-10-22); até essa data a Brain previa também CANCELADA ([[dados/STATUS]]).
- **Validação:** o banco guarda os valores e o backend valida as transições ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-016 — Status e transições|DATA-DEC-016]]).
- **Rascunho:** as alocações ficam AGUARDANDO_CONFIRMACAO; o pedido de resposta é enviado só na publicação (DATA-DEC-016 a). Uma escala em rascunho pode ser apagada se nunca foi publicada (DATA-DEC-016 e).
- **Conclusão:** manual (DATA-DEC-016 b).
- **Mesma pessoa na escala:** no máximo uma alocação ativa ([[05-REGRAS-DE-NEGOCIO#ESC-005 — Uma alocação ativa por pessoa na escala|ESC-005]]).
- **Substituição:** a alocação original vira SUBSTITUIDA, e a nova aponta para ela ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-015 — Modelo de substituição|DATA-DEC-015]]).
- **Impedimentos:** só o próprio membro registra; o líder que não quiser o membro participando o exclui ([[05-REGRAS-DE-NEGOCIO#DIS-001 — Impedimento é registrado só pelo próprio membro|DIS-001]]).

## Dados
- [[dados/STATUS]]
- [[dados/RELACIONAMENTOS]]
- [[dados/EVENTOS-DO-SISTEMA]]

## Pendências
- Quais status contam como alocação "ativa": **A DEFINIR**.
- O que é "excluir" o membro (da escala ou do ministério) e o efeito no histórico: **A DEFINIR** no contrato da feature de escalas, respeitando a [[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]] ([[decisoes/PENDENCIAS#Significado de excluir o membro — DATA-DEC-017|PENDENCIAS]]).
- Lista completa de transições: a validar ([[dados/STATUS]]).

## Legado
`escalas` sem status e `escala_membros` sem função, com `confirmado` booleano; nenhuma tela cria escala ([[tecnico/LEGADO-ATUAL]], [[tecnico/DIVERGENCIAS-LEGADO]]). Riscos S9 e S10 em [[seguranca/RISCOS-DO-LEGADO]]. O app legado não tem uso real (2026-10-22): não há migração de escalas legadas ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-022 — Convivência com o legado e migração de dados|DATA-DEC-022]]).

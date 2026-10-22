---
tipo: fluxo
status: ativo
atualizado: 2026-10-21
---
# Fluxo — Confirmação
1. Escala publicada solicita resposta do membro.
2. O membro confirma ou recusa sua [[dados/ENTIDADES#Alocação|Alocação]].
3. A transição segue [[dados/STATUS]].
4. Recusa pode iniciar [[fluxos/FLUXO-SUBSTITUICAO]].

Notificação: [[modulos/NOTIFICACOES]].

## Decisões
- **Passo 1:** o pedido de resposta é enviado só na publicação; antes dela, as alocações já ficam AGUARDANDO_CONFIRMACAO ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-016 — Status e transições|DATA-DEC-016]] a).
- **Passo 2:** a confirmação é o status da alocação ("Confirmações" do Data Task do PO; [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-002 — Mapeamento dos termos do Data Task|DATA-DEC-002]]) e guarda também a data da resposta (DATA-DEC-016 d).
- **Passo 3:** o banco guarda os valores e o backend valida as transições (DATA-DEC-016).

## Pendências
- Lista completa de transições da alocação: a validar ([[dados/STATUS]]).
- Canal da notificação: **A DEFINIR** ([[modulos/NOTIFICACOES]]).

Legado: `escala_membros.confirmado` é booleano, e `false` significa ao mesmo tempo "pendente" e "recusou" ([[tecnico/DIVERGENCIAS-LEGADO]]).

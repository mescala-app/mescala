---
tipo: fluxo
status: ativo
---
# Fluxo — Confirmação
1. Escala publicada solicita resposta do membro.
2. O membro confirma ou recusa sua [[dados/ENTIDADES#Alocação|Alocação]].
3. A transição segue [[dados/STATUS]].
4. Recusa pode iniciar [[fluxos/FLUXO-SUBSTITUICAO]].

Notificação: [[modulos/NOTIFICACOES]].

Pendências: transições e registro da data da resposta ([[decisoes/PENDENCIAS#DATA-DEC-016 — Status e transições|DATA-DEC-016]]); "Confirmações" do Data Task do PO ([[decisoes/PENDENCIAS#DATA-DEC-002 — Mapeamento dos termos do Data Task|DATA-DEC-002]]).

Legado: `escala_membros.confirmado` é booleano, e `false` significa ao mesmo tempo "pendente" e "recusou" ([[tecnico/DIVERGENCIAS-LEGADO]]).

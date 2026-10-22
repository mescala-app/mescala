---
tipo: modulo
status: a-definir
---
# Notificações
Responsável por comunicar publicação de escala, pedido de confirmação, alteração ou substituição.

Canais e política de entrega: **A DEFINIR**.

Eventos de origem: [[dados/EVENTOS-DO-SISTEMA]].

Decidido em 2026-10-21: o pedido de resposta às alocações é enviado só na publicação da escala ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-016 — Status e transições|DATA-DEC-016]] a). O canal continua **A DEFINIR**.

## Legado
Existe uma tabela `notificacoes` sem uso; o relatório de dados a classifica como candidata a depreciação. Os emails de convite saem pela Edge Function `enviar-convites`, via Resend ([[tecnico/LEGADO-ATUAL]]). Nada disso define a política de Notificações.

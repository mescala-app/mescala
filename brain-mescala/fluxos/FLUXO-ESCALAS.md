---
tipo: fluxo
status: ativo
atualizado: 2026-10-22
---
# Fluxo — Escalas
1. Líder autorizado acessa uma [[modulos/PROGRAMACOES|Programação]].
2. Abre a [[modulos/ESCALAS|Escala]] de seu ministério.
3. Adiciona [[dados/ENTIDADES#Alocação|Alocações]].
4. O backend valida [[modulos/FUNCOES|função]], [[modulos/DISPONIBILIDADE|disponibilidade]] e conflito de horário.
5. Escala permanece em rascunho até publicação.
6. Após publicação, inicia [[fluxos/FLUXO-CONFIRMACAO]].

Regras: [[05-REGRAS-DE-NEGOCIO]].

## Decisões
- **Passo 3:** durante o rascunho, as alocações ficam AGUARDANDO_CONFIRMACAO ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-016 — Status e transições|DATA-DEC-016]] a). No máximo uma alocação ativa por pessoa na escala ([[05-REGRAS-DE-NEGOCIO#ESC-005 — Uma alocação ativa por pessoa na escala|ESC-005]]).
- **Passo 4:** a disponibilidade é o conjunto de impedimentos que o próprio membro registrou, válidos na igreja inteira ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-017 — Disponibilidade|DATA-DEC-017]]). O líder não registra impedimento por um membro; se não quiser o membro participando, ele o exclui ([[05-REGRAS-DE-NEGOCIO#DIS-001 — Impedimento é registrado só pelo próprio membro|DIS-001]]).
- **Passo 5:** uma escala em rascunho pode ser apagada se nunca foi publicada (DATA-DEC-016 e).
- **Passo 6:** o pedido de resposta aos membros é enviado só na publicação (DATA-DEC-016 a).
- **Depois:** a escala passa a CONCLUIDA de forma manual (DATA-DEC-016 b). **A escala nunca é cancelada** (PO, 2026-10-22; [[dados/STATUS]]).

## Pendências
- Quem é o "líder autorizado" do passo 1: depende das regras de autorização em aberto (por exemplo, se o ADMIN gerencia todos os ministérios). **A DEFINIR** ([[decisoes/PENDENCIAS#Outras pendências registradas|PENDENCIAS]]).
- O que é "excluir" o membro e o efeito no histórico: **A DEFINIR** no contrato da feature de escalas ([[decisoes/PENDENCIAS#Significado de excluir o membro — DATA-DEC-017|PENDENCIAS]]).
- Quais status contam como alocação "ativa": **A DEFINIR**.

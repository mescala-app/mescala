---
tipo: modulo
status: ativo
atualizado: 2026-10-22
relacionado:
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
---
# Disponibilidade
Registra os **impedimentos** dos membros para determinadas datas ou intervalos.

Até 2026-10-21 esta nota dizia "impedimentos ou disponibilidade". A decisão modela **só impedimentos** ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-017 — Disponibilidade|DATA-DEC-017]]).

Interage com [[modulos/MEMBROS]], [[modulos/PROGRAMACOES]] e [[modulos/ESCALAS]].

A validação de disponibilidade pertence ao backend conforme [[02-ARQUITETURA]].

## Decisões
- **Tipo:** só impedimentos (DATA-DEC-017, 2026-10-21).
- **Escopo:** por pessoa **na igreja**; valem para todos os ministérios.
- **Período:** intervalo de início e fim, com motivo opcional.
- **Quem registra:** **só o próprio membro** registra o impedimento dele. O líder não registra impedimento por um membro; se não quiser o membro participando, ele o exclui (complemento do PO, 2026-10-22; [[05-REGRAS-DE-NEGOCIO#DIS-001 — Impedimento é registrado só pelo próprio membro|DIS-001]]).
- "Ausência", termo do Data Task do PO, é o impedimento ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-002 — Mapeamento dos termos do Data Task|DATA-DEC-002]]).
- **Uso:** os impedimentos entram na validação da escalação ([[fluxos/FLUXO-ESCALAS]], passo 4).

## Pendências
- O que é "excluir" o membro (da escala ou do ministério) e o efeito no histórico: **A DEFINIR** no contrato da feature de escalas. Vale a regra de que nada com histórico é apagado ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]]; [[decisoes/PENDENCIAS#Significado de excluir o membro — DATA-DEC-017|PENDENCIAS]]).

## Legado
Tabela `ausencias` (uma data, por equipe), sem uso em nenhuma tela ([[tecnico/LEGADO-ATUAL]], [[tecnico/DIVERGENCIAS-LEGADO]]). O app legado não tem uso real (2026-10-22): não há migração.

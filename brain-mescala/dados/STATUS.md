---
tipo: maquina-estados
status: ativo
atualizado: 2026-10-22
relacionado:
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
  - "[[05-REGRAS-DE-NEGOCIO]]"
---
# Status

## Escala
- RASCUNHO
- PUBLICADA
- CONCLUIDA

> **A Escala nunca é cancelada** (decisão do PO, 2026-10-22). Até 2026-10-22, esta nota previa também o status **CANCELADA**; o PO o removeu. Com isso, a pergunta sobre o estado das alocações em escala cancelada deixou de existir ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-016 — Status e transições|DATA-DEC-016]]).

Decidido ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-016 — Status e transições|DATA-DEC-016]], 2026-10-21):
- RASCUNHO → PUBLICADA na publicação ([[fluxos/FLUXO-ESCALAS]]).
- CONCLUIDA é **manual** (b).
- Uma escala em RASCUNHO pode ser apagada se nunca foi publicada (e).

## Alocação / confirmação
- AGUARDANDO_CONFIRMACAO
- CONFIRMADA
- RECUSADA
- SUBSTITUICAO_PENDENTE
- SUBSTITUIDA

Decidido ([[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]], 2026-10-21):
- Enquanto a escala é RASCUNHO, a alocação fica AGUARDANDO_CONFIRMACAO; o pedido de resposta é enviado só na publicação (DATA-DEC-016 a).
- A confirmação guarda também a data da resposta (DATA-DEC-016 d).
- Na substituição, a alocação original vira SUBSTITUIDA e a nova aponta para ela ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-015 — Modelo de substituição|DATA-DEC-015]]).
- No máximo uma alocação ativa por pessoa em cada escala ([[05-REGRAS-DE-NEGOCIO#ESC-005 — Uma alocação ativa por pessoa na escala|ESC-005]]). Quais destes status contam como "ativa": **A DEFINIR**.

## Convite
Decidido em 2026-10-22 ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-011 — Convites|DATA-DEC-011]]):
- PENDENTE
- ACEITO
- EXPIRADO
- CANCELADO

Transições entre eles: **A DEFINIR** (o fluxo de convite ainda não está documentado).

## Vínculos, ministérios e funções
Decidido em 2026-10-22 ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-012 — Inativação, arquivamento e exclusão|DATA-DEC-012]]), para vínculos com a igreja, vínculos com o ministério, ministérios e funções:
- ATIVO
- INATIVO

Cada um tem também data de término. Nada com histórico é apagado ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]]).

**Igreja:** a DATA-DEC-012 prevê status também para a Igreja, mas a decisão de 2026-10-22 não cita a igreja. Valores: **A DEFINIR**.

## Representação e validação
- O banco guarda os valores (texto com CHECK, em MAIÚSCULAS, exatamente como nesta nota); o backend valida as transições ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-016 — Status e transições|DATA-DEC-016]], [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-018 — Nomenclatura e idioma|DATA-DEC-018]]).
- A definição final das transições deve ser validada antes da implementação definitiva.

Relacionados: [[modulos/ESCALAS]], [[fluxos/FLUXO-CONFIRMACAO]], [[fluxos/FLUXO-SUBSTITUICAO]], [[05-REGRAS-DE-NEGOCIO#ESC-003 — Estado controlado|ESC-003]].

## Pendências
- Lista completa de transições de Escala e Alocação: a validar.
- Status "ativa" da alocação, status da Igreja e transições do convite: **A DEFINIR** ([[decisoes/PENDENCIAS]]).
- Cancelamento de **Programação**: nada foi decidido; a decisão de 2026-10-22 trata só da Escala. **A DEFINIR**, se o tema aparecer ([[decisoes/PENDENCIAS#Cancelamento de Programação|PENDENCIAS]]).
- O legado não tem status de escala e usa um booleano ambíguo na escalação ([[tecnico/DIVERGENCIAS-LEGADO]]).

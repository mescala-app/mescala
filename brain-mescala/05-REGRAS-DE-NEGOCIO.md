---
tipo: regras-negocio
status: ativo
---
# Regras de Negócio

## ESC-001 — Conflito de horário
Um membro não pode possuir alocações incompatíveis em programações com sobreposição de horário.

Relacionados: [[modulos/ESCALAS]], [[modulos/PROGRAMACOES]], [[modulos/DISPONIBILIDADE]], [[fluxos/FLUXO-ESCALAS]].

## ESC-002 — Compatibilidade de função
Um membro só pode ser escalado em função permitida para ele dentro da equipe.

Relacionados: [[modulos/FUNCOES]], [[modulos/EQUIPES]], [[dados/ENTIDADES#Alocação|Alocação]].

## ESC-003 — Estado controlado
Mudanças de estado de escala e alocação devem obedecer aos estados definidos em [[dados/STATUS]].

## ESC-004 — Histórico de substituição
Uma substituição não deve apagar o membro originalmente escalado. O histórico precisa permanecer auditável.

Relacionados: [[fluxos/FLUXO-SUBSTITUICAO]], [[seguranca/AUDITORIA]].

## SEC-001 — Isolamento por igreja
Dados de uma igreja não podem ser expostos a outra.

Relacionados: [[seguranca/ISOLAMENTO-DE-DADOS]], [[seguranca/AUTORIZACAO]].

## Regra de governança
Se uma regra necessária não estiver documentada, ela deve ser marcada como **A DEFINIR** em vez de ser inventada.

## Pendências que tocam estas regras
As regras acima não mudam. Partes delas dependem de decisões em aberto ([[decisoes/PENDENCIAS]]):
- **ESC-001:** o que são alocações "incompatíveis" ([[decisoes/PENDENCIAS#DATA-DEC-014 — A mesma pessoa mais de uma vez na mesma escala|DATA-DEC-014]]) e como a disponibilidade é registrada ([[decisoes/PENDENCIAS#DATA-DEC-017 — Disponibilidade|DATA-DEC-017]]).
- **ESC-003:** transições de status ([[decisoes/PENDENCIAS#DATA-DEC-016 — Status e transições|DATA-DEC-016]]).
- **ESC-004:** representação da substituição ([[decisoes/PENDENCIAS#DATA-DEC-015 — Modelo de substituição|DATA-DEC-015]]) e destino do histórico em inativação ou exclusão ([[decisoes/PENDENCIAS#DATA-DEC-012 — Inativação, arquivamento e exclusão|DATA-DEC-012]]).
- **SEC-001:** violada hoje no sistema legado ([[seguranca/RISCOS-DO-LEGADO]]); correção em decisão ([[decisoes/PENDENCIAS#DATA-DEC-023 — Correção urgente de segurança no legado|DATA-DEC-023]]).
- O banco legado não consegue cumprir ESC-001, ESC-002 e ESC-004: não tem intervalo de horário, função nem substituição ([[tecnico/DIVERGENCIAS-LEGADO]]).

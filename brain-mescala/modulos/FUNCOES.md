---
tipo: modulo
status: ativo
atualizado: 2026-10-22
---
# Funções
Funções representam posições exercidas dentro de um ministério, como vocal, bateria, recepção ou fotografia.

A função pertence ao contexto do [[modulos/EQUIPES|Ministério]]. Um [[modulos/MEMBROS|Membro]] deve possuir compatibilidade com a função para ser usado em uma [[dados/ENTIDADES#Alocação|Alocação]].

Regra: [[05-REGRAS-DE-NEGOCIO#ESC-002 — Compatibilidade de função]].

## Decisões
- "Funções ministeriais", termo do Data Task do PO, é o mesmo que Função ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-002 — Mapeamento dos termos do Data Task|DATA-DEC-002]]).
- **Nome:** único por ministério, sem diferenciar maiúsculas ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-013 — Atributos e unicidade de nomes|DATA-DEC-013]]).
- **Inativação:** a função tem status ATIVO ou INATIVO (2026-10-22) e data de término; nada com histórico é apagado ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]]).
- Um membro pode ter várias funções no ministério; elas ficam no vínculo dele com o ministério ([[fluxos/FLUXO-MEMBROS]], passo 4; [[05-REGRAS-DE-NEGOCIO#MEM-002 — Um vínculo por usuário em cada ministério|MEM-002]]).

## Legado
O banco legado não tem funções; o ESC-002 não pode ser cumprido nele ([[tecnico/DIVERGENCIAS-LEGADO]]).

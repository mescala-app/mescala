---
tipo: dominio
status: ativo
atualizado: 2026-10-22
relacionado:
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
  - "[[dados/ENTIDADES]]"
  - "[[dados/RELACIONAMENTOS]]"
---
# Domínio

## Entidades nucleares
- [[modulos/IGREJAS|Igreja]]
- [[dados/ENTIDADES#Usuário|Usuário]]
- [[modulos/EQUIPES|Ministério]] (antes: Equipe)
- [[modulos/FUNCOES|Função]]
- [[modulos/PROGRAMACOES|Programação]]
- [[modulos/ESCALAS|Escala]]
- [[dados/ENTIDADES#Alocação|Alocação]]
- [[modulos/DISPONIBILIDADE|Disponibilidade]]

Entidades de apoio, decididas em 2026-10-21: [[dados/ENTIDADES#Convite|Convite]] ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-011 — Convites|DATA-DEC-011]]) e [[dados/ENTIDADES#Registro de auditoria|Registro de auditoria]] ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 — Auditoria|DATA-DEC-021]]).

## Relações principais
Uma [[modulos/IGREJAS|Igreja]] possui [[modulos/EQUIPES|ministérios]] e usuários vinculados. Uma [[modulos/PROGRAMACOES|Programação]] representa um evento/data. Cada ministério participante pode possuir sua própria [[modulos/ESCALAS|Escala]]. A escala é composta por [[dados/ENTIDADES#Alocação|alocações]] de membros em funções.

## Distinções essenciais
- Ministério não é função.
- Programação não é escala.
- Escala não é alocação.
- Papel na igreja e papel dentro do ministério são conceitos diferentes. O papel é sempre do vínculo com a igreja ou com o ministério ([[decisoes/ADR-001-ESTRUTURA-INICIAL|ADR-001]]; [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]]). Até 2026-10-21 esta linha dizia "papel global e papel dentro da equipe".

Veja [[dados/RELACIONAMENTOS]] e [[MOCs/MOC-DOMINIO]].

## Vocabulário
- **Ministério** é o termo canônico; no código, `ministry` ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]], aceita em 2026-10-21). "Equipe" e "Ministério" são o mesmo conceito. Até 2026-10-21, as notas da Brain diziam "Equipe"; [[modulos/EQUIPES]] e [[fluxos/FLUXO-EQUIPES]] mantêm o nome do arquivo e têm `aliases`.
- Identificadores do schema oficial em inglês; valores de status e papéis como na Brain ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-018 — Nomenclatura e idioma|DATA-DEC-018]]).

## Termos equivalentes
Termos do Data Task do PO e do [[Fluxograma.canvas]] que **não** são entidades próprias ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-002 — Mapeamento dos termos do Data Task|DATA-DEC-002]] e [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma|DATA-DEC-003]], aceitas em 2026-10-21):

| Termo | Conceito da Brain |
|---|---|
| Equipe | [[modulos/EQUIPES\|Ministério]] |
| Convocação | [[dados/ENTIDADES#Alocação\|Alocação]] |
| Confirmação | status da Alocação ([[dados/STATUS]]) |
| Ausência | impedimento da [[modulos/DISPONIBILIDADE\|Disponibilidade]] |
| Permissões | papel + escopo, sem tabela ([[04-USUARIOS-E-PERMISSOES]]) |
| Funções ministeriais | [[modulos/FUNCOES\|Funções]] |
| Culto | programação comum ([[modulos/PROGRAMACOES]]) |
| Agenda | consulta de programações, sem tabela |

## Fora do modelo nesta fundação
- Reunião, Comissão, Cronograma e Pauta: ficam fora até a Brain documentá-los. **A DEFINIR** ([[produto/CONCEITOS-DO-CANVAS]]).
- Recorrência de programações: a Programação é uma ocorrência datada, sem recorrência nesta fundação ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-004 — Programações recorrentes|DATA-DEC-004]]).

## Pendências
- Conceitos do canvas ainda sem definição: Reunião, Comissão, Cronograma e Pauta ([[produto/CONCEITOS-DO-CANVAS]]).
- Decisões e pontos em aberto: [[decisoes/PENDENCIAS]].
- O sistema legado usa outro modelo ([[tecnico/DIVERGENCIAS-LEGADO]]).

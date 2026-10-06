---
tipo: modelo-dados
status: ativo
---
# Entidades

## Igreja
Tenant organizacional. Veja [[modulos/IGREJAS]].

## Usuário
Identidade autenticável. Papéis dependem de vínculos e escopo. Veja [[04-USUARIOS-E-PERMISSOES]].

## Equipe
Grupo operacional pertencente a uma igreja. Veja [[modulos/EQUIPES]].

## Função
Capacidade/posição dentro de equipe. Veja [[modulos/FUNCOES]].

## Programação
Evento com data e horário. Veja [[modulos/PROGRAMACOES]].

## Escala
Plano de participação de uma equipe em uma programação. Veja [[modulos/ESCALAS]].

## Alocação
Ligação entre escala, membro e função. É a unidade operacional da escala.

Campos conceituais mínimos:
- escala_id
- membro_id
- funcao_id
- status
- confirmação
- referência de substituição/histórico quando aplicável

## Disponibilidade
Registro temporal associado a membro. Veja [[modulos/DISPONIBILIDADE]].

Relações: [[dados/RELACIONAMENTOS]].

## Pendências
- Nome canônico de Equipe (Equipe ou Ministério): [[decisoes/PENDENCIAS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]].
- Termos do Data Task do PO que podem ou não ser entidades próprias (Convocação, Confirmação, Ausência, Permissões): [[decisoes/PENDENCIAS#DATA-DEC-002 — Mapeamento dos termos do Data Task|DATA-DEC-002]].
- Atributos de cada entidade: [[decisoes/PENDENCIAS#DATA-DEC-013 — Atributos e unicidade de nomes|DATA-DEC-013]].
- Usuário × provedor de autenticação: [[decisoes/PENDENCIAS#DATA-DEC-019 — Identidade × provedor de autenticação|DATA-DEC-019]].
- Idioma dos identificadores (os campos acima estão em português): [[decisoes/PENDENCIAS#DATA-DEC-018 — Nomenclatura e idioma|DATA-DEC-018]].
- Convite e membro sem conta não são entidades da Brain; existem só no legado: [[decisoes/PENDENCIAS#DATA-DEC-011 — Convites|DATA-DEC-011]], [[decisoes/PENDENCIAS#DATA-DEC-010 — Membro sem conta|DATA-DEC-010]].
- Conceitos do canvas sem definição: [[produto/CONCEITOS-DO-CANVAS]].
- Comparação com o banco legado: [[tecnico/DIVERGENCIAS-LEGADO]].

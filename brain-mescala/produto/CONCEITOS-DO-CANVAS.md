---
tipo: conceitos-a-definir
status: a-definir
area: dominio
fonte: "[[Fluxograma.canvas]]"
relacionado:
  - "[[03-DOMINIO]]"
  - "[[04-USUARIOS-E-PERMISSOES]]"
  - "[[decisoes/PENDENCIAS]]"
  - "[[MOCs/MOC-DOMINIO]]"
---
# Conceitos citados no canvas, sem definição

O [[Fluxograma.canvas]] cita conceitos que nenhuma nota da Brain define. Esta nota só **registra** que eles existem no canvas e transcreve o que está escrito lá. **Não define, não interpreta e não cria regra.** Cada conceito fica **A DEFINIR** até a decisão correspondente.

- Nenhum destes conceitos é módulo. Não há regras, fluxos, entidades nem permissões para eles na Brain.
- Para o [[agents/arquiteto|Arquiteto]], qualquer feature que toque um deles gera BLOQUEIO DE DOMÍNIO.
- Decisões pendentes: [[decisoes/PENDENCIAS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]], [[decisoes/PENDENCIAS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma|DATA-DEC-003]] e [[decisoes/PENDENCIAS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]].

## Conceitos

### Culto
- **No canvas:** cartão "CULTO", com "RECEBE: ESCALA, CRONOGRAMA". O cartão do ADMIN diz "CRIA CULTOS"; o do ADMIN e o do Líder de Ministério dizem "ADMINISTRA AGENDA E CRONOGRAMA DE CULTOS".
- **Na Brain:** sem definição. A nota que define evento com data e horário é [[modulos/PROGRAMACOES]]; a relação entre Culto e Programação não está decidida.
- **Fora da Brain:** o [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] lista o domínio conceitual `worship-service`. A tabela legada `eventos` tem nome padrão "Culto" ([[tecnico/LEGADO-ATUAL]]).
- **Status:** **A DEFINIR** ([[decisoes/PENDENCIAS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma|DATA-DEC-003]]; recorrência em [[decisoes/PENDENCIAS#DATA-DEC-004 — Programações recorrentes|DATA-DEC-004]]).

### Agenda
- **No canvas:** cartão "AGENDA", com "RECEBE: CULTOS, REUNIÕES".
- **Na Brain:** sem definição. Não se sabe se é entidade ou consulta.
- **Status:** **A DEFINIR** ([[decisoes/PENDENCIAS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma|DATA-DEC-003]]).

### Cronograma
- **No canvas:** cartão "CRONOGRAMA", sem texto próprio; aparece em "ADMINISTRA AGENDA E CRONOGRAMA DE CULTOS" e no "RECEBE" do Culto.
- **Na Brain:** sem definição.
- **Status:** **A DEFINIR** ([[decisoes/PENDENCIAS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma|DATA-DEC-003]]).

### Reunião (com pauta)
- **No canvas:** cartão "REUNIÕES", com "RECEBE: MEMBROS, LÍDERES, ANCIÃO, PAUTA".
- **Na Brain:** sem definição. "Pauta" também não é definida.
- **Fora da Brain:** o ADR-002 lista o domínio conceitual `meeting`.
- **Status:** **A DEFINIR** ([[decisoes/PENDENCIAS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma|DATA-DEC-003]]).

### Comissão (com pauta)
- **No canvas:** cartão "COMISSÕES", com "RECEBE: LÍDERES, PAUTA".
- **Na Brain:** sem definição.
- **Fora da Brain:** o ADR-002 lista o domínio conceitual `commission`.
- **Status:** **A DEFINIR** ([[decisoes/PENDENCIAS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma|DATA-DEC-003]]).

### "ADMIN (ANCIÃO)"
- **No canvas:** cartão "ADMIN(ANCIÃO)", num grupo rotulado "PERFIL", com o texto "CRIA CULTOS, ADMINISTRA AGENDA E CRONOGRAMA DE CULTOS, CADASTRA LÍDER, VISUALIZA ESCALAS N:1".
- **Na Brain:** ADMIN aparece como papel da igreja em [[04-USUARIOS-E-PERMISSOES]], sem lista de permissões. "ANCIÃO" não é definido.
- **Fora da Brain:** a definição do agente Arquiteto usa ANCIÃO como exemplo de cargo organizacional, distinto de papel técnico, e proíbe autorização baseada em cargo sem regra explícita na Brain. Isso não decide o que "ANCIÃO" significa no Mescala.
- **Status:** **A DEFINIR** ([[decisoes/PENDENCIAS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]]).

### "Líder de Ministério"
- **No canvas:** cartão "LIDER DE MINISTÉRIO", num grupo rotulado "PERFIL", com o texto "ADMINISTRA AGENDA E CRONOGRAMA DE CULTOS, CADASTRA MEMBRO, ADMINISTRA ESCALAS N:1".
- **Na Brain:** existe o papel LEADER ([[04-USUARIOS-E-PERMISSOES]]) e o conceito de [[modulos/EQUIPES|Equipe]]. A Brain não usa "Ministério".
- **Fora da Brain:** o legado chama o papel de "Líder de Equipe" ([[tecnico/LEGADO-ATUAL]]).
- **Status:** **A DEFINIR** ([[decisoes/PENDENCIAS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]] para o termo; [[decisoes/PENDENCIAS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]] para o papel).

## Transcrição literal do canvas
Registro do conteúdo em 2026-10-06, sem interpretação.

**Grupos "PERFIL"** (três grupos):
- OWNER: "ACESSO LIVRE A TUDO".
- ADMIN(ANCIÃO): "CRIA CULTOS, ADMINISTRA AGENDA E CRONOGRAMA DE CULTOS, CADASTRA LÍDER, VISUALIZA ESCALAS N:1".
- LIDER DE MINISTÉRIO: "ADMINISTRA AGENDA E CRONOGRAMA DE CULTOS, CADASTRA MEMBRO, ADMINISTRA ESCALAS N:1".

**Outros cartões:** MEMBRO (fora dos grupos); ESCALAS ("RECEBE: MEMBROS"); REUNIÕES ("RECEBE: MEMBROS, LÍDERES, ANCIÃO, PAUTA"); COMISSÕES ("RECEBE: LÍDERES, PAUTA"); CRONOGRAMA; CULTO ("RECEBE: ESCALA, CRONOGRAMA"); AGENDA ("RECEBE: CULTOS, REUNIÕES").

**Setas** (origem → destino; rótulo entre aspas quando existe):
- OWNER → ADMIN(ANCIÃO)
- ADMIN(ANCIÃO) → AGENDA ("gerencia")
- ADMIN(ANCIÃO) → CULTO
- ADMIN(ANCIÃO) → CRONOGRAMA
- ADMIN(ANCIÃO) → REUNIÕES
- ADMIN(ANCIÃO) → COMISSÕES
- LIDER DE MINISTÉRIO → AGENDA
- LIDER DE MINISTÉRIO → ESCALAS ("gerencia")
- LIDER DE MINISTÉRIO → REUNIÕES
- LIDER DE MINISTÉRIO → COMISSÕES
- MEMBRO → REUNIÕES
- ESCALAS → CULTO
- CRONOGRAMA → CULTO
- CULTO → AGENDA
- REUNIÕES → AGENDA
- COMISSÕES → AGENDA

Os termos que a Brain já define (OWNER, ADMIN, LEADER, MEMBER, Escala) continuam regidos pelas notas próprias: [[04-USUARIOS-E-PERMISSOES]] e [[modulos/ESCALAS]]. O que o canvas diz sobre eles (por exemplo, "ACESSO LIVRE A TUDO" para OWNER) não foi incorporado às regras; a relação entre OWNER e ADMIN está em [[decisoes/PENDENCIAS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]].

Relacionados: [[MOCs/MOC-DOMINIO]], [[MOCs/MOC-USUARIOS]], [[produto/PERSONAS]], [[tecnico/DIVERGENCIAS-LEGADO]].

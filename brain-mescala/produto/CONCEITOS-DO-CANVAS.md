---
tipo: conceitos-a-definir
status: parcialmente-definido
area: dominio
fonte: "[[Fluxograma.canvas]]"
atualizado: 2026-10-21
relacionado:
  - "[[03-DOMINIO]]"
  - "[[04-USUARIOS-E-PERMISSOES]]"
  - "[[decisoes/PENDENCIAS]]"
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
  - "[[MOCs/MOC-DOMINIO]]"
---
# Conceitos citados no canvas

O [[Fluxograma.canvas]] cita conceitos que as notas da Brain não definiam. Esta nota registra que eles existem no canvas, transcreve o que está escrito lá e aponta o que foi decidido sobre cada um. **Não interpreta o canvas e não cria regra.**

- **Decididos em 2026-10-21** ([[decisoes/DEC-09-MODELO-DE-DADOS|DEC-09]]): Culto, Agenda, "ADMIN (ANCIÃO)" e "Líder de Ministério" (como termo e como papel).
- **Continuam A DEFINIR:** Cronograma, Reunião, Comissão e Pauta. Ficam fora do modelo até a Brain documentá-los ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma|DATA-DEC-003]]). Para o [[agents/arquiteto|Arquiteto]], qualquer feature que toque um deles gera BLOQUEIO DE DOMÍNIO.
- **As permissões escritas nos cartões de perfil não foram incorporadas** como regra de autorização.

## Conceitos

### Culto
- **No canvas:** cartão "CULTO", com "RECEBE: ESCALA, CRONOGRAMA". O cartão do ADMIN diz "CRIA CULTOS"; o do ADMIN e o do Líder de Ministério dizem "ADMINISTRA AGENDA E CRONOGRAMA DE CULTOS".
- **Decidido em 2026-10-21:** Culto = **programação comum** ([[modulos/PROGRAMACOES]]; [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma|DATA-DEC-003]]). Sem recorrência nesta fundação ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-004 — Programações recorrentes|DATA-DEC-004]]).
- **Fora da Brain:** o [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] lista o domínio conceitual `worship-service`. A tabela legada `eventos` tem nome padrão "Culto" ([[tecnico/LEGADO-ATUAL]]).
- **Continua A DEFINIR:** a relação do Culto com o Cronograma (o "RECEBE: CRONOGRAMA" do canvas).

### Agenda
- **No canvas:** cartão "AGENDA", com "RECEBE: CULTOS, REUNIÕES".
- **Decidido em 2026-10-21:** Agenda = **consulta**, sem tabela (DATA-DEC-003).

### Cronograma
- **No canvas:** cartão "CRONOGRAMA", sem texto próprio; aparece em "ADMINISTRA AGENDA E CRONOGRAMA DE CULTOS" e no "RECEBE" do Culto.
- **Na Brain:** sem definição. Fica fora do modelo até ser documentado (DATA-DEC-003).
- **Status:** **A DEFINIR**.

### Reunião (com pauta)
- **No canvas:** cartão "REUNIÕES", com "RECEBE: MEMBROS, LÍDERES, ANCIÃO, PAUTA".
- **Na Brain:** sem definição. "Pauta" também não é definida. Ficam fora do modelo até serem documentadas (DATA-DEC-003).
- **Fora da Brain:** o ADR-002 lista o domínio conceitual `meeting`.
- **Status:** **A DEFINIR**.

### Comissão (com pauta)
- **No canvas:** cartão "COMISSÕES", com "RECEBE: LÍDERES, PAUTA".
- **Na Brain:** sem definição. Fica fora do modelo até ser documentada (DATA-DEC-003).
- **Fora da Brain:** o ADR-002 lista o domínio conceitual `commission`.
- **Status:** **A DEFINIR**.

### "ADMIN (ANCIÃO)"
- **No canvas:** cartão "ADMIN(ANCIÃO)", num grupo rotulado "PERFIL", com o texto "CRIA CULTOS, ADMINISTRA AGENDA E CRONOGRAMA DE CULTOS, CADASTRA LÍDER, VISUALIZA ESCALAS N:1".
- **Decidido em 2026-10-21** ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]]): ADMIN é papel da igreja, e OWNER inclui ADMIN; **ANCIÃO é cargo**, sem tabela e sem efeito de autorização ([[04-USUARIOS-E-PERMISSOES]]).
- **Não incorporado:** a lista de permissões do cartão. Se o ADMIN gerencia todos os ministérios continua **A DEFINIR** ([[decisoes/PENDENCIAS#Outras pendências registradas|PENDENCIAS]]). A DATA-DEC-011 registra que a regra "OWNER/ADMIN convida líder; líder convida membro" é confirmada pelo canvas ([[05-REGRAS-DE-NEGOCIO#MEM-003 — Quem convida quem|MEM-003]]).

### "Líder de Ministério"
- **No canvas:** cartão "LIDER DE MINISTÉRIO", num grupo rotulado "PERFIL", com o texto "ADMINISTRA AGENDA E CRONOGRAMA DE CULTOS, CADASTRA MEMBRO, ADMINISTRA ESCALAS N:1".
- **Decidido em 2026-10-21:** "Ministério" é o termo canônico ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]]; [[modulos/EQUIPES]]), e LEADER é papel do ministério; "líder" na igreja é derivado (DATA-DEC-005).
- **Não incorporado:** a lista de permissões do cartão. O que o LEADER pode fazer fora da escala continua **A DEFINIR**. Quem convida quem: [[05-REGRAS-DE-NEGOCIO#MEM-003 — Quem convida quem|MEM-003]].
- **Fora da Brain:** o legado chama o papel de "Líder de Equipe" ([[tecnico/LEGADO-ATUAL]]).

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

Os termos que a Brain já define (OWNER, ADMIN, LEADER, MEMBER, Escala) continuam regidos pelas notas próprias: [[04-USUARIOS-E-PERMISSOES]] e [[modulos/ESCALAS]]. O que o canvas diz sobre eles (por exemplo, "ACESSO LIVRE A TUDO" para OWNER) não foi incorporado às regras. A relação entre OWNER e ADMIN foi decidida em 2026-10-21: OWNER inclui ADMIN ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-005 — Papéis em cada camada|DATA-DEC-005]]).

Relacionados: [[MOCs/MOC-DOMINIO]], [[MOCs/MOC-USUARIOS]], [[produto/PERSONAS]], [[tecnico/DIVERGENCIAS-LEGADO]].

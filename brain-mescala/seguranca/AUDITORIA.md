---
tipo: seguranca
status: ativo
atualizado: 2026-10-22
relacionado:
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
  - "[[features/FOUNDATION-002]]"
---
# Auditoria
Mudanças críticas devem permitir identificar ator, data e alteração realizada.

Prioridade para:
- publicação de escala;
- mudança de alocação;
- confirmação/recusa;
- substituição;
- alteração de permissões.

Relacionados: [[modulos/ESCALAS]], [[fluxos/FLUXO-SUBSTITUICAO]], [[dados/EVENTOS-DO-SISTEMA]].

## Decisões
- **Mecanismo:** tabela de auditoria **só de inserção**, gravada pelo backend **na mesma transação** da operação. As features já nascem auditáveis ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 — Auditoria|DATA-DEC-021]], aceita em 2026-10-21). Até então, o mecanismo estava fora do [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] e **A DEFINIR**.
- **Conteúdo proposto pelo relatório** (seção 13.2): igreja, ator, ação, entidade, id, antes, depois e quando ([[dados/ENTIDADES#Registro de auditoria|Registro de auditoria]]).
- **Histórico preservado:** nada com histórico é apagado; igreja, ministério, vínculos e funções são inativados por status e data de término ([[05-REGRAS-DE-NEGOCIO#HIS-001 — Nada com histórico é apagado|HIS-001]]). A substituição mantém a alocação original como SUBSTITUIDA ([[05-REGRAS-DE-NEGOCIO#ESC-004 — Histórico de substituição|ESC-004]]).
- **LGPD:** um pedido de exclusão vai exigir uma feature de anonimização (consequência registrada na DATA-DEC-012).
  - **R-08** (contrato [[features/FOUNDATION-002]]): `audit_log` vai guardar dados pessoais em `before_data` e `after_data`, e a imutabilidade bloqueia correções. A feature de anonimização trará migration própria.
  - **R-16, risco residual ligado ao R-08:** a imutabilidade de `audit_log` vale para DML. O dono (`postgres`) pode contorná-la por DDL (`ALTER TABLE … DISABLE TRIGGER`) e, se a plataforma permitir, por `session_replication_role = replica`. É plano administrativo (R-15: o RLS protege o caminho da aplicação, não o plano administrativo do Supabase). Nenhum papel de aplicação é dono nem tem CREATE; DDL em `audit_log` só por migration revisada. O bloco B do QA mede o contorno; o resultado é informativo e não reprova a feature.

## Estrutura decidida na FOUNDATION-002
Contrato [[features/FOUNDATION-002]], VERSÃO 2, READY em 2026-10-22. **Escrita nas migrations e ainda não aplicada.**
- **Tabela `mescala.audit_log`:** `id`, `church_id` (obrigatório), `actor_user_id`, `action`, `entity_type`, `entity_id`, `before_data`, `after_data` e `occurred_at`. Exige ao menos um entre `before_data` e `after_data`. Sem `created_at` nem `updated_at`. `action` e `entity_type` não vazios, sem lista de valores.
- **Imutável para DML de qualquer papel**, inclusive `postgres`: UPDATE, DELETE e TRUNCATE são rejeitados por trigger, que cita a [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 — Auditoria|DATA-DEC-021]] (ARQ-F002-08). "Só inserção" não depende só de grant, porque `postgres` e `service_role` existem em todo projeto. O contorno por DDL é o risco residual R-16 (acima).
- **`id` e `occurred_at` vêm sempre do default do banco** (ARQ-F002-15): `mescala_app` só tem INSERT nas colunas `church_id`, `actor_user_id`, `action`, `entity_type`, `entity_id`, `before_data` e `after_data`. Motivo: o "quando" e a identidade do registro não dependem do backend, e esta nota exige identificar ator, data e alteração.
- **Sem SELECT para o backend.** A policy de INSERT exige `church_id` = contexto de igreja **e** `actor_user_id` = usuário do contexto.
- **Primeira feature que gravar `audit_log` (CHURCH-001):** o helper de auditoria grava SQL NULL, nunca JSON `null`, em `before_data` e `after_data`; não informa `id` nem `occurred_at`; não usa RETURNING.

## Pendências
- O que é "excluir" um membro, e o efeito no histórico: **A DEFINIR** no contrato da feature de escalas ([[decisoes/PENDENCIAS#Significado de excluir o membro — DATA-DEC-017|PENDENCIAS]]).
- Mecanismo de eventos: **A DEFINIR** ([[dados/EVENTOS-DO-SISTEMA]]).

## Legado
O sistema legado não tem auditoria, e apagar uma igreja ou um usuário apaga o histórico em cascata ([[tecnico/LEGADO-ATUAL]], [[tecnico/DIVERGENCIAS-LEGADO]]).

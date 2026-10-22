---
tipo: eventos-dominio
status: inicial
---
# Eventos do Sistema
Possíveis eventos de domínio:
- igreja.criada
- ministerio.criado (até 2026-10-21: `equipe.criada`; vocabulário da [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-001 — Equipe × Ministério|DATA-DEC-001]])
- membro.vinculado
- programacao.criada
- escala.publicada
- alocacao.confirmada
- alocacao.recusada
- alocacao.substituida

Servem como referência para [[modulos/NOTIFICACOES]], [[seguranca/AUDITORIA]] e integrações futuras.

O mecanismo de eventos continua **A DEFINIR** (fora do [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]]). A auditoria tem mecanismo próprio, decidido: tabela só de inserção, gravada pelo backend ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-021 — Auditoria|DATA-DEC-021]]).

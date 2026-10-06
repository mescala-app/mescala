# Changelog

## 2026-10-06
Integração do estado atual do projeto ao grafo (agente [[agents/vault-brain]]). Nada foi decidido nesta atualização; o que está em aberto ficou como pendente ou **A DEFINIR**.

**Notas novas**
- [[decisoes/PENDENCIAS]]: índice das decisões pendentes DEC-02 (testes), DEC-03 (autenticação), DEC-04 (migrations e acesso ao banco) e DATA-DEC-001 a 023 do relatório do Analista de Dados (`docs/data/DATA-ARCHITECTURE-REPORT.md`), com o que cada uma bloqueia e as notas afetadas.
- [[features/FOUNDATION-001]]: registro da primeira feature (contrato READY, não implementada; `/backend` não existe).
- [[features/FLUXO-DE-ENTREGA]]: fluxo Arquiteto → Analista de Dados → Desenvolvedor → Organizador → QA → Arquiteto, com entradas, saídas e sinais de parada.
- [[tecnico/LEGADO-ATUAL]]: descrição factual e não normativa do app em uso (frontend Vite + React gravando direto no Supabase, só RLS, Edge Functions de convite).
- [[tecnico/DIVERGENCIAS-LEGADO]]: divergências D1–D3 da FOUNDATION-001 e seção 9 do relatório de dados.
- [[seguranca/RISCOS-DO-LEGADO]]: achados S1–S11 com a severidade do relatório; leitura estática, não testados contra o banco.
- [[produto/CONCEITOS-DO-CANVAS]]: Culto, Agenda, Cronograma, Reunião, Comissão, "ADMIN (ANCIÃO)" e "Líder de Ministério", citados no [[Fluxograma.canvas]] sem definição (A DEFINIR), com transcrição literal do canvas.
- [[MOCs/MOC-GOVERNANCA]]: decisões, pendências, features, agentes e estado atual.

**Notas alteradas** (só acréscimos; nenhuma regra mudou)
- [[00-MOC-MESCALA]]: seções "Estado atual do sistema", "Pendências" e "Features"; links para o MOC de governança, os conceitos do canvas e o canvas.
- MOCs de área ([[MOCs/MOC-ARQUITETURA]], [[MOCs/MOC-DADOS]], [[MOCs/MOC-DOMINIO]], [[MOCs/MOC-ESCALAS]], [[MOCs/MOC-SEGURANCA]], [[MOCs/MOC-USUARIOS]]): seções de estado atual e pendências. O MOC de domínio passa a listar [[modulos/NOTIFICACOES]] e [[modulos/RELATORIOS]], que não estavam em nenhum MOC.
- [[00-README]], [[01-VISAO-GERAL]], [[02-ARQUITETURA]], [[03-DOMINIO]], [[04-USUARIOS-E-PERMISSOES]], [[05-REGRAS-DE-NEGOCIO]]: links para pendências, legado e divergências.
- Módulos, fluxos, dados, segurança e técnico: seções "Pendências" e "Legado" ligadas às decisões e às notas novas.
- [[produto/ROADMAP]] e [[produto/PERSONAS]]: pré-requisitos do ADR-002 e perfis citados no canvas.
- Agentes ([[agents/arquiteto]], [[agents/analista-de-dados]], [[agents/desenvolvedor-backend]], [[agents/organizador]], [[agents/qa]]): seção "Fluxo e estado". Conferidos com `.claude/agents/*.md`: batem com as definições.
- [[agents/vault-brain]]: redação alinhada à definição atual ("antes de alterar o vault", "criar ou atualizar MOCs", "abrir como cofre").
- [[decisoes/ADR-001-ESTRUTURA-INICIAL]], [[decisoes/ADR-002-BACKEND-OFICIAL]] e [[decisoes/DEC-01-ROTA-TECNICA-HEALTH]]: só uma linha de "Relacionados" no fim; conteúdo intacto.
- [[tecnico/CONVENCOES]]: onde ficam pendências, Feature Contracts e a nota do legado.

**Vocabulário:** "Equipe" foi mantido em todas as notas. A divergência com "Ministério" (ADR-002, canvas, Data Task do PO) está sinalizada e aguarda a DATA-DEC-001.

**Anterior no mesmo dia**
- Agente [[agents/qa]] substituído pela versão "QA Backend Sênior": valida em sete dimensões, emite QA RESULT (`APPROVED`, `CHANGES_REQUIRED`, `BLOCKED`) e pode escrever arquivos de teste depois que a biblioteca oficial de testes for decidida (DEC-02).

## 2026-10-04
- Adicionado agente Arquiteto Sênior do Backend ([[agents/arquiteto]]), com definição executável em `.claude/agents/arquiteto-mescala.md`.
- Agente vinculado ao [[00-MOC-MESCALA]] (Governança) e ao [[00-README]].
- Adicionado agente Analista de Dados Sênior ([[agents/analista-de-dados]]), com definição executável em `.claude/agents/analista-dados-mescala.md`. Dono das migrations e das policies de RLS; cria migrations sem aplicá-las.
- Adicionado agente Desenvolvedor Backend Sênior ([[agents/desenvolvedor-backend]]), com definição executável em `.claude/agents/desenvolvedor-backend-mescala.md`. Implementa só a feature contratada; não cria migrations, não faz UI, não publica.
- Registrado [[decisoes/ADR-002-BACKEND-OFICIAL]] (aceito): backend oficial em Next.js + TypeScript + Node.js em `/backend`; Edge Functions deixam de ser arquitetura principal; `FOUNDATION-001` antes de qualquer feature.
- [[tecnico/BACKEND]], [[tecnico/BANCO-DE-DADOS]], [[02-ARQUITETURA]] e [[MOCs/MOC-ARQUITETURA]] passam a apontar para o ADR-002.
- Agentes [[agents/analista-de-dados]] e [[agents/desenvolvedor-backend]] alinhados ao ADR-002.
- Agente [[agents/arquiteto]] recebeu a seção "Arquitetura oficial do backend" (ADR-002 vinculante).
- Adicionado agente Organizador de Arquitetura do Repositório ([[agents/organizador]]), com definição executável em `.claude/agents/organizador-mescala.md`. Organiza só a estrutura física de `/backend`, sem mudar comportamento.
- Adicionado agente QA e Validação Arquitetural ([[agents/qa]]), com definição executável em `.claude/agents/qa-mescala.md`. Somente leitura; fecha o fluxo Arquiteto → Analista → Desenvolvedor → Organizador → QA.
- Registrada [[decisoes/DEC-01-ROTA-TECNICA-HEALTH]] (aceita): `GET /api/health` como exceção técnica controlada da FOUNDATION-001. [[tecnico/API]] continua **A DEFINIR** e passa a citar a exceção.

## 2026-10-02
- Vault reconstruído como grafo conectado.
- Adicionados MOCs.
- Adicionados wikilinks entre módulos, fluxos, regras, dados, segurança e técnico.
- Adicionado frontmatter estrutural.
- Atualizado agente `/vault-brain` para exigir conexões nativas do Obsidian.

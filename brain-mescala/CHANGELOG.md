# Changelog

## 2026-10-20
Sincronização da Brain com o encerramento da FOUNDATION-001 (commit `7f26d30`) e com o contrato da AUTH-001, que aguarda aprovação do PO (agente [[agents/vault-brain]]). As duas ARCHITECT REVIEW da FOUNDATION-001 não foram gravadas em arquivo: esta entrada e a nota [[features/FOUNDATION-001]] são o registro permanente delas. **Nada da AUTH-001 foi aprovado:** não há ADR-003, e DEC-02, DEC-03, DEC-04 e as DATA-DEC continuam abertas.

**Nota nova**
- [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]]: interpretação formal ARQ-FOUND-02, aceita em 2026-10-19. A lista de dependências proibidas vale para o que o `backend/package.json` declara ou força via `overrides` e para o uso explícito pelo Mescala; transitivo trazido só por pacote aprovado não é violação, mas também não é aprovação. Inclui o risco aceito RT-FOUND-02 (dependência fantasma). Recebeu o número 08 porque DEC-05 a DEC-07 estão reservadas pela AUTH-001.

**FOUNDATION-001 encerrada**
- [[features/FOUNDATION-001]]: de "READY, não implementada" para **implementada e encerrada** (ARCHITECT REVIEW APPROVED em 2026-10-19, na rodada de correção 1; commit `7f26d30`, com 8 arquivos). O QA passou de "previsto" para "realizado"; B1–B3 automatizados seguem NOT TESTED até a DEC-02.
- A nota registra o histórico do fluxo (rodada 0 CHANGES_REQUIRED com C1 e C2; PO inclui o L-03; correção em 2 arquivos; revalidação R1–R6; rodada 1 APPROVED), o que foi entregue, D-01 a D-03, RT-FOUND-01 a 03, L-01 a L-06 (L-03 encerrado), O-01, ARQ-FOUND-01 e 02 e a verificação mínima de regressão do lint.

**Pendências** ([[decisoes/PENDENCIAS]])
- Ordem do ADR-002: cumprida quanto à FOUNDATION-001. A fundação de persistência continua dependendo da DEC-04 e das decisões de dados.
- Nova seção da AUTH-001: contrato emitido em 2026-10-06, BLOCKED e aguardando aprovação do PO. Propostas com número reservado e nada decidido: DEC-05 (projeto Supabase oficial), DEC-06 (provisionamento do usuário do Mescala) e DEC-07 (padrão HTTP de erros e convenções de API).
- Em "Outras pendências registradas": a dívida RT-FOUND-01 e o limite L-06, com as condições, e a observação sobre `supabase/.temp/` versionado, para o PO decidir.
- DEC-02 e DEC-03 ganharam só referências cruzadas (AUTH-001; a verificação do lint como futuro B3). As três decisões técnicas continuam abertas.

**Correção de versionamento (divergência D5, apontada na análise da AUTH-001)**
- [[tecnico/LEGADO-ATUAL]], [[decisoes/PENDENCIAS]], [[tecnico/DIVERGENCIAS-LEGADO]] e [[tecnico/BANCO-DE-DADOS]] diziam que as 3 migrations de julho, `aceitar-convite-cadastro`, `src/lib/profiles.ts`, `brain-mescala/`, `docs/`, `.claude/` e `daily/` estavam fora do git. O commit `0394893` (2026-10-06 20:13) já os tinha versionado. Hoje só `docs/features/AUTH-001.md` está fora do git, além do que o `.gitignore` ignora.
- [[tecnico/DIVERGENCIAS-LEGADO]]: nova seção com D4 (projeto Supabase: `.env` e CLI × `config.toml`) e D5.

**Notas que diziam "não implementada", "`/backend` não existe" ou equivalente** (atualizadas para o estado real, com link para a FOUNDATION-001)
- [[00-MOC-MESCALA]], [[MOCs/MOC-GOVERNANCA]], [[02-ARQUITETURA]], [[tecnico/BACKEND]], [[tecnico/API]] (a rota de saúde existe), [[produto/ROADMAP]], [[tecnico/LEGADO-ATUAL]], [[seguranca/RISCOS-DO-LEGADO]], [[agents/desenvolvedor-backend]], [[agents/organizador]], [[agents/arquiteto]] e [[agents/qa]].

**Outras notas alteradas**
- [[features/FLUXO-DE-ENTREGA]]: primeira execução completa do fluxo, com a rodada de correção (sem Organizador, porque nada foi criado nem movido); checagens herdadas da FOUNDATION-001 para toda feature; AUTH-001 na tabela de features.
- MOCs de área: [[MOCs/MOC-ARQUITETURA]] (DEC-08, AUTH-001, DEC-07, RT-FOUND-01, L-06), [[MOCs/MOC-SEGURANCA]] (AUTH-001, DEC-05, cache do CLI), [[MOCs/MOC-USUARIOS]] (DEC-06) e [[MOCs/MOC-DADOS]] (DEC-05).
- [[seguranca/AUTENTICACAO]]: a AUTH-001 como proposta aguardando aprovação; o provider continua **A DEFINIR**.
- [[decisoes/ADR-002-BACKEND-OFICIAL]]: só uma linha de "Relacionados" no fim (DEC-08); conteúdo intacto.

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

# DATA ARCHITECTURE REPORT — Fundação de Persistência do Mescala (Fases 1 a 3)

> Emitido pelo Analista de Dados (`analista-dados-mescala`) em 2026-10-04. Aprovado pelo PO como relatório.
> **Status: DECISÕES ACEITAS PELO PO EM 2026-10-21.** Todos os DATA-DEC-001 a 023 foram aceitos na opção recomendada (seção 14). Registro oficial: `brain-mescala/decisoes/DEC-09-MODELO-DE-DADOS.md`.
> **Micro-decisões respondidas pelo PO em 2026-10-22:**
> - status do convite: PENDENTE, ACEITO, EXPIRADO, CANCELADO (DATA-DEC-011);
> - status de vínculos, ministérios e funções: ATIVO, INATIVO (DATA-DEC-012);
> - **escala nunca é cancelada**: o status CANCELADA sai da máquina de estados da Escala (RASCUNHO, PUBLICADA, CONCLUIDA); a questão DATA-DEC-016 (c) deixa de existir. Onde este relatório cita CANCELADA para Escala, vale esta decisão;
> - só o próprio membro registra impedimento; o líder, se não quiser o membro participando, o exclui (detalhes no contrato da feature de escalas) (DATA-DEC-017);
> - o app legado não tinha uso real: a correção do DATA-DEC-023 não se aplica e não há migração de dados (DATA-DEC-022). O banco oficial começa vazio e a consulta de inventário (seção 1.3) fica dispensada.
> O banco oficial nasce do zero no projeto Supabase novo `vitqnyzuvrvkmnvshcpb` (DEC-05), com migrations em `backend/supabase/migrations/` (DEC-04, parte 1). As 9 migrations legadas de `supabase/migrations/` não rodam nele.
> Nenhuma migration oficial foi criada ainda. A Fase 4 depende do contrato FOUNDATION-002 e de autorização explícita.

## Contexto

Você pediu a fundação oficial de persistência: o modelo de dados que vai representar o domínio da Brain. Nesta rodada as regras são suas:
- entregar inventário, modelo proposto e dúvidas;
- **nenhuma migration** até você responder as decisões e autorizar a Fase 4 explicitamente.

Executei o papel do **Analista de Dados** (`analista-dados-mescala`) diretamente, porque os agentes só carregam quando a sessão reinicia. Tudo aqui foi produzido só com leitura.

**O que li:**
- toda a `brain-mescala`, inclusive o `Fluxograma.canvas`;
- as 9 migrations e o `src/integrations/supabase/types.ts`;
- todo o código em `src/` que acessa o banco;
- as 2 Edge Functions;
- o `README.md` legado, só como referência e não como fonte normativa.

**Como responder:** cada DATA-DEC tem uma recomendação. Para agilizar, você pode responder "aceito as recomendações, exceto: …".

---

## 1. Banco atual

**Origem:** 9 migrations. As 6 de 2026-01 têm nomes em UUID, o padrão do Lovable. As 3 de 2026-07 **não estão no git**, assim como a função `aceitar-convite-cadastro`.

**Drift:** o `types.ts` bate exatamente com o resultado das migrations, então não há drift entre os dois. O estado real do banco remoto **não foi verificado**, porque não tenho acesso a ele. A consulta da seção 1.3 resolve isso.

### 1.1 Tabelas (11)

| Tabela | Conteúdo relevante | Consumidores atuais | Classificação |
|---|---|---|---|
| `profiles` | `user_id`→auth.users (CASCADE), nome_completo, apelido, email, whatsapp, data_nascimento, confirmado | AuthContext, Auth, CadastrarIgreja, EquipePainel, IgrejaDetalhes, LiderPainel; função `aceitar-convite-cadastro` | MIGRAR (DEC-013, DEC-019); `confirmado` DEPRECAR (só modo teste); `data_nascimento` DÚVIDA (sem uso, dado pessoal) |
| `user_roles` | user_id, `role app_role`, igreja_id, equipe_id; UNIQUE(user, role, igreja, equipe) | AceitarConvite e CadastrarIgreja (INSERT); Auth, Dashboard, EquipePainel, IgrejaDetalhes, LiderPainel, MembroPainel (SELECT) | MIGRAR para vínculos por escopo (DEC-005) |
| `igrejas` | nome, endereco, `organizador_id`→auth.users (SET NULL) | CadastrarIgreja (INSERT); Auth, Dashboard, IgrejaDetalhes, AceitarConvite, SelecionarEquipes | MIGRAR (organizador vira vínculo OWNER) |
| `eventos` | nome (padrão 'Culto'), `dia_semana`, `horario`. É um **modelo semanal, sem data e sem fim** | CadastrarIgreja (INSERT), IgrejaDetalhes, MembroPainel (join) | DÚVIDA (DEC-003, DEC-004) |
| `equipes` | nome, `lider_id` (um só), quantidade_por_culto, quantidade_suplentes, dia/horario_formulario_ausencia | SelecionarEquipes (INSERT), AceitarConvite e EquipePainel (UPDATE), demais (SELECT) | MIGRAR (DEC-001); campos de quantidade e formulário DÚVIDA (DEC-013) |
| `convites` | **token em texto puro**, email, tipo, igreja, equipe, convidado_por, status, expires_at | SelecionarEquipes, CadastrarMembros, EquipePainel (INSERT); AceitarConvite (UPDATE); funções de convite | DÚVIDA (DEC-011: convite não existe na Brain) |
| `member_contacts` | membro sem conta por equipe; `user_id` e `created_by` **sem FK**; status em texto (pending/invited/active) | EquipePainel (CRUD), AceitarConvite (UPDATE) | DÚVIDA (DEC-010) |
| `ausencias` | user, equipe, uma data, motivo | **nenhum** | MIGRAR/DÚVIDA (DEC-017) |
| `escalas` | equipe, evento, data_escala, gerada_por; **sem status** | só leitura via join; **nenhuma tela cria escala** | MIGRAR (DEC-022) |
| `escala_membros` | escala, user, `confirmado boolean` (false significa ao mesmo tempo "pendente" e "recusou"); **sem função** | MembroPainel (SELECT/UPDATE) | MIGRAR (DEC-022) |
| `notificacoes` | tipo, título, agendada_para, enviada | **nenhum** | DEPRECAR (Notificações está A DEFINIR na Brain) |

### 1.2 Outros objetos

| Objeto | Situação | Classificação |
|---|---|---|
| Enum `app_role` (organizador, lider, membro) | Não corresponde aos papéis da Brain | DEPRECAR |
| Enum `dia_semana` | Só serve ao modelo semanal | DÚVIDA (DEC-004) |
| Enum `invite_status` (pending, accepted, expired) | — | DÚVIDA (DEC-011) |
| `has_role()` | Definida, **nenhuma policy usa**, sem escopo de igreja | DEPRECAR |
| `user_belongs_to_igreja`, `user_belongs_to_equipe`, `user_is_lider_of_equipe` (SECURITY DEFINER) | Usadas pelo RLS legado | MANTER até o fim do legado |
| `update_updated_at_column()` + 4 triggers | Padrão bom | MANTER (reaproveitar o padrão) |
| 15 índices | `idx_convites_token` é redundante com o UNIQUE | MANTER no legado |
| Views | nenhuma | — |
| Função `enviar-convites` | Service role; usa o `igreja_id` do corpo **sem verificar quem chama** | Fora do banco; ver riscos |

**Cadeia de exclusão:**
- Apagar uma igreja apaga em cascata equipes, eventos, convites, user_roles, escalas, escala_membros e notificações.
- Apagar um usuário em `auth.users` apaga perfil, papéis, ausências e escalações.

Ou seja, **o histórico desaparece**, o que contraria ESC-004 e AUDITORIA.

### 1.3 Dados existentes: desconhecidos

Não assumo banco vazio. Peço que você rode no SQL Editor a consulta abaixo, que **só lê**, e me mande o resultado:

```sql
select 'igrejas' t, count(*) from public.igrejas union all
select 'equipes', count(*) from public.equipes union all
select 'eventos', count(*) from public.eventos union all
select 'profiles', count(*) from public.profiles union all
select 'user_roles', count(*) from public.user_roles union all
select 'convites', count(*) from public.convites union all
select 'member_contacts', count(*) from public.member_contacts union all
select 'ausencias', count(*) from public.ausencias union all
select 'escalas', count(*) from public.escalas union all
select 'escala_membros', count(*) from public.escala_membros union all
select 'notificacoes', count(*) from public.notificacoes union all
select 'auth.users', count(*) from auth.users;

select role, count(*), count(distinct user_id) from public.user_roles group by role;
select tipo, status, count(*) from public.convites group by 1, 2;
select version from supabase_migrations.schema_migrations order by version;  -- confirma se as 3 migrations de julho foram aplicadas
```

---

## 2. Entidades identificadas na Brain

| Entidade | Fonte | O que a Brain determina | Lacunas |
|---|---|---|---|
| **Igreja** | modulos/IGREJAS, ENTIDADES, SEC-001, ADR-001 | Raiz do tenant | Atributos (DEC-013) |
| **Usuário** | ENTIDADES, 04, ADR-001 | "Identidade autenticável"; usuário único; papéis por relacionamento | Provedor (AUTENTICACAO A DEFINIR → DEC-019); atributos |
| **Vínculo Usuário × Igreja** | FLUXO-CADASTRO-IGREJA ("torna-se OWNER no relacionamento com a igreja"), FLUXO-MEMBROS ("papel no escopo da igreja") | Existe e carrega papel | Multiplicidade (DEC-006, DEC-007) |
| **Equipe / Ministério** | EQUIPES, FUNCOES, ENTIDADES; canvas e ADR-002 dizem "ministério" | Pertence à igreja; possui membros e funções | Nome e conceito (DEC-001); arquivamento (DEC-012) |
| **Vínculo Usuário × Equipe** | 04 ("podem existir LEADER e MEMBER por equipe"), FLUXO-MEMBROS, FLUXO-EQUIPES | Um usuário em uma ou mais equipes | Papéis (DEC-005, DEC-008, DEC-009) |
| **Função** | FUNCOES | Posição dentro da equipe (vocal, bateria, recepção…) | — |
| **Habilitação Membro × Função** | ESC-002; FLUXO-MEMBROS passo 4 ("recebe as Funções que pode exercer") | Membro só é escalado em função permitida a ele na equipe; N funções por membro | — |
| **Programação** | PROGRAMACOES, FLUXO-PROGRAMACOES, ADR-001 | Data e **intervalo** de horário; várias equipes | Tipo e culto (DEC-003); recorrência (DEC-004) |
| **Participação Equipe × Programação** | FLUXO-PROGRAMACOES passo 3 ("vincula equipes participantes") | Existe antes da escala | — |
| **Escala** | ESCALAS, RELACIONAMENTOS, FLUXO-PROGRAMACOES passo 4 | Participação de **uma** equipe em uma programação; composta por alocações; não usa colunas fixas por posição | Transições (DEC-016) |
| **Alocação** | ENTIDADES | escala, membro, função, status, confirmação, referência de substituição | DEC-014, DEC-015, DEC-016 |
| **Disponibilidade** | DISPONIBILIDADE, ENTIDADES | "Impedimentos ou disponibilidade… datas ou intervalos"; associada ao membro | Quase tudo (DEC-017) |
| **Registro de auditoria** | seguranca/AUDITORIA | Ator, data e alteração em mudanças críticas | Mecanismo A DEFINIR (DEC-021) |

**Só no canvas, sem campos, regras nem fluxos:** Culto, Agenda, Cronograma, Reunião (com pauta), Comissão (com pauta) e "ADMIN (ANCIÃO)". O canvas não é referenciado por nenhum MOC. Ver DEC-003 e DEC-005.

**A DEFINIR na própria Brain (não serão modelados):** Notificações, Relatórios e o mecanismo de Eventos do sistema.

**Não existem na Brain:**
- Convite (DEC-011);
- Ausência como entidade (DEC-002 e DEC-017);
- Convocação (DEC-002);
- tabela de Permissões (a Brain usa papel + escopo);
- suplentes, quantidade por culto e formulário de ausência (DEC-013).

### 2.1 Respostas às perguntas da sua seção 33

| Pergunta | A Brain responde? | Encaminhamento |
|---|---|---|
| Usuário em mais de uma igreja? | Não | DEC-006 |
| Mais de um OWNER por igreja? | Não | DEC-007 |
| ADMIN administra todos os ministérios? | Em parte: FLUXO-EQUIPES (OWNER/ADMIN cria equipes e funções e vincula líderes e membros); canvas (ADMIN cadastra líder e **visualiza** escalas) | É regra de autorização, do Arquiteto. **Não bloqueia o schema** |
| Mais de um LEADER por ministério? | Não | DEC-008 |
| MEMBER com várias funções no mesmo ministério? | **Sim** (FLUXO-MEMBROS passo 4; ESC-002) | Modelado como N:N (habilitações) |
| Membro sem usuário autenticado? | A Brain diz "Membros **são usuários**". O legado contradiz | DEC-010 |
| Convite cria usuário ou vínculo? | Não (convite não existe na Brain) | DEC-011 |
| Ministério pode ser arquivado? | Não | DEC-012 |
| Sair do ministério sem perder histórico? | Em parte: ESC-004 e AUDITORIA exigem histórico | DEC-012 |
| Escala cancelada é apagada? | **Não**: CANCELADA é um status (dados/STATUS) | Modelado como status; apagar rascunho fica no DEC-016 |
| Eventos recorrentes existem? | Não | DEC-004 |
| Disponibilidade por igreja ou ministério? | Não | DEC-017 |
| Papéis diferentes no mesmo ministério? | Não | DEC-009 |

---

## 3. Relacionamentos (Brain)

```text
Igreja (tenant)
 ├─ Vínculo Usuário×Igreja (papel no escopo da igreja) ── Usuário (identidade única, global)
 ├─ Equipe/Ministério
 │   ├─ Vínculo Usuário×Equipe (papel na equipe) ── exige vínculo com a mesma igreja
 │   │   └─ Habilitações (N funções)
 │   └─ Funções
 └─ Programação (data + intervalo)
     └─ Participação de equipes (N)
         └─ Escala (1 por equipe participante)
             └─ Alocações (membro da equipe + função da equipe + status)
                 └─ referência de substituição (histórico)
Disponibilidade ── associada ao membro (escopo: DEC-017)
```

| Relação | Cardinalidade | Fonte |
|---|---|---|
| Igreja → Equipes, Programações | 1:N | EQUIPES, PROGRAMACOES |
| Usuário ↔ Igreja | N:N ou 1:N | DEC-006 |
| Usuário ↔ Equipe | N:N (uma ou mais equipes) | MEMBROS, FLUXO-MEMBROS |
| Equipe → Funções | 1:N | FUNCOES |
| Vínculo de equipe ↔ Funções | N:N | FLUXO-MEMBROS passo 4 |
| Programação ↔ Equipes | N:N | PROGRAMACOES |
| (Programação, Equipe) → Escala | 1:1 ("pode gerar **uma** escala") | FLUXO-PROGRAMACOES passo 4 |
| Escala → Alocações | 1:N | ESCALAS |

---

## 4. Enums e status

| Entidade | Campo | Valores | Transições conhecidas | Fonte |
|---|---|---|---|---|
| Escala | status | RASCUNHO, PUBLICADA, CONCLUIDA, CANCELADA | RASCUNHO→PUBLICADA (FLUXO-ESCALAS passo 5). As demais **a validar** | dados/STATUS |
| Alocação | status | AGUARDANDO_CONFIRMACAO, CONFIRMADA, RECUSADA, SUBSTITUICAO_PENDENTE, SUBSTITUIDA | AGUARDANDO→CONFIRMADA ou RECUSADA (FLUXO-CONFIRMACAO); recusa→substituição (FLUXO-SUBSTITUICAO); a original fica SUBSTITUIDA (ESC-004). Estado durante o rascunho: **indefinido** | dados/STATUS |
| Vínculo com a igreja | papel | OWNER, ADMIN, LEADER, MEMBER | — | 04 (camadas: DEC-005) |
| Vínculo com a equipe | papel | LEADER, MEMBER ("podem existir") | — | 04 |
| Vínculos, Ministério, Função | status | **não definidos** | — | DEC-012 |
| Convite | status | **não definidos** (legado: pending, accepted, expired) | — | DEC-011 |
| Disponibilidade | tipo | **não definidos** | — | DEC-017 |

**Representação proposta (decisão técnica, não de domínio):**
- usar `text` com `CHECK` em vez de enum nativo do Postgres;
- motivo: a Brain declara as transições "a validar", e um enum nativo não permite remover nem renomear valores sem recriar o tipo;
- os valores ficam **exatamente** como na Brain (MAIÚSCULAS);
- nenhum enum legado é reaproveitado.

---

## 5. Regras estruturais (garantidas pelo banco)

| # | Regra | Mecanismo | Fonte |
|---|---|---|---|
| E1 | Nada de uma igreja pode se ligar a outra | `church_id` em toda tabela do tenant + **FKs compostas** `(church_id, pai_id)` → `pai(church_id, id)` | SEC-001 |
| E2 | Vínculo com a equipe exige vínculo com a mesma igreja | FK `(church_id, user_id)` → vínculo da igreja | FLUXO-MEMBROS passos 1→3 |
| E3 | A habilitação liga um vínculo e uma função **da mesma equipe** | FKs compostas com `ministry_id` | ESC-002, FUNCOES |
| E4 | Escala só para equipe participante, uma por equipe | FK → participação; UNIQUE(programação, equipe) | FLUXO-PROGRAMACOES |
| E5 | Alocação: membro e função da equipe da escala | FKs compostas `(ministry_id, …)` | ESC-002 (parte estrutural) |
| E6 | Programação: fim depois do início | `CHECK (ends_at > starts_at)` | FLUXO-PROGRAMACOES passo 2 |
| E7 | Status e papéis válidos | `CHECK` | dados/STATUS, 04 |
| E8 | Histórico não some por cascata | `ON DELETE RESTRICT` em toda FK com histórico; **nenhum CASCADE** no modelo oficial | ESC-004, AUDITORIA |

**Fica no backend, porque não é estrutural:**
- **ESC-001 (conflito de horário):** a Brain não define o que são alocações "incompatíveis".
- **ESC-002 (habilitação no momento da escalação):** a checagem depende do momento; uma FK rígida impediria revogar uma função de quem já tem histórico.
- **Transições de status.**

**Observação para o Desenvolvedor:** o ESC-001 precisa de transação com trava por pessoa, para evitar corrida entre dois líderes escalando a mesma pessoa ao mesmo tempo.

---

## 6. Multi-tenancy

- `church_id NOT NULL` em todas as tabelas do tenant, mesmo quando daria para derivar por join. Ele serve para:
  - escopo explícito nas consultas (`WHERE church_id = :ctx AND id = :id`), o que barra IDOR;
  - predicados de RLS sem join;
  - as FKs compostas da regra E1;
  - índices começando por `church_id`.
- **Tabelas globais, sem `church_id`:** `users`, porque uma pessoa pode estar em mais de uma igreja (DEC-006), e `churches`, a raiz.
- **IDs:** UUID (`gen_random_uuid()`), seguindo a convenção atual e o tipo do `auth.users`. A aleatoriedade dificulta enumeração, mas **não substitui autorização**. Não há motivo para mudar a estratégia.

---

## 7. Autorização relacionada ao banco

- Papel é **sempre do vínculo**: do vínculo com a igreja ou com o ministério. Não existe `users.role` global.
- Não há tabela de permissões. As permissões derivam de papel + escopo, no backend (04, AUTORIZACAO).
- "ANCIÃO" do canvas é **cargo**, não papel. Nenhuma autorização se baseia nele (DEC-005).
- **Regras de autorização ainda abertas, a fechar com o Arquiteto** (não bloqueiam o schema):
  - ADMIN gerencia todos os ministérios?
  - O que o LEADER pode fazer fora da escala?
  - Quem cria programações? O canvas diz que ADMIN e LEADER administram "agenda e cronograma de cultos".
- O RLS do modelo oficial depende do DEC-020.

---

## 8. RLS atual: achados de segurança (leitura estática das migrations)

| # | Severidade | Achado |
|---|---|---|
| S1 | **CRÍTICA** | **Qualquer pessoa assume a liderança de qualquer equipe.** Ver a cadeia logo abaixo da tabela |
| S2 | **CRÍTICA** | **Sequestro de convites de terceiros.** O usuário pode trocar o próprio `profiles.email` para qualquer valor (UPDATE sem restrição de coluna), e as policies de convite usam esse email como prova de identidade. Com isso ele lê os convites da vítima, cria o papel e reivindica a liderança |
| S3 | **CRÍTICA** | "View convite by token for registration" (`TO anon`, `status = 'pending'`) deixa **qualquer anônimo listar todos os convites pendentes com token e email**. Com token e email, `aceitar-convite-cadastro` cria uma conta já confirmada no email do convidado |
| S4 | ALTA | "Public can view igreja/equipe nome" (`USING (true)`) torna **todas as colunas** de todas as igrejas e equipes legíveis por anônimos: endereço, `organizador_id`, `lider_id` e os IDs que alimentam o S1 |
| S5 | ALTA | "Lideres can update their equipe" não tem WITH CHECK por coluna. O líder pode mudar o `igreja_id` e mover a equipe para outra igreja |
| S6 | ALTA | "Organizadores can manage roles" não valida se a equipe é da igreja. Um organizador se vincula a uma equipe alheia e passa a ler as escalas e escalações dela |
| S7 | MÉDIA | "Accept own convite" consulta `auth.users`, que o papel `authenticated` normalmente não pode ler. Provavelmente **toda atualização de convite feita pelo cliente falha**: convites aceitos ficariam `pending` (status não confiável) e a janela do S1/S2 continua aberta |
| S8 | MÉDIA | `enviar-convites` reenvia emails de convites pendentes de qualquer igreja para quem chamar (a chave pública está no frontend) |
| S9 | MÉDIA | "Members can update their confirmation" não restringe colunas. O membro pode trocar o `escala_id` da própria linha |
| S10 | MÉDIA | Políticas de escalas e escala_membros não validam evento da mesma igreja nem membro da equipe |
| S11 | BAIXA | Não há policy de UPDATE em `member_contacts` para o membro: o vínculo no aceite falha em silêncio. `profiles` só é legível pelo próprio dono, então as listas de perfis de outros usuários nas telas voltam vazias |

**Cadeia do S1:**
1. A pessoa cria uma conta e uma igreja. Isso é permitido para qualquer usuário autenticado.
2. Cria um convite tipo `lider` com a **própria** `igreja_id` e o `equipe_id` de uma equipe alheia. A policy de INSERT só valida a `igreja_id`.
3. A policy "Users can claim lider via pending invite" permite então `UPDATE equipes SET lider_id = self`.
4. Os IDs das equipes estão públicos (veja S4).

**Resultado:** controle total da equipe, das escalas e dos contatos dos membros (nome, email, WhatsApp), em qualquer igreja.

**Observação:** S1 a S3 vêm da leitura das policies e não foram testados contra o banco. Ver DEC-023.

---

## 9. Divergências Brain × banco atual

| Tema | Brain | Banco atual |
|---|---|---|
| Papéis | OWNER, ADMIN, LEADER, MEMBER por escopo | `app_role` organizador/lider/membro, com **três fontes de verdade**: `user_roles`, `igrejas.organizador_id` e `equipes.lider_id` |
| Nomes | Igreja, Equipe, `church_id` (contratos) | `igrejas`, `equipes`, `igreja_id` |
| Líder da equipe | Papel no vínculo | `lider_id` único na equipe |
| Funções | Entidade da equipe + habilitação | **Inexistentes**: ESC-002 é impossível hoje |
| Programação | Data + intervalo; várias equipes | `eventos` semanal, sem data e sem fim: ESC-001 é impossível |
| Participação da equipe | Explícita | Inexistente |
| Status da escala | 4 estados | Inexistente |
| Alocação | Membro + função + 5 estados | `escala_membros` sem função; `confirmado` booleano ambíguo |
| Substituição com histórico | ESC-004 | Inexistente |
| Disponibilidade | Datas **ou intervalos** | `ausencias`: uma data, por equipe |
| Membro | "São usuários" | `member_contacts`: membro sem conta |
| Convite | Ausente | Existe |
| Auditoria | Obrigatória para mudanças críticas | Inexistente |
| Isolamento (SEC-001) | Obrigatório | Violado (seção 8) |
| Histórico | Preservado | CASCADE em quase todas as FKs |
| Integridade entre igrejas | Obrigatória | Nenhuma FK composta |
| FKs | — | `member_contacts.user_id` e `created_by` sem FK |
| Versionamento | Schema = migrations | 3 migrations + 1 função fora do git |

---

## 10. Estruturas que podem ser mantidas

- **Convenções:**
  - PK `id uuid default gen_random_uuid()`;
  - `created_at` e `updated_at` como `timestamptz`, com trigger de `updated_at`;
  - nomes em snake_case;
  - RLS habilitado em toda tabela;
  - formato de nome de migration do Supabase CLI.
- **Tabelas legadas:** ficam **intactas** enquanto o frontend Vite as usar (DEC-022).
- **Conceitos com correspondência:**
  - igrejas → Igreja;
  - equipes → Equipe/Ministério;
  - profiles → atributos do Usuário;
  - escalas → Escala (parcial);
  - ausencias → Disponibilidade (parcial).

## 11. Estruturas que precisam ser migradas (dados)

| Origem legada | Destino oficial | Observação |
|---|---|---|
| `igrejas` | `churches` + vínculo **OWNER** a partir de `organizador_id` | — |
| `profiles` + `auth.users` | `users` | DEC-019 |
| `user_roles` (organizador, lider, membro) + `equipes.lider_id` | Vínculos com a igreja e com o ministério | DEC-005 |
| `equipes` | `ministries` | DEC-001; campos de quantidade e formulário: DEC-013 |
| `eventos` | Não migra direto (é modelo semanal, não ocorrência) | DEC-004 |
| `escalas`, `escala_membros` | Escalas e alocações | **Sem função no legado**. Provavelmente vazias (DEC-022) |
| `ausencias` | Disponibilidade | DEC-017 |
| `convites` | Convites oficiais, com tokens reemitidos (só o hash é guardado) | DEC-011 |
| `member_contacts` | — | DEC-010 |

## 12. Estruturas legadas (DEPRECAR ou REMOVER FUTURAMENTE)

**Candidatos:**
- `app_role` e `has_role`;
- `notificacoes`;
- `profiles.confirmado`;
- os campos de quantidade e de formulário de ausência em `equipes`;
- `dia_semana` (DEC-004);
- as funções `user_*` do RLS legado.

**Quando remover:** só depois que o frontend legado estiver migrado para o `/backend` e os dados copiados. Isso exige uma autorização futura própria.

---

## 13. Modelo alvo proposto (Fase 2)

Os nomes são **provisórios**: dependem do DEC-001 e do DEC-018 (recomendação: inglês, com "ministry"). ★ marca o que está bloqueado por decisão.

### 13.1 Diagrama

```text
users (global) ★DEC-019 (ligação com o provedor de autenticação)
  │1:N
church_memberships ──N:1── churches (tenant)
  │  role: OWNER|ADMIN|MEMBER ★DEC-005..007         │1:N
  │                                                  ├── ministries ──1:N── ministry_functions
  │1:N (mesma igreja)                                │       │1:N               │1:N
ministry_memberships ────────────────────────────────┘       │                  │
  │  role: LEADER|MEMBER ★DEC-008/009                        │                  │
  │1:N                                                       │                  │
  ├── ministry_member_functions (habilitações) ──────────────┴──────────────────┘
  │
  │                 programs ──1:N── program_ministries ──1:1── schedules ──1:N── allocations
  │                 (★DEC-003/004)   (participação)            (status ★016)    │ ├─ function_id → ministry_functions
  └──────────────────────────────────────────────── allocations.membership_id ─┘ └─ replaces_allocation_id (★DEC-015)

★ availability (DEC-017) · ★ invitations (DEC-011) · ★ audit_log (DEC-021)
Reunião, Comissão, Cronograma, Pauta: fora da fundação (DEC-003)
```

### 13.2 Tabelas

Todas têm `id uuid PK`, `created_at` e `updated_at` (`timestamptz NOT NULL`) e RLS habilitado. Em todas as FKs: `ON DELETE RESTRICT` e `ON UPDATE NO ACTION`.

| Tabela | Colunas de domínio | Chaves e constraints | Bloqueio |
|---|---|---|---|
| `users` | atributos (DEC-013); ligação com o provedor (`auth_user_id` UNIQUE) | FK para `auth.users` **só se** o provedor for Supabase Auth | ★DEC-013, ★DEC-019 |
| `churches` | `name` (CHECK não vazio); `address` (DEC-013) | — | parcial |
| `church_memberships` | `church_id`, `user_id`, `role`, status (DEC-012) | UNIQUE(church_id, user_id); UNIQUE(church_id, id); índice único parcial de OWNER (se DEC-007=A); índice (user_id), para responder "minhas igrejas" | ★DEC-005..007, ★DEC-012 |
| `ministries` | `church_id`, `name`, status (DEC-012) | UNIQUE(church_id, id); UNIQUE(church_id, lower(name)) (DEC-013) | ★DEC-001 (nome) |
| `ministry_memberships` | `church_id`, `ministry_id`, `user_id`, `role` (LEADER/MEMBER), status | FK (church_id, ministry_id)→ministries; **FK (church_id, user_id)→church_memberships** (E2); UNIQUE(ministry_id, user_id) (DEC-009); UNIQUE(ministry_id, id); índice (church_id, user_id), para "meus ministérios" | ★DEC-005, 008, 009, 012 |
| `ministry_functions` | `church_id`, `ministry_id`, `name`, status | FK composta para ministries; UNIQUE(ministry_id, id); UNIQUE(ministry_id, lower(name)) | ★DEC-012/013 (status e nome) |
| `ministry_member_functions` | `membership_id`, `function_id`, `ministry_id`, `church_id` | PK(membership_id, function_id); FKs (ministry_id, membership_id) e (ministry_id, function_id) (E3) | — |
| `programs` | `church_id`, `name`, `starts_at`, `ends_at` | CHECK(ends_at > starts_at); UNIQUE(church_id, id); índice (church_id, starts_at), para agenda por período | ★DEC-003/004 |
| `program_ministries` | `church_id`, `program_id`, `ministry_id` | PK(program_id, ministry_id); FKs compostas para programs e ministries; índice (ministry_id) | depende do 003 |
| `schedules` | `church_id`, `program_id`, `ministry_id`, `status` | FK (program_id, ministry_id)→program_ministries (E4); **UNIQUE(program_id, ministry_id)**; UNIQUE(ministry_id, id); CHECK(status) | ★DEC-016 |
| `allocations` | `church_id`, `schedule_id`, `ministry_id`, `membership_id`, `function_id`, `status`, `replaces_allocation_id` | FKs (ministry_id, schedule_id), (ministry_id, membership_id) e (ministry_id, function_id) (E5); auto-FK (schedule_id, replaces_allocation_id)→allocations(schedule_id, id); CHECK(status); unicidade (DEC-014); índices (membership_id), para "minhas escalas", e (schedule_id) | ★DEC-014..016 |
| `availability` | a definir | — | ★DEC-017 |
| `invitations` | igreja, ministério opcional, email, papel pretendido, status, expiração, `token_hash` (nunca o token), convidado_por, aceito_por | UNIQUE do convite pendente por (igreja, ministério, lower(email)) | ★DEC-011 |
| `audit_log` | igreja, ator, ação, entidade, id, antes, depois, quando; **só inserção** | índice (church_id, occurred_at) | ★DEC-021 |

### 13.3 RLS alvo

- Toda tabela nasce com RLS habilitado.
- O modelo de policies depende do **DEC-020**.
- Até lá, o estado padrão é **RLS sem policy**, que nega tudo à API pública.

### 13.4 Padrão de nomenclatura proposto (DEC-018)

| Item | Padrão |
|---|---|
| Tabelas | Plural, snake_case |
| PK | `id` |
| FK | `<entidade>_id` (`church_id`, `ministry_id`) |
| Timestamps | `created_at` / `updated_at`; outros `*_at` só com significado de domínio |
| Status e papéis | `text` + CHECK, com valores da Brain em MAIÚSCULAS |
| PK (constraint) | `<tabela>_pkey` |
| FK (constraint) | `<tabela>_<colunas>_fkey` |
| UNIQUE | `<tabela>_<colunas>_key` |
| CHECK | `<tabela>_<regra>_check` |
| Índices | `<tabela>_<colunas>_idx` |
| Migrations | `supabase/migrations/<YYYYMMDDHHMMSS>_<objetivo>.sql`, uma por objetivo |

---

## 14. DATA DECISIONS REQUIRED (Fase 3)

> As partes afetadas **param** até haver decisão. Nenhuma resposta foi inventada.

### Bloco A — Vocabulário e escopo do domínio

**DATA-DEC-001 — Equipe × Ministério**
- **Contexto:** as notas da Brain dizem "Equipe". O ADR-002 (`ministry`), o canvas ("Líder de Ministério") e este Data Task dizem "Ministério". O legado usa `equipes`.
- **O que a Brain determina:** pertence à igreja; tem membros, funções e uma escala por programação.
- **Indefinido:** se é o mesmo conceito ou se o Ministério contém Equipes.
- **A)** Mesmo conceito, com nome canônico **Ministério** (`ministries`). Impacto: alinha ADR-002, canvas e Data Task; as notas da Brain trocam "Equipe" por "Ministério".
- **B)** Mesmo conceito, com nome canônico **Equipe** (`teams`). Impacto: alinha notas e legado; ADR-002 e canvas precisam de ajuste.
- **C)** Conceitos distintos (Ministério 1:N Equipe). Impacto: uma nova camada de entidades, vínculos e papéis que a Brain não descreve.
- **Recomendação:** A.
- **Decisão do PO:** A, B ou C.

**DATA-DEC-002 — Mapeamento dos termos deste Data Task**
- **Contexto:** o Data Task cita Convocações, Confirmações, Ausências, Permissões e Funções ministeriais. A Brain não usa esses termos como entidades.
- **A)** Confirmar os mapeamentos:
  - Convocação = Alocação;
  - Confirmação = status da Alocação;
  - Ausência = impedimento da Disponibilidade;
  - Permissões = papel + escopo, sem tabela;
  - Funções ministeriais = Funções.

  Impacto: nenhuma entidade extra.
- **B)** Algum desses termos é uma entidade própria. Impacto: você precisa descrevê-la (campos e regras) antes da modelagem.
- **Recomendação:** A.
- **Decisão do PO:** A, ou dizer qual termo é entidade própria.

**DATA-DEC-003 — Programação × Culto × Reunião × Comissão × Agenda × Cronograma**
- **Contexto:** o canvas descreve Culto (recebe escala e cronograma), Agenda (recebe cultos e reuniões), Reunião (membros, líderes, ancião, pauta), Comissão (líderes, pauta) e Cronograma. O ADR-002 lista os domínios worship-service, meeting e commission.
- **O que a Brain determina:** só Programação tem definição operacional.
- **Indefinido:**
  - se Culto é um tipo de Programação;
  - o que é Cronograma (ordem do culto? calendário?);
  - se Reunião e Comissão entram agora.
- **A)** Modelar só **Programação** agora:
  - Culto = programação comum;
  - Agenda = consulta, sem tabela;
  - Reunião, Comissão, Cronograma e Pauta ficam fora até a Brain documentá-los.

  Impacto: uma fundação totalmente fundamentada; os outros conceitos chegam em migrations próprias.
- **B)** Programação com um campo **tipo** (por exemplo CULTO e REUNIAO) desde já. Impacto: você precisa listar os tipos; Reunião continua sem pauta e sem participantes modelados.
- **C)** Entidades separadas (cultos, reuniões, comissões) agora. Impacto: exige campos e regras que a Brain não tem.
- **Recomendação:** A.
- **Decisão do PO:** A, B (com a lista de tipos) ou C (com documentação).

**DATA-DEC-004 — Programações recorrentes**
- **Contexto:** o legado `eventos` guarda cultos semanais (dia + hora), sem data e sem fim. O ESC-001 exige intervalos reais.
- **O que a Brain determina:** "data e intervalo de horário". Não menciona recorrência.
- **A)** Programação = ocorrência datada (`starts_at`, `ends_at`), sem recorrência nesta fundação. Impacto: `eventos` não migra para programações; vira insumo de uma futura feature de recorrência, ou é descartado.
- **B)** Ocorrência datada + uma entidade "série" com regra de recorrência. Impacto: exige regras (semanal? mensal? exceções?) que a Brain não tem.
- **Recomendação:** A.
- **Decisão do PO:** A ou B (com as regras).

### Bloco B — Identidade, papéis e vínculos

**DATA-DEC-005 — Papéis em cada camada**
- **Contexto:**
  - a nota 04 lista OWNER, ADMIN, LEADER e MEMBER como "papéis da igreja" e diz que "podem existir" LEADER e MEMBER por equipe;
  - o FLUXO-MEMBROS diz "papel no escopo da igreja" e permite vincular a equipes;
  - o canvas mostra "ADMIN (ANCIÃO)" e OWNER com "acesso livre a tudo".
- **Indefinido:**
  - se LEADER e MEMBER existem nos dois níveis;
  - se OWNER inclui ADMIN;
  - o que significa "ANCIÃO".
- **A)**
  - Igreja: OWNER, ADMIN, MEMBER (todo vinculado é ao menos MEMBER).
  - Ministério: LEADER, MEMBER.
  - "Líder" na igreja é **derivado** (lidera ao menos um ministério).
  - OWNER inclui ADMIN.
  - ANCIÃO é cargo, sem tabela e sem efeito de autorização.

  Impacto: sem redundância.
- **B)** Literal da nota 04: igreja com os 4 papéis + ministério com LEADER/MEMBER. Impacto: duas fontes para "liderança" e uma regra de consistência a definir (LEADER na igreja sem ministério?).
- **Recomendação:** A.
- **Decisão do PO:** A ou B; confirmar OWNER ⊇ ADMIN; confirmar ANCIÃO como cargo.

**DATA-DEC-006 — Usuário em mais de uma igreja**
- **O que a Brain determina:** nada.
- **A)** N igrejas, com UNIQUE(church_id, user_id). Impacto: o backend precisa de "igreja atual" no contexto de cada requisição.
- **B)** 1 igreja, com UNIQUE(user_id). Impacto: trava a evolução; a migration falha se já houver alguém em duas igrejas.
- **Recomendação:** A (é o que o seu item 9 pede: não travar a evolução).
- **Decisão do PO:** A ou B.

**DATA-DEC-007 — Quantidade de OWNER por igreja**
- **O que a Brain determina:** o criador torna-se OWNER; a persona "Master / Owner" aparece no singular.
- **A)** Exatamente 1 (índice único parcial). Impacto: trocar de dono exige uma feature de transferência.
- **B)** Vários. Impacto: precisa da regra "o último OWNER não pode sair".
- **Recomendação:** A.
- **Decisão do PO:** A ou B.

**DATA-DEC-008 — Quantidade de LEADER por ministério**
- **Contexto:** o legado tem `lider_id` único. A Brain não diz nada.
- **A)** Vários líderes por ministério. Impacto: sem índice; co-liderança suportada.
- **B)** Um único líder (índice único parcial). Impacto: replica o legado; um co-líder depois exige migration.
- **Recomendação:** A.
- **Decisão do PO:** A ou B.

**DATA-DEC-009 — Papel único por usuário em cada ministério**
- **A)** Um vínculo por (ministério, usuário), com um papel. Um líder que também serve recebe funções no mesmo vínculo. Impacto: simples; a alocação aponta para um vínculo só.
- **B)** Vários papéis por (ministério, usuário). Impacto: vínculos duplicados; ambiguidade na alocação.
- **Recomendação:** A.
- **Decisão do PO:** A ou B.

**DATA-DEC-010 — Membro sem conta (legado `member_contacts`)**
- **O que a Brain determina:** "Membros são usuários vinculados a uma igreja".
- **Contexto:** no legado, o líder cadastra pessoas sem conta e depois as convida.
- **A)** Só quem tem conta é membro; antes do aceite existe apenas o convite pendente. Impacto: segue a Brain; pessoas sem conta não podem ser escaladas.
- **B)** Entidade "pessoa" com conta opcional. Impacto: muda a Brain; duas entidades de identidade; risco de duplicar a pessoa quando ela cria conta.
- **Recomendação:** A. Se escalar pessoas sem conta for uma necessidade real, B, documentado na Brain antes.
- **Decisão do PO:** A ou B.

**DATA-DEC-011 — Convites**
- **O que a Brain determina:** nada; a Brain não tem convite. O legado faz convite por email com token.
- **A)** Convite oficial com:
  - igreja e ministério (opcional);
  - email e papel pretendido;
  - status (valores a confirmar por você), expiração;
  - quem convidou e quem aceitou;
  - **só o hash do token**;
  - um convite pendente por (igreja, ministério, email).

  O aceite cria os vínculos. A criação de conta é da autenticação. A regra legada "OWNER/ADMIN convida líder; líder convida membro" (confirmada pelo canvas) é registrada na Brain. Impacto: o fluxo de convite precisa ser documentado.
- **B)** Sem convite agora: os vínculos são criados direto, para usuários que já existem. Impacto: não há onboarding de quem não tem conta.
- **Recomendação:** A.
- **Decisão do PO:** A (e os status) ou B.

**DATA-DEC-012 — Inativação, arquivamento e exclusão**
- **O que a Brain determina:** histórico auditável (ESC-004, AUDITORIA); CANCELADA é status. Nada sobre arquivar ou excluir.
- **A)** Nada com histórico é apagado. Igreja, ministério, vínculos e funções ganham **status** (ATIVO/INATIVO, valores a confirmar) e data de término; FKs com RESTRICT. Impacto: um pedido de exclusão pela LGPD vai exigir uma feature de anonimização.
- **B)** Exclusão física com CASCADE controlado. Impacto: perde escalas e auditoria; contraria ESC-004.
- **Recomendação:** A.
- **Decisão do PO:** A ou B.

**DATA-DEC-013 — Atributos e unicidade de nomes**
- **O que a Brain determina:** nenhum atributo.
- **Contexto:** o legado tem:
  - perfil: nome_completo, apelido, email, whatsapp, data_nascimento, confirmado;
  - igreja: nome, endereço;
  - equipe: quantidade_por_culto, quantidade_suplentes, dia e hora do formulário de ausência.
- **A)** Levar só o que tem uso real:
  - pessoa: nome completo, apelido, email, WhatsApp;
  - igreja: nome, endereço;
  - ministério, função e programação: nome.

  Descartar `data_nascimento` (sem uso, dado pessoal), `confirmado` (modo teste) e os campos de quantidade e formulário (não estão na Brain). Nome único por igreja para ministérios e por ministério para funções, sem diferenciar maiúsculas. Impacto: a geração automática de escala do legado (quantidades, suplentes) fica sem suporte até virar regra na Brain.
- **B)** Levar todos os campos legados. Impacto: carrega funcionalidades não documentadas e um dado pessoal sem uso.
- **Recomendação:** A.
- **Decisão do PO:** A ou B; confirmar a unicidade de nomes.

### Bloco C — Escalas

**DATA-DEC-014 — A mesma pessoa mais de uma vez na mesma escala**
- **O que a Brain determina:** o ESC-001 proíbe alocações "incompatíveis" sobrepostas, sem definir o que é compatível.
- **A)** No máximo uma alocação ativa por pessoa por escala (índice único parcial). Impacto: quem toca e canta fica com uma função por escala.
- **B)** Várias funções na mesma escala. Impacto: exige definir combinações compatíveis.
- **Recomendação:** A.
- **Decisão do PO:** A ou B (com a regra).

**DATA-DEC-015 — Modelo de substituição**
- **O que a Brain determina:** "o novo membro assume a alocação operacional; o original permanece no histórico". O status SUBSTITUIDA pertence à alocação.
- **A)** A alocação original vira SUBSTITUIDA, e uma nova alocação aponta para ela (`replaces_allocation_id`, mesma escala). Impacto: histórico na própria tabela; encaixa no status da Brain.
- **B)** A alocação é a vaga; o membro é trocado na linha e o histórico vai para uma tabela de substituições. Impacto: o status SUBSTITUIDA perde sentido.
- **Recomendação:** A.
- **Decisão do PO:** A ou B.

**DATA-DEC-016 — Status e transições**
- **O que a Brain determina:** os valores (STATUS) e "transições a validar".
- **Indefinido:**
  - (a) o estado da alocação enquanto a escala é RASCUNHO: AGUARDANDO_CONFIRMACAO desde já, ou um estado novo;
  - (b) CONCLUIDA é manual ou automática depois da data;
  - (c) cancelar a escala muda o status das alocações;
  - (d) "confirmação" em ENTIDADES é só o status, ou também guarda a data da resposta;
  - (e) uma escala em rascunho pode ser apagada.
- **A)** O banco guarda os valores (CHECK) e o backend valida as transições. Impacto: você responde de (a) a (e).
- **B)** O banco também barra transições inválidas (trigger). Impacto: regra duplicada; exige as transições fechadas agora.
- **Recomendação:** A. Respostas sugeridas, para você confirmar ou corrigir:
  - (a) AGUARDANDO_CONFIRMACAO, com o pedido de resposta enviado só na publicação;
  - (b) manual;
  - (c) sim, para um estado a definir;
  - (d) guardar também a data da resposta;
  - (e) sim, se nunca foi publicada.
- **Decisão do PO:** A ou B; responder de (a) a (e).

**DATA-DEC-017 — Disponibilidade**
- **O que a Brain determina:** "impedimentos ou disponibilidade… datas ou intervalos"; associada ao membro.
- **Indefinido:** o tipo, o escopo, a recorrência e quem registra.
- **A)** Só **impedimentos**, por pessoa **na igreja** (valem para todos os ministérios), com intervalo de início e fim e motivo opcional, registrados pelo próprio membro. Impacto: cobre as ausências do legado e a validação na escalação.
- **B)** Impedimentos e disponibilidades, por ministério, com recorrência. Impacto: exige regras de precedência e de recorrência.
- **Recomendação:** A.
- **Decisão do PO:** A ou B (com as regras); dizer se o líder também pode registrar.

### Bloco D — Infraestrutura de dados

**DATA-DEC-018 — Nomenclatura e idioma**
- **Contexto:** o domínio é em português (inclusive `escala_id` e `membro_id` em ENTIDADES). ADR-002 e contratos usam inglês (`church`, `ministry`, `church_id`). O legado é em português.
- **A)** Identificadores em **inglês** (padrão da seção 13.4), com valores de status e papel **como na Brain** (RASCUNHO, OWNER…). Impacto: alinha com o `/backend` e não colide com as tabelas legadas no mesmo schema.
- **B)** Identificadores em **português**. Impacto: colide com `igrejas`, `equipes` e `escalas` legadas; exige outro schema (DEC-020) ou outros nomes.
- **Recomendação:** A.
- **Decisão do PO:** A ou B.

**DATA-DEC-019 — Identidade × provedor de autenticação** (depende do DEC-03 de autenticação)
- **O que a Brain determina:** autenticação A DEFINIR. O legado liga tudo direto ao `auth.users`.
- **A)** Uma tabela própria `users` como âncora; todas as FKs apontam para ela, mais uma coluna de ligação com o provedor (com FK para `auth.users` se for Supabase Auth). Impacto: só **uma coluna** depende do DEC-03.
- **B)** Usar `auth.users.id` direto em todo o schema. Impacto: acopla tudo ao Supabase Auth, contrariando o ADR-002.
- **Recomendação:** A.
- **Decisão do PO:** A ou B. **Bloqueio parcial** até o DEC-03.

**DATA-DEC-020 — Onde o schema vive e modelo de RLS** (depende do DEC-04 de acesso ao banco)
- **Contexto:** o `public` fica exposto à chave pública do frontend. O seu item 24 pede defesa em profundidade.
- **A)** Schema dedicado (por exemplo `mescala`) **fora da Data API**. O backend conecta direto ao Postgres com um papel **sem BYPASSRLS** e define o contexto (usuário, igreja) em cada transação; as policies usam esse contexto. Impacto: o RLS protege mesmo se o backend errar um filtro; exige que o DEC-04 escolha acesso direto ao Postgres.
- **B)** Tabelas em `public`, backend com service role e RLS sem policies. Impacto: o RLS só protege contra a API pública; não há defesa em profundidade de verdade.
- **C)** Backend com o JWT do usuário via PostgREST e policies com `auth.uid()`. Impacto: exige Supabase Auth e PostgREST; acopla a autorização ao Supabase.
- **Recomendação:** A.
- **Decisão do PO:** A, B ou C. **Bloqueado** até o DEC-04.

**DATA-DEC-021 — Auditoria**
- **O que a Brain determina:** auditar publicação, mudança de alocação, confirmação e recusa, substituição e alteração de permissões. O mecanismo está A DEFINIR (ADR-002).
- **A)** Tabela de auditoria só de inserção, gravada pelo backend na mesma transação da operação. Impacto: as features já nascem auditáveis.
- **B)** Triggers no banco. Impacto: precisam do ator via contexto de sessão (só funciona com o DEC-020 A).
- **C)** Adiar. Impacto: as primeiras features nascem sem rastro.
- **Recomendação:** A.
- **Decisão do PO:** A, B ou C.

**DATA-DEC-022 — Convivência com o legado e migração de dados**
- **A)** O schema oficial é criado **em paralelo**, sem tocar nas tabelas legadas. A cópia de dados acontece em migrations separadas, depois do inventário (seção 1.3). As tabelas legadas viram somente leitura quando o frontend migrar. A remoção só acontece com autorização futura. Impacto: o frontend não quebra; durante a convivência, os dados divergem até a data de corte.
- **B)** Alterar as tabelas legadas no lugar. Impacto: quebra o frontend.
- **Sub-decisão:** o que fazer com escalas e escala_membros legadas, que não têm função:
  - migrar com uma função "Geral" por ministério; ou
  - descartar (provavelmente estão vazias).
- **Recomendação:** A, e descartar se o inventário mostrar as tabelas vazias.
- **Decisão do PO:** A ou B; a sub-decisão.

**DATA-DEC-023 — Correção urgente de segurança no legado (seção 8)**
- **A)** Uma migration pequena e imediata, **separada do redesenho**, que não exige mudar o frontend:
  - convite tipo `lider` só com equipe da própria igreja;
  - claim de líder ou papel por convite só com equipe da igreja do convite;
  - `profiles.email` não editável pelo usuário (ou comparado ao email autenticado);
  - WITH CHECK em `equipes` impedindo a troca de igreja;
  - vínculo criado pelo organizador só com equipe da própria igreja;
  - remover a referência a `auth.users`.

  O S3 e o S4 (leitura anônima de convite, igreja e equipe) precisam de uma função dedicada **e** de uma mudança no frontend, então ficam para uma tarefa própria. Impacto: fecha o S1, o S2, o S5 e o S6.
- **B)** Esperar o redesenho e a migração do frontend. Impacto: as falhas exploráveis continuam abertas o tempo todo.
- **Recomendação:** A, se houver qualquer uso real do app.
- **Decisão do PO:** A ou B.

### Matriz: decisão → o que fica parado

| Tabela ou parte | Bloqueada por |
|---|---|
| `users` | 013, 019 (+DEC-03) |
| Vínculos com igreja e ministério | 005 a 009, 012 |
| `ministries`, `ministry_functions` | 001, 012, 013 |
| `programs`, `program_ministries` | 003, 004 |
| `schedules`, `allocations` | 014, 015, 016 |
| `availability` | 017 |
| `invitations` | 011 |
| `audit_log` | 021 |
| Policies de RLS | 020 (+DEC-04) |
| Nomes de tudo | 001, 018 |
| Migração de dados | 022 + inventário |
| Hotfix do legado | 023 |

---

## 15. Ordem proposta das migrations (Fase 4, só depois das decisões e da sua autorização)

Cada uma terá objetivo único, nenhuma tocará nas tabelas legadas, e todas nascerão com RLS habilitado.

| Ordem | Migration | Observação |
|---|---|---|
| 0 | `security_hotfix_legacy_rls` | Trilha **separada** e urgente (DEC-023) |
| 1 | `create_official_schema` | Se DEC-020 = A: schema, papel de acesso e função de `updated_at` |
| 2 | `create_users` | — |
| 3 | `create_churches` | — |
| 4 | `create_church_memberships` | — |
| 5 | `create_ministries` | — |
| 6 | `create_ministry_memberships` | — |
| 7 | `create_ministry_functions` | Funções + habilitações |
| 8 | `create_programs` | Programações + participação |
| 9 | `create_schedules` | — |
| 10 | `create_allocations` | — |
| 11 | `create_availability` | — |
| 12 | `create_invitations` | — |
| 13 | `create_audit_log` | — |
| 14 | `rls_policies_official_schema` | Conforme DEC-020 |
| 15+ | `migrate_legacy_<entidade>` | Cópia de dados, uma por entidade, sem apagar nada |
| Futuro | Depreciação do legado | Com autorização própria, depois da migração do frontend |

---

## 16. Riscos

| # | Risco |
|---|---|
| 1 | **Falhas de RLS exploráveis hoje** (seção 8), com a chave pública no frontend |
| 2 | Volume de dados reais desconhecido (seção 1.3) |
| 3 | 3 migrations e a função `aceitar-convite-cadastro` fora do git: o "schema = migrations" não está garantido no repositório |
| 4 | O status dos convites legados provavelmente não é confiável (S7) |
| 5 | Durante a convivência, existem duas fontes de verdade (legado e oficial) até a data de corte |
| 6 | O DEC-03 (autenticação) e o DEC-04 (acesso ao banco) estão abertos e afetam a identidade e o RLS |
| 7 | O vocabulário da Brain é inconsistente (notas × canvas × ADR-002): risco de modelar o conceito errado |
| 8 | O ESC-001 depende do backend e de concorrência correta (transação + trava) |
| 9 | Se as tabelas novas forem criadas em `public` com policy permissiva, ficam expostas à API pública |

## 17. Bloqueios

1. **A Fase 4 inteira** espera as suas respostas e a sua autorização explícita (é regra sua).
2. **DEC-03 (autenticação):** bloqueia a ligação `users` ↔ provedor.
3. **DEC-04 (acesso ao banco):** bloqueia o DEC-020 (schema e RLS). O ideal é registrar ambos como ADRs.
4. **Ordem do ADR-002:** a fundação de persistência vem **depois** da FOUNDATION-001, que está READY mas ainda não foi implementada. Implemente-a antes da Fase 4, ou dispense formalmente essa ordem.
5. **Fluxo dos agentes:** a Fase 4 deve ter um Feature Contract do Arquiteto (por exemplo, FOUNDATION-002 — Fundação de persistência) montado a partir das suas respostas. A alternativa é você declarar este Data Task como o contrato.

---

## 18. Próximos passos

1. ~~Salvar este relatório em `docs/data/DATA-ARCHITECTURE-REPORT.md`.~~ Feito em 2026-10-04.
2. **Você** roda a consulta da seção 1.3 (só leitura) e me manda o resultado.
3. **Você** responde os DATA-DECs. Pode responder "aceito as recomendações, exceto …".
4. Registrar as respostas na Brain (`decisoes/`), no padrão do DEC-01, e atualizar as notas afetadas (por exemplo, vocabulário e papéis).
5. Recomendação: commitar as 3 migrations de julho e a função `aceitar-convite-cadastro`.
6. **Nada de migration** até a sua autorização explícita da Fase 4. O DEC-023 tem trilha e autorização próprias.

## 19. Verificação

- **Agora (Fases 1 a 3):** nenhuma alteração no repositório nem no banco. Só leitura e este relatório.
- **Na Fase 4 (futura):**
  - validação estática de cada migration contra as anteriores e contra o `types.ts`;
  - você aplica manualmente, de preferência primeiro num ambiente de teste (branch do Supabase ou projeto separado);
  - depois roda as consultas de checagem:
    - RLS ativo em todas as tabelas novas (`select relname, relrowsecurity from pg_class …`);
    - FKs compostas presentes;
    - testes negativos em SQL: inserir um filho com `church_id` de outra igreja precisa falhar por FK;
    - unicidades e CHECKs disparando com dados inválidos.
- O QA valida a feature completa depois que existir a biblioteca de testes (DEC-02).

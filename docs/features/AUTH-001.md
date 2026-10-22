> **Status: READY (contrato v2, 2026-10-22).** O "ADENDO v2 (2026-10-22)", no fim deste arquivo, substitui as seções que ele lista. O resto continua valendo como na v1, emitida pelo `arquiteto-mescala` em 2026-10-06. Nada foi encaminhado aos executores.
> - Decisões incorporadas:
>   - ADR-003 aceito em 2026-10-21;
>   - DEC-02 (Vitest) decidida em 2026-10-22 e especificada no adendo;
>   - DEC-05 (projeto `vitqnyzuvrvkmnvshcpb`) decidida em 2026-10-21;
>   - DEC-04 parte 1 e DEC-09: nenhuma contradição; o registro da AUTH-002 foi atualizado;
>   - FOUNDATION-001 APPROVED (commit `7f26d30`).
> - O adendo também:
>   - corrige o L-06;
>   - transforma em teste automatizado a verificação mínima de regressão do lint (B3 da FOUNDATION-001);
>   - automatiza o B1 e o B2 da FOUNDATION-001 no nível do módulo.
> - Pendentes, sem bloquear a AUTH-001:
>   - DEC-06 e DEC-07 (AUTH-002 e AUTH-003);
>   - revogação do usuário no domínio (B8, AUTH-003);
>   - condições de operação do ADR-003: chaves assimétricas, TTL do token e confirmação de email no projeto novo.

# AUTH-001: ARCHITECT ANALYSIS (Arquiteto, 2026-10-06)

> Trabalho feito só com leitura. Não criei nem alterei arquivos e não encaminhei nada a outros agentes.
> Destinos sugeridos, depois do aceite do PO:
> - contrato: `docs/features/AUTH-001.md`;
> - ADR proposto: `brain-mescala/decisoes/ADR-003-AUTENTICACAO.md` (gravado pelo vault-brain).

---

## 1. ARCHITECT ANALYSIS

### 1.1 Entendimento da solicitação

O PO pede quatro coisas:
- a fundação de autenticação do backend;
- a escolha do provedor (DEC-03);
- o modelo de sessão e de validação;
- o mecanismo único para que rotas futuras obtenham a identidade autenticada.

Tudo isso sem UI, sem autorização e sem igreja. Ele também pede uma avaliação: o Mescala precisa de um usuário próprio, ligado ao provedor?

A pergunta "quem é o usuário?" mistura duas perguntas diferentes:

1. **Autenticação.** A requisição traz uma credencial válida, emitida pelo provedor oficial? De qual conta do provedor e de qual sessão? Responder isso **não exige banco**.
2. **Identidade no domínio.** Quem é essa pessoa no Mescala (o `users.id`)? Responder isso exige uma tabela própria, que depende de pelo menos seis decisões pendentes e da fundação de persistência.

**Decisão de decomposição:**
- A AUTH-001 cobre só a pergunta 1.
- A pergunta 2 vira AUTH-002 (provisionamento) e AUTH-003 (usuário atual).

Com isso, a AUTH-001 pode começar logo depois da FOUNDATION-001, sem esperar a DEC-04 e as DATA-DECs. Também respeita a ordem do ADR-002 (fundação técnica → fundação de persistência → features com banco) e atende ao pedido do PO: "não assuma auth user = domain user".

### 1.2 Brain consultada

Li tudo, na ordem da definição:
- núcleo: `00-MOC-MESCALA`, `03-DOMINIO`, `05-REGRAS-DE-NEGOCIO`, `04-USUARIOS-E-PERMISSOES`, `01-VISAO-GERAL`, `02-ARQUITETURA`;
- `modulos/*` e `fluxos/*`, com destaque para `FLUXO-CADASTRO-IGREJA` ("Usuário cria ou acessa sua conta"), `FLUXO-MEMBROS` e `MEMBROS`;
- `dados/*`: `ENTIDADES#Usuário` diz "Identidade autenticável. Papéis dependem de vínculos e escopo";
- `seguranca/*`: `AUTENTICACAO` diz "Provider e mecanismo definitivo: **A DEFINIR**" e "Autenticação não substitui Autorização"; também `AUTORIZACAO`, `ISOLAMENTO-DE-DADOS`, `AUDITORIA` e `RISCOS-DO-LEGADO` (S1–S11);
- `tecnico/*`: `BACKEND` ("autenticação, testes… A DEFINIR"), `API` ("A DEFINIR"), `BANCO-DE-DADOS`, `LEGADO-ATUAL`, `DIVERGENCIAS-LEGADO`;
- `decisoes/*`: ADR-001, ADR-002 (vinculante), DEC-01 e `PENDENCIAS` (DEC-02, DEC-03, DEC-04, DATA-DEC-001 a 023);
- `features/FOUNDATION-001`, `features/FLUXO-DE-ENTREGA`, `produto/*` e `agents/*`.

Fora do vault:
- `docs/features/FOUNDATION-001.md`;
- `docs/data/DATA-ARCHITECTURE-REPORT.md`, seções 1, 6, 7, 8, 13, 14, 16 e 17.

### 1.3 Repositório: fatos verificados

| Fato | Evidência |
|---|---|
| `/backend` não existe. A FOUNDATION-001 está READY e não foi implementada | `ls` |
| O legado autentica com Supabase Auth, email e senha, direto do navegador | `src/contexts/AuthContext.tsx` (`signUp`, `signInWithPassword`) |
| A sessão do legado fica no `localStorage`, com renovação automática | `src/integrations/supabase/client.ts` |
| Identidade legada ancorada em `auth.users`: 9 FKs, várias com `ON DELETE CASCADE`; RLS com `auth.uid()` | `supabase/migrations/20260106173853_…sql` |
| `aceitar-convite-cadastro` usa service role, `admin.createUser({ email_confirm: true })` e CORS `*` | `supabase/functions/aceitar-convite-cadastro/index.ts` |
| O app usa as chaves novas do Supabase (`sb_publishable_…`) | `.env` (só o prefixo foi lido) |
| O modo de teste de confirmação de email está **ligado** no app: `VITE_TEST_SKIP_EMAIL_CONFIRM="true"`. A migration e o `daily` indicam que a confirmação de email do Supabase foi desligada para testes | `.env`, `20260712094502_profiles_confirmado_teste.sql`, `daily/2026-07-11.txt` |
| Supabase Auth (GoTrue) v2.192.0 e Postgres 17.6 no projeto ligado ao CLI | `supabase/.temp/*` |
| Não existe código de autenticação no backend oficial. Não há nada a reaproveitar | — |

### 1.4 Divergências encontradas

**ARCHITECTURAL DIVERGENCE D4: qual é o projeto Supabase oficial**
- **O contexto recebido determina:** o projeto Supabase é `fiurvpkieiorngshjric`.
- **O repositório executa:**
  - `supabase/config.toml` aponta para `fiurvpkieiorngshjric`;
  - o `.env` do app (`VITE_SUPABASE_URL` e `VITE_SUPABASE_PROJECT_ID`) e o vínculo do CLI (`supabase/.temp/linked-project.json`, nome "Projeto Mescala") apontam para **`ehbidizpzxhfusfyjgtl`**.
- **Impacto:**
  - o `iss` e o JWKS que o backend vai aceitar dependem do projeto;
  - é nesse projeto que estão os usuários reais que serão preservados;
  - é nele que a consulta de inventário (seção 1.3 do relatório) precisa rodar;
  - um token do projeto errado será rejeitado, o que é correto, mas configurar o projeto errado bloqueia todos os usuários.
- **Recomendação:** o PO confirma o projeto oficial (DEC-05, seção 9).
- **Necessita decisão:** SIM.

**ARCHITECTURAL DIVERGENCE D5: a Brain está desatualizada sobre o versionamento (nota descritiva)**
- **A Brain diz:** as 3 migrations de julho, `aceitar-convite-cadastro`, `src/lib/profiles.ts`, `brain-mescala/`, `docs/`, `.claude/` e `daily/` continuam fora do git "em 2026-10-06" (`tecnico/LEGADO-ATUAL`, `decisoes/PENDENCIAS`).
- **O repositório executa:** o commit `0394893` (2026-10-06 20:13) versionou todos esses arquivos.
- **Impacto:** baixo. A pendência "commitar as migrations de julho" do relatório já foi resolvida.
- **Recomendação:** o vault-brain atualiza as duas notas.
- **Necessita decisão:** NÃO.

**Observação de segurança (baixo risco):**
- `supabase/.temp/` está versionado. Ele contém o project ref, o nome da organização e a URL do pooler com o usuário, sem senha.
- Não é segredo, mas é cache do CLI e não deveria estar no git. Fica para o PO decidir.
- Não li o `auth.txt` da raiz. Ele está fora do git e pode conter credencial. Nada da AUTH-001 o utiliza.

### 1.5 Domínio proprietário

- **Domínio:** `auth`, previsto no ADR-002 (`domains/auth/`).
- **Adaptador do provedor:** `infrastructure/supabase-auth/`. É o único lugar onde o Supabase e a biblioteca de JWT aparecem.
- **Não usar `shared/`:** a identidade autenticada tem significado de negócio ("quem fala com o sistema"). Não é um utilitário.

### 1.6 Análise das estratégias de autenticação

#### O que a decisão precisa resolver

- Quem guarda e verifica credenciais.
- Quem emite e renova sessões.
- Como o backend confirma, em cada requisição, que a credencial é legítima.
- Como isso funciona para web, mobile e Capacitor (ADR-002).
- Como isso fica separado de autorização e de tenant.

#### Opção A: Supabase Auth como provedor de identidade

O Supabase autentica: cadastro, senha, confirmação de email, recuperação, emissão e renovação de sessão. O backend do Mescala só **valida o access token** e aplica domínio, vínculos, papéis e isolamento.

**Benefícios no contexto real:**
- **Usuários reais preservados.** O legado já usa Supabase Auth, e `auth.users` pode ter contas reais (inventário pendente). Com A, o `sub` de cada pessoa continua o mesmo, ninguém redefine senha e a migração `profiles + auth.users → users` (relatório, seção 11) fica 1:1.
- **Backend sem segredo para autenticar.** Com chaves de assinatura assimétricas, o backend verifica a assinatura com a **chave pública** (JWKS). Não guarda segredo que permita emitir token.
- **Backend sem estado.** Sem tabela de sessão, a validação é local e escala horizontalmente sem esforço.
- **Multi-cliente.** Web, mobile e Capacitor usam os SDKs do Supabase para entrar e mandam `Authorization: Bearer` à API Next.js. O backend fica independente do cliente (ADR-002, "Resultado esperado").
- **Autenticação e autorização separadas por construção:** o provedor diz quem é; o Mescala decide o que pode.
- **A AUTH-001 é pequena** (cerca de 5 arquivos) e não depende de banco nem da DEC-04.
- **Testável sem rede:** os testes geram chaves locais e assinam tokens de teste.

**Custos e riscos:**
- **Dependência do fornecedor.** É mitigada porque só um adaptador no backend conhece o Supabase. A exportação de usuários é possível se um dia houver troca.
- **Janela de revogação.** Logout, ban ou exclusão no provedor só valem no backend quando o access token expira (padrão do Supabase: 3600 s).
- **Pool de identidades compartilhado com o legado.** Enquanto o S3 estiver aberto, alguém pode criar uma conta já confirmada no email de outra pessoa. Com a confirmação de email desligada, ninguém prova que é dono do email. Consequência obrigatória: **o email nunca é prova de identidade no backend**.
- **Configuração operacional fica com o PO:** projeto oficial, chaves assimétricas, confirmação de email em produção, SMTP próprio (o `daily` registra o limite de envio de emails).

#### Opção B: autenticação própria no backend Next.js

**Benefícios:**
- controle total;
- nenhum fornecedor de identidade;
- revogação imediata, se a sessão ficar no banco;
- tudo num só banco.

**Responsabilidades que passam a ser nossas:**
- **Senha:** hash com argon2id ou bcrypt e parâmetros calibrados; política de senha; troca de senha.
- **Proteção contra ataques:** força bruta, credential stuffing, bloqueio de conta, rate limit e anti-enumeração ("email não existe" × "senha errada").
- **Cadastro:** confirmação de email com tokens próprios, de uso único, com expiração e guardados só como hash.
- **Recuperação:** fluxo de redefinição de senha, envio de email (hoje só existe o Resend do legado) e proteção contra sequestro do link.
- **Sessão:** escolher entre token opaco no banco e JWT próprio com refresh rotativo; rotação de chave de assinatura; detecção de reuso de refresh token.
- **Clientes:** um modelo para web (cookie, com CSRF) e outro para mobile (token).
- **Operação:** auditoria de eventos de autenticação; MFA e OAuth no futuro; correções de segurança contínuas.

**Custos no contexto real:**
- **Depende de persistência já na fundação** (credenciais, sessões, tokens de redefinição). Fica bloqueada por DEC-04, DATA-DEC-018, DATA-DEC-020 e pela fundação de persistência. A autenticação passaria a esperar tudo isso.
- **Migração dos usuários existentes:**
  - ou copiar os hashes bcrypt de `auth.users.encrypted_password`, uma operação privilegiada e sensível;
  - ou obrigar todos a redefinir a senha.
- **Convivência com o legado:** o frontend Vite autentica no Supabase Auth. Dois sistemas de identidade criariam duas contas para a mesma pessoa até a data de corte.

**Riscos:**
- maior superfície de ataque escrita e mantida por nós;
- autenticação é uma das áreas com mais falhas recorrentes;
- não traz benefício funcional que a Brain exija.

#### Variantes registradas (todas descartadas)

| Variante | Por que não |
|---|---|
| B': biblioteca de autenticação no Next (Auth.js, Better Auth) | Ainda guarda credenciais e sessões no nosso banco. Reduz código, mas mantém o bloqueio por persistência, a migração de senhas e a dupla identidade com o legado. Auth.js é centrado em cookie, o que é ruim para mobile |
| IdP terceiro (Auth0, Clerk, Cognito, Firebase) | Mesmo modelo da A, mas com um segundo fornecedor e migração de todas as contas, sem ganho concreto |
| A com BFF: o backend recebe email e senha e repassa ao Supabase | O backend passaria a manusear senha e refresh token, o que aumenta a superfície. Não é necessário na fase BACKEND ONLY. Um cliente web com cookie pode reabrir esse ponto numa decisão própria |
| Autenticação em `middleware`/`proxy` do Next | A FOUNDATION-001 proíbe middleware. Verificar de forma explícita no handler é mais rastreável e evita classes de falha como o bypass de middleware do Next.js (CVE-2025-29927) |

#### Comparação

| Critério | A: Supabase Auth | B: própria |
|---|---|---|
| Segurança | Credenciais com o provedor; backend sem segredo (JWKS) | Toda a superfície é nossa |
| Simplicidade | AUTH-001 ≈ verificador de JWT | Dezenas de fluxos |
| Manutenção | Configuração + atualização da `jose` | Correções contínuas |
| PostgreSQL/Supabase | Mesmo pool do legado; FK para `auth.users` possível | Exige persistência antes de tudo |
| Next.js | Resource server sem estado, Node | Precisa de banco e email já na fundação |
| Web, mobile, Capacitor | SDKs do provedor + Bearer | Construir para cada cliente |
| Isolamento por igreja | Neutro (fica no domínio) | Neutro |
| Autenticação × autorização | Separação natural | Risco de misturar (papel na sessão) |
| Escalabilidade | Validação local | Sessões em banco |
| Testabilidade | Chaves locais, sem rede | Muitos fluxos a testar |
| Usuários existentes | Preservados | Migrar hashes ou redefinir senhas |
| Revogação | Até o token expirar | Imediata |

#### Sub-decisão: como o backend valida o token (dentro da A)

| Modo | Segredo no backend | Custo por requisição | Revogação | Avaliação |
|---|---|---|---|---|
| **V1: assinatura assimétrica via JWKS público, local** | Nenhum | Local; chaves em cache | Ao expirar | **Recomendado** |
| V2: remota (`GET /auth/v1/user`) | Nenhum | Uma ida e volta ao provedor por requisição, sujeita a limites e indisponibilidade | Detecta usuário removido (e sessão encerrada, a confirmar na versão) | Alternativa caso o projeto não possa usar chaves assimétricas |
| V3: HS256 com o segredo JWT legado | **Sim.** O mesmo segredo **emite** tokens válidos, inclusive `service_role` | Local | Ao expirar | **Descartado.** Vazar esse segredo dá acesso total |

Se o projeto ainda assinar com o segredo legado (HS256), o V1 rejeita todos os tokens (falha fechada) até o PO fazer a rotação no painel. Isso é uma condição do ADR-003.

#### Usuário do provedor × usuário do Mescala

**Recomendação:** sim, uma entidade própria de usuário. É a DATA-DEC-019 opção A, que continua decisão do PO.

Por quê:
- ADR-001: o usuário é único e os papéis vêm de relacionamento.
- ADR-002: as regras ficam desacopladas da infraestrutura.
- Usar `auth.users.id` em todo o schema acopla todas as FKs ao Supabase Auth.
- Com a tabela própria, só uma coluna de ligação depende do provedor.
- A tabela própria também abriga os atributos (DATA-DEC-013) e um eventual status (seção 9, B8).

**Na AUTH-001:**
- nada é persistido;
- o identificador do provedor recebe o nome deliberado **`externalUserId`**;
- fica proibido usá-lo como "id do usuário do Mescala".

#### Sessão (modelo conceitual)

| Aspecto | Definição |
|---|---|
| Criação | O cliente entra direto no Supabase Auth (hoje com email e senha) e recebe um access token (JWT de vida curta) e um refresh token. O backend não cria sessão |
| Onde fica | No cliente, guardada pelo SDK. Clientes futuros: mobile em armazenamento seguro; web em decisão própria (o legado usa `localStorage`, exposto a XSS) |
| Renovação | Entre o cliente e o Supabase, com o refresh token. **O backend nunca recebe refresh token** |
| Envio ao backend | Somente o header `Authorization: Bearer <access_token>`. Não aceita token em query, body nem cookie |
| Validação | A cada requisição, local: assinatura via JWKS e claims |
| Encerramento | O cliente chama `signOut` no provedor. O access token já emitido vale até `exp` |
| Uso pelas features | O handler chama `requireAuthenticatedIdentity(request)` e passa o resultado **explicitamente** ao caso de uso. Sem estado global e sem AsyncLocalStorage |

Fluxo futuro, conceitual (não implementar agora):

```text
Route Handler
  → requireAuthenticatedIdentity(request)      AUTH-001  : externalUserId, sessionId, expiresAt
  → requireCurrentUser(identity)               AUTH-003  : usuário do Mescala (users.id)
  → requireChurchMembership(user, churchId)    CHURCH-002: vínculo + papel na igreja
  → policy do caso de uso                      cada feature: papel + escopo
  → repositório com church_id explícito        SEC-001
```

Só a primeira etapa lê o token. As demais leem o banco do Mescala.

#### Segurança: checklist pedido pelo PO

| Item | Tratamento |
|---|---|
| Validação de sessão | Assinatura (JWKS) + `iss` + `aud` + `role` + `exp` + `sub` + `session_id` |
| Expiração | `exp` obrigatório; tolerância de relógio de 5 s; "expirado" só é informado para token com assinatura válida |
| Token inválido | `AUTH_INVALID_TOKEN`; nenhum detalhe do motivo é exposto |
| Usuário inexistente | No provedor: o token de um usuário apagado vale até `exp` (risco residual aceito no ADR). No domínio: AUTH-003 ("usuário não registrado") |
| Usuário revogado | Ban no provedor: mesmo caso. Revogação imediata no domínio: **A DEFINIR** (bloqueio B8) |
| Exposição de credenciais | O backend não recebe senha nem refresh token. O token, o header e o payload nunca aparecem em log, mensagem ou erro |
| Segredos | Nenhum segredo é necessário. Proibidos no backend: service role, `sb_secret_…` e segredo JWT legado |
| Verificação no servidor | Toda a verificação acontece no backend |
| Dados enviados pelo cliente | O backend ignora `x-user-id`, body, query e cookies. `user_metadata` é editável pelo próprio usuário. `app_metadata` e claims customizados não definem papel. O email não prova identidade (S2/S3) |
| Ataques ao algoritmo | Lista fechada ES256/RS256; `none` e `HS*` rejeitados; `jku`, `x5u` e `jwk` do header nunca são usados; chave só do JWKS configurado |
| Token de outro projeto ou chave de API como JWT | Barrado pelo `iss` e pela chave. `role` ≠ `authenticated` (anon, service_role) é rejeitado |
| Login anônimo do Supabase | Rejeitado (`is_anonymous`) |
| CSRF | Não se aplica a Bearer. Volta a importar se cookies forem adotados |
| Indisponibilidade do provedor | Falha fechada, com erro próprio (`AUTH_VERIFICATION_UNAVAILABLE`) |
| Cadastro público aberto | Uma conta nova recebe token válido, o que é coerente com `FLUXO-CADASTRO-IGREJA` passo 1. Ter token não dá acesso a nada: toda feature de igreja exigirá vínculo |

#### Multi-tenancy

- A AUTH-001 não identifica igreja, e `AuthenticatedIdentity` não tem `churchId`.
- Igreja e papel **nunca** vêm do token: nem de claims customizados, nem de metadata. Vêm do vínculo no banco (ADR-001, `04-USUARIOS-E-PERMISSOES#Princípio`, SEC-001).
- Isso preserva o fluxo Authenticated User → Church Membership → Church Context → Role → Policy sem retrabalho.
- Observação para a DATA-DEC-020: escolher Supabase Auth torna viável a opção C do relatório (JWT do usuário via PostgREST), mas não a obriga. A opção A recomendada pelo relatório funciona com este ADR.

### 1.7 Dependências (da AUTH-001)

- **DEPENDS_ON:**
  - FOUNDATION-001 implementada e aprovada;
  - ADR-003 aceito (DEC-03);
  - DEC-02 decidida.
- **Operação** (não implementação): DEC-05 e chaves assimétricas ativas no projeto oficial.

### 1.8 Riscos e invariantes

**Invariantes**

| # | Invariante |
|---|---|
| I1 | A identidade vem só de um token verificado no servidor |
| I2 | Falha fechada: sem configuração ou sem chave, ninguém é autenticado |
| I3 | `externalUserId` não é o usuário do Mescala |
| I4 | Nenhuma autorização é derivada do token |
| I5 | Nenhum segredo é usado; o token nunca aparece em log nem em erro |
| I6 | Há um único ponto de verificação: `domains/auth` |
| I7 | `/api/health` continua pública e intocada (DEC-01) |

**Riscos**

| # | Risco | Mitigação |
|---|---|---|
| R1 | Janela de revogação igual ao TTL do token | Aceita no ADR; revogação no domínio fica para decisão própria |
| R2 | Pool compartilhado + S3 + confirmação de email desligada: o email não é confiável | Regra do ADR; priorizar a DATA-DEC-023; confirmação de email ligada em produção |
| R3 | Projeto ambíguo (D4) | DEC-05 |
| R4 | Projeto sem chaves assimétricas | Falha fechada até o PO fazer a rotação |
| R5 | JWKS indisponível | Cache da `jose`; erro distinto |
| R6 | Cache do `fetch` do Next.js prendendo o JWKS | Regra no Backend Task |
| R7 | Controles de segurança sem prova automatizada | Exigir a DEC-02 antes de READY |
| R8 | Uso indevido de `externalUserId` como user_id | Nome deliberado + proibição + AUTH-003 |

---

## 2. DECISÃO RECOMENDADA

```text
Provider recomendado:
  Supabase Auth do projeto oficial (Opção A), como provedor externo de identidade.
  O backend Next.js atua como resource server sem estado: valida localmente,
  a cada requisição, o access token (JWT assinado com chave assimétrica,
  verificado pelo JWKS público, com a biblioteca `jose`) e nunca emite nem
  guarda sessão.

Motivo:
  - preserva os usuários reais e o `sub` atuais;
  - o backend não precisa de segredo;
  - não depende de banco (destrava a AUTH-001 antes da DEC-04 e das DATA-DECs);
  - serve web, mobile e Capacitor por Bearer;
  - separa autenticação (provedor) de autorização (Mescala);
  - superfície de segurança mínima;
  - testável com chaves locais.

Alternativas descartadas:
  - B (autenticação própria);
  - B' (Auth.js, Better Auth);
  - IdP terceiro;
  - BFF com senha passando pelo backend;
  - middleware/proxy do Next;
  - validação HS256 com segredo compartilhado;
  - validação remota a cada requisição como padrão
    (fica como alternativa se não houver chaves assimétricas).

Consequências:
  - clientes entram direto no Supabase Auth;
  - o backend lê só o header Authorization;
  - revogação limitada pelo TTL do token;
  - email nunca prova identidade;
  - papéis, vínculos e igreja nunca vêm do token;
  - o usuário do Mescala é uma entidade própria, ligada por `externalUserId`
    (DATA-DEC-019, AUTH-002/003);
  - nova dependência `jose`;
  - nova variável de ambiente pública `SUPABASE_URL`;
  - configuração do projeto (chaves, confirmação de email, SMTP, TTL) fica com o PO.

ADR adicional: SIM. ADR-003 (texto proposto abaixo).
```

### Texto proposto: ADR-003 (para aprovação do PO)

```markdown
---
tipo: adr
status: proposto
data: 2026-10-06
relacionado:
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[seguranca/AUTENTICACAO]]"
  - "[[decisoes/PENDENCIAS]]"
---
# ADR-003 — Autenticação do backend oficial

## Status
**PROPOSTO.** Resolve a DEC-03.

## Contexto
- O ADR-002 permite usar o Supabase para autenticação mediante decisão
  explícita, prevê vários clientes (web, mobile, Capacitor) e exige que o
  isolamento não dependa do cliente.
- [[seguranca/AUTENTICACAO]]: provedor A DEFINIR; autenticação não
  substitui autorização.
- ADR-001: usuário único; papéis por relacionamento.
- O legado já usa Supabase Auth (email e senha), e `auth.users` pode conter
  usuários reais.
- Os riscos S2 e S3 mostram o perigo de tratar email como prova de identidade.

## Decisão
1. **Provedor:** Supabase Auth do projeto oficial (DEC-05). Ele cadastra
   contas, guarda e verifica credenciais, confirma email, recupera senha e
   emite e renova sessões.
2. **Papel do backend:** resource server sem estado. Não recebe senha, não
   emite token, não guarda sessão e não recebe refresh token.
3. **Transporte:** somente `Authorization: Bearer <access_token>`.
4. **Validação:** local, a cada requisição, pela assinatura assimétrica
   verificada com o JWKS público do projeto
   (`<SUPABASE_URL>/auth/v1/.well-known/jwks.json`), com a biblioteca `jose`.
   Algoritmos aceitos: ES256 e RS256. `none` e HS* são rejeitados. A chave
   só vem do JWKS configurado; `jku`, `x5u` e `jwk` do token são ignorados.
5. **Aceitação:** `iss` = `<SUPABASE_URL>/auth/v1`; `aud` contém
   `authenticated`; `role` = `authenticated`; `exp` válido (tolerância de 5 s);
   `sub` UUID; `session_id` presente; `is_anonymous` diferente de `true`.
6. **Identidade:** `sub` é o identificador externo (`externalUserId`). Não
   é o usuário do Mescala. Email e metadata não são prova de identidade.
7. **Autorização fora do token:** papéis, vínculos, igreja e permissões
   nunca vêm do token (nem de `app_metadata`, `user_metadata` ou claims
   customizados). Vêm do banco do Mescala, no backend.
8. **Ponto único:** `domains/auth` expõe a verificação. Os Route Handlers a
   chamam explicitamente. Sem middleware/proxy do Next.
9. **Segredos:** a autenticação não exige segredo no backend. Este ADR não
   autoriza service role, secret key nem o segredo JWT legado no backend.
10. **Revogação:** logout, ban ou exclusão no provedor só têm efeito no
    backend quando o access token expira (TTL configurado no projeto; padrão
    3600 s). Revogação imediata, se necessária, será feita na camada de
    domínio, por decisão própria.
11. **Falha fechada:** sem configuração ou sem JWKS, nenhuma requisição é
    autenticada.

## Condições
- DEC-05 decidida (projeto oficial).
- Projeto com chaves de assinatura assimétricas ativas. Se não for
  possível, este ADR deve ser revisto para validação remota
  (`/auth/v1/user`).
- Em produção: confirmação de email ligada no provedor.

## Alternativas consideradas
- Autenticação própria.
- Biblioteca de autenticação no Next.
- IdP terceiro.
- BFF.
- Middleware.
- HS256 com segredo compartilhado.
- Validação remota como padrão.

Motivos de descarte: ARCHITECT ANALYSIS AUTH-001, seção 1.6.

## Consequências
- **Positivas:** usuários preservados; backend sem segredo e sem estado;
  multi-cliente; autenticação e autorização separadas; troca de provedor
  restrita a um adaptador.
- **Negativas:** dependência do Supabase Auth; janela de revogação;
  configuração operacional no painel do provedor.
- **Obrigatórias:** o usuário do Mescala é entidade própria (DATA-DEC-019);
  nenhuma feature de domínio usa `externalUserId` como id de usuário.

## Fora deste ADR
- Métodos de login (OAuth, magic link, telefone) e MFA.
- Cookie ou BFF para cliente web; CORS.
- Provisionamento do usuário do Mescala (DEC-06).
- Revogação no domínio.
- Padrão HTTP de erros (DEC-07).
- SMTP próprio.
- Uso futuro da Admin API (convites, DATA-DEC-011).
- Modelo de RLS (DATA-DEC-020).

Relacionados: [[decisoes/ADR-001-ESTRUTURA-INICIAL]], [[decisoes/ADR-002-BACKEND-OFICIAL]], [[seguranca/AUTENTICACAO]], [[seguranca/AUTORIZACAO]], [[seguranca/RISCOS-DO-LEGADO]], [[decisoes/PENDENCIAS]].
```

---

## 3. FEATURE CONTRACT: AUTH-001

```text
ID: AUTH-001
DOMÍNIO: auth
NOME: Fundação de Autenticação (verificação da identidade do provedor)
VERSÃO: 1
STATUS: BLOCKED. Passa a READY quando o PO aceitar o ADR-003 (DEC-03) e
        decidir a DEC-02. A implementação só começa depois da
        FOUNDATION-001 aprovada.
```

### 1. Objetivo

Criar no `/backend` o mecanismo único, executado no servidor e sem estado, pelo qual qualquer Route Handler futuro faz duas coisas:
- verifica se a requisição traz um access token válido do Supabase Auth do projeto oficial;
- obtém a **identidade autenticada** (`externalUserId`, `sessionId`, `expiresAt`).

A feature não usa banco, não trata o usuário do Mescala, não trata igreja e não cria rotas. É a base de AUTH-002, AUTH-003 e de toda rota protegida.

### 2. Ator

- **Ator de negócio:** nenhum.
- **Quem apresenta a credencial:** qualquer cliente HTTP com access token do Supabase Auth.
- **Quem consome a feature:** Route Handlers futuros.

### 3. Pré-condições

- FOUNDATION-001 implementada, com ARCHITECT REVIEW APPROVED.
- ADR-003 aceito.
- DEC-02 decidida.
- **Para operar** (não para implementar nem testar):
  - DEC-05 decidida;
  - chaves assimétricas ativas no projeto oficial;
  - `SUPABASE_URL` configurada pelo PO no ambiente.

### 4. Entradas

| Nome | Tipo | Obrigatório | Regra |
|---|---|---|---|
| `request` | `Request` (Web API padrão; não `NextRequest`) | sim | Só o header `Authorization` é lido |
| `Authorization` | header | sim | Formato `<esquema> <token>`. Esquema `Bearer`, sem diferenciar maiúsculas. Um único espaço. Token não vazio e sem espaço nem vírgula interna |
| `SUPABASE_URL` | variável de ambiente (configuração, não entrada da requisição) | sim, para operar | URL `https:` absoluta, sem caminho; barra final removida. Deve ser a origem que aparece no `iss` dos tokens |

Não são lidos: query string, body, cookies e qualquer outro header (`x-user-id`, `apikey` etc.).

### 5. Processamento

1. O handler chama `requireAuthenticatedIdentity(request)`.
2. Ler o header `Authorization`. Se estiver ausente ou vazio: `AUTH_MISSING_CREDENTIAL`.
3. Validar o formato `Bearer <token>`. Se o esquema for outro, faltar o token, houver vírgula ou mais de um token: `AUTH_MALFORMED_CREDENTIAL`.
4. Delegar ao verificador do provedor (infraestrutura):
   - a. carregar a configuração (`SUPABASE_URL` → issuer e URL do JWKS) na primeira chamada. Se for inválida ou faltar: `AUTH_VERIFICATION_UNAVAILABLE`;
   - b. aceitar só `alg` ES256 ou RS256;
   - c. obter a chave pública pelo `kid`, **somente** do JWKS configurado (com cache; renova quando aparece um `kid` desconhecido);
   - d. verificar a assinatura;
   - e. `iss` igual ao issuer configurado;
   - f. `aud` contém `authenticated`;
   - g. `exp` presente e no futuro (tolerância de 5 s); `nbf` validado, se existir;
   - h. `role` igual a `authenticated`;
   - i. `is_anonymous` diferente de `true`;
   - j. `sub` presente e UUID;
   - k. `session_id` presente, string não vazia.
5. Classificar a falha:
   - JWKS inacessível ou inválido, ou timeout: `AUTH_VERIFICATION_UNAVAILABLE`;
   - token com assinatura válida e `exp` vencido: `AUTH_TOKEN_EXPIRED`;
   - qualquer outra falha: `AUTH_INVALID_TOKEN`;
   - nenhum caminho de falha devolve identidade.
6. Montar a `AuthenticatedIdentity` só com `sub`, `session_id` e `exp`. Nenhum outro claim é copiado.
7. Devolver a identidade imutável. O handler a passa por parâmetro ao caso de uso.

### 6. Regras normativas

- **ADR-003** (proposto): itens 1 a 11 e Condições.
- **`ADR-002#Route Handlers`:** o handler "extrai contexto de autenticação" e permanece fino.
- **`ADR-002#Regras de negócio`:** `domains/auth` não depende do Next; usa só tipos Web padrão.
- **`ADR-002#Runtime`:** Node.js.
- **`ADR-002#Supabase`:** uso para autenticação somente com decisão explícita (ADR-003).
- **`ADR-002#Multi-tenancy`:** o isolamento não depende do cliente; a identidade vem só do token verificado.
- **`seguranca/AUTENTICACAO`:** autenticação não substitui autorização.
- **`04-USUARIOS-E-PERMISSOES#Princípio`** e **ADR-001:** papel + escopo, por relacionamento. Nada de papel no token.
- **`dados/ENTIDADES#Usuário`:** "identidade autenticável". A AUTH-001 entrega a prova; o Usuário do domínio fica para AUTH-002/003 (DATA-DEC-019).
- **`fluxos/FLUXO-CADASTRO-IGREJA` passo 1:** a conta é criada no provedor. A AUTH-001 não cria conta.
- **`seguranca/RISCOS-DO-LEGADO#S2`/`#S3`:** o email não é prova de identidade.
- **`05-REGRAS-DE-NEGOCIO#SEC-001`:** preservada por construção (nenhum dado de igreja).
- **`DEC-01`:** `/api/health` continua pública e não usa este mecanismo.

### 7. Entidades envolvidas

- **Nenhuma entidade persistida.**
- **Conceito transitório:** Identidade Autenticada, um valor em memória que vale por requisição.
- `Usuário` (ENTIDADES) **não** é tocado.

### 8. Relacionamentos

- Nenhum é implementado.
- **Conceitual (futuro):** Identidade Autenticada → Usuário do Mescala por `externalUserId`, na proporção 1:1 proposta na DATA-DEC-019 A, ainda pendente.

### 9. Autorização

- A AUTH-001 não autoriza nada; só autentica.
- **Quem passa:** o portador de um access token válido do projeto oficial.
- **Quem não passa:**
  - requisição sem token;
  - token malformado, inválido, expirado ou anônimo;
  - token de chave de API (`anon`, `service_role`);
  - token de outro projeto.
- **Proibido:**
  - derivar papel, igreja ou permissão de qualquer claim (o `role` do JWT é papel do PostgREST, não papel do Mescala);
  - usar email ou metadata como identidade;
  - tratar autenticado como autorizado.

### 10. Multi-tenancy

- Nenhuma igreja é identificada, e a identidade não tem `churchId`.
- **Risco futuro:** uma feature confiar em `church_id` vindo do token ou do cliente. Proibido; o isolamento virá do vínculo (CHURCH-002).
- Um token de outro projeto Supabase é rejeitado pelo `iss` e pela chave.

### 11. Transação

NÃO. Não há escrita.

### 12. Impacto no banco

NÃO. A feature não cria tabela, não abre conexão e não acessa `auth.users` nem `profiles`.

### 13. Domínios impactados

- **Principal:** `auth`.
- **Secundários:** nenhum.
- **Infraestrutura:** `supabase-auth`.

### 14. Dependências

- **Estrutura:** a da FOUNDATION-001 (tsconfig, ESLint, scripts).
- **Runtime:** `jose`, com versão exata.
- **Testes:** biblioteca definida pela DEC-02.
- **Configuração:** `SUPABASE_URL` e o JWKS público do projeto oficial.
- **Proibidas:**
  - `@supabase/*`, `jsonwebtoken`, `next-auth`/`@auth/*`, `better-auth`;
  - ORM ou driver de Postgres;
  - `zod` ou outra biblioteca de validação;
  - bibliotecas de logging.

### 15. Eventos de domínio

Nenhum.

### 16. Auditoria

Não se aplica:
- não há mudança de estado;
- a DATA-DEC-021 está pendente;
- o login é registrado pelo provedor.

### 17. Erros esperados

| Código | Quando | Classe para o futuro mapeamento HTTP |
|---|---|---|
| `AUTH_MISSING_CREDENTIAL` | Sem header ou header vazio | Não autenticado |
| `AUTH_MALFORMED_CREDENTIAL` | Esquema diferente de Bearer, token ausente ou múltiplo | Não autenticado |
| `AUTH_INVALID_TOKEN` | Assinatura, algoritmo, `iss`, `aud`, `role`, `sub`, `session_id`, `nbf`, anônimo ou JWT malformado | Não autenticado |
| `AUTH_TOKEN_EXPIRED` | `exp` vencido, com assinatura válida | Não autenticado |
| `AUTH_VERIFICATION_UNAVAILABLE` | Configuração ausente ou inválida, JWKS inacessível ou inválido | **Falha do servidor, não "não autenticado"** |

- O código HTTP e o corpo da resposta não são definidos aqui (`tecnico/API` está A DEFINIR; ver DEC-07).
- O mapeamento futuro deve preservar a separação entre as quatro primeiras classes e a última, para que um cliente não desconecte o usuário quando o provedor estiver fora do ar.
- O erro nunca carrega token, header nem claims. `cause` é permitido só para falha de rede ou configuração, sem conteúdo do token.

### 18. Resultado esperado

`AuthenticatedIdentity`, somente leitura:

| Campo | Origem | Observação |
|---|---|---|
| `externalUserId` | claim `sub` | UUID do provedor. **Não é** o id do usuário do Mescala |
| `sessionId` | claim `session_id` | — |
| `expiresAt` | claim `exp` | Convertido para `Date` |

Em caso de falha, a função lança `AuthenticationError` com o código correspondente.

### 19. Critérios de aceite

1. Existem só os arquivos do Backend Implementation Task, mais os testes conforme a DEC-02.
2. Nenhuma rota nova: `/api/health` é a única e continua intacta.
3. Token válido → identidade com **exatamente** `externalUserId`, `sessionId` e `expiresAt`, com os valores certos.
4. Só o header `Authorization` é lido. Query, body, cookies e outros headers são ignorados.
5. Toda falha lança `AuthenticationError` com o código da seção 17. Nenhum caminho de falha devolve identidade.
6. A chave vem só do JWKS configurado. Lista fechada ES256/RS256. `none` e `HS*` são rejeitados. `jku`, `x5u` e `jwk` são ignorados.
7. `iss`, `aud`, `role`, `exp`, `nbf`, `sub` (UUID), `session_id` e `is_anonymous` são validados conforme a seção 5.
8. `AUTH_TOKEN_EXPIRED` só aparece para token com assinatura válida.
9. Configuração ou JWKS indisponível → `AUTH_VERIFICATION_UNAVAILABLE`.
10. Nenhum segredo. A única variável de ambiente lida é `SUPABASE_URL`. O build passa sem ela definida.
11. Token, header e payload nunca vão para log, mensagem ou propriedade de erro.
12. Guardas de ESLint ativas:
    - `src/domains/**` não importa `next`, `jose` nem `@supabase/*`;
    - `src/app/**` não importa `jose`, `@supabase/*` nem `@/infrastructure/supabase-auth/*`;
    - as guardas da FOUNDATION-001 continuam valendo.
13. Dependência nova de runtime: só `jose`. De desenvolvimento: só o que a DEC-02 aprovar.
14. Sem middleware/proxy, sem AsyncLocalStorage, sem estado global de identidade e sem cache de identidade entre requisições.
15. `typecheck`, `lint`, `build` e `test` passam em `/backend`.
16. Os cenários B do QA Contract estão automatizados e passando.
17. Cabeçalhos didáticos e comentários de RELAÇÃO EXTERNA presentes.
18. Nada foi alterado fora de `/backend`.
19. Nenhum acesso a banco, `auth.users` ou `profiles`, e nenhum cliente Supabase.

### 20. Fora do escopo

- Endpoints de login, cadastro, logout, refresh, redefinição de senha, confirmação de email, OAuth e MFA.
- Cookies, BFF e CORS.
- Qualquer rota.
- Mapeamento HTTP e envelope de erro.
- Usuário do Mescala, tabela `users`, provisionamento, perfil e "quem sou eu".
- Igreja, vínculos, papéis (OWNER, ADMIN, LEADER, MEMBER), permissões, ministérios e convites.
- Validação remota (`getUser`) e uso de service role ou Admin API.
- Logging, auditoria, eventos e rate limit.
- Migração de usuários legados.
- Configuração do painel do Supabase.
- Arquivos `.env`.
- Qualquer mudança em `src/`, `supabase/` ou `brain-mescala/`.

---

## 4. DATA TASK

**A AUTH-001 não tem DATA TASK:** não há necessidade real de banco.

Registro para a AUTH-002. **Não encaminhar ao Analista de Dados.**

```text
REQUISITO CONCEITUAL FUTURO — Usuário do Mescala (AUTH-002)

Entidade: Usuário do Mescala. Global, sem church_id (relatório, seção 6).

Ligação: 1:1 com a identidade do provedor (externalUserId = sub).
         Obrigatória, única e imutável.

Atributos: DATA-DEC-013.

Status ou revogação: A DEFINIR (bloqueio B8).

Restrições a preservar:
  - excluir a conta no provedor não pode apagar histórico
    (ESC-004, AUDITORIA, DATA-DEC-012);
  - o comportamento de uma FK para auth.users depende de
    DEC-04 e DATA-DEC-020.

Migração do legado (profiles + auth.users → users):
  - DATA-DEC-022 + inventário;
  - atenção às contas que podem ter sido criadas pelo S3.

DECISÕES QUE DESTRAVAM ESTE DATA TASK:
  - DEC-03 (ADR-003);
  - DATA-DEC-019;
  - DATA-DEC-018;
  - DATA-DEC-013;
  - DEC-04 e, em seguida, DATA-DEC-020;
  - DEC-06 (provisionamento; define, por exemplo, se haverá trigger no banco).
  Pré-requisitos de processo:
  - FOUNDATION-001 implementada;
  - contrato da fundação de persistência (FOUNDATION-002, ID a confirmar);
  - autorização explícita da Fase 4.
  A DATA-DEC-022 só é necessária para a cópia de dados, não para criar a tabela.
```

---

## 5. BACKEND IMPLEMENTATION TASK

```text
Feature:          AUTH-001 — Fundação de Autenticação
Domínio:          auth (+ infrastructure/supabase-auth)
Responsabilidade: verificar o access token do Supabase Auth e devolver a
                  identidade autenticada, conforme o Feature Contract.
Pré-requisitos:   FOUNDATION-001 aprovada; ADR-003 aceito; DEC-02 decidida.
```

### Arquivos esperados

```text
backend/
├── package.json        (alterado: + jose; + biblioteca e script de teste conforme DEC-02)
├── package-lock.json   (alterado)
├── eslint.config.mjs   (alterado: guardas da seção "ESLint")
└── src/
    ├── domains/auth/
    │   ├── authenticated-identity.ts            tipos AuthenticatedIdentity e VerifyAccessToken
    │   ├── authentication-error.ts              AuthenticationError e AuthenticationErrorCode
    │   └── require-authenticated-identity.ts    requireAuthenticatedIdentity (+ extração do Bearer, não exportada)
    └── infrastructure/supabase-auth/
        ├── supabase-auth-config.ts              loadSupabaseAuthConfig
        └── supabase-access-token-verifier.ts    createSupabaseAccessTokenVerifier + verifySupabaseAccessToken (padrão)
```

- Os testes ficam onde a DEC-02 definir.
- Nenhum arquivo é criado ou alterado fora de `/backend`.

### Contratos (assinaturas conceituais)

```ts
// domains/auth/authenticated-identity.ts
export type AuthenticatedIdentity = Readonly<{
  externalUserId: string; // claim sub; NÃO é o id do usuário do Mescala
  sessionId: string;      // claim session_id
  expiresAt: Date;        // claim exp
}>;
export type VerifyAccessToken = (accessToken: string) => Promise<AuthenticatedIdentity>;

// domains/auth/authentication-error.ts
export type AuthenticationErrorCode =
  | 'AUTH_MISSING_CREDENTIAL' | 'AUTH_MALFORMED_CREDENTIAL'
  | 'AUTH_INVALID_TOKEN' | 'AUTH_TOKEN_EXPIRED' | 'AUTH_VERIFICATION_UNAVAILABLE';
export class AuthenticationError extends Error { readonly code: AuthenticationErrorCode }

// domains/auth/require-authenticated-identity.ts
export async function requireAuthenticatedIdentity(
  request: Request,
  verifyAccessToken: VerifyAccessToken = verifySupabaseAccessToken,
): Promise<AuthenticatedIdentity>;

// infrastructure/supabase-auth/supabase-auth-config.ts
export function loadSupabaseAuthConfig(): { issuer: string; jwksUrl: URL };

// infrastructure/supabase-auth/supabase-access-token-verifier.ts
export function createSupabaseAccessTokenVerifier(
  options: { issuer: string; keySet: JWTVerifyGetKey },
): VerifyAccessToken;
export const verifySupabaseAccessToken: VerifyAccessToken; // padrão, criado sob demanda
```

**Por que a fábrica e o parâmetro opcional:**
- a configuração é carregada sob demanda, então o build passa sem a variável de ambiente;
- os testes injetam um JWKS local e um issuer de teste, sem rede.

Não criar outras interfaces, classes ou camadas.

### Regras de implementação

1. **Extração:**
   - só o header `Authorization`;
   - esquema `Bearer` sem diferenciar maiúsculas;
   - um único token, sem espaço nem vírgula interna;
   - códigos conforme a seção 17.
2. **Verificação com `jose`** (`jwtVerify` + `createRemoteJWKSet` ligado à URL da configuração):
   - `algorithms: ['ES256','RS256']`;
   - `issuer`;
   - `audience: 'authenticated'`;
   - `clockTolerance: 5`;
   - claims obrigatórios `exp`, `sub`, `session_id`;
   - depois, checar `role === 'authenticated'`, `is_anonymous !== true`, `sub` UUID e `session_id` string não vazia.
3. **Fonte da chave:** só o JWKS configurado. Nunca usar `jku`, `x5u` nem `jwk` do header.
4. **Mapeamento das falhas:**
   - falha ao obter o JWKS (rede, timeout, JWKS inválido) e configuração ausente ou inválida → `AUTH_VERIFICATION_UNAVAILABLE`;
   - `JWTExpired` → `AUTH_TOKEN_EXPIRED`;
   - todos os demais erros (por exemplo `JWSSignatureVerificationFailed`, `JWKSNoMatchingKey`, `JOSEAlgNotAllowed`, `JWTClaimValidationFailed`, `JWSInvalid`, `JWTInvalid`) → `AUTH_INVALID_TOKEN`;
   - confira os nomes na versão instalada;
   - nenhum erro desconhecido pode resultar em identidade.
5. **Configuração:**
   - ler `SUPABASE_URL` na primeira chamada e validar `https:`, sem caminho;
   - derivar `issuer = <url>/auth/v1` e `jwksUrl = <url>/auth/v1/.well-known/jwks.json`;
   - se a configuração for inválida, a chamada falha com `AUTH_VERIFICATION_UNAVAILABLE`, e a próxima chamada tenta de novo;
   - criar o JWKS remoto uma vez por processo.
6. **Cache do JWKS:**
   - a obtenção não pode ficar presa ao cache de dados do Next.js;
   - o cache válido é o da `jose`, com renovação quando aparece `kid` desconhecido;
   - se o Next interceptar e cachear a requisição da `jose`, pare e reporte **IMPLEMENTATION DIVERGENCE**.
7. **Divergências a reportar** (**IMPLEMENTATION DIVERGENCE**):
   - a documentação da versão do Supabase Auth em uso indica que `session_id` pode faltar em tokens de usuário;
   - o projeto usa algoritmo assimétrico diferente de ES256 ou RS256.
8. **Sigilo:** token, header e payload nunca vão para `console`, mensagem de erro ou propriedade de erro. Sem logging nesta feature.
9. **Sem estado compartilhado:** nada de estado global de identidade, AsyncLocalStorage, middleware ou proxy. A identidade é passada por parâmetro.
10. `domains/auth` usa só tipos Web padrão (`Request`, `Headers`). Nunca `NextRequest`.
11. **Composição permitida:** `require-authenticated-identity.ts` importa o verificador padrão da infraestrutura. A infraestrutura importa só os tipos e o erro de `domains/auth`. Nenhum ciclo entre arquivos.

### ESLint

Acrescentar, mantendo ativas as guardas da FOUNDATION-001:
- **`src/domains/**`:** `no-restricted-imports` para `next`, `next/*`, `jose`, `jose/*` e `@supabase/*`.
- **`src/app/**`:** `no-restricted-imports` para `jose`, `jose/*`, `@supabase/*` e `@/infrastructure/supabase-auth/*`. Os handlers usam `@/domains/auth/...`.
- No flat config, a última regra que casa com o arquivo **substitui** a anterior. Garanta que as restrições somem e não se apaguem.
- Cada guarda leva um comentário curto citando o ADR-002 ou o ADR-003.

### Dependências

- **Runtime:** `jose`, com versão exata registrada no relatório.
- **Desenvolvimento:** somente o que a DEC-02 aprovar.
- **Proibidas:** as da seção 14 do contrato.

### Validações

Conforme as seções 4 e 5 do contrato.

### Autorização, transação, auditoria

Não se aplicam (seções 9, 11 e 16).

### Documentação no código

Cabeçalho didático em cada arquivo `.ts`, com:
- `ARQUIVO`;
- `DOMÍNIO: auth` (ou `infrastructure/supabase-auth`);
- `FEATURE: AUTH-001`;
- referência ao `ADR-003`;
- SUMÁRIO com o nome em português:
  - `requireAuthenticatedIdentity`: "Exigir Identidade Autenticada";
  - extração do Bearer: "Extrair Token Bearer";
  - `createSupabaseAccessTokenVerifier`: "Criar Verificador de Token de Acesso do Supabase";
  - `verifySupabaseAccessToken`: "Verificar Token de Acesso do Supabase";
  - `loadSupabaseAuthConfig`: "Carregar Configuração do Supabase Auth";
  - `AuthenticationError`: "Erro de Autenticação";
- DEPENDÊNCIAS EXTERNAS;
- regras principais.

Comentário **RELAÇÃO EXTERNA** em dois pontos:
- na chamada de `domains/auth` ao verificador da infraestrutura;
- no uso de `jose`.

### Testes

- Quem escreve e onde ficam: conforme a DEC-02.
- O mínimo são os cenários B do QA Contract, com chaves geradas no próprio teste.
- Sem rede, sem projeto real e sem usuários reais.

### Ao entregar

- Rodar `typecheck`, `lint`, `build` (sem `SUPABASE_URL`) e `test`.
- Registrar as versões exatas.
- Não fazer commit nem deploy; não criar `.env`.

### Critérios de aceite e fora do escopo

Seções 19 e 20 do contrato.

---

## 6. ORGANIZATION TASK

- **Domínio principal:** `auth`, em `backend/src/domains/auth/`.
- **Infraestrutura:** `backend/src/infrastructure/supabase-auth/`.
- **Secundários:** nenhum.
- **Estrutura esperada:** a árvore do Backend Implementation Task. Testes conforme a DEC-02.

**Dependências permitidas**
- `app/api/**` (futuro) → `@/domains/auth/*`, somente pela API pública: `requireAuthenticatedIdentity`, tipos e erro.
- `domains/auth/require-authenticated-identity.ts` → `infrastructure/supabase-auth/supabase-access-token-verifier.ts` (composição padrão).
- `infrastructure/supabase-auth/*` → `domains/auth/authenticated-identity.ts` e `authentication-error.ts`; → `jose`.

**Dependências proibidas**
- `domains/**` → `next`, `jose`, `@supabase/*`.
- `app/**` → `jose`, `@supabase/*`, `@/infrastructure/supabase-auth/*`.
- Qualquer arquivo → `../src` (frontend legado) ou `../supabase`.
- Ciclo entre arquivos.

**Possíveis violações estruturais**
- Verificação de token dentro de Route Handler, `middleware.ts` ou `proxy.ts`.
- Tipos de autenticação em `shared/`, `lib/`, `utils/` ou `helpers/`.
- Cliente genérico `infrastructure/supabase/` ou `supabase-js`.
- Barrels (`index.ts`).
- Pastas vazias ou `.gitkeep` "para a AUTH-002".
- Helper de resposta HTTP de erro criado agora.
- Rota nova.
- Arquivo `.env*`.

O Organizador não muda regra. Problema funcional volta ao Arquiteto.

---

## 7. QA CONTRACT

Validar contra o Feature Contract AUTH-001 e o ADR-003.

### A. Validação estática

| ID | Cenário | Critério |
|---|---|---|
| S1 | Arquivos e locais conforme o Organization Task; nada fora de `/backend` | 1, 18 |
| S2 | `/api/health` é a única rota e está intacta; sem middleware/proxy | 2, 14 |
| S3 | Única dependência nova de runtime é `jose`, com versão exata; nenhuma proibida | 13 |
| S4 | Guardas de ESLint presentes, inclusive as da FOUNDATION-001 | 12 |
| S5 | Só `SUPABASE_URL` é lida; nenhum segredo; nenhum `.env*` criado ou versionado | 10 |
| S6 | Token, header e payload nunca em `console`, mensagem ou propriedade de erro | 11 |
| S7 | Lista fechada de algoritmos explícita; nada de `jku`/`x5u`/`jwk`; JWKS e issuer só da configuração | 6 |
| S8 | A identidade tem só os 3 campos; nenhuma leitura de `email`, `app_metadata` ou `user_metadata` para identidade ou autorização | 3 |
| S9 | Sem AsyncLocalStorage, estado global ou cache de identidade | 14 |
| S10 | Sem acesso a banco ou cliente Supabase | 19 |
| S11 | Cabeçalhos didáticos e RELAÇÃO EXTERNA | 17 |
| S12 | Sem ciclo entre arquivos; dependências conforme o Organization Task | 12 |

### A'. Validação por ferramentas

| ID | Cenário | Critério |
|---|---|---|
| T1 | `npm run typecheck` | 15 |
| T2 | `npm run lint` | 15 |
| T3 | `npm run build` **sem** `SUPABASE_URL` | 10, 15 |
| T4 | `npm run test` | 15, 16 |
| T5 | `npm run lint` na raiz não traz caminhos `backend/` | 18 |

### B. Testes automatizados

Com chaves ES256 e RS256 geradas no teste, JWKS local e issuer de teste. Sem rede e sem usuários reais.

| ID | Cenário | Esperado |
|---|---|---|
| B1 | Token válido | Identidade com `externalUserId = sub`, `sessionId`, `expiresAt` |
| B2 | Sem `Authorization` | `AUTH_MISSING_CREDENTIAL` |
| B3 | `Authorization` vazio | `AUTH_MISSING_CREDENTIAL` |
| B4 | `Bearer` sem token; `Basic …`; dois tokens; vírgula | `AUTH_MALFORMED_CREDENTIAL` |
| B5 | Esquema `bearer` em minúsculas | Aceito |
| B6 | `exp` vencido com assinatura válida | `AUTH_TOKEN_EXPIRED` |
| B7 | `exp` vencido com assinatura inválida | `AUTH_INVALID_TOKEN` |
| B8 | `nbf` no futuro; sem `exp` | `AUTH_INVALID_TOKEN` |
| B9 | Payload adulterado | `AUTH_INVALID_TOKEN` |
| B10 | Assinado por chave fora do JWKS ou com `kid` desconhecido | `AUTH_INVALID_TOKEN` |
| B11 | `alg: none` | `AUTH_INVALID_TOKEN` |
| B12 | HS256, inclusive usando a chave pública como segredo | `AUTH_INVALID_TOKEN` |
| B13 | `iss` de outro projeto | `AUTH_INVALID_TOKEN` |
| B14 | `aud` diferente | `AUTH_INVALID_TOKEN` |
| B15 | `role` `anon`; `role` `service_role` | `AUTH_INVALID_TOKEN` |
| B16 | `is_anonymous: true` | `AUTH_INVALID_TOKEN` |
| B17 | Sem `sub`; `sub` não UUID; sem `session_id` | `AUTH_INVALID_TOKEN` |
| B18 | Resolvedor de chave falha por rede ou timeout | `AUTH_VERIFICATION_UNAVAILABLE`; nunca identidade |
| B19 | `SUPABASE_URL` ausente, inválida ou `http:` | `AUTH_VERIFICATION_UNAVAILABLE` |
| B20 | Token só em query, cookie ou `x-user-id` | `AUTH_MISSING_CREDENTIAL` (ignorados) |
| B21 | Token com `email` e metadata | A identidade não os contém |
| B22 | Nenhum erro contém o token (mensagem, propriedades, `cause`) | Verificado |
| B23 | JWKS com duas chaves (rotação) | Tokens de ambas aceitos |
| B24 | Guardas de ESLint disparam com arquivo de exemplo | Erro de lint |

### C. Cenários com banco

Nenhum.

### D. Não executáveis

- **Integração real com o JWKS do projeto oficial:** NOT TESTED. Não há rota e o QA não cria usuários reais. Fica para a AUTH-003.
- **Chaves assimétricas e projeto oficial:** verificação do PO.

### Cenários padrão

| Cenário | Cobertura |
|---|---|
| Happy path | B1, B5, B23 |
| Invalid input | B2–B4 |
| Unauthorized | B6–B17, B20 |
| Forbidden | Não se aplica (sem autorização) |
| Cross-tenant | Não se aplica; o equivalente é token de outro projeto (B13) + S8 |
| Transaction rollback | Não se aplica |
| Dependency failure | B18, B19 |
| Regression | T5; `GET /api/health` → 200 `{"status":"ok"}` e `POST` → 405 continuam iguais |

---

## 8. Dependências futuras

```text
FOUNDATION-001 (READY, não implementada)
   ├──► AUTH-001 Fundação de Autenticação        [ADR-003, DEC-02]
   └──► FOUNDATION-002 Fundação de Persistência  [DEC-04, DATA-DEC-018/020, autorização da Fase 4] (ID a confirmar)
             │
   AUTH-001 ─┴──► AUTH-002 Provisionamento do Usuário do Mescala  [DATA-DEC-019, DATA-DEC-013, DEC-06]
                      ▼
                  AUTH-003 Usuário Atual (requireCurrentUser + primeira rota protegida)  [DEC-07; B8]
                      ▼
                  CHURCH-001 Criar Igreja (o criador torna-se OWNER)  [DATA-DEC-005/006/007/012/013, 021]
                      ▼
                  CHURCH-002 Contexto de Igreja da requisição (vínculo + papel)  [DATA-DEC-006, DEC-07]
                      ▼
                  ministérios/equipes, membros, programações, escalas…
```

**Por que esta ordem, e não AUTH-001 → 002 → 003 → CHURCH-001 direto:**
- **AUTH-001 roda em paralelo com a FOUNDATION-002**, porque não usa banco.
- **AUTH-002 precisa das duas.** O usuário do Mescala é tabela própria.
- **Se a DEC-06 escolher provisionamento na primeira requisição (JIT), AUTH-002 e AUTH-003 se fundem.**
- **CHURCH-001 vem antes do contexto de igreja.** Criar a igreja só exige usuário autenticado (`FLUXO-CADASTRO-IGREJA`). O contexto exige o vínculo que a CHURCH-001 cria.

**AUTH-001:**
- **DEPENDS_ON:** FOUNDATION-001, ADR-003, DEC-02.
- **BLOCKS:** AUTH-002, AUTH-003, CHURCH-001, CHURCH-002 e toda rota protegida.
- **RELATED_TO:**
  - DATA-DEC-019, DATA-DEC-020 e DEC-04;
  - DATA-DEC-023 (o S3 contamina o pool de identidades compartilhado);
  - DATA-DEC-011 (convites, que dependem de confirmação de email ligada e de decisão sobre a Admin API).

---

## 9. Bloqueios

**B1. BLOQUEIO DE DOMÍNIO: DEC-03 (autenticação)**
- **Onde está marcado:**
  - `seguranca/AUTENTICACAO.md`: "Provider e mecanismo definitivo: **A DEFINIR**";
  - `tecnico/BACKEND.md`: "autenticação… **A DEFINIR**";
  - ADR-002, "Decisões ainda não definidas".
- **Opções:**
  - A) Supabase Auth com validação JWKS local;
  - B) autenticação própria;
  - C) Supabase Auth com validação remota.
- **Recomendação:** A, pelo ADR-003.
- **Bloqueia:** o READY da AUTH-001.

**B2. BLOQUEIO: DEC-02 (biblioteca de testes e quem escreve os testes)**
- **Onde está marcado:** `tecnico/BACKEND.md` ("testes… **A DEFINIR**") e `decisoes/PENDENCIAS#DEC-02`.
- **Por que bloqueia aqui:** o valor da AUTH-001 está nos cenários negativos (B6–B22). Eles não podem ser validados estaticamente, e o teste manual exigiria usuários reais, o que é proibido ao QA.
- **Opções:**
  - A) Vitest;
  - B) `node:test` + `tsx`;
  - C) Jest.
- **Recomendação técnica:** A. TypeScript, ESM e alias funcionam sem esforço.
- **Quem escreve:** sugestão: o Desenvolvedor escreve os cenários B como parte da entrega, e o QA revisa e acrescenta casos adversariais.
- **Bloqueia:** o READY da AUTH-001.

**B3. DEPENDÊNCIA: FOUNDATION-001**

Precisa estar implementada e aprovada antes de a AUTH-001 começar.

**B4. DECISÃO: DEC-05 (projeto Supabase oficial; divergência D4)**
- **Opções:**
  - A) `ehbidizpzxhfusfyjgtl` ("Projeto Mescala", usado pelo `.env` e pelo CLI);
  - B) `fiurvpkieiorngshjric` (`config.toml` e o contexto recebido);
  - C) novo projeto, o que exige migrar as identidades.
- Os indícios apontam A como o projeto em uso. Isso é inferência; o PO confirma.
- **Bloqueia:** a operação da AUTH-001 e a consulta de inventário. Não bloqueia a implementação.

**B5. VERIFICAÇÃO DO PO: chaves de assinatura do projeto oficial**
- No painel do Supabase (JWT Signing Keys), confirmar que há chave assimétrica (ECC P-256 ou RSA) como chave atual.
- Se o projeto ainda assina com o segredo legado: fazer a rotação ou revisar o ADR-003 para validação remota.
- Também cabe ao PO: o TTL do access token (recomendação: manter no máximo o padrão de 3600 s).

**B6. RISCO OPERACIONAL: confirmação de email**
- Indício de que está desligada (modo de teste ativo no `.env`).
- Não bloqueia a AUTH-001, que não usa email.
- Bloqueia qualquer feature que use email como evidência (convites). Ligar antes de produção.

**B7. BLOQUEIO DE DOMÍNIO, para a AUTH-002: DEC-06 (provisionamento do usuário do Mescala)**
- **O que a Brain diz:** "Usuário cria ou acessa sua conta" (`FLUXO-CADASTRO-IGREJA`), sem dizer como o registro do Mescala nasce.
- **Opções:**
  - A) endpoint explícito de registro depois do cadastro no provedor, que coleta atributos;
  - B) criação automática na primeira requisição autenticada (JIT);
  - C) trigger no banco em `auth.users`, que acopla ao provedor, tira a lógica do backend e pode quebrar o cadastro se o trigger falhar.
- **Recomendação:** A.

**B8. BLOQUEIO DE DOMÍNIO, para a AUTH-003: revogação do usuário no domínio**
- **O que a Brain diz:** não define status de usuário. A DATA-DEC-012 cobre igreja, equipe, vínculos e funções, não o usuário.
- **Opções:**
  - A) usuário com status, verificado a cada requisição;
  - B) sem status global: a revogação acontece pelo vínculo (por igreja) e por ban no provedor;
  - C) ambos.
- **Recomendação:** B, coerente com "papéis por relacionamento". Decisão do PO.

**B9. BLOQUEIO DE DOMÍNIO, para a AUTH-003: DEC-07 (padrão HTTP de erros e convenções de API)**
- **Onde está marcado:** `tecnico/API.md`, "Contratos e endpoints definitivos: **A DEFINIR**".
- **Por que bloqueia:** é necessário antes da primeira rota protegida, para mapear os códigos da seção 17.
- **Opções:**
  - A) RFC 6750 (401 + `WWW-Authenticate`) sem corpo, adiando o envelope;
  - B) definir já o padrão global de erros, por exemplo RFC 9457 (problem+json) + `WWW-Authenticate`;
  - C) envelope próprio.
- **Recomendação:** B, numa decisão ou feature própria.

**B10. Pendências de dados para a AUTH-002**
- DATA-DEC-019, 018, 013, DEC-04 → DATA-DEC-020, contrato FOUNDATION-002 e autorização da Fase 4 (seção 4).
- A DATA-DEC-022 e o inventário só são necessários para migrar os usuários legados.

**Após o aceite do PO (não executado):**
- gravar `docs/features/AUTH-001.md` e `brain-mescala/decisoes/ADR-003-AUTENTICACAO.md` (vault-brain);
- atualizar `seguranca/AUTENTICACAO`, `decisoes/PENDENCIAS` (DEC-03 decidida; novas DEC-05, DEC-06 e DEC-07), `features/FLUXO-DE-ENTREGA` e o "fora do git" de `tecnico/LEGADO-ATUAL` (D5).

Parei aqui. Não encaminhei nada aos executores.

---

**Arquivos relevantes**
- C:\projetos\mescala\brain-mescala\seguranca\AUTENTICACAO.md
- C:\projetos\mescala\brain-mescala\decisoes\PENDENCIAS.md
- C:\projetos\mescala\brain-mescala\decisoes\ADR-002-BACKEND-OFICIAL.md
- C:\projetos\mescala\brain-mescala\tecnico\LEGADO-ATUAL.md
- C:\projetos\mescala\docs\features\FOUNDATION-001.md
- C:\projetos\mescala\docs\data\DATA-ARCHITECTURE-REPORT.md
- C:\projetos\mescala\src\contexts\AuthContext.tsx
- C:\projetos\mescala\src\integrations\supabase\client.ts
- C:\projetos\mescala\supabase\functions\aceitar-convite-cadastro\index.ts
- C:\projetos\mescala\supabase\config.toml
- C:\projetos\mescala\supabase\.temp\linked-project.json
- C:\projetos\mescala\supabase\migrations\20260712094502_profiles_confirmado_teste.sql
- C:\projetos\mescala\daily\2026-07-11.txt
- C:\projetos\mescala\.env (só nomes de variáveis e prefixos lidos)
---

## ADENDO v2 (2026-10-22)

> Emitido pelo `arquiteto-mescala` em 2026-10-22, só com leitura.
> - **Cada seção listada em A.5 é substituída integralmente pelo texto deste adendo.** O que não está listado continua valendo como na v1.
> - Nada foi encaminhado aos executores.
>
> Notação usada no adendo:
> - **FC-n:** item n do Feature Contract (seção 3);
> - **BIT:** Backend Implementation Task (seção 5);
> - **OT:** Organization Task (seção 6);
> - **QA:** QA Contract (seção 7).

### A. Análise do adendo

#### A.1 Entendimento

O adendo faz quatro coisas:
- incorpora o ADR-003, a DEC-02, a DEC-05, a FOUNDATION-001 encerrada, a DEC-04 e a DEC-09;
- especifica o Vitest;
- trata o L-06 e a regressão do lint;
- define o novo status.

**O escopo funcional não muda:** verificar o access token e devolver a identidade do provedor, sem banco, sem igreja e sem rota nova.

#### A.2 O que foi consultado

**Brain:**
- `decisoes/ADR-003-AUTENTICACAO`;
- `DEC-02-BIBLIOTECA-DE-TESTES`;
- `DEC-05-PROJETO-SUPABASE-OFICIAL`, com o complemento de 2026-10-22;
- `DEC-04-ESTRATEGIA-DE-MIGRATIONS`;
- `DEC-09-MODELO-DE-DADOS` (DATA-DEC-019, 020, 022, 023 e micro-decisões);
- `DEC-08`;
- `PENDENCIAS`;
- `features/FOUNDATION-001`: L-01 a L-06, RT-FOUND-01 a 03, D-01 e a seção "Verificação mínima de regressão do lint";
- `features/FLUXO-DE-ENTREGA`, `tecnico/BACKEND`, `tecnico/CONVENCOES`, `seguranca/AUTENTICACAO`, `05-REGRAS-DE-NEGOCIO` (SEC-001 e HIS-001);
- definições dos agentes em `.claude/agents/`, alinhadas em 2026-10-22.

**Repositório (fatos conferidos em 2026-10-22):**
- **Estado do `/backend`:** sem alterações locais desde o `7f26d30`. A única fonte é `src/app/api/health/route.ts`.
- **`package.json`:** não tem `jose` nem `vitest`, não tem script `test` e não declara `"type": "module"`.
- **`tsconfig.json`:**
  - `include` = `next-env.d.ts`, `next.config.ts`, `src/**/*.ts`, `.next/types/**/*.ts` e `.next/dev/types/**/*.ts`;
  - `"types": ["node"]`;
  - `paths`: `@/*` → `./src/*`.
- **`eslint.config.mjs`:**
  - a guarda 1 tem `files` `{ts,tsx,mts,cts,js,mjs,cjs}`, sem `jsx`;
  - a guarda 2 tem `{ts,tsx,js,mjs,cjs}`, sem `jsx`, e o item 2 do cabeçalho não declara "Arquivos cobertos";
  - o item 1 do cabeçalho diz que o `import()` "de tipo" cobre template sem interpolação. O seletor `TSImportType` não cobre esse caso, e o próprio TypeScript recusa template nessa posição.
- **`eslint-config-next` 16.4.2:**
  - não configura `no-restricted-imports` nem `no-restricted-syntax`;
  - usa o parser do TypeScript só em `.ts` e `.tsx`. Os demais arquivos vão para o parser Babel do Next.
- **ESLint 9.39.5:** traz tipos próprios e aceita `regex` em `patterns` de `no-restricted-imports`.
- **Node local:** 22.15.1.

#### A.3 Contradições e imprecisões da v1

**Contradições com as decisões novas**

| # | Na v1 | Decisão que muda | Tratamento |
|---|---|---|---|
| C1 | STATUS BLOCKED (DEC-03 e DEC-02) | ADR-003; DEC-02 | READY (A.6) |
| C2 | §1.6 e §2: "usuários reais preservados". R2: pool de identidades compartilhado com o legado | DEC-05 (projeto novo) e complemento de 2026-10-22 (legado sem uso real, banco vazio, sem migração) | Ver abaixo |
| C3 | §4: "migração profiles + auth.users → users" e "FK para auth.users depende de DEC-04 e DATA-DEC-020" | DATA-DEC-019, DATA-DEC-020 e o complemento da DATA-DEC-022 | Registro reescrito (F) |
| C4 | §8 e §9: FOUNDATION-001 "READY, não implementada"; B1 a B4 abertos | FOUNDATION-001 APPROVED; DEC-05 | Reescritos (H e I) |

Tratamento do C2:
- O benefício "preservar usuários" deixou de existir. A decisão continua sustentada pelos demais motivos:
  - backend sem segredo e sem estado;
  - nenhuma dependência de banco;
  - atende vários clientes;
  - autenticação separada da autorização.
- O pool de identidades do projeto novo não é compartilhado com o legado.
- A regra "email não prova identidade" continua (ADR-003, item 6).
- O texto aceito do ADR-003 não muda.

**Sem contradição:**
- com a DEC-04: a AUTH-001 não cria `backend/supabase/`;
- com a DATA-DEC-020: a AUTH-001 não acessa banco, e o veto a `@supabase/*` e a um `infrastructure/supabase/` genérico é coerente com o acesso direto ao Postgres;
- com a DEC-08.

**Precisões técnicas acrescentadas (nenhuma regra de negócio nova)**
- **P1.** Falha do resolvedor de chave. Na v1, o B18 podia cair tanto em "rede → UNAVAILABLE" quanto em "demais erros → INVALID". Agora a classificação é pela origem do erro (FC-5).
- **P2.** A guarda de `src/app/**` contra a infraestrutura de autenticação só pegava o alias `@/`; um import relativo passava. Agora cobre os dois.
- **P3.** As restrições novas cobrem as mesmas formas de import da guarda 1 e ficam no mesmo objeto de configuração da área. No flat config, a última configuração de uma regra substitui a anterior.
- **P4.** "Identidade imutável" passa a significar objeto congelado (`Object.freeze`).
- **P5.** Configuração ausente ou inválida: `loadSupabaseAuthConfig()` lança `AuthenticationError` com `AUTH_VERIFICATION_UNAVAILABLE`.
- **P6.** `sub` UUID: formato canônico, sem exigir versão.
- **P7.** Imports entre áreas usam `@/`; imports na mesma pasta usam `./`.

#### A.4 Decisões sobre o L-06 e a regressão automatizada

**Decisão 1: a correção do L-06 e a regressão do lint (B3 da FOUNDATION-001) entram nesta feature, como suíte GL. Não há feature própria.**

Justificativa:
1. **A Brain liga as duas coisas a esta feature.**
   - O L-06 tem como gatilho "qualquer feature que altere o `eslint.config.mjs`".
   - O registro da FOUNDATION-001 diz que a verificação vale para toda feature que altere esse arquivo e que ela "vira o teste automatizado B3 na primeira feature que alterar o lint".
   - A AUTH-001 é essa feature.
2. **O risco nasce aqui.** A AUTH-001 altera os mesmos objetos de configuração das guardas do ADR-002. No flat config, uma regra mal mesclada apaga a anterior sem aviso. A suíte GL prova que as guardas da FOUNDATION-001 continuam funcionando.
3. **Uma suíte só cobre três coisas.** O B24 da v1 (as guardas novas disparam) usa o mesmo mecanismo: ESLint pela API, com arquivo virtual. A mesma suíte cobre o B3 da FOUNDATION-001, o B24 da AUTH-001 e os casos `.jsx` do L-06.
4. **Uma feature separada não ajuda.**
   - Se viesse antes, atrasaria a AUTH-001 e tiraria dela a instalação do Vitest, que a DEC-02 atribui à AUTH-001.
   - Se viesse depois, a AUTH-001 alteraria o lint sem a regressão exigida.
5. **Custo baixo:** um arquivo de teste e duas entradas no `include` do `tsconfig.json`. Nenhum código de produção.

Consequências:
- A condição (c) do L-06 (o PO antecipar a correção como mudança isolada) fica sem objeto.
- O L-06 é encerrado quando a AUTH-001 for APPROVED.
- O encerramento **não** autoriza `.jsx` no `/backend`, que é BACKEND ONLY e não tem React. A proibição passa a ser estrutural (OT).

**Decisão 2: o B1 e o B2 da FOUNDATION-001 também entram, como H1 e H2.**
- **Base na Brain:** a DEC-02 (Consequências) e o registro da FOUNDATION-001 dizem que B1 a B3 "viram teste automatizado quando o lint for alterado".
- **Custo:** um arquivo pequeno ao lado da rota. O `route.ts` não muda.
- **Limite:** o B2 é automatizado no nível do módulo. O teste confirma que a rota só exporta `GET`, condição em que o Next responde 405 aos outros métodos.
- **O 405 HTTP com servidor rodando** exige uma convenção de teste HTTP, que nasce na primeira rota protegida (AUTH-003). Até lá, vale a evidência manual da FOUNDATION-001.

#### A.5 Seções substituídas

| Parte | Seção da v1 | Novo texto |
|---|---|---|
| Cabeçalho do arquivo | linhas iniciais (Status) | entregue à parte |
| Análise | §1.3; §1.4 (D4); §1.6 (benefício "usuários preservados"); §1.7; §1.8 (R2, R3, R7 e os novos R9 e R10) | G |
| Decisão | §2 e o texto proposto do ADR-003 | G (marcado como histórico) |
| Feature Contract | IDENTIFICAÇÃO; FC-3; FC-4 (só a linha `SUPABASE_URL`); FC-5; FC-6; FC-13; FC-14; FC-18 (primeira frase); FC-19; FC-20 | B |
| BIT | cabeçalho; Arquivos esperados; Contratos (nota); Regras de implementação (itens 4, 5 e 7; novos 12 a 16); ESLint; Dependências; Documentação no código (acréscimo); Testes; Ao entregar | C |
| OT | §6 inteira | D |
| QA | §7 inteira | E |
| Data Task | §4 (registro futuro) | F |
| Dependências | §8 inteira | H |
| Bloqueios | §9 inteira, inclusive "Após o aceite do PO" | I |

**Sem mudança:**
- FC-1, FC-2, FC-7 a FC-12 e FC-15 a FC-17;
- os demais itens de "Regras de implementação";
- "Validações" e "Autorização, transação, auditoria".

#### A.6 Novo status

**READY (versão 2, 2026-10-22).**
- Nenhuma pré-condição de implementação está aberta.
- A feature não toca nenhum ponto A DEFINIR. `tecnico/API`, biblioteca de validação e eventos continuam A DEFINIR, mas a AUTH-001 não usa nenhum deles.
- O que resta (I) pertence a outras features (DEC-06, DEC-07, B8) ou à operação (chaves assimétricas, TTL, confirmação de email).

---

### B. Feature Contract: novo texto

**IDENTIFICAÇÃO**
```text
ID: AUTH-001
DOMÍNIO: auth
NOME: Fundação de Autenticação (verificação da identidade do provedor)
VERSÃO: 2
STATUS: READY (2026-10-22)
```

**FC-3. Pré-condições**
- FOUNDATION-001 implementada, com ARCHITECT REVIEW APPROVED (2026-10-19, `7f26d30`). **Cumprida.**
- ADR-003 aceito (2026-10-21). **Cumprida.**
- DEC-02 decidida (2026-10-22) e especificada neste adendo (C, "Testes"). **Cumprida.**
- No início da implementação, `/backend` está sem alterações locais em relação ao último commit. As verificações do QA comparam diffs e dependem disso.
- A versão do Vitest escolhida suporta o Node local 22.15.1 (RT-FOUND-03).
- **Para operar** (não para implementar, testar nem aprovar):
  - `SUPABASE_URL` = `https://vitqnyzuvrvkmnvshcpb.supabase.co` (DEC-05), configurada pelo PO no ambiente de execução;
  - chaves de assinatura assimétricas ativas no projeto `vitqnyzuvrvkmnvshcpb` (condição do ADR-003, com o PO);
  - TTL do access token definido pelo PO.

**FC-4. Entradas** (substitui só a linha `SUPABASE_URL`)

| Nome | Tipo | Obrigatório | Regra |
|---|---|---|---|
| `SUPABASE_URL` | variável de ambiente (configuração, não entrada da requisição) | sim, para operar | Ver abaixo |

Regra da `SUPABASE_URL`:
- URL absoluta `https:`, com caminho vazio ou `/`;
- sem query, fragmento nem credenciais;
- a barra final é removida;
- valor de operação: `https://vitqnyzuvrvkmnvshcpb.supabase.co` (DEC-05), definido pelo PO no ambiente;
- **nunca** fica fixa no código, em configuração versionada ou nos testes.

**FC-5. Processamento**
1. O handler chama `requireAuthenticatedIdentity(request)`.
2. Ler o header `Authorization`.
   - Ausente, ou vazio depois da normalização feita pelo `Headers`: `AUTH_MISSING_CREDENTIAL`.
   - Nesse caso, o verificador não é chamado.
3. Validar o formato `Bearer <token>`:
   - esquema `Bearer`, sem diferenciar maiúsculas de minúsculas;
   - um único espaço depois do esquema;
   - token não vazio, sem espaço, tab ou vírgula.
   - Fora disso: `AUTH_MALFORMED_CREDENTIAL`, e o verificador não é chamado.
4. Delegar ao verificador da infraestrutura, que:
   - a. carrega a configuração na primeira chamada (`SUPABASE_URL` → issuer e URL do JWKS). Se ela faltar ou for inválida: `AUTH_VERIFICATION_UNAVAILABLE`;
   - b. aceita só `alg` ES256 ou RS256;
   - c. obtém a chave pública pelo `kid`, **somente** do JWKS configurado, usando o cache do `jose`, que é renovado quando aparece um `kid` desconhecido;
   - d. verifica a assinatura;
   - e. exige `iss` igual ao issuer configurado;
   - f. exige que `aud` contenha `authenticated`;
   - g. exige `exp` presente e no futuro, e valida `nbf` quando existir. Os dois têm tolerância de 5 s;
   - h. exige `role` igual a `authenticated`;
   - i. exige `is_anonymous` diferente de `true`;
   - j. exige `sub` presente e no formato UUID canônico 8-4-4-4-12 hexadecimal, sem diferenciar maiúsculas e sem verificar a versão;
   - k. exige `session_id` presente, como string não vazia.
5. Classificar a falha **pela origem**:
   - configuração ausente ou inválida: `AUTH_VERIFICATION_UNAVAILABLE`;
   - erro lançado pelo resolvedor de chave (rede, timeout, resposta diferente de 200, JWKS inválido ou qualquer outro): `AUTH_VERIFICATION_UNAVAILABLE`. **Exceções:** "nenhuma chave correspondente" e "várias chaves correspondentes" seguem o fluxo normal da verificação;
   - `exp` vencido com assinatura válida: `AUTH_TOKEN_EXPIRED`;
   - qualquer outra falha, inclusive erro desconhecido: `AUTH_INVALID_TOKEN`;
   - nenhum caminho de falha devolve identidade.
6. Montar a `AuthenticatedIdentity` só com `sub`, `session_id` e `exp`. Nenhum outro claim é copiado.
7. Devolver a identidade congelada (`Object.freeze`).
   - Um erro lançado pelo verificador chega ao chamador sem alteração.
   - O handler passa a identidade por parâmetro ao caso de uso.

**FC-6. Regras normativas**

Decisões:
- **ADR-003** (aceito em 2026-10-21): itens 1 a 11 e Condições.
- **DEC-05:** o `<SUPABASE_URL>` de operação é `https://vitqnyzuvrvkmnvshcpb.supabase.co`. Então:
  - `iss` = `https://vitqnyzuvrvkmnvshcpb.supabase.co/auth/v1`;
  - JWKS em `https://vitqnyzuvrvkmnvshcpb.supabase.co/auth/v1/.well-known/jwks.json`;
  - o valor chega ao backend só por configuração.
- **DEC-02:** testes com Vitest. O Desenvolvedor escreve os testes dos cenários do QA Contract; o QA revisa e acrescenta casos adversariais.
- **DEC-08:** pacote transitivo não é aprovação. Os testes importam só `vitest`, mais `jose` nos testes da infraestrutura e `eslint` no teste de lint.
- **Registro da FOUNDATION-001:**
  - limites L-01 a L-06 (o L-06 é corrigido aqui);
  - RT-FOUND-01 (condições do audit);
  - D-01 (o `next.config.ts` não muda);
  - verificação mínima de regressão do lint (automatizada aqui).
- **ADR-002:** #Route Handlers, #Regras de negócio, #Runtime, #Supabase e #Multi-tenancy, como na v1.

Segurança e domínio:
- **`seguranca/AUTENTICACAO`:** autenticação não substitui autorização.
- **`04-USUARIOS-E-PERMISSOES#Princípio`** e **ADR-001:** papel + escopo, por relacionamento. Nenhum papel vem do token.
- **`dados/ENTIDADES#Usuário`** e **DATA-DEC-019:** a ligação `users` ↔ `auth.users` é da AUTH-002. A AUTH-001 não persiste nada.
- **`fluxos/FLUXO-CADASTRO-IGREJA` passo 1:** a conta é criada no provedor.
- **`seguranca/RISCOS-DO-LEGADO#S2` e `#S3`:** os riscos ficam nos projetos antigos, mas a regra "email não prova identidade" vale no projeto novo, pelo ADR-003 (item 6).
- **`05-REGRAS-DE-NEGOCIO#SEC-001`:** preservada por construção.
- **`DEC-01`:** `/api/health` continua pública e não usa este mecanismo.

**FC-13. Domínios impactados**
- **Principal:** `auth`.
- **Infraestrutura:** `supabase-auth`.
- **Tooling (`foundation`):**
  - `eslint.config.mjs`: guardas do ADR-003 e correção do L-06;
  - `tsconfig.json`: só o `include`;
  - `package.json` e `package-lock.json`;
  - `vitest.config.mts`;
  - suíte GL;
  - teste da rota de saúde.
- **Secundários de negócio:** nenhum.

**FC-14. Dependências**
- **Estrutura:** a da FOUNDATION-001.
- **Runtime (`dependencies`):** `jose`, com versão exata.
- **Desenvolvimento (`devDependencies`):** `vitest`, com versão exata. Nada mais.
- **Política de versão (vale para as duas):**
  - usar a maior versão estável (sem pre-release) publicada no momento da implementação;
  - ela precisa ser compatível com o Node 22.15.1 e com as dependências já instaladas, sem `--force` nem `--legacy-peer-deps`;
  - gravar a versão sem `^` nem `~` (`--save-exact`);
  - registrar no relatório, inclusive a versão do `vite` resolvida pelo Vitest;
  - se a mais recente não servir, usar a mais recente que sirva e registrar o motivo;
  - se nenhuma servir: IMPLEMENTATION DIVERGENCE.
- **Configuração (só para operar):** `SUPABASE_URL` e o JWKS público do projeto oficial.
- **Proibidas:**
  - da v1: `@supabase/*`, `jsonwebtoken`, `next-auth`/`@auth/*`, `better-auth`, ORM ou driver de Postgres, `zod` ou outra biblioteca de validação, bibliotecas de logging;
  - outros executores de teste: `jest`, `ts-jest`, `@jest/*`, `mocha`, `ava`, `tsx`, `ts-node` e `node:test`;
  - extras do Vitest: `@vitest/*` (coverage, ui, browser) e `vite-tsconfig-paths`;
  - ambientes de DOM: `jsdom` e `happy-dom`;
  - dublês de rede e HTTP: `msw`, `nock`, `supertest` e `undici` como dependência direta;
  - `@testing-library/*`, `@faker-js/*` e qualquer `@types/*` novo;
  - importar diretamente pacote que só existe como transitivo (por exemplo `vite`, `chai` ou `@vitest/expect`), conforme a DEC-08.

**FC-18. Resultado esperado** (substitui só a primeira frase)

`AuthenticatedIdentity`, somente leitura: tipo `Readonly` e objeto congelado (`Object.freeze`). O restante da seção não muda.

**FC-19. Critérios de aceite**
1. Existem só os arquivos de C, "Arquivos esperados". Nada muda fora de `/backend`.
2. Nenhuma rota nova: `/api/health` é a única, o `route.ts` não tem diff, e H1 e H2 passam.
3. Token válido → identidade com **exatamente** `externalUserId`, `sessionId` e `expiresAt`, com os valores certos e o objeto congelado.
4. Só o header `Authorization` é lido. Query, body, cookies e outros headers são ignorados. Com credencial ausente ou malformada, o verificador não é chamado.
5. Toda falha lança `AuthenticationError` com o código da FC-17. Nenhum caminho de falha devolve identidade. O erro do verificador chega ao chamador sem alteração.
6. A chave vem só do JWKS configurado. Só ES256 e RS256 são aceitos. `none` e `HS*` são rejeitados. `jku`, `x5u` e `jwk` são ignorados.
7. `iss`, `aud`, `role`, `exp` e `nbf` (com tolerância de 5 s), `sub` (UUID canônico), `session_id` e `is_anonymous` são validados conforme a FC-5.
8. `AUTH_TOKEN_EXPIRED` só aparece com assinatura válida.
9. Configuração ausente ou inválida, ou falha do resolvedor de chave (exceto as duas exceções da FC-5), gera `AUTH_VERIFICATION_UNAVAILABLE`.
10. Nenhum segredo é usado:
    - a única variável de ambiente lida é `SUPABASE_URL`;
    - o build passa sem ela;
    - nenhuma URL ou ref de projeto aparece no código, na configuração ou nos testes.
11. Token, header e payload nunca aparecem em log, mensagem, propriedade ou `cause` de erro.
12. Guardas de ESLint conforme C, "ESLint":
    - o domínio não importa `next`, `jose` nem `@supabase/*`;
    - `src/app` não importa `jose`, `@supabase/*` nem `infrastructure/supabase-auth`, nem pelo alias, nem por caminho relativo;
    - as guardas da FOUNDATION-001 continuam valendo;
    - há um objeto de configuração por área.
13. As únicas dependências novas são `jose` (runtime) e `vitest` (desenvolvimento), ambas com versão exata.
14. Sem middleware/proxy, AsyncLocalStorage, estado global ou cache de identidade.
15. Verificações que passam:
    - `typecheck`, `lint`, `build` (sem `SUPABASE_URL`) e `test` passam em `/backend`;
    - `npm audit --omit=dev` = 0;
    - `npm audit` não traz advisory além do GHSA-vfj7-8cjw-p6xm.
16. Testes automatizados em Vitest:
    - cobrem B1 a B23, B25, B26, H1, H2 e GL1 a GL12, todos passando;
    - cada caso leva o ID do cenário no nome;
    - nenhum usa rede, projeto real ou usuário real;
    - todos seguem as convenções de C, "Testes".
17. Cabeçalhos didáticos (inclusive nos testes e no `vitest.config.mts`) e comentários RELAÇÃO EXTERNA presentes.
18. Em `/backend`, só os arquivos listados mudam:
    - o `tsconfig.json` muda só no `include`;
    - `next.config.ts`, `.gitignore` e `route.ts` não têm diff.
19. Nenhum acesso a banco, `auth.users` ou `profiles`, nenhum cliente Supabase, e `backend/supabase/` não é criado.
20. L-06 corrigido:
    - `jsx` entra no `files` das duas guardas;
    - os itens 1 e 2 do cabeçalho declaram "Arquivos cobertos";
    - a redação sobre `import()` de tipo está corrigida;
    - os casos `.jsx` da suíte GL passam.
21. Nenhum `eslint-disable` (de linha, de bloco ou de arquivo) nos arquivos da feature. Os testes seguem as mesmas regras e guardas do resto do código.

**FC-20. Fora do escopo**

Autenticação e domínio:
- Endpoints de login, cadastro, logout, refresh, redefinição de senha, confirmação de email, OAuth e MFA.
- Cookies, BFF e CORS.
- Qualquer rota nova.
- Mapeamento HTTP e envelope de erro (DEC-07).
- Usuário do Mescala, tabela `users`, provisionamento (DEC-06), perfil e "quem sou eu".
- Igreja, vínculos, papéis, permissões, ministérios e convites.
- Validação remota (`getUser`), service role e Admin API.
- Logging, auditoria, eventos e rate limit.
- Migração de usuários legados. Ela não existe: pela DATA-DEC-022 (complemento de 2026-10-22), o banco oficial começa vazio.

Configuração e arquivos:
- Painel do Supabase e ambiente: `SUPABASE_URL`, chaves, TTL e confirmação de email ficam com o PO.
- Arquivos `.env*`.
- `backend/supabase/` (config.toml e migrations): é do Analista de Dados (DEC-04).
- Mudanças em `src/`, `supabase/`, `brain-mescala/`, `docs/`, `.claude/` e no `eslint.config.js` da raiz.
- `next.config.ts` (D-01), atualização de Next, ESLint ou TypeScript (D-02) e tratamento do RT-FOUND-01.
- Aceitar `.jsx`, ligar `allowJs` ou alterar `pageExtensions`. O encerramento do L-06 não autoriza nada disso.

Testes:
- Cobertura mínima e relatório de cobertura.
- CI, hooks, modo watch e qualquer script de teste além de `test`.
- Teste HTTP com servidor rodando, inclusive o 405 real do B2 da FOUNDATION-001 (fica para a AUTH-003).
- Testes com banco (FOUNDATION-002).
- Testes de outros arquivos da FOUNDATION-001 além de H1, H2 e da suíte GL.

---

### C. Backend Implementation Task: substituições

**Cabeçalho**
```text
Feature:          AUTH-001 — Fundação de Autenticação (contrato v2)
Domínio:          auth (+ infrastructure/supabase-auth; tooling: foundation)
Responsabilidade: verificar o access token do Supabase Auth e devolver a identidade
                  autenticada; instalar o Vitest; automatizar os cenários B, H e GL;
                  corrigir o L-06.
Pré-requisitos:   cumpridos (FC-3).
```

**Arquivos esperados**
```text
backend/
├── package.json             (alterado: + jose em dependencies; + vitest em devDependencies; + script "test")
├── package-lock.json        (alterado pelo npm)
├── tsconfig.json            (alterado: só o "include" ganha "vitest.config.mts" e "eslint.config.test.ts")
├── eslint.config.mjs        (alterado: ver "ESLint")
├── eslint.config.test.ts    (novo: suíte GL)
├── vitest.config.mts        (novo)
└── src/
    ├── app/api/health/
    │   └── route.test.ts                              (novo: H1, H2; route.ts não muda)
    ├── domains/auth/
    │   ├── authenticated-identity.ts
    │   ├── authentication-error.ts
    │   ├── require-authenticated-identity.ts
    │   └── require-authenticated-identity.test.ts     (B2–B5, B19 sem verificador injetado, B20, B22, B26)
    └── infrastructure/supabase-auth/
        ├── supabase-auth-config.ts
        ├── supabase-auth-config.test.ts               (B19)
        ├── supabase-access-token-verifier.ts
        └── supabase-access-token-verifier.test.ts     (B1, B6–B18, B19 verificador padrão, B21–B23, B25)
```
- Nenhum outro arquivo é criado ou alterado, dentro ou fora de `/backend`.
- Em particular, `next.config.ts`, `.gitignore` e `route.ts` não mudam.

**Contratos**

Sem mudança, exceto que `loadSupabaseAuthConfig()` lança `AuthenticationError` com `AUTH_VERIFICATION_UNAVAILABLE` quando a configuração falta ou é inválida (regra 5).

**Regras de implementação**

Os itens 4, 5 e 7 foram substituídos e os itens 12 a 16 foram acrescentados. Os demais não mudam.

4. **Mapeamento das falhas, pela origem:**
   - configuração ausente ou inválida → `AUTH_VERIFICATION_UNAVAILABLE`;
   - erro lançado pelo resolvedor de chave (`keySet`) → `AUTH_VERIFICATION_UNAVAILABLE`, **exceto** `JWKSNoMatchingKey` e `JWKSMultipleMatchingKeys`, que seguem inalterados para o `jose`;
   - forma sugerida: envolver o `keySet` numa função que marca as falhas de obtenção, sem mexer nessas duas exceções;
   - `JWTExpired` → `AUTH_TOKEN_EXPIRED`;
   - qualquer outro erro, inclusive desconhecido → `AUTH_INVALID_TOKEN`;
   - confira os nomes na versão instalada. Nenhum erro pode resultar em identidade.
5. **Configuração:**
   - ler `SUPABASE_URL` na primeira chamada do verificador padrão;
   - validar: URL absoluta `https:`, caminho vazio ou `/`, sem query, fragmento nem credenciais;
   - derivar `issuer = <origem>/auth/v1` e `jwksUrl = <origem>/auth/v1/.well-known/jwks.json`, sem barra dupla;
   - se a configuração faltar ou for inválida, lançar `AuthenticationError` com `AUTH_VERIFICATION_UNAVAILABLE`. O erro não é guardado em cache: a próxima chamada lê a variável de novo;
   - com configuração válida, criar o JWKS remoto uma vez por processo.
7. **Pare e reporte IMPLEMENTATION DIVERGENCE quando:**
   - a documentação do Supabase Auth em uso indicar que `session_id` pode faltar num token de usuário;
   - o projeto usar um algoritmo assimétrico diferente de ES256 e RS256;
   - o Next interceptar e cachear a requisição do JWKS (regra 6);
   - nenhuma versão do `jose` ou do Vitest atender à política da FC-14;
   - o Vitest ou os tipos dele quebrarem typecheck, lint ou build. Nesse caso, não mude `lib`, `types` nem `skipLibCheck`, e não tire os testes do `tsconfig`;
   - algum caso da suíte GL não se comportar como especificado. Não ajuste o caso para passar;
   - o `npm install` informar vulnerabilidades. Registre o resumo no relatório;
   - a versão instalada do `jose` não tiver equivalente para alguma classe de erro usada na classificação.
12. Nenhuma URL nem ref de projeto no código, na configuração versionada ou nos testes. O valor de `SUPABASE_URL` vem só do ambiente.
13. A identidade devolvida é congelada (`Object.freeze`).
14. `sub`: UUID no formato canônico 8-4-4-4-12 hexadecimal, sem diferenciar maiúsculas e sem verificar a versão.
15. Imports entre áreas (`app`, `domains`, `infrastructure`) usam o alias `@/`. Imports na mesma pasta usam `./`. Vale também para os testes.
16. Código de produção nunca importa `vitest` nem arquivo `*.test.ts`.

**ESLint: `backend/eslint.config.mjs`**

Regras gerais:
- `...nextVitals`, `...nextTs` e `globalIgnores` ficam como estão.
- As guardas ficam em **dois** objetos de configuração, um por área.
- Cada objeto reúne `no-restricted-imports` e `no-restricted-syntax` da sua área. No flat config, um segundo objeto que configure a mesma regra para os mesmos arquivos substitui o primeiro. O caso GL11 prova que isso não aconteceu.

*Guarda 1: `src/domains/**`*
- **`files`:** `src/domains/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}`. O `jsx` é a correção do L-06.
- **Módulos proibidos e mensagens:**
  - `next` e `next/*`: a mensagem atual não muda (`ADR-002: src/domains não pode depender do Next.js.`);
  - `jose`, `jose/*` e `@supabase/*`: mensagem começando por `ADR-003:`, por exemplo `ADR-003: src/domains não depende do provedor de autenticação nem da biblioteca de JWT.`
- **Formas cobertas, para todos esses módulos:**
  - por `no-restricted-imports`: import e export estáticos, inclusive `import type`, `export … from`, `export * from` e `import x = require()`;
  - por `no-restricted-syntax`: `import()` dinâmico com string ou com template sem interpolação, e `import("…")` em posição de tipo. Use os três seletores atuais, com a expressão regular estendida ou com seletores separados por família de módulo, cada um com a sua mensagem.

*Guarda 2: `src/app/**`*
- **`files`:** `src/app/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}`.
  - O `jsx` é a correção do L-06.
  - `mts` e `cts` entram porque a parte 2b precisa cobrir qualquer arquivo que uma rota possa importar, e as duas partes precisam ficar no mesmo objeto.
  - Na parte 2a, isso só pode gerar falso positivo do lado seguro.
- **2a (ADR-002#Runtime, sem mudança):** os dois seletores atuais de `runtime`, com as mensagens atuais.
- **2b (ADR-003, item 8):** proíbe `jose`, `jose/*`, `@supabase/*` e qualquer especificador que contenha o segmento `infrastructure/supabase-auth`.
  - Isso vale para o alias `@/infrastructure/supabase-auth/...` **e** para o caminho relativo. Em `no-restricted-imports`, use um `pattern` com `regex`, por exemplo `(^|/)infrastructure/supabase-auth(/|$)`.
  - Cobre as mesmas formas da guarda 1.
  - A mensagem começa por `ADR-003:`, por exemplo `ADR-003: Route Handlers usam só @/domains/auth; não importam jose, @supabase/* nem infrastructure/supabase-auth.`
- **Continuam permitidos em `src/app/**`:** `next`, `@/domains/**` e os demais caminhos de `@/infrastructure/**`.

*Cabeçalho (substitui o atual)*
- **`FEATURE`:** `FOUNDATION-001; alterado pela AUTH-001 (guardas do ADR-003 e correção do L-06)`.
- **Título da seção:** `GUARDAS DE ARQUITETURA (ADR-002 e ADR-003)`.
- **Item 1:** o que a guarda 1 proíbe, com a origem de cada módulo; as formas cobertas, com a redação abaixo; e `Arquivos cobertos: .ts, .tsx, .mts, .cts, .js, .jsx, .mjs e .cjs.`
- **Item 2:** as partes 2a e 2b; as mesmas formas; e `Arquivos cobertos: .ts, .tsx, .mts, .cts, .js, .jsx, .mjs e .cjs.` Declarar aqui também faz parte do L-06.
- **Redação corrigida das formas (L-06):** "import e export estáticos (inclusive `import type` e `import x = require()`); `import()` dinâmico com especificador string ou template sem interpolação; `import("…")` em posição de tipo, só com string (o TypeScript recusa outro especificador nessa posição). Especificador calculado em tempo de execução não é verificável estaticamente (L-05). `require()` em `.js`/`.cjs` é barrado pela regra herdada `@typescript-eslint/no-require-imports` (L-04)."
- **Uma linha final:** "Regressão: `eslint.config.test.ts` (suíte GL). Toda mudança neste arquivo exige `npm run test`."
- **Comentários:** um comentário curto em cada objeto, citando o ADR-002 e/ou o ADR-003.

**Dependências**

Conforme a FC-14. Comandos:
- `npm install --save-exact jose@<versão>`;
- `npm install --save-dev --save-exact vitest@<versão>`.

**Documentação no código** (acréscimo ao texto da v1)
- Cada arquivo de teste e o `vitest.config.mts` levam um cabeçalho curto com:
  - `ARQUIVO`;
  - `DOMÍNIO` (`auth`, `infrastructure/supabase-auth` ou `foundation`);
  - `FEATURE: AUTH-001`;
  - objetivo;
  - IDs dos cenários cobertos;
  - nos testes de `src/`, uma linha dizendo como rodam sem rede.
- O cabeçalho do `eslint.config.mjs` segue a seção "ESLint".
- Os testes não precisam de comentários RELAÇÃO EXTERNA.

**Testes (Vitest)**

1. **Instalação:** conforme a FC-14. Nenhum outro pacote de teste.
2. **Script:** `"test": "vitest run"` no `backend/package.json`. É uma execução única, sem watch. Nenhum outro script novo.
3. **Configuração `backend/vitest.config.mts`:** extensão `.mts`, para ser ESM explícito, já que o `package.json` não declara `"type": "module"`.
   - `resolve.alias`: `@/` → `<backend>/src/`, equivalente ao `paths` do `tsconfig.json`, calculado a partir de `import.meta.url`. Sem plugin.
   - `test.include`: exatamente `["src/**/*.test.ts", "eslint.config.test.ts"]`.
   - `test.environment: "node"`.
   - `test.globals: false`: cada teste importa `describe`, `it`, `expect` e `vi` de `vitest`.
   - Nada além disso: sem `setupFiles`, `coverage`, `reporters`, `pool`, `env`, `plugins` ou `server.deps`.
4. **Local e nome dos arquivos:**
   - teste de código: `<arquivo-testado>.test.ts`, na mesma pasta do arquivo testado;
   - teste de configuração do `/backend`: na raiz do `/backend`, ao lado do arquivo de configuração (`eslint.config.test.ts`).
   - A lista completa está em "Arquivos esperados".
5. **Nome de cada caso:** começa pelo ID do cenário (`"B6 — …"`, `"H1 — …"`, `"GL9 — …"`).
   - Os casos do QA usam `"QA-<n> — …"`.
   - Um cenário com variantes pode usar `it.each`, mantendo o ID.
6. **Sem rede:** vale para os testes de `domains/auth` e de `infrastructure/supabase-auth`.
   - Em `beforeEach`, o `fetch` global é substituído (`vi.stubGlobal`) por uma função que lança erro.
   - Em `afterEach`, ele é restaurado (`vi.unstubAllGlobals`).
   - Cada arquivo confirma que essa função nunca foi chamada.
   - Os issuers de teste usam o TLD reservado `.invalid`: `https://projeto-teste.supabase.invalid/auth/v1`, e para "outro projeto", `https://outro-projeto.supabase.invalid/auth/v1`.
7. **Chaves e JWKS locais**, no arquivo `supabase-access-token-verifier.test.ts`, em `beforeAll`:
   - gerar com o `jose` um par ES256 (`generateKeyPair("ES256")`), um par RS256 (`generateKeyPair("RS256", { modulusLength: 2048 })`) e um par "do atacante", que fica fora do JWKS;
   - exportar o JWK público com `exportJWK` e acrescentar `kid` (distintos), `alg` e `use: "sig"`;
   - montar `keySet = createLocalJWKSet({ keys: [...] })` e injetá-lo em `createSupabaseAccessTokenVerifier({ issuer, keySet })`;
   - gerar os tokens com `SignJWT`:
     - header `{ alg, kid, typ: "JWT" }`;
     - `sub` UUID fixo, `session_id`, `role: "authenticated"`, `aud: "authenticated"`, `iss` e `iat`;
     - `exp` relativo a `Date.now()`: 600 s no futuro para tokens válidos, 30 s ou mais no passado para vencidos e 2 s para os casos de tolerância;
   - montar à mão o `alg: none` e o payload adulterado, com segmentos base64url (`Buffer.from(...).toString("base64url")`);
   - gerar o HS256 com `SignJWT(...).sign(new TextEncoder().encode(JSON.stringify(jwkPublico)))`;
   - no B18, usar um `keySet` que rejeita com `new TypeError("fetch failed")`, `new errors.JWKSTimeout()` e `new errors.JWKSInvalid()`;
   - manter os utilitários de geração dentro do próprio arquivo de teste.
8. **Ambiente:**
   - `SUPABASE_URL` só é alterada com `vi.stubEnv` (ou salvando e restaurando `process.env`), e é restaurada em `afterEach` (`vi.unstubAllEnvs`);
   - o verificador padrão e o `requireAuthenticatedIdentity` sem verificador injetado só são chamados com configuração ausente ou inválida. Assim, falham antes de criar o JWKS remoto;
   - a derivação de uma configuração válida é testada chamando `loadSupabaseAuthConfig()` diretamente, com `https://projeto-teste.supabase.invalid` e com `https://projeto-teste.supabase.invalid/`.
9. **Suíte GL** (`eslint.config.test.ts`):
   - criar uma instância `new ESLint({ cwd: <backend> })` em `beforeAll`, com a configuração real do repositório: sem `overrideConfig` nem `overrideConfigFile`;
   - em cada caso, rodar `lintText(codigo, { filePath: <backend>/<caminho virtual> })`. Nada é gravado em disco;
   - asserções conforme E.5;
   - o arquivo pode ter tempo limite próprio de até 60 s, por causa da carga dos plugins.
10. **Proibido nos testes:**
    - `vi.mock` e `vi.doMock` de `jose` ou de módulos do projeto. Use a injeção prevista nos contratos;
    - snapshots;
    - `.only`, `.skip` e `.todo`;
    - espera real (`sleep`);
    - ler `.env*`;
    - rede, projeto real ou usuário real;
    - `node:test`;
    - APIs que não existem no Node 22.15.1 (RT-FOUND-03).
11. **Typecheck, lint e build:**
    - **`tsconfig.json`:** o `src/**/*.ts` já inclui os testes de `src/`. Acrescentar ao `include` só `"vitest.config.mts"` e `"eslint.config.test.ts"`. Nenhuma outra opção muda: não acrescentar `vitest/globals` a `types` e não criar outro `tsconfig`.
    - **ESLint:** os testes são lintados como o resto do código (`eslint .`), sob as mesmas guardas. Nenhuma exceção para testes no `eslint.config.mjs` e nenhum `eslint-disable`.
    - **Build:** o `next build` faz o typecheck pelo mesmo `tsconfig` e precisa passar com os testes incluídos. Nenhum teste é importado por rota, então nada de teste entra no bundle. Depois do build, o `tsconfig.json` não pode ter sido reescrito pelo Next.

**Ao entregar**
- Rodar em `/backend`: `npm run typecheck`, `npm run lint`, `npm run build` (sem `SUPABASE_URL` no ambiente) e `npm run test`.
- Conferir `git diff --stat`:
  - só aparecem os arquivos de "Arquivos esperados";
  - o `tsconfig.json` tem só as duas entradas novas, mesmo depois do build;
  - `next.config.ts`, `.gitignore` e `route.ts` não têm diff.
- Registrar no relatório:
  - as versões exatas do `jose`, do `vitest` e do `vite` resolvido;
  - o resumo de vulnerabilidades impresso pelo `npm install`;
  - a quantidade de casos por arquivo de teste;
  - o mapa cenário → teste (B, H, GL);
  - o resultado de cada comando;
  - qualquer IMPLEMENTATION DIVERGENCE.
- Não fazer commit nem deploy, não criar `.env*` e não configurar `SUPABASE_URL`.

---

### D. Organization Task (substitui a seção 6)

**Localização**
- **Domínio principal:** `auth`, em `backend/src/domains/auth/`.
- **Infraestrutura:** `backend/src/infrastructure/supabase-auth/`.
- **Tooling (`foundation`):**
  - na raiz do `/backend`: `eslint.config.mjs`, `eslint.config.test.ts`, `vitest.config.mts`, `tsconfig.json`, `package.json` e `package-lock.json`;
  - o teste da rota de saúde, em `backend/src/app/api/health/route.test.ts`.
- **Secundários:** nenhum.
- **Estrutura esperada:** a árvore de C, "Arquivos esperados".

**Convenção de testes (vale a partir desta feature)**
- Teste de código: `<arquivo>.test.ts`, na mesma pasta do arquivo testado.
- Teste de configuração do `/backend`: na raiz do `/backend`, ao lado da configuração.
- Extensão sempre `.test.ts`. Não usar `.spec.ts`, `.test.tsx` nem `.test.js`.
- Proibido criar:
  - `__tests__/`, `tests/`, `test/` ou `spec/`;
  - `test-utils/`, `helpers/`, `fixtures/`, `mocks/`, `__mocks__/` ou `__snapshots__/`;
  - arquivos `setup*`.
- Utilitários de teste ficam dentro do próprio arquivo de teste.

**Dependências permitidas**
- `app/api/**` (futuro) → `@/domains/auth/*`, só pela API pública: `requireAuthenticatedIdentity`, os tipos e o erro.
- `domains/auth/require-authenticated-identity.ts` → `@/infrastructure/supabase-auth/supabase-access-token-verifier` (composição padrão).
- `infrastructure/supabase-auth/*` → `@/domains/auth/authenticated-identity` e `@/domains/auth/authentication-error`; e → `jose`.
- `src/domains/auth/*.test.ts` → módulos da própria pasta (`./`), `vitest` e `node:*`.
- `src/infrastructure/supabase-auth/*.test.ts` → módulos da própria pasta (`./`), tipos e erro de `@/domains/auth`, `jose`, `vitest` e `node:*`.
- `src/app/api/health/route.test.ts` → `./route` e `vitest`.
- `eslint.config.test.ts` → `eslint`, `vitest` e `node:*`.
- `vitest.config.mts` → `vitest/config` e `node:*`.

**Dependências proibidas**
- `domains/**` → `next`, `jose`, `@supabase/*`.
- `app/**` → `jose`, `@supabase/*` ou `infrastructure/supabase-auth`, pelo alias ou por caminho relativo.
- Código de produção → `vitest` ou arquivos `*.test.ts`.
- Testes → pacotes só transitivos (`vite`, `chai`, `@vitest/*`) ou módulos de outras áreas além dos listados acima.
- `eslint.config.test.ts` → `src/**` ou `./eslint.config.mjs`. O teste usa a configuração por meio do próprio ESLint.
- Qualquer arquivo → `../src` (frontend legado) ou `../supabase`.
- Ciclo entre arquivos.

**Possíveis violações estruturais**
- Verificação de token dentro de Route Handler, `middleware.*` ou `proxy.*`. Também `backend/app/`, `pages/` ou `src/pages/` (L-02).
- Tipos de autenticação em `shared/`, `lib/`, `utils/` ou `helpers/`.
- Cliente genérico `infrastructure/supabase/` ou `supabase-js`.
- Barrels (`index.ts`), pastas vazias e `.gitkeep`.
- Helper de resposta HTTP de erro.
- Rota nova.
- Arquivo `.env*`.
- Arquivo de exemplo com violações das guardas gravado em disco: quebraria o `npm run lint`. A suíte GL usa caminho virtual.
- Configurações extras de teste: outro arquivo de teste na raiz além de `eslint.config.test.ts`, `vitest.config.ts`/`.js`, `vitest.workspace.*`, pasta `coverage/` ou `setupFiles`.
- `.jsx` em qualquer lugar de `backend/src`.
- `backend/supabase/`.

O Organizador não muda regra. Problema funcional volta ao Arquiteto.

---

### E. QA Contract (substitui a seção 7)

Validar contra:
- o Feature Contract AUTH-001 v2;
- o ADR-003;
- a DEC-02;
- o registro da FOUNDATION-001.

Os testes dos cenários B, H e GL são escritos pelo Desenvolvedor (DEC-02). O QA revisa esses testes e acrescenta casos adversariais (E.8).

#### E.1 Validação estática

| ID | Cenário | Critério |
|---|---|---|
| S1 | Arquivos e locais conforme o OT; nada fora de `/backend`; em `/backend`, só os arquivos listados | 1, 18 |
| S2 | `/api/health` é a única rota; `route.ts` sem diff; sem `middleware.*`, `proxy.*`, `backend/app/`, `pages/` nem `src/pages/` (L-02) | 2, 14 |
| S3 | Dependências novas: só `jose` (`dependencies`) e `vitest` (`devDependencies`), sem `^` nem `~`; nenhuma proibida (FC-14); nenhum import de pacote só transitivo (DEC-08) | 13 |
| S4 | `eslint.config.mjs` conforme a seção "ESLint" de C: um objeto de guarda por área; `jsx` nos dois `files`; mensagens com `ADR-002` ou `ADR-003`; cabeçalho com "Arquivos cobertos" nos itens 1 e 2 e com a redação corrigida | 12, 20 |
| S5 | Só `SUPABASE_URL` é lida; nenhum segredo; nenhum `.env*`; nenhuma ocorrência de `vitqnyzuvrvkmnvshcpb` ou de URL de projeto no código, nos testes ou na configuração | 10 |
| S6 | Token, header e payload nunca em `console`, mensagem, propriedade ou `cause` de erro | 11 |
| S7 | Lista fechada de algoritmos; nada de `jku`, `x5u` ou `jwk`; JWKS e issuer só da configuração | 6 |
| S8 | Identidade com só 3 campos e congelada; nenhuma leitura de `email`, `app_metadata` ou `user_metadata` para identidade ou autorização | 3 |
| S9 | Sem AsyncLocalStorage, estado global ou cache de identidade | 14 |
| S10 | Sem banco, `auth.users`, `profiles` ou cliente Supabase; `backend/supabase/` não existe | 19 |
| S11 | Cabeçalhos didáticos (inclusive nos testes e no `vitest.config.mts`) e comentários RELAÇÃO EXTERNA | 17 |
| S12 | Sem ciclo; imports conforme o OT, inclusive nos testes; convenção `@/` × `./` | 12 |
| S13 | Convenções de teste: local e nome dos arquivos; ID no nome de cada caso; sem `.only`, `.skip` ou `.todo`; sem `vi.mock` de `jose` ou de módulos do projeto; sem snapshots; sem pastas genéricas | 16 |
| S14 | `vitest.config.mts` conforme o item 3 de "Testes"; script `test` = `vitest run` | 15, 16 |
| S15 | `tsconfig.json` com diff só no `include` (2 entradas); `next.config.ts` e `.gitignore` sem diff | 18 |
| S16 | Nenhum `eslint-disable` nos arquivos da feature | 21 |
| S17 | Nenhum `.jsx` em `backend/src` | 20 |
| S18 | Classificação de falha pela origem (FC-5, passo 5) e regra 6 (requisição do JWKS fora do cache de dados do Next) | 9 |

#### E.2 Validação por ferramentas

| ID | Cenário | Critério |
|---|---|---|
| T1 | `npm run typecheck` | 15 |
| T2 | `npm run lint` | 15 |
| T3 | `npm run build` sem `SUPABASE_URL` no ambiente; depois, `git diff backend/tsconfig.json` igual ao esperado | 10, 15, 18 |
| T4 | `npm run test`: ao menos os 5 arquivos encontrados; 0 falhas; 0 casos pulados | 15, 16 |
| T5 | `npm run lint` na raiz não traz caminhos `backend/` | 18 |
| T6 | `npm audit --omit=dev` = 0 | 15 |
| T7 | `npm audit` sem advisory além do GHSA-vfj7-8cjw-p6xm (RT-FOUND-01) | 15 |

#### E.3 Testes automatizados da AUTH-001 (cenários B)

Chaves ES256 e RS256 geradas no teste, JWKS local, issuer `.invalid` e `fetch` bloqueado. Sem rede, sem projeto real e sem usuários reais.

Arquivos de teste:
- **[D]:** `src/domains/auth/require-authenticated-identity.test.ts`;
- **[V]:** `src/infrastructure/supabase-auth/supabase-access-token-verifier.test.ts`;
- **[C]:** `src/infrastructure/supabase-auth/supabase-auth-config.test.ts`.

| ID | Cenário | Esperado | Arquivo |
|---|---|---|---|
| B1 | Token válido, ES256 e RS256 | `externalUserId = sub`, `sessionId = session_id`, `expiresAt = new Date(exp * 1000)`; exatamente 3 chaves; objeto congelado | V |
| B2 | Sem `Authorization` | `AUTH_MISSING_CREDENTIAL`; verificador não chamado | D |
| B3 | `Authorization` vazio ou só com espaços | `AUTH_MISSING_CREDENTIAL`; verificador não chamado | D |
| B4 | Formatos inválidos (lista abaixo da tabela) | `AUTH_MALFORMED_CREDENTIAL`; verificador não chamado | D |
| B5 | `bearer abc`; `BEARER abc` | Aceito; verificador chamado uma vez, com exatamente `abc`; devolve a identidade do verificador | D |
| B6 | `exp` vencido há 30 s ou mais, com assinatura válida | `AUTH_TOKEN_EXPIRED` | V |
| B7 | `exp` vencido, com assinatura inválida | `AUTH_INVALID_TOKEN` | V |
| B8 | `nbf` 30 s ou mais no futuro; sem `exp` | `AUTH_INVALID_TOKEN` | V |
| B9 | Payload adulterado, com a assinatura original | `AUTH_INVALID_TOKEN` | V |
| B10 | Chave fora do JWKS: `kid` desconhecido; `kid` do JWKS com assinatura do atacante; header com `jwk` ou `jku` apontando para a chave do atacante | `AUTH_INVALID_TOKEN` | V |
| B11 | `alg: none` | `AUTH_INVALID_TOKEN` | V |
| B12 | HS256, inclusive com o JWK público serializado como segredo | `AUTH_INVALID_TOKEN` | V |
| B13 | `iss` de outro projeto; sem `iss` | `AUTH_INVALID_TOKEN` | V |
| B14 | `aud` diferente; sem `aud` | `AUTH_INVALID_TOKEN`. `aud` em lista que contém `authenticated`: aceito | V |
| B15 | `role` `anon`, `service_role` ou ausente | `AUTH_INVALID_TOKEN` | V |
| B16 | `is_anonymous: true` | `AUTH_INVALID_TOKEN`. `false` ou ausente: aceito | V |
| B17 | Sem `sub`; `sub` que não é UUID; sem `session_id`; `session_id` vazio ou não string | `AUTH_INVALID_TOKEN` | V |
| B18 | Resolvedor injetado rejeita com `TypeError("fetch failed")`, `JWKSTimeout` ou `JWKSInvalid` | `AUTH_VERIFICATION_UNAVAILABLE`; nunca identidade | V |
| B19 | Configuração ausente ou inválida; derivação a partir de configuração válida | Detalhes abaixo da tabela | C, V, D |
| B20 | Token só em query, cookie, `x-user-id` ou body | `AUTH_MISSING_CREDENTIAL`; verificador não chamado | D |
| B21 | Token com `email`, `phone`, `app_metadata`, `user_metadata` e claims extras | A identidade não os contém (3 chaves) | V |
| B22 | Em todo caso de falha de B2 a B19: mensagem, `String(erro)`, propriedades próprias (inclusive não enumeráveis) e cadeia de `cause` | Nenhum contém o token nem o header | D, V |
| B23 | JWKS com duas chaves (ES256 e RS256, `kid` distintos) | Tokens das duas aceitos | V |
| B24 | Guardas de ESLint | Substituído pela suíte GL (E.5) | — |
| B25 | Tolerância: `exp` vencido há 2 s; `nbf` 2 s no futuro | Aceitos | V |
| B26 | `AuthenticationError` lançado pelo verificador injetado | Chega ao chamador sem alteração (mesma instância e código) | D |

Formatos do B4:
- `Bearer`;
- `Bearer ` (o `Headers` normaliza para `Bearer`);
- `Basic dXNlcjpwYXNz`;
- `Token abc`;
- `Bearer a b`;
- `Bearer  abc` (dois espaços);
- `Bearer\tabc`;
- `Bearer a,b`;
- dois headers `Authorization`.

Detalhes do B19:
- **Valores inválidos:** `SUPABASE_URL` ausente, vazia, que não é URL, com `http:`, ou com caminho, query, fragmento ou credenciais.
- **Com valor inválido:**
  - [C] `loadSupabaseAuthConfig` lança `AUTH_VERIFICATION_UNAVAILABLE`;
  - [V] o `verifySupabaseAccessToken` padrão devolve `AUTH_VERIFICATION_UNAVAILABLE`;
  - [D] o `requireAuthenticatedIdentity` sem verificador injetado devolve `AUTH_VERIFICATION_UNAVAILABLE`.
- **Com valor válido** ([C], com e sem barra final): issuer `…/auth/v1` e JWKS `…/auth/v1/.well-known/jwks.json`.

#### E.4 Testes automatizados da FOUNDATION-001 (B1 e B2)

Arquivo: `src/app/api/health/route.test.ts`.

| ID | Cenário | Esperado |
|---|---|---|
| H1 | `GET()` de `src/app/api/health/route.ts` | Status 200; `content-type` começa por `application/json`; corpo igual a `{"status":"ok"}` |
| H2 | Exportações do módulo `route.ts` | O único método HTTP exportado é `GET`: nenhum de `HEAD`, `POST`, `PUT`, `PATCH`, `DELETE` ou `OPTIONS` |

#### E.5 Suíte GL: regressão das guardas de lint

A suíte cobre o B3 da FOUNDATION-001, o B24 da AUTH-001 e o L-06.

Como funciona:
- Fica no arquivo `backend/eslint.config.test.ts`.
- Cada caso roda `lintText` com caminho virtual, contra a configuração real.
- Em todos os casos, nenhuma mensagem pode ser `fatal`.

Legenda da tabela:
- **"Acusa":** ao menos uma mensagem com severidade 2, da regra `no-restricted-imports` ou `no-restricted-syntax`, com a tag indicada no texto.
- **"Não acusa":** nenhuma mensagem dessas duas regras.
- **M:** o módulo do caso.
- **`import()`:** fica dentro de uma função assíncrona exportada (por exemplo, `export async function f() { return import("M"); }`), para não depender de top-level await.

| ID | Caminho virtual | Código | Esperado |
|---|---|---|---|
| GL1 | `src/domains/probe/probe.ts` | Para M ∈ {`next`, `next/server`}: `import x from "M"`; `import "M"`; `import type { X } from "M"`; `export { x } from "M"`; `export * from "M"`; `import s = require("M")`; `import("M")`; ``import(`M`)``; `type T = import("M").X` | Acusa, `ADR-002` |
| GL2 | Idem | As mesmas formas, para M ∈ {`jose`, `jose/qualquer`, `@supabase/supabase-js`} | Acusa, `ADR-003` |
| GL3 | `src/domains/probe/probe.<ext>`, com ext ∈ {`tsx`, `mts`, `cts`, `js`, `jsx`, `mjs`} | `import x from "next/server"`; `import x from "jose"`; `import()` de `next/server` e de `jose`. Em `js`, `jsx` e `mjs`, também com template sem interpolação | Acusa, com `ADR-002` ou `ADR-003` conforme o módulo |
| GL4 | `src/domains/probe/probe.js` e `.cjs` | `require("next/server")`; `require("jose")`. No `.cjs`, também `import("next/server")` dentro de função | `require`: severidade 2 de qualquer regra (L-04). `import()`: acusa |
| GL5 | `src/domains/probe/probe.ts` | `next-auth`, `nextSomething`, `@next/env`, `./next`, `../next`, `node:crypto`, ``import(`next/${x}`)``, `joseph`, `./jose`, `@supabase-community/x`, `@/domains/auth/authentication-error`, `@/infrastructure/supabase-auth/supabase-access-token-verifier` | Não acusa |
| GL6 | `src/app/api/probe/route.ts` | `export const runtime = "edge"`; `= "experimental-edge"`; `const runtime = "nodejs"; export { runtime }`; `export { runtime } from "./x"` | Acusa, `ADR-002` |
| GL7 | `src/app/api/probe/route.<ext>`, com ext ∈ {`tsx`, `mts`, `js`, `jsx`, `mjs`} | `export const runtime = "edge"` | Acusa, `ADR-002` |
| GL8 | `src/app/api/probe/route.ts` | `export const runtime = "nodejs"`; `import { NextResponse } from "next/server"`; `import { requireAuthenticatedIdentity } from "@/domains/auth/require-authenticated-identity"`; `import type { AuthenticatedIdentity } from "@/domains/auth/authenticated-identity"` | Não acusa |
| GL9 | `src/app/api/probe/route.ts` | `import { jwtVerify } from "jose"`; `import type { JWTPayload } from "jose"`; `import x from "jose/qualquer"`; `import { createClient } from "@supabase/supabase-js"`; `import { verifySupabaseAccessToken } from "@/infrastructure/supabase-auth/supabase-access-token-verifier"`; `import { loadSupabaseAuthConfig } from "../../../infrastructure/supabase-auth/supabase-auth-config"`; `import("jose")`; ``import(`jose`)``; `import("@/infrastructure/supabase-auth/supabase-auth-config")`; `type T = import("jose").JWTPayload` | Acusa, `ADR-003` |
| GL10 | `src/app/api/probe/route.<ext>`, com ext ∈ {`js`, `jsx`, `mts`} | `import { jwtVerify } from "jose"`; `import x from "@/infrastructure/supabase-auth/supabase-auth-config"` | Acusa, `ADR-003` |
| GL11 | Soma das restrições | No domínio: `import "next/server"; import "jose";`. No app: `export const runtime = "edge"; import { jwtVerify } from "jose";` | Em cada caso, duas mensagens: uma com `ADR-002` e uma com `ADR-003` |
| GL12 | `src/infrastructure/supabase-auth/probe.ts` | `import { jwtVerify } from "jose"` | Não acusa |

Correspondência com a origem dos casos:
- **Sondagens R4 e R5 e os dois casos extras do registro da FOUNDATION-001 (B3):** GL1, GL3 (casos de `next`), GL4, os sete primeiros itens do GL5, GL6 e GL7.
- **L-06:** os casos `.jsx` do GL3 e do GL7.
- **B24 da AUTH-001:** GL2, os demais itens do GL5, e GL8 a GL12.

#### E.6 Cenários com banco

Nenhum.

#### E.7 Não executáveis
- **Integração real com o JWKS do projeto oficial:** NOT TESTED. Fica para a AUTH-003, a primeira rota protegida.
- **Chaves assimétricas, TTL e confirmação de email no projeto novo:** verificação do PO.
- **405 HTTP real do B2 da FOUNDATION-001:** só com servidor rodando, na AUTH-003. O H2 cobre o nível do módulo.
- **Regra 6 (cache de dados do Next sobre o `fetch` do JWKS):** o `fetch` do Next não existe no Vitest. Fica com a revisão estática (S18) e a verificação na AUTH-003.

#### E.8 Casos adversariais do QA
- O QA pode acrescentar casos nos mesmos arquivos ou em um `*.test.ts` novo ao lado do arquivo testado, com nome `QA-<n> — …`.
- Não altera `vitest.config.mts`, `package.json`, `tsconfig.json` nem código de produção.
- Alvos sugeridos:
  - caracteres de controle e Unicode no header;
  - token muito grande;
  - `exp` ou `nbf` não numéricos;
  - `aud` como lista vazia;
  - `crit` desconhecido no header;
  - `sub` UUID em maiúsculas (deve ser aceito);
  - combinações de B13 a B17 no mesmo token.

#### E.9 Cenários padrão

| Cenário | Cobertura |
|---|---|
| Happy path | B1, B5, B23, B25, H1 |
| Invalid input | B2–B4, B19 |
| Unauthorized | B6–B17, B20 |
| Forbidden | Não se aplica (não há autorização) |
| Cross-tenant | Não se aplica. O equivalente é token de outro projeto (B13) + S8 |
| Transaction rollback | Não se aplica |
| Dependency failure | B18, B19 |
| Regression | H1, H2, suíte GL, T2, T3, T5, S2, S15 |

---

### F. Data Task (substitui o registro futuro da seção 4)

A AUTH-001 continua sem DATA TASK. O texto abaixo é registro para a AUTH-002. **Não encaminhar ao Analista de Dados.**

```text
REQUISITO CONCEITUAL FUTURO — Usuário do Mescala (AUTH-002)

Entidade:   users (DATA-DEC-019, opção A). Global, sem church_id.
            Schema dedicado fora da Data API (DATA-DEC-020; nome do schema A DEFINIR).
Ligação:    auth_user_id UNIQUE, com FK para auth.users do projeto
            vitqnyzuvrvkmnvshcpb (DATA-DEC-019 + DEC-05).
            1:1 com externalUserId (= sub). Obrigatória e imutável.
Atributos:  DATA-DEC-013.
Status ou revogação do usuário: A DEFINIR (bloqueio B8).
Restrição a preservar:
  - excluir a conta no provedor não pode apagar histórico
    (05-REGRAS-DE-NEGOCIO#HIS-001, DATA-DEC-012). O comportamento da FK
    na exclusão é decidido no contrato da AUTH-002, dentro desse limite.
Migração do legado: não existe (DATA-DEC-022, complemento de 2026-10-22:
            o banco oficial começa vazio).
Migrations: backend/supabase/migrations/ (DEC-04, parte 1), aplicadas pelo PO.

O QUE AINDA FALTA:
  - DEC-06 (como o registro nasce);
  - contrato FOUNDATION-002 e autorização explícita da Fase 4;
  - DEC-04, parte 2 (ferramenta de acesso ao banco), para o código da AUTH-002.
```

---

### G. Notas sobre a análise da v1 (§1 e §2)

- **§1.3** retrata o repositório em 2026-10-06, quando `/backend` ainda não existia. O estado atual está em A.2.
- **§1.4:**
  - D4 está **resolvida** quanto ao backend oficial pela DEC-05 (projeto novo `vitqnyzuvrvkmnvshcpb`). Os projetos antigos ficam só para o legado.
  - D5 foi corrigida pelo vault-brain em 2026-10-20.
- **§1.6:**
  - O benefício "usuários reais preservados" e a migração 1:1 de `profiles + auth.users` deixaram de valer (DEC-05; DATA-DEC-022, complemento de 2026-10-22).
  - A escolha da opção A continua sustentada pelos demais critérios da comparação.
  - A observação sobre a DATA-DEC-020 está resolvida: foi escolhida a opção A (acesso direto ao Postgres com papel sem BYPASSRLS), compatível com este contrato.
- **§1.7 (substituído):**
  - DEPENDS_ON: FOUNDATION-001, ADR-003 e DEC-02, todas cumpridas.
  - Para operar: `SUPABASE_URL` configurada e chaves assimétricas ativas no projeto novo.
- **§1.8, riscos:**
  - **R2 (reescrito):** o pool de identidades do projeto novo não é compartilhado com o legado. O risco que resta é a confirmação de email desligada no projeto novo, que é condição do ADR-003 e está com o PO. Mitigação: email nunca prova identidade (ADR-003, item 6).
  - **R3:** encerrado (DEC-05).
  - **R7:** resolvido. Os cenários B, H e GL são obrigatórios na entrega.
  - **R9 (novo):** a suíte GL pode passar por engano, por erro de parse ou por erro de outra regra. Mitigação: as asserções exigem a regra certa, a tag na mensagem e ausência de `fatal`.
  - **R10 (novo):** o Vitest ou os tipos dele podem ser incompatíveis com TypeScript 6.0.3, Next 16.4.2 ou Node 22.15.1. Mitigação: política de versão (FC-14) e IMPLEMENTATION DIVERGENCE, sem mexer em `lib`, `types` ou `skipLibCheck`.
  - **R1, R4, R5, R6 e R8:** sem mudança.
- **§2 e "Texto proposto: ADR-003":** são histórico. A fonte normativa é `brain-mescala/decisoes/ADR-003-AUTENTICACAO.md`, aceito em 2026-10-21.

---

### H. Dependências entre features (substitui a seção 8)

```text
FOUNDATION-001 (APPROVED 2026-10-19, 7f26d30)
   ├──► AUTH-001 Fundação de Autenticação            [READY v2; sem banco]
   └──► FOUNDATION-002 Fundação de Persistência      [contrato não emitido; DEC-04 parte 2;
             │                                         autorização da Fase 4; lacunas do registro
             │                                         de 2026-10-21 (nome do schema etc.)]
   AUTH-001 ─┴──► AUTH-002 Provisionamento do Usuário do Mescala  [DEC-06]
                      ▼                               (DATA-DEC-013/018/019/020 decididas)
                  AUTH-003 Usuário Atual + primeira rota protegida  [DEC-07; B8;
                      ▼                               teste HTTP com servidor, incluindo o 405 real]
                  CHURCH-001 Criar Igreja (o criador vira OWNER)  [pendências próprias,
                      ▼                               por exemplo o status da Igreja, A DEFINIR]
                  CHURCH-002 Contexto de Igreja (igreja atual, DATA-DEC-006)  [DEC-07]
                      ▼
                  ministérios, membros, programações, escalas…
```

- A AUTH-001 roda em paralelo à FOUNDATION-002, porque não usa banco.
- Se a DEC-06 escolher criar o usuário na primeira requisição (JIT), a AUTH-002 e a AUTH-003 se fundem.

**AUTH-001**
- **DEPENDS_ON:** FOUNDATION-001, ADR-003 e DEC-02. Todas cumpridas.
- **BLOCKS:** AUTH-002, AUTH-003, CHURCH-001, CHURCH-002 e toda rota protegida.
- **RELATED_TO:**
  - FOUNDATION-001: o L-06 é corrigido aqui, e B1 a B3 são automatizados aqui (H1, H2 e suíte GL);
  - DEC-05, necessária para operar;
  - DEC-08;
  - RT-FOUND-01 (condições do audit);
  - DATA-DEC-019 e DATA-DEC-020, nas features seguintes;
  - DATA-DEC-011: convites dependem da confirmação de email ligada e de uma decisão sobre a Admin API;
  - toda feature futura que alterar o `eslint.config.mjs` herda a suíte GL e precisa estendê-la.
- **Saiu de RELATED_TO:** a DATA-DEC-023. Ela não se aplica desde 2026-10-22, e o pool do projeto novo não é compartilhado com o legado.

---

### I. Bloqueios (substitui a seção 9)

| # | Item | Situação em 2026-10-22 | Bloqueia a AUTH-001? |
|---|---|---|---|
| B1 | DEC-03 (autenticação) | **Resolvido:** ADR-003 aceito em 2026-10-21 | Não |
| B2 | DEC-02 (testes) | **Resolvido:** Vitest, decidido em 2026-10-22 e especificado neste adendo | Não |
| B3 | FOUNDATION-001 | **Resolvido:** APPROVED em 2026-10-19 (`7f26d30`) | Não |
| B4 | DEC-05 / D4 | **Resolvido:** projeto novo `vitqnyzuvrvkmnvshcpb`; D4 encerrada quanto ao backend oficial | Não |
| B5 | Chaves assimétricas e TTL no projeto novo | **Aberto, com o PO** (condição do ADR-003) | Não; é condição de operação |
| B6 | Confirmação de email em produção | **Aberto, com o PO** (condição do ADR-003) | Não |
| B7 | DEC-06 (provisionamento) | **Aberto** | Não. Bloqueia a AUTH-002 |
| B8 | Revogação do usuário no domínio | **Aberto, A DEFINIR** (`decisoes/PENDENCIAS#AUTH-001`; `seguranca/AUTENTICACAO`) | Não. Bloqueia a AUTH-003 |
| B9 | DEC-07 (padrão HTTP de erros) | **Aberto** | Não. Bloqueia a AUTH-003 |
| B10 | Dados para a AUTH-002 | **Parcial** | Não |

Detalhes:
- **B5:**
  - Até a verificação do PO, o backend em operação rejeita todos os tokens (falha fechada).
  - Sem chave assimétrica, o ADR-003 precisa ser revisto para validação remota antes da AUTH-003.
- **B6:**
  - O indício de 2026-10-06 vinha do `.env` do legado e não diz nada sobre o projeto novo.
  - O item bloqueia features que usem email como evidência, como convites.
- **B10:**
  - Já decididos: DATA-DEC-013, 018, 019 e 020, e a DEC-04 parte 1.
  - Ainda faltam: contrato FOUNDATION-002, autorização da Fase 4, DEC-06 e, para o código, a DEC-04 parte 2.
  - Não há migração de dados do legado.

**Nenhum BLOQUEIO DE DOMÍNIO novo.** A AUTH-001 v2 não toca nenhum ponto A DEFINIR.

O parágrafo "Após o aceite do PO (não executado)" da v1 está superado: o vault-brain gravou o ADR-003 e atualizou as notas em 2026-10-21.

Parei aqui. Não encaminhei nada aos executores.

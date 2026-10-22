---
tipo: seguranca
status: ativo
atualizado: 2026-10-22
relacionado:
  - "[[decisoes/ADR-003-AUTENTICACAO]]"
  - "[[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]"
  - "[[seguranca/AUTORIZACAO]]"
  - "[[features/AUTH-001]]"
---
# Autenticação
Define como usuários provam sua identidade.

Provider e mecanismo: **decididos** pelo [[decisoes/ADR-003-AUTENTICACAO|ADR-003]], aceito em 2026-10-21 (resolve a DEC-03). Até essa data, estavam **A DEFINIR**.

Autenticação não substitui [[seguranca/AUTORIZACAO|Autorização]].

## Provedor
**Supabase Auth do projeto oficial** `vitqnyzuvrvkmnvshcpb` ([[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]). Ele cadastra contas, guarda e verifica credenciais, confirma email, recupera senha e emite e renova sessões.

## Mecanismo
Resumo do [[decisoes/ADR-003-AUTENTICACAO#Decisão|ADR-003]]:
- **Backend como resource server sem estado:** não recebe senha nem refresh token, não emite token e não guarda sessão.
- **Transporte:** somente `Authorization: Bearer <access_token>`.
- **Validação:** local, a cada requisição, pela assinatura assimétrica verificada com o JWKS público do projeto, com a biblioteca `jose`. Aceita ES256 e RS256; rejeita `none` e HS*.
- **Aceitação:** `iss`, `aud`, `role` = `authenticated`, `exp` (tolerância de 5 s), `sub` UUID, `session_id` presente e `is_anonymous` diferente de `true`.
- **Identidade:** o `sub` é o identificador externo (`externalUserId`), **não** o usuário do Mescala. Email e metadata não são prova de identidade.
- **Autorização fora do token:** papéis, vínculos, igreja e permissões vêm do banco do Mescala, nunca do token.
- **Ponto único:** `domains/auth`, chamado explicitamente pelos Route Handlers, sem middleware.
- **Sem segredos** no backend para autenticar (nada de service role, secret key ou segredo JWT legado).
- **Revogação:** logout, ban ou exclusão no provedor só valem no backend quando o access token expira.
- **Falha fechada:** sem configuração ou sem JWKS, nenhuma requisição é autenticada.

## Usuário do Mescala
O usuário do Mescala é uma tabela própria (`users`), ligada ao `auth.users` do projeto oficial por uma coluna ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-019 — Identidade × provedor de autenticação|DATA-DEC-019]]). Como o registro nasce está em aberto ([[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]]).

## Condições operacionais (com o PO)
- Chaves de assinatura assimétricas ativas no projeto novo. Sem elas, a validação rejeita todos os tokens.
- Confirmação de email ligada em produção.
- TTL do access token.

Situação: **pendentes** ([[decisoes/PENDENCIAS#Condições operacionais do ADR-003|PENDENCIAS]]).

## Feature
[[features/AUTH-001]] (Fundação de Autenticação): **implementada e encerrada em 2026-10-22** (ARCHITECT REVIEW APPROVED_WITH_NOTES; commit `50eaa1f`).
- `requireAuthenticatedIdentity`, em `backend/src/domains/auth`, verifica o access token (com o verificador de `infrastructure/supabase-auth`, que usa `jose`) e devolve a identidade do provedor: exatamente `externalUserId`, `sessionId` e `expiresAt`, congelada. Sem banco e sem igreja.
- Falhas: `AUTH_MISSING_CREDENTIAL`, `AUTH_MALFORMED_CREDENTIAL`, `AUTH_INVALID_TOKEN`, `AUTH_TOKEN_EXPIRED` e `AUTH_VERIFICATION_UNAVAILABLE`. Nenhum caminho de falha devolve identidade.
- **Ainda não há rota protegida:** a primeira vem com a AUTH-003.
- **Leitura literal das validações de claims** ([[decisoes/PENDENCIAS#ARQ-AUTH-01 — Leitura literal das validações de claims|ARQ-AUTH-01]]): `session_id` só com espaços e `is_anonymous: "true"` (string) são aceitos; `exp` vencido com assinatura válida dá `AUTH_TOKEN_EXPIRED` mesmo com `role` ou `sub` inválidos. Por isso, `AUTH_TOKEN_EXPIRED` significa só "não autenticado, token vencido" e não atesta os demais claims.
- **Risco aceito:** [[decisoes/PENDENCIAS#RT-AUTH-01 — Cache de segmento do Next sobre a busca do JWKS|RT-AUTH-01]] (cache de segmento do Next sobre a busca do JWKS); nenhum `fetchCache` em `src/app/**` até a guarda da AUTH-003.

## Pendências
- Provisionamento do usuário do Mescala: [[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]].
- Padrão HTTP dos erros de autenticação na primeira rota protegida: [[decisoes/PENDENCIAS#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]].
- Herança da AUTH-001 para a AUTH-003 (DEC-07, RT-AUTH-01, teste do verificador padrão com o JWKS real, 405 real, `Object.freeze` raso, B8): [[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|PENDENCIAS]].
- Revogação imediata do usuário no domínio (bloqueio B8 da AUTH-001): **A DEFINIR**.
- Fora do ADR-003: métodos de login (OAuth, magic link, telefone), MFA, cookie ou BFF para cliente web, SMTP próprio e uso da Admin API para convites.
- Convites: entidade decidida ([[dados/ENTIDADES#Convite|Convite]]); a criação de conta continua sendo da autenticação.

## Legado
O app legado usa Supabase Auth com email e senha nos projetos antigos ([[tecnico/LEGADO-ATUAL]]). O uso no legado não decidiu a autenticação oficial; quem decidiu foi o ADR-003. Riscos S2 e S3 em [[seguranca/RISCOS-DO-LEGADO]].

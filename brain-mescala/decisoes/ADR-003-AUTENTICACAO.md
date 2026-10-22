---
tipo: adr
status: aceito
data: 2026-10-21
proposto: 2026-10-06
origem: AUTH-001
resolve: DEC-03
relacionado:
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[seguranca/AUTENTICACAO]]"
  - "[[decisoes/PENDENCIAS]]"
  - "[[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]"
---
# ADR-003 — Autenticação do backend oficial

## Status
**ACEITO** (2026-10-21). Resolve a DEC-03.

> Texto proposto pelo [[agents/arquiteto|Arquiteto]] em 2026-10-06 no documento da AUTH-001 (`docs/features/AUTH-001.md`, seção "Texto proposto: ADR-003", fora do vault) e aceito pelo PO em 2026-10-21. O texto abaixo é o proposto. Só mudaram o status e a seção **Condições**, que registra a situação de cada condição na data do aceite. As notas do vault-brain estão separadas, no fim.

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
Situação em 2026-10-21, data do aceite:

| Condição (texto proposto) | Situação |
|---|---|
| DEC-05 decidida (projeto oficial). | **Cumprida.** Projeto oficial: `vitqnyzuvrvkmnvshcpb` (`https://vitqnyzuvrvkmnvshcpb.supabase.co`), decidido pelo PO em 2026-10-21 ([[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL\|DEC-05]]). |
| Projeto com chaves de assinatura assimétricas ativas. Se não for possível, este ADR deve ser revisto para validação remota (`/auth/v1/user`). | **Pendente, com o PO.** Verificar no painel do projeto novo (JWT Signing Keys) que a chave atual é assimétrica (ECC P-256 ou RSA). Enquanto o projeto assinar com o segredo legado (HS256), a validação deste ADR rejeita todos os tokens (falha fechada). |
| Em produção: confirmação de email ligada no provedor. | **Pendente, com o PO.** |

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

---

## Notas de registro (vault-brain, 2026-10-21)
Não fazem parte do texto aceito. Apontam o estado das referências do ADR na data do aceite.

- **DEC-03:** decidida por este ADR ([[decisoes/PENDENCIAS#DEC-03 — Autenticação|registro em PENDENCIAS]]).
- **DEC-05:** decidida no mesmo dia: projeto **novo**. Na análise da AUTH-001 (bloqueio B4), a opção "novo projeto" vem com a observação "o que exige migrar as identidades". O ADR cita "usuários preservados" e "`auth.users` pode conter usuários reais" pensando no projeto do legado.
- **Complemento de 2026-10-22:** o PO decidiu que o app legado não tem uso real. Não há migração de dados do legado: o banco oficial começa vazio ([[decisoes/PENDENCIAS#Uso real do app legado — DATA-DEC-022 e 023|PENDENCIAS]]). O texto aceito do ADR não muda.
- **DATA-DEC-019 e DATA-DEC-020:** aceitas no mesmo dia, na opção A ([[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-019 — Identidade × provedor de autenticação|DATA-DEC-019]]: tabela própria `users` ligada ao `auth.users` do projeto novo; [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]]: schema dedicado fora da Data API, papel sem BYPASSRLS).
- **DATA-DEC-011:** aceita (convite oficial). O uso da Admin API para convites continua fora deste ADR.
- **Continuam abertas:** [[decisoes/PENDENCIAS#DEC-06 — Provisionamento do usuário do Mescala|DEC-06]] (provisionamento) e [[decisoes/PENDENCIAS#DEC-07 — Padrão HTTP de erros e convenções de API|DEC-07]] (padrão HTTP de erros).
- **AUTH-001:** com este aceite, o contrato ficou BLOCKED só pela DEC-02. Em 2026-10-22 a [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES|DEC-02]] foi decidida (Vitest): o contrato fica sem bloqueios de decisão e passa a READY quando o Arquiteto o atualizar com o Vitest ([[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|AUTH-001]]).
- **Implementação (registro de 2026-10-22):** este ADR foi implementado pela [[features/AUTH-001]] (commit `50eaa1f`; ARCHITECT REVIEW APPROVED_WITH_NOTES). Itens 1 a 9 e 11 implementados; o item 10 (revogação) é do provedor. A leitura literal do item 5 foi aceita como [[decisoes/PENDENCIAS#ARQ-AUTH-01 — Leitura literal das validações de claims|ARQ-AUTH-01]]. As condições operacionais continuam com o PO. O texto aceito não muda.

Relacionados (acrescentados no registro): [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]], [[decisoes/DEC-09-MODELO-DE-DADOS]], [[decisoes/DEC-04-ESTRATEGIA-DE-MIGRATIONS]], [[decisoes/DEC-02-BIBLIOTECA-DE-TESTES]], [[features/FLUXO-DE-ENTREGA]], [[features/AUTH-001]], [[MOCs/MOC-SEGURANCA]], [[MOCs/MOC-GOVERNANCA]].

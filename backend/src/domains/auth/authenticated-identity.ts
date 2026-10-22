/**
 * ============================================================
 * ARQUIVO: authenticated-identity.ts
 * DOMÍNIO: auth
 * FEATURE: AUTH-001
 * DECISÃO: ADR-003 (Autenticação do backend oficial)
 * ============================================================
 *
 * OBJETIVO
 *
 * Definir o formato da identidade autenticada e o contrato do
 * verificador de token de acesso usados por toda rota protegida.
 *
 * A identidade é um valor em memória, válido só para a requisição
 * em que foi obtida. Nada aqui é persistido.
 *
 * ------------------------------------------------------------
 * TIPOS
 * ------------------------------------------------------------
 *
 * 1. AuthenticatedIdentity
 *    PT-BR: Identidade Autenticada
 *
 *    Responsabilidade:
 *    Prova, já verificada no servidor, de quem apresentou o token:
 *    - externalUserId: claim `sub` do Supabase Auth. É o
 *      identificador do PROVEDOR. NÃO é o id do usuário do
 *      Mescala (ADR-003, item 6; DATA-DEC-019; AUTH-002/003);
 *    - sessionId: claim `session_id`;
 *    - expiresAt: claim `exp`, convertido para Date.
 *    Não carrega email, metadata, papel nem igreja: autorização e
 *    tenant nunca vêm do token (ADR-003, item 7; SEC-001).
 *
 * 2. VerifyAccessToken
 *    PT-BR: Verificar Token de Acesso
 *
 *    Responsabilidade:
 *    Contrato da função que recebe o access token cru e devolve a
 *    identidade, ou lança AuthenticationError. A implementação
 *    padrão fica em
 *    infrastructure/supabase-auth/supabase-access-token-verifier.ts.
 *
 * ------------------------------------------------------------
 * DEPENDÊNCIAS EXTERNAS
 * ------------------------------------------------------------
 *
 * Nenhuma.
 *
 * ------------------------------------------------------------
 * REGRAS RELACIONADAS
 * ------------------------------------------------------------
 *
 * ADR-003 (itens 6 e 7)
 * AUTH-001 (FC-18: identidade somente leitura e congelada)
 *
 * ============================================================
 */

export type AuthenticatedIdentity = Readonly<{
  /** Claim `sub` do provedor. NÃO é o id do usuário do Mescala. */
  externalUserId: string;
  /** Claim `session_id`. */
  sessionId: string;
  /** Claim `exp`, convertido para Date. */
  expiresAt: Date;
}>;

export type VerifyAccessToken = (
  accessToken: string,
) => Promise<AuthenticatedIdentity>;

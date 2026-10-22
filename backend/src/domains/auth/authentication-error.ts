/**
 * ============================================================
 * ARQUIVO: authentication-error.ts
 * DOMÍNIO: auth
 * FEATURE: AUTH-001
 * DECISÃO: ADR-003 (Autenticação do backend oficial)
 * ============================================================
 *
 * OBJETIVO
 *
 * Definir o único erro lançado pela verificação de autenticação
 * e os códigos que o classificam (FC-17 da AUTH-001).
 *
 * O mapeamento para HTTP não é definido aqui (DEC-07). Quem fizer
 * esse mapeamento precisa manter separados os quatro primeiros
 * códigos ("não autenticado") e AUTH_VERIFICATION_UNAVAILABLE
 * ("falha do servidor"), para que um cliente não desconecte o
 * usuário quando o provedor estiver fora do ar.
 *
 * ------------------------------------------------------------
 * SUMÁRIO
 * ------------------------------------------------------------
 *
 * 1. AuthenticationErrorCode
 *    PT-BR: Código do Erro de Autenticação
 *
 *    Responsabilidade:
 *    - AUTH_MISSING_CREDENTIAL: sem header Authorization, ou vazio;
 *    - AUTH_MALFORMED_CREDENTIAL: header fora do formato
 *      `Bearer <token>`;
 *    - AUTH_INVALID_TOKEN: token rejeitado (assinatura, algoritmo,
 *      claims, anônimo, JWT malformado ou erro desconhecido);
 *    - AUTH_TOKEN_EXPIRED: `exp` vencido, com assinatura válida;
 *    - AUTH_VERIFICATION_UNAVAILABLE: configuração ausente ou
 *      inválida, ou falha ao obter as chaves (JWKS).
 *
 * 2. AuthenticationError
 *    PT-BR: Erro de Autenticação
 *
 *    Responsabilidade:
 *    Erro com `code` e mensagem fixa por código. A mensagem nunca
 *    contém token, header nem claims (ADR-003; FC-17).
 *    `cause` só é usado para falha ao obter as chaves (rede,
 *    timeout, JWKS inválido) e nunca carrega conteúdo do token.
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
 * ADR-003 (itens 5 e 11)
 * AUTH-001 (FC-5, passo 5; FC-17)
 *
 * ============================================================
 */

export type AuthenticationErrorCode =
  | "AUTH_MISSING_CREDENTIAL"
  | "AUTH_MALFORMED_CREDENTIAL"
  | "AUTH_INVALID_TOKEN"
  | "AUTH_TOKEN_EXPIRED"
  | "AUTH_VERIFICATION_UNAVAILABLE";

// Mensagens fixas: nenhum dado da requisição entra no texto do erro.
const MESSAGES: Readonly<Record<AuthenticationErrorCode, string>> = {
  AUTH_MISSING_CREDENTIAL: "Credencial de acesso ausente.",
  AUTH_MALFORMED_CREDENTIAL: "Credencial de acesso em formato inválido.",
  AUTH_INVALID_TOKEN: "Token de acesso inválido.",
  AUTH_TOKEN_EXPIRED: "Token de acesso expirado.",
  AUTH_VERIFICATION_UNAVAILABLE:
    "Verificação de autenticação indisponível no momento.",
};

export class AuthenticationError extends Error {
  readonly code: AuthenticationErrorCode;

  constructor(code: AuthenticationErrorCode, options?: { cause?: unknown }) {
    super(MESSAGES[code], options);
    this.name = "AuthenticationError";
    this.code = code;
  }
}

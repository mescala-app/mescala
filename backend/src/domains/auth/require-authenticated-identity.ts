/**
 * ============================================================
 * ARQUIVO: require-authenticated-identity.ts
 * DOMÍNIO: auth
 * FEATURE: AUTH-001
 * DECISÃO: ADR-003 (Autenticação do backend oficial)
 * ============================================================
 *
 * OBJETIVO
 *
 * Ponto único pelo qual um Route Handler obtém a identidade
 * autenticada da requisição (ADR-003, item 8). O handler chama
 * esta função explicitamente e passa o resultado, por parâmetro,
 * ao caso de uso. Sem middleware, sem estado global e sem cache
 * de identidade entre requisições.
 *
 * Autenticar não é autorizar: a identidade devolvida não diz
 * nada sobre papel, vínculo ou igreja (ADR-003, item 7;
 * seguranca/AUTENTICACAO).
 *
 * Usa só tipos Web padrão (Request, Headers). Não depende do
 * Next.js (ADR-002#Regras de negócio).
 *
 * ------------------------------------------------------------
 * SUMÁRIO DE FUNÇÕES
 * ------------------------------------------------------------
 *
 * 1. requireAuthenticatedIdentity
 *    PT-BR: Exigir Identidade Autenticada
 *
 *    Responsabilidade:
 *    Extrair o token Bearer da requisição e delegar a verificação
 *    ao verificador (o padrão é o do Supabase Auth). Devolve a
 *    identidade ou lança AuthenticationError. O erro lançado pelo
 *    verificador chega ao chamador sem alteração.
 *
 * 2. extractBearerToken (interna)
 *    PT-BR: Extrair Token Bearer
 *
 *    Responsabilidade:
 *    Ler só o header Authorization e validar o formato
 *    `Bearer <token>`: esquema sem diferenciar maiúsculas, um
 *    único espaço, token não vazio e sem espaço, tab ou vírgula.
 *    - header ausente, ou vazio depois da normalização do
 *      Headers: AUTH_MISSING_CREDENTIAL;
 *    - fora do formato: AUTH_MALFORMED_CREDENTIAL.
 *    Query, body, cookies e outros headers (x-user-id, apikey…)
 *    nunca são lidos.
 *
 * ------------------------------------------------------------
 * DEPENDÊNCIAS EXTERNAS
 * ------------------------------------------------------------
 *
 * verifySupabaseAccessToken()
 *
 * Arquivo:
 * infrastructure/supabase-auth/supabase-access-token-verifier.ts
 *
 * Responsabilidade:
 * Verificador padrão: confere o access token com o JWKS público
 * do projeto oficial e monta a identidade (composição permitida
 * pela AUTH-001, regra 11).
 *
 * ------------------------------------------------------------
 * REGRAS RELACIONADAS
 * ------------------------------------------------------------
 *
 * ADR-003 (itens 2, 3, 7 e 8)
 * ADR-002#Route Handlers; ADR-002#Regras de negócio
 * AUTH-001 (FC-4; FC-5 passos 1 a 3 e 7; regras 1, 8 a 11)
 *
 * ============================================================
 */

import { verifySupabaseAccessToken } from "@/infrastructure/supabase-auth/supabase-access-token-verifier";

import type {
  AuthenticatedIdentity,
  VerifyAccessToken,
} from "./authenticated-identity";
import { AuthenticationError } from "./authentication-error";

// `Bearer`, um espaço e um único token sem espaço, tab ou vírgula.
const BEARER_CREDENTIAL = /^Bearer ([^\s,]+)$/i;

export async function requireAuthenticatedIdentity(
  request: Request,
  verifyAccessToken: VerifyAccessToken = verifySupabaseAccessToken,
): Promise<AuthenticatedIdentity> {
  const accessToken = extractBearerToken(request.headers);

  // ============================================================
  // RELAÇÃO EXTERNA
  //
  // Função chamada:
  // verifyAccessToken (padrão: verifySupabaseAccessToken)
  //
  // Arquivo:
  // infrastructure/supabase-auth/supabase-access-token-verifier.ts
  //
  // Objetivo:
  // verificar o access token no servidor e obter a identidade
  // (externalUserId, sessionId, expiresAt). Os erros desse
  // verificador já são AuthenticationError e seguem sem alteração.
  //
  // Feature relacionada:
  // AUTH-001 (ADR-003, itens 4, 5 e 8)
  // ============================================================
  return verifyAccessToken(accessToken);
}

function extractBearerToken(headers: Headers): string {
  // O Headers já remove espaços das pontas: "   " chega como "".
  const authorization = headers.get("authorization");

  if (authorization === null || authorization === "") {
    throw new AuthenticationError("AUTH_MISSING_CREDENTIAL");
  }

  const match = BEARER_CREDENTIAL.exec(authorization);

  if (match === null) {
    throw new AuthenticationError("AUTH_MALFORMED_CREDENTIAL");
  }

  return match[1];
}

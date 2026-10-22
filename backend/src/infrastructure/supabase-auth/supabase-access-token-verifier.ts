/**
 * ============================================================
 * ARQUIVO: supabase-access-token-verifier.ts
 * DOMÍNIO: infrastructure/supabase-auth
 * FEATURE: AUTH-001
 * DECISÃO: ADR-003 (Autenticação do backend oficial)
 * ============================================================
 *
 * OBJETIVO
 *
 * Verificar, localmente e sem segredo, o access token emitido
 * pelo Supabase Auth do projeto oficial e devolver a identidade
 * autenticada. Único lugar do backend que conhece o provedor e a
 * biblioteca de JWT (`jose`).
 *
 * A assinatura é conferida com a chave pública do JWKS
 * configurado. Algoritmos aceitos: ES256 e RS256. `none` e HS*
 * são recusados. `jku`, `x5u` e `jwk` do header nunca são usados:
 * a chave só vem do JWKS configurado (ADR-003, item 4).
 *
 * ------------------------------------------------------------
 * SUMÁRIO DE FUNÇÕES
 * ------------------------------------------------------------
 *
 * 1. createSupabaseAccessTokenVerifier
 *    PT-BR: Criar Verificador de Token de Acesso do Supabase
 *
 *    Responsabilidade:
 *    Montar um VerifyAccessToken a partir de um issuer e de um
 *    resolvedor de chaves (JWKS). Os testes injetam um JWKS local;
 *    o verificador padrão injeta o JWKS remoto do projeto.
 *
 * 2. verifySupabaseAccessToken
 *    PT-BR: Verificar Token de Acesso do Supabase
 *
 *    Responsabilidade:
 *    Verificador padrão, usado por requireAuthenticatedIdentity.
 *    Na primeira chamada com configuração válida, cria o JWKS
 *    remoto, uma vez por processo. Com configuração ausente ou
 *    inválida, falha com AUTH_VERIFICATION_UNAVAILABLE e não
 *    guarda nada: a próxima chamada lê SUPABASE_URL de novo.
 *
 * 3. createDefaultVerifier (interna)
 *    PT-BR: Criar Verificador Padrão
 *
 *    Responsabilidade:
 *    Ler a configuração e ligar o JWKS remoto ao verificador.
 *
 * 4. fetchJwksWithoutNextCache (interna)
 *    PT-BR: Buscar JWKS Fora do Cache do Next
 *
 *    Responsabilidade:
 *    Fazer a requisição do JWKS com `cache: "no-store"`, para que
 *    o cache de dados do Next.js não prenda as chaves. O cache
 *    válido é o da `jose` (AUTH-001, regra 6).
 *    Limite (Next 16.4.2): um segmento com
 *    `export const fetchCache = "force-cache"` sobrepõe até o
 *    `no-store`. Rotas protegidas não devem declarar isso.
 *
 * 5. guardKeyResolution (interna)
 *    PT-BR: Proteger Obtenção da Chave
 *
 *    Responsabilidade:
 *    Envolver o resolvedor de chaves e marcar como
 *    AUTH_VERIFICATION_UNAVAILABLE qualquer falha ao obter as
 *    chaves (rede, timeout, resposta diferente de 200, JWKS
 *    inválido). "Nenhuma chave correspondente" e "várias chaves
 *    correspondentes" seguem inalteradas para a `jose`, porque
 *    dizem respeito ao token, não à disponibilidade.
 *
 * 6. classifyVerificationFailure (interna)
 *    PT-BR: Classificar Falha de Verificação
 *
 *    Responsabilidade:
 *    Traduzir pela origem o erro da verificação:
 *    - erro já marcado por guardKeyResolution: segue como está;
 *    - JWTExpired (só ocorre com assinatura válida):
 *      AUTH_TOKEN_EXPIRED;
 *    - qualquer outro, inclusive desconhecido: AUTH_INVALID_TOKEN.
 *    Nenhum erro da `jose` é anexado: eles carregam claims.
 *
 * 7. buildAuthenticatedIdentity (interna)
 *    PT-BR: Montar Identidade Autenticada
 *
 *    Responsabilidade:
 *    Conferir os claims que a `jose` não confere (`role`,
 *    `is_anonymous`, `sub` UUID, `session_id`) e montar a
 *    identidade congelada só com `sub`, `session_id` e `exp`.
 *
 * ------------------------------------------------------------
 * DEPENDÊNCIAS EXTERNAS
 * ------------------------------------------------------------
 *
 * jwtVerify, createRemoteJWKSet, customFetch, errors
 *
 * Pacote:
 * jose
 *
 * Responsabilidade:
 * Verificar assinatura e claims padrão do JWT; obter e manter em
 * cache o JWKS remoto, renovando quando aparece `kid`
 * desconhecido.
 *
 * loadSupabaseAuthConfig()
 *
 * Arquivo:
 * infrastructure/supabase-auth/supabase-auth-config.ts
 *
 * Responsabilidade:
 * Ler SUPABASE_URL e derivar issuer e URL do JWKS.
 *
 * AuthenticatedIdentity, VerifyAccessToken
 *
 * Arquivo:
 * domains/auth/authenticated-identity.ts
 *
 * Responsabilidade:
 * Formato da identidade e contrato do verificador.
 *
 * AuthenticationError
 *
 * Arquivo:
 * domains/auth/authentication-error.ts
 *
 * Responsabilidade:
 * Erro único da autenticação, com código.
 *
 * ------------------------------------------------------------
 * REGRAS RELACIONADAS
 * ------------------------------------------------------------
 *
 * ADR-003 (itens 4 a 7, 9 e 11)
 * AUTH-001 (FC-5 passos 4 a 7; FC-17; FC-18; regras 2 a 6, 8,
 *           9, 13 e 14)
 *
 * ============================================================
 */

import {
  createRemoteJWKSet,
  customFetch,
  errors,
  jwtVerify,
  type FetchImplementation,
  type JWTPayload,
  type JWTVerifyGetKey,
} from "jose";

import type {
  AuthenticatedIdentity,
  VerifyAccessToken,
} from "@/domains/auth/authenticated-identity";
import { AuthenticationError } from "@/domains/auth/authentication-error";

import { loadSupabaseAuthConfig } from "./supabase-auth-config";

// Lista fechada (ADR-003, item 4).
const ACCEPTED_ALGORITHMS = ["ES256", "RS256"];

// `aud` e `role` exigidos (ADR-003, item 5). O `role` é o papel do
// PostgREST, nunca papel do Mescala.
const AUTHENTICATED = "authenticated";

const CLOCK_TOLERANCE_SECONDS = 5;

// Formato canônico 8-4-4-4-12, sem diferenciar maiúsculas e sem
// verificar a versão (AUTH-001, regra 14).
const CANONICAL_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function createSupabaseAccessTokenVerifier(options: {
  issuer: string;
  keySet: JWTVerifyGetKey;
}): VerifyAccessToken {
  const { issuer } = options;
  const keySet = guardKeyResolution(options.keySet);

  return async function verifyAccessToken(
    accessToken: string,
  ): Promise<AuthenticatedIdentity> {
    let payload: JWTPayload;

    try {
      // ============================================================
      // RELAÇÃO EXTERNA
      //
      // Função chamada:
      // jwtVerify
      //
      // Pacote:
      // jose
      //
      // Objetivo:
      // verificar a assinatura com a chave do JWKS configurado
      // (o algoritmo é conferido antes de buscar a chave) e os
      // claims iss, aud, exp e nbf (com tolerância de 5 s), além
      // da presença de exp, sub e session_id.
      //
      // Feature relacionada:
      // AUTH-001 (ADR-003, itens 4 e 5)
      // ============================================================
      ({ payload } = await jwtVerify(accessToken, keySet, {
        algorithms: ACCEPTED_ALGORITHMS,
        issuer,
        audience: AUTHENTICATED,
        clockTolerance: CLOCK_TOLERANCE_SECONDS,
        requiredClaims: ["exp", "sub", "session_id"],
      }));
    } catch (error) {
      throw classifyVerificationFailure(error);
    }

    return buildAuthenticatedIdentity(payload);
  };
}

// Criado sob demanda (o build passa sem SUPABASE_URL) e só quando a
// configuração é válida: uma falha de configuração não fica guardada.
let defaultVerifier: VerifyAccessToken | undefined;

export const verifySupabaseAccessToken: VerifyAccessToken = async (
  accessToken,
) => {
  defaultVerifier ??= createDefaultVerifier();
  return defaultVerifier(accessToken);
};

function createDefaultVerifier(): VerifyAccessToken {
  // ============================================================
  // RELAÇÃO EXTERNA
  //
  // Função chamada:
  // loadSupabaseAuthConfig
  //
  // Arquivo:
  // infrastructure/supabase-auth/supabase-auth-config.ts
  //
  // Objetivo:
  // obter issuer e URL do JWKS a partir de SUPABASE_URL. Lança
  // AUTH_VERIFICATION_UNAVAILABLE se a configuração faltar ou for
  // inválida (falha fechada, ADR-003, item 11).
  //
  // Feature relacionada:
  // AUTH-001
  // ============================================================
  const { issuer, jwksUrl } = loadSupabaseAuthConfig();

  // ============================================================
  // RELAÇÃO EXTERNA
  //
  // Função chamada:
  // createRemoteJWKSet
  //
  // Pacote:
  // jose
  //
  // Objetivo:
  // obter o JWKS público do projeto, só da URL configurada, com o
  // cache da `jose` (renova quando aparece `kid` desconhecido).
  // A requisição sai com `cache: "no-store"` para não ficar presa
  // ao cache de dados do Next.js (AUTH-001, regra 6).
  //
  // Feature relacionada:
  // AUTH-001 (ADR-003, item 4)
  // ============================================================
  const keySet = createRemoteJWKSet(jwksUrl, {
    [customFetch]: fetchJwksWithoutNextCache,
  });

  return createSupabaseAccessTokenVerifier({ issuer, keySet });
}

function fetchJwksWithoutNextCache(
  url: string,
  options: Parameters<FetchImplementation>[1],
): Promise<Response> {
  return fetch(url, { ...options, cache: "no-store" });
}

function guardKeyResolution(keySet: JWTVerifyGetKey): JWTVerifyGetKey {
  return async (protectedHeader, token) => {
    try {
      return await keySet(protectedHeader, token);
    } catch (error) {
      if (
        error instanceof errors.JWKSNoMatchingKey ||
        error instanceof errors.JWKSMultipleMatchingKeys
      ) {
        throw error;
      }

      // A causa é a falha de rede ou de JWKS; não contém o token.
      throw new AuthenticationError("AUTH_VERIFICATION_UNAVAILABLE", {
        cause: error,
      });
    }
  };
}

function classifyVerificationFailure(error: unknown): AuthenticationError {
  if (error instanceof AuthenticationError) {
    return error;
  }

  if (error instanceof errors.JWTExpired) {
    return new AuthenticationError("AUTH_TOKEN_EXPIRED");
  }

  return new AuthenticationError("AUTH_INVALID_TOKEN");
}

function buildAuthenticatedIdentity(
  payload: JWTPayload,
): AuthenticatedIdentity {
  const { sub, session_id: sessionId, role, is_anonymous: isAnonymous, exp } =
    payload;

  if (
    role !== AUTHENTICATED ||
    isAnonymous === true ||
    typeof sub !== "string" ||
    !CANONICAL_UUID.test(sub) ||
    typeof sessionId !== "string" ||
    sessionId === "" ||
    typeof exp !== "number"
  ) {
    throw new AuthenticationError("AUTH_INVALID_TOKEN");
  }

  // Só os três campos da FC-18. Email, metadata e demais claims
  // nunca são copiados (ADR-003, itens 6 e 7).
  return Object.freeze({
    externalUserId: sub,
    sessionId,
    expiresAt: new Date(exp * 1000),
  });
}

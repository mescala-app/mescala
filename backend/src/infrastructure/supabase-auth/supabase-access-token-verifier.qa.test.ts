/**
 * ============================================================
 * ARQUIVO: supabase-access-token-verifier.qa.test.ts
 * DOMÍNIO: infrastructure/supabase-auth
 * FEATURE: AUTH-001 (casos adversariais do QA, E.8)
 * ============================================================
 *
 * OBJETIVO
 *
 * Casos adversariais do QA que os cenários B não cobrem:
 * - QA-1: confusão entre algoritmos assimétricos usando um `kid`
 *   do JWKS (RS256 com `kid` da chave EC e vice-versa);
 * - QA-2: lista fechada ES256/RS256 contra algoritmos
 *   assimétricos fora da lista (PS256, RS384, ES384), mesmo com
 *   assinatura legítima e JWKS sem `alg` nas chaves;
 * - QA-3: JWT malformado (FC-17), inclusive com assinatura
 *   legítima sobre payload que não é objeto JSON;
 * - QA-4: extensão crítica (`crit`) desconhecida, com assinatura
 *   legítima.
 * Em todos: AUTH_INVALID_TOKEN, nunca identidade, nunca
 * AUTH_VERIFICATION_UNAVAILABLE e nenhum vazamento do token.
 *
 * Cenários cobertos: QA-1, QA-2, QA-3, QA-4.
 *
 * Sem rede: as chaves são geradas no próprio teste e o JWKS é
 * local (createLocalJWKSet), injetado em
 * createSupabaseAccessTokenVerifier. O issuer usa o domínio
 * reservado `.invalid`. O `fetch` global é substituído por uma
 * função que lança erro e que, ao fim de cada caso, precisa não
 * ter sido chamada.
 *
 * ============================================================
 */

import {
  CompactSign,
  createLocalJWKSet,
  exportJWK,
  generateKeyPair,
  SignJWT,
  type CryptoKey,
  type JWK,
  type JWTPayload,
} from "jose";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { VerifyAccessToken } from "@/domains/auth/authenticated-identity";
import { AuthenticationError } from "@/domains/auth/authentication-error";

import { createSupabaseAccessTokenVerifier } from "./supabase-access-token-verifier";

const ISSUER = "https://projeto-teste.supabase.invalid/auth/v1";
const SUBJECT = "0b7e3c5a-2f4d-4c1e-9a8b-7d6c5e4f3a2b";
const SESSION_ID = "9d8c7b6a-5e4f-4a3b-8c2d-1e0f9a8b7c6d";

type Algorithm = "ES256" | "RS256" | "PS256" | "RS384" | "ES384";

type SigningKey = {
  alg: Algorithm;
  kid: string;
  privateKey: CryptoKey;
  publicJwk: JWK;
};

// JWKS como o de produção: chaves com `alg`, `kid` e `use`.
let es256: SigningKey;
let rs256: SigningKey;
// Chaves do atacante, fora de qualquer JWKS.
let attackerEc: SigningKey;
let attackerRsa: SigningKey;
// JWKS sem `alg` nas chaves (só `kid`): prova que a recusa vem da
// lista fechada, e não do filtro por `alg` do JWKS.
let plainRs256: SigningKey;
let plainEs256: SigningKey;
let plainPs256: SigningKey;
let plainRs384: SigningKey;
let plainEs384: SigningKey;

let verifyWithAlg: VerifyAccessToken;
let verifyWithoutAlg: VerifyAccessToken;

const blockedFetch = vi.fn(() => {
  throw new Error("Rede bloqueada nos testes da AUTH-001.");
});

beforeAll(async () => {
  es256 = await createSigningKey("ES256", "qa-es256", true);
  rs256 = await createSigningKey("RS256", "qa-rs256", true);
  attackerEc = await createSigningKey("ES256", "qa-atacante-ec", true);
  attackerRsa = await createSigningKey("RS256", "qa-atacante-rsa", true);

  plainRs256 = await createSigningKey("RS256", "qa-sem-alg-rs256", false);
  plainEs256 = await createSigningKey("ES256", "qa-sem-alg-es256", false);
  plainPs256 = await createSigningKey("PS256", "qa-sem-alg-ps256", false);
  plainRs384 = await createSigningKey("RS384", "qa-sem-alg-rs384", false);
  plainEs384 = await createSigningKey("ES384", "qa-sem-alg-es384", false);

  verifyWithAlg = createSupabaseAccessTokenVerifier({
    issuer: ISSUER,
    keySet: createLocalJWKSet({ keys: [es256.publicJwk, rs256.publicJwk] }),
  });
  verifyWithoutAlg = createSupabaseAccessTokenVerifier({
    issuer: ISSUER,
    keySet: createLocalJWKSet({
      keys: [plainRs256, plainEs256, plainPs256, plainRs384, plainEs384].map(
        (key) => key.publicJwk,
      ),
    }),
  });
});

beforeEach(() => {
  blockedFetch.mockClear();
  vi.stubGlobal("fetch", blockedFetch);
});

afterEach(() => {
  expect(blockedFetch).not.toHaveBeenCalled();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

// ------------------------------------------------------------
// Utilitários do teste
// ------------------------------------------------------------

async function createSigningKey(
  alg: Algorithm,
  kid: string,
  withAlg: boolean,
): Promise<SigningKey> {
  const { privateKey, publicKey } =
    alg === "ES256" || alg === "ES384"
      ? await generateKeyPair(alg)
      : await generateKeyPair(alg, { modulusLength: 2048 });
  // `exportJWK` não inclui `alg`; só o JWKS "de produção" o recebe.
  const exported = await exportJWK(publicKey);
  const publicJwk: JWK = withAlg
    ? { ...exported, kid, alg, use: "sig" }
    : { ...exported, kid };
  return { alg, kid, privateKey, publicJwk };
}

function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function validClaims(): JWTPayload {
  const now = nowInSeconds();
  return {
    iss: ISSUER,
    aud: "authenticated",
    role: "authenticated",
    sub: SUBJECT,
    session_id: SESSION_ID,
    iat: now,
    exp: now + 600,
  };
}

/** Assina com `alg` do header possivelmente diferente do da chave. */
async function signWith(
  key: SigningKey,
  header: { alg: string; kid: string },
): Promise<string> {
  return new SignJWT(validClaims())
    .setProtectedHeader({ ...header, typ: "JWT" })
    .sign(key.privateKey);
}

function base64url(text: string): string {
  return Buffer.from(text).toString("base64url");
}

async function captureRejection(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error("Era esperada uma rejeição, e a verificação devolveu identidade.");
}

/**
 * Mensagem, `String(erro)`, propriedades próprias e cadeia de
 * `cause`. Textos com menos de 8 caracteres (como "..") ficam de
 * fora, para não casar por acaso com o `stack`.
 */
function expectNoLeak(error: unknown, token: string): void {
  const texts = [token, ...token.split("."), SUBJECT, SESSION_ID].filter(
    (text) => text.length >= 8,
  );
  const visited = new WeakSet<object>();

  function inspect(value: unknown): void {
    if (typeof value === "string") {
      for (const text of texts) {
        expect(value.includes(text), `vazou "${text}"`).toBe(false);
      }
      return;
    }
    if ((typeof value !== "object" && typeof value !== "function") || value === null) {
      return;
    }
    if (visited.has(value)) {
      return;
    }
    visited.add(value);
    for (const key of Reflect.ownKeys(value)) {
      const descriptor = Reflect.getOwnPropertyDescriptor(value, key);
      if (descriptor !== undefined && "value" in descriptor) {
        inspect(descriptor.value);
      }
    }
  }

  inspect(String(error));
  inspect(error);
}

async function expectInvalid(verifier: VerifyAccessToken, token: string): Promise<void> {
  const error = await captureRejection(verifier(token));

  if (!(error instanceof AuthenticationError)) {
    throw new Error("Era esperado um AuthenticationError.", { cause: error });
  }
  expect(error.code).toBe("AUTH_INVALID_TOKEN");
  expect(error).not.toHaveProperty("cause");
  expectNoLeak(error, token);
}

// ------------------------------------------------------------
// Casos
// ------------------------------------------------------------

describe("createSupabaseAccessTokenVerifier — casos adversariais do QA", () => {
  it.each([
    {
      caso: "header RS256 com kid da chave ES256, assinado com RSA do atacante",
      token: () => signWith(attackerRsa, { alg: "RS256", kid: es256.kid }),
    },
    {
      caso: "header ES256 com kid da chave RS256, assinado com EC do atacante",
      token: () => signWith(attackerEc, { alg: "ES256", kid: rs256.kid }),
    },
    {
      caso: "header RS256 com kid da chave RS256, assinado com RSA do atacante",
      token: () => signWith(attackerRsa, { alg: "RS256", kid: rs256.kid }),
    },
  ])("QA-1 — confusão de algoritmos com kid do JWKS ($caso): AUTH_INVALID_TOKEN", async ({ token }) => {
    await expectInvalid(verifyWithAlg, await token());
  });

  it.each([
    { caso: "RS256", key: () => plainRs256 },
    { caso: "ES256", key: () => plainEs256 },
  ])(
    "QA-2 — controle: JWKS sem alg aceita $caso legítimo",
    async ({ key }) => {
      const signing = key();
      const identity = await verifyWithoutAlg(
        await signWith(signing, { alg: signing.alg, kid: signing.kid }),
      );

      expect(identity.externalUserId).toBe(SUBJECT);
    },
  );

  it.each([
    { caso: "PS256", key: () => plainPs256 },
    { caso: "RS384", key: () => plainRs384 },
    { caso: "ES384", key: () => plainEs384 },
  ])(
    "QA-2 — $caso com assinatura legítima e JWKS sem alg: AUTH_INVALID_TOKEN (lista fechada)",
    async ({ key }) => {
      const signing = key();

      await expectInvalid(
        verifyWithoutAlg,
        await signWith(signing, { alg: signing.alg, kid: signing.kid }),
      );
    },
  );

  it.each([
    { caso: "um segmento", token: () => "abcdefghijklmnop" },
    { caso: "dois segmentos", token: () => "abcdefghijk.lmnopqrstuv" },
    { caso: "quatro segmentos", token: () => "aaaaaaaaaa.bbbbbbbbbb.cccccccccc.dddddddddd" },
    {
      caso: "cinco segmentos (formato JWE)",
      token: () => "aaaaaaaaaa.bbbbbbbbbb.cccccccccc.dddddddddd.eeeeeeeeee",
    },
    { caso: "segmentos vazios", token: () => ".." },
    { caso: "header que não é base64url", token: () => "!!!!!!!!.e30.c2lnbmF0dXJh" },
    {
      caso: "header base64url que não é JSON",
      token: () => `${base64url("isto não é json")}.e30.c2lnbmF0dXJh`,
    },
    {
      caso: "header JSON que não é objeto",
      token: () => `${base64url("[1,2,3]")}.e30.c2lnbmF0dXJh`,
    },
    {
      caso: "assinatura legítima sobre payload que não é JSON",
      token: () =>
        new CompactSign(new TextEncoder().encode("payload que não é json"))
          .setProtectedHeader({ alg: "ES256", kid: es256.kid, typ: "JWT" })
          .sign(es256.privateKey),
    },
    {
      caso: "assinatura legítima sobre payload JSON que não é objeto",
      token: () =>
        new CompactSign(new TextEncoder().encode(JSON.stringify([SUBJECT, SESSION_ID])))
          .setProtectedHeader({ alg: "ES256", kid: es256.kid, typ: "JWT" })
          .sign(es256.privateKey),
    },
  ])("QA-3 — JWT malformado ($caso): AUTH_INVALID_TOKEN", async ({ token }) => {
    await expectInvalid(verifyWithAlg, await token());
  });

  it("QA-4 — crit com extensão desconhecida, assinatura legítima: AUTH_INVALID_TOKEN", async () => {
    const token = await new SignJWT(validClaims())
      .setProtectedHeader({
        alg: "ES256",
        kid: es256.kid,
        typ: "JWT",
        crit: ["x-qa"],
        "x-qa": true,
      })
      .sign(es256.privateKey, { crit: { "x-qa": true } });

    await expectInvalid(verifyWithAlg, token);
  });
});

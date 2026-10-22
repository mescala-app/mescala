/**
 * ============================================================
 * ARQUIVO: supabase-access-token-verifier.test.ts
 * DOMÍNIO: infrastructure/supabase-auth
 * FEATURE: AUTH-001
 * ============================================================
 *
 * OBJETIVO
 *
 * Testar a verificação do access token: assinatura pelo JWKS
 * configurado, lista fechada de algoritmos, claims exigidos,
 * classificação das falhas pela origem, identidade com só três
 * campos e congelada, e ausência de token ou payload nos erros.
 *
 * Cenários cobertos: B1, B6–B18, B19 [V], B21, B22 [V], B23, B25.
 *
 * Sem rede: as chaves (ES256, RS256 e uma "do atacante") são
 * geradas no próprio teste, e o JWKS é local (createLocalJWKSet),
 * injetado em createSupabaseAccessTokenVerifier. O issuer usa o
 * domínio reservado `.invalid`. O verificador padrão só é chamado
 * com SUPABASE_URL ausente ou inválida. O `fetch` global é
 * substituído por uma função que lança erro e que, ao fim de cada
 * caso, precisa não ter sido chamada.
 *
 * ============================================================
 */

import {
  createLocalJWKSet,
  errors,
  exportJWK,
  generateKeyPair,
  SignJWT,
  type CryptoKey,
  type JWK,
  type JWTHeaderParameters,
  type JWTPayload,
  type JWTVerifyGetKey,
} from "jose";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { VerifyAccessToken } from "@/domains/auth/authenticated-identity";
import { AuthenticationError } from "@/domains/auth/authentication-error";

import {
  createSupabaseAccessTokenVerifier,
  verifySupabaseAccessToken,
} from "./supabase-access-token-verifier";

const ISSUER = "https://projeto-teste.supabase.invalid/auth/v1";
const OTHER_PROJECT_ISSUER = "https://outro-projeto.supabase.invalid/auth/v1";
const SUBJECT = "6f1c2a9e-7b4d-4e8a-9c21-5d6f7a8b9c0d";
const SESSION_ID = "4a7e9c2b-1d3f-4b5a-8e6c-0f9d8c7b6a5e";

const ES256_KID = "chave-es256";
const RS256_KID = "chave-rs256";
const ATTACKER_KID = "chave-do-atacante";

type Algorithm = "ES256" | "RS256";

type SigningKey = {
  alg: Algorithm;
  kid: string;
  privateKey: CryptoKey;
  publicJwk: JWK;
};

let es256: SigningKey;
let rs256: SigningKey;
let attacker: SigningKey;
let verify: VerifyAccessToken;

const blockedFetch = vi.fn(() => {
  throw new Error("Rede bloqueada nos testes da AUTH-001.");
});

beforeAll(async () => {
  es256 = await createSigningKey("ES256", ES256_KID);
  rs256 = await createSigningKey("RS256", RS256_KID);
  attacker = await createSigningKey("ES256", ATTACKER_KID);

  const keySet = createLocalJWKSet({ keys: [es256.publicJwk, rs256.publicJwk] });
  verify = createSupabaseAccessTokenVerifier({ issuer: ISSUER, keySet });
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

async function createSigningKey(alg: Algorithm, kid: string): Promise<SigningKey> {
  const { privateKey, publicKey } =
    alg === "RS256"
      ? await generateKeyPair("RS256", { modulusLength: 2048 })
      : await generateKeyPair("ES256");
  const publicJwk: JWK = { ...(await exportJWK(publicKey)), kid, alg, use: "sig" };
  return { alg, kid, privateKey, publicJwk };
}

function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

/** Claims de um token válido, com alterações e remoções. */
function claims(
  changes: Record<string, unknown> = {},
  removed: string[] = [],
): JWTPayload {
  const now = nowInSeconds();
  const payload: Record<string, unknown> = {
    iss: ISSUER,
    aud: "authenticated",
    role: "authenticated",
    sub: SUBJECT,
    session_id: SESSION_ID,
    iat: now,
    exp: now + 600,
    ...changes,
  };
  for (const name of removed) {
    delete payload[name];
  }
  return payload;
}

async function signToken(
  payload: JWTPayload,
  options: {
    key?: SigningKey;
    kid?: string;
    header?: Partial<JWTHeaderParameters>;
  } = {},
): Promise<string> {
  const key = options.key ?? es256;
  return new SignJWT(payload)
    .setProtectedHeader({
      alg: key.alg,
      kid: options.kid ?? key.kid,
      typ: "JWT",
      ...options.header,
    })
    .sign(key.privateKey);
}

function base64url(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
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
 * B22: percorre a mensagem, `String(erro)`, as propriedades
 * próprias (inclusive não enumeráveis e símbolos) e a cadeia de
 * `cause`, procurando o token, o payload codificado e os valores
 * de `sub` e `session_id` (que só existem dentro do payload).
 */
function expectNoLeak(error: unknown, token: string): void {
  const [, encodedPayload = ""] = token.split(".");
  const texts = [token, encodedPayload, SUBJECT, SESSION_ID].filter(
    (text) => text !== "",
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

/** Verifica que o token falha com o código esperado, sem vazar nada (B22). */
async function expectRejected(
  token: string,
  code: AuthenticationError["code"],
  verifier: VerifyAccessToken = verify,
): Promise<AuthenticationError> {
  const error = await captureRejection(verifier(token));

  if (!(error instanceof AuthenticationError)) {
    throw new Error("Era esperado um AuthenticationError.", { cause: error });
  }
  expect(error.code).toBe(code);
  expectNoLeak(error, token);
  return error;
}

// ------------------------------------------------------------
// Casos
// ------------------------------------------------------------

describe("createSupabaseAccessTokenVerifier", () => {
  it.each(["ES256", "RS256"] as const)(
    "B1 — token válido %s: identidade com exatamente 3 campos, congelada",
    async (alg) => {
      const exp = nowInSeconds() + 600;
      const token = await signToken(claims({ exp }), {
        key: alg === "ES256" ? es256 : rs256,
      });

      const identity = await verify(token);

      expect(Object.keys(identity).sort()).toEqual([
        "expiresAt",
        "externalUserId",
        "sessionId",
      ]);
      expect(identity.externalUserId).toBe(SUBJECT);
      expect(identity.sessionId).toBe(SESSION_ID);
      expect(identity.expiresAt).toEqual(new Date(exp * 1000));
      expect(Object.isFrozen(identity)).toBe(true);
    },
  );

  it("B6 — exp vencido há 30 s, com assinatura válida: AUTH_TOKEN_EXPIRED", async () => {
    const token = await signToken(claims({ exp: nowInSeconds() - 30 }));

    await expectRejected(token, "AUTH_TOKEN_EXPIRED");
  });

  it.each([
    {
      caso: "assinado pela chave do atacante com kid do JWKS",
      token: () =>
        signToken(claims({ exp: nowInSeconds() - 60 }), { key: attacker, kid: ES256_KID }),
    },
    {
      caso: "payload adulterado depois de assinado",
      token: async () => {
        const original = await signToken(claims({ exp: nowInSeconds() - 60 }));
        const [header, , signature] = original.split(".");
        const tampered = base64url(claims({ exp: nowInSeconds() - 60, role: "service_role" }));
        return `${header}.${tampered}.${signature}`;
      },
    },
  ])("B7 — exp vencido com assinatura inválida ($caso): AUTH_INVALID_TOKEN", async ({ token }) => {
    await expectRejected(await token(), "AUTH_INVALID_TOKEN");
  });

  it.each([
    { caso: "nbf 30 s no futuro", payload: () => claims({ nbf: nowInSeconds() + 30 }) },
    { caso: "sem exp", payload: () => claims({}, ["exp"]) },
  ])("B8 — $caso: AUTH_INVALID_TOKEN", async ({ payload }) => {
    await expectRejected(await signToken(payload()), "AUTH_INVALID_TOKEN");
  });

  it("B9 — payload adulterado, com a assinatura original: AUTH_INVALID_TOKEN", async () => {
    const original = await signToken(claims());
    const [header, , signature] = original.split(".");
    const tampered = base64url(
      claims({ sub: "11111111-2222-4333-8444-555555555555" }),
    );

    await expectRejected(`${header}.${tampered}.${signature}`, "AUTH_INVALID_TOKEN");
  });

  it.each([
    {
      caso: "kid desconhecido",
      token: () => signToken(claims(), { key: attacker }),
    },
    {
      caso: "kid do JWKS com assinatura do atacante",
      token: () => signToken(claims(), { key: attacker, kid: ES256_KID }),
    },
    {
      caso: "header com jwk do atacante (sem kid)",
      token: () =>
        new SignJWT(claims())
          .setProtectedHeader({
            alg: "ES256",
            typ: "JWT",
            jwk: {
              kty: attacker.publicJwk.kty,
              crv: attacker.publicJwk.crv,
              x: attacker.publicJwk.x,
              y: attacker.publicJwk.y,
            },
          })
          .sign(attacker.privateKey),
    },
    {
      caso: "header com jku apontando para o atacante",
      token: () =>
        signToken(claims(), {
          key: attacker,
          header: { jku: "https://atacante.supabase.invalid/jwks.json" },
        }),
    },
    {
      caso: "header com x5u apontando para o atacante",
      token: () =>
        signToken(claims(), {
          key: attacker,
          header: { x5u: "https://atacante.supabase.invalid/cert.pem" },
        }),
    },
  ])("B10 — chave fora do JWKS ($caso): AUTH_INVALID_TOKEN", async ({ token }) => {
    await expectRejected(await token(), "AUTH_INVALID_TOKEN");
  });

  it("B11 — alg none: AUTH_INVALID_TOKEN", async () => {
    const token = `${base64url({ alg: "none", typ: "JWT" })}.${base64url(claims())}.`;

    await expectRejected(token, "AUTH_INVALID_TOKEN");
  });

  it.each([
    { caso: "JWK público do JWKS serializado como segredo", segredo: () => JSON.stringify(es256.publicJwk) },
    { caso: "segredo qualquer", segredo: () => "segredo-compartilhado-de-teste" },
  ])("B12 — HS256 ($caso): AUTH_INVALID_TOKEN", async ({ segredo }) => {
    const token = await new SignJWT(claims())
      .setProtectedHeader({ alg: "HS256", kid: ES256_KID, typ: "JWT" })
      .sign(new TextEncoder().encode(segredo()));

    await expectRejected(token, "AUTH_INVALID_TOKEN");
  });

  it.each([
    { caso: "iss de outro projeto", payload: () => claims({ iss: OTHER_PROJECT_ISSUER }) },
    { caso: "sem iss", payload: () => claims({}, ["iss"]) },
  ])("B13 — $caso: AUTH_INVALID_TOKEN", async ({ payload }) => {
    await expectRejected(await signToken(payload()), "AUTH_INVALID_TOKEN");
  });

  it.each([
    { caso: "aud diferente", payload: () => claims({ aud: "anon" }) },
    { caso: "sem aud", payload: () => claims({}, ["aud"]) },
    { caso: "aud lista sem authenticated", payload: () => claims({ aud: ["anon", "outro"] }) },
  ])("B14 — $caso: AUTH_INVALID_TOKEN", async ({ payload }) => {
    await expectRejected(await signToken(payload()), "AUTH_INVALID_TOKEN");
  });

  it("B14 — aud em lista que contém authenticated: aceito", async () => {
    const token = await signToken(claims({ aud: ["outro", "authenticated"] }));

    await expect(verify(token)).resolves.toMatchObject({ externalUserId: SUBJECT });
  });

  it.each([
    { caso: "role anon", payload: () => claims({ role: "anon" }) },
    { caso: "role service_role", payload: () => claims({ role: "service_role" }) },
    { caso: "sem role", payload: () => claims({}, ["role"]) },
  ])("B15 — $caso: AUTH_INVALID_TOKEN", async ({ payload }) => {
    await expectRejected(await signToken(payload()), "AUTH_INVALID_TOKEN");
  });

  it("B16 — is_anonymous true: AUTH_INVALID_TOKEN", async () => {
    await expectRejected(
      await signToken(claims({ is_anonymous: true })),
      "AUTH_INVALID_TOKEN",
    );
  });

  it.each([
    { caso: "is_anonymous false", payload: () => claims({ is_anonymous: false }) },
    { caso: "sem is_anonymous", payload: () => claims({}, ["is_anonymous"]) },
  ])("B16 — $caso: aceito", async ({ payload }) => {
    await expect(verify(await signToken(payload()))).resolves.toMatchObject({
      externalUserId: SUBJECT,
    });
  });

  it.each([
    { caso: "sem sub", payload: () => claims({}, ["sub"]) },
    { caso: "sub que não é UUID", payload: () => claims({ sub: "usuario-123" }) },
    { caso: "sub UUID sem hífens", payload: () => claims({ sub: SUBJECT.replaceAll("-", "") }) },
    { caso: "sub numérico", payload: () => claims({ sub: 123 }) },
    { caso: "sem session_id", payload: () => claims({}, ["session_id"]) },
    { caso: "session_id vazio", payload: () => claims({ session_id: "" }) },
    { caso: "session_id número", payload: () => claims({ session_id: 42 }) },
    { caso: "session_id nulo", payload: () => claims({ session_id: null }) },
  ])("B17 — $caso: AUTH_INVALID_TOKEN", async ({ payload }) => {
    await expectRejected(await signToken(payload()), "AUTH_INVALID_TOKEN");
  });

  it("B17 — sub UUID em maiúsculas: aceito (formato canônico, sem diferenciar maiúsculas)", async () => {
    const upper = SUBJECT.toUpperCase();
    const identity = await verify(await signToken(claims({ sub: upper })));

    expect(identity.externalUserId).toBe(upper);
  });

  it.each([
    { caso: "TypeError fetch failed", falha: () => new TypeError("fetch failed") },
    { caso: "JWKSTimeout", falha: () => new errors.JWKSTimeout() },
    { caso: "JWKSInvalid", falha: () => new errors.JWKSInvalid() },
  ])(
    "B18 — resolvedor de chave rejeita com $caso: AUTH_VERIFICATION_UNAVAILABLE, nunca identidade",
    async ({ falha }) => {
      const failure = falha();
      const failingKeySet: JWTVerifyGetKey = async () => {
        throw failure;
      };
      const verifier = createSupabaseAccessTokenVerifier({
        issuer: ISSUER,
        keySet: failingKeySet,
      });

      const error = await expectRejected(
        await signToken(claims()),
        "AUTH_VERIFICATION_UNAVAILABLE",
        verifier,
      );

      expect(error.cause).toBe(failure);
    },
  );

  it.each([
    { caso: "JWKSNoMatchingKey", falha: () => new errors.JWKSNoMatchingKey() },
    { caso: "JWKSMultipleMatchingKeys", falha: () => new errors.JWKSMultipleMatchingKeys() },
  ])(
    "B18 — resolvedor de chave rejeita com $caso: segue o fluxo normal (AUTH_INVALID_TOKEN)",
    async ({ falha }) => {
      const failingKeySet: JWTVerifyGetKey = async () => {
        throw falha();
      };
      const verifier = createSupabaseAccessTokenVerifier({
        issuer: ISSUER,
        keySet: failingKeySet,
      });

      await expectRejected(await signToken(claims()), "AUTH_INVALID_TOKEN", verifier);
    },
  );

  it.each([
    { caso: "ausente", valor: undefined },
    { caso: "vazia", valor: "" },
    { caso: "que não é URL", valor: "não é uma url" },
    { caso: "com http:", valor: "http://projeto-teste.supabase.invalid" },
    { caso: "com credenciais", valor: "https://u:s@projeto-teste.supabase.invalid" },
  ])(
    "B19 — verificador padrão com SUPABASE_URL $caso: AUTH_VERIFICATION_UNAVAILABLE",
    async ({ valor }) => {
      vi.stubEnv("SUPABASE_URL", valor);

      await expectRejected(
        await signToken(claims()),
        "AUTH_VERIFICATION_UNAVAILABLE",
        verifySupabaseAccessToken,
      );
    },
  );

  it("B21 — email, phone, metadata e claims extras não entram na identidade", async () => {
    const token = await signToken(
      claims({
        email: "pessoa@exemplo.invalid",
        phone: "+5511999999999",
        app_metadata: { provider: "email", roles: ["OWNER"] },
        user_metadata: { church_id: "igreja-1", role: "ADMIN" },
        church_id: "igreja-1",
        aal: "aal1",
        amr: [{ method: "password", timestamp: nowInSeconds() }],
      }),
    );

    const identity = await verify(token);

    expect(Object.keys(identity).sort()).toEqual([
      "expiresAt",
      "externalUserId",
      "sessionId",
    ]);
    expect(JSON.stringify(identity)).not.toMatch(/exemplo\.invalid|OWNER|ADMIN|igreja-1/);
  });

  it("B23 — JWKS com duas chaves (ES256 e RS256): tokens das duas aceitos", async () => {
    const [fromEs256, fromRs256] = await Promise.all([
      verify(await signToken(claims(), { key: es256 })),
      verify(await signToken(claims(), { key: rs256 })),
    ]);

    expect(fromEs256.externalUserId).toBe(SUBJECT);
    expect(fromRs256.externalUserId).toBe(SUBJECT);
  });

  it.each([
    { caso: "exp vencido há 2 s", payload: () => claims({ exp: nowInSeconds() - 2 }) },
    { caso: "nbf 2 s no futuro", payload: () => claims({ nbf: nowInSeconds() + 2 }) },
  ])("B25 — tolerância de 5 s ($caso): aceito", async ({ payload }) => {
    await expect(verify(await signToken(payload()))).resolves.toMatchObject({
      externalUserId: SUBJECT,
      sessionId: SESSION_ID,
    });
  });
});

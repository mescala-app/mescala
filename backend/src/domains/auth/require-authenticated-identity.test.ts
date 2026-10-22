/**
 * ============================================================
 * ARQUIVO: require-authenticated-identity.test.ts
 * DOMÍNIO: auth
 * FEATURE: AUTH-001
 * ============================================================
 *
 * OBJETIVO
 *
 * Testar requireAuthenticatedIdentity: leitura só do header
 * Authorization, formato `Bearer <token>`, repasse do token ao
 * verificador, propagação do erro do verificador sem alteração e
 * falha fechada do verificador padrão sem configuração.
 *
 * Cenários cobertos: B2, B3, B4, B5, B19 [D], B20, B22 [D], B26.
 *
 * Sem rede: o verificador é injetado (`vi.fn`). O padrão só é
 * usado com SUPABASE_URL ausente ou inválida, e falha antes de
 * criar o JWKS remoto. O `fetch` global é substituído por uma
 * função que lança erro e que, ao fim de cada caso, precisa não
 * ter sido chamada.
 *
 * ============================================================
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type {
  AuthenticatedIdentity,
  VerifyAccessToken,
} from "./authenticated-identity";
import { AuthenticationError } from "./authentication-error";
import { requireAuthenticatedIdentity } from "./require-authenticated-identity";

const REQUEST_URL = "https://backend.invalid/api/recurso";
const SAMPLE_TOKEN = "eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiJ0ZXN0ZSJ9.c2lnbmF0dXJh";

const blockedFetch = vi.fn(() => {
  throw new Error("Rede bloqueada nos testes da AUTH-001.");
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

function fakeIdentity(): AuthenticatedIdentity {
  return Object.freeze({
    externalUserId: "6f1c2a9e-7b4d-4e8a-9c21-5d6f7a8b9c0d",
    sessionId: "sessao-de-teste",
    expiresAt: new Date("2030-01-01T00:00:00Z"),
  });
}

function spyVerifier() {
  return vi.fn<VerifyAccessToken>(async () => fakeIdentity());
}

function requestWithAuthorization(...values: string[]): Request {
  return new Request(REQUEST_URL, {
    headers: values.map((value): [string, string] => ["authorization", value]),
  });
}

async function captureRejection(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error("Era esperada uma rejeição.");
}

/**
 * B22: percorre a mensagem, `String(erro)`, as propriedades
 * próprias (inclusive não enumeráveis e símbolos) e a cadeia de
 * `cause`, procurando qualquer um dos textos sensíveis.
 */
function expectNoLeak(error: unknown, sensitiveTexts: string[]): void {
  const texts = sensitiveTexts.filter((text) => text !== "");
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

describe("requireAuthenticatedIdentity", () => {
  it("B2 — sem header Authorization: AUTH_MISSING_CREDENTIAL, verificador não chamado", async () => {
    const verifier = spyVerifier();

    const error = await captureRejection(
      requireAuthenticatedIdentity(new Request(REQUEST_URL), verifier),
    );

    expect(error).toBeInstanceOf(AuthenticationError);
    expect(error).toMatchObject({ code: "AUTH_MISSING_CREDENTIAL" });
    expect(verifier).not.toHaveBeenCalled();
  });

  it.each(["", "   ", "\t"])(
    "B3 — Authorization vazio ou só com espaços (%j): AUTH_MISSING_CREDENTIAL, verificador não chamado",
    async (value) => {
      const verifier = spyVerifier();

      const error = await captureRejection(
        requireAuthenticatedIdentity(requestWithAuthorization(value), verifier),
      );

      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error).toMatchObject({ code: "AUTH_MISSING_CREDENTIAL" });
      expect(verifier).not.toHaveBeenCalled();
    },
  );

  it.each([
    { caso: "Bearer sem token", headers: ["Bearer"] },
    { caso: "Bearer com espaço final", headers: ["Bearer "] },
    { caso: "esquema Basic", headers: ["Basic dXNlcjpwYXNz"] },
    { caso: "esquema Token", headers: ["Token abc"] },
    { caso: "dois tokens", headers: ["Bearer a b"] },
    { caso: "dois espaços", headers: ["Bearer  abc"] },
    { caso: "tab no lugar do espaço", headers: ["Bearer\tabc"] },
    { caso: "vírgula no token", headers: ["Bearer a,b"] },
    { caso: "dois headers Authorization", headers: ["Bearer a", "Bearer b"] },
  ])(
    "B4 — $caso: AUTH_MALFORMED_CREDENTIAL, verificador não chamado",
    async ({ headers }) => {
      const verifier = spyVerifier();

      const error = await captureRejection(
        requireAuthenticatedIdentity(requestWithAuthorization(...headers), verifier),
      );

      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error).toMatchObject({ code: "AUTH_MALFORMED_CREDENTIAL" });
      expect(verifier).not.toHaveBeenCalled();
    },
  );

  it.each(["bearer abc", "BEARER abc", "Bearer abc"])(
    "B5 — esquema sem diferenciar maiúsculas (%s): verificador chamado uma vez com o token",
    async (value) => {
      const identity = fakeIdentity();
      const verifier = vi.fn<VerifyAccessToken>(async () => identity);

      const result = await requireAuthenticatedIdentity(
        requestWithAuthorization(value),
        verifier,
      );

      expect(verifier).toHaveBeenCalledTimes(1);
      expect(verifier).toHaveBeenCalledWith("abc");
      expect(result).toBe(identity);
    },
  );

  it.each([
    { caso: "ausente", valor: undefined },
    { caso: "vazia", valor: "" },
    { caso: "com http:", valor: "http://projeto-teste.supabase.invalid" },
    { caso: "com caminho", valor: "https://projeto-teste.supabase.invalid/auth/v1" },
  ])(
    "B19 — verificador padrão com SUPABASE_URL $caso: AUTH_VERIFICATION_UNAVAILABLE",
    async ({ valor }) => {
      vi.stubEnv("SUPABASE_URL", valor);

      const error = await captureRejection(
        requireAuthenticatedIdentity(requestWithAuthorization(`Bearer ${SAMPLE_TOKEN}`)),
      );

      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error).toMatchObject({ code: "AUTH_VERIFICATION_UNAVAILABLE" });
      expectNoLeak(error, [SAMPLE_TOKEN, `Bearer ${SAMPLE_TOKEN}`]);
    },
  );

  it.each([
    {
      caso: "na query",
      request: () => new Request(`${REQUEST_URL}?access_token=${SAMPLE_TOKEN}`),
    },
    {
      caso: "em cookie",
      request: () =>
        new Request(REQUEST_URL, {
          headers: { cookie: `sb-access-token=${SAMPLE_TOKEN}` },
        }),
    },
    {
      caso: "em x-user-id",
      request: () =>
        new Request(REQUEST_URL, {
          headers: { "x-user-id": "6f1c2a9e-7b4d-4e8a-9c21-5d6f7a8b9c0d" },
        }),
    },
    {
      caso: "no body",
      request: () =>
        new Request(REQUEST_URL, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ access_token: SAMPLE_TOKEN }),
        }),
    },
    {
      caso: "em apikey",
      request: () =>
        new Request(REQUEST_URL, { headers: { apikey: SAMPLE_TOKEN } }),
    },
  ])(
    "B20 — token só $caso: AUTH_MISSING_CREDENTIAL, verificador não chamado",
    async ({ request }) => {
      const verifier = spyVerifier();

      const error = await captureRejection(
        requireAuthenticatedIdentity(request(), verifier),
      );

      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error).toMatchObject({ code: "AUTH_MISSING_CREDENTIAL" });
      expect(verifier).not.toHaveBeenCalled();
    },
  );

  it.each([
    { caso: "B4, esquema Basic", headers: [`Basic ${SAMPLE_TOKEN}`] },
    { caso: "B4, dois tokens", headers: [`Bearer ${SAMPLE_TOKEN} extra`] },
    { caso: "B4, vírgula", headers: [`Bearer ${SAMPLE_TOKEN},outro`] },
    { caso: "B4, tab", headers: [`Bearer\t${SAMPLE_TOKEN}`] },
    {
      caso: "B4, dois headers",
      headers: [`Bearer ${SAMPLE_TOKEN}`, `Bearer ${SAMPLE_TOKEN}`],
    },
  ])(
    "B22 — erro sem token nem header ($caso)",
    async ({ headers }) => {
      const error = await captureRejection(
        requireAuthenticatedIdentity(requestWithAuthorization(...headers), spyVerifier()),
      );

      expect(error).toBeInstanceOf(AuthenticationError);
      expectNoLeak(error, [SAMPLE_TOKEN, ...headers]);
    },
  );

  it("B22 — erro sem token quando ele vem fora do header (B20)", async () => {
    const error = await captureRejection(
      requireAuthenticatedIdentity(
        new Request(`${REQUEST_URL}?access_token=${SAMPLE_TOKEN}`, {
          headers: { cookie: `sb-access-token=${SAMPLE_TOKEN}` },
        }),
        spyVerifier(),
      ),
    );

    expect(error).toBeInstanceOf(AuthenticationError);
    expectNoLeak(error, [SAMPLE_TOKEN]);
  });

  it("B26 — AuthenticationError do verificador chega ao chamador sem alteração", async () => {
    const original = new AuthenticationError("AUTH_TOKEN_EXPIRED");
    const verifier = vi.fn<VerifyAccessToken>(async () => {
      throw original;
    });

    const error = await captureRejection(
      requireAuthenticatedIdentity(requestWithAuthorization("Bearer abc"), verifier),
    );

    expect(error).toBe(original);
    expect(error).toMatchObject({ code: "AUTH_TOKEN_EXPIRED" });
    expect(verifier).toHaveBeenCalledTimes(1);
  });
});

/**
 * ============================================================
 * ARQUIVO: supabase-auth-config.test.ts
 * DOMÍNIO: infrastructure/supabase-auth
 * FEATURE: AUTH-001
 * ============================================================
 *
 * OBJETIVO
 *
 * Testar loadSupabaseAuthConfig: falha fechada com configuração
 * ausente ou inválida e derivação do issuer e da URL do JWKS a
 * partir de uma configuração válida.
 *
 * Cenários cobertos: B19 [C].
 *
 * Sem rede: o `fetch` global é substituído por uma função que
 * lança erro e que, ao fim de cada caso, precisa não ter sido
 * chamada. SUPABASE_URL só muda por `vi.stubEnv`, com o domínio
 * reservado `.invalid`.
 *
 * ============================================================
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { loadSupabaseAuthConfig } from "./supabase-auth-config";

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

function captureError(action: () => unknown): unknown {
  try {
    action();
  } catch (error) {
    return error;
  }
  throw new Error("Era esperado um erro.");
}

describe("loadSupabaseAuthConfig", () => {
  it.each([
    { caso: "ausente", valor: undefined },
    { caso: "vazia", valor: "" },
    { caso: "que não é URL", valor: "projeto-teste.supabase.invalid" },
    { caso: "com http:", valor: "http://projeto-teste.supabase.invalid" },
    { caso: "com caminho", valor: "https://projeto-teste.supabase.invalid/auth/v1" },
    { caso: "com query", valor: "https://projeto-teste.supabase.invalid/?ref=x" },
    { caso: "com query vazia", valor: "https://projeto-teste.supabase.invalid/?" },
    { caso: "com fragmento", valor: "https://projeto-teste.supabase.invalid/#x" },
    {
      caso: "com credenciais",
      valor: "https://usuario:senha@projeto-teste.supabase.invalid",
    },
  ])("B19 — SUPABASE_URL $caso: AUTH_VERIFICATION_UNAVAILABLE", ({ valor }) => {
    vi.stubEnv("SUPABASE_URL", valor);

    const error = captureError(() => loadSupabaseAuthConfig());

    expect(error).toMatchObject({
      name: "AuthenticationError",
      code: "AUTH_VERIFICATION_UNAVAILABLE",
    });
    expect(error).not.toHaveProperty("cause");
  });

  it.each([
    "https://projeto-teste.supabase.invalid",
    "https://projeto-teste.supabase.invalid/",
  ])("B19 — SUPABASE_URL válida (%s): deriva issuer e JWKS", (valor) => {
    vi.stubEnv("SUPABASE_URL", valor);

    const config = loadSupabaseAuthConfig();

    expect(config.issuer).toBe("https://projeto-teste.supabase.invalid/auth/v1");
    expect(config.jwksUrl).toBeInstanceOf(URL);
    expect(config.jwksUrl.href).toBe(
      "https://projeto-teste.supabase.invalid/auth/v1/.well-known/jwks.json",
    );
  });

  it("B19 — a configuração é lida de novo a cada chamada", () => {
    vi.stubEnv("SUPABASE_URL", undefined);
    expect(captureError(() => loadSupabaseAuthConfig())).toMatchObject({
      code: "AUTH_VERIFICATION_UNAVAILABLE",
    });

    vi.stubEnv("SUPABASE_URL", "https://projeto-teste.supabase.invalid");
    expect(loadSupabaseAuthConfig().issuer).toBe(
      "https://projeto-teste.supabase.invalid/auth/v1",
    );
  });
});

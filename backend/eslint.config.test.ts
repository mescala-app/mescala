/**
 * ============================================================
 * ARQUIVO: eslint.config.test.ts
 * DOMÍNIO: foundation
 * FEATURE: AUTH-001 (suíte GL)
 * ============================================================
 *
 * OBJETIVO
 *
 * Regressão das guardas de arquitetura do eslint.config.mjs
 * (ADR-002 e ADR-003). Cobre o B3 da FOUNDATION-001 (sondagens R4
 * e R5 e os dois casos extras), o B24 da AUTH-001 e a correção do
 * L-06 (casos `.jsx`).
 *
 * Cenários cobertos: GL1–GL12.
 *
 * Como funciona: uma instância do ESLint com a configuração real
 * do /backend (sem override) roda `lintText` com caminhos
 * virtuais. Nada é gravado em disco e não há rede. Toda chamada
 * confere que não houve erro de parse (`fatal`) nem arquivo
 * ignorado, para que "não acusa" nunca passe por engano.
 *
 * - "Acusa": ao menos uma mensagem de severidade 2, da regra
 *   `no-restricted-imports` ou `no-restricted-syntax`, com a tag
 *   (ADR-002 ou ADR-003) no texto.
 * - "Não acusa": nenhuma mensagem dessas duas regras.
 *
 * Toda mudança no eslint.config.mjs exige `npm run test`, e toda
 * guarda nova precisa de casos aqui.
 *
 * ============================================================
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

import { ESLint, type Linter } from "eslint";
import { beforeAll, describe, expect, it } from "vitest";

const BACKEND_DIR = path.dirname(fileURLToPath(import.meta.url));
const TIMEOUT_MS = 60_000;

const RESTRICTION_RULES = ["no-restricted-imports", "no-restricted-syntax"];

let eslint: ESLint;

beforeAll(async () => {
  eslint = new ESLint({ cwd: BACKEND_DIR });
  // Carrega configuração e plugins uma vez, dentro do tempo limite.
  await lint("src/domains/probe/probe.ts", "export const aquecimento = 1;\n");
}, TIMEOUT_MS);

async function lint(virtualPath: string, code: string): Promise<Linter.LintMessage[]> {
  const [result] = await eslint.lintText(code, {
    filePath: path.join(BACKEND_DIR, virtualPath),
  });

  // Sem erro de parse e sem "File ignored…" (mensagens sem ruleId).
  expect(result.messages.filter((message) => message.fatal)).toEqual([]);
  expect(result.messages.filter((message) => message.ruleId === null)).toEqual([]);

  return result.messages;
}

function restrictionMessages(messages: Linter.LintMessage[]): Linter.LintMessage[] {
  return messages.filter(
    (message) => message.ruleId !== null && RESTRICTION_RULES.includes(message.ruleId),
  );
}

async function expectFlagged(virtualPath: string, code: string, tag: string): Promise<void> {
  const hits = restrictionMessages(await lint(virtualPath, code)).filter(
    (message) => message.severity === 2 && message.message.includes(tag),
  );

  expect(hits.length, `${virtualPath}: ${code}`).toBeGreaterThan(0);
}

async function expectNotFlagged(virtualPath: string, code: string): Promise<void> {
  expect(restrictionMessages(await lint(virtualPath, code)), `${virtualPath}: ${code}`).toEqual(
    [],
  );
}

/** As nove formas de import exigidas pelo GL1 e pelo GL2. */
function importForms(moduleName: string): string[] {
  return [
    `import x from "${moduleName}";\nexport { x };\n`,
    `import "${moduleName}";\n`,
    `import type { X } from "${moduleName}";\nexport type { X };\n`,
    `export { x } from "${moduleName}";\n`,
    `export * from "${moduleName}";\n`,
    `import s = require("${moduleName}");\nexport { s };\n`,
    `export async function f() {\n  return import("${moduleName}");\n}\n`,
    `export async function f() {\n  return import(\`${moduleName}\`);\n}\n`,
    `export type T = import("${moduleName}").X;\n`,
  ];
}

function dynamicImport(moduleName: string): string {
  return `export async function f() {\n  return import("${moduleName}");\n}\n`;
}

function templateImport(moduleName: string): string {
  return `export async function f() {\n  return import(\`${moduleName}\`);\n}\n`;
}

function staticImport(moduleName: string): string {
  return `import x from "${moduleName}";\nexport { x };\n`;
}

const DOMAIN_FILE = "src/domains/probe/probe.ts";
const ROUTE_FILE = "src/app/api/probe/route.ts";

describe("Guardas de arquitetura do eslint.config.mjs", { timeout: TIMEOUT_MS }, () => {
  it.each(
    ["next", "next/server"].flatMap((moduleName) =>
      importForms(moduleName).map((code) => ({ moduleName, code })),
    ),
  )("GL1 — domínio acusa $moduleName (ADR-002): $code", async ({ code }) => {
    await expectFlagged(DOMAIN_FILE, code, "ADR-002");
  });

  it.each(
    ["jose", "jose/qualquer", "@supabase/supabase-js"].flatMap((moduleName) =>
      importForms(moduleName).map((code) => ({ moduleName, code })),
    ),
  )("GL2 — domínio acusa $moduleName (ADR-003): $code", async ({ code }) => {
    await expectFlagged(DOMAIN_FILE, code, "ADR-003");
  });

  it.each(
    ["tsx", "mts", "cts", "js", "jsx", "mjs"].flatMap((ext) => {
      const cases = [
        { ext, code: staticImport("next/server"), tag: "ADR-002" },
        { ext, code: staticImport("jose"), tag: "ADR-003" },
        { ext, code: dynamicImport("next/server"), tag: "ADR-002" },
        { ext, code: dynamicImport("jose"), tag: "ADR-003" },
      ];
      if (["js", "jsx", "mjs"].includes(ext)) {
        cases.push(
          { ext, code: templateImport("next/server"), tag: "ADR-002" },
          { ext, code: templateImport("jose"), tag: "ADR-003" },
        );
      }
      return cases;
    }),
  )("GL3 — domínio .$ext acusa ($tag): $code", async ({ ext, code, tag }) => {
    await expectFlagged(`src/domains/probe/probe.${ext}`, code, tag);
  });

  it.each([
    { ext: "js", code: `const s = require("next/server");\nexport { s };\n` },
    { ext: "js", code: `const j = require("jose");\nexport { j };\n` },
    { ext: "cjs", code: `const s = require("next/server");\nmodule.exports = s;\n` },
    { ext: "cjs", code: `const j = require("jose");\nmodule.exports = j;\n` },
  ])("GL4 — domínio .$ext: require() gera erro (L-04): $code", async ({ ext, code }) => {
    const messages = await lint(`src/domains/probe/probe.${ext}`, code);

    expect(messages.some((message) => message.severity === 2)).toBe(true);
  });

  it("GL4 — domínio .cjs: import() de next/server acusa (ADR-002)", async () => {
    await expectFlagged(
      "src/domains/probe/probe.cjs",
      `async function f() {\n  return import("next/server");\n}\nmodule.exports = f;\n`,
      "ADR-002",
    );
  });

  it.each(
    [
      "next-auth",
      "nextSomething",
      "@next/env",
      "./next",
      "../next",
      "node:crypto",
      "joseph",
      "./jose",
      "@supabase-community/x",
      "@/domains/auth/authentication-error",
      "@/infrastructure/supabase-auth/supabase-access-token-verifier",
    ].flatMap((moduleName) => [
      { moduleName, code: staticImport(moduleName) },
      { moduleName, code: dynamicImport(moduleName) },
    ]),
  )("GL5 — domínio não acusa $moduleName: $code", async ({ code }) => {
    await expectNotFlagged(DOMAIN_FILE, code);
  });

  it("GL5 — domínio não acusa import() com template interpolado (L-05)", async () => {
    await expectNotFlagged(
      DOMAIN_FILE,
      "export async function f(x: string) {\n  return import(`next/${x}`);\n}\n",
    );
  });

  it.each([
    `export const runtime = "edge";\n`,
    `export const runtime = "experimental-edge";\n`,
    `const runtime = "nodejs";\nexport { runtime };\n`,
    `export { runtime } from "./x";\n`,
  ])("GL6 — rota acusa runtime (ADR-002): %s", async (code) => {
    await expectFlagged(ROUTE_FILE, code, "ADR-002");
  });

  it.each(["tsx", "mts", "js", "jsx", "mjs"])(
    "GL7 — rota .%s acusa runtime edge (ADR-002)",
    async (ext) => {
      await expectFlagged(`src/app/api/probe/route.${ext}`, `export const runtime = "edge";\n`, "ADR-002");
    },
  );

  it.each([
    `export const runtime = "nodejs";\n`,
    `import { NextResponse } from "next/server";\nexport { NextResponse };\n`,
    `import { requireAuthenticatedIdentity } from "@/domains/auth/require-authenticated-identity";\nexport { requireAuthenticatedIdentity };\n`,
    `import type { AuthenticatedIdentity } from "@/domains/auth/authenticated-identity";\nexport type { AuthenticatedIdentity };\n`,
  ])("GL8 — rota não acusa: %s", async (code) => {
    await expectNotFlagged(ROUTE_FILE, code);
  });

  it.each([
    `import { jwtVerify } from "jose";\nexport { jwtVerify };\n`,
    `import type { JWTPayload } from "jose";\nexport type { JWTPayload };\n`,
    staticImport("jose/qualquer"),
    `import { createClient } from "@supabase/supabase-js";\nexport { createClient };\n`,
    `import { verifySupabaseAccessToken } from "@/infrastructure/supabase-auth/supabase-access-token-verifier";\nexport { verifySupabaseAccessToken };\n`,
    `import { loadSupabaseAuthConfig } from "../../../infrastructure/supabase-auth/supabase-auth-config";\nexport { loadSupabaseAuthConfig };\n`,
    dynamicImport("jose"),
    templateImport("jose"),
    dynamicImport("@/infrastructure/supabase-auth/supabase-auth-config"),
    `export type T = import("jose").JWTPayload;\n`,
  ])("GL9 — rota acusa (ADR-003): %s", async (code) => {
    await expectFlagged(ROUTE_FILE, code, "ADR-003");
  });

  it.each(
    ["js", "jsx", "mts"].flatMap((ext) => [
      { ext, code: `import { jwtVerify } from "jose";\nexport { jwtVerify };\n` },
      { ext, code: staticImport("@/infrastructure/supabase-auth/supabase-auth-config") },
    ]),
  )("GL10 — rota .$ext acusa (ADR-003): $code", async ({ ext, code }) => {
    await expectFlagged(`src/app/api/probe/route.${ext}`, code, "ADR-003");
  });

  it.each([
    {
      area: "domínio",
      virtualPath: DOMAIN_FILE,
      code: `import "next/server";\nimport "jose";\n`,
    },
    {
      area: "rota",
      virtualPath: ROUTE_FILE,
      code: `export const runtime = "edge";\nimport { jwtVerify } from "jose";\nexport { jwtVerify };\n`,
    },
  ])(
    "GL11 — $area: as restrições do ADR-002 e do ADR-003 somam (duas mensagens)",
    async ({ virtualPath, code }) => {
      const messages = restrictionMessages(await lint(virtualPath, code)).filter(
        (message) => message.severity === 2,
      );

      // A mensagem configurada vem depois do texto padrão da regra.
      expect(messages).toHaveLength(2);
      expect(messages.filter((message) => message.message.includes("ADR-002"))).toHaveLength(1);
      expect(messages.filter((message) => message.message.includes("ADR-003"))).toHaveLength(1);
    },
  );

  it("GL12 — infraestrutura supabase-auth pode importar jose", async () => {
    await expectNotFlagged(
      "src/infrastructure/supabase-auth/probe.ts",
      `import { jwtVerify } from "jose";\nexport { jwtVerify };\n`,
    );
  });
});

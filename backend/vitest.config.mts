/**
 * ============================================================
 * ARQUIVO: vitest.config.mts
 * DOMÍNIO: foundation
 * FEATURE: AUTH-001
 * DECISÃO: DEC-02 (Vitest)
 * ============================================================
 *
 * OBJETIVO
 *
 * Configuração única dos testes do /backend (`npm run test`,
 * que executa `vitest run`, uma vez, sem watch).
 *
 * - `.mts`: ESM explícito, já que o package.json não declara
 *   "type": "module".
 * - Alias `@/` → `src/`, equivalente ao `paths` do tsconfig.json,
 *   calculado a partir deste arquivo. Sem plugin.
 * - Testes: `<arquivo>.test.ts` ao lado do arquivo testado, em
 *   `src/`, e `eslint.config.test.ts` (suíte GL) na raiz.
 * - Ambiente Node; `describe`, `it`, `expect` e `vi` são
 *   importados de `vitest` em cada teste (sem globais).
 *
 * Casos cobertos pelos testes: AUTH-001 (B1–B23, B25, B26), H1,
 * H2 e GL1–GL12.
 *
 * ============================================================
 */

import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// Pasta src/ do /backend, com separador final.
const SRC_DIR = fileURLToPath(new URL("./src/", import.meta.url));

export default defineConfig({
  resolve: {
    // `@/x` → `<backend>/src/x`. Expressão regular porque a chave em
    // texto exige `/` depois dela (não casaria `@/x` com a chave `@/`).
    alias: [{ find: /^@\//, replacement: SRC_DIR }],
  },
  test: {
    include: ["src/**/*.test.ts", "eslint.config.test.ts"],
    environment: "node",
    globals: false,
  },
});

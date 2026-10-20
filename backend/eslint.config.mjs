/**
 * ============================================================
 * ARQUIVO: eslint.config.mjs
 * DOMÍNIO: foundation
 * FEATURE: FOUNDATION-001
 * ============================================================
 *
 * OBJETIVO
 *
 * Configuração de lint do backend oficial (/backend): regras
 * padrão do Next.js + guardas estáticas exigidas pelo ADR-002.
 *
 * ------------------------------------------------------------
 * GUARDAS DO ADR-002
 * ------------------------------------------------------------
 *
 * 1. src/domains/** não pode importar `next` nem `next/*`
 *    (ADR-002#Regras de negócio). Vale para import/export
 *    estático (inclusive `import type`) e para `import()`
 *    dinâmico ou de tipo com especificador estático (string
 *    ou template sem interpolação). Especificador calculado
 *    em tempo de execução não é verificável estaticamente.
 *    Arquivos cobertos: .ts, .tsx, .mts, .cts, .js, .mjs e .cjs.
 *
 * 2. src/app/** não pode exportar `runtime` diferente de
 *    'nodejs' (ADR-002#Runtime). Reexportar `runtime`
 *    (`export { runtime }`) também é bloqueado: o valor não
 *    pode ser conferido estaticamente, e o Next.js ignora
 *    configuração de segmento reexportada.
 *
 * ============================================================
 */

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  // ADR-002#Regras de negócio: o domínio não depende do Next.js.
  {
    files: ["src/domains/**/*.{ts,tsx,mts,cts,js,mjs,cjs}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next",
              message: "ADR-002: src/domains não pode depender do Next.js.",
            },
          ],
          patterns: [
            {
              group: ["next/*"],
              message: "ADR-002: src/domains não pode depender do Next.js.",
            },
          ],
        },
      ],
      // ADR-002#Regras de negócio: cobre as formas de `import()`
      // (dinâmico e de tipo) que `no-restricted-imports` não trata.
      "no-restricted-syntax": [
        "error",
        {
          selector: String.raw`ImportExpression[source.value=/^next(\/|$)/]`,
          message: "ADR-002: src/domains não pode depender do Next.js.",
        },
        {
          selector: String.raw`ImportExpression > TemplateLiteral.source[expressions.length=0] > TemplateElement[value.cooked=/^next(\/|$)/]`,
          message: "ADR-002: src/domains não pode depender do Next.js.",
        },
        {
          selector: String.raw`TSImportType[source.value=/^next(\/|$)/]`,
          message: "ADR-002: src/domains não pode depender do Next.js.",
        },
      ],
    },
  },

  // ADR-002#Runtime: Node.js é o runtime padrão; Edge Runtime não.
  {
    files: ["src/app/**/*.{ts,tsx,js,mjs,cjs}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[id.name='runtime']:not([init.value='nodejs'])",
          message: "ADR-002: o runtime do backend é 'nodejs'.",
        },
        {
          // Reexportação impede verificar o valor estaticamente.
          selector: "ExportSpecifier[exported.name='runtime']",
          message:
            "ADR-002: declare `export const runtime = 'nodejs'` diretamente.",
        },
      ],
    },
  },

  globalIgnores([".next/**", "out/**", "node_modules/**", "next-env.d.ts"]),
]);

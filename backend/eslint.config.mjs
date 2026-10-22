/**
 * ============================================================
 * ARQUIVO: eslint.config.mjs
 * DOMÍNIO: foundation
 * FEATURE: FOUNDATION-001; alterado pela AUTH-001 (guardas do ADR-003 e correção do L-06)
 * ============================================================
 *
 * OBJETIVO
 *
 * Configuração de lint do backend oficial (/backend): regras
 * padrão do Next.js + guardas estáticas exigidas pelo ADR-002 e
 * pelo ADR-003.
 *
 * ------------------------------------------------------------
 * GUARDAS DE ARQUITETURA (ADR-002 e ADR-003)
 * ------------------------------------------------------------
 *
 * 1. src/domains/** não pode importar:
 *    - `next` e `next/*` (ADR-002#Regras de negócio: o domínio
 *      não depende do Next.js);
 *    - `jose`, `jose/*` e `@supabase/*` (ADR-003: o domínio não
 *      depende do provedor de autenticação nem da biblioteca de
 *      JWT).
 *    Formas cobertas: import e export estáticos (inclusive
 *    `import type` e `import x = require()`); `import()` dinâmico
 *    com especificador string ou template sem interpolação;
 *    `import("…")` em posição de tipo, só com string (o TypeScript
 *    recusa outro especificador nessa posição). Especificador
 *    calculado em tempo de execução não é verificável
 *    estaticamente (L-05). `require()` em `.js`/`.cjs` é barrado
 *    pela regra herdada `@typescript-eslint/no-require-imports`
 *    (L-04).
 *    Arquivos cobertos: .ts, .tsx, .mts, .cts, .js, .jsx, .mjs e .cjs.
 *
 * 2. src/app/**:
 *    2a. não pode exportar `runtime` diferente de 'nodejs'
 *        (ADR-002#Runtime). Reexportar `runtime`
 *        (`export { runtime }`) também é bloqueado: o valor não
 *        pode ser conferido estaticamente, e o Next.js ignora
 *        configuração de segmento reexportada;
 *    2b. não pode importar `jose`, `jose/*`, `@supabase/*` nem
 *        qualquer especificador com o segmento
 *        `infrastructure/supabase-auth`, pelo alias `@/` ou por
 *        caminho relativo (ADR-003, item 8: os Route Handlers usam
 *        só `@/domains/auth`).
 *    Formas cobertas (2b): as mesmas do item 1.
 *    Arquivos cobertos: .ts, .tsx, .mts, .cts, .js, .jsx, .mjs e .cjs.
 *
 * Cada área tem um único objeto de configuração, com
 * `no-restricted-imports` e `no-restricted-syntax` juntos: no flat
 * config, um segundo objeto com a mesma regra para os mesmos
 * arquivos substituiria o primeiro em vez de somar.
 *
 * Regressão: `eslint.config.test.ts` (suíte GL). Toda mudança
 * neste arquivo exige `npm run test`.
 *
 * ============================================================
 */

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const DOMAIN_NEXT_MESSAGE = "ADR-002: src/domains não pode depender do Next.js.";
const DOMAIN_AUTH_MESSAGE =
  "ADR-003: src/domains não depende do provedor de autenticação nem da biblioteca de JWT.";
const APP_AUTH_MESSAGE =
  "ADR-003: Route Handlers usam só @/domains/auth; não importam jose, @supabase/* nem infrastructure/supabase-auth.";

// Especificadores proibidos, como expressão regular do esquery.
const NEXT_SOURCE = String.raw`/^next(\/|$)/`;
const AUTH_PROVIDER_SOURCE = String.raw`/^(jose(\/|$)|@supabase\/)/`;
const AUTH_INFRASTRUCTURE_SOURCE = String.raw`/(^|\/)infrastructure\/supabase-auth(\/|$)/`;

/**
 * Seletores das formas de `import()` que `no-restricted-imports`
 * não trata: dinâmico com string, dinâmico com template sem
 * interpolação e em posição de tipo.
 */
function importCallRestrictions(sourceRegex, message) {
  return [
    {
      selector: `ImportExpression[source.value=${sourceRegex}]`,
      message,
    },
    {
      selector: `ImportExpression > TemplateLiteral.source[expressions.length=0] > TemplateElement[value.cooked=${sourceRegex}]`,
      message,
    },
    {
      selector: `TSImportType[source.value=${sourceRegex}]`,
      message,
    },
  ];
}

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  // Guarda 1. ADR-002#Regras de negócio (o domínio não depende do
  // Next.js) e ADR-003 (o domínio não depende do provedor nem do JWT).
  {
    files: ["src/domains/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "next", message: DOMAIN_NEXT_MESSAGE },
            { name: "jose", message: DOMAIN_AUTH_MESSAGE },
          ],
          patterns: [
            { group: ["next/*"], message: DOMAIN_NEXT_MESSAGE },
            { group: ["jose/*", "@supabase/*"], message: DOMAIN_AUTH_MESSAGE },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        ...importCallRestrictions(NEXT_SOURCE, DOMAIN_NEXT_MESSAGE),
        ...importCallRestrictions(AUTH_PROVIDER_SOURCE, DOMAIN_AUTH_MESSAGE),
      ],
    },
  },

  // Guarda 2. ADR-002#Runtime (Node.js, não Edge) e ADR-003, item 8
  // (os Route Handlers chegam à autenticação só por @/domains/auth).
  {
    files: ["src/app/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [{ name: "jose", message: APP_AUTH_MESSAGE }],
          patterns: [
            { group: ["jose/*", "@supabase/*"], message: APP_AUTH_MESSAGE },
            {
              // Alias `@/` e caminho relativo.
              regex: "(^|/)infrastructure/supabase-auth(/|$)",
              message: APP_AUTH_MESSAGE,
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        // 2a. ADR-002#Runtime.
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
        // 2b. ADR-003, item 8.
        ...importCallRestrictions(AUTH_PROVIDER_SOURCE, APP_AUTH_MESSAGE),
        ...importCallRestrictions(AUTH_INFRASTRUCTURE_SOURCE, APP_AUTH_MESSAGE),
      ],
    },
  },

  globalIgnores([".next/**", "out/**", "node_modules/**", "next-env.d.ts"]),
]);

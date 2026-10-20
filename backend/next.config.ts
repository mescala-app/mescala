/**
 * ============================================================
 * ARQUIVO: next.config.ts
 * DOMÍNIO: foundation
 * FEATURE: FOUNDATION-001
 * ============================================================
 *
 * OBJETIVO
 *
 * Fixar /backend como raiz do projeto Next.js.
 *
 * O repositório possui outro package-lock.json na raiz
 * (frontend Vite). Sem esta configuração, o Next.js infere a
 * raiz do repositório como workspace root, o que contraria o
 * /backend como pacote npm independente (FOUNDATION-001 §5.1).
 *
 * ============================================================
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  outputFileTracingRoot: __dirname,
};

export default nextConfig;

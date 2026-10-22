/**
 * ============================================================
 * ARQUIVO: route.test.ts (src/app/api/health/route.test.ts)
 * DOMÍNIO: foundation
 * FEATURE: AUTH-001 (automatiza B1 e B2 da FOUNDATION-001)
 * ============================================================
 *
 * OBJETIVO
 *
 * Regressão da rota técnica de saúde (DEC-01) no nível do módulo:
 * - H1: GET() responde 200, JSON, corpo {"status":"ok"};
 * - H2: o único método HTTP exportado é GET. É a condição para o
 *   Next.js responder 405 a POST, PUT, PATCH e DELETE. O 405 real,
 *   com servidor rodando, fica para a AUTH-003.
 *
 * Cenários cobertos: H1, H2.
 *
 * Sem rede: chama GET() diretamente e inspeciona as exportações do
 * módulo, sem subir servidor.
 *
 * ============================================================
 */

import { describe, expect, it } from "vitest";

import * as healthRoute from "./route";
import { GET } from "./route";

const HTTP_METHODS = ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];

describe("GET /api/health", () => {
  it('H1 — GET() responde 200, application/json e corpo {"status":"ok"}', async () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch(/^application\/json/);
    expect(await response.text()).toBe('{"status":"ok"}');
  });

  it("H2 — o único método HTTP exportado pelo módulo é GET", () => {
    const exportedMethods = Object.keys(healthRoute).filter((name) =>
      HTTP_METHODS.includes(name),
    );

    expect(exportedMethods).toEqual(["GET"]);
  });
});

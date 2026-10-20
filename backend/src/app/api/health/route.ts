/**
 * ============================================================
 * ARQUIVO: route.ts (src/app/api/health/route.ts)
 * DOMÍNIO: foundation
 * FEATURE: FOUNDATION-001
 * ============================================================
 *
 * OBJETIVO
 *
 * Rota técnica de verificação de saúde do backend:
 * GET /api/health -> HTTP 200 {"status":"ok"}.
 *
 * Exceção técnica controlada definida pela DEC-01. A rota é
 * pública, não recebe parâmetros e não lê body, headers,
 * cookies, variáveis de ambiente nem banco. Não identifica
 * usuário nem igreja.
 *
 * Esta rota NÃO estabelece envelope de resposta, padrão de
 * erros nem convenção para as APIs de negócio (DEC-01).
 * Não extraia helpers ou tipos reaproveitáveis daqui.
 *
 * Somente GET é implementado neste arquivo. Os demais métodos
 * seguem o comportamento padrão do Next.js, sem implementação
 * manual:
 * - HEAD: 200, atendido pelo próprio handler GET;
 * - OPTIONS: 204, com o header Allow: GET, HEAD, OPTIONS;
 * - POST, PUT, PATCH e DELETE: 405.
 *
 * ------------------------------------------------------------
 * SUMÁRIO DE FUNÇÕES
 * ------------------------------------------------------------
 *
 * 1. GET
 *    PT-BR: Verificar Saúde do Backend
 *
 *    Responsabilidade:
 *    Responder HTTP 200 com o corpo fixo {"status":"ok"}.
 *
 * ------------------------------------------------------------
 * DEPENDÊNCIAS EXTERNAS
 * ------------------------------------------------------------
 *
 * Nenhuma.
 *
 * ------------------------------------------------------------
 * REGRAS RELACIONADAS
 * ------------------------------------------------------------
 *
 * DEC-01 (Rota técnica de verificação de saúde)
 * ADR-002#Route Handlers
 * ADR-002#Runtime
 *
 * ============================================================
 */

export function GET(): Response {
  return Response.json({ status: "ok" });
}

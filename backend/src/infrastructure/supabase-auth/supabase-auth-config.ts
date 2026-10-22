/**
 * ============================================================
 * ARQUIVO: supabase-auth-config.ts
 * DOMÍNIO: infrastructure/supabase-auth
 * FEATURE: AUTH-001
 * DECISÃO: ADR-003 (Autenticação do backend oficial); DEC-05
 * ============================================================
 *
 * OBJETIVO
 *
 * Ler e validar a única configuração da autenticação,
 * SUPABASE_URL, e derivar dela o issuer aceito e a URL do JWKS
 * público do projeto oficial.
 *
 * O valor vem só do ambiente (configurado pelo PO). Nenhuma URL
 * ou ref de projeto fica fixa no código (AUTH-001, regra 12).
 * Nenhum segredo é lido (ADR-003, item 9).
 *
 * ------------------------------------------------------------
 * SUMÁRIO DE FUNÇÕES
 * ------------------------------------------------------------
 *
 * 1. loadSupabaseAuthConfig
 *    PT-BR: Carregar Configuração do Supabase Auth
 *
 *    Responsabilidade:
 *    Ler SUPABASE_URL a cada chamada e devolver:
 *    - issuer  = <origem>/auth/v1
 *    - jwksUrl = <origem>/auth/v1/.well-known/jwks.json
 *    Aceita só URL absoluta `https:`, com caminho vazio ou `/`,
 *    sem query, fragmento nem credenciais. A barra final é
 *    descartada. Valor ausente ou inválido: lança
 *    AuthenticationError com AUTH_VERIFICATION_UNAVAILABLE
 *    (falha fechada, ADR-003, item 11). Nada é guardado em cache
 *    aqui: quem chama decide quando ler de novo.
 *
 * ------------------------------------------------------------
 * DEPENDÊNCIAS EXTERNAS
 * ------------------------------------------------------------
 *
 * AuthenticationError
 *
 * Arquivo:
 * domains/auth/authentication-error.ts
 *
 * Responsabilidade:
 * Erro único da autenticação, com código.
 *
 * ------------------------------------------------------------
 * REGRAS RELACIONADAS
 * ------------------------------------------------------------
 *
 * ADR-003 (itens 4, 5, 9 e 11)
 * DEC-05 (valor de operação definido pelo PO no ambiente)
 * AUTH-001 (FC-4, FC-5 passo 4a, regras 5 e 12)
 *
 * ============================================================
 */

import { AuthenticationError } from "@/domains/auth/authentication-error";

export type SupabaseAuthConfig = Readonly<{
  issuer: string;
  jwksUrl: URL;
}>;

export function loadSupabaseAuthConfig(): SupabaseAuthConfig {
  const origin = parseSupabaseOrigin(process.env.SUPABASE_URL);

  return {
    issuer: `${origin}/auth/v1`,
    jwksUrl: new URL(`${origin}/auth/v1/.well-known/jwks.json`),
  };
}

/**
 * Validar SUPABASE_URL e devolver a origem, sem barra final.
 *
 * Comparar `href` com `<origem>/` recusa de uma vez caminho,
 * query (inclusive um `?` vazio), fragmento (inclusive um `#`
 * vazio) e credenciais. O erro não leva `cause` para não ecoar o
 * valor recebido.
 */
function parseSupabaseOrigin(rawValue: string | undefined): string {
  if (rawValue === undefined || rawValue === "") {
    throw new AuthenticationError("AUTH_VERIFICATION_UNAVAILABLE");
  }

  let url: URL;
  try {
    url = new URL(rawValue);
  } catch {
    throw new AuthenticationError("AUTH_VERIFICATION_UNAVAILABLE");
  }

  if (url.protocol !== "https:" || url.href !== `${url.origin}/`) {
    throw new AuthenticationError("AUTH_VERIFICATION_UNAVAILABLE");
  }

  return url.origin;
}

---
tipo: decisao
status: aceito
data: 2026-10-04
feature: FOUNDATION-001
relacionado:
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[tecnico/API]]"
---
# DEC-01 — Rota técnica de verificação de saúde

## Status

**ACEITO**

---

A FOUNDATION-001 incluirá a rota técnica:

```text
GET /api/health
```

Resposta:

```text
HTTP 200
{"status":"ok"}
```

Natureza:
Endpoint estritamente operacional de verificação de saúde do backend.

A rota:
- é pública;
- não recebe parâmetros;
- não lê body;
- não lê headers;
- não lê cookies;
- não lê variáveis de ambiente;
- não acessa banco;
- não identifica usuário;
- não identifica igreja;
- não possui regra de negócio;
- não estabelece padrão definitivo para APIs de negócio.

Esta rota constitui uma exceção técnica controlada enquanto
`tecnico/API` permanecer A DEFINIR.

Nenhuma outra rota poderá ser criada com base nesta exceção.

DEC-01 não define:
- envelope padrão de resposta;
- padrão de erros;
- autenticação;
- autorização;
- validação;
- versionamento da API;
- convenções das APIs de negócio.

---

Relacionados: [[decisoes/ADR-002-BACKEND-OFICIAL]], [[tecnico/API]], [[tecnico/BACKEND]], [[seguranca/AUTENTICACAO]], [[seguranca/ISOLAMENTO-DE-DADOS]].

Relacionados (acrescentados em 2026-10-06): [[features/FOUNDATION-001]], [[decisoes/PENDENCIAS]].

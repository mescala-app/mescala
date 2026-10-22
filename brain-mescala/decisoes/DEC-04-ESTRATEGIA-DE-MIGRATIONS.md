---
tipo: decisao
status: parcial
parte-1: aceita
parte-2: aberta
data: 2026-10-21
origem: FOUNDATION-001 (decisões pendentes do contrato)
relacionado:
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]]"
  - "[[decisoes/DEC-09-MODELO-DE-DADOS]]"
  - "[[tecnico/BANCO-DE-DADOS]]"
  - "[[decisoes/PENDENCIAS]]"
---
# DEC-04 — Estratégia de migrations e forma de acesso ao banco

## Status
- **Parte 1 (estratégia de migrations): ACEITA** em 2026-10-21, pelo PO.
- **Parte 2 (forma de acesso do backend ao banco): ABERTA.** Continua **A DEFINIR**.

- **Origem:** decisão pendente do contrato da [[features/FOUNDATION-001]] (`docs/features/FOUNDATION-001.md`, fora do vault). O [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] deixa "estratégia de migrations", "ORM" e "query builder" fora do seu escopo. Registro da pendência: [[decisoes/PENDENCIAS#DEC-04 — Estratégia de migrations e forma de acesso ao banco|PENDENCIAS]].

---

## Parte 1 — Estratégia de migrations (aceita)

### Decisão
1. **Local das migrations oficiais:** `backend/supabase/migrations/`, gerenciadas pelo **Supabase CLI**, com configuração própria em `backend/supabase/config.toml`, ligada ao projeto oficial `vitqnyzuvrvkmnvshcpb` ([[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL|DEC-05]]).
2. **Migrations legadas:** a `supabase/` da raiz continua com as 9 migrations legadas, ligadas ao app legado ([[tecnico/LEGADO-ATUAL]]). Elas **nunca** são aplicadas no banco novo.
3. **Aplicação:** manual, pelo PO (SQL Editor ou CLI). Nenhum agente aplica migration ([[features/FLUXO-DE-ENTREGA]]).
4. **Integração GitHub ↔ Supabase:** não deve ser conectada por enquanto. Se for conectada, com diretório `backend/supabase` e deploy automático **desligado**.

### Consequências
- O [[agents/analista-de-dados|Analista de Dados]] cria os arquivos de migration oficiais em `backend/supabase/migrations/` e nunca os aplica.
- Formato do nome, pelo padrão aceito na [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-018 — Nomenclatura e idioma|DATA-DEC-018]] (seção 13.4 do relatório): `<YYYYMMDDHHMMSS>_<objetivo>.sql`, uma migration por objetivo. A seção 13.4 escreve o caminho como `supabase/migrations/`, porque é anterior a esta decisão; o local vale como decidido aqui.
- O schema oficial é reproduzível pelas migrations versionadas, como exige o [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]].
- Em 2026-10-21, `backend/supabase/` ainda não existe no repositório. Nenhuma migration oficial foi criada; a Fase 4 depende do contrato FOUNDATION-002 e de autorização explícita do PO ([[features/FLUXO-DE-ENTREGA]]).
- **Registro de 2026-10-22:** o contrato [[features/FOUNDATION-002]] foi emitido (VERSÃO 2, READY) e o PO autorizou a Fase 4. `backend/supabase/` existe, com `config.toml` (só `project_id` como conteúdo funcional) e as 9 migrations da FOUNDATION-002 em `migrations/`, **escritas e não aplicadas**. Para a aplicação, depois das revisões, o contrato recomenda a CLI, sempre rodada a partir de `/backend` (nunca da raiz, que tem o vínculo legado); as convenções das migrations estão em [[tecnico/BANCO-DE-DADOS#Convenções do schema oficial (FOUNDATION-002, 2026-10-22)|tecnico/BANCO-DE-DADOS]]. A decisão não mudou.

---

## Parte 2 — Forma de acesso do backend ao banco (aberta)

- **Pergunta:** como o backend acessa o Postgres: driver, query builder ou ORM? Qual biblioteca?
- **Situação:** **A DEFINIR.**
- **Já decidido por outra decisão:** a [[decisoes/DEC-09-MODELO-DE-DADOS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]], aceita na opção A, já implica que o backend **conecta direto ao Postgres** com um papel **sem BYPASSRLS** e define o contexto (usuário, igreja) em cada transação. A parte 2 escolhe a ferramenta dentro desse limite.
- **Contexto:** o contrato da [[features/FOUNDATION-001]] proibia ORM, query builder e driver de Postgres; cada contrato traz a própria lista, interpretada pela [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]].
- **Efeito:** o [[agents/desenvolvedor-backend|Desenvolvedor]] só instala dependências aprovadas por ADR ou Feature Contract; nenhuma biblioteca de acesso ao banco entra sem esta decisão ou sem um contrato que a aprove.

---

Relacionados: [[decisoes/ADR-002-BACKEND-OFICIAL]], [[decisoes/DEC-05-PROJETO-SUPABASE-OFICIAL]], [[decisoes/DEC-09-MODELO-DE-DADOS]], [[tecnico/BANCO-DE-DADOS]], [[tecnico/BACKEND]], [[agents/analista-de-dados]], [[agents/desenvolvedor-backend]], [[features/FLUXO-DE-ENTREGA]], [[decisoes/PENDENCIAS]], [[MOCs/MOC-GOVERNANCA]].

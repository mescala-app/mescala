---
tipo: seguranca
status: risco-conhecido
verificacao: leitura-estatica
origem: docs/data/DATA-ARCHITECTURE-REPORT.md (seção 8)
relacionado:
  - "[[seguranca/ISOLAMENTO-DE-DADOS]]"
  - "[[seguranca/AUTORIZACAO]]"
  - "[[tecnico/LEGADO-ATUAL]]"
  - "[[decisoes/PENDENCIAS]]"
---
# Riscos de segurança conhecidos do legado

Achados S1–S11 do relatório do Analista de Dados (`docs/data/DATA-ARCHITECTURE-REPORT.md`, seção 8, fora do vault) sobre o **sistema legado** ([[tecnico/LEGADO-ATUAL]]): policies de RLS das migrations em `supabase/migrations/` e as Edge Functions de convite. Não se referem ao backend oficial, que ainda não existe.

> **Como foram obtidos:** por leitura estática das migrations e do código. **Não foram testados contra o banco.** O relatório também diz que o estado real do banco remoto não foi verificado. Severidades são as do relatório.

## Por que importa
- O frontend legado usa a chave pública do Supabase, e as tabelas do schema `public` ficam expostas à API do Supabase. A única proteção é o RLS.
- Os achados violam [[05-REGRAS-DE-NEGOCIO#SEC-001 — Isolamento por igreja|SEC-001]] ([[seguranca/ISOLAMENTO-DE-DADOS]]) e o princípio de papel + escopo ([[seguranca/AUTORIZACAO]]).

## Achados

| # | Severidade | Achado | Regra afetada |
|---|---|---|---|
| S1 | **CRÍTICA** | Qualquer pessoa pode assumir a liderança de qualquer equipe, em qualquer igreja (cadeia abaixo) | [[seguranca/ISOLAMENTO-DE-DADOS\|Isolamento]], [[seguranca/AUTORIZACAO\|Autorização]] |
| S2 | **CRÍTICA** | Sequestro de convites de terceiros: o usuário pode trocar o próprio `profiles.email` para qualquer valor, e as policies de convite usam esse email como prova de identidade | [[seguranca/AUTENTICACAO\|Autenticação]], [[seguranca/AUTORIZACAO\|Autorização]] |
| S3 | **CRÍTICA** | A policy de leitura de convite por token (`TO anon`) deixa qualquer anônimo listar todos os convites pendentes, com token e email. Com eles, `aceitar-convite-cadastro` cria uma conta já confirmada no email do convidado | [[seguranca/AUTENTICACAO\|Autenticação]] |
| S4 | ALTA | Policies de leitura pública (`USING (true)`) expõem a anônimos todas as colunas de todas as igrejas e equipes (endereço, `organizador_id`, `lider_id`), inclusive os IDs que alimentam o S1 | [[seguranca/ISOLAMENTO-DE-DADOS\|Isolamento]] |
| S5 | ALTA | O líder pode alterar o `igreja_id` da própria equipe e movê-la para outra igreja (UPDATE sem WITH CHECK por coluna) | [[seguranca/ISOLAMENTO-DE-DADOS\|Isolamento]] |
| S6 | ALTA | A policy de papéis do organizador não valida se a equipe é da igreja dele: ele se vincula a uma equipe alheia e lê as escalas dela | [[seguranca/ISOLAMENTO-DE-DADOS\|Isolamento]], [[seguranca/AUTORIZACAO\|Autorização]] |
| S7 | MÉDIA | A policy de aceite de convite consulta `auth.users`, que o papel `authenticated` normalmente não lê. Provavelmente toda atualização de convite feita pelo cliente falha: o status dos convites não é confiável e a janela do S1/S2 continua aberta | [[seguranca/AUTORIZACAO\|Autorização]] |
| S8 | MÉDIA | `enviar-convites` reenvia os emails de convites pendentes de qualquer igreja para quem chamar a função | [[seguranca/AUTORIZACAO\|Autorização]] |
| S9 | MÉDIA | O membro pode trocar o `escala_id` da própria linha de escalação (UPDATE sem restrição de colunas) | [[seguranca/AUTORIZACAO\|Autorização]] |
| S10 | MÉDIA | Policies de `escalas` e `escala_membros` não validam se o evento é da mesma igreja nem se o membro é da equipe | [[seguranca/ISOLAMENTO-DE-DADOS\|Isolamento]] |
| S11 | BAIXA | Falta policy de UPDATE em `member_contacts` para o membro (o vínculo no aceite falha em silêncio); `profiles` só é legível pelo dono, então listas de perfis de outros usuários voltam vazias | Funcional |

## Cadeia do S1 (resumo do relatório)
1. A pessoa cria uma conta e uma igreja, o que qualquer usuário autenticado pode fazer.
2. Cria um convite tipo `lider` com a própria `igreja_id` e o `equipe_id` de uma equipe alheia; a policy de INSERT só valida a `igreja_id`.
3. Uma policy de "claim" de líder por convite pendente permite então gravar a si mesma como `lider_id` da equipe.
4. Os IDs das equipes estão públicos (S4).

Resultado descrito: controle da equipe, das escalas e dos contatos dos membros (nome, email, WhatsApp).

## Outros riscos do relatório (seção 16) ligados a segurança
- Falhas de RLS exploráveis hoje, com a chave pública no frontend.
- Status dos convites legados provavelmente não confiável (S7).
- Se as tabelas novas forem criadas em `public` com policy permissiva, ficam expostas à API pública ([[decisoes/PENDENCIAS#DATA-DEC-020 — Onde o schema vive e modelo de RLS|DATA-DEC-020]]).

## Tratamento: pendente
- **Decisão:** [[decisoes/PENDENCIAS#DATA-DEC-023 — Correção urgente de segurança no legado|DATA-DEC-023]] (corrigir agora numa migration pequena e separada, ou esperar o redesenho). **Não decidida.**
- Pelo relatório, a correção proposta na opção A cobriria S1, S2, S5 e S6; S3 e S4 exigem uma função dedicada e mudança no frontend, numa tarefa própria.
- O relatório trata essa correção como trilha separada da fundação de persistência, com autorização própria.
- Nenhuma migration foi criada para isso até 2026-10-06.

Relacionados: [[MOCs/MOC-SEGURANCA]], [[tecnico/DIVERGENCIAS-LEGADO]], [[agents/analista-de-dados]], [[agents/qa]].

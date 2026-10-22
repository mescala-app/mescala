---
tipo: decisao
status: aceito
data: 2026-10-22
origem: FOUNDATION-001 (decisões pendentes do contrato); recomendação da AUTH-001 (bloqueio B2)
biblioteca: Vitest
relacionado:
  - "[[decisoes/ADR-002-BACKEND-OFICIAL]]"
  - "[[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]]"
  - "[[features/FOUNDATION-001]]"
  - "[[features/FLUXO-DE-ENTREGA]]"
  - "[[decisoes/PENDENCIAS]]"
---
# DEC-02 — Biblioteca oficial de testes e quem escreve os testes

## Status
**ACEITO** em 2026-10-22, pelo PO.

- **Origem:** decisão pendente do contrato da [[features/FOUNDATION-001]] (`docs/features/FOUNDATION-001.md`, fora do vault). O [[decisoes/ADR-002-BACKEND-OFICIAL|ADR-002]] deixa a biblioteca de testes fora do seu escopo. A análise da AUTH-001 (`docs/features/AUTH-001.md`, bloqueio B2) listou as opções (Vitest, `node:test` + `tsx`, Jest) e recomendou Vitest. Registro da pendência: [[decisoes/PENDENCIAS#DEC-02 — Biblioteca oficial de testes e quem escreve os testes|PENDENCIAS]].

---

## Decisão
1. **Biblioteca oficial de testes do `/backend`:** **Vitest**.
2. **Quem escreve os testes**, conforme a recomendação do [[agents/arquiteto|Arquiteto]] na AUTH-001:
   - o [[agents/desenvolvedor-backend|Desenvolvedor]] escreve os testes dos cenários do QA Contract como parte da entrega;
   - o [[agents/qa|QA]] revisa e acrescenta casos adversariais.
3. **Instalação:** o Vitest entra como **dependência de desenvolvimento** do `/backend` na primeira feature que precisar dele, a AUTH-001, com **versão exata**.
4. **Local dos testes, script `test` e convenções:** o Arquiteto define no contrato dessa feature.

## Consequências
- **AUTH-001:** fica sem bloqueios de decisão. Passa a READY quando o Arquiteto atualizar o contrato com o Vitest ([[decisoes/PENDENCIAS#AUTH-001 — Fundação de Autenticação|AUTH-001]]). **Registro de 2026-10-22:** o contrato v2 ficou READY, e a [[features/AUTH-001]] foi implementada e encerrada no mesmo dia (APPROVED_WITH_NOTES; commit `50eaa1f`), instalando o Vitest 5.0.5.
- **FOUNDATION-001:** daqui para frente, os cenários B1–B3 deixam de ficar NOT TESTED por falta de biblioteca: viram teste automatizado quando o lint for alterado ([[features/FOUNDATION-001#Verificação mínima de regressão do lint|verificação mínima de regressão do lint]]).
- **QA:** a condição da definição do agente ("só escreve arquivos de teste depois que a biblioteca oficial de testes for decidida") está cumprida. O QA continua sem corrigir código.
- **Dependências:** até a feature que o instalar, o Vitest não está no `backend/package.json`. A decisão aprova a biblioteca; a versão exata e a instalação vêm pelo contrato, como exige a regra do Desenvolvedor (só dependências aprovadas por ADR ou Feature Contract). Listas de dependências proibidas seguem a [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS|DEC-08]].
- **Regressão de dependências:** a feature que instalar o Vitest altera dependências do `/backend`; vale a condição `npm audit --omit=dev` = 0 ([[decisoes/PENDENCIAS#RT-FOUND-01 — Dívida de tooling no backend|RT-FOUND-01]]). Cumprida pela AUTH-001.

## Fora desta decisão
- Versão exata do Vitest, local dos arquivos de teste, script `test`, convenções de nome e de organização (contrato da AUTH-001). **Definidos pela AUTH-001 em 2026-10-22:** Vitest 5.0.5 (`devDependencies`, sem `^` nem `~`); script `"test": "vitest run"`; convenções em [[tecnico/BACKEND#Convenções do código e dos testes (desde a AUTH-001)|tecnico/BACKEND]].
- Cobertura mínima, CI e execução automática em pipeline.
- Testes com banco (dependem da fundação de persistência, FOUNDATION-002).

---

Relacionados: [[decisoes/ADR-002-BACKEND-OFICIAL]], [[features/FOUNDATION-001]], [[features/FLUXO-DE-ENTREGA]], [[agents/qa]], [[agents/desenvolvedor-backend]], [[agents/arquiteto]], [[tecnico/BACKEND]], [[decisoes/PENDENCIAS]], [[MOCs/MOC-GOVERNANCA]].

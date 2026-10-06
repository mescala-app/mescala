---
tipo: visao-geral
projeto: Mescala
status: ativo
relacionado:
  - "[[03-DOMINIO]]"
  - "[[produto/JORNADAS]]"
---
# Visão Geral

O **Mescala** é um SaaS para gestão de equipes, programações e escalas de igrejas.

Seu objetivo é transformar o processo de organização de pessoas em um fluxo centralizado, rastreável e previsível:

**Planejamento → Programação → Escalação → Publicação → Confirmação → Substituição → Execução → Histórico**.

## Problemas que resolve
- controles dispersos em WhatsApp e planilhas;
- conflitos de horário;
- esquecimentos e ausência de confirmação;
- dificuldade para substituir membros;
- falta de histórico e rastreabilidade.

## Estrutura conceitual
[[modulos/IGREJAS|Igreja]] → [[modulos/EQUIPES|Equipes]] → [[modulos/PROGRAMACOES|Programações]] → [[modulos/ESCALAS|Escalas]] → [[dados/ENTIDADES#Alocação|Alocações]].

## Próximas leituras
- [[03-DOMINIO]]
- [[04-USUARIOS-E-PERMISSOES]]
- [[05-REGRAS-DE-NEGOCIO]]
- [[MOCs/MOC-DOMINIO]]
- [[decisoes/PENDENCIAS]]: o que ainda não foi decidido (inclusive Equipe × Ministério).
- [[tecnico/LEGADO-ATUAL]]: o sistema em uso hoje, que ainda não segue esta estrutura.

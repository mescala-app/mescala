---
tipo: adr
status: aceito
data: 2026-10-04
relacionado:
  - "[[decisoes/ADR-001-ESTRUTURA-INICIAL]]"
  - "[[tecnico/BACKEND]]"
  - "[[02-ARQUITETURA]]"
---
# ADR-002 — Backend oficial do Mescala

## Status

**ACEITO**

---

## Contexto

O Mescala será desenvolvido inicialmente em uma fase **backend only**.

O repositório atual ainda não possui uma aplicação Next.js configurada para backend. Portanto, antes da implementação das primeiras features de negócio, será criada a fundação técnica oficial do backend.

O domínio do Mescala possui requisitos como:

- multi-tenancy por igreja;
- autenticação;
- autorização;
- regras de negócio interdependentes;
- integridade transacional;
- auditoria;
- isolamento entre organizações;
- múltiplos domínios relacionados;
- necessidade de manutenção e rastreabilidade do código.

Por esse motivo, o projeto utilizará uma aplicação backend centralizada e organizada por domínio.

---

# Decisão

O backend oficial do Mescala será construído utilizando:

- **Next.js**
- **TypeScript**
- **Node.js Runtime**

O backend residirá inicialmente em:

```text
/backend
```

O Next.js será utilizado nesta fase exclusivamente como:

```text
Runtime HTTP/API
+
Camada de entrada da aplicação
```

A utilização de Next.js como backend **não implica desenvolvimento de frontend nesta fase**.

---

# Arquitetura

A arquitetura conceitual deverá seguir:

```text
HTTP / API
     ↓
Application
     ↓
Domain
     ↓
Infrastructure
     ↓
PostgreSQL
```

Os mecanismos HTTP do Next.js deverão funcionar como camada de entrada.

Exemplo:

```text
Route Handler
     ↓
Service / Use Case
     ↓
Domain
     ↓
Repository
     ↓
Database
```

---

# Route Handlers

Os Route Handlers do Next.js devem permanecer finos.

Eles poderão ser responsáveis por:

- receber requests;
- extrair contexto de autenticação;
- validar formato da requisição;
- chamar o caso de uso correspondente;
- transformar o resultado em resposta HTTP.

Eles **não devem concentrar regras de negócio**.

Não implementar diretamente dentro de Route Handlers:

- autorização de domínio complexa;
- regras de escala;
- regras de ministério;
- regras de culto;
- conflitos;
- transações de negócio;
- lógica de auditoria;
- regras de membership.

Essas responsabilidades deverão permanecer nas camadas apropriadas do backend.

---

# Organização por domínio

O backend deverá priorizar organização por domínio.

Estrutura conceitual:

```text
backend/
└── src/
    ├── app/
    │   └── api/
    │
    ├── domains/
    │   ├── auth/
    │   ├── church/
    │   ├── ministry/
    │   ├── member/
    │   ├── worship-service/
    │   ├── schedule/
    │   ├── meeting/
    │   └── commission/
    │
    ├── infrastructure/
    │
    └── shared/
```

Essa estrutura é conceitual.

O Arquiteto e o Organizador deverão ajustá-la conforme a necessidade real do projeto, sem criar abstrações ou diretórios desnecessários.

---

# Persistência

O banco relacional oficial do Mescala será:

```text
PostgreSQL
```

O Supabase poderá ser utilizado como infraestrutura gerenciada de PostgreSQL.

O schema oficial deverá ser reproduzível através das migrations versionadas do projeto.

Alterações manuais não versionadas no banco não serão consideradas parte válida da arquitetura.

---

# Supabase

Supabase poderá ser utilizado para serviços específicos quando houver decisão arquitetural explícita.

Isso poderá incluir futuramente:

- PostgreSQL;
- autenticação;
- storage;
- realtime;
- outros serviços compatíveis com a arquitetura.

O uso de qualquer um desses recursos deverá respeitar os domínios e regras definidos na Brain.

A utilização do Supabase não transfere automaticamente as regras de negócio para o Supabase.

---

# Supabase Edge Functions

Supabase Edge Functions **não serão utilizadas como arquitetura principal do backend do Mescala**.

Não deverá ser criada uma arquitetura distribuída em Edge Functions para representar individualmente as features centrais do sistema.

Exemplo do que deve ser evitado como arquitetura principal:

```text
create-church
create-ministry
create-service
publish-schedule
confirm-member
create-meeting
...
```

espalhadas como funções independentes responsáveis pelo domínio.

Edge Functions poderão ser utilizadas futuramente para necessidades específicas quando existir justificativa arquitetural concreta.

Cada utilização deverá ser analisada individualmente.

---

# Runtime

O runtime padrão do backend será:

```text
Node.js
```

Não utilizar Edge Runtime como padrão das features do backend.

Caso alguma funcionalidade futura tenha benefício concreto em utilizar Edge Runtime, a decisão deverá ser analisada separadamente.

---

# Multi-tenancy

O backend deverá ser construído considerando o Mescala como aplicação SaaS multi-tenant.

A entidade organizacional raiz é:

```text
IGREJA
```

Toda implementação deverá considerar:

- identificação do tenant;
- isolamento por igreja;
- autorização;
- membership;
- prevenção de acesso cross-tenant.

O isolamento não poderá depender exclusivamente da interface cliente.

---

# Regras de negócio

Regras de negócio deverão permanecer desacopladas da camada HTTP e da infraestrutura.

O seguinte fluxo deve ser preservado:

```text
Request
↓
Application
↓
Domain
↓
Infrastructure
```

O domínio não deverá depender diretamente de detalhes específicos do Next.js quando isso puder ser evitado.

---

# Fase atual

O projeto encontra-se em:

```text
BACKEND ONLY
```

Portanto, nesta fase é proibido criar:

- páginas;
- telas;
- componentes React;
- layouts;
- Tailwind;
- elementos visuais;
- dashboards;
- formulários de interface;
- frontend state;
- experiência de usuário visual.

---

# Consequências

Antes da primeira feature funcional, deverá ser criada uma feature de fundação:

```text
FOUNDATION-001
Inicialização do Backend Next.js
```

Essa feature deverá estabelecer somente a infraestrutura técnica mínima necessária para o backend.

Ela não deverá implementar:

- Igreja;
- Owner;
- Admin;
- ministérios;
- membros;
- cultos;
- escalas;
- reuniões;
- comissões;
- qualquer outra regra de negócio.

Após a fundação técnica, deverá ser estabelecida a fundação oficial de persistência antes das features que dependam do banco.

---

# Resultado esperado

A arquitetura resultante deverá permitir futuramente múltiplos clientes:

```text
Web
Mobile
Capacitor
Outros clientes
      │
      ▼
  Next.js API
      │
      ▼
Application / Domain
      │
      ▼
Infrastructure
      │
      ▼
PostgreSQL / Supabase
```

O backend deverá permanecer independente da tecnologia utilizada pelo cliente sempre que possível.

---

# Justificativa

A decisão por Next.js + TypeScript como backend centralizado busca garantir:

- coesão;
- organização por domínio;
- previsibilidade;
- testabilidade;
- rastreabilidade;
- segurança;
- integridade transacional;
- facilidade de auditoria;
- manutenção;
- evolução progressiva do sistema.

---

# Decisões ainda não definidas por este ADR

Este ADR não determina automaticamente:

- ORM;
- query builder;
- biblioteca de validação;
- implementação de autenticação;
- estratégia de migrations;
- biblioteca de testes;
- mecanismo de auditoria;
- mecanismo de eventos.

Essas decisões deverão ser tomadas separadamente quando necessárias e registradas pela arquitetura.

---

Relacionados: [[decisoes/ADR-001-ESTRUTURA-INICIAL]], [[02-ARQUITETURA]], [[tecnico/BACKEND]], [[tecnico/API]], [[tecnico/BANCO-DE-DADOS]], [[tecnico/FRONTEND]], [[seguranca/ISOLAMENTO-DE-DADOS]], [[seguranca/AUTORIZACAO]].

Relacionados (acrescentados em 2026-10-06): [[features/FOUNDATION-001]], [[decisoes/PENDENCIAS]], [[tecnico/LEGADO-ATUAL]], [[tecnico/DIVERGENCIAS-LEGADO]].

Relacionados (acrescentados em 2026-10-20): [[decisoes/DEC-08-DEPENDENCIAS-TRANSITIVAS]].

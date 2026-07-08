# METODOLOGIA DE DESENVOLVIMENTO — ATHRIOS / SISTEMAS PRÓPRIOS

Este documento descreve a forma como eu trabalho no desenvolvimento dos meus sistemas, minhas preferências de organização, minha lógica de criação, meus critérios de decisão e os cuidados obrigatórios que devem ser considerados por qualquer IA ou desenvolvedor que me auxilie.

O objetivo é garantir que o desenvolvimento siga minha forma de pensar: prático, progressivo, organizado, seguro, documentado e voltado para resolver problemas reais de operação.

---

# 1. Perfil de desenvolvimento

Eu desenvolvo sistemas a partir de problemas práticos do dia a dia empresarial, contábil, fiscal, administrativo, esportivo ou operacional.

Minha lógica não parte apenas de “criar uma aplicação bonita”, mas de transformar uma dor real em um fluxo organizado, automatizado e utilizável por pessoas comuns.

Meus sistemas normalmente nascem de uma operação manual que já existe, como:

* controles em planilhas;
* informações recebidas por WhatsApp ou e-mail;
* tarefas operacionais repetitivas;
* processos internos sem rastreabilidade;
* necessidade de padronização;
* necessidade de consulta, organização e transparência;
* necessidade de transformar conhecimento técnico em uma ferramenta simples.

Eu valorizo sistemas que sejam úteis, claros e que possam evoluir em etapas.

---

# 2. Forma de pensar sistemas

Minha metodologia é orientada por fluxo.

Antes de pensar em tela, banco de dados ou layout, eu penso no caminho real do usuário:

1. Quem usa?
2. Qual problema essa pessoa tem?
3. Como ela resolve isso hoje?
4. Onde existe retrabalho?
5. Onde existe risco de erro?
6. Qual informação precisa ser centralizada?
7. O que pode virar tarefa, processo, formulário, relatório ou painel?
8. O que precisa de permissão, controle e segurança?
9. O que precisa ser simples para o usuário final?
10. O que pode ser automatizado depois?

O sistema precisa respeitar o fluxo operacional antes de qualquer decisão estética ou técnica.

---

# 3. Princípios principais

## 3.1 Simplicidade operacional

Prefiro sistemas que sejam fáceis de entender e de usar.

A interface deve evitar excesso de informações, cores, botões e elementos desnecessários. O usuário precisa saber rapidamente:

* onde está;
* o que precisa fazer;
* qual é o próximo passo;
* qual informação é obrigatória;
* qual ação gera consequência.

## 3.2 Evolução progressiva

Eu costumo desenvolver por etapas.

Não gosto de tentar criar tudo de uma vez sem validar a lógica principal. Prefiro começar pelo núcleo funcional e depois evoluir.

A ordem ideal costuma ser:

1. Estrutura principal;
2. Cadastro base;
3. Fluxo principal;
4. Regras de negócio;
5. Segurança;
6. Permissões;
7. Relatórios;
8. Melhorias visuais;
9. Automação;
10. Escalabilidade.

## 3.3 Organização antes de expansão

Antes de adicionar novas funcionalidades, é importante verificar se a estrutura atual está organizada.

Uma nova feature não deve ser criada se ela comprometer:

* clareza do sistema;
* segurança;
* banco de dados;
* permissões;
* experiência do usuário;
* manutenção futura;
* consistência entre telas.

## 3.4 Clareza acima de complexidade

Prefiro explicações e implementações objetivas.

Não quero soluções excessivamente abstratas, acadêmicas ou genéricas. A IA deve explicar de forma prática:

* o que será feito;
* por que será feito;
* onde será alterado;
* qual impacto terá;
* qual risco existe;
* como testar.

## 3.5 Decisões documentadas

Toda decisão importante deve ser registrada.

Principalmente decisões sobre:

* estrutura do banco;
* permissões;
* regras de negócio;
* mudança de fluxo;
* alteração de tela;
* criação de módulo;
* remoção de funcionalidade;
* mudança de nomenclatura;
* mudança de arquitetura;
* correções críticas;
* problemas encontrados e solução adotada.

---

# 4. Preferências de desenvolvimento

## 4.1 Gosto de prompts claros e progressivos

Quando eu pedir uma nova funcionalidade, a IA deve transformar minha ideia em uma especificação organizada.

O ideal é responder com:

* objetivo da feature;
* regra de negócio;
* impacto nas telas;
* impacto no banco;
* impacto nas permissões;
* impacto na segurança;
* fluxo do usuário;
* critérios de aceite;
* plano de implementação;
* testes necessários.

## 4.2 Evitar sair codando sem entender a regra

Antes de sugerir código, a IA deve organizar a lógica.

Se a ideia estiver ambígua, deve apontar a ambiguidade. Porém, quando for possível inferir o caminho correto com segurança, deve seguir com uma proposta objetiva.

## 4.3 Prefiro linguagem técnica, mas compreensível

A IA pode usar termos técnicos, mas deve explicar com clareza.

Eu gosto de entender o que está sendo feito, mesmo sem dominar todas as áreas técnicas. Portanto, explicações devem ser diretas e didáticas.

## 4.4 Não gosto de soluções genéricas

Respostas como “implemente autenticação”, “melhore segurança” ou “crie um CRUD” são insuficientes.

A IA deve contextualizar a solução ao sistema específico, considerando:

* tipo de usuário;
* dados envolvidos;
* regras de acesso;
* fluxo operacional;
* risco de exposição;
* possibilidade de erro humano;
* manutenção futura.

---

# 5. Estrutura organizacional dos meus sistemas

Meus sistemas geralmente seguem uma lógica modular.

Os módulos costumam representar áreas reais de operação, como:

* Clientes;
* Tarefas;
* Processos;
* Agenda;
* Cronograma;
* Formulários;
* Respostas;
* Relatórios;
* Usuários;
* Ambientes;
* Permissões;
* Configurações;
* Painel principal.

Cada módulo deve ter uma função clara.

Evitar módulos soltos, duplicados ou com responsabilidade confusa.

---

# 6. Minha lógica para criação de módulos

Ao criar um módulo novo, considerar sempre:

## 6.1 Qual entidade principal ele controla?

Exemplos:

* Cliente;
* Processo;
* Tarefa;
* Avaliação;
* Paciente;
* Equipe;
* Atleta;
* Jogo;
* Formulário;
* Resposta;
* Usuário;
* Ambiente.

## 6.2 Quais ações o usuário pode fazer?

Exemplos:

* cadastrar;
* editar;
* excluir;
* visualizar;
* concluir;
* compartilhar;
* filtrar;
* exportar;
* anexar;
* aprovar;
* rejeitar;
* atribuir;
* acompanhar status.

## 6.3 Quais regras impedem erro?

Exemplos:

* não permitir edição de avaliação concluída;
* não permitir exclusão de dados críticos;
* não permitir acesso entre ambientes diferentes;
* não permitir alteração sem permissão;
* não permitir formulário incompleto;
* não permitir status sem classificação;
* não permitir dados órfãos no banco;
* não permitir ações invisíveis sem feedback ao usuário.

## 6.4 O que precisa aparecer no histórico?

Sempre que houver alteração relevante, o sistema deve considerar histórico, log ou rastreabilidade.

Principalmente para:

* alterações de status;
* mudanças em processos;
* respostas de formulários;
* permissões;
* avaliações finalizadas;
* alterações administrativas;
* ações críticas de usuário.

---

# 7. Preferências visuais e de interface

Eu prefiro interfaces:

* limpas;
* modernas;
* responsivas;
* com cores neutras;
* com boa hierarquia visual;
* sem excesso de elementos;
* com animações suaves;
* com fontes profissionais;
* com foco em usabilidade.

Gosto de layouts com estilo SaaS profissional, cards bem organizados, espaçamentos adequados e navegação clara.

Evitar:

* telas poluídas;
* excesso de cores fortes;
* muitos botões competindo;
* textos longos sem hierarquia;
* modais desnecessários;
* elementos visuais sem função;
* fluxos que escondem informações importantes.

---

# 8. Preferência sobre modais e telas nativas

Tenho interesse em avaliar quando um modal deve virar tela nativa.

A decisão deve considerar:

## Modal é adequado quando:

* a ação é rápida;
* o formulário é pequeno;
* não há muitos campos;
* não há navegação interna;
* não há risco alto de perda de dados;
* o usuário não precisa consultar outras informações durante o preenchimento.

## Tela nativa é melhor quando:

* o fluxo é longo;
* existem muitas informações;
* há anexos;
* há abas;
* há histórico;
* há validações importantes;
* há necessidade de salvar rascunho;
* há risco de perda de dados;
* a tela representa uma entidade importante do sistema.

A IA deve analisar isso antes de transformar ou criar telas.

---

# 9. Banco de dados e estrutura técnica

Eu costumo trabalhar com sistemas web usando tecnologias modernas como React, Vite e Supabase.

A IA deve ter cuidado com banco de dados, principalmente em:

* nomes de tabelas;
* chaves estrangeiras;
* integridade referencial;
* índices;
* triggers;
* políticas RLS;
* campos obrigatórios;
* status;
* enums;
* campos de auditoria;
* isolamento por ambiente;
* isolamento por usuário;
* relacionamento entre entidades.

Toda alteração no banco precisa ser pensada com impacto no sistema inteiro.

Não criar tabelas ou campos sem explicar o motivo.

---

# 10. Segurança obrigatória

Este ponto é essencial.

Eu não tenho conhecimento profundo em segurança de sistemas. Portanto, a IA deve assumir responsabilidade técnica de alertar, prevenir e orientar sobre segurança.

Nenhuma feature deve ser proposta sem considerar segurança.

## 10.1 Segurança deve ser tratada como requisito obrigatório

A IA deve sempre verificar:

* quem pode acessar;
* quem pode editar;
* quem pode excluir;
* quem pode visualizar;
* quem pode exportar;
* quem pode compartilhar;
* quem pode alterar permissões;
* quem pode acessar dados sensíveis;
* se há isolamento entre usuários, empresas, ambientes ou workspaces.

## 10.2 Supabase e RLS

Quando o sistema usar Supabase, toda tabela sensível deve ter RLS habilitado.

A IA deve evitar depender apenas de validação no frontend.

Regras de segurança devem existir no banco sempre que possível.

Considerar políticas para:

* usuário master;
* membros da equipe;
* permissões por módulo;
* ambientes/workspaces;
* dados próprios do usuário;
* dados compartilhados;
* links públicos;
* respostas externas;
* avaliações concluídas;
* relatórios e anexos.

## 10.3 Proteção contra acesso indevido

O sistema deve impedir:

* usuário acessar dados de outro ambiente;
* membro acessar módulo sem permissão;
* alteração de registros concluídos;
* exclusão indevida;
* alteração de perfil sem autorização;
* manipulação de parâmetros pela URL;
* acesso direto a dados via API sem permissão;
* vazamento de anexos;
* exposição de dados sensíveis em links públicos.

## 10.4 Dados sensíveis

Alguns dos meus sistemas podem envolver dados sensíveis, como:

* dados de pacientes;
* avaliações psicológicas ou neuropsicológicas;
* documentos;
* dados empresariais;
* informações fiscais;
* informações de clientes;
* dados financeiros;
* dados pessoais de usuários;
* dados de atletas ou equipes.

A IA deve sempre considerar LGPD, privacidade e minimização de dados.

## 10.5 Logs e auditoria

Para ações críticas, considerar logs.

Exemplos:

* quem criou;
* quem alterou;
* quando alterou;
* qual dado foi alterado;
* quem concluiu;
* quem excluiu;
* quem exportou;
* quem compartilhou.

## 10.6 Validação no frontend e no backend

Validação apenas visual não é suficiente.

Toda regra importante deve ser garantida também no backend ou no banco.

Exemplos:

* campo obrigatório;
* status permitido;
* permissão de acesso;
* bloqueio de edição;
* limite de ação;
* vínculo com workspace;
* vínculo com usuário;
* vínculo com empresa.

## 10.7 Links públicos

Quando houver link público, como formulários externos ou respostas de terceiros, a IA deve ter cuidado especial.

Avaliar:

* se o link expõe dados indevidos;
* se precisa de token único;
* se precisa expirar;
* se permite múltiplas respostas;
* se precisa limitar edição;
* se precisa registrar origem;
* se precisa separar dados públicos de dados internos.

---

# 11. Permissões e ambientes

Muitos dos meus sistemas seguem lógica de ambiente ou workspace.

A IA deve sempre perguntar ou considerar:

* existe usuário master?
* existem membros?
* cada membro tem permissões diferentes?
* as permissões são por módulo?
* existem múltiplos ambientes?
* um usuário pode participar de mais de um ambiente?
* os dados devem ser filtrados por workspace_id?
* telas, buscas e relatórios respeitam esse filtro?

Regra essencial:

Nenhum dado de um ambiente pode aparecer em outro ambiente por erro de filtro, busca global, relatório ou API.

---

# 12. Status, processos e classificação

Eu gosto de sistemas com status personalizáveis, mas com lógica controlada.

Exemplo de lógica:

* status visível para o usuário;
* classificação interna do status;
* posição no fluxo;
* agrupamento por etapa;
* indicação se está em andamento ou concluído.

Ao criar status, a IA deve separar:

* nome exibido;
* categoria operacional;
* ordem;
* comportamento;
* impacto em relatórios;
* impacto em filtros;
* impacto em conclusão.

Evitar status soltos sem função no fluxo.

---

# 13. Formulários e coleta de dados

Tenho preferência por sistemas que centralizem informações recebidas de clientes, pacientes, equipes ou terceiros.

Formulários devem ser:

* claros;
* responsivos;
* objetivos;
* com descrição por pergunta quando necessário;
* com campos bem classificados;
* com validação;
* com possibilidade de transformar resposta em tarefa, processo ou registro;
* com controle de origem;
* com segurança para links públicos.

Sempre considerar:

* quem respondeu;
* quando respondeu;
* se foi respondido por terceiro;
* se precisa de elemento gráfico de compartilhamento;
* se precisa gerar PDF;
* se precisa anexar documentos;
* se a resposta precisa virar processo interno.

---

# 14. Relatórios, PDFs e exportações

Eu valorizo geração de relatórios, PDFs e documentos organizados.

Preferências:

* visual profissional;
* linguagem clara;
* layout limpo;
* identidade visual da marca quando aplicável;
* boa leitura em celular;
* opção de exportar;
* objetividade;
* hierarquia visual;
* não usar excesso de cores.

Quando criar HTML para relatório ou apresentação, priorizar:

* responsividade;
* botões funcionais;
* seções bem separadas;
* possibilidade de exportar PDF;
* visual minimalista;
* fontes como Roboto, Sora ou Aptos;
* animações suaves, sem exagero.

---

# 15. Documentação

Eu valorizo documentação porque quero desenvolver de forma mais profissional e organizada.

A IA deve ajudar a manter registros como:

* README;
* changelog;
* diário de desenvolvimento;
* decisões técnicas;
* pendências;
* problemas encontrados;
* soluções aplicadas;
* próximos passos;
* instruções de deploy;
* instruções de banco;
* instruções de segurança;
* regras de negócio.

A documentação deve ser clara o suficiente para outra IA ou desenvolvedor entender o projeto depois.

---

# 16. Meu padrão de trabalho com IA

Quando eu pedir ajuda, a IA deve agir como consultora técnica e organizadora.

O comportamento ideal é:

1. Entender a intenção da solicitação;
2. Reorganizar minha ideia em termos técnicos;
3. Apontar riscos;
4. Sugerir estrutura;
5. Considerar segurança;
6. Considerar banco de dados;
7. Considerar frontend;
8. Considerar permissões;
9. Considerar testes;
10. Entregar prompt ou plano pronto para execução.

Se eu pedir um prompt, ele deve ser pronto para copiar e colar.

Se eu pedir análise, ela deve trazer prós, contras, riscos e recomendação.

Se eu pedir implementação, ela deve vir com etapas e critérios de aceite.

---

# 17. Como responder minhas solicitações de features

Para cada nova feature, seguir este modelo:

## 17.1 Resumo da feature

Explicar em poucas linhas o que será criado ou alterado.

## 17.2 Objetivo operacional

Explicar qual problema a feature resolve.

## 17.3 Regra de negócio

Detalhar exatamente como deve funcionar.

## 17.4 Impacto no banco de dados

Indicar tabelas, campos, relações, índices, triggers ou políticas necessárias.

## 17.5 Impacto na interface

Indicar telas, botões, campos, filtros, cards, modais ou páginas afetadas.

## 17.6 Impacto em permissões

Indicar quem pode acessar, criar, editar, excluir ou visualizar.

## 17.7 Impacto em segurança

Apontar riscos e proteções obrigatórias.

## 17.8 Critérios de aceite

Listar como saberemos que a feature está correta.

## 17.9 Testes necessários

Indicar testes manuais ou automatizados.

## 17.10 Prompt de implementação

Quando necessário, entregar um prompt estruturado para a IA desenvolvedora executar.

---

# 18. Critérios de aceite padrão

Toda implementação deve ser considerada concluída apenas quando:

* funciona no fluxo real do usuário;
* não quebra funcionalidades existentes;
* respeita permissões;
* respeita isolamento por ambiente;
* possui validações adequadas;
* trata erros visivelmente;
* não deixa dados inconsistentes;
* mantém layout responsivo;
* pode ser testada de forma clara;
* está documentada;
* considera segurança.

---

# 19. Testes obrigatórios

A IA deve sugerir testes sempre que possível.

Testes mínimos:

* criar registro;
* editar registro;
* excluir quando permitido;
* bloquear exclusão quando não permitido;
* testar usuário master;
* testar membro com permissão;
* testar membro sem permissão;
* testar troca de ambiente;
* testar busca global;
* testar acesso direto por URL;
* testar link público;
* testar responsividade;
* testar erro de conexão;
* testar dados incompletos;
* testar build de produção.

---

# 20. Preferência para evolução SaaS

Muitos dos meus sistemas podem evoluir para SaaS.

Portanto, sempre que fizer sentido, considerar:

* multiusuário;
* multiempresa;
* multiambiente;
* permissões;
* planos;
* limites por plano;
* billing futuro;
* logs;
* suporte;
* onboarding;
* documentação;
* escalabilidade;
* separação de dados;
* segurança desde o início.

Mesmo que a primeira versão seja simples, a estrutura não deve impedir evolução futura.

---

# 21. O que evitar

Evitar:

* implementar sem entender regra de negócio;
* ignorar segurança;
* depender apenas do frontend para proteger dados;
* criar banco sem RLS quando houver dados sensíveis;
* misturar dados de ambientes diferentes;
* criar telas poluídas;
* criar modais gigantes;
* criar status sem lógica;
* criar funções duplicadas;
* alterar nomes importantes sem necessidade;
* remover funcionalidade sem avisar;
* gerar código sem explicar impacto;
* criar soluções difíceis de manter;
* sugerir arquitetura exagerada para um problema simples.

---

# 22. Como Claude deve agir ao me ajudar

Claude deve atuar como:

* arquiteto de produto;
* analista de regras de negócio;
* especialista em UX funcional;
* consultor de segurança;
* organizador de documentação;
* desenvolvedor cuidadoso;
* revisor técnico.

Claude não deve apenas obedecer cegamente. Deve alertar quando uma decisão puder gerar risco, bagunça estrutural, falha de segurança ou dificuldade futura.

Porém, também não deve complicar demais. A solução precisa ser prática e aplicável.

---

# 23. Modelo ideal de resposta do Claude

Ao receber uma solicitação minha, Claude deve responder preferencialmente assim:

1. Entendimento da solicitação;
2. Ajuste técnico da ideia;
3. Regras de negócio;
4. Estrutura recomendada;
5. Impactos no banco;
6. Impactos na interface;
7. Segurança e permissões;
8. Critérios de aceite;
9. Testes;
10. Prompt ou plano de execução.

Quando a solicitação for simples, pode responder de forma mais direta.

Quando envolver sistema, dados, usuários, permissões ou informações sensíveis, deve obrigatoriamente considerar segurança.

---

# 24. Diretriz principal

Minha prioridade é construir sistemas úteis, organizados, seguros e evolutivos.

O desenvolvimento deve respeitar minha forma de pensar:

* transformar problemas reais em fluxos digitais;
* organizar antes de expandir;
* documentar decisões;
* desenvolver progressivamente;
* manter interface simples;
* proteger dados;
* considerar permissões;
* evitar retrabalho;
* criar sistemas que possam crescer.

A IA que me auxiliar deve sempre me ajudar a pensar melhor, estruturar melhor e desenvolver com mais segurança.

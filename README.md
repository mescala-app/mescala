# Escala.iasd

Sistema para organização, gestão e acompanhamento de escalas ministeriais da Igreja Adventista do Sétimo Dia.

O **Escala.iasd** tem como objetivo centralizar a criação, visualização, distribuição e controle das escalas de departamentos, cultos, programações e equipes da igreja, reduzindo falhas de comunicação, esquecimentos, conflitos de agenda e retrabalho manual.

---

# 1. Visão geral

O Escala.iasd nasce da necessidade prática de organizar escalas de forma mais clara, acessível e confiável.

Em muitas igrejas, as escalas são criadas em planilhas, grupos de WhatsApp, imagens ou documentos soltos. Isso gera problemas como:

* falta de centralização;
* membros esquecendo compromissos;
* alterações não comunicadas corretamente;
* dificuldade de consultar escalas antigas;
* conflitos entre departamentos;
* sobrecarga de poucas pessoas;
* ausência de histórico;
* dificuldade para substituir participantes;
* dependência excessiva de uma única pessoa organizadora.

O sistema propõe uma solução simples e objetiva: permitir que a igreja organize suas escalas em um ambiente digital, com controle por departamentos, datas, funções, membros e permissões.

---

# 2. Objetivo do projeto

Criar uma plataforma web para facilitar a gestão de escalas da igreja, permitindo que líderes, departamentos e membros tenham acesso claro às responsabilidades de cada programação.

O sistema deve permitir:

* cadastrar membros;
* cadastrar departamentos;
* cadastrar funções;
* criar escalas;
* definir responsáveis;
* visualizar escalas por data, departamento ou membro;
* evitar conflitos de agenda;
* controlar substituições;
* enviar ou facilitar notificações;
* manter histórico das escalas;
* organizar permissões por perfil de usuário.

---

# 3. Público-alvo

O sistema é destinado a igrejas locais, departamentos e lideranças que precisam organizar escalas de serviço.

Usuários principais:

* administradores da igreja;
* secretaria;
* anciãos;
* líderes de departamento;
* diretores de ministérios;
* responsáveis por escalas;
* membros escalados;
* equipes de apoio.

Departamentos possíveis:

* Ministério da Música;
* Sonoplastia;
* Mídia;
* Recepção;
* Diaconato;
* Escola Sabatina;
* Ministério Infantil;
* Ministério Jovem;
* Comunicação;
* Zeladoria;
* Pregadores;
* Direção do culto;
* Plataforma;
* Louvor;
* Oração;
* Pequenos Grupos;
* Departamentos locais personalizados.

---

# 4. Problema que o sistema resolve

O Escala.iasd resolve um problema operacional recorrente: a dificuldade de manter as escalas da igreja atualizadas, acessíveis e confiáveis.

Problemas comuns que o sistema deve combater:

* escala enviada em imagem e depois alterada sem todos saberem;
* membro escalado em dois lugares no mesmo horário;
* líder esquecendo de avisar alteração;
* membro sem saber quando será sua próxima participação;
* ausência de histórico de quem serviu em determinada data;
* dificuldade para equilibrar a participação dos membros;
* perda de informações em conversas de WhatsApp;
* dependência de planilhas manuais;
* falha na comunicação entre departamentos.

---

# 5. Princípios do sistema

## 5.1 Simplicidade

O sistema deve ser fácil de usar por líderes e membros, inclusive pessoas com pouca familiaridade com tecnologia.

A interface deve ser limpa, direta e objetiva.

## 5.2 Clareza

O usuário precisa saber rapidamente:

* quando está escalado;
* em qual departamento;
* em qual função;
* em qual horário;
* quem são os demais participantes;
* se houve alteração;
* quem é o responsável pela escala.

## 5.3 Organização

O sistema deve centralizar as informações de escala, evitando dados espalhados em mensagens, imagens, planilhas e documentos.

## 5.4 Segurança

As informações da igreja, dos membros e das escalas devem ser protegidas.

Nem todos os usuários devem poder editar, excluir ou visualizar todas as informações.

## 5.5 Evolução progressiva

O projeto deve começar com um núcleo funcional simples e evoluir em etapas, sem comprometer a estrutura futura.

---

# 6. Estrutura inicial do sistema

A estrutura base do Escala.iasd pode ser organizada nos seguintes módulos:

## 6.1 Painel inicial

Tela principal com visão resumida das próximas escalas.

Deve exibir:

* próximas programações;
* membros escalados;
* alertas de conflito;
* escalas pendentes;
* substituições solicitadas;
* atalhos rápidos;
* avisos importantes.

## 6.2 Membros

Cadastro dos membros da igreja.

Campos possíveis:

* nome completo;
* telefone;
* e-mail;
* data de nascimento;
* departamentos em que participa;
* funções que pode exercer;
* status ativo/inativo;
* observações;
* disponibilidade;
* restrições.

## 6.3 Departamentos

Cadastro dos departamentos da igreja.

Campos possíveis:

* nome do departamento;
* líder responsável;
* descrição;
* membros vinculados;
* funções utilizadas;
* status ativo/inativo.

## 6.4 Funções

Cadastro das funções que podem ser usadas nas escalas.

Exemplos:

* pregador;
* diretor de culto;
* recepcionista;
* diácono;
* sonoplasta;
* mídia;
* pianista;
* vocal;
* professor;
* secretário;
* oração inicial;
* oração final;
* leitura bíblica;
* responsável infantil;
* apoio geral.

As funções devem ser personalizáveis por igreja ou departamento.

## 6.5 Programações

Cadastro dos eventos ou cultos que receberão escala.

Exemplos:

* culto de sábado pela manhã;
* escola sabatina;
* culto jovem;
* culto de domingo;
* culto de quarta-feira;
* santa ceia;
* semana de oração;
* programação especial;
* reunião administrativa;
* treinamento;
* evento externo.

Campos possíveis:

* nome da programação;
* data;
* horário de início;
* horário de término;
* local;
* departamento responsável;
* descrição;
* status.

## 6.6 Escalas

Módulo principal do sistema.

Permite criar escalas vinculando:

* programação;
* data;
* departamento;
* função;
* membro responsável;
* observações;
* status da participação.

Status possíveis:

* confirmado;
* pendente;
* recusado;
* substituição solicitada;
* substituído;
* concluído;
* ausente.

## 6.7 Calendário

Visualização das escalas em formato de calendário.

Filtros importantes:

* por departamento;
* por membro;
* por função;
* por mês;
* por programação;
* por status.

## 6.8 Substituições

Controle de solicitações de troca ou substituição.

Fluxo sugerido:

1. Membro solicita substituição;
2. Líder recebe alerta;
3. Líder indica substituto ou aprova troca;
4. Sistema registra alteração;
5. Escala é atualizada;
6. Histórico é mantido.

## 6.9 Relatórios

Relatórios para acompanhamento da participação.

Exemplos:

* membros mais escalados;
* membros menos escalados;
* ausências;
* substituições;
* escalas por departamento;
* histórico por membro;
* histórico por programação;
* funções exercidas por período.

## 6.10 Configurações

Área administrativa do sistema.

Permite configurar:

* nome da igreja;
* departamentos;
* funções;
* permissões;
* usuários;
* regras de conflito;
* notificações;
* identidade visual;
* mensagens padrão.

---

# 7. Perfis de usuário

O sistema deve trabalhar com permissões bem definidas.

## 7.1 Administrador geral

Usuário com acesso total ao sistema.

Pode:

* cadastrar igreja;
* cadastrar usuários;
* criar departamentos;
* definir líderes;
* editar qualquer escala;
* visualizar relatórios;
* alterar configurações;
* gerenciar permissões.

## 7.2 Líder de departamento

Usuário responsável por um ou mais departamentos.

Pode:

* criar escalas do seu departamento;
* editar escalas do seu departamento;
* cadastrar ou vincular membros;
* aprovar substituições;
* visualizar relatórios do departamento;
* consultar calendário.

Não deve acessar configurações críticas do sistema, salvo se autorizado.

## 7.3 Membro

Usuário que participa das escalas.

Pode:

* visualizar suas próximas escalas;
* confirmar participação;
* solicitar substituição;
* consultar histórico próprio;
* atualizar informações básicas, se permitido.

Não deve editar escalas de terceiros.

## 7.4 Visualizador

Usuário com acesso apenas para consulta.

Pode ser usado para membros que precisam apenas visualizar escalas públicas ou gerais.

---

# 8. Regras de negócio iniciais

## 8.1 Uma escala deve estar vinculada a uma programação

Toda escala precisa ter:

* data;
* horário;
* programação;
* função;
* responsável.

## 8.2 Um membro não deve ser escalado em dois locais no mesmo horário

O sistema deve detectar conflitos de horário.

Exemplo:

Um membro não pode estar escalado simultaneamente para:

* recepção às 09h;
* sonoplastia às 09h;
* professor da Escola Sabatina às 09h.

Quando houver conflito, o sistema deve alertar o organizador.

## 8.3 Funções devem ser compatíveis com o membro

O sistema pode permitir que cada membro tenha funções habilitadas.

Exemplo:

Um membro cadastrado como sonoplasta pode ser escalado em sonoplastia.

Um membro que não participa da música não deveria aparecer como sugestão principal para vocal, salvo se o líder permitir manualmente.

## 8.4 Departamentos devem ter autonomia controlada

Cada líder deve editar apenas o que pertence ao seu departamento, exceto administradores.

## 8.5 Escalas alteradas devem manter histórico

Alterações importantes precisam ser registradas.

Exemplos:

* troca de membro;
* alteração de função;
* mudança de horário;
* cancelamento;
* substituição;
* ausência;
* confirmação.

## 8.6 Escalas concluídas não devem ser alteradas livremente

Após a data da programação, alterações devem ser restritas ou registradas com justificativa.

## 8.7 Membro inativo não deve ser escalado

Usuários marcados como inativos não devem aparecer como opção padrão na criação de novas escalas.

## 8.8 Programações recorrentes devem ser suportadas futuramente

O sistema deve ser pensado para permitir recorrência, como:

* todo sábado;
* todo domingo;
* toda quarta-feira;
* primeiro sábado do mês;
* último domingo do mês.

---

# 9. Segurança do sistema

A segurança deve ser tratada como requisito obrigatório.

Como o idealizador do projeto não possui conhecimento profundo em segurança de sistemas, qualquer IA ou desenvolvedor que atuar no projeto deve assumir a responsabilidade de alertar sobre riscos e implementar proteções adequadas.

## 9.1 Controle de acesso

O sistema deve garantir que cada usuário acesse apenas o que tem permissão para acessar.

Exemplos:

* membro acessa apenas suas próprias escalas e escalas públicas;
* líder acessa apenas departamentos sob sua responsabilidade;
* administrador acessa tudo;
* visualizador não altera dados.

## 9.2 Proteção de dados pessoais

O sistema poderá armazenar dados pessoais dos membros.

Dados sensíveis devem ser protegidos, como:

* telefone;
* e-mail;
* data de nascimento;
* disponibilidade;
* observações internas;
* histórico de participação;
* ausências;
* justificativas.

Essas informações não devem ser públicas sem necessidade.

## 9.3 Regras no backend

Não depender apenas do frontend para bloquear ações.

Mesmo que um botão esteja escondido, o backend ou banco de dados deve impedir ações indevidas.

Exemplo:

Um membro não pode editar uma escala apenas manipulando a URL ou uma requisição.

## 9.4 Isolamento por igreja

Se o sistema for multi-igreja, os dados de uma igreja jamais podem aparecer para outra.

Toda tabela principal deve considerar vínculo com a igreja ou organização.

Exemplo de campo importante:

* church_id;
* organization_id;
* workspace_id.

## 9.5 Logs de auditoria

Ações importantes devem gerar registro.

Registrar:

* quem criou;
* quem alterou;
* quem removeu;
* quem confirmou;
* quem solicitou substituição;
* quem aprovou substituição;
* data e horário da ação.

## 9.6 Links públicos

Caso o sistema permita link público de escala, deve-se evitar exposição de dados pessoais.

Uma escala pública pode mostrar:

* nome;
* função;
* data;
* horário;
* programação.

Mas deve evitar mostrar:

* telefone;
* e-mail;
* data de nascimento;
* observações internas;
* dados administrativos.

## 9.7 Permissões administrativas

Apenas administradores devem poder:

* excluir igreja;
* excluir departamento;
* alterar permissões;
* cadastrar administradores;
* exportar dados sensíveis;
* visualizar relatórios completos;
* alterar configurações globais.

---

# 10. Estrutura de dados sugerida

Estrutura inicial sugerida para banco de dados.

## 10.1 churches

Tabela para armazenar igrejas ou organizações.

Campos sugeridos:

* id;
* name;
* city;
* state;
* address;
* status;
* created_at;
* updated_at.

## 10.2 users / profiles

Tabela de perfis dos usuários.

Campos sugeridos:

* id;
* user_id;
* church_id;
* full_name;
* email;
* phone;
* role;
* status;
* created_at;
* updated_at.

## 10.3 members

Tabela de membros escaláveis.

Campos sugeridos:

* id;
* church_id;
* full_name;
* phone;
* email;
* birth_date;
* status;
* notes;
* created_at;
* updated_at.

## 10.4 departments

Tabela de departamentos.

Campos sugeridos:

* id;
* church_id;
* name;
* description;
* leader_id;
* status;
* created_at;
* updated_at.

## 10.5 functions

Tabela de funções da escala.

Campos sugeridos:

* id;
* church_id;
* department_id;
* name;
* description;
* status;
* created_at;
* updated_at.

## 10.6 member_departments

Tabela de vínculo entre membros e departamentos.

Campos sugeridos:

* id;
* member_id;
* department_id;
* created_at.

## 10.7 member_functions

Tabela de vínculo entre membros e funções habilitadas.

Campos sugeridos:

* id;
* member_id;
* function_id;
* created_at.

## 10.8 events

Tabela de programações.

Campos sugeridos:

* id;
* church_id;
* title;
* description;
* start_datetime;
* end_datetime;
* location;
* department_id;
* status;
* created_at;
* updated_at.

## 10.9 schedules

Tabela principal das escalas.

Campos sugeridos:

* id;
* church_id;
* event_id;
* department_id;
* function_id;
* member_id;
* status;
* notes;
* created_by;
* created_at;
* updated_at.

## 10.10 substitution_requests

Tabela de solicitações de substituição.

Campos sugeridos:

* id;
* schedule_id;
* requested_by;
* replacement_member_id;
* reason;
* status;
* approved_by;
* approved_at;
* created_at;
* updated_at.

## 10.11 audit_logs

Tabela de auditoria.

Campos sugeridos:

* id;
* church_id;
* user_id;
* action;
* entity_type;
* entity_id;
* old_value;
* new_value;
* created_at.

---

# 11. Interface desejada

A interface do Escala.iasd deve ser:

* limpa;
* leve;
* objetiva;
* responsiva;
* fácil para uso em celular;
* com linguagem simples;
* com botões claros;
* com calendário visual;
* com filtros úteis;
* com poucos cliques para tarefas comuns.

## 11.1 Telas principais

Telas recomendadas:

* Login;
* Painel;
* Minhas Escalas;
* Calendário;
* Membros;
* Departamentos;
* Funções;
* Programações;
* Criar Escala;
* Substituições;
* Relatórios;
* Configurações.

## 11.2 Painel do membro

O membro deve ter uma tela simples mostrando:

* próxima escala;
* data;
* horário;
* função;
* programação;
* botão de confirmar;
* botão de solicitar substituição;
* histórico.

## 11.3 Painel do líder

O líder deve visualizar:

* escalas do departamento;
* conflitos;
* pendências de confirmação;
* pedidos de substituição;
* membros disponíveis;
* próximas programações.

## 11.4 Painel do administrador

O administrador deve visualizar:

* visão geral da igreja;
* departamentos ativos;
* próximas escalas;
* conflitos;
* relatórios;
* usuários;
* configurações.

---

# 12. Notificações

O sistema pode evoluir para notificações.

Canais possíveis:

* e-mail;
* WhatsApp;
* notificação interna;
* lembrete no painel;
* link compartilhável.

Eventos que podem gerar notificação:

* membro escalado;
* escala alterada;
* substituição solicitada;
* substituição aprovada;
* escala próxima;
* confirmação pendente;
* ausência registrada.

Inicialmente, notificações podem ser manuais ou por mensagem padrão copiável.

Futuramente, podem ser automatizadas.

---

# 13. Relatórios desejados

Relatórios úteis:

## 13.1 Relatório por membro

Mostra:

* quantas vezes foi escalado;
* em quais funções;
* em quais datas;
* ausências;
* substituições;
* confirmações.

## 13.2 Relatório por departamento

Mostra:

* escalas realizadas;
* membros participantes;
* funções mais utilizadas;
* pendências;
* substituições.

## 13.3 Relatório por período

Mostra escalas por:

* semana;
* mês;
* trimestre;
* semestre;
* ano.

## 13.4 Relatório de equilíbrio

Ajuda a identificar:

* membros sobrecarregados;
* membros pouco escalados;
* funções com poucos participantes;
* departamentos com baixa cobertura.

---

# 14. Critérios de aceite do MVP

A primeira versão do sistema será considerada funcional quando permitir:

* cadastrar igreja;
* cadastrar usuários;
* cadastrar membros;
* cadastrar departamentos;
* cadastrar funções;
* criar programações;
* criar escalas;
* visualizar calendário;
* visualizar minhas escalas;
* detectar conflito básico de horário;
* controlar permissões básicas;
* proteger dados por igreja;
* impedir acesso indevido;
* registrar alterações importantes;
* funcionar bem em celular.

---

# 15. MVP recomendado

A versão inicial deve focar no essencial.

## 15.1 Funcionalidades do MVP

* Login;
* Cadastro de igreja;
* Cadastro de membros;
* Cadastro de departamentos;
* Cadastro de funções;
* Cadastro de programações;
* Criação de escalas;
* Visualização por calendário;
* Tela “Minhas Escalas”;
* Confirmação de participação;
* Solicitação de substituição;
* Permissões básicas;
* Segurança por igreja;
* Histórico simples.

## 15.2 Funcionalidades para versões futuras

* Notificações automáticas;
* WhatsApp integrado;
* Escalas recorrentes;
* Sugestão automática de membros;
* Distribuição equilibrada;
* Relatórios avançados;
* App mobile;
* Exportação em PDF;
* Link público da escala;
* QR Code para consulta;
* Templates de escala;
* Integração com Google Agenda.

---

# 16. Regras para desenvolvimento com IA

Ao desenvolver este projeto com auxílio de IA, seguir estas regras:

## 16.1 Não implementar sem considerar segurança

Toda nova tabela, tela ou funcionalidade deve considerar:

* permissões;
* isolamento por igreja;
* dados sensíveis;
* validação;
* logs;
* acesso indevido.

## 16.2 Não criar telas poluídas

A interface deve ser simples, objetiva e funcional.

## 16.3 Não criar funcionalidades desconectadas

Toda feature deve estar ligada a um problema real da gestão de escalas.

## 16.4 Não depender apenas de validação visual

Bloqueios importantes precisam existir no backend ou banco.

## 16.5 Documentar decisões

Cada decisão importante deve ser registrada no histórico do projeto.

## 16.6 Testar perfis diferentes

Sempre testar pelo menos:

* administrador;
* líder;
* membro;
* usuário sem permissão.

---

# 17. Prompt base para IA desenvolvedora

Use este contexto antes de implementar qualquer funcionalidade no Escala.iasd:

> Você está atuando no projeto Escala.iasd, um sistema web para gestão de escalas ministeriais da Igreja Adventista do Sétimo Dia. O sistema deve ser simples, seguro, responsivo e orientado ao fluxo real de uma igreja local.
>
> Antes de implementar qualquer funcionalidade, considere: regra de negócio, impacto no banco de dados, permissões, segurança, isolamento por igreja, experiência do usuário e testes necessários.
>
> O usuário idealizador não possui conhecimento profundo em segurança, portanto você deve alertar sobre riscos e propor proteções adequadas.
>
> Não implemente soluções genéricas. Explique o impacto da alteração e mantenha o sistema organizado, evolutivo e fácil de manter.

---

# 18. Diretriz principal

O Escala.iasd deve ser um sistema simples, seguro e útil para organizar o serviço da igreja.

A prioridade não é criar um sistema complexo, mas sim uma ferramenta confiável que ajude líderes e membros a saberem claramente:

* quando servirão;
* onde servirão;
* qual função exercerão;
* quem está responsável;
* o que foi alterado;
* como solicitar substituição;
* como manter a escala organizada.

A essência do projeto é transformar uma rotina manual e sujeita a falhas em um fluxo digital organizado, acessível e seguro.

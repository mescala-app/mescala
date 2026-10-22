# Template visual de referência — leia antes de usar

Esta pasta guarda um **template de interface usado só como referência visual** para o futuro frontend do Mescala. **Não é código do sistema.**

- **Origem:** Material Dashboard Shadcn, da Creative Tim, redistribuído pelo 21st.dev. Licença **MIT** (`LICENSE.md`); o aviso de copyright precisa acompanhar qualquer uso. Detalhes em `ATTRIBUTION.md` e `THIRD_PARTY_NOTICES.md`.
- **Conteúdo útil:** layout, menu lateral, componentes (shadcn/ui) e tema. As telas são genéricas (Dashboard, Perfil, Tabelas, Notificações, Assinaturas, Login, Cadastro); as telas próprias do Mescala ainda serão desenhadas.
- **Não usar:** `server/` e `shared/` (Express, Neon, Passport, Drizzle). O backend oficial é o Next.js em `/backend` (ADR-002), e o banco segue a DEC-04, a DEC-05 e a DEC-09.
- **Não instalar nem rodar** a partir daqui. O projeto está na fase BACKEND ONLY (ADR-002). O uso deste template como base da interface depende de um ADR de frontend, ainda não emitido.
- Fica fora do lint da raiz (`eslint.config.js`). Agentes executores não devem alterar esta pasta.

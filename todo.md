# Lista de Tarefas - Desenvolvimento da Aplicação Sorveteria

- [X] 1. Analisar os arquivos enviados para entender os requisitos da aplicação.
- [X] 2. Identificar os requisitos funcionais, técnicos, de segurança e LGPD da aplicação.
- [X] 3. Pesquisar e listar ferramentas gratuitas adequadas para cada etapa do projeto.
- [X] 4. Registrar as ferramentas gratuitas selecionadas no todo.md.
- [X] 5. Planejar a arquitetura detalhada e o fluxo de dados da aplicação (web e mobile).
- [X] 6. Ajustar dependências e implementar o backend (Node.js, Express, Sequelize, etc.).
- [X] 7. Integrar todas as rotas do backend.
- [X] 8. Configurar e validar o banco de dados PostgreSQL local.
- [X] 9. Executar limpeza e sync force do Sequelize para criar/alinhar tabelas.
- [X] 10. Validar funcionalidades e usabilidade básicas do backend (health check, registro, login).
- [X] 11. Validar comandos de teste automatizado (curl) para fluxos principais (auth, produtos).
- [X] 12. Validar sintaxe dos comandos de teste automatizado (curl) para CRUD de produtos.
- [X] 13. Reportar e entregar o backend ao usuário.
- [X] 14. Configurar a estrutura do projeto frontend web (React/Vite, Material-UI, dependências).
- [X] 15. Implementar as funcionalidades do frontend web (componentes, rotas, estado, UI).
- [X] 16. Integrar o frontend web com o backend (chamadas API, autenticação, WebSockets).
- [ ] 17. Validar e testar o frontend web (funcionalidade, usabilidade, responsividade).
- [ ] 18. Documentar e preparar a entrega do frontend web.
- [ ] 19. Configurar a estrutura do projeto do app mobile (React Native/Expo, dependências).
- [ ] 20. Implementar as funcionalidades do app mobile (telas, navegação, estado, UI).
- [ ] 21. Integrar o app mobile com o backend (chamadas API, autenticação).
- [ ] 22. Validar e testar o app mobile (funcionalidade, usabilidade).
- [ ] 23. Documentar e preparar a entrega do app mobile.

## Ferramentas Gratuitas Selecionadas:

Com base na pesquisa e nos requisitos do projeto, as seguintes ferramentas e serviços gratuitos (ou com tiers gratuitos adequados) foram selecionados:

**1. Backend (Node.js/Express/Sequelize):**
   - **Hospedagem:** Render (Tier Gratuito para Web Services)
     - *Justificativa:* Oferece um nível gratuito generoso para serviços web Node.js, inclui banco de dados PostgreSQL gratuito, facilitando a configuração e o deploy contínuo a partir do Git.
   - **Banco de Dados:** PostgreSQL (Instância gratuita do Render ou local para desenvolvimento)
     - *Justificativa:* Integrado à hospedagem do Render, simplifica o gerenciamento e a conexão. Alternativas como Supabase ou Neon são viáveis, mas aumentam a complexidade da infraestrutura.
   - **Autenticação:** Bibliotecas `jsonwebtoken` (JWT), `google-auth-library`, `@react-oauth/google`, `@react-native-google-signin/google-signin` (Google OAuth 2.0).
     - *Justificativa:* Bibliotecas padrão, seguras e gratuitas. A configuração do Google Cloud Console para OAuth é gratuita.
   - **WebSockets:** Biblioteca `socket.io`.
     - *Justificativa:* Biblioteca padrão e gratuita para comunicação em tempo real com Node.js.
   - **Segurança:** Bibliotecas `helmet`, `express-rate-limit`, `bcrypt`.
     - *Justificativa:* Bibliotecas padrão e gratuitas para segurança básica de aplicações web e hashing de senhas.
   - **Logs:** Biblioteca `winston`.
     - *Justificativa:* Biblioteca padrão e gratuita para logging no Node.js.

**2. Frontend Web (React/Material-UI):**
   - **Hospedagem:** Vercel (Tier Gratuito "Hobby")
     - *Justificativa:* Excelente nível gratuito, otimizado para frameworks frontend como React, integração fácil com Git, CDN global gratuita.
   - **UI Library:** Material-UI (MUI)
     - *Justificativa:* Especificada nos requisitos, biblioteca de componentes UI completa com um núcleo gratuito.
   - **Roteamento:** Biblioteca `react-router-dom`.
     - *Justificativa:* Biblioteca padrão e gratuita para gerenciamento de rotas em React.
   - **Cliente HTTP:** Biblioteca `axios`.
     - *Justificativa:* Biblioteca padrão e gratuita para realizar requisições HTTP.
   - **Gerenciamento de Estado:** React Context API.
     - *Justificativa:* Recurso nativo do React, adequado para a complexidade descrita, gratuito.
   - **Gráficos:** Bibliotecas `chart.js`, `react-chartjs-2`.
     - *Justificativa:* Especificadas nos requisitos, bibliotecas populares e gratuitas para visualização de dados.
   - **Formulários:** Bibliotecas `formik`, `yup`.
     - *Justificativa:* Especificadas nos requisitos, bibliotecas gratuitas para manipulação e validação de formulários.

**3. Frontend Mobile (React Native/Expo):**
   - **Framework:** React Native com Expo.
     - *Justificativa:* Especificado nos requisitos, simplifica o desenvolvimento e o processo de build, ferramentas principais gratuitas.
   - **UI Library:** `@react-native-material/core` (ou alternativa gratuita como React Native Paper).
     - *Justificativa:* Fornece componentes Material Design, gratuita.
   - **Navegação:** Biblioteca `@react-navigation`.
     - *Justificativa:* Biblioteca padrão e gratuita para navegação em React Native.
   - **Armazenamento Local:** Biblioteca `@react-native-async-storage/async-storage`.
     - *Justificativa:* Biblioteca padrão e gratuita para armazenamento local.
   - **Build/Updates:** Expo Application Services (EAS) Build & Update (Tier Gratuito disponível).
     - *Justificativa:* Integrado ao Expo, simplifica builds e atualizações OTA (Over-The-Air), possui um nível gratuito.
   - **Deploy:** App Store/Play Store (requerem contas de desenvolvedor pagas). Para testes/distribuição gratuita: App Expo Go (desenvolvimento), distribuição interna EAS (tier gratuito limitado), deploy da versão web via EAS Hosting (tier gratuito).
     - *Justificativa:* Foco em opções gratuitas evita custos iniciais com lojas de aplicativos. EAS oferece alternativas gratuitas para testes e compartilhamento interno.

**4. Desenvolvimento e Testes:**
   - **Controle de Versão:** Git / GitHub (Repositórios privados gratuitos).
     - *Justificativa:* Padrão da indústria, gratuito para hospedar código.
   - **Testes de API:** Postman (Tier Gratuito) / Testes com `curl`.
     - *Justificativa:* Especificado nos requisitos, padrão da indústria, tier gratuito suficiente. `curl` usado para testes automatizados no ambiente.
   - **Testes Automatizados:** Jest / Mocha (Bibliotecas gratuitas).
     - *Justificativa:* Planejado nos requisitos, frameworks de teste padrão e gratuitos para JavaScript/Node.js/React.
   - **Diagramação:** Draw.io / diagrams.net (Gratuito).
     - *Justificativa:* Recomendado nos requisitos, ferramenta online gratuita.

**5. Conformidade LGPD:**
   - **Ferramentas:** A implementação dependerá da lógica da aplicação (formulários de consentimento, funcionalidades de acesso/exclusão de dados) e bibliotecas gratuitas, se necessário.
     - *Justificativa:* A conformidade é primariamente um processo e código, não dependente de ferramentas pagas específicas.

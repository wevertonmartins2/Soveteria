# Plano de Arquitetura e Fluxo de Dados - Aplicação Sorveteria

Este documento detalha a arquitetura planejada e o fluxo de dados para a aplicação da sorveteria, abrangendo o backend, frontend web e frontend mobile, com base nos requisitos identificados e nas ferramentas gratuitas selecionadas.

## 1. Visão Geral da Arquitetura

A aplicação seguirá uma arquitetura baseada em serviços, com um backend API RESTful centralizado e dois clientes frontend distintos (web e mobile).

- **Backend:** API RESTful monolítica construída com Node.js, Express e Sequelize, hospedada no Render. Responsável pela lógica de negócios, gerenciamento de dados e autenticação.
- **Frontend Web:** Single Page Application (SPA) construída com React e Material-UI, hospedada na Vercel. Consome a API do backend.
- **Frontend Mobile:** Aplicação nativa (iOS/Android) construída com React Native e Expo. Consome a API do backend.
- **Banco de Dados:** PostgreSQL hospedado no Render, gerenciado pelo Sequelize ORM.
- **Comunicação em Tempo Real:** WebSockets (Socket.IO) para notificações (ex: status de pedidos).
- **Autenticação:** Baseada em JWT para sessões de email/senha e OAuth 2.0 para login com Google.

## 2. Arquitetura do Backend (Node.js/Express)

Seguirá uma estrutura modular baseada em funcionalidades:

```
backend/
├── src/
│   ├── config/         # Configurações (DB, JWT, CORS, etc.)
│   ├── controllers/    # Lógica de requisição/resposta (Auth, Usuario, Produto, etc.)
│   ├── middlewares/    # Funções de middleware (auth, authorize, validation, errorHandling)
│   ├── models/         # Definições do Sequelize (Usuario, Produto, Pedido, etc.)
│   ├── routes/         # Definição das rotas da API (/api/usuarios, /api/produtos, etc.)
│   ├── services/       # Lógica de negócios desacoplada dos controllers
│   ├── sockets/        # Lógica relacionada a WebSockets
│   ├── utils/          # Funções utilitárias (helpers, validators)
│   └── app.js          # Configuração principal do Express, middlewares globais
│   └── server.js       # Inicialização do servidor HTTP e WebSockets
├── tests/              # Testes unitários e de integração
├── .env                # Variáveis de ambiente
├── package.json
└── sequelize-config.js # Configuração do Sequelize CLI (migrations, seeders)
```

**Fluxo de Requisição Típico:**
`Cliente -> Rota (routes) -> Middleware (auth, validation) -> Controller -> Service -> Model (Sequelize) -> Banco de Dados`

## 3. Arquitetura do Frontend Web (React)

Seguirá uma estrutura baseada em componentes e funcionalidades:

```
frontend/
├── public/
├── src/
│   ├── assets/         # Imagens, fontes, etc.
│   ├── components/     # Componentes reutilizáveis (Button, Navbar, ProductCard, etc.)
│   ├── contexts/       # Context API (AuthContext, CartContext, SocketContext)
│   ├── hooks/          # Hooks customizados
│   ├── layouts/        # Estruturas de página (MainLayout, AdminLayout)
│   ├── pages/          # Componentes de página (HomePage, LoginPage, ProductPage, AdminDashboard)
│   ├── services/       # Lógica de chamada da API (api.js, authService, productService)
│   ├── styles/         # Estilos globais, temas MUI
│   ├── utils/          # Funções utilitárias
│   ├── App.js          # Configuração de rotas (React Router)
│   └── index.js        # Ponto de entrada da aplicação
├── .env                # Variáveis de ambiente (REACT_APP_API_URL)
└── package.json
```

## 4. Arquitetura do Frontend Mobile (React Native/Expo)

Estrutura similar à do frontend web, adaptada para mobile:

```
mobile/
├── assets/             # Imagens, fontes, etc.
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── contexts/       # Context API (AuthContext, CartContext)
│   ├── hooks/          # Hooks customizados
│   ├── navigation/     # Configuração de navegação (React Navigation)
│   ├── screens/        # Componentes de tela (LoginScreen, ProductsScreen, CartScreen)
│   ├── services/       # Lógica de chamada da API (api.js, authService)
│   ├── styles/         # Estilos globais/compartilhados
│   ├── utils/          # Funções utilitárias
│   └── App.js          # Ponto de entrada, configuração inicial
├── .env                # Variáveis de ambiente (API_URL, GOOGLE_CLIENT_ID)
├── app.json            # Configuração do Expo
└── package.json
```

## 5. Esquema do Banco de Dados (PostgreSQL/Sequelize)

Baseado nos modelos mencionados e funcionalidades:

- **Usuarios:** `id`, `nome`, `email`, `senha_hash`, `google_id` (opcional), `role` ('cliente', 'admin', 'gerente'), `createdAt`, `updatedAt`.
- **Produtos:** `id`, `nome`, `descricao`, `preco`, `categoria`, `imagem_url`, `estoque`, `createdAt`, `updatedAt`.
- **Avaliacoes:** `id`, `usuario_id` (FK Usuarios), `produto_id` (FK Produtos), `nota` (1-5), `comentario`, `createdAt`, `updatedAt`.
- **Carrinhos:** `id`, `usuario_id` (FK Usuarios), `createdAt`, `updatedAt`.
- **ItensCarrinho:** `id`, `carrinho_id` (FK Carrinhos), `produto_id` (FK Produtos), `quantidade`, `preco_unitario` (no momento da adição), `createdAt`, `updatedAt`.
- **Pedidos:** `id`, `usuario_id` (FK Usuarios), `endereco_entrega` (JSON ou campos separados), `valor_total`, `status` ('pendente', 'processando', 'enviado', 'entregue', 'cancelado'), `data_pedido`, `createdAt`, `updatedAt`.
- **ItensPedido:** `id`, `pedido_id` (FK Pedidos), `produto_id` (FK Produtos), `quantidade`, `preco_unitario`, `createdAt`, `updatedAt`.

*Relacionamentos:* Um-para-Muitos (Usuario -> Pedidos, Usuario -> Avaliacoes, Usuario -> Carrinho), Muitos-para-Muitos (Carrinho <-> Produtos via ItensCarrinho, Pedido <-> Produtos via ItensPedido).

## 6. Fluxos de Dados Principais

**a) Autenticação (Email/Senha):**
1.  **Frontend:** Usuário envia email/senha para `/api/auth/login`.
2.  **Backend:** Controller valida dados -> Service verifica email -> compara senha com hash (bcrypt) -> gera JWT -> retorna JWT.
3.  **Frontend:** Armazena JWT (localStorage/AsyncStorage) -> atualiza estado de autenticação (Context API) -> redireciona.
4.  **Requisições subsequentes:** Frontend envia JWT no header `Authorization` -> Backend usa middleware `auth.js` para validar JWT.

**b) Autenticação (Google):**
1.  **Frontend:** Usuário clica em "Login com Google" -> usa biblioteca OAuth -> obtém token Google ID.
2.  **Frontend:** Envia token Google ID para `/api/auth/google-login`.
3.  **Backend:** Controller recebe token -> Service valida token com Google API (`@google-cloud/auth`) -> busca/cria usuário no DB -> gera JWT -> retorna JWT.
4.  **Frontend:** Armazena JWT -> atualiza estado -> redireciona.

**c) Adicionar ao Carrinho:**
1.  **Frontend:** Usuário clica em "Adicionar" -> envia `produto_id` e `quantidade` para `/api/carrinho/itens` (requer autenticação JWT).
2.  **Backend:** Middleware `auth.js` valida JWT -> Controller valida dados -> Service busca/cria carrinho do usuário -> adiciona/atualiza ItemCarrinho no DB -> retorna carrinho atualizado.
3.  **Frontend:** Atualiza estado do carrinho (Context API).

**d) Notificação de Status do Pedido (WebSockets):**
1.  **Backend:** Admin atualiza status do pedido no DB -> Service dispara evento WebSocket (ex: `pedido_atualizado`) com `pedido_id` e novo `status` para o `usuario_id` específico.
2.  **Frontend (Cliente):** Conexão WebSocket estabelecida no login -> ouve evento `pedido_atualizado` -> se `pedido_id` pertence ao usuário, atualiza UI/mostra notificação.

## 7. Segurança e LGPD

- **Segurança:**
    - HTTPS (fornecido por Render/Vercel).
    - Validação de entrada (backend/frontend).
    - CORS configurado no backend.
    - Proteção contra CSRF (se aplicável, especialmente se usar cookies).
    - Rate limiting (`express-rate-limit`).
    - Headers de segurança (`helmet`).
    - Hash de senhas (`bcrypt`).
    - Autorização baseada em roles (middleware `authorize.js`).
- **LGPD:**
    - **Consentimento:** Checkbox explícito no cadastro/login Google.
    - **Política de Privacidade:** Página dedicada no frontend.
    - **Acesso/Correção:** Funcionalidade no perfil do usuário.
    - **Exclusão:** Rota na API para solicitar exclusão (requer confirmação e processo definido).
    - **Logs:** `winston` para registrar acessos e modificações de dados sensíveis.

Este plano servirá como guia para a implementação. Detalhes adicionais podem surgir durante o desenvolvimento.

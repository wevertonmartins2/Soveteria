require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const { Server } = require("socket.io");

// Importar rotas principais
const routes = require("./routes");
// TODO: Importar middleware de erro
// const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Configuração de Segurança Essencial
app.use(helmet()); // Define vários headers HTTP de segurança
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" })); // Permite requisições de origens específicas

// Limitação de Taxa (Rate Limiting)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000), // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100), // Limita cada IP a 100 requisições por janela
  message: "Muitas requisições criadas a partir deste IP, por favor, tente novamente após 15 minutos",
  standardHeaders: true, // Retorna informações de rate limit nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
});
app.use("/api/", limiter); // Aplica o rate limiting a todas as rotas da API

// Middlewares Essenciais
app.use(express.json()); // Para parsear JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Para parsear dados de formulários URL-encoded

// Configurar Rotas Principais
app.use("/api", routes);

// Rota de Health Check básica
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// TODO: Configurar Middleware de Tratamento de Erros
// app.use(errorHandler);

// Configuração do Servidor HTTP e Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

// TODO: Configurar lógica do Socket.IO (em ./sockets/index.js)
// require("./sockets")(io);

module.exports = { app, server, io }; // Exportar app, server e io para server.js e testes

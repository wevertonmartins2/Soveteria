const express = require("express");
const pedidoController = require("../controllers/pedidoController");
const authMiddleware = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

const router = express.Router();

// Todas as rotas de pedido requerem autenticação
router.use(authMiddleware);

// Criar um novo pedido a partir do carrinho
router.post("/", pedidoController.criarPedido);

// Listar pedidos do usuário logado
router.get("/", pedidoController.listarPedidosUsuario);

// Obter detalhes de um pedido específico (usuário logado ou admin/gerente)
router.get("/:id", pedidoController.obterPedido);

// Atualizar status de um pedido (apenas admin/gerente)
router.patch("/:id/status", authorize("admin", "gerente"), pedidoController.atualizarStatusPedido);

// TODO: Adicionar rota para cancelar pedido (pode ser parte da atualização de status ou uma rota separada)

module.exports = router;


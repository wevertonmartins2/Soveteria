const express = require("express");
const produtoController = require("../controllers/produtoController");
const authMiddleware = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

const router = express.Router();

// Rotas públicas (listar e obter produto)
router.get("/", produtoController.listarProdutos);
router.get("/:id", produtoController.obterProduto);

// Rotas protegidas para admin/gerente (criar, atualizar, deletar)
router.post("/", authMiddleware, authorize("admin", "gerente"), produtoController.criarProduto);
router.put("/:id", authMiddleware, authorize("admin", "gerente"), produtoController.atualizarProduto);
router.delete("/:id", authMiddleware, authorize("admin", "gerente"), produtoController.deletarProduto);

module.exports = router;


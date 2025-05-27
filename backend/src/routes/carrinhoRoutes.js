const express = require("express");
const carrinhoController = require("../controllers/carrinhoController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// Todas as rotas do carrinho requerem autenticação
router.use(authMiddleware);

// Obter o carrinho do usuário logado
router.get("/", carrinhoController.obterCarrinho);

// Adicionar um item ao carrinho
router.post("/items", carrinhoController.adicionarItem);

// Atualizar a quantidade de um item específico no carrinho
router.put("/items/:item_id", carrinhoController.atualizarItem);

// Remover um item específico do carrinho
router.delete("/items/:item_id", carrinhoController.removerItem);

// Limpar o carrinho (remover todos os itens)
router.delete("/", carrinhoController.limparCarrinho);

module.exports = router;


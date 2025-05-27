const express = require("express");
const avaliacaoController = require("../controllers/avaliacaoController");
const authMiddleware = require("../middlewares/auth");
// const authorize = require("../middlewares/authorize"); // Se necessário para deletar/editar

const router = express.Router();

// Rota para criar uma nova avaliação (requer autenticação)
// A rota pode ser /produtos/:produto_id/avaliacoes ou /avaliacoes
// Escolhendo /avaliacoes e pegando produto_id do corpo ou query
// Ou montando esta rota dentro de produtoRoutes? Vamos manter separada por enquanto.
router.post("/", authMiddleware, avaliacaoController.criarAvaliacao);

// Rota pública para listar avaliações de um produto
// Usando /produtos/:produto_id/avaliacoes parece mais RESTful
// Vamos ajustar isso depois ou montar essa rota dentro de produtoRoutes.
// Por agora, uma rota /avaliacoes?produto_id=X
router.get("/", avaliacaoController.listarAvaliacoesPorProduto); // Espera produto_id na query

// TODO: Adicionar rotas para editar/deletar avaliação (protegidas)
// router.put("/:id", authMiddleware, /* authorize(...), */ avaliacaoController.atualizarAvaliacao);
// router.delete("/:id", authMiddleware, /* authorize(...), */ avaliacaoController.deletarAvaliacao);


module.exports = router;


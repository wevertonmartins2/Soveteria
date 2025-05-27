const express = require("express");
const authRoutes = require("./authRoutes");
// Import other route modules (usuarios, produtos, carrinhos, pedidos, etc.)
// const usuarioRoutes = require("./usuarioRoutes");
const produtoRoutes = require("./produtoRoutes");
const carrinhoRoutes = require("./carrinhoRoutes");
const pedidoRoutes = require("./pedidoRoutes");
const avaliacaoRoutes = require("./avaliacaoRoutes");
// const relatorioRoutes = require("./relatorioRoutes");

const router = express.Router();

// Mount auth routes
router.use("/auth", authRoutes);

// Mount other routes
// router.use("/usuarios", usuarioRoutes);
router.use("/produtos", produtoRoutes);
router.use("/carrinho", carrinhoRoutes);
router.use("/pedidos", pedidoRoutes);
router.use("/avaliacoes", avaliacaoRoutes);
// router.use("/relatorios", relatorioRoutes);

module.exports = router;


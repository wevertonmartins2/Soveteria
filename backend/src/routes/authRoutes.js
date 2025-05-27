const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// Rota para registro de novo usuário
router.post("/register", authController.register);

// Rota para login com email/senha
router.post("/login", authController.login);

// Rota para login/registro com Google
router.post("/google-login", authController.googleLogin);

// Rota protegida para obter dados do usuário autenticado
router.get("/me", authMiddleware, authController.getMe);

// TODO: Adicionar rota para refresh token, se necessário
// TODO: Adicionar rota para solicitar redefinição de senha, se necessário
// TODO: Adicionar rota para confirmar redefinição de senha, se necessário

module.exports = router;


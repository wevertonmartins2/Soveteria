const jwt = require("jsonwebtoken");
const { Usuario } = require("../models"); // Adjust path as needed

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Erro: Token de autenticação ausente ou mal formatado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token payload
    const usuario = await Usuario.findByPk(decoded.id, {
      // Optionally exclude password hash from the user object attached to req
      attributes: { exclude: ["senha_hash"] }
    });

    if (!usuario) {
      return res.status(401).json({ message: "Erro: Usuário não encontrado para o token fornecido." });
    }

    // Attach user object to the request for use in subsequent middleware/controllers
    req.usuario = usuario;
    next(); // Proceed to the next middleware or route handler

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Erro: Token expirado." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Erro: Token inválido." });
    }
    // Handle other potential errors during token verification
    console.error("Erro na verificação do token:", error);
    return res.status(500).json({ message: "Erro interno ao verificar token." });
  }
};

module.exports = authMiddleware;

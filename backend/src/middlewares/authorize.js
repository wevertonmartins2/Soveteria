// Middleware to authorize based on user roles

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Assumes authMiddleware has already run and attached req.usuario
    if (!req.usuario || !req.usuario.role) {
      return res.status(403).json({ message: "Erro: Acesso negado. Usuário não autenticado ou sem função definida." });
    }

    const userRole = req.usuario.role;

    if (allowedRoles.includes(userRole)) {
      next(); // User has one of the allowed roles, proceed
    } else {
      return res.status(403).json({ message: "Erro: Acesso negado. Você não tem permissão para acessar este recurso." });
    }
  };
};

module.exports = authorize;


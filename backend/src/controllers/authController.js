const { Usuario } = require("../models");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Função para gerar token JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

// Rota para obter dados do usuário autenticado
exports.getMe = async (req, res) => {
  try {
    // O middleware de autenticação já anexou o usuário à requisição
    // Apenas retorna os dados do usuário (sem senha_hash)
    res.status(200).json(req.usuario);
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    res.status(500).json({ message: "Erro interno ao buscar dados do usuário." });
  }
};

// Registrar novo usuário com email/senha
exports.register = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: "Erro: Nome, email e senha são obrigatórios." });
  }

  try {
    // Verificar se o email já existe
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Erro: Email já cadastrado." });
    }

    // Criar usuário (o hook beforeCreate fará o hash da senha)
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha_hash: senha, // Passa a senha para o hook fazer o hash
      role: "cliente", // Default role
    });

    // Gerar token
    const token = generateToken(novoUsuario.id, novoUsuario.role);

    // Remover senha_hash antes de retornar
    const usuarioParaRetorno = novoUsuario.toJSON();
    delete usuarioParaRetorno.senha_hash;

    res.status(201).json({ token, usuario: usuarioParaRetorno });

  } catch (error) {
    console.error("Erro no registro:", error);
    // Verificar erros de validação do Sequelize
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message);
        return res.status(400).json({ message: "Erro de validação", errors: messages });
    }
    res.status(500).json({ message: "Erro interno ao registrar usuário." });
  }
};

// Login com email/senha
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Erro: Email e senha são obrigatórios." });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || !usuario.senha_hash) {
      // Usuário não encontrado ou é um usuário de login social sem senha definida
      return res.status(401).json({ message: "Erro: Credenciais inválidas." });
    }

    // Comparar senha
    const isMatch = await usuario.comparePassword(senha);
    if (!isMatch) {
      return res.status(401).json({ message: "Erro: Credenciais inválidas." });
    }

    // Gerar token
    const token = generateToken(usuario.id, usuario.role);

    // Remover senha_hash antes de retornar
    const usuarioParaRetorno = usuario.toJSON();
    delete usuarioParaRetorno.senha_hash;

    res.status(200).json({ token, usuario: usuarioParaRetorno });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro interno ao fazer login." });
  }
};

// Login/Registro com Google
exports.googleLogin = async (req, res) => {
  const { token: googleToken } = req.body; // Recebe o token ID do Google do frontend

  if (!googleToken) {
    return res.status(400).json({ message: "Erro: Token do Google ausente." });
  }

  try {
    // Verificar o token ID do Google
    const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const google_id = payload["sub"];
    const email = payload["email"];
    const nome = payload["name"];
    // const picture = payload['picture']; // Opcional: salvar foto do perfil

    if (!email) {
        return res.status(400).json({ message: "Erro: Não foi possível obter o email do token do Google." });
    }

    // Procurar usuário pelo google_id ou email
    let usuario = await Usuario.findOne({ where: { google_id } });

    if (!usuario) {
      // Se não encontrou pelo google_id, tenta pelo email (caso já exista conta com email/senha)
      usuario = await Usuario.findOne({ where: { email } });

      if (usuario) {
        // Usuário existe com email/senha, atualiza com google_id
        usuario.google_id = google_id;
        await usuario.save();
      } else {
        // Usuário não existe, cria um novo
        usuario = await Usuario.create({
          google_id,
          email,
          nome,
          role: "cliente",
          // senha_hash será null
        });
      }
    }

    // Gerar token JWT para nossa aplicação
    const token = generateToken(usuario.id, usuario.role);

    // Remover senha_hash (que será null neste caso) antes de retornar
    const usuarioParaRetorno = usuario.toJSON();
    delete usuarioParaRetorno.senha_hash;

    res.status(200).json({ token, usuario: usuarioParaRetorno });

  } catch (error) {
    console.error("Erro no login com Google:", error);
    res.status(401).json({ message: "Erro: Falha na autenticação com Google. Token inválido ou expirado?" });
  }
};


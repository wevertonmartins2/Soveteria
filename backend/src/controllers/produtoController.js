const { Produto, Avaliacao, sequelize } = require("../models");
const { Op } = require("sequelize");

// Listar todos os produtos com filtros e paginação
exports.listarProdutos = async (req, res) => {
  const { categoria, precoMin, precoMax, nome, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const whereClause = {};

  if (categoria) {
    whereClause.categoria = categoria;
  }
  if (nome) {
    // Usar ILIKE para busca case-insensitive (PostgreSQL)
    // Usar LIKE para MySQL/outros (pode precisar ajustar)
    whereClause.nome = { [Op.iLike]: `%${nome}%` }; // Ajustar Op.like se não for PostgreSQL
  }
  if (precoMin) {
    whereClause.preco = { ...whereClause.preco, [Op.gte]: parseFloat(precoMin) };
  }
  if (precoMax) {
    whereClause.preco = { ...whereClause.preco, [Op.lte]: parseFloat(precoMax) };
  }

  try {
    const { count, rows } = await Produto.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["nome", "ASC"]], // Ordenar por nome por padrão
      // Incluir média de avaliações (opcional, pode impactar performance)
      // attributes: {
      //   include: [
      //     [sequelize.fn("AVG", sequelize.col("avaliacoes.nota")), "mediaAvaliacoes"],
      //   ],
      // },
      // include: [{
      //   model: Avaliacao,
      //   as: "avaliacoes",
      //   attributes: [], // Não trazer dados das avaliações, apenas usar para agregação
      // }],
      // group: ["Produto.id"], // Agrupar para a função AVG funcionar corretamente
      // subQuery: false, // Necessário quando usando limit com include/group
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      produtos: rows,
    });
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    res.status(500).json({ message: "Erro interno ao buscar produtos." });
  }
};

// Obter detalhes de um produto específico
exports.obterProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await Produto.findByPk(id, {
      include: [{ // Incluir avaliações associadas
        model: Avaliacao,
        as: "avaliacoes",
        include: [{ // Incluir informações do usuário que avaliou
            model: sequelize.models.Usuario, // Acessar Usuario via sequelize.models
            as: 'usuario',
            attributes: ['id', 'nome'] // Trazer apenas ID e nome
        }]
      }]
    });

    if (!produto) {
      return res.status(404).json({ message: "Erro: Produto não encontrado." });
    }

    // Calcular média de avaliações manualmente se não for feito na query
    // const media = produto.avaliacoes.length > 0
    //   ? produto.avaliacoes.reduce((sum, ava) => sum + ava.nota, 0) / produto.avaliacoes.length
    //   : 0;
    // const produtoComMedia = { ...produto.toJSON(), mediaAvaliacoes: media };

    res.status(200).json(produto);
  } catch (error) {
    console.error("Erro ao obter produto:", error);
    res.status(500).json({ message: "Erro interno ao buscar produto." });
  }
};

// Criar um novo produto (requer permissão de admin/gerente)
exports.criarProduto = async (req, res) => {
  const { nome, descricao, preco, categoria, imagem_url, estoque } = req.body;

  // Validação básica de entrada
  if (!nome || preco === undefined || estoque === undefined) {
    return res.status(400).json({ message: "Erro: Nome, preço e estoque são obrigatórios." });
  }

  try {
    const novoProduto = await Produto.create({
      nome,
      descricao,
      preco,
      categoria,
      imagem_url,
      estoque,
    });
    res.status(201).json(novoProduto);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message);
        return res.status(400).json({ message: "Erro de validação", errors: messages });
    }
    res.status(500).json({ message: "Erro interno ao criar produto." });
  }
};

// Atualizar um produto existente (requer permissão de admin/gerente)
exports.atualizarProduto = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, categoria, imagem_url, estoque } = req.body;

  try {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(404).json({ message: "Erro: Produto não encontrado." });
    }

    // Atualizar campos fornecidos
    produto.nome = nome ?? produto.nome;
    produto.descricao = descricao ?? produto.descricao;
    produto.preco = preco ?? produto.preco;
    produto.categoria = categoria ?? produto.categoria;
    produto.imagem_url = imagem_url ?? produto.imagem_url;
    produto.estoque = estoque ?? produto.estoque;

    await produto.save();
    res.status(200).json(produto);

  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
     if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message);
        return res.status(400).json({ message: "Erro de validação", errors: messages });
    }
    res.status(500).json({ message: "Erro interno ao atualizar produto." });
  }
};

// Deletar um produto (requer permissão de admin/gerente)
exports.deletarProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(404).json({ message: "Erro: Produto não encontrado." });
    }

    await produto.destroy();
    res.status(204).send(); // No content

  } catch (error) {
     console.error("Erro ao deletar produto:", error);
     // Verificar se há restrição de chave estrangeira (ex: produto em um pedido)
     if (error.name === 'SequelizeForeignKeyConstraintError') {
         return res.status(400).json({ message: "Erro: Não é possível deletar o produto pois ele está associado a pedidos existentes." });
     }
    res.status(500).json({ message: "Erro interno ao deletar produto." });
  }
};


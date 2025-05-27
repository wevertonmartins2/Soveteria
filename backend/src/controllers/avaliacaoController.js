const { Avaliacao, Pedido, ItemPedido, Produto } = require("../models");

// Criar uma nova avaliação para um produto
exports.criarAvaliacao = async (req, res) => {
  const { produto_id } = req.params; // Ou pegar do corpo da requisição
  const { nota, comentario } = req.body;
  const usuario_id = req.usuario.id; // Obtido do middleware de autenticação

  if (nota === undefined || nota < 1 || nota > 5) {
    return res.status(400).json({ message: "Erro: Nota inválida. Deve ser entre 1 e 5." });
  }

  try {
    // Opcional: Verificar se o usuário comprou o produto antes de avaliar
    // Esta verificação pode ser complexa e impactar performance.
    // Uma abordagem: buscar pedidos entregues do usuário que contenham o produto.
    /*
    const pedidoEntregue = await Pedido.findOne({
      where: {
        usuario_id: usuario_id,
        status: 'entregue'
      },
      include: [{
        model: ItemPedido,
        as: 'itens',
        where: { produto_id: produto_id },
        required: true // Garante que o pedido contenha o item
      }]
    });

    if (!pedidoEntregue) {
      return res.status(403).json({ message: "Erro: Você só pode avaliar produtos que comprou e recebeu." });
    }
    */

    // Verificar se o usuário já avaliou este produto
    const avaliacaoExistente = await Avaliacao.findOne({
      where: {
        usuario_id: usuario_id,
        produto_id: produto_id,
      },
    });

    if (avaliacaoExistente) {
      return res.status(400).json({ message: "Erro: Você já avaliou este produto." });
    }

    // Verificar se o produto existe
    const produto = await Produto.findByPk(produto_id);
    if (!produto) {
        return res.status(404).json({ message: "Erro: Produto não encontrado." });
    }

    // Criar a avaliação
    const novaAvaliacao = await Avaliacao.create({
      nota,
      comentario,
      usuario_id,
      produto_id,
    });

    res.status(201).json(novaAvaliacao);

  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message);
        return res.status(400).json({ message: "Erro de validação", errors: messages });
    }
    res.status(500).json({ message: "Erro interno ao criar avaliação." });
  }
};

// Listar avaliações de um produto específico
exports.listarAvaliacoesPorProduto = async (req, res) => {
  const { produto_id } = req.params;
  const { page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Avaliacao.findAndCountAll({
      where: { produto_id },
      include: [{
        model: sequelize.models.Usuario, // Acessar Usuario via sequelize.models
        as: 'usuario',
        attributes: ['id', 'nome'] // Trazer apenas ID e nome
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]], // Mais recentes primeiro
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      avaliacoes: rows,
    });

  } catch (error) {
    console.error("Erro ao listar avaliações:", error);
    res.status(500).json({ message: "Erro interno ao buscar avaliações." });
  }
};

// TODO: Adicionar controllers para atualizar ou deletar avaliação (se necessário)
// Geralmente, usuários podem editar/deletar suas próprias avaliações.


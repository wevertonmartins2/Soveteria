const { Pedido, ItemPedido, Carrinho, ItemCarrinho, Produto, sequelize } = require("../models");
const { Op } = require("sequelize");

// Criar um novo pedido a partir do carrinho do usuário
exports.criarPedido = async (req, res) => {
  const usuario_id = req.usuario.id;
  const { endereco_entrega } = req.body;

  if (!endereco_entrega || typeof endereco_entrega !== 'object' || Object.keys(endereco_entrega).length === 0) {
    return res.status(400).json({ message: "Erro: Endereço de entrega é obrigatório e deve ser um objeto válido." });
  }

  const transaction = await sequelize.transaction(); // Iniciar transação

  try {
    // 1. Buscar o carrinho e seus itens
    const carrinho = await Carrinho.findOne({
      where: { usuario_id },
      include: [{
        model: ItemCarrinho,
        as: "itens",
        required: true, // Garante que o carrinho tenha itens
        include: [{ model: Produto, as: "produto" }],
      }],
      transaction
    });

    if (!carrinho || !carrinho.itens || carrinho.itens.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Erro: Carrinho vazio ou não encontrado." });
    }

    // 2. Verificar estoque e calcular valor total
    let valor_total = 0;
    const itensPedidoData = [];

    for (const item of carrinho.itens) {
      if (item.produto.estoque < item.quantidade) {
        await transaction.rollback();
        return res.status(400).json({ message: `Erro: Estoque insuficiente para ${item.produto.nome}. Disponível: ${item.produto.estoque}` });
      }
      valor_total += item.quantidade * item.preco_unitario; // Usar o preço salvo no item do carrinho
      itensPedidoData.push({
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario, // Preço no momento da adição ao carrinho
      });
    }

    // 3. Criar o Pedido
    const novoPedido = await Pedido.create({
      usuario_id,
      endereco_entrega,
      valor_total,
      status: "pendente", // Status inicial
      data_pedido: new Date(),
    }, { transaction });

    // 4. Criar os Itens do Pedido
    const itensPedidoPromises = itensPedidoData.map(itemData =>
      ItemPedido.create({
        ...itemData,
        pedido_id: novoPedido.id,
      }, { transaction })
    );
    await Promise.all(itensPedidoPromises);

    // 5. Decrementar o estoque dos produtos
    const estoquePromises = carrinho.itens.map(item =>
      Produto.update(
        { estoque: sequelize.literal(`estoque - ${item.quantidade}`) },
        { where: { id: item.produto_id, estoque: { [Op.gte]: item.quantidade } }, transaction } // Condição extra de estoque para segurança
      )
    );
    const results = await Promise.all(estoquePromises);

    // Verificar se algum update de estoque falhou (concorrência?)
    results.forEach((result, index) => {
        if (result[0] === 0) { // result[0] é o número de linhas afetadas
            throw new Error(`Falha ao atualizar estoque para o produto ID ${carrinho.itens[index].produto_id}. Concorrência ou estoque mudou.`);
        }
    });

    // 6. Limpar o carrinho (deletar itens do carrinho)
    await ItemCarrinho.destroy({ where: { carrinho_id: carrinho.id }, transaction });

    // 7. Commit da transação
    await transaction.commit();

    // 8. Retornar o pedido criado (sem os itens, para performance, ou com itens se necessário)
     const pedidoCriado = await Pedido.findByPk(novoPedido.id, {
         include: [{
             model: ItemPedido,
             as: 'itens',
             include: [{ model: Produto, as: 'produto', attributes: ['id', 'nome', 'imagem_url'] }]
         }]
     });

    // TODO: Emitir evento WebSocket para notificar admins/gerentes sobre novo pedido
    // req.app.get('io').to('admin_room').emit('novo_pedido', pedidoCriado);

    res.status(201).json(pedidoCriado);

  } catch (error) {
    await transaction.rollback(); // Rollback em caso de erro
    console.error("Erro ao criar pedido:", error);
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message);
        return res.status(400).json({ message: "Erro de validação", errors: messages });
    }
    res.status(500).json({ message: "Erro interno ao criar pedido.", error: error.message });
  }
};

// Listar pedidos do usuário logado
exports.listarPedidosUsuario = async (req, res) => {
  const usuario_id = req.usuario.id;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Pedido.findAndCountAll({
      where: { usuario_id },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["data_pedido", "DESC"]],
      include: [{
          model: ItemPedido,
          as: 'itens',
          attributes: ['quantidade', 'preco_unitario'], // Apenas info básica dos itens na lista
          include: [{ model: Produto, as: 'produto', attributes: ['id', 'nome', 'imagem_url'] }]
      }]
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      pedidos: rows,
    });

  } catch (error) {
    console.error("Erro ao listar pedidos do usuário:", error);
    res.status(500).json({ message: "Erro interno ao buscar pedidos." });
  }
};

// Obter detalhes de um pedido específico (usuário ou admin/gerente)
exports.obterPedido = async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.usuario.id;
  const userRole = req.usuario.role;

  try {
    const whereClause = { id };
    // Se não for admin/gerente, só pode ver os próprios pedidos
    if (userRole === 'cliente') {
      whereClause.usuario_id = usuario_id;
    }

    const pedido = await Pedido.findOne({
      where: whereClause,
      include: [
        { model: sequelize.models.Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] }, // Inclui dados do usuário
        {
          model: ItemPedido,
          as: 'itens',
          include: [{ model: Produto, as: 'produto' }] // Inclui detalhes completos do produto
        }
      ]
    });

    if (!pedido) {
      return res.status(404).json({ message: "Erro: Pedido não encontrado ou acesso não permitido." });
    }

    res.status(200).json(pedido);

  } catch (error) {
    console.error("Erro ao obter pedido:", error);
    res.status(500).json({ message: "Erro interno ao buscar pedido." });
  }
};

// Atualizar status de um pedido (admin/gerente)
exports.atualizarStatusPedido = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatus = ["pendente", "processando", "enviado", "entregue", "cancelado"];

  if (!status || !validStatus.includes(status)) {
    return res.status(400).json({ message: `Erro: Status inválido. Status permitidos: ${validStatus.join(', ')}` });
  }

  const transaction = await sequelize.transaction();

  try {
    const pedido = await Pedido.findByPk(id, { transaction });

    if (!pedido) {
      await transaction.rollback();
      return res.status(404).json({ message: "Erro: Pedido não encontrado." });
    }

    // Lógica adicional: Se cancelar um pedido, reverter estoque?
    if (status === 'cancelado' && pedido.status !== 'cancelado') {
        const itens = await ItemPedido.findAll({ where: { pedido_id: id }, transaction });
        const estoquePromises = itens.map(item =>
            Produto.update(
                { estoque: sequelize.literal(`estoque + ${item.quantidade}`) },
                { where: { id: item.produto_id }, transaction }
            )
        );
        await Promise.all(estoquePromises);
    } // TODO: Considerar o caso de reverter um cancelamento?

    pedido.status = status;
    await pedido.save({ transaction });

    await transaction.commit();

    // TODO: Emitir evento WebSocket para notificar o cliente sobre a atualização do status
    // req.app.get('io').to(pedido.usuario_id.toString()).emit('status_pedido_atualizado', { pedidoId: pedido.id, status });

    res.status(200).json(pedido);

  } catch (error) {
    await transaction.rollback();
    console.error("Erro ao atualizar status do pedido:", error);
    res.status(500).json({ message: "Erro interno ao atualizar status do pedido." });
  }
};


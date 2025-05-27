const { Carrinho, ItemCarrinho, Produto, sequelize } = require("../models");

// Obter o carrinho do usuário logado
exports.obterCarrinho = async (req, res) => {
  const usuario_id = req.usuario.id;

  try {
    const carrinho = await Carrinho.findOne({
      where: { usuario_id },
      include: [{
        model: ItemCarrinho,
        as: "itens",
        include: [{
          model: Produto,
          as: "produto", // Inclui detalhes do produto em cada item
          attributes: ["id", "nome", "preco", "imagem_url"], // Seleciona campos específicos
        }],
      }],
      order: [["itens", "createdAt", "ASC"]], // Ordena os itens pela data de adição
    });

    if (!carrinho) {
      // Se o usuário não tem carrinho, podemos retornar um carrinho vazio ou criar um?
      // Por segurança e consistência, vamos retornar um estado vazio.
      return res.status(200).json({ id: null, usuario_id, itens: [] });
      // Alternativa: Criar carrinho se não existir
      // const novoCarrinho = await Carrinho.create({ usuario_id });
      // return res.status(200).json({ ...novoCarrinho.toJSON(), itens: [] });
    }

    res.status(200).json(carrinho);

  } catch (error) {
    console.error("Erro ao obter carrinho:", error);
    res.status(500).json({ message: "Erro interno ao buscar carrinho." });
  }
};

// Adicionar item ao carrinho
exports.adicionarItem = async (req, res) => {
  const usuario_id = req.usuario.id;
  const { produto_id, quantidade = 1 } = req.body;

  if (!produto_id || quantidade < 1) {
    return res.status(400).json({ message: "Erro: ID do produto e quantidade (mínimo 1) são obrigatórios." });
  }

  try {
    // Encontrar ou criar o carrinho do usuário
    let [carrinho, criado] = await Carrinho.findOrCreate({
      where: { usuario_id },
      defaults: { usuario_id },
    });

    // Verificar se o produto existe e tem estoque
    const produto = await Produto.findByPk(produto_id);
    if (!produto) {
      return res.status(404).json({ message: "Erro: Produto não encontrado." });
    }
    if (produto.estoque < quantidade) {
        return res.status(400).json({ message: `Erro: Estoque insuficiente para ${produto.nome}. Disponível: ${produto.estoque}` });
    }

    // Verificar se o item já existe no carrinho
    let itemCarrinho = await ItemCarrinho.findOne({
      where: {
        carrinho_id: carrinho.id,
        produto_id: produto_id,
      },
    });

    if (itemCarrinho) {
      // Se existe, atualiza a quantidade
      const novaQuantidade = itemCarrinho.quantidade + quantidade;
       if (produto.estoque < novaQuantidade) {
           return res.status(400).json({ message: `Erro: Estoque insuficiente para adicionar mais ${quantidade} unidade(s) de ${produto.nome}. Disponível: ${produto.estoque}, No carrinho: ${itemCarrinho.quantidade}` });
       }
      itemCarrinho.quantidade = novaQuantidade;
      // Opcional: Atualizar preço unitário se ele mudou? Geralmente não.
      await itemCarrinho.save();
    } else {
      // Se não existe, cria um novo item
      itemCarrinho = await ItemCarrinho.create({
        carrinho_id: carrinho.id,
        produto_id: produto_id,
        quantidade: quantidade,
        preco_unitario: produto.preco, // Salva o preço no momento da adição
      });
    }

    // Retornar o carrinho atualizado
    const carrinhoAtualizado = await Carrinho.findByPk(carrinho.id, {
       include: [{
        model: ItemCarrinho,
        as: "itens",
        include: [{
          model: Produto,
          as: "produto",
          attributes: ["id", "nome", "preco", "imagem_url"],
        }],
      }],
      order: [["itens", "createdAt", "ASC"]],
    });

    res.status(200).json(carrinhoAtualizado);

  } catch (error) {
    console.error("Erro ao adicionar item ao carrinho:", error);
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message);
        return res.status(400).json({ message: "Erro de validação", errors: messages });
    }
    res.status(500).json({ message: "Erro interno ao adicionar item ao carrinho." });
  }
};

// Atualizar quantidade de um item no carrinho
exports.atualizarItem = async (req, res) => {
  const usuario_id = req.usuario.id;
  const { item_id } = req.params; // ID do ItemCarrinho
  const { quantidade } = req.body;

  if (quantidade === undefined || quantidade < 0) {
    return res.status(400).json({ message: "Erro: Quantidade inválida. Deve ser 0 ou maior." });
  }

  try {
    const itemCarrinho = await ItemCarrinho.findByPk(item_id, {
      include: [
          { model: Carrinho, as: 'carrinho', where: { usuario_id } }, // Garante que o item pertence ao usuário
          { model: Produto, as: 'produto' } // Para verificar estoque
      ]
    });

    if (!itemCarrinho) {
      return res.status(404).json({ message: "Erro: Item não encontrado no carrinho deste usuário." });
    }

    if (quantidade === 0) {
      // Se a quantidade for 0, remove o item
      await itemCarrinho.destroy();
    } else {
      // Verifica estoque antes de atualizar
      if (itemCarrinho.produto.estoque < quantidade) {
          return res.status(400).json({ message: `Erro: Estoque insuficiente para ${itemCarrinho.produto.nome}. Disponível: ${itemCarrinho.produto.estoque}` });
      }
      itemCarrinho.quantidade = quantidade;
      await itemCarrinho.save();
    }

    // Retornar o carrinho atualizado
     const carrinhoAtualizado = await Carrinho.findByPk(itemCarrinho.carrinho.id, {
       include: [{
        model: ItemCarrinho,
        as: "itens",
        include: [{
          model: Produto,
          as: "produto",
          attributes: ["id", "nome", "preco", "imagem_url"],
        }],
      }],
      order: [["itens", "createdAt", "ASC"]],
    });

    res.status(200).json(carrinhoAtualizado);

  } catch (error) {
    console.error("Erro ao atualizar item do carrinho:", error);
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message);
        return res.status(400).json({ message: "Erro de validação", errors: messages });
    }
    res.status(500).json({ message: "Erro interno ao atualizar item do carrinho." });
  }
};

// Remover item do carrinho
exports.removerItem = async (req, res) => {
  const usuario_id = req.usuario.id;
  const { item_id } = req.params; // ID do ItemCarrinho

  try {
    const itemCarrinho = await ItemCarrinho.findOne({
      where: { id: item_id },
      include: [{ model: Carrinho, as: 'carrinho', where: { usuario_id } }] // Garante que o item pertence ao usuário
    });

    if (!itemCarrinho) {
      return res.status(404).json({ message: "Erro: Item não encontrado no carrinho deste usuário." });
    }

    const carrinhoId = itemCarrinho.carrinho.id;
    await itemCarrinho.destroy();

    // Retornar o carrinho atualizado
    const carrinhoAtualizado = await Carrinho.findByPk(carrinhoId, {
       include: [{
        model: ItemCarrinho,
        as: "itens",
        include: [{
          model: Produto,
          as: "produto",
          attributes: ["id", "nome", "preco", "imagem_url"],
        }],
      }],
      order: [["itens", "createdAt", "ASC"]],
    });

    res.status(200).json(carrinhoAtualizado);

  } catch (error) {
    console.error("Erro ao remover item do carrinho:", error);
    res.status(500).json({ message: "Erro interno ao remover item do carrinho." });
  }
};

// Limpar carrinho (remover todos os itens)
exports.limparCarrinho = async (req, res) => {
    const usuario_id = req.usuario.id;

    try {
        const carrinho = await Carrinho.findOne({ where: { usuario_id } });

        if (!carrinho) {
            return res.status(404).json({ message: "Erro: Carrinho não encontrado." });
        }

        // Deleta todos os itens associados a este carrinho
        await ItemCarrinho.destroy({ where: { carrinho_id: carrinho.id } });

        // Retorna o carrinho agora vazio
        res.status(200).json({ id: carrinho.id, usuario_id, itens: [] });

    } catch (error) {
        console.error("Erro ao limpar carrinho:", error);
        res.status(500).json({ message: "Erro interno ao limpar carrinho." });
    }
};


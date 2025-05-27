const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Produto = sequelize.define("Produto", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true, // Ou definir categorias específicas com ENUM
    },
    imagem_url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    estoque: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: true,
        min: 0,
      },
    },
  }, {
    tableName: "produtos",
    timestamps: true, // Adiciona createdAt e updatedAt
  });

  Produto.associate = (models) => {
    Produto.hasMany(models.Avaliacao, { foreignKey: 'produto_id', as: 'avaliacoes' });
    // Associação com ItemCarrinho e ItemPedido será definida nesses modelos
    Produto.belongsToMany(models.Carrinho, { through: models.ItemCarrinho, foreignKey: 'produto_id', as: 'carrinhos' });
    Produto.belongsToMany(models.Pedido, { through: models.ItemPedido, foreignKey: 'produto_id', as: 'pedidos' });
  };

  return Produto;
};

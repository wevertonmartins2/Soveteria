const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ItemCarrinho = sequelize.define("ItemCarrinho", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1, // Must have at least one item
      },
    },
    preco_unitario: { // Store price at the time of adding to cart
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    // Foreign Keys
    carrinho_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'carrinhos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    produto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'produtos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE' // Or SET NULL if product removal shouldn't remove cart item?
    }
  }, {
    tableName: "itens_carrinho",
    timestamps: true,
    // Ensure a product appears only once per cart
    indexes: [
      {
        unique: true,
        fields: ["carrinho_id", "produto_id"],
      },
    ],
  });

  ItemCarrinho.associate = (models) => {
    ItemCarrinho.belongsTo(models.Carrinho, { foreignKey: 'carrinho_id', as: 'carrinho' });
    ItemCarrinho.belongsTo(models.Produto, { foreignKey: 'produto_id', as: 'produto' });
  };

  return ItemCarrinho;
};

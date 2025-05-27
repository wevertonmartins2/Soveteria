const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ItemPedido = sequelize.define("ItemPedido", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    preco_unitario: { // Store price at the time of order placement
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    // Foreign Keys
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pedidos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE' // If an order is deleted, its items are also deleted
    },
    produto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'produtos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT' // Prevent product deletion if it exists in an order? Or SET NULL?
                          // RESTRICT is safer to maintain order history integrity.
    }
  }, {
    tableName: "itens_pedido",
    timestamps: true, // Adds createdAt and updatedAt
    // Ensure a product appears only once per order (usually not needed, handled by logic)
    // indexes: [
    //   {
    //     unique: true,
    //     fields: ["pedido_id", "produto_id"],
    //   },
    // ],
  });

  ItemPedido.associate = (models) => {
    ItemPedido.belongsTo(models.Pedido, { foreignKey: 'pedido_id', as: 'pedido' });
    ItemPedido.belongsTo(models.Produto, { foreignKey: 'produto_id', as: 'produto' });
  };

  return ItemPedido;
};

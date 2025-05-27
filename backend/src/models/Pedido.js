const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Pedido = sequelize.define("Pedido", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM(
        "pendente",
        "processando",
        "enviado",
        "entregue",
        "cancelado"
      ),
      allowNull: false,
      defaultValue: "pendente",
    },
    endereco_entrega: {
      // Store as JSON or separate fields depending on complexity
      type: DataTypes.JSONB, // Use JSONB for PostgreSQL for better querying
      allowNull: false,
    },
    data_pedido: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    // Foreign Key para Usuario
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE' // Or SET NULL if user deletion shouldn't delete orders
    }
  }, {
    tableName: "pedidos",
    timestamps: true, // Adiciona createdAt e updatedAt
  });

  Pedido.associate = (models) => {
    Pedido.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
    Pedido.belongsToMany(models.Produto, { through: models.ItemPedido, foreignKey: 'pedido_id', as: 'produtos' });
    Pedido.hasMany(models.ItemPedido, { foreignKey: 'pedido_id', as: 'itens' }); // Para acesso direto aos itens
  };

  return Pedido;
};

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Carrinho = sequelize.define("Carrinho", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Foreign Key para Usuario
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Cada usuário tem apenas um carrinho ativo
      references: {
        model: 'usuarios',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    tableName: "carrinhos",
    timestamps: true,
  });

  Carrinho.associate = (models) => {
    Carrinho.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
    Carrinho.belongsToMany(models.Produto, { through: models.ItemCarrinho, foreignKey: 'carrinho_id', as: 'produtos' });
    Carrinho.hasMany(models.ItemCarrinho, { foreignKey: 'carrinho_id', as: 'itens' }); // Para acesso direto aos itens
  };

  return Carrinho;
};

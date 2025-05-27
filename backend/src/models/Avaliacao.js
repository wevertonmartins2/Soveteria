const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Avaliacao = sequelize.define("Avaliacao", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nota: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Foreign Keys serão adicionadas via associações
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios', // Nome da tabela
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE' // Ou SET NULL se preferir manter avaliações anônimas
    },
    produto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'produtos', // Nome da tabela
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    tableName: "avaliacoes",
    timestamps: true,
  });

  Avaliacao.associate = (models) => {
    Avaliacao.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
    Avaliacao.belongsTo(models.Produto, { foreignKey: 'produto_id', as: 'produto' });
  };

  return Avaliacao;
};

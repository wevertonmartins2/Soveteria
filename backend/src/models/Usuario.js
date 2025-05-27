const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
  const Usuario = sequelize.define("Usuario", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    senha_hash: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null for Google login users
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM("cliente", "admin", "gerente"),
      allowNull: false,
      defaultValue: "cliente",
    },
  }, {
    tableName: "usuarios",
    timestamps: true, // Automatically adds createdAt and updatedAt
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.senha_hash) {
          const salt = await bcrypt.genSalt(10);
          usuario.senha_hash = await bcrypt.hash(usuario.senha_hash, salt);
        }
      },
      beforeUpdate: async (usuario) => {
        // Only hash password if it has changed
        if (usuario.changed("senha_hash") && usuario.senha_hash) {
          const salt = await bcrypt.genSalt(10);
          usuario.senha_hash = await bcrypt.hash(usuario.senha_hash, salt);
        }
      },
    },
  });

  // Instance method to compare password
  Usuario.prototype.comparePassword = async function (candidatePassword) {
    if (!this.senha_hash) return false; // No password hash (e.g., Google login)
    return bcrypt.compare(candidatePassword, this.senha_hash);
  };

  // Define associations here if needed (e.g., Usuario.hasMany(models.Pedido))
  Usuario.associate = (models) => {
    Usuario.hasMany(models.Pedido, { foreignKey: 'usuario_id', as: 'pedidos' });
    Usuario.hasMany(models.Avaliacao, { foreignKey: 'usuario_id', as: 'avaliacoes' });
    Usuario.hasOne(models.Carrinho, { foreignKey: 'usuario_id', as: 'carrinho' });
  };


  return Usuario;
};

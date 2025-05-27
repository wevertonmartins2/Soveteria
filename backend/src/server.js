require("dotenv").config();
const { server, io } = require("./app");
const { sequelize } = require("./models"); // Import sequelize instance

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");

    // Sync models (optional, consider using migrations in production)
    await sequelize.sync({ force: true }); // Use { force: true } for development to drop and recreate tables
    // console.log("Modelos sincronizados com o banco de dados.");

    // Start the HTTP server
    server.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV}`);
    });

    // Basic Socket.IO connection listener (example)
    io.on("connection", (socket) => {
      console.log(`Usuário conectado: ${socket.id}`);
      socket.on("disconnect", () => {
        console.log(`Usuário desconectado: ${socket.id}`);
      });
      // TODO: Add more specific socket event listeners here or in ./sockets/index.js
    });

  } catch (error) {
    console.error("Não foi possível conectar ao banco de dados:", error);
    process.exit(1); // Exit process with failure
  }
};

startServer();

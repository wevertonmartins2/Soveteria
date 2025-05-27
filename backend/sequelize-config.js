require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      // Add SSL options if required by Render PostgreSQL
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false // Adjust as needed
      // }
    }
  },
  test: {
    // Configuration for test environment (e.g., SQLite or separate test DB)
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST || 'sorveteria_db_test',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'postgres',
  },
  production: {
    // Render provides DATABASE_URL
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Render requires this
      }
    }
  }
};

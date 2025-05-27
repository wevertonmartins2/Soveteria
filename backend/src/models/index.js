
"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
// Use the sequelize-config.js file for configuration
const config = require(__dirname + "/../../sequelize-config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  // For production (e.g., Render using DATABASE_URL)
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // For development or test environments
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Load all model files from the current directory
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach(file => {
    // Import the model definition function
    const modelDefinition = require(path.join(__dirname, file));
    // Call the function with sequelize and DataTypes
    const model = modelDefinition(sequelize, Sequelize.DataTypes);
    // Add the initialized model to the db object
    db[model.name] = model;
  });

// Set up associations between models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the sequelize instance and the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


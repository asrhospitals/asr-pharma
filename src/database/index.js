"use strict";

require('dotenv').config();
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];

console.log(`🔧 Database Configuration for ${env}:`, {
  host: config.host,
  port: config.port,
  database: config.database,
  username: config.username,
  dialect: config.dialect
});

const db = {};

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

fs.readdirSync(path.join(__dirname, "../models"))
  .filter((file) =>
    file.endsWith(".js") && file !== basename && !file.endsWith(".test.js")
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, "../models", file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

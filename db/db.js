/// Currently Server is running on localhost:5432

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('pharmacyDb', 'postgres', 'Postgres123', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
  });

  module.exports = sequelize;
 
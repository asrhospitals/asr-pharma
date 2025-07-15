/// Currently Server is running on localhost:5432
require('dotenv').config();
const { Sequelize } = require('sequelize');


// const sequelize = new Sequelize('pharmacyDb', 'postgres', 'Postgres123', {
//     host: 'localhost',
//     dialect: 'postgres',
//     port: 5432,
//   });

  const sequelize= new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
});

  module.exports = sequelize;
 
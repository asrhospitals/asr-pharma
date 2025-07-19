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

  sequelize.sync({ alter: true })
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch((err) => {
    console.error('Error synchronizing models:', err);
  });

  module.exports = sequelize;
 
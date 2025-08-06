require('dotenv').config();
module.exports = {
  development: {
    username: "postgres",
    password: "Parivesh@09",
    database: "pharmacydb",
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    logging: false,
  },
  test: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "Parivesh@09",
    database: process.env.DB_NAME || "pharmacydb",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USER || "pharmacyuser",
    password: process.env.DB_PASSWORD || "pharmacypassword",
    database: process.env.DB_NAME || "pharmacydb",
    host: process.env.DB_HOST || "213.210.37.3",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
  },
};

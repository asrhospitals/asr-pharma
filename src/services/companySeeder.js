const seedSalesMasters = require("./seeders/SalesMastersSeeder");
const seedGroups = require("./seeders/groupSeeder");
const seedLedgers = require("./seeders/ledgerSeeder");
const seedPurchaseMasters = require("./seeders/purchaseSeeder");

async function seedCompanyDefaults(sequelize, companyId, transaction) {
  await seedGroups(sequelize, companyId, transaction);
  await seedLedgers(sequelize, companyId, transaction);
  await seedSalesMasters(sequelize, companyId, transaction);
  await seedPurchaseMasters(sequelize, companyId, transaction);
}

module.exports = { seedCompanyDefaults };

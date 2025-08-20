const { seedGroups } = require("./seeders/groupSeeder");
const seedLedgers = require("./seeders/ledgerSeeder");

async function seedCompanyDefaults(sequelize, companyId) {
  await seedGroups(sequelize, companyId);
  await seedLedgers(sequelize, companyId);
}

module.exports = { seedCompanyDefaults };
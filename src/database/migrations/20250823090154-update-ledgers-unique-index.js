"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeIndex("ledgers", "unique_ledger_name_per_company").catch(() => {
      console.log("Index unique_ledger_name_per_company does not exist, skipping...");
    });

    await queryInterface.addIndex("ledgers", ["companyId", "ledgerName"], {
      unique: true,
      name: "unique_ledger_name_per_company"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("ledgers", "unique_ledger_name_per_company");
  }
};

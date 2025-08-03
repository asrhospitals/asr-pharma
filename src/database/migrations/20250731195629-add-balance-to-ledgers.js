'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ledgers', 'balance', {
      type: Sequelize.DECIMAL(15, 2),
      defaultValue: 0.00,
      comment: 'Balance of the ledger'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ledgers', 'balance');
  }
};

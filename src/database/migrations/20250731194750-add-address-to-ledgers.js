'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ledgers', 'address', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Address of the ledger (for parties)'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ledgers', 'address');
  }
};

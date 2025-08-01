'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ledgers', 'station', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'stations',
        key: 'id'
      },
      comment: 'Station of the ledger'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ledgers', 'station');
  }
};

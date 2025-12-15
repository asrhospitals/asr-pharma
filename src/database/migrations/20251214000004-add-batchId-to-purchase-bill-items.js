'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('purchase_bill_items', 'batchId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'batches',
        key: 'id'
      },
      onDelete: 'SET NULL'
    });

    await queryInterface.addIndex('purchase_bill_items', ['batchId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('purchase_bill_items', 'batchId');
  }
};

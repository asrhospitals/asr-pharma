'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BillItems', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      billId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Bills', key: 'id' },
      },
      itemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'items', key: 'id' },
      },
      product: { type: Sequelize.STRING },
      packing: { type: Sequelize.STRING },
      batch: { type: Sequelize.STRING },
      expDate: { type: Sequelize.DATEONLY },
      unit1: { type: Sequelize.STRING },
      unit2: { type: Sequelize.STRING },
      rate: { type: Sequelize.DECIMAL(10, 2) },
      discount: { type: Sequelize.DECIMAL(5, 2) },
      amount: { type: Sequelize.DECIMAL(10, 2) },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BillItems');
  }
};

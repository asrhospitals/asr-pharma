'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Add missing fields to Bills table
      const billsColumns = await queryInterface.describeTable('Bills', { transaction });
      
      if (!billsColumns.igstPercent) {
        await queryInterface.addColumn('Bills', 'igstPercent', {
          type: Sequelize.DECIMAL(5, 2),
          defaultValue: 0,
        }, { transaction });
      }
      
      if (!billsColumns.igstAmount) {
        await queryInterface.addColumn('Bills', 'igstAmount', {
          type: Sequelize.DECIMAL(10, 2),
          defaultValue: 0,
        }, { transaction });
      }
      
      if (!billsColumns.cessPercent) {
        await queryInterface.addColumn('Bills', 'cessPercent', {
          type: Sequelize.DECIMAL(5, 2),
          defaultValue: 0,
        }, { transaction });
      }
      
      if (!billsColumns.cessAmount) {
        await queryInterface.addColumn('Bills', 'cessAmount', {
          type: Sequelize.DECIMAL(10, 2),
          defaultValue: 0,
        }, { transaction });
      }
      
      if (!billsColumns.totalTaxAmount) {
        await queryInterface.addColumn('Bills', 'totalTaxAmount', {
          type: Sequelize.DECIMAL(12, 2),
          defaultValue: 0,
        }, { transaction });
      }

      // Add missing fields to BillItems table
      const billItemsColumns = await queryInterface.describeTable('BillItems', { transaction });
      
      if (!billItemsColumns.igstPercent) {
        await queryInterface.addColumn('BillItems', 'igstPercent', {
          type: Sequelize.DECIMAL(5, 2),
          defaultValue: 0,
        }, { transaction });
      }
      
      if (!billItemsColumns.igstAmount) {
        await queryInterface.addColumn('BillItems', 'igstAmount', {
          type: Sequelize.DECIMAL(10, 2),
          defaultValue: 0,
        }, { transaction });
      }
      
      if (!billItemsColumns.cessPercent) {
        await queryInterface.addColumn('BillItems', 'cessPercent', {
          type: Sequelize.DECIMAL(5, 2),
          defaultValue: 0,
        }, { transaction });
      }
      
      if (!billItemsColumns.cessAmount) {
        await queryInterface.addColumn('BillItems', 'cessAmount', {
          type: Sequelize.DECIMAL(10, 2),
          defaultValue: 0,
        }, { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Remove fields from Bills table
      const billsColumns = await queryInterface.describeTable('Bills', { transaction });
      
      if (billsColumns.igstPercent) {
        await queryInterface.removeColumn('Bills', 'igstPercent', { transaction });
      }
      if (billsColumns.igstAmount) {
        await queryInterface.removeColumn('Bills', 'igstAmount', { transaction });
      }
      if (billsColumns.cessPercent) {
        await queryInterface.removeColumn('Bills', 'cessPercent', { transaction });
      }
      if (billsColumns.cessAmount) {
        await queryInterface.removeColumn('Bills', 'cessAmount', { transaction });
      }
      if (billsColumns.totalTaxAmount) {
        await queryInterface.removeColumn('Bills', 'totalTaxAmount', { transaction });
      }

      // Remove fields from BillItems table
      const billItemsColumns = await queryInterface.describeTable('BillItems', { transaction });
      
      if (billItemsColumns.igstPercent) {
        await queryInterface.removeColumn('BillItems', 'igstPercent', { transaction });
      }
      if (billItemsColumns.igstAmount) {
        await queryInterface.removeColumn('BillItems', 'igstAmount', { transaction });
      }
      if (billItemsColumns.cessPercent) {
        await queryInterface.removeColumn('BillItems', 'cessPercent', { transaction });
      }
      if (billItemsColumns.cessAmount) {
        await queryInterface.removeColumn('BillItems', 'cessAmount', { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

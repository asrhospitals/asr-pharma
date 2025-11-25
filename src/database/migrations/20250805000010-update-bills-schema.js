'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Update Bills table
      await queryInterface.addColumn('Bills', 'paymentStatus', {
        type: Sequelize.ENUM('Unpaid', 'Partial', 'Paid'),
        defaultValue: 'Unpaid',
      }, { transaction });

      await queryInterface.addColumn('Bills', 'subtotal', {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('Bills', 'itemDiscount', {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('Bills', 'billDiscountPercent', {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('Bills', 'billDiscountAmount', {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('Bills', 'cgstPercent', {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('Bills', 'cgstAmount', {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('Bills', 'sgstPercent', {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('Bills', 'sgstAmount', {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('Bills', 'totalAmount', {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('Bills', 'paidAmount', {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('Bills', 'dueAmount', {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('Bills', 'notes', {
        type: Sequelize.TEXT,
      }, { transaction });

      await queryInterface.addColumn('Bills', 'createdBy', {
        type: Sequelize.UUID,
      }, { transaction });

      await queryInterface.addColumn('Bills', 'updatedBy', {
        type: Sequelize.UUID,
      }, { transaction });

      // Update BillItems table
      await queryInterface.changeColumn('BillItems', 'billId', {
        type: Sequelize.UUID,
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('BillItems', 'itemId', {
        type: Sequelize.UUID,
      }, { transaction });

      await queryInterface.addColumn('BillItems', 'mrp', {
        type: Sequelize.DECIMAL(10, 2),
      }, { transaction });

      await queryInterface.addColumn('BillItems', 'quantity', {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 1,
      }, { transaction });

      await queryInterface.addColumn('BillItems', 'discountPercent', {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('BillItems', 'discountAmount', {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('BillItems', 'cgstPercent', {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('BillItems', 'cgstAmount', {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('BillItems', 'sgstPercent', {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('BillItems', 'sgstAmount', {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Revert Bills table changes
      await queryInterface.removeColumn('Bills', 'paymentStatus', { transaction });
      await queryInterface.removeColumn('Bills', 'subtotal', { transaction });
      await queryInterface.removeColumn('Bills', 'itemDiscount', { transaction });
      await queryInterface.removeColumn('Bills', 'billDiscountPercent', { transaction });
      await queryInterface.removeColumn('Bills', 'billDiscountAmount', { transaction });
      await queryInterface.removeColumn('Bills', 'cgstPercent', { transaction });
      await queryInterface.removeColumn('Bills', 'cgstAmount', { transaction });
      await queryInterface.removeColumn('Bills', 'sgstPercent', { transaction });
      await queryInterface.removeColumn('Bills', 'sgstAmount', { transaction });
      await queryInterface.removeColumn('Bills', 'totalAmount', { transaction });
      await queryInterface.removeColumn('Bills', 'paidAmount', { transaction });
      await queryInterface.removeColumn('Bills', 'dueAmount', { transaction });
      await queryInterface.removeColumn('Bills', 'notes', { transaction });
      await queryInterface.removeColumn('Bills', 'createdBy', { transaction });
      await queryInterface.removeColumn('Bills', 'updatedBy', { transaction });

      // Revert BillItems table changes
      await queryInterface.removeColumn('BillItems', 'mrp', { transaction });
      await queryInterface.removeColumn('BillItems', 'quantity', { transaction });
      await queryInterface.removeColumn('BillItems', 'discountPercent', { transaction });
      await queryInterface.removeColumn('BillItems', 'discountAmount', { transaction });
      await queryInterface.removeColumn('BillItems', 'cgstPercent', { transaction });
      await queryInterface.removeColumn('BillItems', 'cgstAmount', { transaction });
      await queryInterface.removeColumn('BillItems', 'sgstPercent', { transaction });
      await queryInterface.removeColumn('BillItems', 'sgstAmount', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

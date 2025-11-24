'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Update bills table
      await queryInterface.addColumn('bills', 'userCompanyId', {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      }, { transaction });

      await queryInterface.changeColumn('bills', 'status', {
        type: Sequelize.ENUM('Draft', 'Paid', 'Pending', 'Cancelled'),
        defaultValue: 'Draft',
      }, { transaction });

      await queryInterface.addColumn('bills', 'paymentStatus', {
        type: Sequelize.ENUM('Unpaid', 'Partial', 'Paid'),
        defaultValue: 'Unpaid',
      }, { transaction });

      await queryInterface.addColumn('bills', 'subtotal', {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('bills', 'itemDiscount', {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('bills', 'billDiscountPercent', {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('bills', 'billDiscountAmount', {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('bills', 'cgstPercent', {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('bills', 'cgstAmount', {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('bills', 'sgstPercent', {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('bills', 'sgstAmount', {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('bills', 'totalAmount', {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('bills', 'paidAmount', {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('bills', 'dueAmount', {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('bills', 'notes', {
        type: Sequelize.TEXT,
      }, { transaction });

      await queryInterface.addColumn('bills', 'createdBy', {
        type: Sequelize.UUID,
      }, { transaction });

      await queryInterface.addColumn('bills', 'updatedBy', {
        type: Sequelize.UUID,
      }, { transaction });

      await queryInterface.addColumn('bills', 'createdAt', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }, { transaction });

      await queryInterface.addColumn('bills', 'updatedAt', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }, { transaction });

      // Update billItems table
      await queryInterface.changeColumn('billItems', 'billId', {
        type: Sequelize.UUID,
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('billItems', 'itemId', {
        type: Sequelize.UUID,
      }, { transaction });

      await queryInterface.addColumn('billItems', 'mrp', {
        type: Sequelize.DECIMAL(10, 2),
      }, { transaction });

      await queryInterface.addColumn('billItems', 'quantity', {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 1,
      }, { transaction });

      await queryInterface.addColumn('billItems', 'discountPercent', {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('billItems', 'discountAmount', {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('billItems', 'cgstPercent', {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('billItems', 'cgstAmount', {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('billItems', 'sgstPercent', {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('billItems', 'sgstAmount', {
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
      // Revert bills table changes
      await queryInterface.removeColumn('bills', 'userCompanyId', { transaction });
      await queryInterface.removeColumn('bills', 'paymentStatus', { transaction });
      await queryInterface.removeColumn('bills', 'subtotal', { transaction });
      await queryInterface.removeColumn('bills', 'itemDiscount', { transaction });
      await queryInterface.removeColumn('bills', 'billDiscountPercent', { transaction });
      await queryInterface.removeColumn('bills', 'billDiscountAmount', { transaction });
      await queryInterface.removeColumn('bills', 'cgstPercent', { transaction });
      await queryInterface.removeColumn('bills', 'cgstAmount', { transaction });
      await queryInterface.removeColumn('bills', 'sgstPercent', { transaction });
      await queryInterface.removeColumn('bills', 'sgstAmount', { transaction });
      await queryInterface.removeColumn('bills', 'totalAmount', { transaction });
      await queryInterface.removeColumn('bills', 'paidAmount', { transaction });
      await queryInterface.removeColumn('bills', 'dueAmount', { transaction });
      await queryInterface.removeColumn('bills', 'notes', { transaction });
      await queryInterface.removeColumn('bills', 'createdBy', { transaction });
      await queryInterface.removeColumn('bills', 'updatedBy', { transaction });
      await queryInterface.removeColumn('bills', 'createdAt', { transaction });
      await queryInterface.removeColumn('bills', 'updatedAt', { transaction });

      // Revert billItems table changes
      await queryInterface.removeColumn('billItems', 'mrp', { transaction });
      await queryInterface.removeColumn('billItems', 'quantity', { transaction });
      await queryInterface.removeColumn('billItems', 'discountPercent', { transaction });
      await queryInterface.removeColumn('billItems', 'discountAmount', { transaction });
      await queryInterface.removeColumn('billItems', 'cgstPercent', { transaction });
      await queryInterface.removeColumn('billItems', 'cgstAmount', { transaction });
      await queryInterface.removeColumn('billItems', 'sgstPercent', { transaction });
      await queryInterface.removeColumn('billItems', 'sgstAmount', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

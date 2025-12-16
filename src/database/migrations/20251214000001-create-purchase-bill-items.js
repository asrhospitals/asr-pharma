'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('purchase_bill_items', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      purchaseBillId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'purchase_bills',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      itemId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'items',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      product: {
        type: Sequelize.STRING,
        allowNull: false
      },
      packing: {
        type: Sequelize.STRING,
        allowNull: true
      },
      batch: {
        type: Sequelize.STRING,
        allowNull: true
      },
      expDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      unit1: {
        type: Sequelize.STRING,
        allowNull: true
      },
      unit2: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mrp: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 1
      },
      discountPercent: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      discountAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      igstPercent: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      igstAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      cgstPercent: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      cgstAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      sgstPercent: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      sgstAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      cessPercent: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      cessAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      }
    });

    // Create indexes
    await queryInterface.addIndex('purchase_bill_items', ['purchaseBillId']);
    await queryInterface.addIndex('purchase_bill_items', ['itemId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('purchase_bill_items');
  }
};

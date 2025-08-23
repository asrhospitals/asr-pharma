'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_masters', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      companyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user_companies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key to user_companies table'
      },
      purchaseType: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Type of purchase (e.g., GST Purchase - 12%, GST Purchase - 18%, etc.)'
      },
      localPurchaseLedgerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'ledgers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key to ledgers table for local purchase ledger'
      },
      centralPurchaseLedgerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'ledgers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key to ledgers table for central purchase ledger'
      },
      igstPercentage: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.00,
        comment: 'IGST percentage'
      },
      cgstPercentage: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.00,
        comment: 'CGST percentage'
      },
      sgstPercentage: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.00,
        comment: 'SGST percentage'
      },
      cessPercentage: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.00,
        comment: 'CESS percentage'
      },
      natureOfTransaction: {
        type: Sequelize.ENUM('Sales', 'Purchase'),
        defaultValue: 'Purchase',
        comment: 'Nature of transaction'
      },
      taxability: {
        type: Sequelize.ENUM('Taxable', 'Exempted', 'Nil Rated', 'Zero Rated'),
        defaultValue: 'Taxable',
        comment: 'Taxability status'
      },
      igstLedgerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'ledgers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key to ledgers table for IGST ledger'
      },
      cgstLedgerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'ledgers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key to ledgers table for CGST ledger'
      },
      sgstLedgerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'ledgers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key to ledgers table for SGST ledger'
      },
      cessLedgerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'ledgers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key to ledgers table for CESS ledger'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Whether the purchase master is active'
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Order for display purposes'
      },
      status: {
        type: Sequelize.ENUM('Active', 'Inactive'),
        defaultValue: 'Active'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Description of the purchase master'
      },
      isDefault: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this is a default purchase master'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    
    await queryInterface.addIndex('purchase_masters', ['purchaseType']);
    await queryInterface.addIndex('purchase_masters', ['natureOfTransaction']);
    await queryInterface.addIndex('purchase_masters', ['taxability']);
    await queryInterface.addIndex('purchase_masters', ['isActive']);
    await queryInterface.addIndex('purchase_masters', ['isDefault']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('purchase_masters');
  }
}; 
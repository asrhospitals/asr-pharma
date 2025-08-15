'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('sale_masters', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      salesType: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Type of sale (e.g., GST Sale - 12%, GST Sale - 18%, etc.)'
      },
      localSalesLedgerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ledgers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key to ledgers table for local sales ledger'
      },
      centralSalesLedgerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ledgers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key to ledgers table for central sales ledger'
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
        defaultValue: 'Sales',
        comment: 'Nature of transaction'
      },
      taxability: {
        type: Sequelize.ENUM('Taxable', 'Exempted', 'Nil Rated', 'Zero Rated'),
        defaultValue: 'Taxable',
        comment: 'Taxability status'
      },
      igstLedgerId: {
        type: Sequelize.INTEGER,
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
        type: Sequelize.INTEGER,
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
        type: Sequelize.INTEGER,
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
        type: Sequelize.INTEGER,
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
        comment: 'Whether the sale master is active'
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
        comment: 'Description of the sale master'
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

    await queryInterface.addIndex('sale_masters', ['salesType'], {
      unique: true,
      name: 'sale_masters_salesType_unique'
    });

    await queryInterface.addIndex('sale_masters', ['isActive'], {
      name: 'sale_masters_isActive_index'
    });

    await queryInterface.addIndex('sale_masters', ['status'], {
      name: 'sale_masters_status_index'
    });

    await queryInterface.addIndex('sale_masters', ['taxability'], {
      name: 'sale_masters_taxability_index'
    });

    await queryInterface.addIndex('sale_masters', ['natureOfTransaction'], {
      name: 'sale_masters_natureOfTransaction_index'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('sale_masters');
  }
};

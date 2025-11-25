'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ledgers', {
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
      },
      ledgerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      acgroup: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'groups',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key to groups table'
      },
      openingBalance: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00,
        comment: 'Opening balance of the ledger'
      },
      balanceType: {
        type: Sequelize.ENUM('Debit', 'Credit'),
        defaultValue: 'Debit',
        comment: 'Type of balance (Debit or Credit)'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Description of the ledger'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Whether the ledger is active'
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
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Address of the ledger (for parties)'
      },
      station:{
        type: Sequelize.UUID,
        references: {
          model: 'stations',
          key: 'id'
        },
      },
      balance: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00,
        comment: 'Balance of the ledger'
      }
    });
    
    await queryInterface.addIndex('ledgers', ['acgroup']);
    await queryInterface.addIndex('ledgers', ['isActive']);
    await queryInterface.addIndex('ledgers', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ledgers');
  }
};

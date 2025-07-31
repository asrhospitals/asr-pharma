'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.showAllTables().then(tables => 
      tables.includes('transactions')
    );
    
    if (tableExists) {
      console.log('Table transactions already exists, skipping creation...');
      return;
    }
    
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      voucherNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      voucherDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      voucherType: {
        type: Sequelize.ENUM('Receipt', 'Payment', 'Journal', 'Contra', 'DebitNote', 'CreditNote'),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      debitLedgerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ledgers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      creditLedgerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ledgers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      referenceNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isPosted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      postedDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      status: {
        type: Sequelize.ENUM('Draft', 'Posted', 'Cancelled'),
        defaultValue: 'Draft',
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

    try {
      await queryInterface.addIndex('transactions', ['voucherNumber'], { unique: true });
    } catch (error) {
      console.log('Index on voucherNumber already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('transactions', ['voucherDate']);
    } catch (error) {
      console.log('Index on voucherDate already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('transactions', ['voucherType']);
    } catch (error) {
      console.log('Index on voucherType already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('transactions', ['debitLedgerId']);
    } catch (error) {
      console.log('Index on debitLedgerId already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('transactions', ['creditLedgerId']);
    } catch (error) {
      console.log('Index on creditLedgerId already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('transactions', ['isPosted']);
    } catch (error) {
      console.log('Index on isPosted already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('transactions', ['status']);
    } catch (error) {
      console.log('Index on status already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('transactions', ['createdBy']);
    } catch (error) {
      console.log('Index on createdBy already exists, skipping...');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
}; 
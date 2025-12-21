/**
 * Migration: Add Ledger System Enhancements
 * Adds new columns and configurations for professional ledger management
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Add new columns to ledgers table (only if they don't exist)
      const ledgersTable = await queryInterface.describeTable('ledgers');
      
      if (!ledgersTable.formConfig) {
        await queryInterface.addColumn('ledgers', 'formConfig', {
          type: Sequelize.JSON,
          defaultValue: {
            showOpeningBalance: true,
            showAddress: false,
            showFullDetail: false,
            showBankInfo: false,
            balancingMethod: 0,
            showContact: false,
            showTaxType: false,
            showCreditDays: false,
            showGstInfo: false,
          },
          comment: 'Form configuration for dynamic field rendering',
        });
      }

      if (!ledgersTable.bankName) {
        await queryInterface.addColumn('ledgers', 'bankName', {
          type: Sequelize.STRING,
          allowNull: true,
          comment: 'Bank name for bank accounts',
        });
      }

      if (!ledgersTable.accountNumber) {
        await queryInterface.addColumn('ledgers', 'accountNumber', {
          type: Sequelize.STRING,
          allowNull: true,
          comment: 'Account number for bank accounts',
        });
      }

      if (!ledgersTable.ifscCode) {
        await queryInterface.addColumn('ledgers', 'ifscCode', {
          type: Sequelize.STRING,
          allowNull: true,
          comment: 'IFSC code for bank accounts',
        });
      }

      if (!ledgersTable.creditDays) {
        await queryInterface.addColumn('ledgers', 'creditDays', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          comment: 'Credit days for debtors/creditors',
        });
      }

      if (!ledgersTable.contactPerson) {
        await queryInterface.addColumn('ledgers', 'contactPerson', {
          type: Sequelize.STRING,
          allowNull: true,
          comment: 'Contact person name',
        });
      }

      if (!ledgersTable.mobileNumber) {
        await queryInterface.addColumn('ledgers', 'mobileNumber', {
          type: Sequelize.STRING,
          allowNull: true,
          comment: 'Mobile number for contact',
        });
      }

      // Add new columns to groups table
      const groupsTable = await queryInterface.describeTable('groups');
      
      if (!groupsTable.formConfig) {
        await queryInterface.addColumn('groups', 'formConfig', {
          type: Sequelize.JSON,
          defaultValue: {
            showOpeningBalance: true,
            showAddress: false,
            showFullDetail: false,
            showBankInfo: false,
            balancingMethod: 0,
            showContact: false,
            showTaxType: false,
            showCreditDays: false,
            showGstInfo: false,
          },
          comment: 'Form configuration for dynamic field rendering',
        });
      }

      // Create indexes for better query performance
      try {
        await queryInterface.addIndex('ledgers', ['companyId', 'isActive'], {
          name: 'idx_ledgers_company_active'
        });
      } catch (e) {
        // Index might already exist
      }

      try {
        await queryInterface.addIndex('ledgers', ['balanceType'], {
          name: 'idx_ledgers_balance_type'
        });
      } catch (e) {
        // Index might already exist
      }

      try {
        await queryInterface.addIndex('groups', ['companyId'], {
          name: 'idx_groups_company'
        });
      } catch (e) {
        // Index might already exist
      }

      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove columns from ledgers table
      const ledgersTable = await queryInterface.describeTable('ledgers');
      
      if (ledgersTable.formConfig) {
        await queryInterface.removeColumn('ledgers', 'formConfig');
      }
      if (ledgersTable.bankName) {
        await queryInterface.removeColumn('ledgers', 'bankName');
      }
      if (ledgersTable.accountNumber) {
        await queryInterface.removeColumn('ledgers', 'accountNumber');
      }
      if (ledgersTable.ifscCode) {
        await queryInterface.removeColumn('ledgers', 'ifscCode');
      }
      if (ledgersTable.creditDays) {
        await queryInterface.removeColumn('ledgers', 'creditDays');
      }
      if (ledgersTable.contactPerson) {
        await queryInterface.removeColumn('ledgers', 'contactPerson');
      }
      if (ledgersTable.mobileNumber) {
        await queryInterface.removeColumn('ledgers', 'mobileNumber');
      }

      // Remove column from groups table
      const groupsTable = await queryInterface.describeTable('groups');
      if (groupsTable.formConfig) {
        await queryInterface.removeColumn('groups', 'formConfig');
      }

      // Remove indexes
      try {
        await queryInterface.removeIndex('ledgers', 'idx_ledgers_company_active');
      } catch (e) {
        // Index might not exist
      }

      try {
        await queryInterface.removeIndex('ledgers', 'idx_ledgers_balance_type');
      } catch (e) {
        // Index might not exist
      }

      try {
        await queryInterface.removeIndex('groups', 'idx_groups_company');
      } catch (e) {
        // Index might not exist
      }

      console.log('Migration rollback completed successfully');
    } catch (error) {
      console.error('Migration rollback failed:', error);
      throw error;
    }
  },
};

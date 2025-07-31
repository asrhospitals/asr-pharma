'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('group_permissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'groups',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      // Ledger permissions
      canCreateLedger: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Can create ledgers under this group'
      },
      canEditLedger: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Can edit ledgers under this group'
      },
      canDeleteLedger: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Can delete ledgers under this group'
      },
      canViewLedger: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Can view ledgers under this group'
      },
      // Transaction permissions
      canCreateTransaction: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Can create transactions for ledgers in this group'
      },
      canEditTransaction: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Can edit transactions for ledgers in this group'
      },
      canDeleteTransaction: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Can delete transactions for ledgers in this group'
      },
      canViewTransaction: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Can view transactions for ledgers in this group'
      },
      // Report permissions
      canViewReport: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Can view reports for this group'
      },
      canExportReport: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Can export reports for this group'
      },
      // Balance permissions
      canViewBalance: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Can view balance for ledgers in this group'
      },
      canModifyBalance: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Can modify opening balance for ledgers in this group'
      },
      // Opening balance permissions
      canSetOpeningBalance: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Can set opening balance for ledgers in this group'
      },
      // Group management permissions
      canCreateSubGroup: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Can create sub-groups under this group'
      },
      canEditGroup: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Can edit this group'
      },
      canDeleteGroup: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Can delete this group'
      },
      // Special permissions
      isRestricted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this group has restricted access'
      },
      restrictionReason: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Reason for restriction if any'
      },
      effectiveFrom: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When these permissions become effective'
      },
      effectiveTo: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When these permissions expire'
      },
      status: {
        type: Sequelize.ENUM('Active', 'Inactive', 'Suspended'),
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
      }
    });

    // Add indexes
    await queryInterface.addIndex('group_permissions', ['groupId', 'userId'], {
      unique: true
    });
    await queryInterface.addIndex('group_permissions', ['groupId']);
    await queryInterface.addIndex('group_permissions', ['userId']);
    await queryInterface.addIndex('group_permissions', ['status']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('group_permissions');
  }
};

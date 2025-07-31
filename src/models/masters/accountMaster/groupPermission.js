'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GroupPermission extends Model {
    static associate(models) {
      // Define associations here
      GroupPermission.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
      GroupPermission.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  GroupPermission.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    canCreateLedger: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Can create ledgers under this group'
    },
    canEditLedger: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Can edit ledgers under this group'
    },
    canDeleteLedger: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Can delete ledgers under this group'
    },
    canViewLedger: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Can view ledgers under this group'
    },
    // Transaction permissions
    canCreateTransaction: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Can create transactions for ledgers in this group'
    },
    canEditTransaction: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Can edit transactions for ledgers in this group'
    },
    canDeleteTransaction: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Can delete transactions for ledgers in this group'
    },
    canViewTransaction: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Can view transactions for ledgers in this group'
    },
    // Report permissions
    canViewReport: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Can view reports for this group'
    },
    canExportReport: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Can export reports for this group'
    },
    // Balance permissions
    canViewBalance: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Can view balance for ledgers in this group'
    },
    canModifyBalance: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Can modify opening balance for ledgers in this group'
    },
    // Opening balance permissions
    canSetOpeningBalance: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Can set opening balance for ledgers in this group'
    },
    // Group management permissions
    canCreateSubGroup: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Can create sub-groups under this group'
    },
    canEditGroup: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Can edit this group'
    },
    canDeleteGroup: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Can delete this group'
    },
    // Special permissions
    isRestricted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether this group has restricted access'
    },
    restrictionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reason for restriction if any'
    },
    effectiveFrom: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When these permissions become effective'
    },
    effectiveTo: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When these permissions expire'
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive', 'Suspended'),
      defaultValue: 'Active'
    }
  }, {
    sequelize,
    modelName: 'GroupPermission',
    tableName: 'group_permissions',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['groupId', 'userId']
      },
      {
        fields: ['groupId']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['status']
      }
    ]
  });

  return GroupPermission;
}; 
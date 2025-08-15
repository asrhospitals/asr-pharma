'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ledger extends Model {
    static associate(models) {
      Ledger.belongsTo(models.Group, { 
        foreignKey: 'acgroup', 
        as: 'accountGroup',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }

  Ledger.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ledgerName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    acgroup: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id'
      },
      comment: 'Foreign key to groups table'
    },
    openingBalance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00,
      comment: 'Opening balance of the ledger'
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00,
      comment: 'Balance of the ledger'
    },
    balanceType: {
      type: DataTypes.ENUM('Debit', 'Credit'),
      defaultValue: 'Debit',
      comment: 'Type of balance (Debit or Credit)'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description of the ledger'
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Address of the ledger (for parties)'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether the ledger is active'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Order for display purposes'
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    },
    station:{
      type: DataTypes.INTEGER,
      references: {
        model: 'stations',
        key: 'id'
      },
      comment: 'Station of the ledger'
    },

    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether this is a default system ledger'
    },
    isEditable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether this ledger can be edited'
    },
    isDeletable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether this ledger can be deleted'
    },
    editableFields: {
      type: DataTypes.JSON,
      defaultValue: ['openingBalance', 'balanceType', 'description', 'address', 'isActive', 'status', 'station'],
      comment: 'Array of field names that can be edited for this ledger'
    }
  }, {
    sequelize,
    modelName: 'Ledger',
    tableName: 'ledgers',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['ledgerName']
      },
      {
        fields: ['acgroup']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['status']
      },
      {
        fields: ['isDefault']
      }
    ]
  });

  return Ledger;
}; 
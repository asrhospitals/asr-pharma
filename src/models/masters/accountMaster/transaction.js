'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // Define associations here
      Transaction.belongsTo(models.Ledger, { 
        foreignKey: 'debitLedgerId', 
        as: 'debitLedger',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      
      Transaction.belongsTo(models.Ledger, { 
        foreignKey: 'creditLedgerId', 
        as: 'creditLedger',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      
      Transaction.belongsTo(models.User, { 
        foreignKey: 'createdBy', 
        as: 'creator',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      
      Transaction.belongsTo(models.User, { 
        foreignKey: 'updatedBy', 
        as: 'updater',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }

  Transaction.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    voucherNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      },
      comment: 'Unique voucher number for the transaction'
    },
    voucherDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Date of the transaction'
    },
    voucherType: {
      type: DataTypes.ENUM('Receipt', 'Payment', 'Journal', 'Contra', 'DebitNote', 'CreditNote', 'Purchase', 'Sale'),
      allowNull: false,
      comment: 'Type of voucher'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description of the transaction'
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0.01
      },
      comment: 'Transaction amount'
    },
    debitLedgerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ledgers',
        key: 'id'
      },
      comment: 'Foreign key to debit ledger'
    },
    creditLedgerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ledgers',
        key: 'id'
      },
      comment: 'Foreign key to credit ledger'
    },
    referenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'External reference number'
    },
    isPosted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether the transaction is posted to ledgers'
    },
    postedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date when transaction was posted'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'User who created the transaction'
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'User who last updated the transaction'
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Posted', 'Cancelled'),
      defaultValue: 'Draft',
      comment: 'Status of the transaction'
    }
  }, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['voucherNumber']
      },
      {
        fields: ['voucherDate']
      },
      {
        fields: ['voucherType']
      },
      {
        fields: ['debitLedgerId']
      },
      {
        fields: ['creditLedgerId']
      },
      {
        fields: ['isPosted']
      },
      {
        fields: ['status']
      },
      {
        fields: ['createdBy']
      }
    ],
    hooks: {
      beforeValidate: (transaction) => {
        // Ensure debit and credit ledgers are different
        if (transaction.debitLedgerId === transaction.creditLedgerId) {
          throw new Error('Debit and credit ledgers cannot be the same');
        }
      }
    }
  });

  return Transaction;
}; 
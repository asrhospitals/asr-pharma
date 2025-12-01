'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PurchaseBill extends Model {
    static associate(models) {
      PurchaseBill.hasMany(models.PurchaseBillItem, {
        foreignKey: 'purchaseBillId',
        as: 'billItems',
        onDelete: 'CASCADE'
      });

      PurchaseBill.belongsTo(models.Ledger, {
        foreignKey: 'supplierLedgerId',
        as: 'supplierLedger',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      PurchaseBill.belongsTo(models.PurchaseMaster, {
        foreignKey: 'purchaseMasterId',
        as: 'purchaseMaster',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      PurchaseBill.belongsTo(models.UserCompany, {
        foreignKey: 'userCompanyId',
        as: 'company',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }

  PurchaseBill.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    userCompanyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user_companies',
        key: 'id'
      }
    },
    billNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    billDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    supplierLedgerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ledgers',
        key: 'id'
      }
    },
    supplierInvoiceNo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    supplierInvoiceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    purchaseMasterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'purchase_masters',
        key: 'id'
      }
    },
    subtotal: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    itemDiscount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    billDiscountPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    billDiscountAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    igstPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    igstAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    cgstPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    cgstAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    sgstPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    sgstAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    cessPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    cessAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    totalTaxAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    totalAmount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    paidAmount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    dueAmount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Received', 'Invoiced', 'Cancelled'),
      defaultValue: 'Draft'
    },
    paymentStatus: {
      type: DataTypes.ENUM('Unpaid', 'Partial', 'Paid'),
      defaultValue: 'Unpaid'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    referenceNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'PurchaseBill',
    tableName: 'purchase_bills',
    timestamps: true,
    indexes: [
      { fields: ['billNo'], unique: true },
      { fields: ['userCompanyId'] },
      { fields: ['supplierLedgerId'] },
      { fields: ['billDate'] },
      { fields: ['status'] },
      { fields: ['paymentStatus'] }
    ]
  });

  return PurchaseBill;
};

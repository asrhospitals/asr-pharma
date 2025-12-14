'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PurchaseBillItem extends Model {
    static associate(models) {
      PurchaseBillItem.belongsTo(models.PurchaseBill, {
        foreignKey: 'purchaseBillId',
        as: 'bill'
      });

      PurchaseBillItem.belongsTo(models.Item, {
        foreignKey: 'itemId',
        as: 'item'
      });

      PurchaseBillItem.belongsTo(models.Batch, {
        foreignKey: 'batchId',
        as: 'batch'
      });
    }
  }

  PurchaseBillItem.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    purchaseBillId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'purchase_bills',
        key: 'id'
      }
    },
    itemId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'items',
        key: 'id'
      }
    },
    batchId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'batches',
        key: 'id'
      }
    },
    product: {
      type: DataTypes.STRING,
      allowNull: false
    },
    packing: {
      type: DataTypes.STRING,
      allowNull: true
    },
    batch: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    unit1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    unit2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mrp: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 1
    },
    discountPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    igstPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    igstAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    cgstPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    cgstAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    sgstPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    sgstAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    cessPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    cessAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PurchaseBillItem',
    tableName: 'purchase_bill_items',
    timestamps: false,
    indexes: [
      { fields: ['purchaseBillId'] },
      { fields: ['itemId'] }
    ]
  });

  return PurchaseBillItem;
};

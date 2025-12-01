'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class BillItem extends Model {
    static associate(models) {
      BillItem.belongsTo(models.Bill, { 
        foreignKey: "billId"
      });
      BillItem.belongsTo(models.Item, { 
        foreignKey: "itemId"
      });
    }
  }

  BillItem.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    billId: { type: DataTypes.UUID, allowNull: false },
    itemId: { type: DataTypes.UUID },
    product: { type: DataTypes.STRING },
    packing: { type: DataTypes.STRING },
    batch: { type: DataTypes.STRING },
    expDate: { type: DataTypes.DATEONLY },
    unit1: { type: DataTypes.STRING },
    unit2: { type: DataTypes.STRING },
    mrp: { type: DataTypes.DECIMAL(10, 2) },
    rate: { type: DataTypes.DECIMAL(10, 2) },
    quantity: { type: DataTypes.DECIMAL(10, 2), defaultValue: 1 },
    discountPercent: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    discountAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    cgstPercent: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    cgstAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    sgstPercent: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    sgstAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    amount: { type: DataTypes.DECIMAL(10, 2) },
  }, {
    timestamps: false,
    sequelize,
    modelName: "BillItem",
    tableName: "BillItems",
  });

  return BillItem;
}; 
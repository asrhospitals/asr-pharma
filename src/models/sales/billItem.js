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
    billId: { type: DataTypes.INTEGER, allowNull: false },
    itemId: { type: DataTypes.INTEGER, allowNull: false },
    product: { type: DataTypes.STRING },
    packing: { type: DataTypes.STRING },
    batch: { type: DataTypes.STRING },
    expDate: { type: DataTypes.DATEONLY },
    unit1: { type: DataTypes.STRING },
    unit2: { type: DataTypes.STRING },
    rate: { type: DataTypes.DECIMAL(10, 2) },
    discount: { type: DataTypes.DECIMAL(5, 2) },
    amount: { type: DataTypes.DECIMAL(10, 2) },
  }, {
    timestamps: false,
    sequelize,
    modelName: "BillItem",
    tableName: "BillItems",
  });

  return BillItem;
}; 
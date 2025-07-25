'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class BillItem extends Model {
    static associate(models) {
      models.Bill.hasMany(models.BillItem, { foreignKey: "billId", as: "items" });
      BillItem.belongsTo(models.Bill, { foreignKey: "billId" });
      models.Item.hasMany(models.BillItem, { foreignKey: "itemId" });
      BillItem.belongsTo(models.Item, { foreignKey: "itemId" });
    }
  }

  BillItem.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
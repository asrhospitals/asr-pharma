"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Bill extends Model {
    static associate(models) {
      Bill.hasMany(models.BillItem, {
        foreignKey: "billId",
        as: "billItems",
      });
    }
  }

  Bill.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      billNo: { type: DataTypes.STRING, allowNull: false },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      partyName: { type: DataTypes.STRING },
      patientId: { type: DataTypes.STRING },
      patientName: { type: DataTypes.STRING },
      doctorId: { type: DataTypes.STRING },
      doctorName: { type: DataTypes.STRING },
      address: { type: DataTypes.STRING },
      status: { type: DataTypes.STRING },
      amount: { type: DataTypes.DECIMAL(10, 2) },
    },
    {
      timestamps: false,
      sequelize,
      modelName: "Bill",
      tableName: "bills",
    }
  );

  return Bill;
};

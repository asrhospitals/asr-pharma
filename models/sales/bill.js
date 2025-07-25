"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Bill extends Model {
    static associate(models) {
      // define associations here if needed
    }
  }

  Bill.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
      tableName: "Bills",
    }
  );

  return Bill;
}; 
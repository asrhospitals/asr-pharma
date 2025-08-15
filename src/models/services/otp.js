"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    static associate(models) {}
  }

  Otp.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      phone: { type: DataTypes.STRING, allowNull: false },
      otp: { type: DataTypes.STRING, allowNull: false },
      expiry: { type: DataTypes.DATE, allowNull: false },
    },
    {
      timestamps: false,
      sequelize,
      modelName: "Otp",
      tableName: "Otps",
    }
  );

  return Otp;
};

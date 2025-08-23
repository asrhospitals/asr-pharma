"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    static associate(models) {}
  }

  Otp.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      phone: { type: DataTypes.STRING, allowNull: false },
      otp: { type: DataTypes.STRING, allowNull: false },
      expiry: { type: DataTypes.DATE, allowNull: false },
    },
    {
      timestamps: false,
      sequelize,
      modelName: "Otp",
      tableName: "otps",
    }
  );

  return Otp;
};

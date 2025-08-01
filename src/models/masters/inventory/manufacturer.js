"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Manufacturer extends Model {
    static associate(models) {

    }
  }

  Manufacturer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      mfrname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Continue",
        validate: {
          isIn: [["Continue", "Discontinue"]],
        },
      },
      prohabited: {
        type: DataTypes.STRING,
        defaultValue: "No",
        validate: {
          isIn: [["Yes", "No"]],
        },
      },
    },
    {
      sequelize,
      modelName: "Manufacturer",
      tableName: "manufacturers",
      timestamps: false,
    }
  );

  return Manufacturer;
};

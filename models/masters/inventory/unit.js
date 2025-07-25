"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    static associate(models) {
      // define associations here if needed
    }
  }

  Unit.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      unitName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      uqc: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
      sequelize,
      modelName: "Unit",
      tableName: "units",
    }
  );

  return Unit;
};

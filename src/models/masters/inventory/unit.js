"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    static associate(models) {
      Unit.hasMany(models.Item, { as: "ItemsAsUnit1", foreignKey: "unit1" });
      Unit.hasMany(models.Item, { as: "ItemsAsUnit2", foreignKey: "unit2" });
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

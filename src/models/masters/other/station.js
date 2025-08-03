"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Station extends Model {
    static associate(models) {}
  }
  Station.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Station",
      tableName: "stations",
      timestamps: false,
    }
  );

  return Station;
};

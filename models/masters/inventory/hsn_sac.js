'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HsnSac extends Model {
    static associate(models) {
      // define associations here if needed
    }
  }

  HsnSac.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hsnSacCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    hsnsacname: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: "HsnSac",
    tableName: "hsnsac",
    timestamps: false,
  });

  return HsnSac;
};

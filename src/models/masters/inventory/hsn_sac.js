'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HsnSac extends Model {
    static associate(models) {
      HsnSac.hasMany(models.Item, {
        as: "HsnSacItems",
        foreignKey: "hsnsac",
      });
    }
  }

  HsnSac.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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

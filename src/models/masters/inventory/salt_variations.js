"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SaltVariation extends Model {
    static associate(models) {
      SaltVariation.belongsTo(models.Salt, {
        foreignKey: 'salt_id',
        as: 'salt'
      });
    }
  }

  SaltVariation.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true
    },
    str: {
      type: DataTypes.STRING,
    },
    dosage: {
      type: DataTypes.STRING,
    },
    brandname: {
      type: DataTypes.STRING,
    },
    packsize: {
      type: DataTypes.STRING,
    },
    mrp: {
      type: DataTypes.FLOAT,
    },
    dpco: {
      type: DataTypes.STRING,
      defaultValue: "No",
    },
    dpcomrp: {
      type: DataTypes.FLOAT,
    },
    salt_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "salts",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
    sequelize,
    modelName: "SaltVariation",
    tableName: "saltvariations",
  }
);

  return SaltVariation;
};

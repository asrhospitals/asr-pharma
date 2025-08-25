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
    userCompanyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "user_companies",
        key: "id",
      },
    },
    hsnSacCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hsnsacname: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: "HsnSac",
    tableName: "hsnsac",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["userCompanyId", "hsnSacCode"],
        name: "unique_hsnsac_per_user_company",
      },
    ],
  });

  return HsnSac;
};

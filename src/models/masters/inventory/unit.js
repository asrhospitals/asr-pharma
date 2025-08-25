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
      unitName: {
        type: DataTypes.STRING,
        allowNull: false,
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
      indexes: [
        {
          unique: true,
          fields: ["userCompanyId", "unitName"],
          name: "unique_unit_per_user_company",
        },
      ],
    }
  );

  return Unit;
};

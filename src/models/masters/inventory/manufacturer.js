"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Manufacturer extends Model {
    static associate(models) {
      Manufacturer.belongsTo(models.UserCompany, {
        foreignKey: "userCompanyId",
        as: "userCompany"
      });
    }
  }

  Manufacturer.init(
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
      indexes: [
        {
          unique: true,
          fields: ["userCompanyId", "mfrname"],
          name: "unique_mfr_per_user_company",
        },
      ],
    }
  );

  return Manufacturer;
};

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      Company.belongsTo(models.UserCompany, {
        foreignKey: "userCompanyId",
        as: "userCompany",
      });

      Company.hasMany(models.Item, {
        as: "items",
        foreignKey: "company",
      });
    }
  }

  Company.init(
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
      companyname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      printremark: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM("Continue", "Discontinue"),
        defaultValue: "Continue",
      },
      prohibited: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No",
      },
      invoiceprintindex: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      recorderformula: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
      },
      recorderprefrence: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      expiredays: {
        type: DataTypes.INTEGER,
        defaultValue: 90,
      },
      dumpdays: {
        type: DataTypes.INTEGER,
        defaultValue: 60,
      },
      minimummargin: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
      },
      storeroom: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "Company",
      tableName: "companies",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["userCompanyId", "companyname"],
          name: "unique_company_per_user_company",
        },
      ],
    }
  );

  return Company;
};

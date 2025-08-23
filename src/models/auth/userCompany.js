"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserCompany extends Model {
    static associate(models) {
      UserCompany.hasMany(models.Company, {
        as: "companies",
        foreignKey: "userCompanyId",
      });

      UserCompany.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
      });
      
      UserCompany.belongsToMany(models.User, {
        through: "UserCompanyUsers",
        as: "users",
        foreignKey: "userCompanyId",
        otherKey: "userId",
      });

      UserCompany.hasMany(models.Ledger, {
        as: "ledgers",
        foreignKey: "companyId",
      });

      UserCompany.hasMany(models.SaleMaster, {
        as: "saleMasters",
        foreignKey: "companyId",
      });

      UserCompany.hasMany(models.PurchaseMaster, {
        as: "purchaseMasters",
        foreignKey: "companyId",
      });
    }
  }

  UserCompany.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "India",
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pinCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[1-9][0-9]{5}$/,
        },
      },

      branchCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      businessType: {
        type: DataTypes.ENUM(
          "Billing [General]",
          "Chemist [Pharmacy]",
          "Pharma Distribution [Batch]",
          "Automobile",
          "Garment",
          "Mobile Trade",
          "Supermarket/Grocery",
          "Computer Hardware"
        ),
        allowNull: false,
      },
      calendarType: {
        type: DataTypes.ENUM("English", "Hindi", "Gujarati"),
        allowNull: false,
        defaultValue: "English",
      },
      financialYearFrom: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      financialYearTo: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      taxType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "GST",
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[\+]?[1-9][\d]{9,14}$/,
        },
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },

      companyRegType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      panNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },

      logoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("active", "inactive", "suspended"),
        defaultValue: "active",
      },

      companyname: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.companyName;
        },
      },
      printremark: {
        type: DataTypes.STRING,
        allowNull: true,
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
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "UserCompany",
      tableName: "user_companies",
      timestamps: true,
    }
  );

  return UserCompany;
};

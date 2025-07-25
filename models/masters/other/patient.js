"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      // define associations here if needed
    }
  }

  Patient.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      code: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      phone2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
      },
      whatsapp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["Male", "Female", "Other"],
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      patientType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      disease: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      govId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      billDiscount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      ledger: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bloodgroup: {
        type: DataTypes.STRING,
      },
      maritalstatus: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["Active", "Inactive"],
        allowNull: false,
        defaultValue: "Active",
      },
    },
    {
      timestamps: false,
      sequelize,
      modelName: "Patient",
      tableName: "patients",
    }
  );

  return Patient;
};

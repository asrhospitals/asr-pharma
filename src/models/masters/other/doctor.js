"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    static associate(models) {
      // define associations here if needed
    }
  }

  Doctor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mobileNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      registrationNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      hospitalName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      specialization: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      commission: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
      },
      locationCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pinNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      whatsappNo: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: "Doctor",
      tableName: "doctors",
    }
  );

  return Doctor;
};

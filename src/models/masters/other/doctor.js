"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    static associate(models) {
      Doctor.belongsTo(models.UserCompany, {
        foreignKey: "userCompanyId",
        as: "userCompany"
      });
    }
  }

  Doctor.init(
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
      mobileNo: {
        type: DataTypes.STRING,
        allowNull: false,
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
      indexes: [
        {
          unique: true,
          fields: ["userCompanyId", "mobileNo"],
          name: "unique_doctors_mobileNo_userCompanyId",
        }
      ]
    }
  );

  return Doctor;
};

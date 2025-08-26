"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Prescription extends Model {
    static associate(models) {
      Prescription.belongsTo(models.Patient, { foreignKey: "patientId" });
      Prescription.belongsTo(models.Doctor, { foreignKey: "doctorId" });
      Prescription.hasMany(models.PrescriptionItem, {
        foreignKey: "prescriptionId",
      });
      Prescription.belongsTo(models.UserCompany, {
        foreignKey: "userCompanyId",
        as: "userCompany",
      });
    }
  }

  Prescription.init(
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
      presNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      presDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      days: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      admissionDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      dischargeDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      diagnosis: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      oldHistory: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Prescription",
      tableName: "prescriptions",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["userCompanyId", "presNo"],
          name: "unique_userCompanyId_presNo",
        },
      ],
    }
  );

  return Prescription;
};

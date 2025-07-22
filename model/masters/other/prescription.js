const sequelize = require('../../../db/db');
const { DataTypes } = require('sequelize');
const Patient = require('./patient');
const Doctor = require('./doctor');

const Prescription = sequelize.define('prescription', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    presNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    presDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Patient,
            key: 'id',
        },
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Doctor,
            key: 'id',
        },
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
}, { timestamps: false });

Prescription.belongsTo(Patient, { foreignKey: 'patientId' });
Prescription.belongsTo(Doctor, { foreignKey: 'doctorId' });

module.exports = Prescription; 
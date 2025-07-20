const sequelize= require('../../../db/db');
const { DataTypes } = require('sequelize');

const Patient = sequelize.define('patient', {
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
    email: {
        type: DataTypes.STRING,
    },
    gender: {
        type: DataTypes.ENUM,
        values: ['Male', 'Female', 'Other'],
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
    bloodgroup: {
        type: DataTypes.STRING,
    },
    maritalstatus: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM,
        values: ['Active', 'Inactive'],
        allowNull: false,
        defaultValue: 'Active',
    },
    
}, { timestamps: false });

module.exports = Patient;
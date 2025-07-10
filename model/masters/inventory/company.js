const sequelize= require('../../../db/db');
const { DataTypes } = require('sequelize');

const Company = sequelize.define('company', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    companyname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    printremark: {
        type: DataTypes.STRING,
    },
    status:{
        type:DataTypes.ENUM,
        values: ['Continue', 'Discontinue'],
        defaultValue: 'Continue',
    },
    prohibited: {
        type: DataTypes.ENUM,
        values: ['Yes', 'No'],
        defaultValue: "No",
    },
    invoiceprintindex: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    recorderformula: {
        type: DataTypes.FLOAT,
        defaultValue: 0.00,
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
        defaultValue: 0.00,
    },
    storeroom: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },

    
}, { timestamps: false });

module.exports = Company;
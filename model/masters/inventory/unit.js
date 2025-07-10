const sequelize=require('../../../db/db');
const { DataTypes } = require('sequelize');

const Unit=sequelize.define('unit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    unitName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    uqc: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: false,
});

module.exports = Unit;
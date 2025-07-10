const sequelize=require('../../../db/db');
const { DataTypes } = require('sequelize');

const HsnSac = sequelize.define('hsnsacmaster', {
    hsnSacid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    hsnSacCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        },
    },
    hsnsacname: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: false,
});

module.exports = HsnSac;
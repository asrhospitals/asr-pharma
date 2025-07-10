const sequelize = require('../../../db/db');
const { DataTypes } = require('sequelize');

const Rack = sequelize.define('rackmaster',{
    rackid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    storename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rackname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
    },

},{timestamps: false,});


module.exports = Rack;
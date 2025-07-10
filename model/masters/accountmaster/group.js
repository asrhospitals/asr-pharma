const sequelize = require('../../../db/db');
const { DataTypes } = require('sequelize');

const Group = sequelize.define('groupmaster', {
  id: {    
    type: DataTypes.INTEGER,
    primaryKey: true,   
    autoIncrement: true,
  },
  groupName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  undergroup: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prohabit: {
    type: DataTypes.STRING,
    defaultValue: "No"
  },    
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['groupName']
    }
  ]     
});    
    

module.exports = Group;
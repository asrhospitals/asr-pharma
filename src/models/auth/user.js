'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here if needed
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    pwd: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'manager'),
      allowNull: false
    },
    module: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    fname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isactive: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
  });

  return User;
};

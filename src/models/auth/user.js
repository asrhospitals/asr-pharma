'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      
      User.belongsToMany(models.Company, {
        through: 'UserCompanies',
        as: 'companies',
        foreignKey: 'userId',
        otherKey: 'companyId'
      });
      
      
      User.belongsTo(models.Company, {
        as: 'activeCompany',
        foreignKey: 'activeCompanyId'
      });
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
      type: DataTypes.ENUM('admin', 'manager', 'user'),
      allowNull: false,
      defaultValue: 'user'
    },
    module: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: ['basic']
    },
    fname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[\+]?[1-9][\d]{9,14}$/
      }
    },
    pin: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[1-9][0-9]{5}$/
      }
    },
    isactive: {
      type: DataTypes.ENUM('active', 'inactive', 'pending_verification'),
      allowNull: false,
      defaultValue: 'pending_verification'
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    phoneVerificationCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneVerificationExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    emailVerificationCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailVerificationExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    activeCompanyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id'
      }
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
  });

  return User;
};

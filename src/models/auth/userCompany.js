'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserCompany extends Model {
    static associate(models) {
      
    }
  }

  UserCompany.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    role: {
      type: DataTypes.ENUM('owner', 'admin', 'manager', 'user'),
      allowNull: false,
      defaultValue: 'user'
    },
    permissions: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
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
    modelName: 'UserCompany',
    tableName: 'user_companies',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'companyId']
      }
    ]
  });

  return UserCompany;
}; 
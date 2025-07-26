'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      // Define associations here
      Group.hasMany(models.Ledger, { 
        foreignKey: 'acgroup', 
        as: 'ledgers',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }

  Group.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    groupName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    undergroup: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Parent group name for hierarchy'
    },
    parentGroupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'groups',
        key: 'id'
      }
    },
    groupType: {
      type: DataTypes.ENUM('Asset', 'Liability', 'Income', 'Expense', 'Capital'),
      allowNull: false,
      comment: 'Type of account group'
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether this is a default system group'
    },
    isEditable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether this group can be edited'
    },
    isDeletable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether this group can be deleted'
    },
    prohibit: {
      type: DataTypes.ENUM('Yes', 'No'),
      defaultValue: 'No',
      comment: 'Whether this group is prohibited from certain operations'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Order for display purposes'
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    }
  }, {
    sequelize,
    modelName: 'Group',
    tableName: 'groups',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['groupName']
      },
      {
        fields: ['parentGroupId']
      },
      {
        fields: ['groupType']
      },
      {
        fields: ['isDefault']
      }
    ]
  });

  // Define self-referencing associations after model is defined
  Group.hasMany(Group, { 
    foreignKey: 'parentGroupId', 
    as: 'subGroups',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
  
  Group.belongsTo(Group, { 
    foreignKey: 'parentGroupId', 
    as: 'parentGroup',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });

  return Group;
}; 
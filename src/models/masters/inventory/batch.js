'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Batch extends Model {
    static associate(models) {
      Batch.belongsTo(models.Item, {
        foreignKey: 'itemId',
        as: 'item',
        onDelete: 'CASCADE'
      });

      Batch.belongsTo(models.UserCompany, {
        foreignKey: 'userCompanyId',
        as: 'company',
        onDelete: 'CASCADE'
      });
    }
  }

  Batch.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    userCompanyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user_companies',
        key: 'id'
      }
    },
    itemId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id'
      }
    },
    batchNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    mrp: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    purchaseRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive', 'Expired'),
      defaultValue: 'Active'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Batch',
    tableName: 'batches',
    timestamps: true,
    indexes: [
      { fields: ['itemId'] },
      { fields: ['userCompanyId'] },
      { fields: ['batchNumber'] },
      { fields: ['itemId', 'batchNumber'], unique: true, name: 'unique_batch_per_item' }
    ]
  });

  return Batch;
};

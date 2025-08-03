'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SaleMaster extends Model {
    static associate(models) {
      SaleMaster.belongsTo(models.Ledger, { 
        foreignKey: 'localSalesLedgerId', 
        as: 'localSalesLedger',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      
      SaleMaster.belongsTo(models.Ledger, { 
        foreignKey: 'centralSalesLedgerId', 
        as: 'centralSalesLedger',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      SaleMaster.belongsTo(models.Ledger, { 
        foreignKey: 'igstLedgerId', 
        as: 'igstLedger',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      SaleMaster.belongsTo(models.Ledger, { 
        foreignKey: 'cgstLedgerId', 
        as: 'cgstLedger',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      SaleMaster.belongsTo(models.Ledger, { 
        foreignKey: 'sgstLedgerId', 
        as: 'sgstLedger',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      SaleMaster.belongsTo(models.Ledger, { 
        foreignKey: 'cessLedgerId', 
        as: 'cessLedger',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }

  SaleMaster.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    salesType: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      },
      comment: 'Type of sale (e.g., GST Sale - 12%, GST Sale - 18%, etc.)'
    },
    localSalesLedgerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ledgers',
        key: 'id'
      },
      comment: 'Foreign key to ledgers table for local sales ledger'
    },
    centralSalesLedgerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ledgers',
        key: 'id'
      },
      comment: 'Foreign key to ledgers table for central sales ledger'
    },
    igstPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 100
      },
      comment: 'IGST percentage'
    },
    cgstPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 100
      },
      comment: 'CGST percentage'
    },
    sgstPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 100
      },
      comment: 'SGST percentage'
    },
    cessPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 100
      },
      comment: 'CESS percentage'
    },
    natureOfTransaction: {
      type: DataTypes.ENUM('Sales', 'Purchase'),
      defaultValue: 'Sales',
      comment: 'Nature of transaction'
    },
    taxability: {
      type: DataTypes.ENUM('Taxable', 'Exempted', 'Nil Rated', 'Zero Rated'),
      defaultValue: 'Taxable',
      comment: 'Taxability status'
    },
    igstLedgerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ledgers',
        key: 'id'
      },
      comment: 'Foreign key to ledgers table for IGST ledger'
    },
    cgstLedgerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ledgers',
        key: 'id'
      },
      comment: 'Foreign key to ledgers table for CGST ledger'
    },
    sgstLedgerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ledgers',
        key: 'id'
      },
      comment: 'Foreign key to ledgers table for SGST ledger'
    },
    cessLedgerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ledgers',
        key: 'id'
      },
      comment: 'Foreign key to ledgers table for CESS ledger'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether the sale master is active'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Order for display purposes'
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description of the sale master'
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Whether this is a default sale master that cannot be deleted or edited'
    }
  }, {
    sequelize,
    modelName: 'SaleMaster',
    tableName: 'sale_masters',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['salesType']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['status']
      },
      {
        fields: ['taxability']
      },
      {
        fields: ['natureOfTransaction']
      }
    ]
  });

  return SaleMaster;
}; 
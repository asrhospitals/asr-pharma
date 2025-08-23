const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PurchaseMaster extends Model {
    static associate(models) {
      PurchaseMaster.belongsTo(models.Ledger, {
        foreignKey: 'localPurchaseLedgerId',
        as: 'localPurchaseLedger',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      PurchaseMaster.belongsTo(models.Ledger, {
        foreignKey: 'centralPurchaseLedgerId',
        as: 'centralPurchaseLedger',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      PurchaseMaster.belongsTo(models.Ledger, {
        foreignKey: 'igstLedgerId',
        as: 'igstLedger',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      PurchaseMaster.belongsTo(models.Ledger, {
        foreignKey: 'cgstLedgerId',
        as: 'cgstLedger',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      PurchaseMaster.belongsTo(models.Ledger, {
        foreignKey: 'sgstLedgerId',
        as: 'sgstLedger',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      PurchaseMaster.belongsTo(models.Ledger, {
        foreignKey: 'cessLedgerId',
        as: 'cessLedger',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      PurchaseMaster.belongsTo(models.UserCompany, {
        foreignKey: 'companyId',
        as: 'company',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }

  PurchaseMaster.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user_companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      comment: 'Foreign key to user_companies table'
    },
    purchaseType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      comment: 'Type of purchase (e.g., GST Purchase - 12%, GST Purchase - 18%, etc.)'
    },
    localPurchaseLedgerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ledgers',
        key: 'id'
      },
      comment: 'Foreign key to ledgers table for local purchase ledger'
    },
    centralPurchaseLedgerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ledgers',
        key: 'id'
      },
      comment: 'Foreign key to ledgers table for central purchase ledger'
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
      defaultValue: 'Purchase',
      comment: 'Nature of transaction'
    },
    taxability: {
      type: DataTypes.ENUM('Taxable', 'Exempted', 'Nil Rated', 'Zero Rated'),
      defaultValue: 'Taxable',
      comment: 'Taxability status'
    },
    igstLedgerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ledgers',
        key: 'id'
      },
      comment: 'Foreign key to ledgers table for IGST ledger'
    },
    cgstLedgerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ledgers',
        key: 'id'
      },
      comment: 'Foreign key to ledgers table for CGST ledger'
    },
    sgstLedgerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ledgers',
        key: 'id'
      },
      comment: 'Foreign key to ledgers table for SGST ledger'
    },
    cessLedgerId: {
      type: DataTypes.UUID,
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
      comment: 'Whether the purchase master is active'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Order for display purposes'
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active',
      comment: 'Status of the purchase master'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description of the purchase master'
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether this is a default purchase master'
    }
  }, {
    sequelize,
    modelName: 'PurchaseMaster',
    tableName: 'purchase_masters',
    timestamps: true,
    underscored: false,
    indexes: [
      {
        fields: ['purchaseType', 'companyId'],
        name: 'unique_purchase_type_per_company'
      },
      {
        fields: ['natureOfTransaction']
      },
      {
        fields: ['taxability']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['isDefault']
      }
    ]
  });

  return PurchaseMaster;
}; 
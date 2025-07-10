const sequelize = require('../../../db/db');
const { DataTypes } = require('sequelize');

const Purchase = sequelize.define('purchasemaster', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    purchasetype: {
        type: DataTypes.STRING,         
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
   ///---------Sale Ledger----------------
  local:{
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Purchase',
  } ,
  central:{
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Purchase',
  },

  ///---------Tax Type----------------
  igst: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.00,
  },
    cgst: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.00,
    },
    sgst: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.00,
    },
    cess: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.00,
    },

    ///---------Nature of Transaction----------------
    natureoftransaction: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        defaultValue: 'Purchase',
    },

    ///---------Taxbility----------------
    taxability: {
        type: DataTypes.ENUM,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        values: ['Taxable', 'Nil Rated', 'Exempted','Zero Rated'],
        defaultValue: 'Exempted',
    },

    ///---------Tax Ledger----------------
    igstLedger: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'IGST Input',
    },
    cgstLedger: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'CGST Input',
    },
    sgstLedger: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'SGST Input',
    },
    cessLedger: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Cess Input',
    },



},{
    timestamps: false,
});

module.exports = Purchase;
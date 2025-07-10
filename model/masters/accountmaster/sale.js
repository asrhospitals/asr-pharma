const sequelize = require('../../../db/db');
const { DataTypes } = require('sequelize');

const Sale = sequelize.define('salemaster', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    salestype: {
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
  } ,
  central:{
    type: DataTypes.STRING,
    allowNull: false,
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
        defaultValue: 'Sales',
    },

    ///---------Taxbility----------------
    taxability: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['Taxable', 'Nil Rated', 'Exempted', 'Zero Rated'],
        validate: {
            notEmpty: true,
        },
        defaultValue: 'Taxable',
    },

    ///---------Tax Ledger----------------
    igstLedger: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'IGST Output',
    },
    cgstLedger: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'CGST Output',
    },
    sgstLedger: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'SGST Output',
    },
    cessLedger: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Cess on GST Output',
    },



});

module.exports = Sale;
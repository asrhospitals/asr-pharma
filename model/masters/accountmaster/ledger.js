const sequelize = require("../../../db/db");
const { DataTypes } = require("sequelize");

const Ledger = sequelize.define(
  "ledgermaster",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    /// ------------------General Information-----------------
    partyname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountgroup: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Sundry Debtors",
    },
    stattion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mailto: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
    },
    pincode: {
      type: DataTypes.INTEGER,
    },
    parentledger: {
      type: DataTypes.STRING,
    },

    /// ------------------Contact Information-----------------
    mobilenumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    whatsappnumber: {
      type: DataTypes.INTEGER,
    },

    /// ------------------Balance Information-----------------
    openingbalance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    balacetype: {
      type: DataTypes.ENUM("Dr", "Cr"),
      allowNull: false,
      defaultValue: "Dr",
    },
    creditdays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    /// ------------------GST Information-----------------
    gstin: {
      type: DataTypes.STRING,
    },
    gsttype: {
      type: DataTypes.ENUM("Registered", "Composition", "Unregistered","SEZ"),
      allowNull: false,
      defaultValue: "Unregistered",
    },
    tdsapplicable: {
      type: DataTypes.ENUM("Yes", "No"),    
      defaultValue: "No",
    },
    panno: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    /// ------------------Licence Information-----------------
    druglicencenumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    druglicenceexpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    /// ------------------Bank Information-----------------
    bankname: {
      type: DataTypes.STRING,
    },
    bankaccountnumber: {
      type: DataTypes.STRING,
    },
    ifsccode: {
      type: DataTypes.STRING,
    },
    bankbranch: {
      type: DataTypes.STRING,
    },
    accounttype: {
      type: DataTypes.ENUM("Savings", "Current",),
    },  
    accountholdername: {
      type: DataTypes.STRING,
    },  

},
  {
    timestamps: false,
  
  }
  
);

module.exports = Ledger;

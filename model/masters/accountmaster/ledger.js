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
    acgroup: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    station: {
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

    /// ------------------Balance Information-----------------

    balancingmethod: {
      type: DataTypes.STRING,
    },
    openingbalance: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    balacetype: {
      type: DataTypes.ENUM("Dr", "Cr"),
      defaultValue: "Dr",
    },
    creditdays: {
      type: DataTypes.INTEGER,
    },

    /// ------------------Contact Numbers-----------------
    mobileno: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    whtsappno: {
      type: DataTypes.INTEGER,
    },
    phoneofc: {
      type: DataTypes.INTEGER,
    },

    /// ------------------GST /Tax details-----------------

    ledgertype: {
      type: DataTypes.ENUM("Registered", "Composition", "Unregistered", "SEZ"),
      defaultValue: "Unregistered",
    },
    tdsapplicable: {
      type: DataTypes.ENUM("Yes", "No"),
      defaultValue: "No",
    },
    panno: {
      type: DataTypes.STRING,
    },

    /// ------------------Licence Information-----------------
    druglicno: {
      type: DataTypes.STRING,
    },
    druglicexp: {
      type: DataTypes.DATE,
    },
    /// ------------------Bank Information-----------------
    bank: {
      type: DataTypes.STRING,
    },
    acno: {
      type: DataTypes.STRING,
    },
    ifsccode: {
      type: DataTypes.STRING,
    },
    branch: {
      type: DataTypes.STRING,
    },
    actype: {
      type: DataTypes.ENUM("Savings", "Current"),
    },
    acholdername: {
      type: DataTypes.STRING,
    },

    //--------------------Contact Info---------

    title: {
      type: DataTypes.STRING,
    },
    fname: {
      type: DataTypes.STRING,
    },
    lname: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    maritalstat: {
      type: DataTypes.STRING,
    },
    designation: {
      type: DataTypes.STRING,
    },
    website: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
  },

  {
    timestamps: false,
  }
);

module.exports = Ledger;

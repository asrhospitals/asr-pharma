const sequelize = require("../../../db/db");
const { DataTypes } = require("sequelize");

const Salt = sequelize.define("salt", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  saltname: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },

  indication: {
    type: DataTypes.STRING,
  },
  dosage: {
    type: DataTypes.STRING,
  },
  sideeffects: {
    type: DataTypes.STRING,
  },
  specialprecautions: {
    type: DataTypes.STRING,
  },
  druginteractions: {
    type: DataTypes.STRING,
  },
  note: {
    type: DataTypes.STRING,
  },
  tbitem: {
    type: DataTypes.STRING,
    defaultValue: "Normal",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Continue",
  },
  prohabit: {
    type: DataTypes.STRING,
    defaultValue: "No",
  },
  narcotic: {
    type: DataTypes.STRING,
    defaultValue: "No",
  },
  scheduleh: {
    type: DataTypes.STRING,
    defaultValue: "No",
  },
  scheduleh1: {
    type: DataTypes.STRING,
    defaultValue: "No",
  },
});

module.exports = Salt;

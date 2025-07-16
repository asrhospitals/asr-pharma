const sequelize = require("../../../db/db");
const { DataTypes } = require("sequelize");

const Salt = sequelize.define(
  "salt",
  {
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

    saltcode: {
      type: DataTypes.STRING,
    },

    salttype: {
      type: DataTypes.STRING,
    },

    saltgroup: {
      type: DataTypes.STRING,
    },

    saltsubgrp: {
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
    scheduleh2: {
      type: DataTypes.STRING,
      defaultValue: "No",
    },
    scheduleh3: {
      type: DataTypes.STRING,
      defaultValue: "No",
    },
  },
  { timestamps: false }
);





module.exports = Salt;

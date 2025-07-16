const { DataTypes } = require("sequelize");
const sequelize = require("../../../db/db");

const SaltVariation = sequelize.define(
  "saltvariation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true
    },
    str: {
      type: DataTypes.STRING,
    },
    dosage: {
      type: DataTypes.STRING,
    },
    brandname: {
      type: DataTypes.STRING,
    },
    packsize: {
      type: DataTypes.STRING,
    },
    mrp: {
      type: DataTypes.FLOAT,
    },
    dpco: {
      type: DataTypes.STRING,
      defaultValue: "No",
    },
    dpcomrp: {
      type: DataTypes.FLOAT,
    },
    salt_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "salts",
        key: "id",
      },
    },
  },
  { timestamps: false }
);



module.exports = SaltVariation;

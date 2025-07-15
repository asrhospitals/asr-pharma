const sequelize = require("../../../db/db");
const { DataTypes } = require("sequelize");
const Store = require("./store");

const Rack = sequelize.define(
  "rack",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    storeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "stores", // Sequelize will map this to the Store table
        key: "id",
      },
    },
    rackname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { timestamps: false }
);



/// Relation


module.exports = Rack;

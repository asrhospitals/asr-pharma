'use strict'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rack extends Model {
    static associate(models) {
      Rack.belongsTo(models.Store, { foreignKey: 'storeid', as: 'store' });
      Rack.hasMany(models.Item, {
        as: "RackItems",
        foreignKey: "rack",
      });
    }
  }

  Rack.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    storeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "stores",
        key: "id",
      },
    },
    rackname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: "Rack",
    tableName: "racks",
    timestamps: false,
  });

  return Rack;
};

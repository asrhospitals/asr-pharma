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
      Rack.belongsTo(models.UserCompany, {
        foreignKey: "userCompanyId",
        as: "userCompany"
      });
    }
  }

  Rack.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userCompanyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "user_companies",
        key: "id",
      },
    },
    storeid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "stores",
        key: "id",
      },
    },
    rackname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: "Rack",
    tableName: "racks",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["userCompanyId", "rackname", "storeid"],
        name: "unique_rack_per_store_per_user_company",
      },
    ],
  });

  return Rack;
};

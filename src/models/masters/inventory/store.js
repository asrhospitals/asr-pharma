"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    static associate(models) {
      Store.hasMany(models.Rack, { foreignKey: 'storeid', as: 'racks' });
      Store.belongsTo(models.UserCompany, {
        foreignKey: "userCompanyId",
        as: "userCompany"
      });
    }
  }

  Store.init(
    {
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
      storecode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      storename: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      address1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Store",
      tableName: "stores",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["userCompanyId", "storename"],
          name: "unique_store_per_user_company",
        },
      ],
    }
  );

  return Store;
};

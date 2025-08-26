"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Station extends Model {
    static associate(models) {
      Station.belongsTo(models.UserCompany, {
        foreignKey: "userCompanyId",
        as: "userCompany"
      });
    }
  }
  Station.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Station",
      tableName: "stations",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["userCompanyId", "name"],
          name: "unique_userCompanyId_station_name"
        },
      ],
    }
  );

  return Station;
};

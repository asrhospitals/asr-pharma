'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Salt extends Model {
    static associate(models) {
      Salt.hasMany(models.SaltVariation, {
        foreignKey: 'salt_id',
        as: 'saltvariations'
      });
    }
  }

  Salt.init(  {
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
    saltname: {
      type: DataTypes.STRING,
      allowNull: false,
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
  {
    timestamps: false,
    sequelize,
    modelName: "Salt",
    tableName: "salts",
    indexes: [
      {
        unique: true,
        fields: ["userCompanyId", "saltname"],
        name: "unique_salt_per_user_company",
      },
    ],
  }
);

  return Salt;
};
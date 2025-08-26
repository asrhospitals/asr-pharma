"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.belongsTo(models.Unit, { as: "Unit1", foreignKey: "unit1" });
      Item.belongsTo(models.Unit, { as: "Unit2", foreignKey: "unit2" });
      Item.belongsTo(models.HsnSac, {
        as: "HsnSacDetail",
        foreignKey: "hsnsac",
      });
      Item.belongsTo(models.Company, {
        as: "CompanyDetails",
        foreignKey: "company",
      });
      Item.belongsTo(models.Salt, { as: "SaltDetail", foreignKey: "salt" });
      Item.belongsTo(models.Rack, { as: "RackDetail", foreignKey: "rack" });
      Item.belongsTo(models.PurchaseMaster, {
        as: "TaxCategoryDetail",
        foreignKey: "taxcategory",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      });
    }
  }

  Item.init(
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
      productname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      goods: {
        type: DataTypes.ENUM("Goods", "Service"),
        allowNull: false,
        defaultValue: "Goods",
      },
      packing: { type: DataTypes.STRING },
      unit1: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "units", key: "id" },
      },
      unit2: {
        type: DataTypes.UUID,
        references: { model: "units", key: "id" },
        allowNull: true,
        defaultValue: null,
      },
      // unitindecimal: { type: DataTypes.STRING, defaultValue: "No" },
      hsnsac: { type: DataTypes.INTEGER, allowNull: false },
      taxcategory: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "purchase_masters",
          key: "id",
        },
      },
      company: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "companies",
          key: "id",
        },
      },

      salt: { type: DataTypes.UUID, references: { model: "salts", key: "id" } },
      rack: { type: DataTypes.UUID, references: { model: "racks", key: "id" } },
      price: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      purchasePrice: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      conversion: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
      cost: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      salerate: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      narcotic: { type: DataTypes.STRING, defaultValue: "No" },
      scheduleH: { type: DataTypes.STRING, defaultValue: "No" },
      scheduleH1: { type: DataTypes.STRING, defaultValue: "No" },
      scheduledrug: { type: DataTypes.STRING, defaultValue: "No" },
      prescription: { type: DataTypes.STRING, defaultValue: "No" },
      storagetype: { type: DataTypes.STRING, defaultValue: "Normal" },
      status: { type: DataTypes.STRING, defaultValue: "Continue" },
      colortype: { type: DataTypes.STRING },
      discount: { type: DataTypes.STRING },
      itemdiscount: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
        validate: { isFloat: true, min: 0 },
      },
      maxdiscount: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
        validate: { isFloat: true, min: 0 },
      },
      minimumquantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { isInt: true, min: 0 },
      },
      maximumquantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { isInt: true, min: 0 },
      },
      recorderdays: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { isInt: true, min: 0 },
      },
      recorderquantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { isInt: true, min: 0 },
      },
      minimummargin: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
        validate: { isFloat: true, min: 0 },
      },
      prohbited: { type: DataTypes.STRING, defaultValue: "No" },
      visibility: { type: DataTypes.STRING, defaultValue: "Show" },
      mfrname: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "Item",
      tableName: "items",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["userCompanyId", "productname"],
          name: "unique_item_per_user_company",
        },
      ],
    }
  );

  return Item;
};

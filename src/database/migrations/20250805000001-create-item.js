"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("items", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      productname: { type: Sequelize.STRING, allowNull: false },
      goods: {
        type: Sequelize.ENUM("Goods", "Service"),
        allowNull: false,
        defaultValue: "Goods",
      },
      packing: { type: Sequelize.STRING },

      unit1: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "units", key: "id" },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      unit2: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
        references: { model: "units", key: "id" },
      },

      taxcategory: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "purchase_masters", key: "id" },
      },

      hsnsac: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "hsnsac", key: "id" },
      },

      company: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "companies", key: "id" },
        onDelete: "CASCADE",
      },

      userCompanyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "user_companies", key: "id" },
        onDelete: "CASCADE",
      },

      salt: {
        type: Sequelize.UUID,
        references: { model: "salts", key: "id" },
      },

      rack: {
        type: Sequelize.UUID,
        references: { model: "racks", key: "id" },
      },

      price: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      purchasePrice: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      cost: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      salerate: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      conversion: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 1 },

      narcotic: { type: Sequelize.STRING, defaultValue: "No" },
      scheduleH: { type: Sequelize.STRING, defaultValue: "No" },
      scheduleH1: { type: Sequelize.STRING, defaultValue: "No" },
      scheduledrug: { type: Sequelize.STRING, defaultValue: "No" },
      prescription: { type: Sequelize.STRING, defaultValue: "No" },
      storagetype: { type: Sequelize.STRING, defaultValue: "Normal" },
      status: { type: Sequelize.STRING, defaultValue: "Continue" },
      colortype: { type: Sequelize.STRING },
      discount: { type: Sequelize.STRING },
      itemdiscount: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      maxdiscount: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      minimumquantity: { type: Sequelize.INTEGER, defaultValue: 0 },
      maximumquantity: { type: Sequelize.INTEGER, defaultValue: 0 },
      recorderdays: { type: Sequelize.INTEGER, defaultValue: 0 },
      recorderquantity: { type: Sequelize.INTEGER, defaultValue: 0 },
      minimummargin: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      prohbited: { type: Sequelize.STRING, defaultValue: "No" },
      visibility: { type: Sequelize.STRING, defaultValue: "Show" },
      mfrname: { type: Sequelize.STRING },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("items");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_items_goods";'
    );
  },
};

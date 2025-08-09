"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("items", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

      productname: { type: Sequelize.STRING, allowNull: false },
      goods: {
        type: Sequelize.ENUM("Goods", "Service"),
        allowNull: false,
        defaultValue: "Goods",
      },
      packing: { type: Sequelize.STRING },
      unit1: { type: Sequelize.INTEGER, allowNull: false },
      unit2: { type: Sequelize.INTEGER, allowNull: true, defaultValue: null },
      taxcategory: { type: Sequelize.INTEGER, allowNull: false },
      conversion: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 1 },
      unitindecimal: { type: Sequelize.STRING, defaultValue: "No" },
      hsnsac: { type: Sequelize.INTEGER, allowNull: false },
      company: { type: Sequelize.INTEGER, allowNull: false },
      salt: { type: Sequelize.INTEGER },
      rack: { type: Sequelize.INTEGER },
      price: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      purchasePrice: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      cost: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      salerate: { type: Sequelize.FLOAT, defaultValue: 0.0 },
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

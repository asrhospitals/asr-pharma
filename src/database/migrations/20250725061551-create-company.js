"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("companies", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },

      userCompanyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "user_companies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      companyname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      printremark: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("Continue", "Discontinue"),
        defaultValue: "Continue",
      },
      prohibited: {
        type: Sequelize.ENUM("Yes", "No"),
        defaultValue: "No",
      },
      invoiceprintindex: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      recorderformula: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
      },
      recorderprefrence: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      expiredays: {
        type: Sequelize.INTEGER,
        defaultValue: 90,
      },
      dumpdays: {
        type: Sequelize.INTEGER,
        defaultValue: 60,
      },
      minimummargin: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
      },
      storeroom: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("companies");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_companies_status";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_companies_prohibited";'
    );
  },
};
        
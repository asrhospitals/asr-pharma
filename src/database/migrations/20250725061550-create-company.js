"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("companies", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      
      companyName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "India",
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pinCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      
      branchCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      businessType: {
        type: Sequelize.ENUM(
          "Billing [General]",
          "Chemist [Pharmacy]",
          "Pharma Distribution [Batch]",
          "Automobile",
          "Garment",
          "Mobile Trade",
          "Supermarket/Grocery",
          "Computer Hardware"
        ),
        allowNull: false,
      },
      calendarType: {
        type: Sequelize.ENUM("English", "Hindi", "Gujarati"),
        allowNull: false,
        defaultValue: "English",
      },
      financialYearFrom: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      financialYearTo: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      taxType: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "GST",
      },

      
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      
      companyRegType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      panNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      
      logoUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      
      status: {
        type: Sequelize.ENUM("active", "inactive", "suspended", "Continue", "Discontinue"),
        defaultValue: "active",
      },

      
      printremark: {
        type: Sequelize.STRING,
        allowNull: true,
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

      
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("companies");

    
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_companies_businessType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_companies_calendarType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_companies_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_companies_prohibited";');
  },
};

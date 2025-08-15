"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    
    
    
    
    
    
    
    
    
    
    
    

    await queryInterface.addColumn("users", "email", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      after: "lname",
    });

    await queryInterface.addColumn("users", "phone", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      after: "email",
    });

    await queryInterface.addColumn("users", "pin", {
      type: Sequelize.STRING,
      allowNull: false,
      after: "phone",
    });

    await queryInterface.addColumn("users", "phoneVerified", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: "pin",
    });

    await queryInterface.addColumn("users", "emailVerified", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: "phoneVerified",
    });

    await queryInterface.addColumn("users", "phoneVerificationCode", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "emailVerified",
    });

    await queryInterface.addColumn("users", "phoneVerificationExpiry", {
      type: Sequelize.DATE,
      allowNull: true,
      after: "phoneVerificationCode",
    });

    await queryInterface.addColumn("users", "emailVerificationCode", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "phoneVerificationExpiry",
    });

    await queryInterface.addColumn("users", "emailVerificationExpiry", {
      type: Sequelize.DATE,
      allowNull: true,
      after: "emailVerificationCode",
    });

    await queryInterface.addColumn("users", "activeCompanyId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "emailVerificationExpiry",
      references: {
        model: "companies",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("users", "lastLoginAt", {
      type: Sequelize.DATE,
      allowNull: true,
      after: "activeCompanyId",
    });

    await queryInterface.addColumn("users", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      after: "lastLoginAt",
    });

    await queryInterface.addColumn("users", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      after: "createdAt",
    });

    
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'user'
    `);

    
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_users_isactive" ADD VALUE IF NOT EXISTS 'pending_verification'
    `);

    
    await queryInterface.addIndex("users", ["email"]);
    await queryInterface.addIndex("users", ["phone"]);
    await queryInterface.addIndex("users", ["activeCompanyId"]);
    await queryInterface.addIndex("users", ["isactive"]);
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.removeIndex("users", ["email"]);
    await queryInterface.removeIndex("users", ["phone"]);
    await queryInterface.removeIndex("users", ["activeCompanyId"]);
    await queryInterface.removeIndex("users", ["isactive"]);

    
    await queryInterface.removeColumn("users", "updatedAt");
    await queryInterface.removeColumn("users", "createdAt");
    await queryInterface.removeColumn("users", "lastLoginAt");
    await queryInterface.removeColumn("users", "activeCompanyId");
    await queryInterface.removeColumn("users", "emailVerificationExpiry");
    await queryInterface.removeColumn("users", "emailVerificationCode");
    await queryInterface.removeColumn("users", "phoneVerificationExpiry");
    await queryInterface.removeColumn("users", "phoneVerificationCode");
    await queryInterface.removeColumn("users", "emailVerified");
    await queryInterface.removeColumn("users", "phoneVerified");
    await queryInterface.removeColumn("users", "pin");
    await queryInterface.removeColumn("users", "phone");
    await queryInterface.removeColumn("users", "email");
  },
};

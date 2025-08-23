"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Otps", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiry: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Otps");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Otps_phone";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Otps_otp";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Otps_expiry";'
    );
  },
};

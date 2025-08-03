'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Update all existing sale masters to be default
    await queryInterface.sequelize.query(
      `UPDATE sale_masters SET "isDefault" = true WHERE "isDefault" IS NULL OR "isDefault" = false`
    );
  },

  async down (queryInterface, Sequelize) {
    // Revert all sale masters to not be default
    await queryInterface.sequelize.query(
      `UPDATE sale_masters SET "isDefault" = false`
    );
  }
};

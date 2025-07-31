'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('doctors', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mobileNo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      registrationNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hospitalName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      specialization: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      commission: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
      },
      locationCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pinNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phoneNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      whatsappNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('doctors');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_doctors_status";');
  }
};

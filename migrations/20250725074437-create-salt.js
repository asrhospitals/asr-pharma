'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('salts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      saltname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      saltcode: {
        type: Sequelize.STRING,
      },
      salttype: {
        type: Sequelize.STRING,
      },
      saltgroup: {
        type: Sequelize.STRING,
      },
      saltsubgrp: {
        type: Sequelize.STRING,
      },
      tbitem: {
        type: Sequelize.STRING,
        defaultValue: 'Normal',
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Continue',
      },
      prohabit: {
        type: Sequelize.STRING,
        defaultValue: 'No',
      },
      narcotic: {
        type: Sequelize.STRING,
        defaultValue: 'No',
      },
      scheduleh2: {
        type: Sequelize.STRING,
        defaultValue: 'No',
      },
      scheduleh3: {
        type: Sequelize.STRING,
        defaultValue: 'No',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('salts');
  }
};

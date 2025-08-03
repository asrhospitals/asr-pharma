'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('manufacturers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mfrname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Continue',
      },
      prohabited: {
        type: Sequelize.STRING,
        defaultValue: 'No',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('manufacturers');
  }
};

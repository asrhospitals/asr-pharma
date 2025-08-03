'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stores', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      storecode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      storename: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      address1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('stores');
  }
};

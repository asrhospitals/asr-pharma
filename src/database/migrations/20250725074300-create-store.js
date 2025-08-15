'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stores', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      storecode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      storename: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      address1: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stores');
  }
};


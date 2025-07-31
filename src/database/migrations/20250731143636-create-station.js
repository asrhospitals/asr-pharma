'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableExists = await queryInterface.showAllTables().then(tables =>
      tables.includes('stations')
    );

    if (tableExists) {
      console.log('Table stations already exists, skipping creation...');
      return;
    }

    await queryInterface.createTable('stations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('stations');
  }
};

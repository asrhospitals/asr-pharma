'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('saltvariations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      str: {
        type: Sequelize.STRING,
      },
      dosage: {
        type: Sequelize.STRING,
      },
      brandname: {
        type: Sequelize.STRING,
      },
      packsize: {
        type: Sequelize.STRING,
      },
      mrp: {
        type: Sequelize.FLOAT,
      },
      dpco: {
        type: Sequelize.STRING,
        defaultValue: 'No',
      },
      dpcomrp: {
        type: Sequelize.FLOAT,
      },
      salt_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'salts',
          key: 'id',
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('saltvariations');
  }
};

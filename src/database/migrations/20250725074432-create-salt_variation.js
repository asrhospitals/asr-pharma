'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('saltvariations', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
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
        type: Sequelize.UUID,
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

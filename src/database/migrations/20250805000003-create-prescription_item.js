'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('prescription_items', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      prescriptionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'prescriptions',
          key: 'id',
        },
      },
      itemId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'items',
          key: 'id',
        },
      },
      presDays: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      dose: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isDays: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('prescription_items');
  }
};

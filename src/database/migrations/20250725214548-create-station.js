'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('stations', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      userCompanyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "user_companies",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('stations', ['userCompanyId', 'name'], {
      unique: true,
      name: 'unique_userCompanyId_station_name'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // await queryInterface.removeConstraint('ledgers', 'ledgers_station_fkey', { transaction });
      await queryInterface.dropTable('stations', { transaction });
      await queryInterface.removeIndex('stations', 'unique_userCompanyId_station_name', { transaction });
    });
  }
  
};

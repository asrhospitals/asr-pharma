'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Store
    await queryInterface.addColumn('stores', 'userCompanyId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'user_companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Rack
    await queryInterface.addColumn('racks', 'userCompanyId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'user_companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Unit
    await queryInterface.addColumn('units', 'userCompanyId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'user_companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Salt
    await queryInterface.addColumn('salts', 'userCompanyId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'user_companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Manufacturer
    await queryInterface.addColumn('manufacturers', 'userCompanyId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'user_companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Item
    await queryInterface.addColumn('items', 'userCompanyId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'user_companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('stores', 'userCompanyId');
    await queryInterface.removeColumn('racks', 'userCompanyId');
    await queryInterface.removeColumn('units', 'userCompanyId');
    await queryInterface.removeColumn('salts', 'userCompanyId');
    await queryInterface.removeColumn('manufacturers', 'userCompanyId');
    await queryInterface.removeColumn('items', 'userCompanyId');
  }
};

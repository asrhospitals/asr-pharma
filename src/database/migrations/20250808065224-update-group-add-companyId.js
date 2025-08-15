'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('groups', 'companyId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('groups', 'companyId');
  }
};

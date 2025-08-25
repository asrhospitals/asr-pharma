'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('hsnsac', 'userCompanyId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'user_companies',
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

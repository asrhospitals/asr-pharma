'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sale_masters', 'isDefault', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Whether this is a default sale master that cannot be deleted or edited'
    });

    await queryInterface.addIndex('sale_masters', ['isDefault'], {
      name: 'idx_sale_masters_is_default'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('sale_masters', 'idx_sale_masters_is_default');
    await queryInterface.removeColumn('sale_masters', 'isDefault');
  }
};

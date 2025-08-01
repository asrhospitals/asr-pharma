'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('ledgers', 'isDefault', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Whether this is a default system ledger'
    });

    await queryInterface.addColumn('ledgers', 'isEditable', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Whether this ledger can be edited'
    });

    await queryInterface.addColumn('ledgers', 'isDeletable', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Whether this ledger can be deleted'
    });

    await queryInterface.addColumn('ledgers', 'editableFields', {
      type: Sequelize.JSON,
      defaultValue: ['openingBalance', 'balanceType', 'description', 'address', 'isActive', 'status', 'station'],
      allowNull: true,
      comment: 'Array of field names that can be edited for this ledger'
    });


    await queryInterface.addIndex('ledgers', ['isDefault'], {
      name: 'ledgers_isDefault_index'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('ledgers', 'ledgers_isDefault_index');
    await queryInterface.removeColumn('ledgers', 'editableFields');
    await queryInterface.removeColumn('ledgers', 'isDeletable');
    await queryInterface.removeColumn('ledgers', 'isEditable');
    await queryInterface.removeColumn('ledgers', 'isDefault');
  }
};

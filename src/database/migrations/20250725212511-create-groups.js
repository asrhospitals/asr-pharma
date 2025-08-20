'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('groups', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      group_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user_companies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      under_group: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Parent group name for hierarchy'
      },
      parent_group_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'groups',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      group_type: {
        type: Sequelize.ENUM('Asset', 'Liability', 'Income', 'Expense', 'Capital'),
        allowNull: false,
        comment: 'Type of account group'
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this is a default system group'
      },
      is_editable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Whether this group can be edited'
      },
      is_deletable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Whether this group can be deleted'
      },
      prohibit: {
        type: Sequelize.ENUM('Yes', 'No'),
        defaultValue: 'No',
        comment: 'Whether this group is prohibited from certain operations'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Order for display purposes'
      },
      status: {
        type: Sequelize.ENUM('Active', 'Inactive'),
        defaultValue: 'Active'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });


    await queryInterface.addIndex('groups', ['parent_group_id']);
    await queryInterface.addIndex('groups', ['group_type']);
    await queryInterface.addIndex('groups', ['is_default']);
    await queryInterface.addIndex('groups', ['status']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('groups');
    await queryInterface.removeIndex('groups', ['parent_group_id']);
    await queryInterface.removeIndex('groups', ['group_type']);
    await queryInterface.removeIndex('groups', ['is_default']);
    await queryInterface.removeIndex('groups', ['status']);
  }
};

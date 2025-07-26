'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('groups', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      groupName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      undergroup: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Parent group name for hierarchy'
      },
      parentGroupId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'groups',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      groupType: {
        type: Sequelize.ENUM('Asset', 'Liability', 'Income', 'Expense', 'Capital'),
        allowNull: false,
        comment: 'Type of account group'
      },
      isDefault: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this is a default system group'
      },
      isEditable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Whether this group can be edited'
      },
      isDeletable: {
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
      sortOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Order for display purposes'
      },
      status: {
        type: Sequelize.ENUM('Active', 'Inactive'),
        defaultValue: 'Active'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('groups', ['parentGroupId']);
    await queryInterface.addIndex('groups', ['groupType']);
    await queryInterface.addIndex('groups', ['isDefault']);
    await queryInterface.addIndex('groups', ['status']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('groups');
  }
};

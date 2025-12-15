'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('batches', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      userCompanyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user_companies',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      itemId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'items',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      batchNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      expiryDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      mrp: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      purchaseRate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('Active', 'Inactive', 'Expired'),
        defaultValue: 'Active'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
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

    // Create indexes
    await queryInterface.addIndex('batches', ['itemId'], {
      name: 'idx_batches_itemId'
    });
    await queryInterface.addIndex('batches', ['userCompanyId'], {
      name: 'idx_batches_userCompanyId'
    });
    await queryInterface.addIndex('batches', ['batchNumber'], {
      name: 'idx_batches_batchNumber'
    });
    await queryInterface.addIndex('batches', ['itemId', 'batchNumber'], {
      unique: true,
      name: 'unique_batch_per_item'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('batches');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_batches_status";'
    );
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.createTable('user_companies', {
    //   id: {
    //     type: Sequelize.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true
    //   },
    //   userId: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //       model: 'users',
    //       key: 'id'
    //     },
    //     onUpdate: 'CASCADE',
    //     onDelete: 'CASCADE'
    //   },
    //   companyId: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //       model: 'companies',
    //       key: 'id'
    //     },
    //     onUpdate: 'CASCADE',
    //     onDelete: 'CASCADE'
    //   },
    //   role: {
    //     type: Sequelize.ENUM('owner', 'admin', 'manager', 'user'),
    //     allowNull: false,
    //     defaultValue: 'user'
    //   },
    //   permissions: {
    //     type: Sequelize.JSONB,
    //     allowNull: true,
    //     defaultValue: {}
    //   },
    //   isActive: {
    //     type: Sequelize.BOOLEAN,
    //     allowNull: false,
    //     defaultValue: true
    //   },
    //   joinedAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    //   },
    //   createdAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    //   },
    //   updatedAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    //   }
    // });

    
    // await queryInterface.addIndex('user_companies', ['userId', 'companyId'], {
    //   unique: true,
    //   name: 'user_companies_userId_companyId_unique'
    // });

    
    // await queryInterface.addIndex('user_companies', ['userId']);
    // await queryInterface.addIndex('user_companies', ['companyId']);
    // await queryInterface.addIndex('user_companies', ['isActive']);
    // await queryInterface.addIndex('user_companies', ['role']);
  },

  down: async (queryInterface, Sequelize) => {
    
    // await queryInterface.removeIndex('user_companies', ['userId']);
    // await queryInterface.removeIndex('user_companies', ['companyId']);
    // await queryInterface.removeIndex('user_companies', ['isActive']);
    // await queryInterface.removeIndex('user_companies', ['role']);
    // await queryInterface.removeIndex('user_companies', 'user_companies_userId_companyId_unique');

    
    // await queryInterface.dropTable('user_companies');

    
    // await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_user_companies_role";');
  }
}; 
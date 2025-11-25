'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if columns already exist before adding
    const tables = ['stores', 'racks', 'units', 'salts', 'manufacturers'];
    
    for (const table of tables) {
      try {
        const columns = await queryInterface.describeTable(table);
        if (!columns.userCompanyId) {
          await queryInterface.addColumn(table, 'userCompanyId', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'user_companies',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          });
        }
      } catch (error) {
        console.log(`Skipping ${table}: ${error.message}`);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('stores', 'userCompanyId');
    await queryInterface.removeColumn('racks', 'userCompanyId');
    await queryInterface.removeColumn('units', 'userCompanyId');
    await queryInterface.removeColumn('salts', 'userCompanyId');
    await queryInterface.removeColumn('manufacturers', 'userCompanyId');
  }
};

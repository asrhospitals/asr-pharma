'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the batches table if it exists (from previous failed migration)
    const tableExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'batches');`
    );
    
    if (tableExists[0][0].exists) {
      await queryInterface.dropTable('batches');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // No-op for down migration
  }
};

/**
 * Seeder: Default Groups
 * Seeds all default account groups with form configuration
 * Run: npx sequelize-cli db:seed:all
 */

const defaultGroups = require('../../defaultSeedData/defaultGroups');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log('⏭ Skipping seed-default-groups - groups already created by 20250103000000-default-accounting-groups');
      return;
    } catch (error) {
      console.error('Error seeding groups:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      console.log('Skipping removal of seeded groups');
    } catch (error) {
      console.error('Error removing seeded groups:', error);
      throw error;
    }
  },
};

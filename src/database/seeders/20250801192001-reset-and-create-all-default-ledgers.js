"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const [company] = await queryInterface.sequelize.query(
    //   'SELECT id FROM companies WHERE "companyName" = :companyName',
    //   {
    //     replacements: { companyName: 'Default Company' },
    //     type: Sequelize.QueryTypes.SELECT
    //   }
    // );
    // if (!company) {
    //   throw new Error('Default company not found');
    // }
    // const companyId = company.id;
    // await queryInterface.bulkUpdate(
    //   "ledgers",
    //   { companyId: companyId },
    //   { isDefault: true }
    // );
  },
  down: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkUpdate(
    //   "ledgers",
    //   { companyId: null },
    //   { isDefault: true }
    // );
  },
};

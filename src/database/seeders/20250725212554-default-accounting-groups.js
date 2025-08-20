"use strict";
const defaultGroups = require('../../defaultSeedData/defaultGroups');

module.exports = {
  async up(queryInterface, Sequelize) {
    const existingGroups = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM groups WHERE "isDefault" = true',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingGroups[0].count > 0) {
      console.log("all default groups", existingGroups);
      console.log("Default groups already exist, skipping creation.");
      return;
    }

    await queryInterface.bulkDelete("groups", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    console.log("Deleted all existing groups");
    await queryInterface.sequelize.query(`
      SELECT setval(pg_get_serial_sequence('"groups"', 'id'), 1, false);
    `);
    console.log("Reset group ID sequence to start from 1");

    const now = new Date();
    await queryInterface.bulkInsert(
      "groups",
      defaultGroups.map((group) => ({
        ...group,
        createdAt: now,
        updatedAt: now,
      }))
    );

    await queryInterface.sequelize.query(`
  SELECT setval(
    pg_get_serial_sequence('"groups"', 'id'),
    COALESCE((SELECT MAX(id) FROM "groups"), 0) + 1,
    false
  )
`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("groups", { isDefault: true }, {});
  },
};

"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeIndex("groups", "groups_groupName_key").catch(() => {
      console.log("Index groups_groupName_key does not exist, skipping...");
    });

    await queryInterface.addIndex("groups", ["company_id", "group_name"], {
      unique: true,
      name: "unique_group_name_per_company",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("groups", "unique_group_name_per_company");
    console.log("⚠️ Skipping re-adding old unique index due to possible duplicates");
  },
};

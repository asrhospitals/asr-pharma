"use strict";
const defaultGroups = require('../../defaultSeedData/defaultGroups');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Skip for now - groups require company_id which needs to be created first
    console.log("⏭ Skipping default groups seeder - requires company setup first");
    return;
    
    const existingGroups = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM groups WHERE "is_default" = true',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingGroups[0].count > 0) {
      console.log("✓ Default groups already exist, skipping creation.");
      return;
    }

    const now = new Date();
    const { v4: uuidv4 } = require('uuid');
    
    // Create a mapping of old IDs to new UUIDs
    const idMap = {};
    const groupsToInsert = defaultGroups.map((group) => {
      const newId = uuidv4();
      idMap[group.id] = newId;
      return {
        id: newId,
        group_name: group.groupName,
        under_group: group.undergroup,
        parent_group_id: null, // Will be updated in second pass
        group_type: group.groupType,
        is_default: group.isDefault,
        is_editable: group.isEditable,
        is_deletable: group.isDeletable,
        prohibit: group.prohibit,
        description: group.description,
        sort_order: group.sortOrder,
        status: group.status,
        created_at: now,
        updated_at: now,
      };
    });
    
    // Update parent_group_id references
    defaultGroups.forEach((group, index) => {
      if (group.parentGroupId !== null && idMap[group.parentGroupId]) {
        groupsToInsert[index].parent_group_id = idMap[group.parentGroupId];
      }
    });
    
    await queryInterface.bulkInsert("groups", groupsToInsert);

    console.log(`✓ Successfully created ${defaultGroups.length} default accounting groups`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("groups", { "is_default": true }, {});
  },
};

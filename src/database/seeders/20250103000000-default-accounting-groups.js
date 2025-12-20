"use strict";
const defaultGroups = require('../../defaultSeedData/defaultGroups');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get the default company
    const [defaultCompany] = await queryInterface.sequelize.query(
      'SELECT id FROM user_companies WHERE "companyName" = :companyName LIMIT 1',
      {
        replacements: { companyName: "Default Company" },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!defaultCompany) {
      console.log("⚠ No default company found. Please create a company first.");
      return;
    }

    const existingGroups = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM groups WHERE company_id = :companyId AND is_default = true',
      {
        replacements: { companyId: defaultCompany.id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingGroups[0].count > 0) {
      console.log("✓ Default groups already exist for this company, skipping creation.");
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
        company_id: defaultCompany.id,
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

    console.log(`✓ Successfully created ${defaultGroups.length} default accounting groups for Default Company`);
  },

  async down(queryInterface, Sequelize) {
    const [defaultCompany] = await queryInterface.sequelize.query(
      'SELECT id FROM user_companies WHERE "companyName" = :companyName LIMIT 1',
      {
        replacements: { companyName: "Default Company" },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (defaultCompany) {
      await queryInterface.bulkDelete("groups", { company_id: defaultCompany.id, is_default: true });
    }
  },
};

"use strict";

const defaultLedgersConfig = require("../../defaultSeedData/defaultLedgersConfig");

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

    // Check if default ledgers already exist for this company
    const existingLedgers = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM ledgers WHERE "companyId" = :companyId AND "isDefault" = true',
      {
        replacements: { companyId: defaultCompany.id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingLedgers[0].count > 0) {
      console.log(
        "✓ Default ledgers already exist for this company, skipping creation."
      );
      return;
    }

    // Get all groups for this company
    const groups = await queryInterface.sequelize.query(
      'SELECT id, "group_name" FROM groups WHERE "company_id" = :companyId',
      {
        replacements: { companyId: defaultCompany.id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (groups.length === 0) {
      console.log(
        "⚠ No groups found for this company. Please create groups first."
      );
      return;
    }

    // Create a map of group names to IDs
    const groupMap = {};
    groups.forEach((group) => {
      groupMap[group.group_name] = group.id;
    });

    const now = new Date();
    const { v4: uuidv4 } = require("uuid");

    // Transform to database format
    const defaultLedgers = defaultLedgersConfig.map((ledger) => ({
      id: uuidv4(),
      companyId: defaultCompany.id,
      ledgerName: ledger.ledgerName,
      acgroup: groupMap[ledger.groupName] || null,
      openingBalance: 0.0,
      balance: 0.0,
      balanceType: ledger.balanceType,
      description: null,
      isActive: true,
      sortOrder: ledger.sortOrder,
      status: "Active",
      isDefault: true,
      isEditable: true,
      isDeletable: false,
      editableFields: JSON.stringify([
        "openingBalance",
        "balanceType",
        "description",
      ]),
      createdAt: now,
      updatedAt: now,
    }));

    // Filter out ledgers with missing groups
    const validLedgers = defaultLedgers.filter((ledger) => {
      if (!ledger.acgroup) {
        console.warn(
          `⚠ Skipping ledger "${ledger.ledger_name}" - group not found`
        );
        return false;
      }
      return true;
    });

    if (validLedgers.length > 0) {
      await queryInterface.bulkInsert("ledgers", validLedgers);
      console.log(
        `✓ Successfully created ${validLedgers.length} default ledgers for Default Company`
      );
    } else {
      console.log("⚠ No valid ledgers to create - required groups not found");
    }
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
      await queryInterface.bulkDelete("ledgers", {
        companyId: defaultCompany.id,
        isDefault: true,
      });
    }
  },
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // First, create parent groups
    const parentGroups = [
      {
        groupName: 'Branch / Divisions',
        undergroup: 'Primary',
        parentGroupId: null,
        groupType: 'Asset',
        isDefault: true,
        isEditable: false,
        isDeletable: false,
        prohibit: 'No',
        description: 'Default group for branch and division management',
        sortOrder: 1,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupName: 'Capital Account',
        undergroup: 'Primary',
        parentGroupId: null,
        groupType: 'Capital',
        isDefault: true,
        isEditable: false,
        isDeletable: false,
        prohibit: 'No',
        description: 'Default group for capital accounts',
        sortOrder: 2,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupName: 'Current Assets',
        undergroup: 'Primary',
        parentGroupId: null,
        groupType: 'Asset',
        isDefault: true,
        isEditable: false,
        isDeletable: false,
        prohibit: 'No',
        description: 'Default group for current assets',
        sortOrder: 3,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupName: 'Current Liabilities',
        undergroup: 'Primary',
        parentGroupId: null,
        groupType: 'Liability',
        isDefault: true,
        isEditable: false,
        isDeletable: false,
        prohibit: 'No',
        description: 'Default group for current liabilities',
        sortOrder: 4,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupName: 'Fixed Assets',
        undergroup: 'Primary',
        parentGroupId: null,
        groupType: 'Asset',
        isDefault: true,
        isEditable: false,
        isDeletable: false,
        prohibit: 'No',
        description: 'Default group for fixed assets',
        sortOrder: 5,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupName: 'Investments',
        undergroup: 'Primary',
        parentGroupId: null,
        groupType: 'Asset',
        isDefault: true,
        isEditable: false,
        isDeletable: false,
        prohibit: 'No',
        description: 'Default group for investments',
        sortOrder: 6,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupName: 'Loans (Liability)',
        undergroup: 'Primary',
        parentGroupId: null,
        groupType: 'Liability',
        isDefault: true,
        isEditable: false,
        isDeletable: false,
        prohibit: 'No',
        description: 'Default group for loans and liabilities',
        sortOrder: 7,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupName: 'Misc.Expenses(ASSET)',
        undergroup: 'Primary',
        parentGroupId: null,
        groupType: 'Asset',
        isDefault: true,
        isEditable: false,
        isDeletable: false,
        prohibit: 'No',
        description: 'Default group for miscellaneous expenses as assets',
        sortOrder: 8,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupName: 'Profit & Loss',
        undergroup: 'Primary',
        parentGroupId: null,
        groupType: 'Income',
        isDefault: true,
        isEditable: false,
        isDeletable: false,
        prohibit: 'No',
        description: 'Default group for profit and loss accounts',
        sortOrder: 9,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupName: 'Revenue Account',
        undergroup: 'Primary',
        parentGroupId: null,
        groupType: 'Income',
        isDefault: true,
        isEditable: false,
        isDeletable: false,
        prohibit: 'No',
        description: 'Default group for revenue accounts',
        sortOrder: 10,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupName: 'Suspense Accounts',
        undergroup: 'Primary',
        parentGroupId: null,
        groupType: 'Asset',
        isDefault: true,
        isEditable: false,
        isDeletable: false,
        prohibit: 'No',
        description: 'Default group for suspense accounts',
        sortOrder: 11,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert parent groups
    await queryInterface.bulkInsert('groups', parentGroups, {});

    // Get the inserted groups to create sub-groups
    const insertedGroups = await queryInterface.sequelize.query(
      'SELECT id, "groupName" FROM groups WHERE "isDefault" = true',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create a map for easy lookup
    const groupMap = {};
    insertedGroups.forEach(group => {
      groupMap[group.groupName] = group.id;
    });

    // Create sub-groups (these would be the expandable items in your image)
    const subGroups = [
      // Sub-groups under Capital Account
      {
        groupName: 'Share Capital',
        undergroup: 'Capital Account',
        parentGroupId: groupMap['Capital Account'],
        groupType: 'Capital',
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        prohibit: 'No',
        description: 'Share capital accounts',
        sortOrder: 1,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupName: 'Reserves & Surplus',
        undergroup: 'Capital Account',
        parentGroupId: groupMap['Capital Account'],
        groupType: 'Capital',
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        prohibit: 'No',
        description: 'Reserves and surplus accounts',
        sortOrder: 2,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Sub-groups under Current Assets
      {
        groupName: 'Bank Accounts',
        undergroup: 'Current Assets',
        parentGroupId: groupMap['Current Assets'],
        groupType: 'Asset',
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        prohibit: 'No',
        description: 'Bank account ledgers',
        sortOrder: 1,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupName: 'Cash in Hand',
        undergroup: 'Current Assets',
        parentGroupId: groupMap['Current Assets'],
        groupType: 'Asset',
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        prohibit: 'No',
        description: 'Cash in hand accounts',
        sortOrder: 2,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupName: 'Sundry Debtors',
        undergroup: 'Current Assets',
        parentGroupId: groupMap['Current Assets'],
        groupType: 'Asset',
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        prohibit: 'No',
        description: 'Sundry debtors accounts',
        sortOrder: 3,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Sub-groups under Current Liabilities
      {
        groupName: 'Sundry Creditors',
        undergroup: 'Current Liabilities',
        parentGroupId: groupMap['Current Liabilities'],
        groupType: 'Liability',
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        prohibit: 'No',
        description: 'Sundry creditors accounts',
        sortOrder: 1,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupName: 'Bank Overdraft',
        undergroup: 'Current Liabilities',
        parentGroupId: groupMap['Current Liabilities'],
        groupType: 'Liability',
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        prohibit: 'No',
        description: 'Bank overdraft accounts',
        sortOrder: 2,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Sub-groups under Loans (Liability)
      {
        groupName: 'Secured Loans',
        undergroup: 'Loans (Liability)',
        parentGroupId: groupMap['Loans (Liability)'],
        groupType: 'Liability',
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        prohibit: 'No',
        description: 'Secured loan accounts',
        sortOrder: 1,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupName: 'Unsecured Loans',
        undergroup: 'Loans (Liability)',
        parentGroupId: groupMap['Loans (Liability)'],
        groupType: 'Liability',
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        prohibit: 'No',
        description: 'Unsecured loan accounts',
        sortOrder: 2,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Sub-groups under Revenue Account
      {
        groupName: 'Sales',
        undergroup: 'Revenue Account',
        parentGroupId: groupMap['Revenue Account'],
        groupType: 'Income',
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        prohibit: 'No',
        description: 'Sales revenue accounts',
        sortOrder: 1,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupName: 'Other Income',
        undergroup: 'Revenue Account',
        parentGroupId: groupMap['Revenue Account'],
        groupType: 'Income',
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        prohibit: 'No',
        description: 'Other income accounts',
        sortOrder: 2,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert sub-groups
    await queryInterface.bulkInsert('groups', subGroups, {});
  },

  async down (queryInterface, Sequelize) {
    // Remove all default groups
    await queryInterface.bulkDelete('groups', { isDefault: true }, {});
  }
};

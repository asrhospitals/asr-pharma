'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
    const existingLedgers = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM ledgers WHERE "isDefault" = true',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingLedgers[0].count > 0) {
      console.log('Default ledgers already exist, skipping creation.');
      return;
    }

    await queryInterface.bulkDelete('ledgers', null, { truncate: true, cascade: true, restartIdentity: true });
    console.log('Deleted all existing ledgers');

    await queryInterface.sequelize.query(`
      SELECT setval(pg_get_serial_sequence('"ledgers"', 'id'), 1, false);
    `);
    console.log('Reset ledger ID sequence to start from 1');

    const allGroups = await queryInterface.sequelize.query(
      'SELECT id, "groupName", "parentGroupId" FROM groups',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const groupMap = {};
    allGroups.forEach(group => {
      if (!groupMap[group.groupName]) groupMap[group.groupName] = [];
      groupMap[group.groupName].push(group);
    });

    
    const [company] = await queryInterface.sequelize.query(
      'SELECT id FROM companies WHERE "companyName" = :companyName',
      {
        replacements: { companyName: 'Default Company' },
        type: Sequelize.QueryTypes.SELECT
      }
    );
    if (!company) {
      throw new Error('Default company not found');
    }
    const companyId = company.id;

    function getGroupId(groupName, parentGroupName = null) {
      const groups = groupMap[groupName];
      if (!groups) return null;
      if (parentGroupName) {
        const parentGroups = groupMap[parentGroupName] || [];
        for (const group of groups) {
          if (parentGroups.some(pg => pg.id === group.parentGroupId)) {
            return group.id;
          }
        }
        return groups[0].id;
      }
      return groups[0].id;
    }

    const defaultLedgers = [
      {
        ledgerName: 'Capital Account',
        acgroup: getGroupId('Capital Account'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Credit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Drawings',
        acgroup: getGroupId('Capital Account'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Cash',
        acgroup: getGroupId('Cash-in-Hand'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Bank Account',
        acgroup: getGroupId('Bank Accounts'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description', 'address']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Sales',
        acgroup: getGroupId('Sales Accounts'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Credit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Purchase',
        acgroup: getGroupId('Purchase Accounts'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Salaries',
        acgroup: getGroupId('Indirect Expense'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Rent Paid',
        acgroup: getGroupId('Indirect Expense'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Telephone Expenses',
        acgroup: getGroupId('Indirect Expense'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Electricity Charges',
        acgroup: getGroupId('Indirect Expense'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Commission Received',
        acgroup: getGroupId('Indirect Income'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Credit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 11,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Discount Received',
        acgroup: getGroupId('Indirect Income'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Credit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'CGST Input',
        acgroup: getGroupId('Duties & Taxes'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 13,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'SGST Input',
        acgroup: getGroupId('Duties & Taxes'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 14,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'IGST Input',
        acgroup: getGroupId('Duties & Taxes'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'CGST Input (RCM)',
        acgroup: getGroupId('Duties & Taxes'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 16,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'SGST Input (RCM)',
        acgroup: getGroupId('Duties & Taxes'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 17,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'IGST Input (RCM)',
        acgroup: getGroupId('Duties & Taxes'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 18,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'CGST Output',
        acgroup: getGroupId('Duties & Taxes'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Credit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 19,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'SGST Output',
        acgroup: getGroupId('Duties & Taxes'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Credit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'IGST Output',
        acgroup: getGroupId('Duties & Taxes'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Credit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 21,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Sundry Debtors',
        acgroup: getGroupId('Sundry Debtors'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description', 'address']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
          sortOrder: 22,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Sundry Creditors',
        acgroup: getGroupId('Sundry Creditors'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description', 'address']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Credit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 23,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Sales Return',
        acgroup: getGroupId('Sales Accounts'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 24,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Purchase Return',
        acgroup: getGroupId('Purchase Accounts'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Credit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 25,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Loan from Bank',
        acgroup: getGroupId('Secured Loans'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Credit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 26,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Loan from Friends',
        acgroup: getGroupId('Unsecured Loans'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Credit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 27,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Depreciation',
        acgroup: getGroupId('Indirect Expense'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 28,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Income Tax',
        acgroup: getGroupId('Duties & Taxes'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Credit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 29,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'TDS Receivable',
        acgroup: getGroupId('Duties & Taxes'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'TDS Payable',
        acgroup: getGroupId('Duties & Taxes'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Credit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 31,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Advance to Staff',
        acgroup: getGroupId('Loans & Advances (Asset)'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description', 'address']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 32,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Interest Received',
        acgroup: getGroupId('Indirect Income'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Credit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 33,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Interest Paid',
        acgroup: getGroupId('Indirect Expense'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Debit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 34,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ledgerName: 'Rounding Off',
        acgroup: getGroupId('Indirect Income'),
        isDefault: true,
        isEditable: true,
        isDeletable: false,
        editableFields: JSON.stringify(['openingBalance', 'balanceType', 'description']),
        openingBalance: 0.00,
        balance: 0.00,
        balanceType: 'Credit',
        isActive: true,
        status: 'Active',
        isDefault: true,
        sortOrder: 35,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultLedgers.forEach(ledger => {
      if (!ledger.acgroup) {
        console.warn('Missing group for ledger:', ledger.ledgerName);
      }
    });

    const validLedgers = defaultLedgers.filter(ledger => ledger.acgroup);
    if (validLedgers.length > 0) {
      await queryInterface.bulkInsert('ledgers', validLedgers, {});
      console.log(`Successfully created ${validLedgers.length} default ledgers with group mapping`);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ledgers', { isDefault: true }, {});
  }
}; 
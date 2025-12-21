'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
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

    // Check if default sale masters already exist
    const existingSaleMasters = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM sale_masters WHERE "companyId" = :companyId AND "isDefault" = true',
      {
        replacements: { companyId: defaultCompany.id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingSaleMasters[0].count > 0) {
      console.log("✓ Default sale masters already exist for this company, skipping creation.");
      return;
    }

    // Get all ledgers for this company
    const ledgers = await queryInterface.sequelize.query(
      'SELECT id, "ledgerName" FROM ledgers WHERE "companyId" = :companyId',
      {
        replacements: { companyId: defaultCompany.id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (ledgers.length === 0) {
      console.log("⚠ No ledgers found for this company. Please create ledgers first.");
      return;
    }

    const findLedger = (name) => {
      const ledger = ledgers.find(l => l.ledgerName.toLowerCase().includes(name.toLowerCase()));
      return ledger ? ledger.id : null;
    };

    const salesLedgerId = findLedger('sales') || ledgers[0]?.id;
    const igstOutputLedgerId = findLedger('igst output') || ledgers[0]?.id;
    const cgstOutputLedgerId = findLedger('cgst output') || ledgers[0]?.id;
    const sgstOutputLedgerId = findLedger('sgst output') || ledgers[0]?.id;
    const cessOutputLedgerId = findLedger('cess') || ledgers[0]?.id;

    const { v4: uuidv4 } = require("uuid");
    const now = new Date();

    const defaultSaleMasters = [
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        salesType: 'GST Sale - 12%',
        localSalesLedgerId: salesLedgerId,
        centralSalesLedgerId: salesLedgerId,
        igstPercentage: 12.00,
        cgstPercentage: 6.00,
        sgstPercentage: 6.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Sales',
        taxability: 'Taxable',
        igstLedgerId: igstOutputLedgerId,
        cgstLedgerId: cgstOutputLedgerId,
        sgstLedgerId: sgstOutputLedgerId,
        cessLedgerId: cessOutputLedgerId,
        isActive: true,
        sortOrder: 1,
        status: 'Active',
        description: 'GST Sale with 12% tax rate',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        salesType: 'GST Sale - 18%',
        localSalesLedgerId: salesLedgerId,
        centralSalesLedgerId: salesLedgerId,
        igstPercentage: 18.00,
        cgstPercentage: 9.00,
        sgstPercentage: 9.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Sales',
        taxability: 'Taxable',
        igstLedgerId: igstOutputLedgerId,
        cgstLedgerId: cgstOutputLedgerId,
        sgstLedgerId: sgstOutputLedgerId,
        cessLedgerId: cessOutputLedgerId,
        isActive: true,
        sortOrder: 2,
        status: 'Active',
        description: 'GST Sale with 18% tax rate',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        salesType: 'GST Sale - 28%',
        localSalesLedgerId: salesLedgerId,
        centralSalesLedgerId: salesLedgerId,
        igstPercentage: 28.00,
        cgstPercentage: 14.00,
        sgstPercentage: 14.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Sales',
        taxability: 'Taxable',
        igstLedgerId: igstOutputLedgerId,
        cgstLedgerId: cgstOutputLedgerId,
        sgstLedgerId: sgstOutputLedgerId,
        cessLedgerId: cessOutputLedgerId,
        isActive: true,
        sortOrder: 3,
        status: 'Active',
        description: 'GST Sale with 28% tax rate',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        salesType: 'GST Sale - 5%',
        localSalesLedgerId: salesLedgerId,
        centralSalesLedgerId: salesLedgerId,
        igstPercentage: 5.00,
        cgstPercentage: 2.50,
        sgstPercentage: 2.50,
        cessPercentage: 0.00,
        natureOfTransaction: 'Sales',
        taxability: 'Taxable',
        igstLedgerId: igstOutputLedgerId,
        cgstLedgerId: cgstOutputLedgerId,
        sgstLedgerId: sgstOutputLedgerId,
        cessLedgerId: cessOutputLedgerId,
        isActive: true,
        sortOrder: 4,
        status: 'Active',
        description: 'GST Sale with 5% tax rate',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        salesType: 'GST Sale - 6%',
        localSalesLedgerId: salesLedgerId,
        centralSalesLedgerId: salesLedgerId,
        igstPercentage: 6.00,
        cgstPercentage: 3.00,
        sgstPercentage: 3.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Sales',
        taxability: 'Taxable',
        igstLedgerId: igstOutputLedgerId,
        cgstLedgerId: cgstOutputLedgerId,
        sgstLedgerId: sgstOutputLedgerId,
        cessLedgerId: cessOutputLedgerId,
        isActive: true,
        sortOrder: 5,
        status: 'Active',
        description: 'GST Sale with 6% tax rate',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        salesType: 'GST Sale Tax Free',
        localSalesLedgerId: salesLedgerId,
        centralSalesLedgerId: salesLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Sales',
        taxability: 'Exempted',
        igstLedgerId: igstOutputLedgerId,
        cgstLedgerId: cgstOutputLedgerId,
        sgstLedgerId: sgstOutputLedgerId,
        cessLedgerId: cessOutputLedgerId,
        isActive: true,
        sortOrder: 6,
        status: 'Active',
        description: 'GST Sale Tax Free',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        salesType: 'GST Sale Tax Paid',
        localSalesLedgerId: salesLedgerId,
        centralSalesLedgerId: salesLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Sales',
        taxability: 'Taxable',
        igstLedgerId: igstOutputLedgerId,
        cgstLedgerId: cgstOutputLedgerId,
        sgstLedgerId: sgstOutputLedgerId,
        cessLedgerId: cessOutputLedgerId,
        isActive: true,
        sortOrder: 7,
        status: 'Active',
        description: 'GST Sale Tax Paid',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        salesType: 'GST Sale-Exempt',
        localSalesLedgerId: salesLedgerId,
        centralSalesLedgerId: salesLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Sales',
        taxability: 'Exempted',
        igstLedgerId: igstOutputLedgerId,
        cgstLedgerId: cgstOutputLedgerId,
        sgstLedgerId: sgstOutputLedgerId,
        cessLedgerId: cessOutputLedgerId,
        isActive: true,
        sortOrder: 8,
        status: 'Active',
        description: 'GST Sale Exempt',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        salesType: 'GST Sale-Nil Rated',
        localSalesLedgerId: salesLedgerId,
        centralSalesLedgerId: salesLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Sales',
        taxability: 'Nil Rated',
        igstLedgerId: igstOutputLedgerId,
        cgstLedgerId: cgstOutputLedgerId,
        sgstLedgerId: sgstOutputLedgerId,
        cessLedgerId: cessOutputLedgerId,
        isActive: true,
        sortOrder: 9,
        status: 'Active',
        description: 'GST Sale Nil Rated',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        salesType: 'GST-Deemed Export (Exempted)',
        localSalesLedgerId: salesLedgerId,
        centralSalesLedgerId: salesLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Sales',
        taxability: 'Exempted',
        igstLedgerId: igstOutputLedgerId,
        cgstLedgerId: cgstOutputLedgerId,
        sgstLedgerId: sgstOutputLedgerId,
        cessLedgerId: cessOutputLedgerId,
        isActive: true,
        sortOrder: 10,
        status: 'Active',
        description: 'GST Deemed Export (Exempted)',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        salesType: 'GST-Export (Zero Rated)',
        localSalesLedgerId: salesLedgerId,
        centralSalesLedgerId: salesLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Sales',
        taxability: 'Zero Rated',
        igstLedgerId: igstOutputLedgerId,
        cgstLedgerId: cgstOutputLedgerId,
        sgstLedgerId: sgstOutputLedgerId,
        cessLedgerId: cessOutputLedgerId,
        isActive: true,
        sortOrder: 11,
        status: 'Active',
        description: 'GST Export (Zero Rated)',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        salesType: 'GST-Sale SEZ (Exempted)',
        localSalesLedgerId: salesLedgerId,
        centralSalesLedgerId: salesLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Sales',
        taxability: 'Exempted',
        igstLedgerId: igstOutputLedgerId,
        cgstLedgerId: cgstOutputLedgerId,
        sgstLedgerId: sgstOutputLedgerId,
        cessLedgerId: cessOutputLedgerId,
        isActive: true,
        sortOrder: 12,
        status: 'Active',
        description: 'GST Sale SEZ (Exempted)',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        salesType: 'GST-Sale Ung.Dealer',
        localSalesLedgerId: salesLedgerId,
        centralSalesLedgerId: salesLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Sales',
        taxability: 'Taxable',
        igstLedgerId: igstOutputLedgerId,
        cgstLedgerId: cgstOutputLedgerId,
        sgstLedgerId: sgstOutputLedgerId,
        cessLedgerId: cessOutputLedgerId,
        isActive: true,
        sortOrder: 13,
        status: 'Active',
        description: 'GST Sale Unregistered Dealer',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        salesType: 'GST-StockTrf -Out (Exempt)',
        localSalesLedgerId: salesLedgerId,
        centralSalesLedgerId: salesLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Sales',
        taxability: 'Exempted',
        igstLedgerId: igstOutputLedgerId,
        cgstLedgerId: cgstOutputLedgerId,
        sgstLedgerId: sgstOutputLedgerId,
        cessLedgerId: cessOutputLedgerId,
        isActive: true,
        sortOrder: 14,
        status: 'Active',
        description: 'GST Stock Transfer Out (Exempt)',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        salesType: 'Item wise',
        localSalesLedgerId: salesLedgerId,
        centralSalesLedgerId: salesLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Sales',
        taxability: 'Taxable',
        igstLedgerId: igstOutputLedgerId,
        cgstLedgerId: cgstOutputLedgerId,
        sgstLedgerId: sgstOutputLedgerId,
        cessLedgerId: cessOutputLedgerId,
        isActive: true,
        sortOrder: 15,
        status: 'Active',
        description: 'Item wise GST calculation',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      }
    ];

    if (defaultSaleMasters.length > 0) {
      await queryInterface.bulkInsert('sale_masters', defaultSaleMasters);
      console.log(`✓ Successfully created ${defaultSaleMasters.length} default sale masters for Default Company`);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sale_masters', null, {});
  }
};

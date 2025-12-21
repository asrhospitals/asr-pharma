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

    // Check if default purchase masters already exist
    const existingPurchaseMasters = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM purchase_masters WHERE "companyId" = :companyId AND "isDefault" = true',
      {
        replacements: { companyId: defaultCompany.id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingPurchaseMasters[0].count > 0) {
      console.log("✓ Default purchase masters already exist for this company, skipping creation.");
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

    const purchaseLedgerId = findLedger('purchase') || ledgers[0]?.id;
    const igstInputLedgerId = findLedger('igst input') || ledgers[0]?.id;
    const cgstInputLedgerId = findLedger('cgst input') || ledgers[0]?.id;
    const sgstInputLedgerId = findLedger('sgst input') || ledgers[0]?.id;
    const cessInputLedgerId = findLedger('cess') || ledgers[0]?.id;

    const { v4: uuidv4 } = require("uuid");
    const now = new Date();

    const defaultPurchaseMasters = [
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        purchaseType: 'GST Import Taxable',
        localPurchaseLedgerId: purchaseLedgerId,
        centralPurchaseLedgerId: purchaseLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Purchase',
        taxability: 'Taxable',
        igstLedgerId: igstInputLedgerId,
        cgstLedgerId: cgstInputLedgerId,
        sgstLedgerId: sgstInputLedgerId,
        cessLedgerId: cessInputLedgerId,
        isActive: true,
        sortOrder: 1,
        status: 'Active',
        description: 'GST Import Taxable',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        purchaseType: 'GST Purchase - 12%',
        localPurchaseLedgerId: purchaseLedgerId,
        centralPurchaseLedgerId: purchaseLedgerId,
        igstPercentage: 12.00,
        cgstPercentage: 6.00,
        sgstPercentage: 6.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Purchase',
        taxability: 'Taxable',
        igstLedgerId: igstInputLedgerId,
        cgstLedgerId: cgstInputLedgerId,
        sgstLedgerId: sgstInputLedgerId,
        cessLedgerId: cessInputLedgerId,
        isActive: true,
        sortOrder: 2,
        status: 'Active',
        description: 'GST Purchase with 12% tax rate',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        purchaseType: 'GST Purchase - 18%',
        localPurchaseLedgerId: purchaseLedgerId,
        centralPurchaseLedgerId: purchaseLedgerId,
        igstPercentage: 18.00,
        cgstPercentage: 9.00,
        sgstPercentage: 9.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Purchase',
        taxability: 'Taxable',
        igstLedgerId: igstInputLedgerId,
        cgstLedgerId: cgstInputLedgerId,
        sgstLedgerId: sgstInputLedgerId,
        cessLedgerId: cessInputLedgerId,
        isActive: true,
        sortOrder: 3,
        status: 'Active',
        description: 'GST Purchase with 18% tax rate',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        purchaseType: 'GST Purchase - 28%',
        localPurchaseLedgerId: purchaseLedgerId,
        centralPurchaseLedgerId: purchaseLedgerId,
        igstPercentage: 28.00,
        cgstPercentage: 14.00,
        sgstPercentage: 14.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Purchase',
        taxability: 'Taxable',
        igstLedgerId: igstInputLedgerId,
        cgstLedgerId: cgstInputLedgerId,
        sgstLedgerId: sgstInputLedgerId,
        cessLedgerId: cessInputLedgerId,
        isActive: true,
        sortOrder: 4,
        status: 'Active',
        description: 'GST Purchase with 28% tax rate',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        purchaseType: 'GST Purchase - 5%',
        localPurchaseLedgerId: purchaseLedgerId,
        centralPurchaseLedgerId: purchaseLedgerId,
        igstPercentage: 5.00,
        cgstPercentage: 2.50,
        sgstPercentage: 2.50,
        cessPercentage: 0.00,
        natureOfTransaction: 'Purchase',
        taxability: 'Taxable',
        igstLedgerId: igstInputLedgerId,
        cgstLedgerId: cgstInputLedgerId,
        sgstLedgerId: sgstInputLedgerId,
        cessLedgerId: cessInputLedgerId,
        isActive: true,
        sortOrder: 5,
        status: 'Active',
        description: 'GST Purchase with 5% tax rate',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        purchaseType: 'GST Purchase - 6%',
        localPurchaseLedgerId: purchaseLedgerId,
        centralPurchaseLedgerId: purchaseLedgerId,
        igstPercentage: 6.00,
        cgstPercentage: 3.00,
        sgstPercentage: 3.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Purchase',
        taxability: 'Taxable',
        igstLedgerId: igstInputLedgerId,
        cgstLedgerId: cgstInputLedgerId,
        sgstLedgerId: sgstInputLedgerId,
        cessLedgerId: cessInputLedgerId,
        isActive: true,
        sortOrder: 6,
        status: 'Active',
        description: 'GST Purchase with 6% tax rate',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        purchaseType: 'GST Purchase Tax Free',
        localPurchaseLedgerId: purchaseLedgerId,
        centralPurchaseLedgerId: purchaseLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Purchase',
        taxability: 'Exempted',
        igstLedgerId: igstInputLedgerId,
        cgstLedgerId: cgstInputLedgerId,
        sgstLedgerId: sgstInputLedgerId,
        cessLedgerId: cessInputLedgerId,
        isActive: true,
        sortOrder: 7,
        status: 'Active',
        description: 'GST Purchase Tax Free',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        purchaseType: 'GST Purchase-Exempt',
        localPurchaseLedgerId: purchaseLedgerId,
        centralPurchaseLedgerId: purchaseLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Purchase',
        taxability: 'Exempted',
        igstLedgerId: igstInputLedgerId,
        cgstLedgerId: cgstInputLedgerId,
        sgstLedgerId: sgstInputLedgerId,
        cessLedgerId: cessInputLedgerId,
        isActive: true,
        sortOrder: 8,
        status: 'Active',
        description: 'GST Purchase Exempt',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        purchaseType: 'GST Purchase-Nil Rated',
        localPurchaseLedgerId: purchaseLedgerId,
        centralPurchaseLedgerId: purchaseLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Purchase',
        taxability: 'Nil Rated',
        igstLedgerId: igstInputLedgerId,
        cgstLedgerId: cgstInputLedgerId,
        sgstLedgerId: sgstInputLedgerId,
        cessLedgerId: cessInputLedgerId,
        isActive: true,
        sortOrder: 9,
        status: 'Active',
        description: 'GST Purchase Nil Rated',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        purchaseType: 'GST-Purchase SEZ',
        localPurchaseLedgerId: purchaseLedgerId,
        centralPurchaseLedgerId: purchaseLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Purchase',
        taxability: 'Exempted',
        igstLedgerId: igstInputLedgerId,
        cgstLedgerId: cgstInputLedgerId,
        sgstLedgerId: sgstInputLedgerId,
        cessLedgerId: cessInputLedgerId,
        isActive: true,
        sortOrder: 10,
        status: 'Active',
        description: 'GST Purchase SEZ',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        purchaseType: 'GST-Purchase Ung.Dealer',
        localPurchaseLedgerId: purchaseLedgerId,
        centralPurchaseLedgerId: purchaseLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Purchase',
        taxability: 'Taxable',
        igstLedgerId: igstInputLedgerId,
        cgstLedgerId: cgstInputLedgerId,
        sgstLedgerId: sgstInputLedgerId,
        cessLedgerId: cessInputLedgerId,
        isActive: true,
        sortOrder: 11,
        status: 'Active',
        description: 'GST Purchase Unregistered Dealer',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        purchaseType: 'GST-StockTrf-In (Exempt)',
        localPurchaseLedgerId: purchaseLedgerId,
        centralPurchaseLedgerId: purchaseLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Purchase',
        taxability: 'Exempted',
        igstLedgerId: igstInputLedgerId,
        cgstLedgerId: cgstInputLedgerId,
        sgstLedgerId: sgstInputLedgerId,
        cessLedgerId: cessInputLedgerId,
        isActive: true,
        sortOrder: 12,
        status: 'Active',
        description: 'GST Stock Transfer In (Exempt)',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        companyId: defaultCompany.id,
        purchaseType: 'Item wise',
        localPurchaseLedgerId: purchaseLedgerId,
        centralPurchaseLedgerId: purchaseLedgerId,
        igstPercentage: 0.00,
        cgstPercentage: 0.00,
        sgstPercentage: 0.00,
        cessPercentage: 0.00,
        natureOfTransaction: 'Purchase',
        taxability: 'Taxable',
        igstLedgerId: igstInputLedgerId,
        cgstLedgerId: cgstInputLedgerId,
        sgstLedgerId: sgstInputLedgerId,
        cessLedgerId: cessInputLedgerId,
        isActive: true,
        sortOrder: 13,
        status: 'Active',
        description: 'Item wise GST calculation',
        isDefault: true,
        createdAt: now,
        updatedAt: now
      }
    ];

    if (defaultPurchaseMasters.length > 0) {
      await queryInterface.bulkInsert('purchase_masters', defaultPurchaseMasters);
      console.log(`✓ Successfully created ${defaultPurchaseMasters.length} default purchase masters for Default Company`);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('purchase_masters', null, {});
  }
}; 
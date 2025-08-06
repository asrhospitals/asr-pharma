'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const existingPurchaseMasters = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM purchase_masters WHERE "isDefault" = true',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingPurchaseMasters[0].count > 0) {
      console.log('Default purchase masters already exist, skipping creation.');
      return;
    }

    await queryInterface.bulkDelete('purchase_masters', null, { truncate: true, cascade: true, restartIdentity: true });
    console.log('Deleted all existing purchase masters');

    const ledgers = await queryInterface.sequelize.query(
      `SELECT id, "ledgerName" FROM ledgers WHERE "isDefault" = true`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const findLedger = (name) => {
      const ledger = ledgers.find(l => l.ledgerName.toLowerCase().includes(name.toLowerCase()));
      return ledger ? ledger.id : null;
    };

    const purchaseLedgerId = findLedger('purchase') || ledgers[0]?.id;
    const igstInputLedgerId = findLedger('igst input') || ledgers[0]?.id;
    const cgstInputLedgerId = findLedger('cgst input') || ledgers[0]?.id;
    const sgstInputLedgerId = findLedger('sgst input') || ledgers[0]?.id;
    const cessInputLedgerId = findLedger('cess') || ledgers[0]?.id;

    const defaultPurchaseMasters = [
      {
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
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
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('purchase_masters', defaultPurchaseMasters, {});
    console.log(`Successfully created ${defaultPurchaseMasters.length} purchase masters`);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('purchase_masters', null, {});
  }
}; 
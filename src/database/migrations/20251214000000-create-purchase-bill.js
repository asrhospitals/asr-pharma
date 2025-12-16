'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('purchase_bills', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      userCompanyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user_companies',
          key: 'id'
        },
        onDelete: 'RESTRICT'
      },
      billNo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      billDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_DATE')
      },
      supplierLedgerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'ledgers',
          key: 'id'
        },
        onDelete: 'RESTRICT'
      },
      supplierInvoiceNo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      supplierInvoiceDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      purchaseMasterId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'purchase_masters',
          key: 'id'
        },
        onDelete: 'RESTRICT'
      },
      subtotal: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },
      itemDiscount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      billDiscountPercent: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      billDiscountAmount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      igstPercent: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      igstAmount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      cgstPercent: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      cgstAmount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      sgstPercent: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      sgstAmount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      cessPercent: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      cessAmount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      totalTaxAmount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      totalAmount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },
      paidAmount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },
      dueAmount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('Draft', 'Received', 'Invoiced', 'Cancelled'),
        defaultValue: 'Draft'
      },
      paymentStatus: {
        type: Sequelize.ENUM('Unpaid', 'Partial', 'Paid'),
        defaultValue: 'Unpaid'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      referenceNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: true
      },
      updatedBy: {
        type: Sequelize.UUID,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create indexes
    await queryInterface.addIndex('purchase_bills', ['billNo'], { unique: true });
    await queryInterface.addIndex('purchase_bills', ['userCompanyId']);
    await queryInterface.addIndex('purchase_bills', ['supplierLedgerId']);
    await queryInterface.addIndex('purchase_bills', ['billDate']);
    await queryInterface.addIndex('purchase_bills', ['status']);
    await queryInterface.addIndex('purchase_bills', ['paymentStatus']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('purchase_bills');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_purchase_bills_status";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_purchase_bills_paymentStatus";'
    );
  }
};

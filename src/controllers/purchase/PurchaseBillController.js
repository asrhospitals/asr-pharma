const db = require('../../database');
const { PurchaseBill, PurchaseBillItem, Ledger, PurchaseMaster } = db;
const BillCalculationService = require('../../services/billCalculationService');
const { Op } = require('sequelize');

const generateBillNumber = async (userCompanyId) => {
  try {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const todayStart = new Date().toISOString().split('T')[0];
    const todayEnd = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const count = await PurchaseBill.count({
      where: {
        userCompanyId,
        billDate: {
          [Op.gte]: todayStart,
          [Op.lt]: todayEnd,
        },
      },
    });
    return `PB-${today}-${String(count + 1).padStart(4, '0')}`;
  } catch (error) {
    console.error('Error generating bill number:', error);
    return `PB-${Date.now()}`;
  }
};

const createPurchaseBill = async (req, res) => {
  try {
    const { items, ...billData } = req.body;
    const userCompanyId = req.companyId || req.user?.userCompanyId;
    const userId = req.user?.id;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

    if (!billData.supplierLedgerId || !billData.purchaseMasterId) {
      return res.status(400).json({
        success: false,
        message: 'Supplier ledger and purchase master are required',
      });
    }

    // Validate bill data
    BillCalculationService.validateBillData({ ...billData, items });

    // Generate bill number if not provided
    if (!billData.billNo) {
      billData.billNo = await generateBillNumber(userCompanyId);
    }

    // Get purchase master to get tax percentages
    const purchaseMaster = await PurchaseMaster.findByPk(billData.purchaseMasterId);
    if (!purchaseMaster) {
      return res.status(404).json({
        success: false,
        message: 'Purchase master not found',
      });
    }

    // Calculate totals with purchase master tax rates
    const calculations = BillCalculationService.calculateBillTotals(
      items || [],
      billData.billDiscountPercent || 0,
      {
        igstPercent: purchaseMaster.igstPercentage,
        cgstPercent: purchaseMaster.cgstPercentage,
        sgstPercent: purchaseMaster.sgstPercentage,
        cessPercent: purchaseMaster.cessPercentage,
      }
    );

    // Create bill with calculated values
    const bill = await PurchaseBill.create({
      ...billData,
      userCompanyId,
      createdBy: userId,
      updatedBy: userId,
      ...calculations,
      paymentStatus: BillCalculationService.getPaymentStatus(calculations.totalAmount, 0),
    });

    // Create bill items
    if (items && items.length) {
      for (const item of calculations.items) {
        await PurchaseBillItem.create({
          ...item,
          purchaseBillId: bill.id,
        });
      }
    }

    const fullBill = await PurchaseBill.findByPk(bill.id, {
      include: [
        { model: PurchaseBillItem, as: 'billItems' },
        { model: Ledger, as: 'supplierLedger', attributes: ['id', 'ledgerName'] },
        { model: PurchaseMaster, as: 'purchaseMaster', attributes: ['id', 'purchaseType'] }
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Purchase bill created successfully',
      data: fullBill,
    });
  } catch (error) {
    console.error('Error creating purchase bill:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllPurchaseBills = async (req, res) => {
  try {
    const userCompanyId = req.companyId || req.user?.userCompanyId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

    const where = { userCompanyId };

    if (search) {
      where[Op.or] = [
        { billNo: { [Op.iLike]: `%${search}%` } },
        { supplierInvoiceNo: { [Op.iLike]: `%${search}%` } },
        { referenceNumber: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (req.query.status) {
      where.status = req.query.status;
    }

    if (req.query.paymentStatus) {
      where.paymentStatus = req.query.paymentStatus;
    }

    const { count, rows } = await PurchaseBill.findAndCountAll({
      where,
      offset,
      limit,
      order: [['createdAt', 'DESC']],
      include: [
        { model: PurchaseBillItem, as: 'billItems' },
        { model: Ledger, as: 'supplierLedger', attributes: ['id', 'ledgerName'] },
        { model: PurchaseMaster, as: 'purchaseMaster', attributes: ['id', 'purchaseType'] }
      ],
      raw: false,
    });

    res.status(200).json({
      success: true,
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error('Error fetching purchase bills:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPurchaseBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const userCompanyId = req.companyId || req.user?.userCompanyId;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

    const bill = await PurchaseBill.findOne({
      where: { id, userCompanyId },
      include: [
        { model: PurchaseBillItem, as: 'billItems' },
        { model: Ledger, as: 'supplierLedger', attributes: ['id', 'ledgerName'] },
        { model: PurchaseMaster, as: 'purchaseMaster', attributes: ['id', 'purchaseType'] }
      ],
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: `Purchase bill with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePurchaseBill = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Bill ID is required',
    });
  }

  try {
    const userCompanyId = req.companyId || req.user?.userCompanyId;
    const userId = req.user?.id;
    const { items, ...billData } = req.body;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

    const bill = await PurchaseBill.findOne({
      where: { id, userCompanyId },
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Purchase bill not found',
      });
    }

    // Validate bill data
    BillCalculationService.validateBillData({ ...billData, items });

    // Get purchase master to get tax percentages
    const purchaseMasterId = billData.purchaseMasterId || bill.purchaseMasterId;
    const purchaseMaster = await PurchaseMaster.findByPk(purchaseMasterId);
    if (!purchaseMaster) {
      return res.status(404).json({
        success: false,
        message: 'Purchase master not found',
      });
    }

    // Calculate totals
    const calculations = BillCalculationService.calculateBillTotals(
      items || [],
      billData.billDiscountPercent || 0,
      {
        igstPercent: purchaseMaster.igstPercentage,
        cgstPercent: purchaseMaster.cgstPercentage,
        sgstPercent: purchaseMaster.sgstPercentage,
        cessPercent: purchaseMaster.cessPercentage,
      }
    );

    // Update bill
    await bill.update({
      ...billData,
      updatedBy: userId,
      ...calculations,
      paymentStatus: BillCalculationService.getPaymentStatus(
        calculations.totalAmount,
        billData.paidAmount || bill.paidAmount || 0
      ),
    });

    // Update bill items
    await PurchaseBillItem.destroy({ where: { purchaseBillId: bill.id } });
    if (items && items.length) {
      for (const item of calculations.items) {
        await PurchaseBillItem.create({
          ...item,
          purchaseBillId: bill.id,
        });
      }
    }

    const fullBill = await PurchaseBill.findByPk(bill.id, {
      include: [
        { model: PurchaseBillItem, as: 'billItems' },
        { model: Ledger, as: 'supplierLedger', attributes: ['id', 'ledgerName'] },
        { model: PurchaseMaster, as: 'purchaseMaster', attributes: ['id', 'purchaseType'] }
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Purchase bill updated successfully',
      data: fullBill,
    });
  } catch (error) {
    console.error('Error updating purchase bill:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePurchaseBill = async (req, res) => {
  const { id } = req.params;
  try {
    const userCompanyId = req.companyId || req.user?.userCompanyId;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

    const bill = await PurchaseBill.findOne({
      where: { id, userCompanyId },
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Purchase bill not found',
      });
    }

    await PurchaseBillItem.destroy({ where: { purchaseBillId: bill.id } });
    await bill.destroy();

    res.status(200).json({
      success: true,
      message: 'Purchase bill deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting purchase bill:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paidAmount } = req.body;
    const userCompanyId = req.companyId || req.user?.userCompanyId;
    const userId = req.user?.id;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

    if (!paidAmount || parseFloat(paidAmount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid paid amount is required',
      });
    }

    const bill = await PurchaseBill.findOne({
      where: { id, userCompanyId },
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Purchase bill not found',
      });
    }

    const newPaidAmount = parseFloat(bill.paidAmount || 0) + parseFloat(paidAmount);
    const dueAmount = Math.max(0, parseFloat(bill.totalAmount) - newPaidAmount);

    await bill.update({
      paidAmount: newPaidAmount,
      dueAmount,
      paymentStatus: BillCalculationService.getPaymentStatus(bill.totalAmount, newPaidAmount),
      updatedBy: userId,
    });

    res.status(200).json({
      success: true,
      message: 'Payment recorded successfully',
      data: bill,
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changeBillStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userCompanyId = req.companyId || req.user?.userCompanyId;
    const userId = req.user?.id;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

    const validStatuses = ['Draft', 'Received', 'Invoiced', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const bill = await PurchaseBill.findOne({
      where: { id, userCompanyId },
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Purchase bill not found',
      });
    }

    await bill.update({
      status,
      updatedBy: userId,
    });

    res.status(200).json({
      success: true,
      message: 'Purchase bill status updated successfully',
      data: bill,
    });
  } catch (error) {
    console.error('Error changing bill status:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPurchaseBill,
  getAllPurchaseBills,
  getPurchaseBillById,
  updatePurchaseBill,
  deletePurchaseBill,
  recordPayment,
  changeBillStatus,
};

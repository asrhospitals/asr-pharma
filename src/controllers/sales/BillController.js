const db = require('../../database');
const Bill = db.Bill;
const BillItem = db.BillItem;
const BillCalculationService = require('../../services/billCalculationService');
const { Op } = require('sequelize');

/**
 * Generate unique bill number
 */
const generateBillNumber = async (userCompanyId) => {
  try {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const todayStart = new Date().toISOString().split('T')[0];
    const todayEnd = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const count = await Bill.count({
      where: {
        userCompanyId,
        date: {
          [Op.gte]: todayStart,
          [Op.lt]: todayEnd,
        },
      },
    });
    return `BILL-${today}-${String(count + 1).padStart(4, '0')}`;
  } catch (error) {
    console.error('Error generating bill number:', error);
    return `BILL-${Date.now()}`;
  }
};

/**
 * Create a new bill
 */
const createBill = async (req, res) => {
  try {
    const { items, billDiscountPercent = 0, cgstPercent = 0, sgstPercent = 0, ...billData } = req.body;
    const userCompanyId = req.companyId || req.user?.userCompanyId;
    const userId = req.user?.id;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

    // Validate bill data
    BillCalculationService.validateBillData({ ...billData, items });

    // Generate bill number if not provided
    if (!billData.billNo) {
      billData.billNo = await generateBillNumber(userCompanyId);
    }

    // Calculate totals with proper tax structure
    const calculations = BillCalculationService.calculateBillTotals(
      items || [],
      billDiscountPercent,
      {
        igstPercent: 0,
        cgstPercent,
        sgstPercent,
        cessPercent: 0,
      }
    );

    // Create bill with calculated values
    const bill = await Bill.create({
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
        await BillItem.create({
          ...item,
          billId: bill.id,
        });
      }
    }

    const fullBill = await Bill.findByPk(bill.id, {
      include: [{ model: BillItem, as: 'billItems' }],
    });

    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      data: fullBill,
    });
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all bills with pagination and filtering
 */
const getAllBills = async (req, res) => {
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
        { patientName: { [Op.iLike]: `%${search}%` } },
        { partyName: { [Op.iLike]: `%${search}%` } },
        { doctorName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (req.query.status) {
      where.status = req.query.status;
    }

    if (req.query.paymentStatus) {
      where.paymentStatus = req.query.paymentStatus;
    }

    const { count, rows } = await Bill.findAndCountAll({
      where,
      offset,
      limit,
      order: [['createdAt', 'DESC']],
      include: [{ model: BillItem, as: 'billItems' }],
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
    console.error('Error fetching bills:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get bill by ID
 */
const getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const userCompanyId = req.companyId || req.user?.userCompanyId;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

    const bill = await Bill.findOne({
      where: { id, userCompanyId },
      include: [{ model: BillItem, as: 'billItems' }],
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: `Bill with ID ${id} not found`,
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

/**
 * Update bill
 */
const updateBill = async (req, res) => {
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
    const { items, billDiscountPercent = 0, cgstPercent = 0, sgstPercent = 0, ...billData } = req.body;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

    const bill = await Bill.findOne({
      where: { id, userCompanyId },
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found',
      });
    }

    // Validate bill data
    BillCalculationService.validateBillData({ ...billData, items });

    // Calculate totals with proper tax structure
    const calculations = BillCalculationService.calculateBillTotals(
      items || [],
      billDiscountPercent,
      {
        igstPercent: 0,
        cgstPercent,
        sgstPercent,
        cessPercent: 0,
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
    await BillItem.destroy({ where: { billId: bill.id } });
    if (items && items.length) {
      for (const item of calculations.items) {
        await BillItem.create({
          ...item,
          billId: bill.id,
        });
      }
    }

    const fullBill = await Bill.findByPk(bill.id, {
      include: [{ model: BillItem, as: 'billItems' }],
    });

    res.status(200).json({
      success: true,
      message: 'Bill updated successfully',
      data: fullBill,
    });
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete bill
 */
const deleteBill = async (req, res) => {
  const { id } = req.params;
  try {
    const userCompanyId = req.companyId || req.user?.userCompanyId;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

    const bill = await Bill.findOne({
      where: { id, userCompanyId },
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found',
      });
    }

    await BillItem.destroy({ where: { billId: bill.id } });
    await bill.destroy();

    res.status(200).json({
      success: true,
      message: 'Bill deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Record payment for a bill
 */
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

    const bill = await Bill.findOne({
      where: { id, userCompanyId },
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found',
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

/**
 * Change bill status
 */
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

    const validStatuses = ['Draft', 'Paid', 'Pending', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const bill = await Bill.findOne({
      where: { id, userCompanyId },
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found',
      });
    }

    await bill.update({
      status,
      updatedBy: userId,
    });

    res.status(200).json({
      success: true,
      message: 'Bill status updated successfully',
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
  createBill,
  getAllBills,
  getBillById,
  updateBill,
  deleteBill,
  recordPayment,
  changeBillStatus,
};

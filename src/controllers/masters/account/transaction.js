const db = require("../../../database");
const { Transaction, Ledger, User, Group } = db;
const { Op } = require('sequelize');

// Generate unique voucher number
const generateVoucherNumber = async (voucherType) => {
  const prefix = voucherType.substring(0, 3).toUpperCase();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  // Get the last voucher number for this type and date
  const lastVoucher = await Transaction.findOne({
    where: {
      voucherNumber: {
        [Op.like]: `${prefix}${year}${month}%`
      }
    },
    order: [['voucherNumber', 'DESC']]
  });

  let sequence = 1;
  if (lastVoucher) {
    const lastSequence = parseInt(lastVoucher.voucherNumber.slice(-4));
    sequence = lastSequence + 1;
  }

  return `${prefix}${year}${month}${String(sequence).padStart(4, '0')}`;
};

// Update ledger balances
const updateLedgerBalances = async (transaction, isReversal = false) => {
  const multiplier = isReversal ? -1 : 1;
  
  // Update debit ledger
  const debitLedger = await Ledger.findByPk(transaction.debitLedgerId);
  if (debitLedger) {
    const debitAmount = parseFloat(transaction.amount) * multiplier;
    if (debitLedger.balanceType === 'Debit') {
      debitLedger.openingBalance = parseFloat(debitLedger.openingBalance || 0) + debitAmount;
    } else {
      debitLedger.openingBalance = parseFloat(debitLedger.openingBalance || 0) - debitAmount;
    }
    await debitLedger.save();
  }

  // Update credit ledger
  const creditLedger = await Ledger.findByPk(transaction.creditLedgerId);
  if (creditLedger) {
    const creditAmount = parseFloat(transaction.amount) * multiplier;
    if (creditLedger.balanceType === 'Credit') {
      creditLedger.openingBalance = parseFloat(creditLedger.openingBalance || 0) + creditAmount;
    } else {
      creditLedger.openingBalance = parseFloat(creditLedger.openingBalance || 0) - creditAmount;
    }
    await creditLedger.save();
  }
};

// Create transaction
const createTransaction = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const {
      voucherType,
      description,
      amount,
      debitLedgerId,
      creditLedgerId,
      referenceNumber,
      voucherDate
    } = req.body;

    // Validate required fields
    if (!voucherType || !amount || !debitLedgerId || !creditLedgerId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: voucherType, amount, debitLedgerId, creditLedgerId'
      });
    }

    // Validate amount
    if (parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero'
      });
    }

    // Validate ledgers exist
    const [debitLedger, creditLedger] = await Promise.all([
      Ledger.findByPk(debitLedgerId),
      Ledger.findByPk(creditLedgerId)
    ]);

    if (!debitLedger || !creditLedger) {
      return res.status(400).json({
        success: false,
        message: 'One or both ledgers not found'
      });
    }

    // Validate ledgers are different
    if (debitLedgerId === creditLedgerId) {
      return res.status(400).json({
        success: false,
        message: 'Debit and credit ledgers cannot be the same'
      });
    }

    // Generate voucher number
    const voucherNumber = await generateVoucherNumber(voucherType);

    // Create transaction
    const transactionData = {
      voucherNumber,
      voucherDate: voucherDate || new Date(),
      voucherType,
      description,
      amount: parseFloat(amount),
      debitLedgerId,
      creditLedgerId,
      referenceNumber,
      createdBy: req.user.id,
      status: 'Draft'
    };

    const transaction = await Transaction.create(transactionData, { transaction: t });

    // If transaction should be posted immediately
    if (req.body.postImmediately) {
      await updateLedgerBalances(transaction, false);
      transaction.isPosted = true;
      transaction.postedDate = new Date();
      transaction.status = 'Posted';
      await transaction.save({ transaction: t });
    }

    await t.commit();

    // Fetch transaction with associations
    const createdTransaction = await Transaction.findByPk(transaction.id, {
      include: [
        { model: Ledger, as: 'debitLedger' },
        { model: Ledger, as: 'creditLedger' },
        { model: User, as: 'creator' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: createdTransaction
    });

  } catch (error) {
    await t.rollback();
    console.error('Transaction creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: error.message
    });
  }
};

// Get all transactions with pagination and filters
const getTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      voucherType,
      status,
      isPosted,
      startDate,
      endDate,
      ledgerId,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Apply filters
    if (voucherType) whereClause.voucherType = voucherType;
    if (status) whereClause.status = status;
    if (isPosted !== undefined) whereClause.isPosted = isPosted === 'true';
    if (startDate && endDate) {
      whereClause.voucherDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    if (ledgerId) {
      whereClause[Op.or] = [
        { debitLedgerId: ledgerId },
        { creditLedgerId: ledgerId }
      ];
    }
    if (search) {
      whereClause[Op.or] = [
        { voucherNumber: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { referenceNumber: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Transaction.findAndCountAll({
      where: whereClause,
      include: [
        { model: Ledger, as: 'debitLedger' },
        { model: Ledger, as: 'creditLedger' },
        { model: User, as: 'creator' }
      ],
      order: [['voucherDate', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

// Get transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id, {
      include: [
        { model: Ledger, as: 'debitLedger' },
        { model: Ledger, as: 'creditLedger' },
        { model: User, as: 'creator' },
        { model: User, as: 'updater' }
      ]
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });

  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: error.message
    });
  }
};

// Update transaction
const updateTransaction = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const updateData = req.body;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if transaction is posted
    if (transaction.isPosted) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot update posted transaction'
      });
    }

    // Validate ledgers if being updated
    if (updateData.debitLedgerId || updateData.creditLedgerId) {
      const debitId = updateData.debitLedgerId || transaction.debitLedgerId;
      const creditId = updateData.creditLedgerId || transaction.creditLedgerId;
      
      if (debitId === creditId) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'Debit and credit ledgers cannot be the same'
        });
      }
    }

    // Update transaction
    updateData.updatedBy = req.user.id;
    await transaction.update(updateData, { transaction: t });

    await t.commit();

    // Fetch updated transaction
    const updatedTransaction = await Transaction.findByPk(id, {
      include: [
        { model: Ledger, as: 'debitLedger' },
        { model: Ledger, as: 'creditLedger' },
        { model: User, as: 'creator' },
        { model: User, as: 'updater' }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: updatedTransaction
    });

  } catch (error) {
    await t.rollback();
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transaction',
      error: error.message
    });
  }
};

// Post transaction
const postTransaction = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.isPosted) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Transaction is already posted'
      });
    }

    // Update ledger balances
    await updateLedgerBalances(transaction, false);

    // Mark as posted
    transaction.isPosted = true;
    transaction.postedDate = new Date();
    transaction.status = 'Posted';
    transaction.updatedBy = req.user.id;
    await transaction.save({ transaction: t });

    await t.commit();

    res.status(200).json({
      success: true,
      message: 'Transaction posted successfully',
      data: transaction
    });

  } catch (error) {
    await t.rollback();
    console.error('Post transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to post transaction',
      error: error.message
    });
  }
};

// Cancel transaction
const cancelTransaction = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.status === 'Cancelled') {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Transaction is already cancelled'
      });
    }

    // If posted, reverse the ledger balances
    if (transaction.isPosted) {
      await updateLedgerBalances(transaction, true);
    }

    // Mark as cancelled
    transaction.status = 'Cancelled';
    transaction.updatedBy = req.user.id;
    await transaction.save({ transaction: t });

    await t.commit();

    res.status(200).json({
      success: true,
      message: 'Transaction cancelled successfully',
      data: transaction
    });

  } catch (error) {
    await t.rollback();
    console.error('Cancel transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel transaction',
      error: error.message
    });
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.isPosted) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot delete posted transaction'
      });
    }

    await transaction.destroy({ transaction: t });
    await t.commit();

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully'
    });

  } catch (error) {
    await t.rollback();
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete transaction',
      error: error.message
    });
  }
};

// Get transaction statistics
const getTransactionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const whereClause = {};

    if (startDate && endDate) {
      whereClause.voucherDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const stats = await Transaction.findAll({
      where: whereClause,
      attributes: [
        'voucherType',
        'status',
        'isPosted',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
        [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'totalAmount']
      ],
      group: ['voucherType', 'status', 'isPosted']
    });

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction statistics',
      error: error.message
    });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  postTransaction,
  cancelTransaction,
  deleteTransaction,
  getTransactionStats
}; 
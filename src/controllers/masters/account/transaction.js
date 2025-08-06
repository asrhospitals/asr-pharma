const db = require("../../../database");
const { Transaction, Ledger, User, Group } = db;
const { Op } = require('sequelize');


const generateVoucherNumber = async (voucherType) => {
  const prefix = voucherType.substring(0, 3).toUpperCase();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  

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


const updateLedgerBalances = async (transaction, isReversal = false) => {
  const multiplier = isReversal ? -1 : 1;
  

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


    if (!voucherType || !amount || !debitLedgerId || !creditLedgerId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: voucherType, amount, debitLedgerId, creditLedgerId'
      });
    }


    if (parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero'
      });
    }


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


    if (debitLedgerId === creditLedgerId) {
      return res.status(400).json({
        success: false,
        message: 'Debit and credit ledgers cannot be the same'
      });
    }


    const voucherNumber = await generateVoucherNumber(voucherType);


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


    if (req.body.postImmediately) {
      await updateLedgerBalances(transaction, false);
      transaction.isPosted = true;
      transaction.postedDate = new Date();
      transaction.status = 'Posted';
      await transaction.save({ transaction: t });
    }

    await t.commit();


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


const getTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit,
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


    if (transaction.isPosted) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot update posted transaction'
      });
    }


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


    updateData.updatedBy = req.user.id;
    await transaction.update(updateData, { transaction: t });

    await t.commit();


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


    await updateLedgerBalances(transaction, false);


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


    if (transaction.isPosted) {
      await updateLedgerBalances(transaction, true);
    }


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
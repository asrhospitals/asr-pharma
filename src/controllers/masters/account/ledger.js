const db = require("../../../database");
const { Ledger, Group, Transaction } = db;
const { Op } = require('sequelize');

const createLedger = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const {
      ledgerName,
      acgroup,
      openingBalance = 0,
      balanceType = 'Debit',
      description,
      sortOrder = 0
    } = req.body;

    // Validate required fields
    if (!ledgerName || !acgroup) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: ledgerName, acgroup'
      });
    }

    // Check if ledger name already exists
    const existingLedger = await Ledger.findOne({
      where: { ledgerName: { [Op.iLike]: ledgerName } }
    });

    if (existingLedger) {
      return res.status(400).json({
        success: false,
        message: 'Ledger name already exists'
      });
    }

    // Validate group exists
    const group = await Group.findByPk(acgroup);
    if (!group) {
      return res.status(400).json({
        success: false,
        message: 'Invalid group selected'
      });
    }

    // Validate balance type
    if (!['Debit', 'Credit'].includes(balanceType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid balance type. Must be Debit or Credit'
      });
    }

    // Validate opening balance
    if (isNaN(openingBalance) || openingBalance < 0) {
      return res.status(400).json({
        success: false,
        message: 'Opening balance must be a non-negative number'
      });
    }

    const ledgerData = {
      ledgerName: ledgerName.trim(),
      acgroup,
      openingBalance: parseFloat(openingBalance),
      balanceType,
      description: description?.trim(),
      sortOrder: parseInt(sortOrder) || 0,
      isActive: true,
      status: 'Active'
    };

    const ledger = await Ledger.create(ledgerData, { transaction: t });
    await t.commit();

    // Fetch created ledger with group information
    const createdLedger = await Ledger.findByPk(ledger.id, {
      include: [{ model: Group, as: 'group' }]
    });

    res.status(201).json({
      success: true,
      message: 'Ledger created successfully',
      data: createdLedger
    });

  } catch (error) {
    await t.rollback();
    console.error('Ledger creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create ledger',
      error: error.message
    });
  }
};

const getLedger = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      groupId,
      search,
      status,
      isActive,
      balanceType
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Apply filters
    if (groupId) whereClause.acgroup = groupId;
    if (status) whereClause.status = status;
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';
    if (balanceType) whereClause.balanceType = balanceType;
    if (search) {
      whereClause[Op.or] = [
        { ledgerName: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Ledger.findAndCountAll({
      where: whereClause,
      include: [{ model: Group, as: 'group' }],
      order: [['sortOrder', 'ASC'], ['ledgerName', 'ASC']],
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
    console.error('Get ledger error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ledgers',
      error: error.message
    });
  }
};

const getLedgerById = async (req, res) => {
  try {
    const { id } = req.params;

    const ledger = await Ledger.findByPk(id, {
      include: [{ model: Group, as: 'group' }]
    });

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: 'Ledger not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ledger
    });

  } catch (error) {
    console.error('Get ledger by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ledger',
      error: error.message
    });
  }
};

const updateLedger = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const updateData = req.body;

    const ledger = await Ledger.findByPk(id);
    if (!ledger) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Ledger not found'
      });
    }

    // Check if ledger name is being changed
    if (updateData.ledgerName && updateData.ledgerName !== ledger.ledgerName) {
      const existingLedger = await Ledger.findOne({
        where: { 
          ledgerName: { [Op.iLike]: updateData.ledgerName },
          id: { [Op.ne]: id }
        }
      });

      if (existingLedger) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'Ledger name already exists'
        });
      }
    }

    // Validate group if being updated
    if (updateData.acgroup) {
      const group = await Group.findByPk(updateData.acgroup);
      if (!group) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'Invalid group selected'
        });
      }
    }

    // Validate balance type if being updated
    if (updateData.balanceType && !['Debit', 'Credit'].includes(updateData.balanceType)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Invalid balance type. Must be Debit or Credit'
      });
    }

    // Validate opening balance if being updated
    if (updateData.openingBalance !== undefined) {
      if (isNaN(updateData.openingBalance) || updateData.openingBalance < 0) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'Opening balance must be a non-negative number'
        });
      }
    }

    // Clean up data
    if (updateData.ledgerName) updateData.ledgerName = updateData.ledgerName.trim();
    if (updateData.description) updateData.description = updateData.description.trim();
    if (updateData.openingBalance !== undefined) updateData.openingBalance = parseFloat(updateData.openingBalance);
    if (updateData.sortOrder !== undefined) updateData.sortOrder = parseInt(updateData.sortOrder);

    await ledger.update(updateData, { transaction: t });
    await t.commit();

    // Fetch updated ledger
    const updatedLedger = await Ledger.findByPk(id, {
      include: [{ model: Group, as: 'group' }]
    });

    res.status(200).json({
      success: true,
      message: 'Ledger updated successfully',
      data: updatedLedger
    });

  } catch (error) {
    await t.rollback();
    console.error('Update ledger error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ledger',
      error: error.message
    });
  }
};

const deleteLedger = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;

    const ledger = await Ledger.findByPk(id);
    if (!ledger) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Ledger not found'
      });
    }

    // Check if ledger has transactions
    const transactionCount = await Transaction.count({
      where: {
        [Op.or]: [
          { debitLedgerId: id },
          { creditLedgerId: id }
        ]
      }
    });

    if (transactionCount > 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `Cannot delete ledger. It has ${transactionCount} associated transactions.`
      });
    }

    await ledger.destroy({ transaction: t });
    await t.commit();

    res.status(200).json({
      success: true,
      message: 'Ledger deleted successfully'
    });

  } catch (error) {
    await t.rollback();
    console.error('Delete ledger error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete ledger',
      error: error.message
    });
  }
};

const getLedgerBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { asOfDate } = req.query;

    const ledger = await Ledger.findByPk(id);
    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: 'Ledger not found'
      });
    }

    let balance = parseFloat(ledger.openingBalance || 0);
    let transactions = [];

    // Calculate balance from transactions
    const transactionWhere = {
      [Op.or]: [
        { debitLedgerId: id },
        { creditLedgerId: id }
      ],
      isPosted: true,
      status: 'Posted'
    };

    if (asOfDate) {
      transactionWhere.voucherDate = {
        [Op.lte]: new Date(asOfDate)
      };
    }

    transactions = await Transaction.findAll({
      where: transactionWhere,
      order: [['voucherDate', 'ASC']]
    });

    // Calculate running balance
    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      
      if (transaction.debitLedgerId === parseInt(id)) {
        // This ledger is debited
        if (ledger.balanceType === 'Debit') {
          balance += amount;
        } else {
          balance -= amount;
        }
      } else {
        // This ledger is credited
        if (ledger.balanceType === 'Credit') {
          balance += amount;
        } else {
          balance -= amount;
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        ledger,
        balance: parseFloat(balance.toFixed(2)),
        transactionCount: transactions.length,
        asOfDate: asOfDate || new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get ledger balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate ledger balance',
      error: error.message
    });
  }
};

const getLedgerTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      voucherType
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {
      [Op.or]: [
        { debitLedgerId: id },
        { creditLedgerId: id }
      ]
    };

    // Apply filters
    if (startDate && endDate) {
      whereClause.voucherDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    if (voucherType) whereClause.voucherType = voucherType;

    const { count, rows } = await Transaction.findAndCountAll({
      where: whereClause,
      include: [
        { model: Ledger, as: 'debitLedger' },
        { model: Ledger, as: 'creditLedger' },
        { model: db.User, as: 'creator' }
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
    console.error('Get ledger transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ledger transactions',
      error: error.message
    });
  }
};

const getLedgerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    const ledger = await Ledger.findByPk(id, {
      include: [{ model: Group, as: 'group' }]
    });

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: 'Ledger not found'
      });
    }

    let openingBalance = parseFloat(ledger.openingBalance || 0);
    let currentBalance = openingBalance;
    let totalDebits = 0;
    let totalCredits = 0;

    const transactionWhere = {
      [Op.or]: [
        { debitLedgerId: id },
        { creditLedgerId: id }
      ],
      isPosted: true,
      status: 'Posted'
    };

    if (startDate && endDate) {
      transactionWhere.voucherDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const transactions = await Transaction.findAll({
      where: transactionWhere,
      include: [
        { model: Ledger, as: 'debitLedger' },
        { model: Ledger, as: 'creditLedger' }
      ],
      order: [['voucherDate', 'ASC'], ['createdAt', 'ASC']]
    });

    const ledgerEntries = [];
    
    if (openingBalance > 0) {
      ledgerEntries.push({
        date: null,
        particular: 'Opening',
        voucherNumber: '',
        voucherType: '',
        debit: ledger.balanceType === 'Debit' ? openingBalance : 0,
        credit: ledger.balanceType === 'Credit' ? openingBalance : 0,
        balance: openingBalance,
        balanceType: ledger.balanceType === 'Debit' ? 'Dr' : 'Cr'
      });
    }

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      const isDebit = transaction.debitLedgerId === parseInt(id);
      
      if (isDebit) {
        totalDebits += amount;
        if (ledger.balanceType === 'Debit') {
          currentBalance += amount;
        } else {
          currentBalance -= amount;
        }
      } else {
        totalCredits += amount;
        if (ledger.balanceType === 'Credit') {
          currentBalance += amount;
        } else {
          currentBalance -= amount;
        }
      }

      const otherLedger = isDebit ? transaction.creditLedger : transaction.debitLedger;
      
      ledgerEntries.push({
        date: transaction.voucherDate,
        particular: otherLedger.ledgerName,
        voucherNumber: transaction.voucherNumber,
        voucherType: transaction.voucherType,
        debit: isDebit ? amount : 0,
        credit: isDebit ? 0 : amount,
        balance: Math.abs(currentBalance),
        balanceType: currentBalance >= 0 ? 'Dr' : 'Cr'
      });
    });

    const totalDebitAmount = ledgerEntries.reduce((sum, entry) => sum + entry.debit, 0);
    const totalCreditAmount = ledgerEntries.reduce((sum, entry) => sum + entry.credit, 0);

    res.status(200).json({
      success: true,
      data: {
        ledger: {
          id: ledger.id,
          name: ledger.ledgerName,
          address: ledger.address,
          group: ledger.group.groupName,
          balanceType: ledger.balanceType
        },
        period: {
          startDate: startDate || null,
          endDate: endDate || null
        },
        entries: ledgerEntries,
        totals: {
          totalDebits: parseFloat(totalDebitAmount.toFixed(2)),
          totalCredits: parseFloat(totalCreditAmount.toFixed(2)),
          finalBalance: parseFloat(Math.abs(currentBalance).toFixed(2)),
          finalBalanceType: currentBalance >= 0 ? 'Dr' : 'Cr'
        }
      }
    });

  } catch (error) {
    console.error('Get ledger details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ledger details',
      error: error.message
    });
  }
};

const updateOpeningBalance = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { openingBalance, balanceType } = req.body;

    const ledger = await Ledger.findByPk(id);
    if (!ledger) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Ledger not found'
      });
    }

    // Check if ledger has transactions
    const transactionCount = await Transaction.count({
      where: {
        [Op.or]: [
          { debitLedgerId: id },
          { creditLedgerId: id }
        ],
        isPosted: true
      }
    });

    if (transactionCount > 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot update opening balance. Ledger has posted transactions.'
      });
    }

    // Validate opening balance
    if (isNaN(openingBalance) || openingBalance < 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Opening balance must be a non-negative number'
      });
    }

    // Validate balance type
    if (balanceType && !['Debit', 'Credit'].includes(balanceType)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Invalid balance type. Must be Debit or Credit'
      });
    }

    const updateData = {
      openingBalance: parseFloat(openingBalance)
    };

    if (balanceType) {
      updateData.balanceType = balanceType;
    }

    await ledger.update(updateData, { transaction: t });
    await t.commit();

    res.status(200).json({
      success: true,
      message: 'Opening balance updated successfully',
      data: ledger
    });

  } catch (error) {
    await t.rollback();
    console.error('Update opening balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update opening balance',
      error: error.message
    });
  }
};

module.exports = {
  createLedger,
  getLedger,
  getLedgerById,
  updateLedger,
  deleteLedger,
  getLedgerBalance,
  getLedgerTransactions,
  getLedgerDetails,
  updateOpeningBalance
};
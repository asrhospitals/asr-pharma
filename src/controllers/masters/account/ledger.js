const db = require("../../../database");
const { Ledger, Group, Transaction } = db;
const { Op } = require('sequelize');
const DefaultLedgerService = require('../../../services/defaultLedgerService');

const createLedger = async (req, res) => {
  try {
    const {
      ledgerName,
      acgroup,
      openingBalance = 0,
      balanceType = 'Debit',
      description,
      sortOrder = 0
    } = req.body;


    if (!ledgerName || !acgroup) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: ledgerName, acgroup'
      });
    }


    const existingLedger = await Ledger.findOne({
      where: { ledgerName: { [Op.iLike]: ledgerName } }
    });

    if (existingLedger) {
      return res.status(400).json({
        success: false,
        message: 'Ledger name already exists'
      });
    }


    const group = await Group.findByPk(acgroup);
    if (!group) {
      return res.status(400).json({
        success: false,
        message: 'Invalid group selected'
      });
    }


    if (!['Debit', 'Credit'].includes(balanceType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid balance type. Must be Debit or Credit'
      });
    }


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


    const ledger = await DefaultLedgerService.createCustomLedger(ledgerData, req.user.id);


    const createdLedger = await DefaultLedgerService.getLedgerWithDefaultInfo(ledger.id);

    res.status(201).json({
      success: true,
      message: 'Ledger created successfully',
      data: createdLedger
    });

  } catch (error) {
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
      limit,
      groupId,
      search,
      status,
      isActive,
      balanceType,
      isDefault
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};


    if (groupId) whereClause.acgroup = groupId;
    if (status) whereClause.status = status;
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';
    if (balanceType) whereClause.balanceType = balanceType;
    if (isDefault !== undefined) whereClause.isDefault = isDefault === 'true';
    if (search) {
      whereClause[Op.or] = [
        { ledgerName: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Ledger.findAndCountAll({
      where: whereClause,
      include: [{ model: Group, as: 'group' }],
      order: [
        ['isDefault', 'DESC'],
        ['sortOrder', 'ASC'], 
        ['ledgerName', 'ASC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });


    const ledgersWithInfo = await Promise.all(
      rows.map(async (ledger) => {
        const editableFields = await DefaultLedgerService.getEditableFields(ledger.id);
        const canDelete = await DefaultLedgerService.canDelete(ledger.id);

        return {
          ...ledger.toJSON(),
          editableFields,
          canDelete,
          isDefaultLedger: ledger.isDefault
        };
      })
    );

    res.status(200).json({
      success: true,
      data: ledgersWithInfo,
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

    const ledger = await DefaultLedgerService.getLedgerWithDefaultInfo(id);

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
  try {
    const { id } = req.params;
    const updateData = req.body;

    const ledger = await Ledger.findByPk(id);
    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: 'Ledger not found'
      });
    }


    if (updateData.ledgerName && updateData.ledgerName !== ledger.ledgerName) {
      const existingLedger = await Ledger.findOne({
        where: { 
          ledgerName: { [Op.iLike]: updateData.ledgerName },
          id: { [Op.ne]: id }
        }
      });

      if (existingLedger) {
        return res.status(400).json({
          success: false,
          message: 'Ledger name already exists'
        });
      }
    }


    if (updateData.acgroup) {
      const group = await Group.findByPk(updateData.acgroup);
      if (!group) {
        return res.status(400).json({
          success: false,
          message: 'Invalid group selected'
        });
      }
    }


    if (updateData.balanceType && !['Debit', 'Credit'].includes(updateData.balanceType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid balance type. Must be Debit or Credit'
      });
    }


    if (updateData.openingBalance !== undefined) {
      if (isNaN(updateData.openingBalance) || updateData.openingBalance < 0) {
        return res.status(400).json({
          success: false,
          message: 'Opening balance must be a non-negative number'
        });
      }
    }


    if (updateData.ledgerName) updateData.ledgerName = updateData.ledgerName.trim();
    if (updateData.description) updateData.description = updateData.description.trim();
    if (updateData.openingBalance !== undefined) updateData.openingBalance = parseFloat(updateData.openingBalance);
    if (updateData.sortOrder !== undefined) updateData.sortOrder = parseInt(updateData.sortOrder);


    await DefaultLedgerService.updateDefaultLedger(id, updateData, req.user.id);


    const updatedLedger = await DefaultLedgerService.getLedgerWithDefaultInfo(id);

    res.status(200).json({
      success: true,
      message: 'Ledger updated successfully',
      data: updatedLedger
    });

  } catch (error) {
    console.error('Update ledger error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ledger',
      error: error.message
    });
  }
};

const deleteLedger = async (req, res) => {
  try {
    const { id } = req.params;

    const ledger = await Ledger.findByPk(id);
    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: 'Ledger not found'
      });
    }


    const transactionCount = await Transaction.count({
      where: {
        [Op.or]: [
          { debitLedgerId: id },
          { creditLedgerId: id }
        ]
      }
    });

    if (transactionCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete ledger. It has ${transactionCount} associated transactions.`
      });
    }


    await DefaultLedgerService.deleteLedger(id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Ledger deleted successfully'
    });

  } catch (error) {
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


    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      
      if (transaction.debitLedgerId === parseInt(id)) {

        if (ledger.balanceType === 'Debit') {
          balance += amount;
        } else {
          balance -= amount;
        }
      } else {

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
      limit,
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


    if (isNaN(openingBalance) || openingBalance < 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Opening balance must be a non-negative number'
      });
    }


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


const getDefaultLedgers = async (req, res) => {
  try {
    const { groupId } = req.query;
    
    let defaultLedgers;
    if (groupId) {
      defaultLedgers = await DefaultLedgerService.getDefaultLedgersByGroup(groupId);
    } else {
      defaultLedgers = await DefaultLedgerService.getDefaultLedgers();
    }

    res.status(200).json({
      success: true,
      data: defaultLedgers
    });

  } catch (error) {
    console.error('Get default ledgers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch default ledgers',
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
  updateOpeningBalance,
  getDefaultLedgers
};
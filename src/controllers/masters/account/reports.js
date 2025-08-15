const db = require("../../../database");
const { Ledger, Transaction, Group, User } = db;
const { Op } = require('sequelize');


const getBalanceSheet = async (req, res) => {
  try {
    const { asOfDate } = req.query;
    const dateFilter = asOfDate ? { [Op.lte]: new Date(asOfDate) } : {};


    const ledgers = await Ledger.findAll({
      include: [{ model: Group, as: 'accountGroup' }],
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['ledgerName', 'ASC']]
    });

    const balanceSheet = {
      assets: [],
      liabilities: [],
      equity: [],
      asOfDate: asOfDate || new Date().toISOString()
    };

    for (const ledger of ledgers) {

      let balance = parseFloat(ledger.openingBalance || 0);
      
      const transactions = await Transaction.findAll({
        where: {
          [Op.or]: [
            { debitLedgerId: ledger.id },
            { creditLedgerId: ledger.id }
          ],
          isPosted: true,
          status: 'Posted',
          voucherDate: dateFilter
        },
        order: [['voucherDate', 'ASC']]
      });


      transactions.forEach(transaction => {
        const amount = parseFloat(transaction.amount);
        
        if (transaction.debitLedgerId === ledger.id) {
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

      const ledgerData = {
        id: ledger.id,
        name: ledger.ledgerName,
        group: ledger.group.groupName,
        openingBalance: parseFloat(ledger.openingBalance || 0),
        currentBalance: parseFloat(balance.toFixed(2)),
        balanceType: ledger.balanceType
      };


      switch (ledger.group.groupType) {
        case 'Asset':
          balanceSheet.assets.push(ledgerData);
          break;
        case 'Liability':
          balanceSheet.liabilities.push(ledgerData);
          break;
        case 'Capital':
          balanceSheet.equity.push(ledgerData);
          break;
      }
    }


    const totalAssets = balanceSheet.assets.reduce((sum, item) => sum + item.currentBalance, 0);
    const totalLiabilities = balanceSheet.liabilities.reduce((sum, item) => sum + item.currentBalance, 0);
    const totalEquity = balanceSheet.equity.reduce((sum, item) => sum + item.currentBalance, 0);

    res.status(200).json({
      success: true,
      data: {
        ...balanceSheet,
        totals: {
          totalAssets: parseFloat(totalAssets.toFixed(2)),
          totalLiabilities: parseFloat(totalLiabilities.toFixed(2)),
          totalEquity: parseFloat(totalEquity.toFixed(2)),
          netWorth: parseFloat((totalAssets - totalLiabilities).toFixed(2))
        }
      }
    });

  } catch (error) {
    console.error('Get balance sheet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate balance sheet',
      error: error.message
    });
  }
};


const getProfitAndLoss = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const dateFilter = {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    };


    const ledgers = await Ledger.findAll({
      include: [{ model: Group, as: 'accountGroup' }],
      where: {
        isActive: true,
        '$accountGroup.groupType$': { [Op.in]: ['Income', 'Expense'] }
      },
      order: [['sortOrder', 'ASC'], ['ledgerName', 'ASC']]
    });

    const profitLoss = {
      income: [],
      expenses: [],
      period: { startDate, endDate }
    };

    for (const ledger of ledgers) {
      let balance = 0;
      
      const transactions = await Transaction.findAll({
        where: {
          [Op.or]: [
            { debitLedgerId: ledger.id },
            { creditLedgerId: ledger.id }
          ],
          isPosted: true,
          status: 'Posted',
          voucherDate: dateFilter
        }
      });


      transactions.forEach(transaction => {
        const amount = parseFloat(transaction.amount);
        
        if (transaction.debitLedgerId === ledger.id) {
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

      const ledgerData = {
        id: ledger.id,
        name: ledger.ledgerName,
        group: ledger.group.groupName,
        amount: parseFloat(Math.abs(balance).toFixed(2))
      };

      if (ledger.group.groupType === 'Income') {
        profitLoss.income.push(ledgerData);
      } else {
        profitLoss.expenses.push(ledgerData);
      }
    }


    const totalIncome = profitLoss.income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = profitLoss.expenses.reduce((sum, item) => sum + item.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    res.status(200).json({
      success: true,
      data: {
        ...profitLoss,
        totals: {
          totalIncome: parseFloat(totalIncome.toFixed(2)),
          totalExpenses: parseFloat(totalExpenses.toFixed(2)),
          netProfit: parseFloat(netProfit.toFixed(2))
        }
      }
    });

  } catch (error) {
    console.error('Get profit and loss error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate profit and loss statement',
      error: error.message
    });
  }
};


const getTrialBalance = async (req, res) => {
  try {
    const { asOfDate } = req.query;
    const dateFilter = asOfDate ? { [Op.lte]: new Date(asOfDate) } : {};

    const ledgers = await Ledger.findAll({
      include: [{ model: Group, as: 'accountGroup' }],
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['ledgerName', 'ASC']]
    });

    const trialBalance = [];

    for (const ledger of ledgers) {
      let balance = parseFloat(ledger.openingBalance || 0);
      
      const transactions = await Transaction.findAll({
        where: {
          [Op.or]: [
            { debitLedgerId: ledger.id },
            { creditLedgerId: ledger.id }
          ],
          isPosted: true,
          status: 'Posted',
          voucherDate: dateFilter
        }
      });


      transactions.forEach(transaction => {
        const amount = parseFloat(transaction.amount);
        
        if (transaction.debitLedgerId === ledger.id) {
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

      trialBalance.push({
        id: ledger.id,
        name: ledger.ledgerName,
        group: ledger.group.groupName,
        groupType: ledger.group.groupType,
        debit: balance > 0 ? parseFloat(balance.toFixed(2)) : 0,
        credit: balance < 0 ? parseFloat(Math.abs(balance).toFixed(2)) : 0
      });
    }

    const totalDebits = trialBalance.reduce((sum, item) => sum + item.debit, 0);
    const totalCredits = trialBalance.reduce((sum, item) => sum + item.credit, 0);

    res.status(200).json({
      success: true,
      data: {
        ledgers: trialBalance,
        totals: {
          totalDebits: parseFloat(totalDebits.toFixed(2)),
          totalCredits: parseFloat(totalCredits.toFixed(2)),
          difference: parseFloat((totalDebits - totalCredits).toFixed(2))
        },
        asOfDate: asOfDate || new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get trial balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate trial balance',
      error: error.message
    });
  }
};


const getCashFlow = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const dateFilter = {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    };


    const cashLedgers = await Ledger.findAll({
      include: [{ model: Group, as: 'accountGroup' }],
      where: {
        isActive: true,
        ledgerName: { [Op.iLike]: '%cash%' }
      }
    });

    const bankLedgers = await Ledger.findAll({
      include: [{ model: Group, as: 'accountGroup' }],
      where: {
        isActive: true,
        ledgerName: { [Op.iLike]: '%bank%' }
      }
    });

    const cashFlow = {
      operatingActivities: [],
      investingActivities: [],
      financingActivities: [],
      period: { startDate, endDate }
    };


    const transactions = await Transaction.findAll({
      where: {
        isPosted: true,
        status: 'Posted',
        voucherDate: dateFilter,
        [Op.or]: [
          { debitLedgerId: { [Op.in]: [...cashLedgers.map(l => l.id), ...bankLedgers.map(l => l.id)] } },
          { creditLedgerId: { [Op.in]: [...cashLedgers.map(l => l.id), ...bankLedgers.map(l => l.id)] } }
        ]
      },
      include: [
        { model: Ledger, as: 'debitLedger' },
        { model: Ledger, as: 'creditLedger' }
      ],
      order: [['voucherDate', 'ASC']]
    });

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      let cashFlowItem = {
        date: transaction.voucherDate,
        voucherNumber: transaction.voucherNumber,
        description: transaction.description,
        amount: amount,
        type: transaction.voucherType
      };


      switch (transaction.voucherType) {
        case 'Receipt':
          cashFlow.operatingActivities.push({ ...cashFlowItem, category: 'Cash Inflow' });
          break;
        case 'Payment':
          cashFlow.operatingActivities.push({ ...cashFlowItem, category: 'Cash Outflow' });
          break;
        case 'Journal':

          if (transaction.description && transaction.description.toLowerCase().includes('investment')) {
            cashFlow.investingActivities.push(cashFlowItem);
          } else if (transaction.description && transaction.description.toLowerCase().includes('loan')) {
            cashFlow.financingActivities.push(cashFlowItem);
          } else {
            cashFlow.operatingActivities.push(cashFlowItem);
          }
          break;
        default:
          cashFlow.operatingActivities.push(cashFlowItem);
      }
    });


    const totalOperating = cashFlow.operatingActivities.reduce((sum, item) => sum + item.amount, 0);
    const totalInvesting = cashFlow.investingActivities.reduce((sum, item) => sum + item.amount, 0);
    const totalFinancing = cashFlow.financingActivities.reduce((sum, item) => sum + item.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        ...cashFlow,
        totals: {
          totalOperating: parseFloat(totalOperating.toFixed(2)),
          totalInvesting: parseFloat(totalInvesting.toFixed(2)),
          totalFinancing: parseFloat(totalFinancing.toFixed(2)),
          netCashFlow: parseFloat((totalOperating + totalInvesting + totalFinancing).toFixed(2))
        }
      }
    });

  } catch (error) {
    console.error('Get cash flow error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate cash flow statement',
      error: error.message
    });
  }
};


const getLedgerSummary = async (req, res) => {
  try {
    const { groupId, startDate, endDate } = req.query;
    const whereClause = { isActive: true };
    
    if (groupId) {
      whereClause.acgroup = groupId;
    }

    const ledgers = await Ledger.findAll({
      where: whereClause,
      include: [{ model: Group, as: 'accountGroup' }],
      order: [['sortOrder', 'ASC'], ['ledgerName', 'ASC']]
    });

    const summary = [];

    for (const ledger of ledgers) {
      let openingBalance = parseFloat(ledger.openingBalance || 0);
      let currentBalance = openingBalance;
      let totalDebits = 0;
      let totalCredits = 0;
      let transactionCount = 0;

      const transactionWhere = {
        [Op.or]: [
          { debitLedgerId: ledger.id },
          { creditLedgerId: ledger.id }
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
        order: [['voucherDate', 'ASC']]
      });

      transactions.forEach(transaction => {
        const amount = parseFloat(transaction.amount);
        transactionCount++;

        if (transaction.debitLedgerId === ledger.id) {
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
      });

      summary.push({
        id: ledger.id,
        name: ledger.ledgerName,
        group: ledger.group.groupName,
        groupType: ledger.group.groupType,
        openingBalance: parseFloat(openingBalance.toFixed(2)),
        currentBalance: parseFloat(currentBalance.toFixed(2)),
        totalDebits: parseFloat(totalDebits.toFixed(2)),
        totalCredits: parseFloat(totalCredits.toFixed(2)),
        transactionCount,
        balanceType: ledger.balanceType
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ledgers: summary,
        filters: { groupId, startDate, endDate },
        totals: {
          totalLedgers: summary.length,
          totalTransactions: summary.reduce((sum, item) => sum + item.transactionCount, 0),
          totalDebits: summary.reduce((sum, item) => sum + item.totalDebits, 0),
          totalCredits: summary.reduce((sum, item) => sum + item.totalCredits, 0)
        }
      }
    });

  } catch (error) {
    console.error('Get ledger summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate ledger summary',
      error: error.message
    });
  }
};

module.exports = {
  getBalanceSheet,
  getProfitAndLoss,
  getTrialBalance,
  getCashFlow,
  getLedgerSummary
}; 
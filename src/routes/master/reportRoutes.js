const Router = require('express');
const {
  getBalanceSheet,
  getProfitAndLoss,
  getTrialBalance,
  getCashFlow,
  getLedgerSummary
} = require('../../controllers/masters/account/reports');

const router = Router();

//-------------------------------------Accounting Reports----------------------------------//

// Financial statements
router.get('/reports/v1/balance-sheet', getBalanceSheet);
router.get('/reports/v1/profit-loss', getProfitAndLoss);
router.get('/reports/v1/trial-balance', getTrialBalance);
router.get('/reports/v1/cash-flow', getCashFlow);

// Ledger reports
router.get('/reports/v1/ledger-summary', getLedgerSummary);

module.exports = router; 
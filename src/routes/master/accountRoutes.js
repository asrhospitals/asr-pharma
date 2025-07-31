const Router = require('express');
const { 
  createLedger, 
  getLedger, 
  getLedgerById, 
  updateLedger, 
  deleteLedger,
  getLedgerBalance,
  getLedgerTransactions,
  getLedgerDetails,
  updateOpeningBalance
} = require('../../controllers/masters/account/ledger');

const {
  validateCreateLedger,
  validateUpdateLedger,
  validateGetLedgers,
  validateLedgerId,
  validateUpdateOpeningBalance,
  validateGetLedgerBalance,
  validateGetLedgerTransactions,
  handleValidationErrors
} = require('../../middleware/validation/ledgerValidation');

const transactionRoutes = require('./transactionRoutes');
const reportRoutes = require('./reportRoutes');

const router = Router();

//-------------------------------------Ledger Master----------------------------------//

// Ledger CRUD operations
router.post('/ledger/v1/add-ledger', 
  validateCreateLedger, 
  handleValidationErrors, 
  createLedger
);

router.get('/ledger/v1/get-ledger', 
  validateGetLedgers, 
  handleValidationErrors, 
  getLedger
);

router.get('/ledger/v1/get-ledger/:id', 
  validateLedgerId, 
  handleValidationErrors, 
  getLedgerById
);

router.put('/ledger/v1/update-ledger/:id', 
  validateUpdateLedger, 
  handleValidationErrors, 
  updateLedger
);

router.delete('/ledger/v1/delete-ledger/:id', 
  validateLedgerId, 
  handleValidationErrors, 
  deleteLedger
);

router.get('/ledger/v1/:id/balance', 
  validateGetLedgerBalance, 
  handleValidationErrors, 
  getLedgerBalance
);

router.get('/ledger/v1/:id/transactions', 
  validateGetLedgerTransactions, 
  handleValidationErrors, 
  getLedgerTransactions
);

router.get('/ledger/v1/:id/details', 
  validateGetLedgerTransactions, 
  handleValidationErrors, 
  getLedgerDetails
);

router.put('/ledger/v1/:id/opening-balance', 
  validateUpdateOpeningBalance, 
  handleValidationErrors, 
  updateOpeningBalance
);

//-------------------------------------Transaction Routes----------------------------------//
router.use('/', transactionRoutes);

//-------------------------------------Report Routes----------------------------------//
router.use('/', reportRoutes);

module.exports = router;
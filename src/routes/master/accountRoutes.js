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
  updateOpeningBalance,
  getDefaultLedgers
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

const {
  canCreateLedger,
  canEditLedger,
  canDeleteLedger,
  canViewLedger,
  canModifyBalance
} = require('../../middleware/permissions/groupPermissionMiddleware');

const transactionRoutes = require('./transactionRoutes');
const reportRoutes = require('./reportRoutes');
const saleMasterRoutes = require('./saleMasterRoutes');
const purchaseMasterRoutes = require('./purchaseMasterRoutes');

const router = Router();




router.post('/ledger/v1/add-ledger', 
  canCreateLedger,
  validateCreateLedger, 
  handleValidationErrors, 
  createLedger
);

router.get('/ledger/v1/get-ledger', 
  canViewLedger,
  validateGetLedgers, 
  handleValidationErrors, 
  getLedger
);

router.get('/ledger/v1/get-ledger/:id', 
  canViewLedger,
  validateLedgerId, 
  handleValidationErrors, 
  getLedgerById
);

router.put('/ledger/v1/update-ledger/:id', 
  canEditLedger,
  validateUpdateLedger, 
  handleValidationErrors, 
  updateLedger
);

router.delete('/ledger/v1/delete-ledger/:id', 
  canDeleteLedger,
  validateLedgerId, 
  handleValidationErrors, 
  deleteLedger
);

router.get('/ledger/v1/:id/balance', 
  canViewLedger,
  validateGetLedgerBalance, 
  handleValidationErrors, 
  getLedgerBalance
);

router.get('/ledger/v1/:id/transactions', 
  canViewLedger,
  validateGetLedgerTransactions, 
  handleValidationErrors, 
  getLedgerTransactions
);

router.get('/ledger/v1/:id/details', 
  canViewLedger,
  validateGetLedgerTransactions, 
  handleValidationErrors, 
  getLedgerDetails
);

router.put('/ledger/v1/:id/opening-balance', 
  canModifyBalance,
  validateUpdateOpeningBalance, 
  handleValidationErrors, 
  updateOpeningBalance
);


router.get('/ledger/v1/default-ledgers', 
  canViewLedger,
  getDefaultLedgers
);


router.use('/', transactionRoutes);


router.use('/', reportRoutes);


router.use('/', saleMasterRoutes);

router.use('/', purchaseMasterRoutes);

module.exports = router;
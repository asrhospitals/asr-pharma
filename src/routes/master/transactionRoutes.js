const Router = require('express');
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  postTransaction,
  cancelTransaction,
  deleteTransaction,
  getTransactionStats
} = require('../../controllers/masters/account/transaction');

const {
  validateCreateTransaction,
  validateUpdateTransaction,
  validateGetTransactions,
  validateTransactionId,
  validateGetTransactionStats,
  validateDifferentLedgers,
  validateDateRange,
  handleValidationErrors
} = require('../../middleware/validation/transactionValidation');

const router = Router();

//-------------------------------------Transaction Routes----------------------------------//

// Transaction CRUD operations
router.post('/transaction/v1/create', 
  validateCreateTransaction, 
  validateDifferentLedgers,
  handleValidationErrors, 
  createTransaction
);

router.get('/transaction/v1/list', 
  validateGetTransactions, 
  validateDateRange,
  handleValidationErrors, 
  getTransactions
);

router.get('/transaction/v1/:id', 
  validateTransactionId, 
  handleValidationErrors, 
  getTransactionById
);

router.put('/transaction/v1/:id', 
  validateUpdateTransaction, 
  validateDifferentLedgers,
  handleValidationErrors, 
  updateTransaction
);

router.delete('/transaction/v1/:id', 
  validateTransactionId, 
  handleValidationErrors, 
  deleteTransaction
);

// Transaction workflow operations
router.post('/transaction/v1/:id/post', 
  validateTransactionId, 
  handleValidationErrors, 
  postTransaction
);

router.post('/transaction/v1/:id/cancel', 
  validateTransactionId, 
  handleValidationErrors, 
  cancelTransaction
);

// Transaction reporting
router.get('/transaction/v1/stats/summary', 
  validateGetTransactionStats, 
  validateDateRange,
  handleValidationErrors, 
  getTransactionStats
);

module.exports = router; 
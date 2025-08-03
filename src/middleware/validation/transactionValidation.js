const { body, param, query, validationResult } = require('express-validator');


const validateCreateTransaction = [
  body('voucherType')
    .isIn(['Receipt', 'Payment', 'Journal', 'Contra', 'DebitNote', 'CreditNote'])
    .withMessage('Invalid voucher type'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),
  
  body('debitLedgerId')
    .isInt({ min: 1 })
    .withMessage('Debit ledger ID must be a valid positive integer'),
  
  body('creditLedgerId')
    .isInt({ min: 1 })
    .withMessage('Credit ledger ID must be a valid positive integer'),
  
  body('referenceNumber')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Reference number must not exceed 100 characters'),
  
  body('voucherDate')
    .optional()
    .isISO8601()
    .withMessage('Voucher date must be a valid ISO 8601 date'),
  
  body('postImmediately')
    .optional()
    .isBoolean()
    .withMessage('postImmediately must be a boolean value')
];

const validateUpdateTransaction = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Transaction ID must be a valid positive integer'),
  
  body('voucherType')
    .optional()
    .isIn(['Receipt', 'Payment', 'Journal', 'Contra', 'DebitNote', 'CreditNote'])
    .withMessage('Invalid voucher type'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),
  
  body('debitLedgerId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Debit ledger ID must be a valid positive integer'),
  
  body('creditLedgerId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Credit ledger ID must be a valid positive integer'),
  
  body('referenceNumber')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Reference number must not exceed 100 characters'),
  
  body('voucherDate')
    .optional()
    .isISO8601()
    .withMessage('Voucher date must be a valid ISO 8601 date')
];

const validateGetTransactions = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('voucherType')
    .optional()
    .isIn(['Receipt', 'Payment', 'Journal', 'Contra', 'DebitNote', 'CreditNote'])
    .withMessage('Invalid voucher type'),
  
  query('status')
    .optional()
    .isIn(['Draft', 'Posted', 'Cancelled'])
    .withMessage('Invalid status'),
  
  query('isPosted')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('isPosted must be either true or false'),
  
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid ISO 8601 date'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid ISO 8601 date'),
  
  query('ledgerId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Ledger ID must be a valid positive integer'),
  
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
];

const validateTransactionId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Transaction ID must be a valid positive integer')
];

const validateGetTransactionStats = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid ISO 8601 date'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid ISO 8601 date')
];


const validateDifferentLedgers = (req, res, next) => {
  const { debitLedgerId, creditLedgerId } = req.body;
  
  if (debitLedgerId && creditLedgerId && debitLedgerId === creditLedgerId) {
    return res.status(400).json({
      success: false,
      message: 'Debit and credit ledgers cannot be the same'
    });
  }
  
  next();
};


const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;
  
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be after end date'
      });
    }
  }
  
  next();
};


const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

module.exports = {
  validateCreateTransaction,
  validateUpdateTransaction,
  validateGetTransactions,
  validateTransactionId,
  validateGetTransactionStats,
  validateDifferentLedgers,
  validateDateRange,
  handleValidationErrors
}; 
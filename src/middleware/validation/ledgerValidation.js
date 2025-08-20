const { body, param, query, validationResult } = require('express-validator');


const validateCreateLedger = [
  body('ledgerName')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Ledger name is required and must be between 1 and 255 characters')
    .matches(/^[a-zA-Z0-9\s\-_\.]+$/)
    .withMessage('Ledger name can only contain letters, numbers, spaces, hyphens, underscores, and dots'),
  
  body('acgroup')
    .isInt({ min: 1 })
    .withMessage('Group ID must be a valid positive integer'),
  
  body('openingBalance')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Opening balance must be a non-negative number'),
  
  body('balanceType')
    .optional()
    .isIn(['Debit', 'Credit'])
    .withMessage('Balance type must be either Debit or Credit'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer')
];

const validateUpdateLedger = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Ledger ID must be a valid positive integer'),
  
  body('ledgerName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Ledger name must be between 1 and 255 characters')
    .matches(/^[a-zA-Z0-9\s\-_\.]+$/)
    .withMessage('Ledger name can only contain letters, numbers, spaces, hyphens, underscores, and dots'),
  
  body('acgroup')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Group ID must be a valid positive integer'),
  
  body('openingBalance')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Opening balance must be a non-negative number'),
  
  body('balanceType')
    .optional()
    .isIn(['Debit', 'Credit'])
    .withMessage('Balance type must be either Debit or Credit'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
  
  body('status')
    .optional()
    .isIn(['Active', 'Inactive'])
    .withMessage('Status must be either Active or Inactive')
];

const validateGetLedgers = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('groupId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Group ID must be a valid positive integer'),
  
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
  
  query('status')
    .optional()
    .isIn(['Active', 'Inactive'])
    .withMessage('Status must be either Active or Inactive'),
  
  query('isActive')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('isActive must be either true or false'),
  
  query('balanceType')
    .optional()
    .isIn(['Debit', 'Credit'])
    .withMessage('Balance type must be either Debit or Credit')
];

const validateGetLedgerByCompanyId = [
  param('companyId')
    .isInt({ min: 1 })
    .withMessage('Company ID must be a valid positive integer')
];

const validateLedgerId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Ledger ID must be a valid positive integer')
];

const validateUpdateOpeningBalance = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Ledger ID must be a valid positive integer'),
  
  body('openingBalance')
    .isFloat({ min: 0 })
    .withMessage('Opening balance must be a non-negative number'),
  
  body('balanceType')
    .optional()
    .isIn(['Debit', 'Credit'])
    .withMessage('Balance type must be either Debit or Credit')
];

const validateGetLedgerBalance = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Ledger ID must be a valid positive integer'),
  
  query('asOfDate')
    .optional()
    .isISO8601()
    .withMessage('asOfDate must be a valid ISO 8601 date')
];

const validateGetLedgerTransactions = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Ledger ID must be a valid positive integer'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid ISO 8601 date'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid ISO 8601 date'),
  
  query('voucherType')
    .optional()
    .isIn(['Receipt', 'Payment', 'Journal', 'Contra', 'DebitNote', 'CreditNote'])
    .withMessage('Invalid voucher type')
];


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
  validateCreateLedger,
  validateUpdateLedger,
  validateGetLedgers,
  validateGetLedgerByCompanyId,
  validateLedgerId,
  validateUpdateOpeningBalance,
  validateGetLedgerBalance,
  validateGetLedgerTransactions,
  handleValidationErrors
}; 
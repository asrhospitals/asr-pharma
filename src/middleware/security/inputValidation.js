const { body, param, query, validationResult } = require('express-validator');

// Generic validation error handler
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

// Sanitize common fields
const sanitizeCommonFields = [
  body('name').trim().escape(),
  body('email').normalizeEmail(),
  body('phone').trim(),
  body('address').trim().escape(),
  body('description').trim().escape(),
  body('notes').trim().escape()
];

// User registration validation
const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('role')
    .optional()
    .isIn(['admin', 'user', 'manager'])
    .withMessage('Invalid role specified'),
  
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('uname')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('pwd')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Item validation
const validateItem = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Item name is required and must be less than 255 characters'),
  
  body('code')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Item code must be less than 50 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category must be less than 100 characters'),
  
  handleValidationErrors
];

// Company validation
const validateCompany = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Company name is required and must be less than 255 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must be less than 500 characters'),
  
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  
  handleValidationErrors
];

// Bill validation
const validateBill = [
  body('customerName')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Customer name is required and must be less than 255 characters'),
  
  body('customerPhone')
    .optional()
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  
  body('items.*.itemId')
    .isInt({ min: 1 })
    .withMessage('Valid item ID is required'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  
  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('totalAmount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'card', 'upi', 'bank_transfer'])
    .withMessage('Invalid payment method'),
  
  handleValidationErrors
];

// Group validation
const validateGroup = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Group name is required and must be less than 255 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  body('parentGroupId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Parent group ID must be a positive integer'),
  
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean value'),
  
  handleValidationErrors
];

// Ledger validation
const validateLedger = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Ledger name is required and must be less than 255 characters'),
  
  body('groupId')
    .isInt({ min: 1 })
    .withMessage('Valid group ID is required'),
  
  body('openingBalance')
    .optional()
    .isFloat()
    .withMessage('Opening balance must be a number'),
  
  body('balanceType')
    .optional()
    .isIn(['debit', 'credit'])
    .withMessage('Balance type must be either debit or credit'),
  
  body('contactPerson')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Contact person must be less than 255 characters'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must be less than 500 characters'),
  
  handleValidationErrors
];

// Query parameter validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort must be either asc or desc'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term must be less than 100 characters'),
  
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  
  handleValidationErrors
];

// UUID validation
const validateUUID = [
  param('id')
    .isUUID()
    .withMessage('Invalid UUID format'),
  
  handleValidationErrors
];

// File upload validation
const validateFileUpload = [
  body('filename')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Filename must be less than 255 characters'),
  
  body('fileType')
    .optional()
    .isIn(['image', 'document', 'spreadsheet'])
    .withMessage('Invalid file type'),
  
  handleValidationErrors
];

// Email validation
const validateEmail = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  handleValidationErrors
];

// Phone validation
const validatePhone = [
  body('phone')
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  
  handleValidationErrors
];

// URL validation
const validateURL = [
  body('url')
    .isURL()
    .withMessage('Please provide a valid URL'),
  
  handleValidationErrors
];

// Date validation
const validateDate = [
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date in ISO format'),
  
  handleValidationErrors
];

// Price validation
const validatePrice = [
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  handleValidationErrors
];

// Quantity validation
const validateQuantity = [
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  sanitizeCommonFields,
  validateUserRegistration,
  validateUserLogin,
  validateItem,
  validateCompany,
  validateBill,
  validateGroup,
  validateLedger,
  validatePagination,
  validateId,
  validateUUID,
  validateFileUpload,
  validateEmail,
  validatePhone,
  validateURL,
  validateDate,
  validatePrice,
  validateQuantity
};
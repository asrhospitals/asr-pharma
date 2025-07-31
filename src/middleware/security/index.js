const rateLimit = require('express-rate-limit');
const cors = require('cors');
const securityConfig = require('../../config/security');

// Import all security middleware
const {
  helmetConfig,
  customSecurityHeaders,
  corsConfig,
  hppConfig,
  xssConfig,
  validateContentType,
  requestSizeLimiter,
  securityLogger
} = require('./securityHeaders');

const {
  generalLimiter,
  authLimiter,
  adminLimiter,
  salesLimiter,
  speedLimiter,
  bruteForceLimiter
} = require('./rateLimiter');

const {
  verifyToken,
  refreshToken,
  logout,
  checkSession,
  authorizeRole,
  authorizePermission,
  authRateLimit
} = require('./enhancedAuth');

const {
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
} = require('./inputValidation');

// Apply all security middleware
const applySecurityMiddleware = (app, environment = 'development') => {
  const envConfig = securityConfig.environment[environment] || securityConfig.environment.development;

  // 1. Basic Security Headers
  if (envConfig.enableSecurityHeaders) {
    app.use(helmetConfig);
    app.use(customSecurityHeaders);
    app.use(hppConfig);
    app.use(xssConfig);
  }

  // 2. CORS Configuration
  if (envConfig.enableCors) {
    app.use(cors(securityConfig.cors));
  }

  // 3. Request Size Limiting
  app.use(requestSizeLimiter);

  // 4. Content Type Validation
  app.use(validateContentType);

  // 5. Security Logging
  if (securityConfig.logging.enableSecurityLogs) {
    app.use(securityLogger);
  }

  // 6. Rate Limiting
  if (envConfig.enableRateLimit) {
    // Apply general rate limiting to all routes
    app.use(generalLimiter);
    
    // Apply speed limiting
    app.use(speedLimiter);
  }

  console.log(`Security middleware applied for environment: ${environment}`);
};

// Apply rate limiting to specific route groups
const applyRouteSpecificRateLimiting = (app) => {
  // Auth routes with strict rate limiting
  app.use('/pharmacy/auth', authLimiter);
  app.use('/pharmacy/auth', bruteForceLimiter);

  // Admin routes with moderate rate limiting
  app.use('/pharmacy/admin', adminLimiter);

  // Sales routes with moderate rate limiting
  app.use('/pharmacy/sales', salesLimiter);
};

// Security middleware for specific routes
const routeSecurity = {
  // Authentication routes
  auth: {
    rateLimit: authLimiter,
    validation: validateUserLogin,
    security: [verifyToken, checkSession]
  },

  // Admin routes
  admin: {
    rateLimit: adminLimiter,
    security: [verifyToken, checkSession, authorizeRole('admin')]
  },

  // Sales routes
  sales: {
    rateLimit: salesLimiter,
    security: [verifyToken, checkSession]
  },

  // Master data routes
  master: {
    rateLimit: generalLimiter,
    security: [verifyToken, checkSession, authorizeRole('admin', 'manager')]
  },

  // Public routes (no authentication required)
  public: {
    rateLimit: generalLimiter,
    security: []
  }
};

// Utility function to get security middleware for a route type
const getRouteSecurity = (routeType) => {
  return routeSecurity[routeType] || routeSecurity.public;
};

// Enhanced error handling for security-related errors
const securityErrorHandler = (err, req, res, next) => {
  // Handle rate limiting errors
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: err.headers?.['retry-after'] || 60
    });
  }

  // Handle CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      code: 'CORS_ERROR'
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: err.errors
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Handle other security-related errors
  if (err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable',
      code: 'SERVICE_UNAVAILABLE'
    });
  }

  // Log security-related errors
  if (securityConfig.logging.enableSecurityLogs) {
    console.error('[SECURITY ERROR]', {
      error: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    });
  }

  // Pass to next error handler
  next(err);
};

// Security health check endpoint
const securityHealthCheck = (req, res) => {
  const healthStatus = {
    timestamp: new Date().toISOString(),
    security: {
      rateLimiting: true,
      cors: true,
      helmet: true,
      validation: true,
      authentication: true
    },
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  };

  res.json({
    success: true,
    message: 'Security middleware is active',
    data: healthStatus
  });
};

module.exports = {
  // Main security middleware
  applySecurityMiddleware,
  applyRouteSpecificRateLimiting,
  getRouteSecurity,
  securityErrorHandler,
  securityHealthCheck,

  // Rate limiting
  generalLimiter,
  authLimiter,
  adminLimiter,
  salesLimiter,
  speedLimiter,
  bruteForceLimiter,

  // Security headers
  helmetConfig,
  customSecurityHeaders,
  corsConfig,
  hppConfig,
  xssConfig,
  validateContentType,
  requestSizeLimiter,
  securityLogger,

  // Authentication
  verifyToken,
  refreshToken,
  logout,
  checkSession,
  authorizeRole,
  authorizePermission,
  authRateLimit,

  // Input validation
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
  validateQuantity,

  // Route security configurations
  routeSecurity
};
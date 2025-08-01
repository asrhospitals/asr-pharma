const rateLimit = require('express-rate-limit');
const cors = require('cors');
const securityConfig = require('../../config/security');


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


const applySecurityMiddleware = (app, environment = 'development') => {
  const envConfig = securityConfig.environment[environment] || securityConfig.environment.development;


  if (envConfig.enableSecurityHeaders) {
    app.use(helmetConfig);
    app.use(customSecurityHeaders);
    app.use(hppConfig);
    app.use(xssConfig);
  }


  if (envConfig.enableCors) {
    app.use(cors(securityConfig.cors));
  }


  app.use(requestSizeLimiter);


  app.use(validateContentType);


  if (securityConfig.logging.enableSecurityLogs) {
    app.use(securityLogger);
  }


  if (envConfig.enableRateLimit) {

    app.use(generalLimiter);
    

    app.use(speedLimiter);
  }

  console.log(`Security middleware applied for environment: ${environment}`);
};


const applyRouteSpecificRateLimiting = (app) => {

  app.use('/pharmacy/auth', authLimiter);
  app.use('/pharmacy/auth', bruteForceLimiter);


  app.use('/pharmacy/admin', adminLimiter);


  app.use('/pharmacy/sales', salesLimiter);
};


const routeSecurity = {

  auth: {
    rateLimit: authLimiter,
    validation: validateUserLogin,
    security: [verifyToken, checkSession]
  },


  admin: {
    rateLimit: adminLimiter,
    security: [verifyToken, checkSession, authorizeRole('admin')]
  },


  sales: {
    rateLimit: salesLimiter,
    security: [verifyToken, checkSession]
  },


  master: {
    rateLimit: generalLimiter,
    security: [verifyToken, checkSession, authorizeRole('admin', 'manager')]
  },


  public: {
    rateLimit: generalLimiter,
    security: []
  }
};


const getRouteSecurity = (routeType) => {
  return routeSecurity[routeType] || routeSecurity.public;
};


const securityErrorHandler = (err, req, res, next) => {

  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: err.headers?.['retry-after'] || 60
    });
  }


  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      code: 'CORS_ERROR'
    });
  }


  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: err.errors
    });
  }


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


  if (err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable',
      code: 'SERVICE_UNAVAILABLE'
    });
  }


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


  next(err);
};


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

  applySecurityMiddleware,
  applyRouteSpecificRateLimiting,
  getRouteSecurity,
  securityErrorHandler,
  securityHealthCheck,


  generalLimiter,
  authLimiter,
  adminLimiter,
  salesLimiter,
  speedLimiter,
  bruteForceLimiter,


  helmetConfig,
  customSecurityHeaders,
  corsConfig,
  hppConfig,
  xssConfig,
  validateContentType,
  requestSizeLimiter,
  securityLogger,


  verifyToken,
  refreshToken,
  logout,
  checkSession,
  authorizeRole,
  authorizePermission,
  authRateLimit,


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


  routeSecurity
};
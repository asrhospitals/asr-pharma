const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');

// Configure Helmet with security headers
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false, // Set to false for development, true for production
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
});

// Custom security headers middleware
const customSecurityHeaders = (req, res, next) => {
  // Remove server information
  res.removeHeader('X-Powered-By');
  
  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Add request ID for tracking
  res.setHeader('X-Request-ID', req.headers['x-request-id'] || generateRequestId());
  
  // Add cache control headers for sensitive endpoints
  if (req.path.includes('/auth') || req.path.includes('/admin')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
};

// Generate unique request ID
const generateRequestId = () => {
  return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// CORS configuration
const corsConfig = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4173',
      process.env.FRONTEND_URL,
      process.env.ALLOWED_ORIGIN
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Request-ID'
  ],
  exposedHeaders: ['X-Request-ID', 'X-Total-Count'],
  maxAge: 86400 // 24 hours
};

// HPP (HTTP Parameter Pollution) protection
const hppConfig = hpp({
  whitelist: ['filter', 'sort', 'page', 'limit'] // Allow these parameters to be duplicated
});

// XSS protection
const xssConfig = xss();

// Content type validation middleware
const validateContentType = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        success: false,
        message: 'Content-Type must be application/json'
      });
    }
  }
  next();
};

// Request size limiter
const requestSizeLimiter = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (contentLength > maxSize) {
    return res.status(413).json({
      success: false,
      message: 'Request entity too large'
    });
  }
  next();
};

// Security logging middleware
const securityLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log suspicious activities
  const suspiciousPatterns = [
    /\.\.\//, // Directory traversal
    /<script/i, // XSS attempts
    /union\s+select/i, // SQL injection
    /eval\s*\(/i, // Code injection
    /javascript:/i // JavaScript protocol
  ];
  
  const userAgent = req.headers['user-agent'] || '';
  const url = req.url;
  const method = req.method;
  
  // Check for suspicious patterns
  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(url) || pattern.test(userAgent) || pattern.test(JSON.stringify(req.body))
  );
  
  if (isSuspicious) {
    console.warn(`[SECURITY] Suspicious request detected:`, {
      ip: req.ip,
      userAgent,
      url,
      method,
      timestamp: new Date().toISOString()
    });
  }
  
  // Log response time for performance monitoring
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 5000) { // Log slow requests (>5s)
      console.warn(`[PERFORMANCE] Slow request: ${method} ${url} took ${duration}ms`);
    }
  });
  
  next();
};

module.exports = {
  helmetConfig,
  customSecurityHeaders,
  corsConfig,
  hppConfig,
  xssConfig,
  validateContentType,
  requestSizeLimiter,
  securityLogger
};
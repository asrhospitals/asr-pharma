module.exports = {

  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    accessTokenExpiry: 24 * 60 * 60,
    refreshTokenExpiry: 7 * 24 * 60 * 60,
    issuer: 'pharmacy-api',
    audience: 'pharmacy-client',
    algorithm: 'HS256'
  },

  rateLimit: {
    general: {
      windowMs: 15 * 60 * 1000,
      max: 100
    },
    auth: {
      windowMs: 15 * 60 * 1000,
      max: 5
    },
    admin: {
      windowMs: 15 * 60 * 1000,
      max: 50
    },
    sales: {
      windowMs: 15 * 60 * 1000,
      max: 30
    },
    bruteForce: {
      windowMs: 60 * 60 * 1000,
      max: 10
    }
  },


  session: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    maxInactivity: 24 * 60 * 60 * 1000,
    cleanupInterval: 60 * 60 * 1000
  },

  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90 * 24 * 60 * 60 * 1000
  },

  cors: {
    allowedOrigins: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4173',
      'https://pharmacy.asrhospitals.com',
      process.env.FRONTEND_URL,
      process.env.ALLOWED_ORIGIN
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Request-ID',
      'x-company-id'
    ],
    exposedHeaders: ['X-Request-ID', 'X-Total-Count'],
    maxAge: 86400
  },

  headers: {
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
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    permissionsPolicy: 'geolocation=(), microphone=(), camera=()'
  },

  validation: {
    maxStringLength: 255,
    maxTextLength: 1000,
    maxUrlLength: 500,
    maxEmailLength: 254,
    maxPhoneLength: 20,
    maxPrice: 999999.99,
    maxQuantity: 999999
  },

  fileUpload: {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/csv'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.csv'],
    uploadPath: './uploads/',
    scanForViruses: true 
  },

  database: {
    maxConnections: 20,
    connectionTimeout: 30000,
    queryTimeout: 30000,
    enableSSL: process.env.NODE_ENV === 'production',
    enableLogging: process.env.NODE_ENV !== 'production'
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableSecurityLogs: true,
    enableAccessLogs: true,
    enableErrorLogs: true,
    logSuspiciousActivity: true,
    logSlowQueries: true,
    slowQueryThreshold: 5000
  },

  environment: {
    development: {
      enableDetailedErrors: true,
      enableCors: true,
      enableRateLimit: true,
      enableSecurityHeaders: true,
      enableValidation: true
    },
    staging: {
      enableDetailedErrors: false,
      enableCors: true,
      enableRateLimit: true,
      enableSecurityHeaders: true,
      enableValidation: true
    },
    production: {
      enableDetailedErrors: false,
      enableCors: true,
      enableRateLimit: true,
      enableSecurityHeaders: true,
      enableValidation: true,
      enableSSL: true,
      enableCompression: true
    }
  },

  monitoring: {
    enableIntrusionDetection: true,
    enableAnomalyDetection: true,
    enableAuditLogging: true,
    alertThresholds: {
      failedLogins: 5,
      suspiciousRequests: 10,
      slowQueries: 20
    }
  },

  api: {
    version: 'v1',
    enableVersioning: true,
    enableDeprecationWarnings: true,
    maxRequestSize: '10mb',
    enableRequestLogging: true,
    enableResponseLogging: false
  }
};